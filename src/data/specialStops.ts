import type { Activity } from "../types/travel";

export const specialStopsByDay: Record<string, Activity[]> = {
  "2026-12-12": [
    {
      id: "evangelion-kyoto-base",
      time: "16:00",
      title: "Evangelion Kyoto Base · TOEI Kyoto Studio Park",
      japanese: "エヴァンゲリオン京都基地",
      description:
        "Opcional si la agenda de ICNEA termina temprano. El parque oficial mantiene Evangelion Kyoto Base como atracción #16 y la describe como el primer EVA del mundo al que se puede subir. Combina mejor con Arashiyama/Saga-Toriimoto que con Higashiyama.",
      optional: true,
      reservation: false,
      officialUrl: "https://global.toei-eigamura.com/",
    },
  ],
};
