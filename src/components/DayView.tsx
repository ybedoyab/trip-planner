import { Check, Clock3, ExternalLink, Hotel, Lightbulb, MapPin, ShoppingBag, ShoppingCart, Soup, TrainFront, Utensils } from "lucide-react";
import { galleriesByDay } from "../data/galleries";
import { extrasByDay } from "../data/dayExtras";
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
  const extra = extrasByDay[day.id];
  const gallery = extra?.gallery?.length ? extra.gallery : (galleriesByDay[day.id] ?? []);
  const heroImage = gallery[0]?.url ?? day.imageUrl;

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

      <section className="day-hero">
        <img
          className="day-hero-media"
          src={heroImage}
          alt={gallery[0]?.alt ?? day.title}
          onError={(event) => {
            if (event.currentTarget.src !== day.imageUrl) event.currentTarget.src = day.imageUrl;
          }}
        />
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


      {extra && (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Ideas opcionales</span>
              <h2>Qué comer, qué comprar y dónde probarlo</h2>
            </div>
            <span className="mini-pill">ustedes deciden</span>
          </div>

          {extra.note && <div className="operation-note suggestion-note">{extra.note}</div>}

          <div className="suggestion-columns">
            <article className="suggestion-panel">
              <div className="suggestion-panel-title"><Soup size={18} /><div><span className="eyebrow">Comer</span><h3>Qué probar</h3></div></div>
              <div className="suggestion-list">
                {extra.food.map((item) => (
                  <div className="suggestion-item" key={item.title}>
                    <div><strong>{item.title}</strong>{item.priceHint && <span className="price-hint">{item.priceHint}</span>}</div>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="suggestion-panel">
              <div className="suggestion-panel-title"><ShoppingBag size={18} /><div><span className="eyebrow">Comprar</span><h3>Qué vale la pena mirar</h3></div></div>
              <div className="suggestion-list">
                {extra.shopping.map((item) => (
                  <div className="suggestion-item" key={item.title}>
                    <div><strong>{item.title}</strong>{item.priceHint && <span className="price-hint">{item.priceHint}</span>}</div>
                    <p>{item.description}</p>
                    {item.mapsUrl && <a href={item.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={12} /> Maps</a>}
                  </div>
                ))}
              </div>
            </article>

            <article className="suggestion-panel dining-panel">
              <div className="suggestion-panel-title"><Utensils size={18} /><div><span className="eyebrow">Dónde comer</span><h3>Lugares sugeridos</h3></div></div>
              <div className="suggestion-list">
                {extra.dining.map((item) => (
                  <div className="suggestion-item" key={item.title}>
                    <div><strong>{item.title}</strong>{item.priceHint && <span className="price-hint">{item.priceHint}</span>}</div>
                    <p>{item.description}</p>
                    <div className="suggestion-actions">
                      {item.mapsUrl && <a href={item.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={12} /> Abrir en Maps</a>}
                      {item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer"><ExternalLink size={12} /> Fuente</a>}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="operation-note">
            Estas son sugerencias editoriales, no reservas ni decisiones cerradas. Revisen horarios, precios y disponibilidad el mismo día.
          </div>
        </section>
      )}

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
