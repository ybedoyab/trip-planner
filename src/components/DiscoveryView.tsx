import { useState } from "react";
import { Bookmark, RotateCcw, X } from "lucide-react";
import { categories, discoveries, type Category, type Decision, type DiscoveryItem } from "../data/discovery";
import { extrasByDay } from "../data/dayExtras";
import { itinerary } from "../data/itinerary";
import { useTravel } from "../state/TravelProvider";
import { useHorizontalSwipe } from "../lib/useHorizontalSwipe";
import type { DayPlan } from "../types/travel";

function Suggestion({ item }: { item: DiscoveryItem }) {
  return <>
    <span className="eyebrow">{item.category} · Sugerencia</span>
    <h2>{item.title}</h2>
    <p>{item.description}</p>
    {item.priceHint && <p>{item.priceHint}</p>}
    <div className="journey-actions">
      {item.mapsUrl && <a href={item.mapsUrl} target="_blank" rel="noreferrer">Mapa y reseñas</a>}
      {item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer">Fuente</a>}
    </div>
  </>;
}

export function DiscoveryView({ day, saved, initialCategory, onSelectDay, onOpenSaved }: {
  day: DayPlan; saved: boolean; initialCategory: Category | ""; onSelectDay: (id: string) => void; onOpenSaved: () => void;
}) {
  const { state, traveler, decide, undoDecision } = useTravel();
  const [filter, setFilter] = useState<Decision>("saved");
  const [savedDay, setSavedDay] = useState("");
  const [savedCategory, setSavedCategory] = useState("");
  const [interest, setInterest] = useState<string>(initialCategory);
  const progress = traveler ? state.progress[traveler] : undefined;
  const decisions = progress?.decisions ?? {};
  const preferences = progress?.preferences ?? [];
  const remaining = discoveries.filter((item) => item.dayId === day.id && !decisions[item.id] && (!interest || item.category === interest))
    .sort((a, b) => Number(preferences.includes(b.category)) - Number(preferences.includes(a.category)));
  const current = remaining[0];
  const swipe = useHorizontalSwipe((direction) => {
    if (current) decide(current.id, direction > 0 ? "saved" : "dismissed");
  });
  const dayOptions = itinerary.map((option) => <option key={option.id} value={option.id}>{option.date} · {option.city}</option>);
  const visible = discoveries.filter((item) => decisions[item.id] === filter
    && (!savedDay || item.dayId === savedDay)
    && (!savedCategory || item.category === savedCategory));

  return <section className="journey discovery">
    <header className="page-header"><div><span className="eyebrow">Japón 2026</span><h1>{saved ? "Guardados" : "Explorar"}</h1></div></header>
    {saved ? <>
      <div className="journey-actions">
        <button aria-pressed={filter === "saved"} onClick={() => setFilter("saved")}>Guardados</button>
        <button aria-pressed={filter === "dismissed"} onClick={() => setFilter("dismissed")}>Descartados</button>
      </div>
      <label>Día <select value={savedDay} onChange={(event) => setSavedDay(event.target.value)}><option value="">Todos los días</option>{dayOptions}</select></label>
      <label>Categoría <select value={savedCategory} onChange={(event) => setSavedCategory(event.target.value)}>
        <option value="">Todas las categorías</option>
        {categories.map((category) => <option key={category}>{category}</option>)}
      </select></label>
      {!visible.length && <p>No hay sugerencias en esta vista.</p>}
      {visible.map((item) => <article className="discovery-card" key={item.id}>
        <small>{item.dayId}</small>
        <Suggestion item={item} />
        <button onClick={() => decide(item.id, null)}>{filter === "saved" ? "Quitar de guardados" : "Volver a explorar"}</button>
      </article>)}
    </> : <>
      <label>Día <select value={day.id} onChange={(event) => onSelectDay(event.target.value)}>{dayOptions}</select></label>
      <label>Interés <select value={interest} onChange={(event) => setInterest(event.target.value)}>
        <option value="">Todos los intereses</option>
        {categories.map((category) => <option key={category}>{category}</option>)}
      </select></label>
      {extrasByDay[day.id]?.note && <p>{extrasByDay[day.id].note}</p>}
      <p role="status">{remaining.length} sugerencias por explorar</p>
      {current ? <>
        <article key={current.id} className="discovery-card swipe-card" {...swipe}><Suggestion item={current} /></article>
        <div className="journey-actions decision-actions">
          <button onClick={() => decide(current.id, "dismissed")}><X size={18} /> Descartar</button>
          <button onClick={() => decide(current.id, "saved")}><Bookmark size={18} /> Guardar</button>
        </div>
      </> : <p>{interest ? "No quedan sugerencias para este interés. Prueba otro interés o cambia de día." : "Ya revisaste las sugerencias de este día. Elige otro día o vuelve a tus guardados."}</p>}
      <div className="journey-actions">
        <button disabled={!progress?.lastDecision} onClick={undoDecision}><RotateCcw size={16} /> Deshacer</button>
        <button onClick={onOpenSaved}>Ver guardados</button>
      </div>
    </>}
  </section>;
}
