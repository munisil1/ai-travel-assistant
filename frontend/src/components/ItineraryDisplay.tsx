import type { GenerateItineraryResponse } from '../api/graphql'

type ItineraryTripMeta = {
  destination: string
  departureDate: string
  returnDate: string
  adults: number
  travelPace?: string
  transportation?: string
}

type ItineraryDisplayProps = {
  itinerary: GenerateItineraryResponse['generateItinerary']['itinerary'] | null
  tripMeta?: ItineraryTripMeta | null
}

export function ItineraryDisplay({ itinerary, tripMeta }: ItineraryDisplayProps) {
  if (!itinerary) {
    return (
      <section className="itinerary-display" aria-live="polite">
        <p>Generated itinerary will be displayed here</p>
      </section>
    )
  }

  const dayIcons = ['🌅', '🏛️', '🍽️', '🌿', '🎒', '✨']

  return (
    <section className="itinerary-display" aria-live="polite">
      <div className="itinerary-display__summary">
        <div className="itinerary-section-tag">
          <span aria-hidden="true">✦</span>
          <p className="form-heading__overline">Overview</p>
        </div>

        {tripMeta && (
          <div className="itinerary-summary-bar" aria-label="Trip summary">
            <span className="itinerary-summary-pill">📍 {tripMeta.destination}</span>
            <span className="itinerary-summary-pill">🗓️ {tripMeta.departureDate} → {tripMeta.returnDate}</span>
            <span className="itinerary-summary-pill">👥 {tripMeta.adults} adults</span>
            {tripMeta.travelPace ? <span className="itinerary-summary-pill">⚡ {tripMeta.travelPace}</span> : null}
            {tripMeta.transportation ? <span className="itinerary-summary-pill">🚗 {tripMeta.transportation}</span> : null}
          </div>
        )}

        <p>{itinerary.summary}</p>
      </div>

      <div className="itinerary-days">
        {itinerary.days.map((day, index) => (
          <article key={`${day.date}-${day.day}`} className="itinerary-day">
            <div className="itinerary-day__header">
              <div className="itinerary-day__badge" aria-hidden="true">
                {dayIcons[index % dayIcons.length]}
              </div>
              <div>
                <h3>
                  Day {day.day}
                  <span>{day.date}</span>
                </h3>
              </div>
            </div>

            <ul>
              {day.activities.map((activity) => (
                <li key={`${day.date}-${activity.timeOfDay}-${activity.title}`}>
                  <div className="itinerary-activity__head">
                    <strong>{activity.timeOfDay}</strong>
                    {activity.duration ? <span>{activity.duration}</span> : null}
                  </div>
                  <p className="itinerary-activity__title">{activity.title}</p>
                  <p className="itinerary-activity__description">{activity.description}</p>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {itinerary.packingList.length > 0 && (
        <div className="itinerary-packing-list">
          <div className="itinerary-section-tag itinerary-section-tag--packing">
            <span aria-hidden="true">🎒</span>
            <h3>Packing list</h3>
          </div>
          <ul>
            {itinerary.packingList.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
