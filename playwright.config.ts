import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  use: { baseURL: "http://localhost:3100", channel: "chrome", headless: true },
  webServer: [
    {
      command: "node tests/workmap-mock-server.mjs",
      url: "http://127.0.0.1:4101",
      reuseExistingServer: false,
    },
    {
      command: "npm run start -- -p 3100",
      url: "http://localhost:3100/ai-workmap",
      reuseExistingServer: false,
      env: {
        WORKMAP_AI_BASE_URL: "http://localhost:4101/v1",
        WORKMAP_AI_API_KEY: "mock",
        WORKMAP_AI_MODEL: "mock",
        WORKMAP_ALLOW_LOCAL_STORE: "true",
        WORKMAP_DATA_DIR: "artifacts/workmap/e2e-data",
        WORKMAP_ACCESS_SECRET: "test-only-secret-32-characters-long",
        WORKMAP_TEST_LOCAL_AI: "true",
      },
    },
  ],
});
