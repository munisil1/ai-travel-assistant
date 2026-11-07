# AI Travel Assistant

A full-stack trip planner that turns traveler preferences, dates, and destination context into a day-by-day itinerary and packing checklist. Built with React, TypeScript, Rails, GraphQL, and PostgreSQL.

## Features

- Plan trips by destination, dates, adults and children, budget, interests, travel pace, and transportation.
- Search destinations with autocomplete and geocode them for weather lookup.
- Generate a weather-aware itinerary with a summary, daily activities, and packing list.
- Save trip details, generated itineraries, and packing-list check-off status in PostgreSQL.
- Browse saved trips and reopen their itineraries after navigating away or refreshing.
- Use separate planner, saved trips, and itinerary pages at `/`, `/saved-trips`, and `/trips/:tripId`.

## Architecture

```text
React + TypeScript (Vite)
        │ GraphQL
        ▼
       ┌── PostgreSQL
Rails API ├── Open-Meteo geocoding
       ├── Visual Crossing forecast
       └── OpenAI structured itinerary generation
```

The browser sends trip data through GraphQL. The Rails API handles persistence and calls the external geocoding, weather, and AI services, keeping their credentials out of the frontend. The generated itinerary and packing status are stored with the trip and returned when a saved trip is opened.

## Design Decisions and Current Scope

- **GraphQL API:** trip creation, saved-trip queries, and itinerary generation use typed operations. This makes the itinerary shape explicit, with more schema and resolver code than a small REST API.
- **JSONB for flexible trip data:** interests, child details, itinerary content, and packing status are stored as JSONB alongside relational trip fields. This is convenient for evolving structured data, with less database-level validation inside those values.
- **Synchronous itinerary generation:** one request geocodes the destination, gets the forecast, asks the AI provider for structured output, and saves the result. This keeps the flow straightforward, but provider latency is part of the request and background generation is not implemented.
- **Provider services:** geocoding, weather, and AI calls are kept behind backend services. Retries, rate limiting, and provider fallbacks are not currently implemented.

The app does not currently have authentication or per-user trip ownership, so saved trips are not private to individual accounts. Visa requirements are also outside the current feature set.
