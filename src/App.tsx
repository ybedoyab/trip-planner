import { useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { BudgetView } from "./components/BudgetView";
import { DayView } from "./components/DayView";
import { ItineraryView } from "./components/ItineraryView";
import { ReservationsView } from "./components/ReservationsView";
import { TravelMap } from "./components/TravelMap";
import { UserGate } from "./components/UserGate";
import { itinerary } from "./data/itinerary";
import { useTravel } from "./state/TravelProvider";
import type { Section } from "./types/travel";

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
      case "map":
        return (
          <>
            <header className="page-header">
              <div>
                <span className="eyebrow">Mapa interactivo</span>
                <h1>Japón, punto por punto</h1>
                <p>Toca una parada para ver la fecha y abrir el día. Azul = extensión norte opcional.</p>
              </div>
            </header>
            <div className="map-layout">
              <TravelMap days={itinerary} onOpenDay={openDay} />
              <aside className="map-aside">
                <span className="eyebrow">Ruta maestra</span>
                <h2>Kansai → Kyūshū → Tokyo → norte</h2>
                <p>La ruta evita volver innecesariamente hacia el oeste. Los marcadores azules son la extensión después de Año Nuevo.</p>
              </aside>
            </div>
          </>
        );
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
