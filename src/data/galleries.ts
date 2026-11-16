import type { GalleryImage } from "../types/travel";

const commons = (fileName: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1600`;

export const galleriesByDay: Record<string, GalleryImage[]> = {
  "2026-12-09": [
    {
      url: commons("Kiyomizu-dera in Kyoto-r.jpg"),
      alt: "Kiyomizu-dera en Kyoto",
      title: "Kiyomizu-dera",
      credit: "Wikimedia Commons · Oilstreet",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Kiyomizu-dera_in_Kyoto-r.jpg",
    },
    {
      url: commons("Kyoto from Kiyomizu-Dera.jpg"),
      alt: "Vista de Kyoto desde Kiyomizu-dera",
      title: "Kyoto desde Kiyomizu-dera",
      credit: "Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Kyoto_from_Kiyomizu-Dera.jpg",
    },
  ],
  "2026-12-10": [
    {
      url: commons("Fushimi Inari-Taisha.jpg"),
      alt: "Torii de Fushimi Inari-Taisha",
      title: "Fushimi Inari",
      credit: "Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Fushimi_Inari-Taisha.jpg",
    },
  ],
  "2026-12-16": [
    {
      url: commons("Atomic Bomb Dome in Hiroshima.jpg"),
      alt: "Atomic Bomb Dome en Hiroshima",
      title: "A-Bomb Dome",
      credit: "Wikimedia Commons · CrypticToad",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Atomic_Bomb_Dome_in_Hiroshima.jpg",
    },
  ],
  "2026-12-23": [
    {
      url: commons("Takachiho-gorge.jpg"),
      alt: "Takachiho Gorge y Manai Falls",
      title: "Takachiho Gorge",
      credit: "Wikimedia Commons · Takasunrise0921",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Takachiho-gorge.jpg",
    },
    {
      url: commons("Takachiho Gorge (52133238863).jpg"),
      alt: "Vista del cañón de Takachiho",
      title: "Takachiho Gorge",
      credit: "Wikimedia Commons · Raita Futo",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Takachiho_Gorge_(52133238863).jpg",
    },
    {
      url: commons("Takachiho Gorge (52133238898).jpg"),
      alt: "Otra vista de Takachiho Gorge",
      title: "Manai Falls y garganta",
      credit: "Wikimedia Commons · Raita Futo",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Takachiho_Gorge_(52133238898).jpg",
    },
  ],
  "2026-12-25": [
    {
      url: commons("Shibuya crossing, Tokyo, Japan.jpg"),
      alt: "Shibuya Crossing en Tokyo",
      title: "Shibuya Crossing",
      credit: "Wikimedia Commons · Joli Rumi",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Shibuya_crossing,_Tokyo,_Japan.jpg",
    },
    {
      url: commons("View of Shibuya Crossing.jpg"),
      alt: "Vista elevada de Shibuya Crossing",
      title: "Shibuya desde arriba",
      credit: "Wikimedia Commons · Ewong17",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:View_of_Shibuya_Crossing.jpg",
    },
  ],
};
