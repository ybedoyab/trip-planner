import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { travelStorage } from "../lib/storage";
import type { PersistedTravelState, Traveler } from "../types/travel";

import type { Category, Decision } from "../data/discovery";

interface TravelContextValue {
  selectStay: (date: string, name: string | null) => void;
  finishOnboarding: (preferences: Category[]) => void;
  decide: (id: string, decision: Decision | null) => void;
  undoDecision: () => void;
  state: PersistedTravelState;
  traveler: Traveler | null;
  selectTraveler: (traveler: Traveler) => void;
  clearTraveler: () => void;
  toggleActivity: (activityId: string) => void;
  completeDay: (dayId: string, activityIds: string[]) => void;
  toggleReservation: (reservationId: string) => void;
}

const TravelContext = createContext<TravelContextValue | null>(null);

export function TravelProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<PersistedTravelState>(() => travelStorage.load());

  useEffect(() => {
    travelStorage.save(state);
  }, [state]);

  const traveler = state.currentTraveler;

  const updateTravelerProgress = (
    recipe: (progress: PersistedTravelState["progress"][Traveler]) => PersistedTravelState["progress"][Traveler],
  ) => {
    setState((current) => {
      if (!current.currentTraveler) return current;
      const selected = current.currentTraveler;
      return {
        ...current,
        progress: {
          ...current.progress,
          [selected]: recipe(current.progress[selected]),
        },
      };
    });
  };

  const value = useMemo<TravelContextValue>(() => ({
    selectStay: (date, name) => updateTravelerProgress((progress) => ({
      ...progress,
      lodgingChoices: { ...progress.lodgingChoices, [date]: name },
    })),
    state,
    traveler,
    selectTraveler: (selected) => setState((current) => ({ ...current, currentTraveler: selected })),
    clearTraveler: () => setState((current) => ({ ...current, currentTraveler: null })),
    finishOnboarding: (preferences) => updateTravelerProgress((progress) => ({ ...progress, preferences })),
    decide: (id, decision) => updateTravelerProgress((progress) => ({
      ...progress,
      decisions: { ...progress.decisions, [id]: decision },
      lastDecision: { id, previous: progress.decisions?.[id] ?? null },
    })),
    undoDecision: () => updateTravelerProgress((progress) => {
      const last = progress.lastDecision;
      if (!last) return progress;
      return { ...progress, lastDecision: undefined, decisions: { ...progress.decisions, [last.id]: last.previous } };
    }),
    toggleActivity: (activityId) =>
      updateTravelerProgress((progress) => ({
        ...progress,
        completedActivities: {
          ...progress.completedActivities,
          [activityId]: !progress.completedActivities[activityId],
        },
      })),
    completeDay: (dayId, activityIds) =>
      updateTravelerProgress((progress) => ({
        ...progress,
        completedDays: { ...progress.completedDays, [dayId]: true },
        completedActivities: activityIds.reduce(
          (acc, id) => ({ ...acc, [id]: true }),
          progress.completedActivities,
        ),
      })),
    toggleReservation: (reservationId) =>
      updateTravelerProgress((progress) => ({
        ...progress,
        completedReservations: {
          ...progress.completedReservations,
          [reservationId]: !progress.completedReservations[reservationId],
        },
      })),
  }), [state, traveler]);

  return <TravelContext.Provider value={value}>{children}</TravelContext.Provider>;
}

export function useTravel() {
  const context = useContext(TravelContext);
  if (!context) throw new Error("useTravel must be used inside TravelProvider");
  return context;
}
