import { Check, ExternalLink } from "lucide-react";
import { LodgingView } from "./LodgingView";
import { reservations } from "../data/reservations";
import { useTravel } from "../state/TravelProvider";

export function ReservationsView() {
  const { state, traveler, toggleReservation } = useTravel();
  if (!traveler) return null;
  const progress = state.progress[traveler];

  return (
    <>
      <header className="page-header">
        <div>
          <span className="eyebrow">Antes de viajar</span>
          <h1>Reservas y hoteles</h1>
          <p>Checklist independiente para {traveler}. Marca solo cuando esté realmente comprado o reservado.</p>
        </div>
      </header>

      <LodgingView />

      <h2>Checklist de reservas</h2>
      <div className="reservation-list">
        {reservations.map((item) => {
          const done = Boolean(progress.completedReservations[item.id]);
          return (
            <article key={item.id} className={`reservation-row ${done ? "done" : ""}`}>
              <button className={`check-button ${done ? "done" : ""}`} onClick={() => toggleReservation(item.id)}>
                <Check size={16} />
              </button>
              <div>
                <div className="activity-title">
                  <strong>{item.title}</strong>
                  <span className={`priority ${item.priority}`}>{item.priority}</span>
                </div>
                <small>{item.dateLabel}</small>
                <p>{item.note}</p>
              </div>
              <a className="icon-link" href={item.officialUrl} target="_blank" rel="noreferrer" aria-label="Abrir fuente oficial">
                <ExternalLink size={17} />
              </a>
            </article>
          );
        })}
      </div>

      <section className="section-block">
        <h2>Frases útiles</h2>
        <div className="phrase-grid">
          <article><strong>駅はどこですか？</strong><span>えき は どこ ですか？</span><small>¿Dónde está la estación?</small></article>
          <article><strong>この電車は＿＿へ行きますか？</strong><span>この でんしゃ は…</span><small>¿Este tren va a ___?</small></article>
          <article><strong>予約があります。</strong><span>よやく が あります。</span><small>Tengo una reserva.</small></article>
          <article><strong>ありがとうございます。</strong><span>ありがとう ございます。</span><small>Muchas gracias.</small></article>
        </div>
      </section>
    </>
  );
}
