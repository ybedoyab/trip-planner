import { MapPin, Snowflake } from "lucide-react";
import { formatDateLabel } from "../lib/format";
import { useTravel } from "../state/TravelProvider";
import type { DayPlan } from "../types/travel";

interface Props {
  days: DayPlan[];
  onOpenDay: (dayId: string) => void;
}

export function ItineraryView({ days, onOpenDay }: Props) {
  const { state, traveler } = useTravel();
  if (!traveler) return null;
  const progress = state.progress[traveler];

  return (
    <>
      <header className="page-header">
        <div>
          <span className="eyebrow">6 dic 2026 → 5 ene 2027</span>
          <h1>Ruta completa</h1>
          <p>Kansai → Chūgoku → Kyūshū → Tokyo → Tōhoku → Hokkaidō.</p>
        </div>
      </header>

      <div className="route-list">
        {days.map((day) => (
          <button key={day.id} className="route-row" onClick={() => onOpenDay(day.id)}>
            <div className="date-block">
              <strong>{formatDateLabel(day.date)}</strong>
              <small>{day.region}</small>
            </div>
            <div>
              <strong>{day.city}</strong>
              <span className="japanese">{day.japanese} {day.reading ? `（${day.reading}）` : ""}</span>
              <small>{day.title}</small>
            </div>
            <div className="route-status">
              {day.optionalExtension && <Snowflake size={15} />}
              {progress.completedDays[day.id] ? "✓" : <MapPin size={15} />}
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
