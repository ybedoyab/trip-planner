import { Check, Clock3, ExternalLink, Hotel, Lightbulb, ShoppingCart, TrainFront } from "lucide-react";
import { galleriesByDay } from "../data/galleries";
import { specialStopsByDay } from "../data/specialStops";
import { estimateCop, formatDateLabel, formatJpy } from "../lib/format";
import { getTransportAdvice } from "../lib/transportAdvice";
import { useTravel } from "../state/TravelProvider";
import type { DayPlan } from "../types/travel";
import { PhotoCarousel } from "./PhotoCarousel";
import { QuickLinks } from "./QuickLinks";

interface Props {
  day: DayPlan;
  nextDay?: DayPlan;
  onNext?: () => void;
}

export function DayView({ day, nextDay, onNext }: Props) {
  const { state, traveler, toggleActivity, completeDay } = useTravel();
  if (!traveler) return null;

  const progress = state.progress[traveler];
  const activities = [...day.activities, ...(specialStopsByDay[day.id] ?? [])];
  const completed = activities.filter((item) => progress.completedActivities[item.id]).length;
  const percent = Math.round((completed / Math.max(activities.length, 1)) * 100);
  const transportBudget = day.transport.reduce((sum, item) => sum + (item.costJpy ?? 0), 0);
  const gallery = galleriesByDay[day.id] ?? [];

  return (
    <>
      <header className="page-header">
        <div>
          <span className="eyebrow">{formatDateLabel(day.date)} · {day.region}</span>
          <h1>{day.city}</h1>
          <p>{day.japanese} {day.reading ? "（" + day.reading + "）" : ""} · {day.title}</p>
        </div>
        <span className="status-pill">{percent}% completado</span>
      </header>

      <section className="day-hero" style={{ backgroundImage: 'url("' + day.imageUrl + '")' }}>
        <div>
          <span className="status-pill">{day.date}</span>
          <h2>{day.title}</h2>
          <p>{day.summary}</p>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Fotos verificadas</span>
              <h2>Así se ve realmente</h2>
            </div>
          </div>
          <PhotoCarousel images={gallery} />
        </section>
      )}

      <section className="stats-grid">
        <article className="stat-card">
          <Hotel size={18} />
          <span>Hotel</span>
          <strong>{day.hotel ? formatJpy(day.hotel.budgetJpyRoom) : "Sin noche"}</strong>
          <small>{day.hotel?.area ?? "—"}</small>
        </article>
        <article className="stat-card">
          <TrainFront size={18} />
          <span>Transporte</span>
          <strong>{formatJpy(transportBudget)}</strong>
          <small>{estimateCop(transportBudget)} aprox.</small>
        </article>
        <article className="stat-card">
          <Clock3 size={18} />
          <span>Progreso</span>
          <strong>{percent}%</strong>
          <div className="progress-track"><i style={{ width: percent + "%" }} /></div>
        </article>
      </section>

      {day.operationsNote && <div className="operation-note">{day.operationsNote}</div>}

      <section className="section-block">
        <h2>Qué hacer</h2>
        <div className="activity-list">
          {activities.map((item) => {
            const done = Boolean(progress.completedActivities[item.id]);
            return (
              <article key={item.id} className={"activity-card " + (done ? "done" : "")}>
                <time>{item.time}</time>
                <div>
                  <div className="activity-title">
                    <strong>{item.title}</strong>
                    {item.optional && <span className="mini-pill">opcional</span>}
                  </div>
                  {item.japanese && (
                    <span className="japanese">
                      {item.japanese} {item.reading ? "（" + item.reading + "）" : ""}
                    </span>
                  )}
                  <p>{item.description}</p>
                  <div className="activity-meta">
                    {item.costJpy != null && <span>{formatJpy(item.costJpy)}</span>}
                    {item.reservation && <span>Reserva</span>}
                    {item.officialUrl && (
                      <a href={item.officialUrl} target="_blank" rel="noreferrer">
                        Oficial <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
                <button
                  className={"check-button " + (done ? "done" : "")}
                  onClick={() => toggleActivity(item.id)}
                  aria-label={done ? "Marcar pendiente" : "Marcar completado"}
                >
                  <Check size={16} />
                </button>
              </article>
            );
          })}
        </div>
        <button className="primary-button full" onClick={() => completeDay(day.id, activities.map((item) => item.id))}>
          Día completado
        </button>
      </section>

      <section className="section-block">
        <h2>Cómo llegar y cómo comprar</h2>
        <div className="transport-list">
          {day.transport.map((leg) => {
            const advice = getTransportAdvice(leg);
            return (
              <article key={leg.id} className="transport-card rich">
                <div className="transport-main">
                  <div>
                    <strong>{leg.mode}{leg.service ? " · " + leg.service : ""}</strong>
                    <p>{leg.from} → {leg.to}</p>
                    <small>{leg.duration}{leg.reservation ? " · Reserva recomendada" : ""}</small>
                  </div>
                  <div className="transport-price">
                    {leg.costJpy != null ? formatJpy(leg.costJpy) : "Incluido"}
                  </div>
                </div>
                <div className="transport-howto">
                  <div><ShoppingCart size={15} /><span><b>Comprar:</b> {advice.purchase}</span></div>
                  <div><Lightbulb size={15} /><span><b>Tip:</b> {advice.tip}</span></div>
                  <a href={advice.url} target="_blank" rel="noreferrer">
                    Abrir información <ExternalLink size={13} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <QuickLinks />

      {nextDay && (
        <button className="next-day" onClick={onNext}>
          <span>Después</span>
          <strong>{nextDay.city}</strong>
          <small>{nextDay.title}</small>
        </button>
      )}
    </>
  );
}
