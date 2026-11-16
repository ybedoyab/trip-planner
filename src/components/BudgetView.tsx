import { estimateCop, formatJpy, JPY_TO_COP } from "../lib/format";
import type { DayPlan } from "../types/travel";

interface Props {
  days: DayPlan[];
}

export function BudgetView({ days }: Props) {
  const hotels = days.reduce((sum, day) => sum + (day.hotel?.budgetJpyRoom ?? 0), 0) / 2;
  const transport = days.reduce(
    (sum, day) => sum + day.transport.reduce((legSum, leg) => legSum + (leg.costJpy ?? 0), 0),
    0,
  );
  const food = days.length * 4500;
  const entries = 52000;
  const subtotal = hotels + transport + food + entries;
  const cushion = subtotal * 0.15;
  const total = subtotal + cushion;
  const categories = [
    ["Hoteles", hotels],
    ["Transporte", transport],
    ["Entradas", entries],
    ["Comida", food],
    ["Colchón 15%", cushion],
  ] as const;

  return (
    <>
      <header className="page-header">
        <div>
          <span className="eyebrow">Estimación operativa</span>
          <h1>Presupuesto</h1>
          <p>Tasa hardcodeada de referencia: ¥1 ≈ COP {JPY_TO_COP}. Ajustable en <code>src/lib/format.ts</code>.</p>
        </div>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Total Japón / persona</span>
          <strong>{formatJpy(total)}</strong>
          <small>{estimateCop(total)} aprox.</small>
        </article>
        <article className="stat-card">
          <span>Hoteles / persona</span>
          <strong>{formatJpy(hotels)}</strong>
          <small>Habitación dividida entre dos.</small>
        </article>
        <article className="stat-card">
          <span>Colchón</span>
          <strong>15%</strong>
          <small>Clima, cambios, equipaje, compras.</small>
        </article>
      </section>

      <section className="section-block">
        <h2>Por categoría</h2>
        <div className="budget-list">
          {categories.map(([label, amount]) => (
            <div key={label} className="budget-row">
              <span>{label}</span>
              <div className="budget-bar"><i style={{ width: `${Math.max(8, (amount / total) * 100)}%` }} /></div>
              <strong>{formatJpy(amount)}</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="operation-note">
        No incluye compras personales ni el costo internacional ya pagado. Los precios de transporte/entradas marcados como estimados deben reconfirmarse cerca de la fecha.
      </div>
    </>
  );
}
