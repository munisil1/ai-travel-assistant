# AI Travel Assistant

A full-stack trip planner that turns traveler preferences, dates, and live destination context into a day-by-day itinerary and packing checklist. Built with React, TypeScript, Rails, GraphQL, and PostgreSQL.

## What works today

- Responsive trip-planning form for destinations, dates, travelers, children, budget, interests, pace, and transportation.
- Destination autocomplete and geocoding.
- PostgreSQL persistence for trip inputs.
- Weather-aware itinerary generation through Visual Crossing and OpenAI.
- Daily activities with time, duration, descriptions, and forecast details.
- Packing checklist with interactive check-offs and progress feedback.
- In-session return to a generated itinerary when trip inputs have not changed.

## Architecture

```text
React + TypeScript (Vite)
        │ GraphQL
        ▼
Rails API ── PostgreSQL (trip inputs)
   ├── Open-Meteo geocoding
   ├── Visual Crossing forecast
   └── OpenAI itinerary generation
```

The Rails API is the integration boundary: the browser sends trip data through GraphQL, while third-party API calls and credentials stay on the server. The generation flow geocodes the destination, retrieves a forecast for the requested dates, and includes that context with traveler preferences when requesting a structured itinerary.

## Design decisions and trade-offs

- **GraphQL for the application API:** trip creation and itinerary generation have distinct, typed contracts. The frontend requests only the fields it needs. This adds schema and resolver work compared with a small REST API, but makes the evolving itinerary shape explicit.
- **Relational trip record with JSONB preference fields:** core trip fields stay queryable while interests and child age ranges can evolve without a migration for every preference change. The trade-off is weaker database-level structure within those arrays.
- **Generate on demand; persist trip inputs, not generated output:** this avoids storing stale AI output and keeps the first iteration simple. Generated itineraries and checklist progress currently live only in React state, so refreshing loses them and there is no saved-trip retrieval UI yet.
- **Synchronous generation:** the mutation returns a complete itinerary in one request, keeping the client flow easy to reason about. Geocoding, weather, and AI latency are therefore on the request path; background jobs and progress updates are future options if generation time or traffic warrants them.
- **External providers behind backend services:** geocoding, weather, and AI integrations are separated from the GraphQL mutation. This centralizes provider access and secrets, though retries, rate limiting, and provider fallbacks remain future resilience work.

## Current scope

The app has no authentication or trip-library screen. Trip records are persisted, but generated itineraries and packing check-off state are not. Visa requirements, deployment, and durable saved-itinerary retrieval are not implemented yet.
