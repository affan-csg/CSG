import { defineConfig, devices } from "@playwright/test";

// Vite auto-increments past 8080 if that port is already taken (e.g. by an
// unrelated local service) — PLAYWRIGHT_PORT lets a dev machine or sandbox
// point the test run at whatever port the dev server actually bound to,
// without changing behavior anywhere this isn't set.
const PORT = process.env.PLAYWRIGHT_PORT ?? "8080";
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60_000,
  reporter: "html",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    navigationTimeout: 45_000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
  },
});
