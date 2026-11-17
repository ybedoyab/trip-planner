import { lazy, Suspense, useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { BudgetView } from "./components/BudgetView";
import { CalendarView } from "./components/CalendarView";
import { DayView } from "./components/DayView";
import { ItineraryView } from "./components/ItineraryView";
import { ReservationsView } from "./components/ReservationsView";
import { DiscoveryView } from "./components/DiscoveryView";
import { UserGate } from "./components/UserGate";
import { itinerary } from "./data/itinerary";
import { categories, type Category } from "./data/discovery";
import { formatDateLabel } from "./lib/format";
import { useTravel } from "./state/TravelProvider";
import type { Section } from "./types/travel";

const AIAssistantView = lazy(() => import("./components/AIAssistantView").then((module) => ({ default: module.AIAssistantView })));

const TravelMap = lazy(() => import("./components/TravelMap").then(({ TravelMap }) => ({ default: TravelMap })));

export default function App() {
  const { state, traveler } = useTravel();
  const [section, setSection] = useState<Section>("today");
  const [selectedDayId, setSelectedDayId] = useState(() => {
    const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    return itinerary.find((day) => day.date === today)?.id ?? itinerary[0].id;
  });
  const [interest, setInterest] = useState<Category | "">("");

  const selectedIndex = useMemo(
    () => Math.max(0, itinerary.findIndex((day) => day.id === selectedDayId)),
    [selectedDayId],
  );

  if (!traveler || !state.progress[traveler].preferences) return <UserGate key={traveler ?? "selection"} />;

  const openDay = (dayId: string) => {
    setSelectedDayId(dayId);
    setSection("today");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeSection = (next: Section) => {
    if (next === "explore") setInterest("");
    setSection(next);
    window.scrollTo(0, 0);
  };

  const content = (() => {
    switch (section) {
      case "explore":
      case "saved":
        return <DiscoveryView day={itinerary[selectedIndex]} saved={section === "saved"} initialCategory={interest}
          onSelectDay={setSelectedDayId} onOpenSaved={() => changeSection("saved")} />;
      case "more":
        return <section className="journey"><h1>Más del viaje</h1><div className="journey-actions">
          {([["calendar", "Calendario"], ["map", "Mapa y vuelos"], ["ai", "Concierge IA"], ["budget", "Presupuesto"], ["reservations", "Reservas"]] as const)
            .map(([id, label]) => <button key={id} onClick={() => changeSection(id)}>{label}</button>)}
        </div></section>;
      case "itinerary":
        return <ItineraryView days={itinerary} onOpenDay={openDay} />;
      case "calendar":
        return <CalendarView days={itinerary} onOpenDay={openDay} />;
      case "map":
        return (
          <>
            <header className="page-header">
              <div>
                <span className="eyebrow">Mapa interactivo</span>
                <h1>Rutas y puntos fotográficos</h1>
                <p>Explora la ruta de Japón o los vuelos y activa las capas de fotos, restaurantes y alojamientos.</p>
              </div>
            </header>
            <div className="map-layout">
              <Suspense fallback={<p>Cargando mapa…</p>}><TravelMap days={itinerary} onOpenDay={openDay} /></Suspense>
              <aside className="map-aside">
                <span className="eyebrow">Ruta maestra</span>
                <h2>Elige qué ver</h2>
                <p>Activa una capa y abre su lista para elegir lugares. Los restaurantes y alojamientos se agrupan por zona de referencia. Sus enlaces abren la ubicación en Maps.</p>
              </aside>
            </div>
          </>
        );
      case "ai":
        return <Suspense fallback={<div className="operation-note">Cargando Japan Companion…</div>}><AIAssistantView day={itinerary[selectedIndex]} /></Suspense>;
      case "budget":
        return <BudgetView days={itinerary} />;
      case "reservations":
        return <ReservationsView />;
      default:
        return (<>
          <section className="today-interests journey" aria-labelledby="today-interests-title">
            <span className="eyebrow">Explora el viaje</span>
            <h2 id="today-interests-title">¿Qué te interesa hoy?</h2>
            <label>Día del viaje
              <select value={selectedDayId} onChange={(event) => setSelectedDayId(event.target.value)}>
                {itinerary.map((day) => <option key={day.id} value={day.id}>{formatDateLabel(day.date)} · {day.city}</option>)}
              </select>
            </label>
            <div className="today-interest-options">
              {categories.map((category) => <button key={category} onClick={() => {
                changeSection("explore");
                setInterest(category);
              }}>{category}</button>)}
            </div>
          </section>
          <DayView
            day={itinerary[selectedIndex]}
            onExplore={() => changeSection("explore")}
            nextDay={itinerary[selectedIndex + 1]}
            onNext={
              itinerary[selectedIndex + 1]
                ? () => openDay(itinerary[selectedIndex + 1].id)
                : undefined
            }
          />
          </>
        );
    }
  })();

  return (
    <AppShell section={section} onSectionChange={changeSection}>
      {content}
    </AppShell>
  );
}
