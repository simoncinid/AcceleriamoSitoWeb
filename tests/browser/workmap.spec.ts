import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
test.beforeAll(async () => {
  await fs.rm("artifacts/workmap/e2e-data", { recursive: true, force: true });
});
// Vercel serves this script only on its hosting; isolate that external infrastructure locally.
test.beforeEach(async ({ page }) => {
  await page.route("**/_vercel/insights/script.js", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: "/* Analytics transport stub for local tests. */",
    }),
  );
});
for (const width of [360, 375, 390, 430, 1440])
  test(`landing e chat a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error")
        errors.push(`${message.text()} ${message.location().url}`);
    });
    page.on("response", (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto("/ai-workmap");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Quali parti",
    );
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => {
        const clipped = (el: Element) => {
          const r = el.getBoundingClientRect();
          let n = el.parentElement;
          while (n && n !== document.body) {
            const s = getComputedStyle(n);
            if (
              /(auto|scroll|hidden)/.test(s.overflowX) &&
              n.scrollWidth > n.clientWidth + 1
            ) {
              if (r.right > n.getBoundingClientRect().right + 1) return true;
            }
            n = n.parentElement;
          }
          return false;
        };
        return Array.from(document.querySelectorAll("body *"))
          .filter(
            (el) =>
              el.checkVisibility() &&
              el.getBoundingClientRect().right > innerWidth + 1 &&
              !clipped(el),
          )
          .map(
            (el) =>
              `${el.tagName}.${el.className}: ${el.getBoundingClientRect().right}`,
          )
          .slice(0, 12);
      }),
    ).toEqual([]);
    await page.screenshot({
      path: `artifacts/workmap/landing-${width}.png`,
      fullPage: true,
    });
    await page
      .getByRole("link", { name: "Richiedi l'analisi gratuitamente" })
      .first()
      .click();
    await expect(page.getByLabel("Messaggio")).toBeVisible();
    await page
      .getByLabel("Messaggio")
      .fill("Sono responsabile commerciale di una PMI e seguo 12 agenti");
    await page.getByRole("button", { name: "Invia", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Report agenti", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Report agenti", exact: true })
      .click();
    await expect(
      page.getByText("Quali attività ti portano via più tempo?", {
        exact: false,
      }),
    ).toBeVisible();
    await expect
      .poll(() =>
        page
          .getByRole("button", { name: "Offerte", exact: true })
          .evaluate(
            (el) =>
              el.getBoundingClientRect().bottom <
              document.querySelector(".wm-composer")!.getBoundingClientRect()
                .top,
          ),
      )
      .toBe(true);
    await page.getByRole("button", { name: "Offerte", exact: true }).click();
    await expect(page.getByLabel("Messaggio")).toBeEnabled();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page.evaluate(() => {
        const first = document.querySelector(".wm-message");
        const log = document.querySelector(".wm-thread");
        if (!first || !log) return false;
        return first.getBoundingClientRect().top - log.getBoundingClientRect().top < 48;
      }),
    ).toBe(true);
    expect(
      await page.evaluate(() => {
        const shell = document.querySelector(".wm-shell");
        if (!shell) return false;
        return Math.round(shell.getBoundingClientRect().height) <= innerHeight + 1;
      }),
    ).toBe(true);
    await page.screenshot({ path: `artifacts/workmap/chat-${width}.png` });
    await page.reload();
    await expect(
      page.getByText(
        "Sono responsabile commerciale di una PMI e seguo 12 agenti",
        { exact: true },
      ),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
for (const width of [390, 1200])
test(`analisi gratuita, correzione profilo e consegna a ${width}px`, async ({
  page,
}) => {
  const emailLabel = "A che indirizzo mail devo inviare l'analisi completa?";
  await page.setViewportSize({ width, height: 844 });
  await page.goto("/ai-workmap/analisi");
  await page.getByLabel("Messaggio").fill("Recruiter");
  await page.getByRole("button", { name: "Invia", exact: true }).click();
  await expect(page.getByText("Di cosa ti occupi")).toBeVisible();
  await page.getByRole("button", { name: "Colloqui", exact: true }).click();
  await expect(page.getByText("Quali attività ti portano via più tempo?")).toBeVisible();
  await page.getByRole("button", { name: "Annunci", exact: true }).click();
  await expect(page.getByText("ripetitiva", { exact: false })).toBeVisible();
  await page.getByLabel("Messaggio").fill("Raccogliere gli aggiornamenti");
  await page.getByRole("button", { name: "Invia", exact: true }).click();
  await expect(page.getByText("formato", { exact: false })).toBeVisible();
  await page.getByLabel("Messaggio").fill("Formati diversi");
  await page.getByRole("button", { name: "Invia", exact: true }).click();
  await expect(page.getByText("strumenti AI", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Mai", exact: true }).click();
  await expect(page.locator("#wm-email")).toBeVisible({ timeout: 15000 });
  await page
    .getByLabel(emailLabel)
    .fill("test@example.test");
  await page
    .getByRole("button", { name: "Mostra la mia analisi gratuita" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Ecco cosa ho capito del tuo lavoro." }),
  ).toBeVisible({ timeout: 60000 });
  await expect(
    page.getByRole("button", { name: "Sì, è corretto" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Modifica", exact: true }).click();
  await page.getByLabel("Correggi il profilo").fill("HR manager");
  await page.getByRole("button", { name: "Invia", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Ecco cosa ho capito del tuo lavoro." }),
  ).toBeVisible({ timeout: 60000 });
  await page.getByRole("button", { name: "Sì, è corretto" }).click();
  await expect(
    page.getByRole("heading", { name: /Ho individuato 5/ }),
  ).toBeVisible({ timeout: 60000 });
  await expect(page.getByRole("button", { name: "Ricomincia" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Avanti", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Avanti", exact: true }).click();
  await page.getByRole("button", { name: "Avanti", exact: true }).click();
  await page.getByRole("button", { name: "Avanti", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Continua e ricevi il PDF" }),
  ).toBeEnabled();
  expect(
    await page.evaluate(() => {
      const shell = document.querySelector(".wm-shell");
      if (!shell) return false;
      return Math.round(shell.getBoundingClientRect().height) <= innerHeight + 1;
    }),
  ).toBe(true);
  await page.screenshot({
    path: `artifacts/workmap/delivery-offer-${width}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Continua e ricevi il PDF" }).click();
  await expect(
    page.getByText(
      "Abbiamo bisogno solo di qualche altra risposta per completare la tua analisi gratuita.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByText("Come ti chiami?", { exact: false })).toBeVisible();
  await page.screenshot({
    path: `artifacts/workmap/details-${width}.png`,
    fullPage: true,
  });
  for (let answer = 0; answer < 8; answer++) {
    if (await page.getByRole("heading", { name: "Grazie." }).isVisible()) break;
    const field = page.getByLabel("Messaggio");
    if (await field.isVisible()) {
      await field.fill(answer === 0 ? "Marco" : "Informazioni generiche");
      await page.getByRole("button", { name: "Invia", exact: true }).click();
    } else {
      const choice = page.locator(".wm-choice:visible").first();
      if (await choice.isVisible()) await choice.click();
    }
    await page.waitForTimeout(150);
  }
  await expect(page.getByRole("heading", { name: "Grazie." })).toBeVisible({
    timeout: 60000,
  });
  await expect(page.getByRole("link", { name: "Vai alla home" })).toBeVisible();
  await expect(
    page.getByText(/Abbiamo inviato la tua AI WorkMap|Stiamo inviando il PDF|non è riuscito/),
  ).toBeVisible();
  await page.screenshot({
    path: `artifacts/workmap/delivery-${width}.png`,
    fullPage: true,
  });
});
