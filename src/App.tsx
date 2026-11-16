import { lazy, Suspense, useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { BudgetView } from "./components/BudgetView";
import { CalendarView } from "./components/CalendarView";
import { DayView } from "./components/DayView";
import { ItineraryView } from "./components/ItineraryView";
import { ReservationsView } from "./components/ReservationsView";
import { TravelMap } from "./components/TravelMap";
import { UserGate } from "./components/UserGate";
import { itinerary } from "./data/itinerary";
import { useTravel } from "./state/TravelProvider";
import type { Section } from "./types/travel";

const AIAssistantView = lazy(() => import("./components/AIAssistantView").then((module) => ({ default: module.AIAssistantView })));

export default function App() {
  const { traveler } = useTravel();
  const [section, setSection] = useState<Section>("today");
  const [selectedDayId, setSelectedDayId] = useState(itinerary[0].id);

  const selectedIndex = useMemo(
    () => Math.max(0, itinerary.findIndex((day) => day.id === selectedDayId)),
    [selectedDayId],
  );

  if (!traveler) return <UserGate />;

  const openDay = (dayId: string) => {
    setSelectedDayId(dayId);
    setSection("today");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const content = (() => {
    switch (section) {
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
                <p>Cambia entre Japón, vuelos internacionales y photo spots. Beijing (PEK) aparece explícitamente en la ruta aérea.</p>
              </div>
            </header>
            <div className="map-layout">
              <TravelMap days={itinerary} onOpenDay={openDay} />
              <aside className="map-aside">
                <span className="eyebrow">Ruta maestra</span>
                <h2>Japón + ruta aérea + fotos</h2>
                <p>Usa las pestañas del mapa. La capa Vuelos muestra MDE → BOG → MAD → PEK → KIX; Fotos incluye enlaces directos para navegación.</p>
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
        return (
          <DayView
            day={itinerary[selectedIndex]}
            nextDay={itinerary[selectedIndex + 1]}
            onNext={
              itinerary[selectedIndex + 1]
                ? () => openDay(itinerary[selectedIndex + 1].id)
                : undefined
            }
          />
        );
    }
  })();

  return (
    <AppShell section={section} onSectionChange={setSection}>
      {content}
    </AppShell>
  );
}
