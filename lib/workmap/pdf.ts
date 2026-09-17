import PDFDocument from "pdfkit";
import path from "node:path";
import type { Session } from "./schema";
// Same structured content as the private HTML view; native PDF text remains selectable.
export function renderPdf(s: Session): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 48,
      bufferPages: true,
      info: { Title: `AI WorkMap di ${s.profile.name}`, Author: "ACCELERIAMO" },
    });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    const font = path.join(
      process.cwd(),
      "app/fonts/degular-accents/DegularDisplay-Regular-accents.otf",
    );
    doc.registerFont("Display", font);
    const ink = "#1d1b19",
      orange = "#ff5a1f",
      body = "#625e58",
      paper = "#fffdf8";
    const clean = (value: string) =>
      value.replace(/[\u0000-\u0008\u000b-\u001f]/g, "");
    const title = (value: string) => {
      doc
        .font("Display")
        .fontSize(30)
        .fillColor(ink)
        .text(value.replace(/[\/–—-]/g, " "));
      doc.moveDown(0.4);
    };
    const block = (label: string, value: string) => {
      if (doc.y > 690) doc.addPage();
      if (label.includes("PROMPT") || label === "Istruzioni da copiare") {
        doc.font("Helvetica").fontSize(11);
        const height =
          doc.heightOfString(clean(value), { width: 475, lineGap: 4 }) + 50;
        if (height < 680) {
          if (doc.y + height > 780) doc.addPage();
          const top = doc.y;
          doc.roundedRect(42, top - 8, 511, height, 8).fill("#f6f2eb");
          doc.rect(42, top - 3, 3, 22).fill(orange);
        }
      }
      doc.font("Helvetica-Bold").fontSize(11).fillColor(ink).text(label);
      doc.moveDown(0.3);
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor(body)
        .text(clean(value), { lineGap: 4 });
      doc.moveDown(0.8);
    };
    const newSection = (name: string) => {
      doc.addPage();
      title(name);
    };
    doc.on("pageAdded", () => {
      doc.save();
      doc.rect(0, 0, 595.28, 841.89).fill(paper);
      doc.rect(48, 25, 10, 10).fill(orange);
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(body)
        .text("ACCELERIAMO / AI WORKMAP", 66, 26, { lineBreak: false });
      doc.restore();
      doc.x = 48;
      doc.y = 58;
    });
    doc.rect(0, 0, 595.28, 841.89).fill(paper);
    doc.rect(48, 65, 18, 18).fill(orange);
    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor(ink)
      .text("ACCELERIAMO", 78, 68);
    doc.y = 175;
    doc.font("Display").fontSize(62).fillColor(ink).text("AI WorkMap");
    doc.fontSize(38).text(`di ${s.profile.name || "un professionista"}`);
    doc.moveDown();
    block("IL TUO LAVORO, UN PASSO ALLA VOLTA", s.profile.role);
    block("PREPARATA IL", new Date(s.updatedAt).toLocaleDateString("it-IT"));
    block(
      "IL TUO PERCORSO",
      `${s.content!.workflows.length} workflow personali · 3 assistenti AI · Piano di 30 giorni`,
    );
    newSection("Indice");
    [
      "Il tuo profilo operativo",
      "Le opportunità AI individuate",
      "Da dove partire",
      "Workflow personalizzati",
      "I tuoi Prompt Master",
      "I tuoi 3 assistenti AI",
      "Strumenti consigliati",
      "Privacy e controlli",
      "Piano 30 giorni",
      "Checklist finale",
    ].forEach((v, i) => block(String(i + 1).padStart(2, "0"), v));
    newSection("01 / Il tuo profilo operativo");
    block(
      "Ruolo e contesto",
      [
        s.profile.role,
        s.profile.companyType,
        s.profile.industry,
        s.profile.teamSize,
      ]
        .filter(Boolean)
        .join(" · "),
    );
    block("Attività principali", s.profile.mainTasks.join("; "));
    block(
      "Le tue priorità",
      [...s.profile.timeConsumingTasks, ...s.profile.repetitiveTasks].join(
        "; ",
      ),
    );
    block(
      "Strumenti e livello AI",
      [s.profile.toolsUsed.join(", "), s.profile.aiLevel].join(" · "),
    );
    newSection("02 / Le opportunità individuate");
    s.selection!.workflows.forEach((w) =>
      block(`${catalogTitle(w.id)} · ${w.priority}`, w.reason),
    );
    newSection("03 / Da dove partire");
    block(s.content!.workflows[0].title, s.content!.workflows[0].relevance);
    block("Cosa non prioritizzare", s.selection!.notRecommended);
    s.content!.workflows.forEach((w, i) => {
      newSection(`04 / Workflow ${String(i + 1).padStart(2, "0")}`);
      title(w.title);
      block("Perché è rilevante per te", w.relevance);
      block("Quando usarlo", w.whenToUse);
      block("Input e strumento", `${w.requiredInputs.join("; ")}\n${w.tool}`);
      block(
        "Procedura",
        w.procedure.map((p, j) => `${j + 1}. ${p}`).join("\n"),
      );
      block("Esempio ipotetico", w.example);
      block("Output atteso", w.output);
      block("Checklist", w.checklist.join("\n"));
      block("Controllo umano", w.humanReview);
      block("Errori frequenti", w.commonErrors.join("\n"));
      block("Privacy", w.privacy);
    });
    newSection("05 / I tuoi Prompt Master");
    s.content!.workflows.forEach((w) => {
      if (doc.y > 180) doc.addPage();
      title(w.title);
      block("PROMPT MASTER · COPIA E ADATTA", w.masterPrompt);
      block("PROMPT DI REVISIONE", w.reviewPrompt);
    });
    newSection("06 / I tuoi assistenti AI");
    s.content!.assistants.forEach((a, i) => {
      if (i) doc.addPage();
      title(a.name);
      block("Scopo e utilizzo", `${a.purpose}\n${a.whenToUse}`);
      block("Input", a.requiredInputs.join("; "));
      block("Istruzioni da copiare", a.systemPrompt);
      block("Per iniziare", a.starterPrompts.join("\n"));
      block("Regole", a.rules.join("\n"));
      block(
        "Limiti e controllo",
        `${a.limitations.join("\n")}\n${a.humanReview}`,
      );
    });
    newSection("07 / Strumenti consigliati");
    block("Gli strumenti per il tuo percorso", s.content!.tools.join("\n"));
    block(
      "Prima di iniziare",
      "Verifica condizioni, piani e funzioni aggiornate sul sito del fornitore. Usa strumenti autorizzati dalla tua azienda.",
    );
    newSection("08 / Privacy e controlli");
    block("I tuoi controlli", s.content!.privacy.join("\n"));
    newSection("09 / Piano 30 giorni");
    s.content!.weeks.forEach((w) => {
      block(`Settimana ${w.week} · ${w.goal}`, w.actions.join("\n"));
      block("Verifica", w.successCheck);
    });
    newSection("10 / Checklist finale");
    block(
      "Prima di utilizzare un risultato",
      s.content!.finalChecklist.join("\n"),
    );
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);
      doc.save();
      doc.page.margins.bottom = 0;
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(body)
        .text(
          `ACCELERIAMO · AI WORKMAP                                      ${i + 1} / ${range.count}`,
          48,
          809,
          { lineBreak: false },
        );
      doc.restore();
    }
    doc.end();
  });
}
import { catalog } from "./catalog";
const catalogTitle = (id: string) =>
  catalog.find((w) => w.id === id)?.title || id;
