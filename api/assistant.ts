import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 8;
const buckets = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function allowRequest(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= MAX_REQUESTS) return false;
  bucket.count += 1;
  return true;
}

type AssistantPayload = {
  question?: string;
  traveler?: string;
  day?: {
    date?: string;
    city?: string;
    region?: string;
    title?: string;
    summary?: string;
    activities?: Array<{ title?: string; time?: string }>;
  };
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const ip = getClientIp(request);
  if (!allowRequest(ip)) {
    return Response.json(
      { error: "Demasiadas consultas. Intenta de nuevo en un minuto." },
      { status: 429 },
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "AI service not configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as AssistantPayload;
  const question = body.question?.trim();

  if (!question || question.length > 1200) {
    return Response.json({ error: "Pregunta inválida o demasiado larga." }, { status: 400 });
  }

  const day = body.day ?? {};
  const itineraryContext = [
    day.date ? `Fecha del itinerario: ${day.date}` : "",
    day.city ? `Base actual: ${day.city}` : "",
    day.region ? `Región: ${day.region}` : "",
    day.title ? `Plan principal: ${day.title}` : "",
    day.summary ? `Resumen: ${day.summary}` : "",
    day.activities?.length
      ? `Actividades previstas: ${day.activities.map((a) => `${a.time ?? ""} ${a.title ?? ""}`.trim()).join("; ")}`
      : "",
  ].filter(Boolean).join("\n");

  try {
    const response = await client.responses.create({
      model: "gpt-6-luna",
      tools: [{ type: "web_search" }],
      input: [
        {
          role: "system",
          content:
            "Eres un concierge de viaje en Japón integrado en una app privada para dos estudiantes colombianos. " +
            "Responde en español, de forma breve y operativa. Usa búsqueda web para datos cambiantes como eventos, horarios, cierres, clima operativo, transporte y noticias locales. " +
            "Prioriza fuentes oficiales y distingue claramente datos confirmados de sugerencias. No inventes horarios. " +
            "Cuando recomiendes un lugar, explica por qué encaja, cuánto desvío implica y si requiere reserva. " +
            "Ten especial sensibilidad por anime, manga, Nintendo, Pokémon, Ghibli, Evangelion, One Piece, ingeniería, ciencia, arquitectura, paisajes y joyas poco turísticas. " +
            "Si la consulta depende de una fecha futura todavía no publicada, dilo explícitamente y da el mejor plan de verificación.",
        },
        {
          role: "user",
          content:
            `Viajero: ${body.traveler ?? "Yulian/Daniel"}\n${itineraryContext}\n\nConsulta: ${question}`,
        },
      ],
    });

    return Response.json({
      answer: response.output_text,
      model: "gpt-6-luna",
      searchedWeb: true,
    });
  } catch (error) {
    console.error("assistant_error", error);
    return Response.json(
      { error: "No pude consultar el asistente en este momento." },
      { status: 500 },
    );
  }
}
