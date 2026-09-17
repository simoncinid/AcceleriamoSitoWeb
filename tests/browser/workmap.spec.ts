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
      await page.evaluate(() =>
        Array.from(document.querySelectorAll("body *"))
          .filter(
            (el) =>
              el.checkVisibility() &&
              el.getBoundingClientRect().right > innerWidth + 1,
          )
          .map(
            (el) =>
              `${el.tagName}.${el.className}: ${el.getBoundingClientRect().right}`,
          )
          .slice(0, 12),
      ),
    ).toEqual([]);
    await page.screenshot({
      path: `artifacts/workmap/landing-${width}.png`,
      fullPage: true,
    });
    await page
      .getByRole("link", { name: "Analizza il mio lavoro" })
      .first()
      .click();
    await expect(page.getByLabel("La tua risposta")).toBeVisible();
    await page
      .getByLabel("La tua risposta")
      .fill("Sono responsabile commerciale di una PMI e seguo 12 agenti");
    await page.getByRole("button", { name: "Invia", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Report agenti", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Report agenti", exact: true })
      .click();
    await page.getByRole("button", { name: "Offerte", exact: true }).click();
    await page.getByRole("button", { name: "Conferma le 2 scelte" }).click();
    await expect(page.getByLabel("La tua risposta")).toBeEnabled();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
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
test("analisi gratuita, correzione profilo, anteprima e paywall", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ai-workmap/analisi");
  for (const answer of [
    "Recruiter",
    "Colloqui; Annunci",
    "Colloqui; Onboarding",
    "Raccogliere gli aggiornamenti",
    "Formati diversi",
    "Mai",
  ]) {
    await expect(page.getByLabel("La tua risposta")).toBeEnabled();
    await page.getByLabel("La tua risposta").fill(answer);
    await page.getByRole("button", { name: "Invia", exact: true }).click();
  }
  await expect(
    page.getByLabel("Dove vuoi che salvi la tua analisi?"),
  ).toBeVisible();
  await page
    .getByLabel("Dove vuoi che salvi la tua analisi?")
    .fill("test@example.test");
  await page
    .getByRole("button", { name: "Mostra la mia analisi gratuita" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Ecco cosa ho capito del tuo lavoro." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sì, è corretto" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Modifica", exact: true }).click();
  await page.getByLabel("Correggi il profilo").fill("HR manager");
  await page.getByRole("button", { name: "Invia", exact: true }).click();
  await page.getByRole("button", { name: "Prepara la mia analisi" }).click();
  await expect(
    page.getByRole("button", { name: "Sì, è corretto" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Sì, è corretto" }).click();
  await expect(
    page.getByRole("heading", { name: /Ho individuato 12/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Genera la mia AI WorkMap" }),
  ).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "artifacts/workmap/paywall-390.png",
    fullPage: true,
  });
});
