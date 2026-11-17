import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function offlineItinerary(): Plugin {
  return {
    name: "offline-itinerary",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      const entry = Object.values(bundle).find((file) => file.type === "chunk" && file.isEntry);
      if (!entry || entry.type !== "chunk") return;
      const publicDir = resolve("public");
      const publicFiles = readdirSync(publicDir, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => resolve(entry.parentPath, entry.name))
        .sort();
      const publicPaths = publicFiles.map((file) => file.slice(publicDir.length).replaceAll("\\", "/"));
      const assets = ["/", ...Object.keys(bundle).filter((name) => name.startsWith("assets/") && !name.endsWith(".map"))
        .map((name) => "/" + name), ...publicPaths];
      const hash = createHash("sha256").update(JSON.stringify(assets));
      for (const file of publicFiles) hash.update(readFileSync(file));
      const version = hash.digest("hex").slice(0, 16);
      this.emitFile({
        type: "asset",
        fileName: "trip-worker.js",
        source: `
const prefix = "japan-itinerary:";
const version = prefix + ${JSON.stringify(version)};
const assets = ${JSON.stringify(assets)};
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(version).then((cache) => cache.addAll(assets)));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith(prefix) && key !== version).map((key) => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !assets.includes(url.pathname)) return;
  event.respondWith((async () => {
    const cached = await caches.open(version).then((cache) => cache.match(url.pathname));
    if (url.pathname !== "/" && cached) return cached;
    try {
      const response = await fetch(event.request);
      return response.ok ? response : cached ?? response;
    } catch {
      return cached ?? Response.error();
    }
  })());
});`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), offlineItinerary()],
  build: {
    sourcemap: true,
  },
});
