"use client";
import { track } from "@vercel/analytics";
import { marketingAllowed, startPixel } from "@/lib/tracking";
export type WorkMapEvent =
  | "HeroCTA"
  | "AnalysisStarted"
  | "RoleProvided"
  | "TasksProvided"
  | "PainPointProvided"
  | "EmailCaptured"
  | "AnalysisCompleted"
  | "ProfileConfirmed"
  | "PreviewViewed"
  | "GenerationStarted"
  | "GenerationCompleted"
  | "WorkMapViewed"
  | "PDFDownloaded";
export function trackWorkMap(
  event: WorkMapEvent,
  values: { workflow_count?: number } = {},
  eventId?: string,
) {
  // Whitelist only aggregate product metrics. Never spread profile/chat data into analytics.
  const safe = {
    ...(values.workflow_count !== undefined
      ? { workflow_count: values.workflow_count }
      : {}),
  };
  track(event, safe);
  if (marketingAllowed()) {
    startPixel();
    window.fbq?.(
      "trackCustom",
      event,
      safe,
      { eventID: eventId || crypto.randomUUID() },
    );
  }
}
