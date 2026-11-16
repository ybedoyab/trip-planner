export type Traveler = "Yulian" | "Daniel";
export type Section = "today" | "itinerary" | "calendar" | "map" | "ai" | "budget" | "reservations";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GalleryImage {
  url: string;
  alt: string;
  title: string;
  credit: string;
  sourceUrl?: string;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  japanese?: string;
  reading?: string;
  description: string;
  costJpy?: number;
  reservation?: boolean;
  officialUrl?: string;
  optional?: boolean;
}

export interface TransportLeg {
  id: string;
  mode: string;
  from: string;
  to: string;
  duration: string;
  costJpy?: number;
  service?: string;
  stationFrom?: string;
  stationTo?: string;
  reservation?: boolean;
  notes?: string;
}

export interface HotelPlan {
  area: string;
  budgetJpyRoom: number;
  note?: string;
}

export interface DayPlan {
  id: string;
  date: string;
  city: string;
  japanese: string;
  reading?: string;
  region: string;
  title: string;
  summary: string;
  imageUrl: string;
  coordinates: Coordinates;
  hotel?: HotelPlan;
  activities: Activity[];
  transport: TransportLeg[];
  optionalExtension?: boolean;
  operationsNote?: string;
}

export interface ReservationItem {
  id: string;
  title: string;
  dateLabel: string;
  note: string;
  officialUrl: string;
  priority: "critical" | "high" | "normal";
}

export interface TravelerProgress {
  completedActivities: Record<string, boolean>;
  completedDays: Record<string, boolean>;
  completedReservations: Record<string, boolean>;
}

export interface PersistedTravelState {
  currentTraveler: Traveler | null;
  progress: Record<Traveler, TravelerProgress>;
}
