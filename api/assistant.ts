import type { IncomingMessage, ServerResponse } from "node:http";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 8;
const buckets = new Map<string, { count: number; resetAt: number }>();

type ApiRequest = IncomingMessage & { body?: unknown };
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

type ResponsesApiResult = {
  output_text?: string;
  output?: Array<{ content?: Array<{ text?: string }> }>;
  error?: { message?: string };
};

function sendJson(response: ServerResponse, status: number, payload: unknown) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

function getClientIp(request: IncomingMessage): string {
  const forwarded = request.headers["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(",")[0]?.trim() || request.socket.remoteAddress || "unknown";
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

async function readJsonBody(request: ApiRequest): Promise<AssistantPayload> {
  if (request.body && typeof request.body === "object") return request.body as AssistantPayload;
  if (typeof request.body === "string") {
    try { return JSON.parse(request.body) as AssistantPayload; } catch { return {}; }
  }

  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")) as AssistantPayload; } catch { return {}; }
}

function extractOutputText(data: ResponsesApiResult): string {
  if (data.output_text) return data.output_text;
  return (data.output ?? [])
    .flatMap((item) => item.content ?? [])
    .map((item) => item.text ?? "")
    .filter(Boolean)
    .join("\n");
}

export default async function handler(request: ApiRequest, response: ServerResponse) {
  if (request.method !== "POST") return sendJson(response, 405, { error: "Method not allowed" });

  const ip = getClientIp(request);
  if (!allowRequest(ip)) {
    return sendJson(response, 429, { error: "Demasiadas consultas. Intenta de nuevo en un minuto." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return sendJson(response, 503, { error: "AI service not configured" });

  const body = await readJsonBody(request);
  const question = body.question?.trim();
  if (!question || question.length > 1200) {
    return sendJson(response, 400, { error: "Pregunta inválida o demasiado larga." });
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

  const payload = {
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
          "Ten especial sensibilidad por anime, manga, Nintendo, Pokémon, Ghibli, Evangelion, One Piece, ingeniería, ciencia, arquitectura, paisajes y joyas poco turísticas.",
      },
      {
        role: "user",
        content: `Viajero: ${body.traveler ?? "Yulian/Daniel"}\n${itineraryContext}\n\nConsulta: ${question}`,
      },
    ],
  };

  try {
    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const raw = await openAiResponse.text();
    let data: ResponsesApiResult = {};
    try { data = raw ? JSON.parse(raw) as ResponsesApiResult : {}; } catch {
      console.error("openai_non_json", openAiResponse.status, raw.slice(0, 500));
    }

    if (!openAiResponse.ok) {
      console.error("openai_error", openAiResponse.status, data.error?.message ?? raw.slice(0, 300));
      return sendJson(response, 502, { error: "El concierge no pudo responder. Inténtalo de nuevo en unos segundos." });
    }

    return sendJson(response, 200, {
      answer: extractOutputText(data) || "No recibí texto utilizable del modelo.",
      model: "gpt-6-luna",
      searchedWeb: true,
    });
  } catch (error) {
    console.error("assistant_error", error);
    return sendJson(response, 500, { error: "No pude consultar el asistente en este momento." });
  }
}
