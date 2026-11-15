import { expect, test } from '@playwright/test';
import { housePages } from './pages';

const house = housePages[0];

function isoDay(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

test.describe('navigation', () => {
  test('home hides the Réserver button and marks no universe active', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('.site-header .pill')).toBeHidden();
    await expect(page.locator('.site-header .tab[aria-current="page"]')).toHaveCount(0);
  });

  test('house page marks its universe active and sits the underline under it', async ({ page, isMobile }) => {
    test.skip(isMobile, 'nav underline is checked on desktop and tablet');
    await page.goto(house.path);
    const active = page.locator('.site-header .tab[aria-current="page"]');
    await expect(active).toHaveCount(1);
    await expect(active).toHaveAttribute('href', new RegExp(`${house.name}$`));
    await expect(page.locator('.tabs-indicator')).toHaveClass(/is-visible/);
    const [tab, line] = await Promise.all([active.boundingBox(), page.locator('.tabs-indicator').boundingBox()]);
    expect(Math.abs(tab!.x - line!.x)).toBeLessThan(2);
    expect(Math.abs(tab!.width - line!.width)).toBeLessThan(2);
  });

  test('switching universe keeps a single active tab', async ({ page, isMobile }) => {
    test.skip(isMobile, 'covered on desktop');
    await page.goto(house.path);
    await page.locator('.site-header .tab').nth(2).click();
    await expect(page).toHaveURL(/maisons\/\w+$/);
    await expect(page.locator('.site-header .tab[aria-current="page"]')).toHaveCount(1);
  });
});

test.describe('home layout', () => {
  test('tablet and phone: the four cards fit exactly one screen', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'desktop', 'one-screen layout is for ≤ 860 px');
    await page.goto('./');
    const { scroll, viewport } = await page.evaluate(() => ({
      scroll: document.documentElement.scrollHeight,
      viewport: window.innerHeight,
    }));
    expect(scroll).toBeLessThanOrEqual(viewport + 1);
    await expect(page.locator('.card')).toHaveCount(4);
  });
});

test.describe('booking form', () => {
  test('no past arrival, departure after arrival, total computed', async ({ page }) => {
    await page.goto(house.path);
    const arrival = page.locator('[name="arrival"]');
    const departure = page.locator('[name="departure"]');
    const today = new Date();
    await expect(arrival).toHaveAttribute('min', isoDay(today));

    const inTenDays = isoDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10));
    const inTwelveDays = isoDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12));
    const inElevenDays = isoDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 11));

    await departure.fill(inElevenDays);
    await arrival.fill(inTwelveDays);
    await expect(departure, 'a departure before the new arrival is cleared').toHaveValue('');
    await expect(departure).toHaveAttribute('min', isoDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13)));

    await arrival.fill(inTenDays);
    await departure.fill(inTwelveDays);
    await expect(page.locator('[data-total]')).toHaveText(/× 2 = \d+ €/);
    await page.locator('.booking-form button[type="submit"]').click();
    await expect(page.locator('[data-status]')).toContainText('Demande prête');
  });

  test('guests are capped at the house capacity', async ({ page }) => {
    await page.goto(house.path);
    const label = page.locator('[data-guests-label]');
    await expect(label).toHaveText('2 voyageurs');
    await page.locator('[data-guests="1"]').click();
    await expect(label).toHaveText('2 voyageurs');
    await page.locator('[data-guests="-1"]').click();
    await page.locator('[data-guests="-1"]').click();
    await expect(label).toHaveText('1 voyageur');
  });
});

test.describe('gallery', () => {
  test('carousel loops in both directions', async ({ page }) => {
    await page.goto(house.path);
    const counter = page.locator('[data-current]');
    const total = Number((await page.locator('.gallery').getAttribute('data-count')) ?? 0);
    expect(total).toBeGreaterThan(3);
    await expect(counter).toHaveText('01');
    await page.locator('[data-step="-1"]').click();
    await expect(counter).toHaveText(String(total).padStart(2, '0'));
    for (let i = 0; i < total; i++) await page.locator('[data-step="1"]').click();
    await expect(counter).toHaveText(String(total).padStart(2, '0'));
  });

  test('carousel stays inside its frame', async ({ page }) => {
    await page.goto(house.path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, 'no horizontal page scroll').toBeLessThanOrEqual(0);
  });

  test('lightbox opens, browses and closes with the keyboard', async ({ page }) => {
    await page.goto(house.path);
    await page.locator('.gallery-slide:not([inert]) .gallery-open').first().click();
    const dialog = page.locator('dialog.lightbox');
    await expect(dialog).toBeVisible();
    const img = dialog.locator('img');
    const first = await img.getAttribute('src');
    await page.keyboard.press('ArrowRight');
    await expect(img).not.toHaveAttribute('src', first!);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});

test('phone: floating Réserver bar is shown on house pages', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'phone', 'phone only');
  await page.goto(house.path);
  await expect(page.locator('.mobile-bar')).toBeVisible();
});
