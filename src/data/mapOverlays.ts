import { extrasByDay } from "./dayExtras";
import { flightStops, photoSpots } from "./mapPoints";
import { stayBudget, stays } from "./stays";
import { formatJpy } from "../lib/format";
import type { DayPlan } from "../types/travel";

export const mapLayers = { photos: "Fotos", dining: "Restaurantes", lodging: "Alojamientos" } as const;
export type MapLayer = keyof typeof mapLayers;

export interface MapPlace {
  id: string;
  name: string;
  url?: string;
  note?: string;
}

export interface MapGroup {
  id: string;
  layer: MapLayer;
  title: string;
  center: [number, number];
  places: MapPlace[];
  dayId?: string;
  approximate?: boolean;
}

const stationPoints: Record<string, [number, number]> = {
  "2026-12-06": [40.4983, -3.5676],
  "2026-12-08": [34.9858, 135.7588],
  "2026-12-14": [34.6635, 135.5018],
  "2026-12-16": [34.3975, 132.4755],
  "2026-12-17": [33.5898, 130.4206],
  "2026-12-19": [32.7543, 129.8688],
  "2026-12-20": [32.7903, 130.6892],
  "2026-12-22": [32.9371, 131.0802],
  "2026-12-23": [32.712, 131.309],
  "2026-12-24": [35.7075, 139.7747],
  "2027-01-01": [38.248, 140.327],
  "2027-01-03": [40.599, 140.485],
  "2027-01-04": [43.0687, 141.3508],
};
const listingUrls: Record<string, string> = {
  "Airbnb cerca de Daikokuchō": "https://www.airbnb.com/rooms/36128728",
  "Airbnb en Okachimachi": "https://www.airbnb.com/okachimachi-japan/stays",
};

export function buildMapGroups(days: DayPlan[]): MapGroup[] {
  const photos: MapGroup[] = photoSpots.map((spot) => ({
    id: spot.id, layer: "photos", title: spot.name, center: [spot.lat, spot.lng],
    places: [{ id: "photo:" + spot.id, name: spot.name, url: spot.mapsUrl, note: spot.note }],
  }));
  const lodging: MapGroup[] = stays.map(([start, end, city, station, , ...options]) => ({
    id: "lodging:" + start, layer: "lodging", title: station, center: stationPoints[start],
    dayId: start, approximate: true,
    places: options.map((name) => ({
      id: `stay:${start}:${name}`, name,
      url: listingUrls[name] ?? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(name + " " + city),
      note: `Presupuesto de la zona para dos · ${formatJpy(stayBudget(start, end).nightly)}/noche`,
    })),
  }));
  const dining: MapGroup[] = days.flatMap((day) => {
    const options = (extrasByDay[day.id]?.dining ?? []).filter((item) => item.mapsUrl);
    if (!options.length) return [];
    const airport = day.id === "2026-12-06" ? flightStops[1] : day.id === "2026-12-07" ? flightStops[2] : undefined;
    const center = airport ?? day.coordinates;
    return [{
      id: "dining:" + day.id, layer: "dining", title: day.city, center: [center.lat, center.lng],
      dayId: day.id, approximate: true,
      places: options.map((item) => ({
        id: `food:${day.id}:${item.title}`, name: item.title, url: item.mapsUrl,
        note: [item.priceHint, item.description].filter(Boolean).join(" · "),
      })),
    }];
  });
  return [...photos, ...dining, ...lodging];
}
