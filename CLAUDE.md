# Ailleurs — booking site for 4 themed tiny houses

Premium booking site for four small themed holiday houses (max ~40 m² each, terrace, small pool, lush garden), **all located on Réunion Island**:

| Slug | House | Universe | Nav word |
| --- | --- | --- | --- |
| `kumo` | Maison Kumo | Japan | Kumo · 雲 · nuage |
| `vetiver` | Case Vétiver | Réunion Creole | Lakaz · kréol · la maison |
| `zellij` | Riad Zellij | Morocco | Dar · دار · la maison |
| `sawah` | Villa Sawah | Bali | Sawah · ᬲᬯᬄ · la rizière (Balinese spelling to be validated) |

## Stack

- Astro (static), no UI framework. View Transitions via `<ClientRouter />` in `src/layouts/Base.astro`.
- Content lives in `src/data/houses.ts` (copy in French, code in English).
- Each page sets its theme as CSS variables on `<html>` (`themeStyle()`); `src/styles/global.css` reads them.
- `src/components/Photo.astro` renders `/public/images/<slug>/<shot>.jpg` if the file exists, else a labelled placeholder.
  Expected shots: `01-drone`, `02-terrace`, `03-chill`, `04-signature`, `05-bedroom`, `06-bathroom`, `07-garden`.

## Design rules

- Reference mood: nakagawa-corp.com, stillform.homes, bcgbuildingdesign.com.au, residences.loamhouse.com.au — quiet, editorial, premium.
- Transitions stay subtle: crossfade + slight blur, shared-element morph of the hero photo (`transition:name="hero-<slug>"`). No full-screen color wipes.
- Header: brand uses its own fixed font (`--font-brand`), each nav tab uses its house's font, so the header never changes font between pages. The Réserver button is hidden on home.
- No rounded corners on buttons or chips (square edges = premium).
- Home: 4 full-height cards; hovered card grows and reveals the house preview (preview is fixed-width so the photo never rescales). On tablet (≤860px) 2×2 grid and on phone (≤600px) 4 stacked rows, both fitting exactly one screen (`100dvh`), no nav bar.
- Phone house pages show a floating "Réserver" bar.

## Conventions

- All code, identifiers, file names and comments in English. UI copy in French.
- Stay facts, prices, addresses, travel times and contact details in `src/data/houses.ts` are plausible dummy values (Saint-Leu, airport Roland-Garros) — they must be validated before going live.
- Booking form is front-end only for now (TODO: connect to a booking engine / channel manager).
- AI-generated images are mood images only; real photos must replace them before going live.

## Commands

```sh
npm install
npm run dev      # http://localhost:4321
npm run build
npm run check    # astro check (types)
npm test         # Playwright + axe on the build (run `npm run build` first)
```

## Tests

- `tests/accessibility.spec.ts`: axe-core WCAG 2.2 AA (incl. colour contrast) on every page, the home hover state and the open lightbox; links and buttons must have a visible name.
- `tests/contrast.ts`: text axe cannot judge (over a photo, gradient, overlap or pseudo element) is measured from real pixels: text hidden, background screenshotted, 95% of pixels must meet 4.5:1 (3:1 large).
- `tests/site.spec.ts`: no console errors or 404s, SEO metadata, image alt text, internal links/assets under the `/ailleurs-site` base path, no `[PLACEHOLDER]` left.
- `tests/behaviour.spec.ts`: nav underline, home one-screen layout on tablet/phone, booking date rules, carousel loop, lightbox keyboard, phone booking bar.
- Run on desktop, tablet and phone viewports. CI (`.github/workflows/ci.yml`) runs check + build + tests on every PR.
- Accessible names must contain the visible text (WCAG 2.5.3): don't put an `aria-label` that differs from what is shown.

## Deployment

- GitHub repo: `michaelwautier/ailleurs-site` (public).
- GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`: https://michaelwautier.github.io/ailleurs-site/
- `astro.config.mjs` sets `base: '/ailleurs-site'`, so every internal link and asset path must go through `withBase()` (`src/lib/url.ts`).
