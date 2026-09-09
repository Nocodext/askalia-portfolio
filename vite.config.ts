// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { existsSync, statSync, createReadStream } from "node:fs";
import { extname, join, normalize } from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

// Dev-only: `public/cad-web/` holds two prebuilt static sites (demo-archi,
// blog) that ship alongside the portfolio's own build output in production,
// where a plain static host (Netlify) resolves nested directories to their
// index.html on its own. The dev server has no such static-host behavior —
// TanStack Start's own SSR middleware claims every request that doesn't
// match a known asset file first (deterministic middleware order, not a
// race — it's just ahead of Vite's public-dir serving in the pipeline), so
// `/cad-web/demo-archi/` 404s instead of falling through. This plugin
// serves that subtree directly, registered with `order: "pre"` so it runs
// before every other middleware regardless of plugin registration order.
// Purely a dev convenience: unused in the actual build/deploy.
function cadWebStaticDevPlugin(): Plugin {
  return {
    name: "cad-web-static-dev",
    apply: "serve",
    configureServer: {
      order: "pre",
      handler(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url || !req.url.startsWith("/cad-web/")) return next();

          const pathname = decodeURIComponent(req.url.split("?")[0]!);
          const relative = normalize(pathname).replace(/^([/\\]|\.\.[/\\]?)+/, "");
          const publicDir = join(server.config.root, "public");
          const requested = join(publicDir, relative);
          if (!requested.startsWith(publicDir)) return next(); // no path traversal

          const candidates = [
            requested,
            join(requested, "index.html"),
            `${requested}.html`,
          ];
          const filePath = candidates.find((p) => existsSync(p) && statSync(p).isFile());
          if (!filePath) return next();

          res.setHeader("Content-Type", MIME_TYPES[extname(filePath)] ?? "application/octet-stream");
          createReadStream(filePath).pipe(res);
        });
      },
    },
  };
}

export default defineConfig({
  vite: { plugins: [cadWebStaticDevPlugin()] },
  // Fully static site (no server functions) — pin the preset so CI platform
  // auto-detection (e.g. Netlify's `netlify` preset) doesn't swap in a server
  // output layout the prerender step doesn't recognize. Only .output/public
  // (the prerendered static HTML) ever gets published; this server bundle is
  // build-time-only, used solely to crawl-render the pages.
  nitro: { preset: "cloudflare-module" },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Fully static content (no server functions) — prerender to plain HTML at build time
    // so the site is crawlable without JS and can be hosted on Netlify with no functions.
    // "/" links to "/en" and vice versa, so crawlLinks (default on) discovers both from "/".
    // The crawler's own link discovery is a blunt regex over every <a href="/...">
    // it renders — it doesn't distinguish an app route from a same-origin static
    // asset link (e.g. a PDF download), so it tries to "prerender" those too and
    // fails the whole build on their 404. Extensioned paths are never real routes
    // in this router, so filter them out of the crawl. Same story for /cad-web/ —
    // that's cad-web/demo-archi's own prerendered static site, copied into public/
    // by `npm run build:cad-web-demo`; it isn't one of this app's routes either.
    prerender: {
      enabled: true,
      filter: (page: { path: string }) =>
        !/\.[a-z0-9]+$/i.test(page.path) && !page.path.startsWith("/cad-web/"),
    },
  },
});
