import { renderLlmsFullTxt } from "@/lib/llms";

export const revalidate = false;

export function GET() {
  return new Response(renderLlmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" },
  });
}
