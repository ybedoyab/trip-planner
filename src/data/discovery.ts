import { itinerary } from "./itinerary";
import { extrasByDay } from "./dayExtras";
import { specialStopsByDay } from "./specialStops";
import { photoSpots } from "./mapPoints";
import type { TravelSuggestion } from "../types/travel";

export const categories = ["Dónde comer", "Qué probar", "Compras", "Para conocer", "Vistas y fotos", "Anime y gaming"] as const;
export type Category = typeof categories[number];
export type Decision = "saved" | "dismissed";
export type DiscoveryItem = TravelSuggestion & { id: string; dayId: string; category: Category };

const photoStops: Record<string, string[]> = {
  "2026-12-09": ["kiyomizu", "yasaka"],
  "2026-12-10": ["fushimi"],
  "2026-12-14": ["glico"],
  "2026-12-25": ["shibuya"],
  "2026-12-29": ["sensoji"],
  "2026-12-30": ["teamlab"],
};

const localIdeas: Record<string, TravelSuggestion[]> = {
  "2027-01-04": [{
    title: "Pase y equipo para esquiar en Bankei",
    description: "Después de dejar las maletas. Comparen el paquete nocturno con el pase y el alquiler por separado. Revisen qué incluye el paquete y confirmen los horarios de alquiler y regreso.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sapporo+Bankei+Ski+Area",
    sourceUrl: "https://www.bankei.co.jp/liftprice-en/",
  }, {
    title: "Clase de esquí en inglés en Bankei",
    description: "Si es su primera vez, consulten disponibilidad con la escuela. Si no pueden conseguir una clase que encaje con la llegada, dejen el esquí de iniciación para otra fecha.",
    sourceUrl: "https://bankei-ski.com/english-lesson/",
  }],
  "2027-01-05": [{
    title: "Sapporo Teine si cuentan con el día libre",
    description: "Alternativa a Bankei si pueden dedicar un día al esquí y separar el traslado a CTS. Sustituye la visita al lago. El bus de ida y vuelta desde hoteles tiene horario fijo. Consulten también JR hasta Teine y la conexión al centro de esquí.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sapporo+Teine+Olympia+Ski+Center",
    sourceUrl: "https://sapporo-teine.com/snow/lang/en/access/",
  }],
  "2026-12-10": [{
    title: "Pausa de matcha en Byōdō-in Omotesandō",
    description: "Entre Byōdō-in y el regreso a la estación JR Uji. Haz una pausa en la calle comercial si queda margen para el siguiente tramo.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Byodoin+Omotesando+Uji",
    sourceUrl: "https://www.japan.travel/en/spot/685/",
  }],
  "2026-12-16": [{
    title: "Orizuru Tower",
    description: "Después del Parque de la Paz, junto a la Cúpula. El mirador añade una visita independiente y queda a pie del circuito principal.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Orizuru+Tower+Hiroshima",
    sourceUrl: "https://www.japan.travel/en/in/walks-and-tours/in-hiroshima/",
  }],
  "2026-12-29": [{
    title: "Vista al Skytree desde Sumida Park",
    description: "Después de Sensō-ji y antes de salir hacia Akihabara. Acércate a la ribera para fotografiar la torre desde Asakusa.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sumida+Park+Asakusa",
    sourceUrl: "https://www.japan.travel/en/destinations/kanto/tokyo/asakusa-and-around/",
  }],
};

export const discoveries = itinerary.flatMap((day) => {
  const extra = extrasByDay[day.id];
  const stops = (specialStopsByDay[day.id] ?? []).map((stop) => ({
    title: stop.title,
    description: stop.description,
    sourceUrl: stop.officialUrl,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(stop.title + " " + day.city),
  }));
  const nearby = day.activities.filter((activity) => activity.optional).map((activity) => ({
    title: activity.title,
    description: activity.description,
    sourceUrl: activity.officialUrl,
  }));
  const photos = photoSpots.filter((spot) => photoStops[day.id]?.includes(spot.id)).map((spot) => ({
    title: spot.name,
    description: spot.note ?? spot.subtitle,
    mapsUrl: spot.mapsUrl,
  }));
  const groups = [extra?.dining, extra?.food, extra?.shopping, [...(localIdeas[day.id] ?? []), ...nearby], photos, stops];
  return groups.flatMap((group, index): DiscoveryItem[] => (group ?? []).map((item) => ({
    ...item,
    id: [day.id, index, item.title].join("|"),
    dayId: day.id,
    category: categories[index],
  })));
});
