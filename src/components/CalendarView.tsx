import { CalendarDays, MapPin } from "lucide-react";
import { formatDateLabel } from "../lib/format";
import type { DayPlan } from "../types/travel";

interface Props {
  days: DayPlan[];
  onOpenDay: (dayId: string) => void;
}

const weekdayLabels = ["L", "M", "X", "J", "V", "S", "D"];

function monthGrid(year: number, month: number, days: DayPlan[], onOpenDay: (id: string) => void) {
  const first = new Date(Date.UTC(year, month, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: Array<number | null> = [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  const byDate = new Map(days.map((day) => [day.date, day]));
  const label = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month, 1)));

  return (
    <section className="calendar-month" key={`${year}-${month}`}>
      <div className="calendar-month-title"><CalendarDays size={17} /><strong>{label}</strong></div>
      <div className="calendar-weekdays">{weekdayLabels.map((day) => <span key={day}>{day}</span>)}</div>
      <div className="calendar-grid">
        {cells.map((number, index) => {
          if (!number) return <div key={`empty-${index}`} className="calendar-cell empty" />;
          const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(number).padStart(2, "0")}`;
          const plan = byDate.get(date);
          return (
            <button key={date} className={`calendar-cell ${plan ? "has-plan" : ""} ${plan?.optionalExtension ? "optional" : ""}`}
              disabled={!plan} onClick={() => plan && onOpenDay(plan.id)}>
              <span className="calendar-number">{number}</span>
              {plan && <><strong>{plan.city}</strong><small>{plan.title}</small></>}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function CalendarView({ days, onOpenDay }: Props) {
  return (
    <>
      <header className="page-header">
        <div>
          <span className="eyebrow">Vista calendario</span>
          <h1>Diciembre → enero</h1>
          <p>Una lectura mensual del viaje. Toca cualquier día ocupado para abrir el plan detallado.</p>
        </div>
      </header>
      <div className="calendar-layout">
        {monthGrid(2026, 11, days, onOpenDay)}
        {monthGrid(2027, 0, days, onOpenDay)}
      </div>
      <div className="calendar-legend">
        <span><i className="legend-dot base" /> ruta base</span>
        <span><i className="legend-dot optional" /> extensión norte opcional</span>
        <span><MapPin size={13} /> al tocar un día abre su detalle</span>
      </div>
      <div className="operation-note">Vuelos internacionales: 6 dic MDE→BOG→MAD; 7–8 dic MAD→PEK→KIX. Beijing está incluido explícitamente como escala.</div>
    </>
  );
}
