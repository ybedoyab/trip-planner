import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const source = "https://github.com/ybedoyab/trip-planner/releases/download/android-map-2026-11-16/trip-streets.pmtiles";
const expected = "58403f1973a27a0db06ce70cfc69108dc25fd64134c15a4a810f25ac3de5d420";
const destination = new URL("../android/app/src/main/assets/public/maps/", import.meta.url);

async function loadMap() {
  if (process.env.TRIP_MAP_SOURCE) return readFile(process.env.TRIP_MAP_SOURCE);
  const response = await fetch(source, { signal: AbortSignal.timeout(180_000) });
  if (!response.ok) throw new Error(`Map download failed with HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

const data = await loadMap();
const checksum = createHash("sha256").update(data).digest("hex");
if (checksum !== expected) throw new Error("The Android map checksum does not match the expected package.");
await mkdir(destination, { recursive: true });
await writeFile(new URL("trip-streets.pmtiles", destination), data);
console.log(`Bundled offline street map (${Math.round(data.length / 1_000_000)} MB).`);
