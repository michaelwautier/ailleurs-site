import type { Page } from '@playwright/test';

/**
 * axe-core cannot compute contrast for text drawn over an image, a gradient, an
 * overlapping element or a pseudo element: it reports those as "incomplete"
 * (needs review) instead of violations, so they slip through a plain axe run.
 *
 * This measures them from real pixels: hide the text, screenshot what is behind
 * it, and compare the text colour with that background. A text passes when 95%
 * of the background pixels meet the WCAG AA ratio (4.5:1, or 3:1 for large text).
 */

const HIDE_CLASS = '__contrast-hide-text';
const COVERAGE = 0.95;

export type PixelContrastFailure = { target: string; ratio: number; required: number; color: string };

export async function checkPixelContrast(page: Page, targets: string[]): Promise<PixelContrastFailure[]> {
  await page.addStyleTag({
    content: `.${HIDE_CLASS}, .${HIDE_CLASS} * {
      color: transparent !important;
      -webkit-text-fill-color: transparent !important;
      fill: transparent !important;
      stroke: transparent !important;
      text-shadow: none !important;
      caret-color: transparent !important;
    }`,
  });

  const failures: PixelContrastFailure[] = [];
  for (const target of targets) {
    const element = page.locator(target).first();
    if (!(await element.isVisible())) continue;
    await element.scrollIntoViewIfNeeded();

    const text = await element.evaluate((el) => {
      const style = getComputedStyle(el);
      const svg = el instanceof SVGElement;
      const size = parseFloat(style.fontSize);
      const bold = Number(style.fontWeight) >= 700;
      return { color: svg ? style.fill : style.color, large: size >= 24 || (size >= 18.66 && bold) };
    });

    // Measure inside the content box: borders and padding are not behind the text
    // (a border in the text colour would otherwise count as background).
    const outer = await element.boundingBox();
    if (!outer) continue;
    const inset = await element.evaluate((el) => {
      const s = getComputedStyle(el);
      const px = (v: string) => parseFloat(v) || 0;
      return {
        top: px(s.borderTopWidth) + px(s.paddingTop),
        right: px(s.borderRightWidth) + px(s.paddingRight),
        bottom: px(s.borderBottomWidth) + px(s.paddingBottom),
        left: px(s.borderLeftWidth) + px(s.paddingLeft),
      };
    });
    const box = {
      x: outer.x + inset.left,
      y: outer.y + inset.top,
      width: outer.width - inset.left - inset.right,
      height: outer.height - inset.top - inset.bottom,
    };
    if (box.width < 1 || box.height < 1) continue;
    await element.evaluate((el, cls) => el.classList.add(cls), HIDE_CLASS);
    const png = await page.screenshot({ clip: box, animations: 'disabled', caret: 'hide' });
    await element.evaluate((el, cls) => el.classList.remove(cls), HIDE_CLASS);

    const ratio = await page.evaluate(
      async ({ base64, color, coverage }) => {
        const parse = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number);
        const channel = (v: number) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        const luminance = (r: number, g: number, b: number) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

        const img = new Image();
        img.src = `data:image/png;base64,${base64}`;
        await img.decode();
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        const [tr, tg, tb, ta = 1] = parse(color);
        const ratios: number[] = [];
        for (let i = 0; i < data.length; i += 4) {
          const [br, bg, bb] = [data[i], data[i + 1], data[i + 2]];
          // Semi-transparent text is blended over each background pixel.
          const fg = luminance(tr * ta + br * (1 - ta), tg * ta + bg * (1 - ta), tb * ta + bb * (1 - ta));
          const back = luminance(br, bg, bb);
          ratios.push((Math.max(fg, back) + 0.05) / (Math.min(fg, back) + 0.05));
        }
        ratios.sort((a, b) => a - b);
        return ratios[Math.floor(ratios.length * (1 - coverage))];
      },
      { base64: png.toString('base64'), color: text.color, coverage: COVERAGE },
    );

    const required = text.large ? 3 : 4.5;
    if (ratio < required) failures.push({ target, ratio: Math.round(ratio * 100) / 100, required, color: text.color });
  }
  return failures;
}
