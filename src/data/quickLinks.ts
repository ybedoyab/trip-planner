import { Languages, MapPinned, Plane, TrainFront, WalletCards } from "lucide-react";

export const quickLinks = [
  {
    label: "Google Translate",
    url: "https://translate.google.com/?sl=ja&tl=es",
    icon: Languages,
    note: "Japonés ↔ español",
  },
  {
    label: "Conversor JPY → COP",
    url: "https://www.google.com/search?q=JPY+to+COP",
    icon: WalletCards,
    note: "Tasa actual",
  },
  {
    label: "Google Maps",
    url: "https://maps.google.com/",
    icon: MapPinned,
    note: "Navegación",
  },
  {
    label: "JR West",
    url: "https://www.westjr.co.jp/global/en/",
    icon: TrainFront,
    note: "Kansai / Hiroshima",
  },
  {
    label: "JR Kyushu",
    url: "https://www.jrkyushu.co.jp/english/",
    icon: TrainFront,
    note: "Fukuoka / Nagasaki / Kumamoto",
  },
  {
    label: "Japan Transit Planner",
    url: "https://world.jorudan.co.jp/mln/en/",
    icon: Plane,
    note: "Rutas y horarios",
  },
];
