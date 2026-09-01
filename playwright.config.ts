import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // The frame-rate claim samples requestAnimationFrame. Keep one owned browser
  // worker for the whole default gate so another test cannot steal that frame.
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev -- --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  },
});
