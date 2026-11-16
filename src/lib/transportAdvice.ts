import type { TransportLeg } from "../types/travel";

export type TransportAdvice = {
  purchase: string;
  tip: string;
  url: string;
};

export function getTransportAdvice(leg: TransportLeg): TransportAdvice {
  const haystack = `${leg.mode} ${leg.service ?? ""} ${leg.from} ${leg.to}`.toLowerCase();

  if (haystack.includes("shinkansen")) {
    return {
      purchase: "Compra en SmartEX/JR o en máquinas/ventanilla de estación. Para Año Nuevo, reserva asiento con anticipación.",
      tip: "Con equipaje grande revisa reglas de oversized baggage y llega 15–20 min antes al andén.",
      url: "https://smart-ex.jp/en/index.php",
    };
  }

  if (haystack.includes("haruka")) {
    return {
      purchase: "Compra ticket JR/HARUKA en Kansai Airport Station; revisa pases ICOCA & HARUKA para visitante.",
      tip: "Sigue señalización JR desde KIX T1. Guarda el QR/ticket hasta salir en Kyoto.",
      url: "https://www.westjr.co.jp/global/en/ticket/pass/one_way/haruka/",
    };
  }

  if (haystack.includes("bus") || haystack.includes("shuttle")) {
    return {
      purchase: "Verifica si el servicio exige reserva online; si no, normalmente se paga al subir/bajar con efectivo o IC card según operador.",
      tip: "En buses rurales lleva efectivo y monedas; los horarios pueden ser poco frecuentes.",
      url: "https://www.japan.travel/en/plan/getting-around/",
    };
  }

  if (haystack.includes("vuelo")) {
    return {
      purchase: "Compara directamente en ANA/JAL/Solaseed/Air Do y confirma equipaje antes de pagar.",
      tip: "Para vuelos domésticos japoneses, llegar 60–90 min antes suele ser cómodo; confirma terminal.",
      url: "https://www.google.com/travel/flights",
    };
  }

  if (haystack.includes("jr") || haystack.includes("metro") || haystack.includes("train")) {
    return {
      purchase: "Para tren local/metro usa Suica/PASMO/ICOCA en el torniquete o compra billete en máquina.",
      tip: "Google Maps/Jorudan muestran plataforma y salida; confirma el destino del tren antes de subir.",
      url: "https://www.japan.travel/en/plan/getting-around/",
    };
  }

  return {
    purchase: "Confirma el operador y método de pago antes de salir.",
    tip: "Guarda captura del nombre japonés del destino por si necesitas mostrarlo.",
    url: "https://www.japan.travel/en/plan/getting-around/",
  };
}
