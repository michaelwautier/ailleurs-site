import { defineConfig, devices } from '@playwright/test';

// Tests run against the production build served by `astro preview`, under the same
// base path as GitHub Pages (/ailleurs-site). Run `npm run build` first.
const PORT = 4329;

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/ailleurs-site/`,
    // Entrance animations start at opacity 0; reduced motion turns them off so
    // contrast checks see the final colours.
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 820, height: 1180 }, hasTouch: true } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npx astro preview --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}/ailleurs-site/`,
    reuseExistingServer: !process.env.CI,
  },
});
