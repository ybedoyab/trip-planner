import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { travelStorage } from "../lib/storage";
import type { PersistedTravelState, Traveler } from "../types/travel";

interface TravelContextValue {
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
    state,
    traveler,
    selectTraveler: (selected) => setState((current) => ({ ...current, currentTraveler: selected })),
    clearTraveler: () => setState((current) => ({ ...current, currentTraveler: null })),
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
