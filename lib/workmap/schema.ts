import { z } from "zod";
const text = z.string().max(4000);
const list = z.array(text).max(30);
export const profileSchema = z.object({
  name: text,
  role: text,
  industry: text,
  company: text,
  companyType: text,
  teamContext: text,
  teamSize: text,
  seniority: text,
  clients: list,
  mainTasks: list,
  repetitiveTasks: list,
  timeConsumingTasks: list,
  painPoints: list,
  desiredOutcomes: list,
  toolsUsed: list,
  aiToolsUsed: list,
  documentsUsed: list,
  fileTypes: list,
  customerFacingTasks: list,
  internalTasks: list,
  aiLevel: text,
  constraints: list,
  privacyConsiderations: list,
  typicalWeek: text,
  eliminateTasks: list,
});
export type Profile = z.infer<typeof profileSchema>;
export const emptyProfile = (): Profile =>
  profileSchema.parse(
    Object.fromEntries(
      Object.entries(profileSchema.shape).map(([k, v]) => [
        k,
        v instanceof z.ZodArray ? [] : "",
      ]),
    ),
  );
export const taskSchema = z.object({
  tasks: z
    .array(
      z.object({
        task: text,
        frequency: text,
        painLevel: text,
        repetitiveness: text,
        informationIntensity: text,
        documentIntensity: text,
        humanJudgementRequired: text,
        privacyRisk: text,
        aiPotential: text,
        implementationDifficulty: text,
        recommendedApproach: text,
      }),
    )
    .max(25),
});
export const selectionSchema = z.object({
  workflows: z
    .array(
      z.object({
        id: text,
        reason: text,
        priority: z.enum(["Priorità alta", "Priorità media", "Da valutare"]),
        difficulty: z.enum(["Semplice", "Intermedia", "Avanzata"]),
      }),
    )
    .min(10)
    .max(15),
  notRecommended: text,
});
export const workflowSchema = z.object({
  id: text,
  title: text,
  relevance: text,
  whenToUse: text,
  requiredInputs: list,
  tool: text,
  procedure: list,
  masterPrompt: text,
  reviewPrompt: text,
  example: text,
  output: text,
  checklist: list,
  humanReview: text,
  commonErrors: list,
  privacy: text,
});
export const assistantsSchema = z.object({
  assistants: z
    .array(
      z.object({
        name: text,
        purpose: text,
        whenToUse: text,
        requiredInputs: list,
        systemPrompt: text,
        starterPrompts: list,
        rules: list,
        limitations: list,
        humanReview: text,
      }),
    )
    .length(3),
});
export const planSchema = z.object({
  weeks: z
    .array(
      z.object({
        week: z.number().int().min(1).max(4),
        goal: text,
        actions: list,
        successCheck: text,
      }),
    )
    .length(4),
  finalChecklist: list,
  privacy: list,
  tools: list,
});
export const contentSchema = z.object({
  workflows: z.array(workflowSchema).min(10).max(15),
  ...assistantsSchema.shape,
  ...planSchema.shape,
});
export const questionSchema = z.object({
  id: text,
  text: text,
  field: z.enum(
    Object.keys(profileSchema.shape) as [
      keyof Profile,
      ...Array<keyof Profile>,
    ],
  ),
  kind: z.enum(["text", "multi", "single"]),
  options: z.array(z.string().max(100)).max(12),
});
export const conversationTurnSchema = z.object({
  message: z.string().trim().min(1).max(450),
  profile: profileSchema,
  complete: z.boolean(),
  insight: z.string().max(700),
  field: z.enum(
    Object.keys(profileSchema.shape) as [
      keyof Profile,
      ...Array<keyof Profile>,
    ],
  ),
  kind: z.enum(["text", "multi", "single"]),
  options: z.array(z.string().max(100)).max(8),
});
export type Question = z.infer<typeof questionSchema>;
export type Content = z.infer<typeof contentSchema>;
export type Selection = z.infer<typeof selectionSchema>;
export type Session = {
  id: string;
  tokenHash: string;
  legalVersion: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  profile: Profile;
  messages: { role: "assistant" | "user"; text: string }[];
  question: Question | null;
  answered: string[];
  state:
    | "lead"
    | "qualified"
    | "checkout_started"
    | "paid"
    | "profile_complete"
    | "generating"
    | "reviewing"
    | "ready"
    | "failed";
  confirmed: boolean;
  followupUsed: boolean;
  insight: string;
  selection?: Selection;
  analysis?: z.infer<typeof taskSchema>;
  order?: {
    id: string;
    checkoutId?: string;
    url?: string;
    expiresAt?: number;
    amount: number;
    currency: string;
    paidAt?: string;
    paymentId?: string;
    termsVersion: string;
    consentAt: string;
  };
  job?: {
    runId?: string;
    step: number;
    cursor: number;
    attempts: number;
    error?: string;
    updatedAt: string;
  };
  content?: Content;
  drafts: z.infer<typeof workflowSchema>[];
  pdf?: string;
  downloads: number;
  mail: { analysis?: string; purchase?: string; ready?: string };
  mailErrors: string[];
  marketing: boolean;
  metaSent?: boolean;
  fbp?: string;
  fbc?: string;
  requestIds: string[];
};
export const answerSchema = z.object({
  answer: z.string().trim().min(1).max(4000),
  requestId: z.string().uuid(),
  version: z.number().int().nonnegative(),
});
