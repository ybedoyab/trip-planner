import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { FileSource, PMTiles } from "pmtiles";
import { leafletLayer } from "protomaps-leaflet";

const attribution = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · <a href="https://protomaps.com/">Protomaps</a>';

export function OfflineStreets({ onReady }: { onReady: (ready: boolean) => void }) {
  const map = useMap();

  useEffect(() => {
    const controller = new AbortController();
    let layer: ReturnType<typeof leafletLayer> | undefined;
    async function addStreets() {
      const response = await fetch("/maps/trip-streets.pmtiles", { signal: controller.signal });
      if (!response.ok) throw new Error("Street map unavailable");
      const file = new File([await response.blob()], "trip-streets.pmtiles");
      const archive = new PMTiles(new FileSource(file));
      await archive.getHeader();
      if (controller.signal.aborted) return;
      layer = leafletLayer({ url: archive, theme: "dark", maxDataZoom: 14, pane: "offline-streets", attribution, noWrap: true });
      layer.addTo(map);
      onReady(true);
    }
    addStreets().catch(() => { if (!controller.signal.aborted) onReady(false); });
    return () => {
      controller.abort();
      layer?.remove();
      onReady(false);
    };
  }, [map, onReady]);

  return null;
}
