// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Served as a static subtree under the portfolio's own domain, at
  // /cad-web/demo-archi/ — every asset URL Vite emits needs that prefix.
  vite: { base: "/cad-web/demo-archi/" },
  // Same pattern as portfolio/vite.config.ts: pin the preset so platform
  // auto-detection doesn't swap in a server output layout the prerender
  // step doesn't recognize — only .output/public (static HTML) is ever
  // published, copied into the portfolio's own public/ at build time.
  nitro: { preset: "cloudflare-module" },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // No server functions, no backend — prerender to static HTML so it can
    // be served as a plain file tree alongside the portfolio.
    prerender: { enabled: true },
    // /projects renders its project cards client-side only (not present in
    // the crawled SSR HTML), so the crawler never discovers the 5 studio
    // tour pages on its own — list them explicitly. Keep in sync with the
    // `id`s in src/lib/studio-data.ts.
    pages: [
      { path: "/studio/tour-helios-594a0176-2777-4ae3-a475-359332f8337f" },
      { path: "/studio/campus-nord-1238d6dd-68cf-4f79-a7f6-f978057cf815" },
      { path: "/studio/hopital-lumiere-8567f129-8fcc-4b53-997b-7d10df369142" },
      { path: "/studio/gare-atlantique-483a7973-c7f8-4e19-b087-13de4b26e1bc" },
      { path: "/studio/residence-onyx-f77d9706-ebed-431d-bd9b-448b8c11cbf6" },
    ],
  },
});
