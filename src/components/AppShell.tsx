import { CalendarDays, Map, ReceiptJapaneseYen, Route, TicketCheck } from "lucide-react";
import type { PropsWithChildren } from "react";
import { useTravel } from "../state/TravelProvider";
import type { Section } from "../types/travel";

interface Props extends PropsWithChildren {
  section: Section;
  onSectionChange: (section: Section) => void;
}

const items: Array<{ id: Section; label: string; icon: typeof CalendarDays }> = [
  { id: "today", label: "Hoy", icon: CalendarDays },
  { id: "itinerary", label: "Ruta", icon: Route },
  { id: "map", label: "Mapa", icon: Map },
  { id: "budget", label: "Presupuesto", icon: ReceiptJapaneseYen },
  { id: "reservations", label: "Reservas", icon: TicketCheck },
];

export function AppShell({ section, onSectionChange, children }: Props) {
  const { traveler, clearTraveler } = useTravel();

  const nav = (mobile = false) => (
    <nav className={mobile ? "mobile-nav" : "side-nav"}>
      {items.map(({ id, label, icon: Icon }) => (
        <button key={id} className={section === id ? "active" : ""} onClick={() => onSectionChange(id)}>
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">日本 2026<small>YULIAN × DANIEL</small></div>
        {nav()}
        <button className="traveler-chip" onClick={clearTraveler}>{traveler} <span>Cambiar</span></button>
      </aside>
      <div className="mobile-header">
        <strong>日本 2026</strong>
        <button onClick={clearTraveler}>{traveler}</button>
      </div>
      <main>{children}</main>
      {nav(true)}
    </div>
  );
}
