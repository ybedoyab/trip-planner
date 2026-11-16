# Japan Trip Planner

Frontend-only trip companion for Yulian and Daniel.

## Stack

- React 19
- TypeScript
- Vite
- React Leaflet + OpenStreetMap
- Lucide icons
- LocalStorage persistence
- Vercel Git deployments

## Architecture

```text
src/
  components/
    AppShell.tsx
    BudgetView.tsx
    DayView.tsx
    ItineraryView.tsx
    ReservationsView.tsx
    TravelMap.tsx
    UserGate.tsx
  data/
    itinerary.ts
    reservations.ts
  lib/
    format.ts
    storage.ts
  state/
    TravelProvider.tsx
  types/
    travel.ts
  App.tsx
  main.tsx
  styles.css
```

### Principles

- **KISS**: frontend-only, no backend, no auth layer.
- **DRY**: itinerary and reservation data live in one typed source of truth.
- **SRP / SOLID**: persistence, domain data, formatting, state and UI are separate concerns.
- **Derived state is not duplicated**: progress and totals are calculated from source data.
- **Dependency boundary**: LocalStorage is isolated behind `TravelStorage`.
- **Build safety**: `npm run build` performs `tsc --noEmit` before Vite bundling.

## User state

The app asks only **Yulian** or **Daniel**. Each traveler gets independent:

- completed activities;
- completed days;
- completed reservations.

State is persisted under `japan-trip-planner:v2` in browser LocalStorage.

This is intentionally device-local. It is not synchronized between devices.

## Development

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run typecheck
npm run build
```

## Deploy

The GitHub repository is linked to the Vercel project `trip-planner`.

- Production branch: `main`
- Vercel builds every push to `main`
- TypeScript errors block the production build

## Updating the trip

Edit:

- `src/data/itinerary.ts` for days, activities, transport, hotels and route points.
- `src/data/reservations.ts` for booking actions.
- `src/lib/format.ts` for the hardcoded JPY → COP reference rate.

Prices are planning estimates unless explicitly backed by a confirmed purchase.
