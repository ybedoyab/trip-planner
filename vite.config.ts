import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function offlineItinerary(): Plugin {
  return {
    name: "offline-itinerary",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      const entry = Object.values(bundle).find((file) => file.type === "chunk" && file.isEntry);
      if (!entry || entry.type !== "chunk") return;
      const styles = Object.keys(bundle).filter((name) => /^assets\/index-.*\.css$/.test(name));
      const assets = ["/", "/" + entry.fileName, ...styles.map((name) => "/" + name)];
      this.emitFile({
        type: "asset",
        fileName: "trip-worker.js",
        source: `
const prefix = "japan-itinerary:";
const version = prefix + ${JSON.stringify(assets.join("|"))};
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
  event.respondWith(fetch(event.request).catch(async () => {
    const cached = await caches.open(version).then((cache) => cache.match(url.pathname));
    return cached ?? Response.error();
  }));
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
