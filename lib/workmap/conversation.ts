import { z } from "zod";
import { structured } from "./ai";
import { categories } from "./config";
import {
  profileSchema,
  questionSchema,
  type Profile,
  type Question,
  type Session,
} from "./schema";
export const initialQuestion: Question = {
  id: "role",
  field: "role",
  kind: "text",
  options: [],
  text: "Ciao. In circa 90 secondi cercherò di capire dove l’AI può essere più utile nel tuo lavoro. Partiamo dalla cosa più importante: che lavoro fai?",
};
const q = (
  field: keyof Profile,
  text: string,
  kind: Question["kind"] = "text",
  options: string[] = [],
): Question => ({ id: field, field, text, kind, options });
const free = [
  initialQuestion,
  q(
    "mainTasks",
    "Perfetto. Adesso vediamo dove passa il tuo tempo. Di cosa ti occupi ogni giorno?",
    "multi",
    categories,
  ),
  q(
    "timeConsumingTasks",
    "Quali sono le 3 attività che ti portano via più tempo?",
    "multi",
    categories,
  ),
  q(
    "repetitiveTasks",
    "C’è un’attività ripetitiva che vorresti smettere di fare manualmente?",
  ),
  q("aiLevel", "Quanto usi già strumenti AI?", "single", [
    "Mai",
    "Li ho provati",
    "Ogni tanto",
    "Quasi ogni giorno",
    "In maniera avanzata",
  ]),
];
const premium = [
  q("name", "Come ti chiami? Anche il solo nome va bene."),
  q("industry", "In quale settore lavori?", "single", [
    "Servizi professionali",
    "Commercio",
    "Industria",
    "Immobiliare",
    "Tecnologia",
    "Altro",
  ]),
  q(
    "company",
    "Come vuoi indicare la tua attività? Puoi usare un nome generico.",
  ),
  q("companyType", "In quale contesto lavori?", "single", [
    "Freelance",
    "Studio professionale",
    "PMI",
    "Grande azienda",
    "Pubblica amministrazione",
  ]),
  q("clients", "Con quali tipi di clienti lavori?", "multi", [
    "Privati",
    "Piccole imprese",
    "Grandi aziende",
    "Colleghi interni",
    "Enti pubblici",
  ]),
  q("teamSize", "Quante persone sono coinvolte nel tuo lavoro?", "single", [
    "Solo io",
    "2–5",
    "6–15",
    "16–50",
    "Più di 50",
  ]),
  q("toolsUsed", "Quali software usi ogni giorno?", "multi", [
    "Excel",
    "Google Workspace",
    "Microsoft 365",
    "CRM",
    "Gestionale",
    "Nessuno",
  ]),
  q("aiToolsUsed", "Quali strumenti AI hai già a disposizione?", "multi", [
    "ChatGPT",
    "Claude",
    "Gemini",
    "Copilot",
    "Nessuno",
  ]),
  q("documentsUsed", "Quali documenti o file produci più spesso?", "multi", [
    "Email",
    "PDF",
    "Report",
    "Offerte",
    "Fogli Excel",
    "Presentazioni",
  ]),
  q(
    "typicalWeek",
    "Descrivimi brevemente una tua giornata o settimana tipo. Bastano poche parole.",
  ),
  q(
    "eliminateTasks",
    "Se potessi eliminare tre attività ripetitive, quali sceglieresti?",
    "multi",
    categories,
  ),
  q("desiredOutcomes", "Qual è il risultato più utile per te?", "multi", [
    "Meno tempo su attività ripetitive",
    "Meno errori",
    "Risposte più chiare",
    "Informazioni più ordinate",
  ]),
  q("constraints", "Ci sono vincoli da rispettare?", "multi", [
    "Solo strumenti gratuiti",
    "Software approvati dall’azienda",
    "Nessuna integrazione tecnica",
    "Nessun vincolo particolare",
  ]),
  q(
    "privacyConsiderations",
    "Quale attenzione richiedono i tuoi documenti? Non inserire dati reali.",
    "multi",
    [
      "Dati personali dei clienti",
      "Informazioni aziendali riservate",
      "Documenti pubblici",
      "Non so: preferisco anonimizzare",
    ],
  ),
];
export function nextCandidate(s: Session): Question | null {
  return (
    (s.order?.paidAt ? [...free, ...premium] : free).find(
      (question) =>
        !s.answered.includes(question.id) && !s.profile[question.field].length,
    ) ?? null
  );
}
export const extractProfile = (s: Session, answer: string) =>
  structured("profile-extractor", profileSchema, {
    profile: s.profile,
    question: s.question,
    answer,
  });
export async function decideNextQuestion(s: Session) {
  const candidate = nextCandidate(s);
  if (!candidate) return null;
  if (
    candidate.kind === "multi" &&
    ["mainTasks", "timeConsumingTasks", "eliminateTasks"].includes(
      candidate.field,
    )
  ) {
    const personalized = await structured("next-question", questionSchema, {
      profile: s.profile,
      candidate,
    });
    return {
      ...personalized,
      id: candidate.id,
      field: candidate.field,
      kind: candidate.kind,
    };
  }
  return candidate;
}
export async function answerConversation(s: Session, answer: string) {
  if (!s.question)
    throw new Error("Questa fase della conversazione è già conclusa.");
  const question = s.question;
  const profile = await extractProfile(s, answer);
  // Explicit answers cannot be lost when an extractor returns an empty field.
  if (!profile[question.field].length && question.id !== "followup") {
    const shape = profileSchema.shape[question.field];
    Object.assign(profile, {
      [question.field]: shape instanceof z.ZodArray ? [answer] : answer,
    });
  }
  s.profile = profile;
  s.answered.push(question.id);
  s.messages.push({ role: "user", text: answer });
  if (question.field === "repetitiveTasks" && !s.followupUsed) {
    const follow = await structured(
      "followup-decider",
      z.object({ question: z.string().max(350), insight: z.string().max(700) }),
      { profile },
    );
    s.followupUsed = true;
    s.insight = follow.insight;
    if (follow.question) {
      s.question = {
        id: "followup",
        field: "repetitiveTasks",
        kind: "text",
        options: [],
        text: follow.question,
      };
      s.messages.push({ role: "assistant", text: follow.question });
      return;
    }
  }
  s.question = await decideNextQuestion(s);
  if (s.question) s.messages.push({ role: "assistant", text: s.question.text });
  else if (s.order?.paidAt) s.state = "profile_complete";
}
