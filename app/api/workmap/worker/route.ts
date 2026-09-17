import { z } from "zod";
import {
  processDueSessions,
  processWork,
  verifyCron,
  workTaskSchema,
} from "@/lib/workmap/jobs";
export const runtime = "nodejs";
export const maxDuration = 180;
export async function GET(request: Request) {
  if (!verifyCron(request))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return Response.json({ processed: await processDueSessions() });
  } catch {
    return Response.json({ error: "Retry" }, { status: 503 });
  }
}
export async function POST(request: Request) {
  if (!verifyCron(request))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const task = workTaskSchema.parse(await request.json());
    await processWork(task.id, task.kind);
    return Response.json({ received: true });
  } catch (error) {
    if (error instanceof z.ZodError)
      return Response.json({ error: "Invalid task" }, { status: 422 });
    return Response.json({ error: "Retry" }, { status: 503 });
  }
}
