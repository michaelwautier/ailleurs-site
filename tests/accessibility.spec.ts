import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { housePages, pages } from './pages';

// WCAG 2.2 A/AA, which includes colour contrast (4.5:1 for text, 3:1 for large text).
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function audit(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const report = results.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help}\n${v.nodes.map((n) => `  - ${n.target.join(' ')}: ${n.failureSummary?.split('\n')[1]?.trim() ?? ''}`).join('\n')}`,
  );
  expect(report, report.join('\n\n')).toEqual([]);
}

for (const { name, path } of pages) {
  test(`${name}: no WCAG 2.2 AA violations`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await audit(page);
  });
}

test('home: card previews (hover state) keep accessible contrast', async ({ page, isMobile }) => {
  test.skip(isMobile, 'hover only exists on desktop');
  await page.goto('./');
  await page.locator('.card').first().hover();
  await audit(page);
});

test(`${housePages[0].name}: open lightbox has no violations`, async ({ page }) => {
  await page.goto(housePages[0].path);
  await page.locator('.gallery-slide:not([inert]) .gallery-open').first().click();
  await expect(page.locator('dialog.lightbox')).toBeVisible();
  await audit(page);
});

for (const { name, path } of pages) {
  test(`${name}: every interactive element is reachable and named`, async ({ page }) => {
    await page.goto(path);
    const unnamed = await page.$$eval('a[href], button', (els) =>
      els
        .filter((el) => !el.closest('[inert], [aria-hidden="true"]'))
        .filter((el) => !(el.getAttribute('aria-label') || el.textContent?.trim()))
        .map((el) => el.outerHTML.slice(0, 120)),
    );
    expect(unnamed).toEqual([]);
  });
}
