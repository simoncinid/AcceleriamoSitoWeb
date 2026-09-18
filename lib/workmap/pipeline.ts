import { isTransientAIError, structured } from "./ai";
import { catalog } from "./catalog";
import { z } from "zod";
import {
  taskSchema,
  selectionSchema,
  workflowSchema,
  assistantsSchema,
  planSchema,
  contentSchema,
  type Selection,
  type Session,
} from "./schema";
import { renderPdf } from "./pdf";
import { claimLease, releaseLease, getSession, saveSession } from "./store";

const catalogIds = new Set(catalog.map((entry) => entry.id));

function normalizeSelectionWorkflows(
  workflows: Selection["workflows"],
  requiredCount?: number,
) {
  const seen = new Set<string>();
  const normalized: Selection["workflows"] = [];
  for (const workflow of workflows) {
    if (!catalogIds.has(workflow.id) || seen.has(workflow.id)) continue;
    seen.add(workflow.id);
    normalized.push(workflow);
  }
  if (requiredCount !== undefined && normalized.length !== requiredCount)
    return null;
  if (normalized.length < 10 || normalized.length > 15) return null;
  return normalized;
}

export const analyzeTasks = (s: Session) =>
  structured("task-analyzer", taskSchema, { profile: s.profile });
export async function selectWorkflows(s: Session) {
  const requiredCount = s.selection?.workflows.length;
  const selectionError =
    "Non sono riuscito a completare la scelta automatica dei workflow. Riprova dal punto salvato.";
  for (let attempt = 0; attempt < 3; attempt++) {
    const selection = await structured("workflow-selector", selectionSchema, {
      profile: s.profile,
      analysis: s.analysis,
      catalog,
      requiredCount,
    });
    const workflows = normalizeSelectionWorkflows(
      selection.workflows,
      requiredCount,
    );
    if (workflows) return { ...selection, workflows };
  }
  throw Error(selectionError);
}
export async function personalizeWorkflow(s: Session, index: number) {
  const picked = s.selection!.workflows[index];
  const base = catalog.find((entry) => entry.id === picked.id);
  if (!base)
    throw Error(
      "Non sono riuscito a personalizzare un workflow. Riprova dal punto salvato.",
    );
  const workflow = await structured(
    "workflow-personalizer",
    workflowSchema,
    {
      profile: s.profile,
      workflow: base,
      reason: picked.reason,
    },
    true,
  );
  return { ...workflow, id: picked.id, title: base.title };
}
export const generateAssistants = (s: Session) =>
  structured(
    "assistant-generator",
    assistantsSchema,
    { profile: s.profile, workflows: s.drafts.slice(0, 5) },
    true,
  );
export const generatePlan = (s: Session) =>
  structured("plan-generator", planSchema, {
    profile: s.profile,
    workflows: s.drafts,
    assistants: s.content?.assistants,
  });
type WorkMapContent = z.infer<typeof contentSchema>;

function alignWorkflowIds(s: Session, content: WorkMapContent): WorkMapContent {
  const selected = s.selection!.workflows;
  if (content.workflows.length !== selected.length) return content;
  return {
    ...content,
    workflows: content.workflows.map((workflow, index) => ({
      ...workflow,
      id: selected[index].id,
      title:
        catalog.find((entry) => entry.id === selected[index].id)?.title ??
        workflow.title,
    })),
  };
}

function assertWorkMapContent(s: Session, content: WorkMapContent) {
  const ids = content.workflows.map((w) => w.id);
  if (
    new Set(ids).size !== ids.length ||
    ids.length !== s.selection!.workflows.length ||
    s.selection!.workflows.some((w) => !ids.includes(w.id))
  )
    throw Error(
      "Non sono riuscito a completare il controllo finale. Riprova dal punto salvato.",
    );
  for (const w of content.workflows) {
    if (
      ![
        "RUOLO",
        "OBIETTIVO",
        "CONTESTO",
        "INPUT",
        "VINCOLI",
        "PROCESSO",
        "OUTPUT",
        "CONTROLLO",
      ].every((k) => w.masterPrompt.includes(k)) ||
      !w.humanReview ||
      !w.privacy ||
      w.procedure.length < 3
    )
      throw Error(
        "Il documento non supera i controlli minimi. Riprova dal punto salvato.",
      );
  }
  if (new Set(content.weeks.map((w) => w.week)).size !== 4)
    throw Error(
      "Il piano di 30 giorni non è completo. Riprova dal punto salvato.",
    );
}

function generationErrorMessage(error: unknown) {
  if (isTransientAIError(error))
    return "Il servizio AI ha impiegato troppo tempo. Stiamo riprovando dal punto salvato.";
  if (error instanceof Error) {
    if (error.name === "ZodError")
      return "Il contenuto ricevuto non è valido. Puoi riprovare dal punto salvato.";
    if (/[\u0000-\u007F]/.test(error.message) && !/[àèéìòù]/i.test(error.message))
      return "Generazione interrotta. Riprova dal punto salvato.";
    return error.message;
  }
  return "Generazione interrotta. Riprova dal punto salvato.";
}

export async function reviewWorkMap(s: Session) {
  const baseline = alignWorkflowIds(s, contentSchema.parse(s.content));
  try {
    const reviewed = await structured(
      "quality-reviewer",
      contentSchema,
      {
        profile: s.profile,
        selected: s.selection,
        content: s.content,
      },
      true,
    );
    const content = alignWorkflowIds(s, reviewed);
    assertWorkMapContent(s, content);
    return content;
  } catch (error) {
    try {
      assertWorkMapContent(s, baseline);
      return baseline;
    } catch {
      throw error;
    }
  }
}
export const generateFinalContent = (s: Session) =>
  contentSchema.parse(s.content);
export async function runGenerationStep(id: string, runId?: string) {
  const lease = await claimLease(id);
  if (!lease) return false;
  try {
    const s = await getSession(id);
    if (
      !s?.confirmed || !s.email ||
      !s.job ||
      (runId && s.job.runId !== runId) ||
      !["generating", "reviewing", ...(runId ? ["failed"] : [])].includes(s.state)
    )
      return false;
    if(s.state === "failed") {
      if(s.job.attempts >= 5) return false;
      s.state=s.job.step===5?"reviewing":"generating";
    }
    try {
      switch (s.job.step) {
        case 0:
          s.analysis = await analyzeTasks(s);
          s.job.step = 1;
          break;
        case 1:
          s.selection = await selectWorkflows(s);
          s.job.step = 2;
          break;
        case 2: {
          const workflow = await personalizeWorkflow(s, s.job.cursor);
          s.drafts.push(workflow);
          s.job.cursor++;
          if (s.job.cursor === s.selection!.workflows.length) s.job.step = 3;
          break;
        }
        case 3:
          s.content = {
            workflows: s.drafts,
            ...(await generateAssistants(s)),
            weeks: [],
            finalChecklist: [],
            privacy: [],
            tools: [],
          };
          s.job.step = 4;
          break;
        case 4:
          s.content = { ...s.content!, ...(await generatePlan(s)) };
          s.job.step = 5;
          s.state = "reviewing";
          break;
        case 5:
          s.content = await reviewWorkMap(s);
          s.job.step = 6;
          break;
        case 6:
          generateFinalContent(s);
          s.pdf = (await renderPdf(s)).toString("base64");
          s.state = "ready";
          s.job.step = 7;
          break;
      }
      s.job.error = undefined;
      s.job.updatedAt = new Date().toISOString();
      await saveSession(s, s.version);
    } catch (error) {
      s.job.error = generationErrorMessage(error);
      s.job.updatedAt = new Date().toISOString();
      if (isTransientAIError(error)) {
        await saveSession(s, s.version);
      } else {
        s.state = "failed";
        s.job.attempts++;
        await saveSession(s, s.version);
      }
    }
    return true;
  } finally {
    await releaseLease(id, lease);
  }
}
