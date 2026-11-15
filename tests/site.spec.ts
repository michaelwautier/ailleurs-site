import { expect, test } from '@playwright/test';
import { BASE_PATH, pages } from './pages';

for (const { name, path } of pages) {
  test.describe(name, () => {
    test('loads without console errors or failed requests', async ({ page }) => {
      const problems: string[] = [];
      page.on('console', (msg) => msg.type() === 'error' && problems.push(`console: ${msg.text()}`));
      page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
      page.on('response', (res) => {
        if (res.status() >= 400 && new URL(res.url()).hostname === 'localhost') problems.push(`${res.status()} ${res.url()}`);
      });
      await page.goto(path, { waitUntil: 'networkidle' });
      expect(problems).toEqual([]);
    });

    test('has the basic SEO and document metadata', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
      expect((await page.title()).length).toBeGreaterThan(5);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{20,}/);
      await expect(page.locator('meta[name="viewport"]')).toHaveCount(1);
      await expect(page.locator('link[rel="icon"]').first()).toHaveAttribute('href', new RegExp(`^${BASE_PATH}`));
      await expect(page.locator('h1')).toHaveCount(1);
    });

    test('every image has a description', async ({ page }) => {
      await page.goto(path);
      const missing = await page.$$eval('img[src]', (imgs: HTMLImageElement[]) => imgs.filter((img) => !img.alt?.trim()).map((img) => img.src));
      expect(missing).toEqual([]);
    });

    test('internal links, assets and anchors all resolve under the base path', async ({ page, request }) => {
      await page.goto(path);
      const { links, assets, anchors } = await page.evaluate(() => ({
        // Only links a visitor can reach (the header Réserver is hidden on home).
        links: [...document.querySelectorAll<HTMLAnchorElement>('a[href]')]
          .filter((a) => a.checkVisibility({ visibilityProperty: true }))
          .map((a) => a.getAttribute('href')!),
        assets: [...document.querySelectorAll<HTMLElement>('img[src], link[href], script[src]')].map(
          (el) => el.getAttribute('src') ?? el.getAttribute('href')!,
        ),
        anchors: [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
          .filter((a) => a.checkVisibility({ visibilityProperty: true }))
          .map((a) => a.hash.slice(1)),
      }));

      const local = [...links, ...assets].filter((url) => url.startsWith('/'));
      for (const url of local) expect(url, `${url} must go through withBase()`).toMatch(new RegExp(`^${BASE_PATH}`));

      for (const url of new Set(local)) {
        const res = await request.get(url);
        expect(res.status(), url).toBeLessThan(400);
      }
      for (const id of new Set(anchors)) {
        await expect(page.locator(`[id="${id}"]`), `#${id}`).toHaveCount(1);
      }
    });

    test('no [PLACEHOLDER] left in the copy', async ({ page }) => {
      await page.goto(path);
      const text = await page.locator('body').innerText();
      expect(text).not.toMatch(/\[[A-ZÉÈ][A-ZÉÈ _-]{2,}\]/);
      expect(text).not.toContain('[Photo]');
    });
  });
}
