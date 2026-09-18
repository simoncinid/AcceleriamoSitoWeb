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
import { sendWorkMapEmail } from "./email";
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
  if (normalized.length !== 5) return null;
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
    { profile: s.profile, workflows: s.drafts },
    true,
  );
export const generatePlan = (s: Session) =>
  structured("plan-generator", planSchema, {
    profile: s.profile,
    workflows: s.drafts,
    assistants: s.content?.assistants,
  });
type WorkMapContent = z.infer<typeof contentSchema>;
const PROMPT_SECTIONS = [
  "RUOLO",
  "OBIETTIVO",
  "CONTESTO",
  "INPUT",
  "VINCOLI",
  "PROCESSO",
  "OUTPUT",
  "CONTROLLO",
] as const;
const PROCEDURE_FALLBACK = [
  "Rimuovi dati personali e riservati.",
  "Incolla solo il materiale autorizzato.",
  "Confronta il risultato con le fonti prima di usarlo.",
];
const COMPACT_MASTER_PROMPT = `RUOLO
Assistente operativo
OBIETTIVO
Produrre una bozza utile dal materiale fornito
CONTESTO
[CONTESTO]
INPUT
[DATI]
VINCOLI
Non inventare. Usa solo i dati forniti.
PROCESSO
Organizza, sintetizza e verifica
OUTPUT
Bozza da revisionare
CONTROLLO
Segnala dati mancanti o incerti`;

function clip(value: string, max = 900) {
  return value.slice(0, max);
}
function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
function clipList(value: unknown, fallback: string[], maxItems = 5) {
  const items = (Array.isArray(value) ? value : fallback)
    .map((item) => clip(String(item ?? "").trim()))
    .filter(Boolean);
  return (items.length ? items : fallback).slice(0, maxItems);
}
function ensureProcedure(value: unknown) {
  const items = clipList(value, PROCEDURE_FALLBACK);
  while (items.length < 3)
    items.push(PROCEDURE_FALLBACK[items.length] || PROCEDURE_FALLBACK[0]);
  return items.slice(0, 4);
}
function ensureMasterPrompt(prompt: string) {
  const fill = (base: string) => {
    let result = base.trim() || "Prompt operativo.";
    for (const section of PROMPT_SECTIONS) {
      if (!result.toUpperCase().includes(section))
        result += `\n${section}\nUsa solo i dati forniti. Non inventare.`;
    }
    return result;
  };
  const result = fill(prompt);
  return clip(
    result.length <= 1800 ? result : fill(COMPACT_MASTER_PROMPT),
    1800,
  );
}
function repairWorkflow(raw: unknown, id: string, title: string) {
  const workflow = asRecord(raw);
  return workflowSchema.parse({
    id,
    title: clip(String(workflow.title || title)),
    relevance: clip(
      String(workflow.relevance || "Utile per il tuo lavoro quotidiano."),
    ),
    whenToUse: clip(
      String(workflow.whenToUse || "Quando l’attività si ripete."),
    ),
    requiredInputs: clipList(workflow.requiredInputs, ["Materiale anonimizzato"], 3),
    tool: clip(
      String(workflow.tool || "Strumento AI approvato dall’azienda"),
    ),
    procedure: ensureProcedure(workflow.procedure),
    masterPrompt: ensureMasterPrompt(String(workflow.masterPrompt || "")),
    reviewPrompt: clip(
      String(
        workflow.reviewPrompt ||
          "Verifica nomi, numeri, date, fonti e tono. Segnala i problemi prima di correggere.",
      ),
      500,
    ),
    example: clip(
      String(
        workflow.example ||
          "Esempio ipotetico: usa dati fittizi e confronta il risultato.",
      ),
    ),
    output: clip(String(workflow.output || "Bozza da revisionare")),
    checklist: clipList(workflow.checklist, [
      "Fonti controllate",
      "Dati verificati",
    ], 3),
    humanReview: clip(
      String(workflow.humanReview || "Verifica ogni output prima di usarlo."),
    ),
    commonErrors: clipList(workflow.commonErrors, [
      "Usare informazioni non confermate",
    ], 3),
    privacy: clip(
      String(
        workflow.privacy ||
          "Rimuovi dati personali e riservati prima di usare lo strumento.",
      ),
    ),
  });
}
function repairAssistants(raw: unknown): WorkMapContent["assistants"] {
  const incoming = Array.isArray(raw) ? raw : [];
  const names = ["Assistente operativo", "Assistente di revisione"];
  return [0, 1].map((index) => {
    const assistant = asRecord(incoming[index]);
    return {
      name: clip(String(assistant.name || names[index])),
      purpose: clip(
        String(assistant.purpose || "Preparare bozze dai dati forniti"),
      ),
      whenToUse: clip(
        String(assistant.whenToUse || "Quando prepari un lavoro ripetitivo"),
      ),
      requiredInputs: clipList(assistant.requiredInputs, ["Materiale anonimizzato"], 3),
      systemPrompt: clip(
        String(
          assistant.systemPrompt ||
            "Usa solo i dati forniti. Non inventare. Chiedi una revisione umana.",
        ),
        1400,
      ),
      starterPrompts: clipList(assistant.starterPrompts, [
        "Prepara una bozza dal testo che ti incollo",
      ], 2),
      rules: clipList(assistant.rules, [
        "Non inventare dati",
        "Segnala ciò che manca",
      ], 3),
      limitations: clipList(assistant.limitations, [
        "Nessun accesso a sistemi esterni",
      ], 2),
      humanReview: clip(
        String(assistant.humanReview || "Controlla ogni output prima dell’uso."),
      ),
    };
  });
}
function repairWeeks(raw: unknown): WorkMapContent["weeks"] {
  const incoming = Array.isArray(raw) ? raw : [];
  const goals = [
    "Prova il primo workflow su un caso fittizio",
    "Applica un secondo workflow al lavoro reale",
    "Usa il primo assistente su un’attività ripetitiva",
    "Rivedi cosa funziona e cosa va corretto",
  ];
  return [1, 2, 3, 4].map((week) => {
    const current =
      incoming.find((item) => asRecord(item).week === week) ||
      incoming[week - 1];
    const parsed = asRecord(current);
    return {
      week,
      goal: clip(String(parsed.goal || goals[week - 1])),
      actions: clipList(parsed.actions, [
        "Scegli un caso senza dati riservati",
        "Confronta il risultato con le fonti",
      ], 2),
      successCheck: clip(
        String(
          parsed.successCheck ||
            "Il risultato è utilizzabile dopo una revisione umana",
        ),
      ),
    };
  });
}
export function repairWorkMapContent(
  s: Session,
  raw: unknown,
): WorkMapContent {
  const selected = s.selection?.workflows;
  if (!selected?.length)
    throw Error(
      "Non sono riuscito a completare il controllo finale. Riprova dal punto salvato.",
    );
  const source = asRecord(raw);
  const incoming = Array.isArray(source.workflows)
    ? source.workflows
    : s.drafts;
  return contentSchema.parse({
    workflows: selected.map((picked, index) => {
      const match =
        incoming.find((item) => asRecord(item).id === picked.id) ||
        incoming[index] ||
        s.drafts[index];
      return repairWorkflow(
        match,
        picked.id,
        catalog.find((entry) => entry.id === picked.id)?.title ||
          String(asRecord(match).title || picked.id),
      );
    }),
    assistants: repairAssistants(source.assistants),
    weeks: repairWeeks(source.weeks),
    finalChecklist: clipList(source.finalChecklist, [
      "Verifica fonti, nomi, date e numeri",
    ], 5),
    privacy: clipList(source.privacy, [
      "Anonimizza i dati prima di usare lo strumento",
    ], 4),
    tools: clipList(source.tools, ["Strumento AI approvato dall’azienda"], 3),
  });
}

function generationErrorMessage(error: unknown) {
  if (isTransientAIError(error))
    return "Il servizio AI ha impiegato troppo tempo. Stiamo riprovando dal punto salvato.";
  if (error instanceof z.ZodError)
    return "Il contenuto ricevuto non è valido. Puoi riprovare dal punto salvato.";
  if (error instanceof Error) {
    if (/[\u0000-\u007F]/.test(error.message) && !/[àèéìòù]/i.test(error.message))
      return "Generazione interrotta. Riprova dal punto salvato.";
    return error.message;
  }
  return "Generazione interrotta. Riprova dal punto salvato.";
}

export async function reviewWorkMap(
  s: Session,
  options?: { skipModel?: boolean },
) {
  const baseline = repairWorkMapContent(s, s.content);
  if (options?.skipModel) return baseline;
  try {
    const reviewed = await structured(
      "quality-reviewer",
      contentSchema,
      {
        profile: s.profile,
        selected: s.selection,
        content: baseline,
      },
      true,
    );
    return repairWorkMapContent(s, reviewed);
  } catch {
    return baseline;
  }
}
export const generateFinalContent = (s: Session) =>
  repairWorkMapContent(s, s.content);
export async function runGenerationStep(
  id: string,
  runId?: string,
  options?: { skipModelReview?: boolean },
) {
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
          s.content = await reviewWorkMap(s, {
            skipModel: options?.skipModelReview,
          });
          s.job.step = 6;
          break;
        case 6:
          generateFinalContent(s);
          s.pdf = (await renderPdf(s)).toString("base64");
          try {
            await sendWorkMapEmail(s, "ready");
          } catch (error) {
            console.error(
              "workmap-email-failed",
              "ready",
              error instanceof Error ? error.message : "unknown",
            );
          }
          if (s.mail.ready)
            s.mailErrors = s.mailErrors.filter((kind) => kind !== "ready");
          else if (!s.mailErrors.includes("ready")) s.mailErrors.push("ready");
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
