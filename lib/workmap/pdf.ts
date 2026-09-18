import PDFDocument from "pdfkit";
import path from "node:path";
import type { Session } from "./schema";

const PAGE_LIMIT = 15;

export function renderPdf(s: Session): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 48,
      bufferPages: true,
      info: {
        Title: `AI WorkMap di ${s.profile.name || s.profile.role}`,
        Author: "ACCELERIAMO",
      },
    });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const displayFont = path.join(
      process.cwd(),
      "app/fonts/degular-accents/DegularDisplay-Regular-accents.otf",
    );
    doc.registerFont("Display", displayFont);

    const ink = "#1d1b19";
    const orange = "#ff5a1f";
    const body = "#625e58";
    const paper = "#fffdf8";
    const cream = "#f6f2eb";
    const content = s.content!;

    const clean = (value: string) =>
      value.replace(/[\u0000-\u0008\u000b-\u001f]/g, "").trim();
    const shorten = (value: string, max = 900) => {
      const text = clean(value);
      if (text.length <= max) return text;
      return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
    };
    const list = (items: string[], max = 4) =>
      items
        .slice(0, max)
        .map((item) => `• ${shorten(item, 180)}`)
        .join("\n");
    const write = (
      value: string,
      options: { x?: number; y?: number; width?: number; height?: number } = {},
    ) => {
      doc.text(shorten(value), options.x ?? 48, options.y ?? doc.y, {
        width: options.width ?? 499,
        height: options.height,
        ellipsis: Boolean(options.height),
        lineGap: 3,
      });
    };
    const label = (value: string, y?: number) => {
      doc.font("Helvetica-Bold").fontSize(9).fillColor(orange);
      write(value.toUpperCase(), { y });
      doc.moveDown(0.45);
    };
    const paragraph = (value: string, max = 600) => {
      doc.font("Helvetica").fontSize(10.5).fillColor(body);
      write(shorten(value, max), { height: 72 });
      doc.moveDown(0.8);
    };
    const heading = (value: string, size = 30) => {
      doc.font("Display").fontSize(size).fillColor(ink);
      write(value.replace(/[\/–—-]/g, " "), { height: size * 2.5 });
      doc.moveDown(0.35);
    };
    const addPage = (section: string, title: string) => {
      doc.addPage();
      label(section);
      heading(title);
    };
    const promptBox = (value: string, max = 1500) => {
      const prompt = shorten(value, max);
      doc.font("Helvetica").fontSize(9.5);
      const height = Math.min(
        280,
        Math.max(120, doc.heightOfString(prompt, { width: 455, lineGap: 3 }) + 28),
      );
      const top = doc.y;
      doc.roundedRect(48, top, 499, height, 8).fill(cream);
      doc.rect(48, top, 3, height).fill(orange);
      doc.fillColor(ink);
      write(prompt, { x: 66, y: top + 14, width: 455, height: height - 28 });
      doc.y = top + height + 14;
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
    doc.font("Helvetica-Bold").fontSize(13).fillColor(ink).text("ACCELERIAMO", 78, 68);
    doc.y = 170;
    heading("AI WorkMap", 62);
    heading(`di ${s.profile.name || "un professionista"}`, 36);
    doc.y = 360;
    label("Il tuo lavoro");
    paragraph(s.profile.role, 180);
    label("Dentro questa guida");
    paragraph("5 applicazioni prioritarie · 2 assistenti AI · Piano pratico di 30 giorni", 180);

    addPage("01", "Le priorità per il tuo lavoro");
    label("Profilo");
    paragraph(
      [s.profile.role, s.profile.companyType, s.profile.industry]
        .filter(Boolean)
        .join(" · "),
      260,
    );
    content.workflows.forEach((workflow, index) => {
      doc.font("Helvetica-Bold").fontSize(12).fillColor(ink);
      write(`${String(index + 1).padStart(2, "0")}  ${workflow.title}`, { height: 24 });
      doc.font("Helvetica").fontSize(9.5).fillColor(body);
      write(workflow.relevance, { x: 78, width: 469, height: 38 });
      doc.moveDown(0.75);
    });
    label("Parti da qui");
    paragraph(content.workflows[0].whenToUse, 280);

    content.workflows.forEach((workflow, index) => {
      addPage(`02 / Priorità ${index + 1}`, workflow.title);
      label("Cosa ottieni");
      paragraph(`${workflow.relevance} ${workflow.output}`, 420);
      label("Cosa ti serve");
      paragraph(`${workflow.requiredInputs.slice(0, 3).join(" · ")} · ${workflow.tool}`, 300);
      label("Come farlo");
      doc.font("Helvetica").fontSize(10).fillColor(body);
      write(
        workflow.procedure
          .slice(0, 4)
          .map((step, stepIndex) => `${stepIndex + 1}. ${shorten(step, 170)}`)
          .join("\n"),
        { height: 105 },
      );
      doc.moveDown(0.8);
      label("Prompt da copiare");
      promptBox(workflow.masterPrompt);
      label("Prima di usarlo");
      paragraph([workflow.humanReview, workflow.privacy].filter(Boolean).join(" "), 320);
    });

    content.assistants.forEach((assistant, index) => {
      addPage(`03 / Assistente ${index + 1}`, assistant.name);
      label("A cosa serve");
      paragraph(`${assistant.purpose} ${assistant.whenToUse}`, 420);
      label("Istruzioni da copiare");
      promptBox(assistant.systemPrompt, 1400);
      label("Per iniziare");
      paragraph(list(assistant.starterPrompts, 2), 360);
      label("Controllo umano");
      paragraph(assistant.humanReview, 260);
    });

    addPage("04", "Il tuo piano di 30 giorni");
    content.weeks.forEach((week) => {
      doc.font("Helvetica-Bold").fontSize(12).fillColor(ink);
      write(`Settimana ${week.week} · ${shorten(week.goal, 110)}`, { height: 24 });
      doc.font("Helvetica").fontSize(9.5).fillColor(body);
      write(list(week.actions, 2), { x: 66, width: 481, height: 48 });
      doc.moveDown(0.6);
    });
    label("Controlli finali");
    paragraph(list(content.finalChecklist, 5), 600);
    label("Privacy");
    paragraph(list(content.privacy, 4), 480);

    const range = doc.bufferedPageRange();
    if (range.count > PAGE_LIMIT)
      throw Error("Il documento supera il limite di 15 pagine.");
    for (let page = 0; page < range.count; page++) {
      doc.switchToPage(page);
      doc.save();
      doc.page.margins.bottom = 0;
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(body)
        .text(
          `ACCELERIAMO · AI WORKMAP                                      ${page + 1} / ${range.count}`,
          48,
          809,
          { lineBreak: false },
        );
      doc.restore();
    }
    doc.end();
  });
}
