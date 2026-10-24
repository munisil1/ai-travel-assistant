import type { GetTripsResponse } from '../api/graphql'

type SavedTripsListProps = {
  trips: GetTripsResponse['trips']
  isLoading: boolean
  loadingTripId: string | null
  error: string | null
  onBack: () => void
  onViewItinerary: (tripId: string) => void
}

const formatTripDate = (value: string): string => {
  const date = new Date(`${value}T12:00:00`)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export function SavedTripsList({
  trips,
  isLoading,
  loadingTripId,
  error,
  onBack,
  onViewItinerary,
}: SavedTripsListProps) {
  return (
    <section className="saved-trips-view" aria-labelledby="saved-trips-title">
      <header className="saved-trips-view__header">
        <button type="button" className="back-button" onClick={onBack}>
          ← Back to planner
        </button>
        <div>
          <p className="form-heading__overline">Your journeys</p>
          <h2 id="saved-trips-title">Saved trips</h2>
        </div>
      </header>

      {error && (
        <p className="saved-trips-view__message saved-trips-view__message--error" role="alert">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="saved-trips-view__message" role="status">Loading saved trips...</p>
      ) : trips.length > 0 ? (
        <div className="saved-trips-grid">
          {trips.map((trip) => (
            <article className="saved-trip-card" key={trip.id}>
              <div className="saved-trip-card__details">
                <h3>{trip.destination}</h3>
                <p className="saved-trip-card__dates">
                  {formatTripDate(trip.departureDate)} <span aria-hidden="true">→</span> {formatTripDate(trip.returnDate)}
                </p>
              </div>
              <p className="saved-trip-card__summary">
                {trip.itinerary?.summary ?? 'No itinerary has been generated for this trip yet.'}
              </p>
              <button
                type="button"
                className="saved-itinerary-button"
                disabled={!trip.itinerary || loadingTripId !== null}
                onClick={() => onViewItinerary(trip.id)}
              >
                {loadingTripId === trip.id
                  ? 'Loading itinerary...'
                  : trip.itinerary
                    ? 'View itinerary'
                    : 'No itinerary yet'}
              </button>
            </article>
          ))}
        </div>
      ) : !error ? (
        <p className="saved-trips-view__message">No saved trips yet.</p>
      ) : null}
    </section>
  )
}