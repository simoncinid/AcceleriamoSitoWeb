import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
export function modules({
  env = {},
  globals = {},
  overrides = {},
  fetch = globalThis.fetch,
} = {}) {
  const cache = new Map();
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file);
    const source = ts.transpileModule(readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText;
    const exports = {};
    cache.set(file, exports);
    vm.runInNewContext(
      source,
      {
        exports,
        require: (name) => {
          if (name in overrides) return overrides[name];
          if (name.startsWith("@/") || name.startsWith(".")) {
            let resolved = name.startsWith("@/")
              ? path.resolve(name.slice(2))
              : path.resolve(path.dirname(file), name);
            try {
              return load(resolved + ".ts");
            } catch (e) {
              if (e.code !== "ENOENT") throw e;
              return load(path.join(resolved, "index.ts"));
            }
          }
          return require(name);
        },
        process: { env, cwd: () => process.cwd() },
        fetch,
        Buffer,
        URL,
        URLSearchParams,
        Request,
        Response,
        AbortSignal,
        Date,
        console,
        JSON,
        setTimeout,
        clearTimeout,
        TextEncoder,
        TextDecoder,
        AbortController,
        ReadableStream,
        structuredClone,
        ...globals,
      },
      { filename: file },
    );
    return exports;
  }
  return load;
}
export function fakeAI(catalog) {
  let fail = false;
  function workflow(w) {
    return {
      id: w.id,
      title: w.title,
      relevance: "Per il tuo lavoro commerciale e i report settimanali.",
      whenToUse: "Quando arrivano gli aggiornamenti.",
      requiredInputs: w.requiredInputs,
      tool: "Strumento AI approvato dall’azienda",
      procedure: [
        "Anonimizza i dati.",
        "Incolla il materiale autorizzato.",
        "Controlla la bozza con le fonti.",
      ],
      masterPrompt:
        "RUOLO\nAssistente operativo\nOBIETTIVO\nOrganizza il lavoro\nCONTESTO\n[CONTESTO]\nINPUT\n[DATI]\nVINCOLI\nNon inventare\nPROCESSO\nOrdina e verifica\nOUTPUT\nTabella\nCONTROLLO\nSegnala dati mancanti",
      reviewPrompt: "Verifica nomi, numeri, date e fonti. Segnala i problemi.",
      example: "Esempio ipotetico: tre aggiornamenti fittizi da confrontare.",
      output: w.outputType,
      checklist: ["Fonti controllate", "Numeri verificati"],
      humanReview: "Il responsabile verifica ogni dato prima dell’invio.",
      commonErrors: ["Usare informazioni non confermate"],
      privacy: "Rimuovi i dati personali prima di utilizzare lo strumento.",
    };
  }
  return {
    failNext() {
      fail = true;
    },
    workflow,
    async structured(id, schema, input) {
      if (fail) {
        fail = false;
        throw Error("Timeout provider simulato");
      }
      let result;
      if (id === "profile-extractor") {
        result = structuredClone(input.profile);
        const q = input.question;
        if (q.id === "role" && input.answer.includes("12 agenti"))
          Object.assign(result, {
            role: "Responsabile commerciale",
            companyType: "PMI",
            teamContext: "Rete commerciale",
            teamSize: "12",
          });
        else if (q.id === "correction") result.role = input.answer;
        else
          result[q.field] = Array.isArray(result[q.field])
            ? input.answer.split("; ")
            : input.answer;
      } else if (id === "next-question") {
        result = {
          ...input.candidate,
          options: input.profile.role.toLowerCase().includes("recruit")
            ? ["Colloqui", "Annunci", "Onboarding"]
            : ["Report agenti", "Follow-up clienti", "Offerte"],
        };
      } else if (id === "followup-decider")
        result = {
          question: "Gli aggiornamenti arrivano nello stesso formato?",
          insight:
            "Puoi uniformare gli aggiornamenti prima di preparare il report.",
        };
      else if (id === "task-analyzer") result = { tasks: [] };
      else if (id === "workflow-selector")
        result = {
          workflows: catalog.slice(0, 12).map((w) => ({
            id: w.id,
            reason: "Organizza le informazioni del tuo lavoro commerciale.",
            priority: "Priorità alta",
            difficulty: "Semplice",
          })),
          notRecommended:
            "Non partirei dai contenuti social: i report sono la tua priorità.",
        };
      else if (id === "workflow-personalizer")
        result = workflow(input.workflow);
      else if (id === "assistant-generator")
        result = {
          assistants: ["Report", "Follow-up", "Offerte"].map((name) => ({
            name,
            purpose: "Preparare bozze dai dati forniti",
            whenToUse: "Quando prepari il lavoro",
            requiredInputs: ["Dati anonimizzati"],
            systemPrompt:
              "Usa solo i dati forniti. Chiedi una revisione umana.",
            starterPrompts: ["Prepara una bozza"],
            rules: ["Non inventare"],
            limitations: ["Nessun accesso al CRM"],
            humanReview: "Controlla la bozza",
          })),
        };
      else if (id === "plan-generator")
        result = {
          weeks: [1, 2, 3, 4].map((week) => ({
            week,
            goal: "Applicare un workflow",
            actions: ["Prova su un caso fittizio"],
            successCheck: "Confronta con le fonti",
          })),
          finalChecklist: ["Verifica fonti e dati"],
          privacy: ["Anonimizza"],
          tools: ["Strumento AI approvato dall’azienda"],
        };
      else if (id === "quality-reviewer") result = input.content;
      else if (id === "conversation-turn") {
        const profile = structuredClone(input.profile);
        const q = input.question;
        const answer = String(input.answer || "").trim();
        const phase = input.phase;
        if (phase === "edit" || q?.id === "correction") {
          profile.role = answer;
          result = {
            message: "Ok, ho aggiornato il profilo.",
            profile,
            complete: true,
            insight: "",
            field: "role",
            kind: "text",
            options: [],
          };
        } else if (!answer || /^(ciao|salve|hey|hi|hello)\b/i.test(answer)) {
          result = {
            message:
              "Dimmi che lavoro fai: il ruolo o la professione. Anche due parole.",
            profile,
            complete: false,
            insight: "",
            field: "role",
            kind: "text",
            options: ["Commerciale", "Recruiter", "Consulente", "Imprenditore"],
          };
        } else {
          if (q?.id !== "followup" && q?.field) {
            if (q.id === "role" && answer.includes("12 agenti"))
              Object.assign(profile, {
                role: "Responsabile commerciale",
                companyType: "PMI",
                teamContext: "Rete commerciale",
                teamSize: "12",
              });
            else if (Array.isArray(profile[q.field]))
              profile[q.field] = answer.split("; ").filter(Boolean);
            else profile[q.field] = answer;
          }
          const recruit = profile.role.toLowerCase().includes("recruit");
          const tasks = recruit
            ? ["Colloqui", "Annunci", "Onboarding"]
            : ["Report agenti", "Follow-up clienti", "Offerte"];
          let next;
          if (phase === "details") {
            if (!profile.name)
              next = {
                field: "name",
                kind: "text",
                options: [],
                message: "Come ti chiami?",
              };
            else if (!profile.companyType)
              next = {
                field: "companyType",
                kind: "single",
                options: [
                  "Freelance",
                  "Studio professionale",
                  "PMI",
                  "Grande azienda",
                ],
                message: "In quale contesto lavori?",
              };
            else if (!profile.toolsUsed.length)
              next = {
                field: "toolsUsed",
                kind: "multi",
                options: ["Excel", "Google Workspace", "Microsoft 365", "CRM"],
                message: "Quali software usi ogni giorno?",
              };
            else if (!profile.documentsUsed.length)
              next = {
                field: "documentsUsed",
                kind: "multi",
                options: ["Email", "PDF", "Report", "Offerte"],
                message: "Quali documenti produci più spesso?",
              };
            else if (!profile.privacyConsiderations.length)
              next = {
                field: "privacyConsiderations",
                kind: "multi",
                options: [
                  "Dati personali dei clienti",
                  "Informazioni aziendali riservate",
                  "Documenti pubblici",
                ],
                message: "Quale attenzione richiedono i tuoi documenti?",
              };
          } else if (!profile.role)
            next = {
              field: "role",
              kind: "text",
              options: tasks,
              message: "Che lavoro fai?",
            };
          else if (!profile.mainTasks.length)
            next = {
              field: "mainTasks",
              kind: "multi",
              options: tasks,
              message: "Di cosa ti occupi ogni giorno?",
            };
          else if (!profile.timeConsumingTasks.length)
            next = {
              field: "timeConsumingTasks",
              kind: "multi",
              options: tasks,
              message: "Quali attività ti portano via più tempo?",
            };
          else if (!profile.repetitiveTasks.length)
            next = {
              field: "repetitiveTasks",
              kind: "text",
              options: [],
              message:
                "C’è un’attività ripetitiva che vorresti smettere di fare a mano?",
            };
          else if (!input.followupUsed && q?.id !== "followup")
            next = {
              field: "repetitiveTasks",
              kind: "text",
              options: [],
              message: "Gli aggiornamenti arrivano nello stesso formato?",
              insight:
                "Puoi uniformare gli aggiornamenti prima di preparare il report.",
            };
          else if (!profile.aiLevel)
            next = {
              field: "aiLevel",
              kind: "single",
              options: [
                "Mai",
                "Li ho provati",
                "Ogni tanto",
                "Quasi ogni giorno",
                "In maniera avanzata",
              ],
              message: "Quanto usi già strumenti AI?",
            };
          result = next
            ? {
                message: next.message,
                profile,
                complete: false,
                insight: next.insight || "",
                field: next.field,
                kind: next.kind,
                options: next.options,
              }
            : {
                message: "Ho abbastanza per un’analisi concreta.",
                profile,
                complete: true,
                insight: "",
                field: "aiLevel",
                kind: "text",
                options: [],
              };
        }
      }
      return schema.parse(result);
    },
    aiConfigured: () => true,
  };
}
