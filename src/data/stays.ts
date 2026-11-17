export const stays = [
  [
    "2026-12-06",
    "2026-12-07",
    "Madrid · Barajas",
    "Aeropuerto Madrid-Barajas",
    "00:45 objetivo de llegada al hotel, ya el 7 dic. Reservar desde la noche del 6 y avisar de la llegada después de medianoche. 09:20 objetivo en terminal para el vuelo de 12:20.",
    "ibis Madrid Aeropuerto Barajas",
    "Hotel Clement Barajas"
  ],
  [
    "2026-12-08",
    "2026-12-14",
    "Kioto",
    "Kyoto Station · Hachijō",
    "15:45–17:00 objetivo para llegar desde KIX. El 14, salir del hotel hacia Kyoto Station a las 07:30 si el evento de Osaka es por la mañana.",
    "ibis Styles Kyoto Station",
    "Piece Hostel Kyoto",
    "Miyako Hotel Kyoto Hachijo"
  ],
  [
    "2026-12-14",
    "2026-12-16",
    "Osaka",
    "Namba / Daikokuchō",
    "Dejar equipaje si el alojamiento lo admite. 17:00–19:00 entrada. El 16, salir a las 07:15 hacia Shin-Osaka para el tramo a Hiroshima.",
    "Sotetsu Fresa Inn Osaka Namba",
    "Airbnb cerca de Daikokuchō"
  ],
  [
    "2026-12-16",
    "2026-12-17",
    "Hiroshima",
    "JR Hiroshima Station",
    "Dejar maletas al llegar si el hotel lo permite. 16:00–18:00 entrada. El 17, salir hacia la estación a las 07:30 para enlazar con el bus a Akiyoshidō.",
    "Hotel Granvia Hiroshima",
    "Via Inn Prime Hiroshima Shinkansenguchi"
  ],
  [
    "2026-12-17",
    "2026-12-19",
    "Fukuoka",
    "JR Hakata · salida Chikushi",
    "17:30–19:30 entrada tras Akiyoshidō. El 19, salir a las 07:30 para el tramo por Imari. Si van a lavar ropa, verifiquen qué tipo de habitación incluye lavadora.",
    "Tokyu Stay Hakata",
    "JR Kyushu Hotel Blossom Fukuoka"
  ],
  [
    "2026-12-19",
    "2026-12-20",
    "Nagasaki",
    "JR Nagasaki Station",
    "18:00–20:00 entrada tras Imari. El 20, salir a las 08:15 hacia el Parque de la Paz. Recoger maletas antes del tren a Kumamoto.",
    "JR Kyushu Hotel Nagasaki",
    "Hotel New Nagasaki"
  ],
  [
    "2026-12-20",
    "2026-12-22",
    "Kumamoto",
    "JR Kumamoto Station",
    "17:00–19:00 entrada. El 22, salir del hotel a las 08:00 hacia el tren de Aso. Para visitar el castillo, usar el tranvía desde la estación.",
    "THE BLOSSOM KUMAMOTO",
    "Toyoko Inn Kumamoto Ekimae"
  ],
  [
    "2026-12-22",
    "2026-12-23",
    "Aso",
    "JR Aso Station",
    "16:00–18:00 entrada tras Kusasenri. El 23, salir con 30 min de margen para el bus reservado. Confirmen parada y frecuencia antes de elegir hotel.",
    "Fairfield by Marriott Kumamoto Aso",
    "Aso Base Backpackers"
  ],
  [
    "2026-12-23",
    "2026-12-24",
    "Takachiho",
    "Takachiho Bus Center",
    "16:00–18:00 entrada. El 24, llegar al Bus Center 25 min antes del servicio confirmado a Miyazaki y dejar margen para el traslado y el vuelo a Haneda.",
    "Solest Takachiho Hotel",
    "Hotel Grateful Takachiho"
  ],
  [
    "2026-12-24",
    "2027-01-01",
    "Tokio",
    "Ueno / Okachimachi",
    "Después de Haneda, avisar si llegarán tarde. El 27, salir a las 07:15 hacia Tokyo Station y dejar margen para llegar a los andenes Keiyō. El 28, salir a las 07:00 hacia Busta Shinjuku. El 1, salir hacia Ueno o Tokyo Station a las 07:30 según el tren reservado.",
    "Hotel Sardonyx Ueno",
    "Airbnb en Okachimachi",
    "Sotetsu Fresa Inn Ueno-Okachimachi"
  ],
  [
    "2027-01-01",
    "2027-01-03",
    "Yamagata",
    "JR Yamagata Station",
    "16:00–18:00 entrada. El 2, regresar al mismo hotel tras Ginzan si el shuttle lo permite. El 3, salir hacia JR Yamagata a las 07:30.",
    "Hotel Metropolitan Yamagata",
    "Richmond Hotel Yamagata Ekimae"
  ],
  [
    "2027-01-03",
    "2027-01-04",
    "Hirosaki",
    "JR Hirosaki Station",
    "15:00–17:00 entrada antes de la iluminación. El 4, calcular la salida hacia Aomori a partir del vuelo o tren confirmado y del bus al aeropuerto.",
    "Art Hotel Hirosaki City",
    "Toyoko Inn Hirosaki Ekimae"
  ],
  [
    "2027-01-04",
    "2027-01-05",
    "Sapporo",
    "JR Sapporo Station",
    "Dejar maletas al llegar antes de ir a Bankei. Confirmar la hora del vuelo del 5 antes de fijar salida del hotel o contar con Teine.",
    "JR Inn Sapporo",
    "Hotel Gracery Sapporo",
    "JR Tower Hotel Nikko Sapporo"
  ]
] as const;
import { itinerary } from "./itinerary";

export function stayBudget(start: string, end: string) {
  const nights = itinerary.filter((day) => day.date >= start && day.date < end);
  const total = nights.reduce((sum, day) => sum + (day.hotel?.budgetJpyRoom ?? 0), 0);
  return { total, nightly: nights.length ? Math.round(total / nights.length) : 0 };
}
