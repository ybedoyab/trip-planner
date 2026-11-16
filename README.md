# Japan Trip Planner

Frontend-first travel companion for Yulian and Daniel.

## Stack

- React 19
- TypeScript
- Vite
- React Leaflet + OpenStreetMap
- Lucide icons
- LocalStorage persistence
- Vercel Functions for the AI concierge
- OpenAI Responses API + web search
- Vercel Git deployments

## Architecture

```text
api/
  assistant.ts              # Server-only AI boundary; reads OPENAI_API_KEY
src/
  components/
    AIAssistantView.tsx
    AppShell.tsx
    BudgetView.tsx
    DayView.tsx
    ItineraryView.tsx
    PhotoCarousel.tsx
    QuickLinks.tsx
    ReservationsView.tsx
    TravelMap.tsx
    UserGate.tsx
  data/
    galleries.ts
    itinerary.ts
    quickLinks.ts
    reservations.ts
    specialStops.ts
  lib/
    format.ts
    storage.ts
    transportAdvice.ts
  state/
    TravelProvider.tsx
  types/
    travel.ts
  App.tsx
  main.tsx
  styles.css
  enhancements.css
```

### Principles

- **KISS**: no backend database and no authentication layer.
- **DRY**: itinerary and reservation data have typed single sources of truth.
- **SRP / SOLID**: persistence, domain data, formatting, state, transport guidance, AI boundary and UI are separated.
- **Derived state is not duplicated**: progress and totals are calculated from source data.
- **Dependency boundary**: LocalStorage is isolated behind `TravelStorage`.
- **Server-only secrets**: the browser calls `/api/assistant`; only the Vercel Function can read `OPENAI_API_KEY`.
- **Build safety**: `npm run build` runs `tsc --noEmit` before Vite bundling.

## AI concierge

The AI module receives only the active traveler's name and the currently selected day context.

It can use OpenAI web search for dynamic information such as:

- nearby events;
- closures and schedule changes;
- temporary exhibitions;
- transport disruptions;
- weather-dependent alternatives;
- anime / gaming / engineering suggestions near the route.

The base itinerary remains the source of truth. AI output is advisory and critical transport/reservation information should still be checked against official sources.

### Environment variable

Local development:

```bash
cp .env.example .env
# set OPENAI_API_KEY locally
```

Never use `VITE_OPENAI_API_KEY` or any other `VITE_` prefix for this secret: Vite-prefixed values are exposed to the browser bundle.

Production uses the sensitive Vercel environment variable:

```text
OPENAI_API_KEY
```

The actual value must never be committed.

## User state

The app asks only **Yulian** or **Daniel**. Each traveler gets independent:

- completed activities;
- completed days;
- completed reservations.

State is persisted under `japan-trip-planner:v2` in browser LocalStorage.

This is intentionally device-local and is not synchronized between devices.

## Visual / operational features

- interactive Japan route map;
- per-day timeline;
- verified destination photo carousels with source attribution;
- Japanese names and hiragana readings where useful;
- transport purchase instructions and practical tips;
- direct links to JR, maps, translator, currency conversion and transit planner;
- special optional stops such as Evangelion Kyoto Base at TOEI Kyoto Studio Park;
- mobile and desktop navigation;
- animations and micro-interactions.

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
- Production secrets live only in Vercel environment variables

## Updating the trip

Edit:

- `src/data/itinerary.ts` for days, activities, transport, hotels and route points.
- `src/data/specialStops.ts` for optional contextual stops.
- `src/data/galleries.ts` for verified destination images.
- `src/data/reservations.ts` for booking actions.
- `src/lib/transportAdvice.ts` for purchasing instructions.
- `src/lib/format.ts` for the hardcoded JPY → COP reference rate.

Prices are planning estimates unless explicitly backed by a confirmed purchase.

## QA status

The deployment pipeline validates:

1. TypeScript client code.
2. Vite production build.
3. Vercel Function TypeScript compilation.
4. Production deployment state.
5. Vercel runtime error scan.

The AI endpoint additionally includes input validation and a lightweight per-instance request rate limit.
