export interface MapPoint {
  id: string;
  name: string;
  subtitle: string;
  lat: number;
  lng: number;
  mapsUrl?: string;
  note?: string;
  optional?: boolean;
}

export const flightStops: MapPoint[] = [
  { id: "mde", name: "Medellín (MDE)", subtitle: "6 dic · 04:30 salida", lat: 6.1645, lng: -75.4231, note: "Inicio del viaje." },
  { id: "bog", name: "Bogotá (BOG)", subtitle: "6 dic · 05:30 llegada · 07:50 salida", lat: 4.7016, lng: -74.1469, note: "Conexión nacional." },
  { id: "mad", name: "Madrid (MAD)", subtitle: "6 dic · 23:25 llegada · 7 dic · 12:20 salida", lat: 40.4983, lng: -3.5676, note: "Escala: 12 h 55 min." },
  { id: "pek", name: "Beijing (PEK)", subtitle: "8 dic · 06:20 llegada · 08:40 salida", lat: 40.0799, lng: 116.6031, note: "Escala: 2 h 20 min." },
  { id: "kix", name: "Osaka Kansai (KIX)", subtitle: "8 dic · 12:40 llegada", lat: 34.4347, lng: 135.2440, note: "Entrada a Japón." },
];

export const photoSpots: MapPoint[] = [
  {
    id: "glico",
    name: "Glico Sign · Ebisubashi",
    subtitle: "Osaka · neón clásico",
    lat: 34.6687, lng: 135.5013,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Glico+Sign+Dotonbori+Osaka",
    note: "Foto icónica con el corredor y el canal. Mejor después de encenderse los neones.",
  },
  {
    id: "fushimi",
    name: "Senbon Torii · Fushimi Inari",
    subtitle: "Kyoto · corredor de torii",
    lat: 34.96754, lng: 135.77944,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Senbon+Torii+Fushimi+Inari+Kyoto",
    note: "Para fotos con menos gente: muy temprano o al caer la tarde/noche.",
  },
  {
    id: "yasaka",
    name: "Yasaka Pagoda · Ninenzaka",
    subtitle: "Kyoto · postal de Higashiyama",
    lat: 34.9986, lng: 135.7796,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Yasaka+Pagoda+Kyoto",
    note: "El ángulo clásico está en Yasaka-dori. Amanecer o noche reducen las multitudes.",
  },
  {
    id: "kiyomizu",
    name: "Kiyomizu-dera",
    subtitle: "Kyoto · terraza y skyline",
    lat: 34.9948, lng: 135.7850,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Kiyomizu-dera+Kyoto",
    note: "Llegar cerca de apertura para una terraza más despejada.",
  },
  {
    id: "nara",
    name: "Nara Park",
    subtitle: "Nara · ciervos + paisaje",
    lat: 34.6850, lng: 135.8430,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Nara+Park+Japan",
    note: "Busca fondos con Todai-ji o zonas verdes; los ciervos son animales silvestres.",
  },
  {
    id: "kobe",
    name: "Kobe Harborland",
    subtitle: "Kobe · waterfront nocturno",
    lat: 34.67851, lng: 135.18031,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Kobe+Harborland",
    note: "Buen encuadre al anochecer con Port Tower y el puerto.",
  },
  {
    id: "shibuya",
    name: "Shibuya Scramble Crossing",
    subtitle: "Tokyo · ciudad en movimiento",
    lat: 35.65949, lng: 139.70050,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Shibuya+Scramble+Crossing",
    note: "Cruza y fotografía sin detenerte en la calzada; para vista elevada usa un mirador autorizado.",
  },
  {
    id: "sensoji",
    name: "Sensō-ji · Kaminarimon",
    subtitle: "Tokyo · templo + faroles",
    lat: 35.7148, lng: 139.7967,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Senso-ji+Tokyo",
    note: "Muy temprano para menos gente; de noche el exterior iluminado funciona muy bien.",
  },
  {
    id: "skytree",
    name: "Tokyo Skytree",
    subtitle: "Tokyo · skyline",
    lat: 35.7101, lng: 139.8107,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Tokyo+Skytree",
    note: "Atardecer y blue hour para combinar ciudad y luces.",
  },
  {
    id: "teamlab",
    name: "teamLab Planets",
    subtitle: "Tokyo · arte inmersivo",
    lat: 35.6491, lng: 139.7898,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=teamLab+Planets+Tokyo",
    note: "Reserva franja horaria; es un spot interior muy visual.",
  },
];
