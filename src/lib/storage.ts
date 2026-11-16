import type { PersistedTravelState, Traveler, TravelerProgress } from "../types/travel";

const STORAGE_KEY = "japan-trip-planner:v2";

const emptyProgress = (): TravelerProgress => ({
  completedActivities: {},
  completedDays: {},
  completedReservations: {},
});

export const defaultState = (): PersistedTravelState => ({
  currentTraveler: null,
  progress: {
    Yulian: emptyProgress(),
    Daniel: emptyProgress(),
  },
});

export interface TravelStorage {
  load(): PersistedTravelState;
  save(state: PersistedTravelState): void;
}

class BrowserTravelStorage implements TravelStorage {
  load(): PersistedTravelState {
    if (typeof window === "undefined") return defaultState();

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();

      const parsed = JSON.parse(raw) as Partial<PersistedTravelState>;
      const fallback = defaultState();

      return {
        currentTraveler:
          parsed.currentTraveler === "Yulian" || parsed.currentTraveler === "Daniel"
            ? parsed.currentTraveler
            : null,
        progress: {
          Yulian: { ...fallback.progress.Yulian, ...parsed.progress?.Yulian },
          Daniel: { ...fallback.progress.Daniel, ...parsed.progress?.Daniel },
        },
      };
    } catch {
      return defaultState();
    }
  }

  save(state: PersistedTravelState): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export const travelStorage: TravelStorage = new BrowserTravelStorage();

export const getTravelerProgress = (
  state: PersistedTravelState,
  traveler: Traveler,
): TravelerProgress => state.progress[traveler];
