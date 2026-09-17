import { structured } from "./ai";
import { catalog } from "./catalog";
import {
  taskSchema,
  selectionSchema,
  workflowSchema,
  assistantsSchema,
  planSchema,
  contentSchema,
  type Session,
} from "./schema";
import { renderPdf } from "./pdf";
import { claimLease, releaseLease, getSession, saveSession } from "./store";
export const analyzeTasks = (s: Session) =>
  structured("task-analyzer", taskSchema, { profile: s.profile });
export async function selectWorkflows(s: Session) {
  const selection = await structured("workflow-selector", selectionSchema, {
    profile: s.profile,
    analysis: s.analysis,
    catalog,
    requiredCount: s.order?.paidAt ? s.selection?.workflows.length : undefined,
  });
  if (
    s.order?.paidAt &&
    s.selection &&
    selection.workflows.length !== s.selection.workflows.length
  )
    throw Error("La selezione deve conservare il numero di workflow previsto.");
  if (
    new Set(selection.workflows.map((w) => w.id)).size !==
      selection.workflows.length ||
    selection.workflows.some((w) => !catalog.some((c) => c.id === w.id))
  )
    throw Error("Selezione non valida. Riprova.");
  return selection;
}
export const personalizeWorkflow = (s: Session, index: number) =>
  structured(
    "workflow-personalizer",
    workflowSchema,
    {
      profile: s.profile,
      workflow: catalog.find((c) => c.id === s.selection!.workflows[index].id),
      reason: s.selection!.workflows[index].reason,
    },
    true,
  );
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
export async function reviewWorkMap(s: Session) {
  const content = await structured("quality-reviewer", contentSchema, {
    profile: s.profile,
    selected: s.selection,
    content: s.content,
  });
  const ids = content.workflows.map((w) => w.id);
  if (
    new Set(ids).size !== ids.length ||
    ids.length !== s.selection!.workflows.length ||
    s.selection!.workflows.some((w) => !ids.includes(w.id))
  )
    throw Error("Controllo qualità: workflow non coerenti.");
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
      throw Error("Controllo qualità: procedura incompleta.");
  }
  if (new Set(content.weeks.map((w) => w.week)).size !== 4)
    throw Error("Controllo qualità: piano incompleto.");
  return content;
}
export const generateFinalContent = (s: Session) =>
  contentSchema.parse(s.content);
export async function runGenerationStep(id: string, runId?: string) {
  const lease = await claimLease(id);
  if (!lease) return false;
  try {
    const s = await getSession(id);
    if (
      !s?.order?.paidAt ||
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
          if (workflow.id !== s.selection!.workflows[s.job.cursor].id)
            throw Error("Workflow non coerente con la selezione.");
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
      s.state = "failed";
      s.job.attempts++;
      s.job.error =
        error instanceof Error && !(error.name === "ZodError")
          ? error.message
          : "Il contenuto ricevuto non è valido. Puoi riprovare dal punto salvato.";
      s.job.updatedAt = new Date().toISOString();
      await saveSession(s, s.version);
    }
    return true;
  } finally {
    await releaseLease(id, lease);
  }
}
