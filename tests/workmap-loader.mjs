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
      else throw Error("Unexpected prompt " + id);
      return schema.parse(result);
    },
    aiConfigured: () => true,
  };
}
