import { structured } from "./ai";
import { professions } from "./config";
import {
  conversationTurnSchema,
  profileSchema,
  type Profile,
  type Question,
  type Session,
} from "./schema";
export const initialQuestion: Question = {
  id: "role",
  field: "role",
  kind: "text",
  options: professions.slice(0, 8),
  text: "Ciao. In pochi minuti capisco dove l’AI ti toglie lavoro vero, non dove fa scena. Che lavoro fai?",
};
const initialGoals: Array<keyof Profile> = [
  "role",
  "mainTasks",
  "timeConsumingTasks",
  "repetitiveTasks",
  "aiLevel",
];
const detailGoals: Array<keyof Profile> = [
  "name",
  "companyType",
  "toolsUsed",
  "documentsUsed",
  "privacyConsiderations",
];
function filled(profile: Profile, field: keyof Profile) {
  const value = profile[field];
  return Array.isArray(value)
    ? value.some((item) => item.trim())
    : Boolean(value.trim());
}
export function missingFields(profile: Profile, details = false) {
  return (details ? detailGoals : initialGoals).filter((field) => !filled(profile, field));
}
export function analysisReady(profile: Profile) {
  return (
    filled(profile, "role") &&
    (filled(profile, "mainTasks") ||
      filled(profile, "timeConsumingTasks") ||
      filled(profile, "repetitiveTasks"))
  );
}
function mergeProfile(current: Profile, next: Profile): Profile {
  return profileSchema.parse({
    ...current,
    ...Object.fromEntries(
      Object.entries(next).filter(([, value]) =>
        Array.isArray(value) ? value.some((item) => item.trim()) : String(value).trim(),
      ),
    ),
  });
}
export function beginDetailsChat(s: Session) {
  s.state = "details";
  if (missingFields(s.profile, true).length === 0) {
    s.question = null;
    s.state = "profile_complete";
    return;
  }
  s.messages.push({
    role: "assistant",
    text: "Perfetto. Per la WorkMap completa mi bastano ancora poche cose, senza ripetere quello che so già. Come ti chiami? Anche solo il nome.",
  });
  s.question = {
    id: "name",
    field: "name",
    kind: "text",
    options: [],
    text: "Come ti chiami? Anche solo il nome.",
  };
}
export async function answerConversation(s: Session, answer: string) {
  const phase =
    s.question?.id === "correction"
      ? "edit"
      : s.state === "details"
        ? "details"
        : "initial";
  const previous = s.question;
  const turn = await structured("conversation-turn", conversationTurnSchema, {
    phase,
    profile: s.profile,
    question: s.question,
    messages: s.messages.slice(-12),
    answer,
    missing: missingFields(s.profile, phase === "details"),
    followupUsed: s.followupUsed,
  });
  s.messages.push({ role: "user", text: answer });
  s.profile = mergeProfile(s.profile, turn.profile);
  if (turn.insight) {
    s.insight = turn.insight;
    s.followupUsed = true;
  }
  s.messages.push({ role: "assistant", text: turn.message });
  for (const field of Object.keys(profileSchema.shape) as Array<keyof Profile>)
    if (filled(s.profile, field) && !s.answered.includes(field))
      s.answered.push(field);
  const userTurns = s.messages.filter((message) => message.role === "user").length;
  const ready =
    phase === "edit" ||
    (phase === "initial" &&
      analysisReady(s.profile) &&
      (turn.complete || userTurns >= 8)) ||
    (phase === "details" &&
      filled(s.profile, "role") &&
      missingFields(s.profile, true).length === 0) ||
    (phase === "details" && turn.complete && missingFields(s.profile, true).length <= 1);
  if (ready) {
    s.question = null;
    if (s.state === "details") s.state = "profile_complete";
    return;
  }
  s.question = {
    id:
      turn.insight &&
      previous?.field === "repetitiveTasks" &&
      previous.id !== "followup"
        ? "followup"
        : turn.field,
    field: turn.field,
    kind: turn.kind,
    options: turn.options,
    text: turn.message,
  };
}
