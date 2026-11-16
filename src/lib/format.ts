export const JPY_TO_COP = 26.5;

export const formatJpy = (value: number): string =>
  new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);

export const formatCop = (value: number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

export const estimateCop = (jpy: number): string => formatCop(jpy * JPY_TO_COP);

export const formatDateLabel = (isoDate: string): string =>
  new Intl.DateTimeFormat("es-CO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${isoDate}T12:00:00`));
