// Test-only local AI endpoint. Never imported by production code.
import http from "node:http";
import { modules, fakeAI } from "./workmap-loader.mjs";
const { catalog } = modules()("lib/workmap/catalog.ts");
const ai = fakeAI(catalog);
http
  .createServer(async (req, res) => {
    try {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      if (req.method === "GET") {
        res.end("ok");
        return;
      }
      const body = JSON.parse(raw);
      const id = body.response_format.json_schema.name.replaceAll("_", "-");
      const result = await ai.structured(
        id,
        { parse: (v) => v },
        JSON.parse(body.messages[1].content),
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          choices: [
            {
              finish_reason: "stop",
              message: { content: JSON.stringify(result) },
            },
          ],
        }),
      );
    } catch {
      res.writeHead(500);
      res.end("{}");
    }
  })
  .listen(4101, "127.0.0.1");
