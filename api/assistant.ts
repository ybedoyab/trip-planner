const WINDOW_MS = 60_000;
const MAX_REQUESTS = 8;
const buckets = new Map<string, { count: number; resetAt: number }>();

type AssistantPayload = {
  question?: string;
  traveler?: string;
  preferences?: string[];
  saved?: string[];
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

function extractOutputText(data: ResponsesApiResult): string {
  if (data.output_text) return data.output_text;
  return (data.output ?? [])
    .flatMap((item) => item.content ?? [])
    .map((item) => item.text ?? "")
    .filter(Boolean)
    .join("\n");
}

export default {
  async fetch(request: Request): Promise<Response> {
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

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
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

    const list = (value: unknown) => Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string").slice(0, 15).map((item) => item.slice(0, 160)).join(", ")
      : "";

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
            "Ten especial sensibilidad por anime, manga, Nintendo, Pokémon, Ghibli, Evangelion, One Piece, ingeniería, ciencia, arquitectura, paisajes y joyas poco turísticas. " +
            "Formatea la respuesta en Markdown limpio: encabezados cortos cuando ayuden, listas con viñetas y enlaces Markdown descriptivos. No muestres URLs crudas si puedes usar un enlace con texto. Evita tablas salvo que sean claramente útiles.",
        },
        {
          role: "user",
          content: `Viajero: ${body.traveler ?? "Yulian/Daniel"}\n${itineraryContext}\nPreferencias: ${list(body.preferences)}\nIdeas guardadas (opcionales): ${list(body.saved)}\n\nConsulta: ${question}`,
        },
      ],
    };

    try {
      const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const raw = await openAiResponse.text();
      let data: ResponsesApiResult = {};
      try {
        data = raw ? JSON.parse(raw) as ResponsesApiResult : {};
      } catch {
        console.error("openai_non_json", openAiResponse.status, raw.slice(0, 500));
      }

      if (!openAiResponse.ok) {
        console.error("openai_error", openAiResponse.status, data.error?.message ?? raw.slice(0, 300));
        return Response.json(
          { error: "El concierge no pudo responder. Inténtalo de nuevo en unos segundos." },
          { status: 502 },
        );
      }

      return Response.json({
        answer: extractOutputText(data) || "No recibí texto utilizable del modelo.",
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
  },
};
