import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3000";
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: devices["Desktop Chrome"],
      testIgnore: /mobile\.spec\.ts/,
    },
    {
      name: "webkit",
      use: devices["Desktop Safari"],
      testIgnore: /mobile\.spec\.ts/,
    },
    {
      name: "mobile",
      use: devices["Pixel 7"],
      testMatch: /mobile\.spec\.ts/,
    },
  ],
  // Without BASE_URL, test a production build served locally.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run build && npm run start",
        url: baseURL,
        reuseExistingServer: !isCI,
        timeout: 300_000,
      },
});
