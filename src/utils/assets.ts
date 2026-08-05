// The web app is deployed to GitHub Pages under a repo subpath
// (https://omidadlii01.github.io/silaneh-sabz-plus/), configured via Vite's
// `base` (see vite.config.ts / BASE_PATH env in .github/workflows/deploy-pages.yml).
//
// Vite automatically rewrites asset references it can see at build time
// (imports, index.html tags), but it has no way to rewrite plain string
// literals like '/logo-full.png' used as an <img src> at runtime, or values
// that come back from the backend/D1 (e.g. a brand's image_url column).
// Those root-relative paths resolve against the *domain* root
// (https://omidadlii01.github.io/logo-full.png — which doesn't exist)
// instead of the app's subpath, which is why the header logo, brand
// section logos, and any other locally-hosted asset rendered broken.
//
// This helper resolves a root-relative local path against the app's actual
// base path. External absolute URLs (e.g. the raw.githubusercontent.com
// product photo URLs already stored in the DB) are left untouched.
export function assetUrl(path: string | undefined | null): string {
  if (!path) return '';
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
