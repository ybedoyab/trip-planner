import { Bot, LoaderCircle, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useTravel } from "../state/TravelProvider";
import type { DayPlan } from "../types/travel";

interface Props { day: DayPlan; }

const quickQuestions = [
  "¿Qué eventos interesantes hay cerca de nuestro plan ese día?",
  "¿Hay cierres, cambios de horario o alertas que debamos saber?",
  "Dame un plan B si hace mal clima.",
  "¿Qué joya oculta o lugar de anime queda cerca sin desviarnos mucho?",
];

export function AIAssistantView({ day }: Props) {
  const { traveler } = useTravel();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const contextLabel = useMemo(() => `${day.date} · ${day.city}`, [day]);

  async function ask(prompt = question) {
    const clean = prompt.trim();
    if (!clean || loading) return;
    setQuestion(clean); setLoading(true); setError("");

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: clean,
          traveler,
          day: {
            date: day.date, city: day.city, region: day.region, title: day.title, summary: day.summary,
            activities: day.activities.map(({ title, time }) => ({ title, time })),
          },
        }),
      });

      const raw = await response.text();
      let data: { answer?: string; error?: string } = {};
      try { data = raw ? JSON.parse(raw) : {}; } catch {
        throw new Error(`El servidor devolvió una respuesta inválida (HTTP ${response.status}).`);
      }
      if (!response.ok) throw new Error(data.error || `Error consultando IA (HTTP ${response.status}).`);
      setAnswer(data.answer || "No recibí una respuesta.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="page-header">
        <div><span className="eyebrow">Concierge actualizado</span><h1>Asistente IA</h1>
          <p>Contexto activo: <strong>{contextLabel}</strong>. Puede buscar eventos, cierres y opciones cercanas.</p></div>
        <span className="ai-live-pill"><Search size={14} /> búsqueda web</span>
      </header>
      <section className="ai-hero">
        <div className="ai-orb"><Bot size={32} /></div>
        <div><span className="eyebrow">Japan Companion</span><h2>Pregunta sobre lo que esté pasando alrededor</h2>
          <p>El itinerario base sigue siendo la fuente de verdad; la IA sirve para información dinámica y sugerencias.</p></div>
      </section>
      <div className="quick-prompts">
        {quickQuestions.map((item) => <button key={item} onClick={() => void ask(item)}><Sparkles size={14} /> {item}</button>)}
      </div>
      <section className="assistant-box">
        <textarea value={question} onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ej.: ¿Hay algo de Evangelion, anime o iluminación especial cerca hoy?" maxLength={1200} rows={4} />
        <button className="primary-button" disabled={loading || !question.trim()} onClick={() => void ask()}>
          {loading ? <><LoaderCircle className="spin" size={16} /> Consultando…</> : <><Bot size={16} /> Preguntar</>}
        </button>
      </section>
      {error && <div className="operation-note danger">{error}</div>}
      {answer && <section className="ai-answer"><span className="eyebrow">Respuesta contextual</span><p>{answer}</p></section>}
      <div className="operation-note">La IA puede equivocarse. Para trenes, vuelos, reservas y aperturas críticas, abre siempre el enlace oficial antes de pagar o desplazarte.</div>
    </>
  );
}
