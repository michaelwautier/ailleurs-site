/**
 * Prefix an absolute site path with the configured base
 * (e.g. "/ailleurs-site" on GitHub Pages, "" on a custom domain).
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
