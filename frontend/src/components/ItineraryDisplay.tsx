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

const formatTagValue = (value: string) =>
  value
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')

export function ItineraryDisplay({ itinerary, tripMeta }: ItineraryDisplayProps) {
  if (!itinerary) {
    return (
      <section className="itinerary-display" aria-live="polite">
        <p>Generated itinerary will be displayed here</p>
      </section>
    )
  }

  const tripTags = tripMeta
    ? [
        { icon: '📍', label: 'Destination', value: tripMeta.destination },
        {
          icon: '🗓️',
          label: 'Dates',
          value: `${tripMeta.departureDate} → ${tripMeta.returnDate}`,
        },
        { icon: '👥', label: 'Travelers', value: `${tripMeta.adults} adults` },
        tripMeta.travelPace ? { icon: '⚡', label: 'Pace', value: formatTagValue(tripMeta.travelPace) } : null,
        tripMeta.transportation ? { icon: '🚗', label: 'Transport', value: formatTagValue(tripMeta.transportation) } : null,
      ].filter((tag): tag is { icon: string; label: string; value: string } => Boolean(tag))
    : []

  return (
    <section className="itinerary-display" aria-live="polite">
      <div className="itinerary-display__summary">
        <div className="itinerary-section-tag">
          <p className="form-heading__overline">Overview</p>
        </div>

        {tripTags.length > 0 && (
          <div className="itinerary-summary-bar" aria-label="Trip summary">
            {tripTags.map((tag) => (
              <span
                key={`${tag.label}-${tag.value}`}
                className={`itinerary-summary-pill itinerary-summary-pill--${tag.label.toLowerCase()}`}
              >
                <span aria-hidden="true" className="itinerary-summary-pill__icon">{tag.icon}</span>
                <span className="itinerary-summary-pill__label">{tag.label}</span>
                <span className="itinerary-summary-pill__value">{tag.value}</span>
              </span>
            ))}
          </div>
        )}

        <p>{itinerary.summary}</p>
      </div>

      <div className="itinerary-days">
        {itinerary.days.map((day) => (
          <article key={`${day.date}-${day.day}`} className="itinerary-day">
            <div className="itinerary-day__header">
              <h3>Day {day.day}</h3>
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
            <h3>Packing list</h3>
          </div>
          <ul>
            {itinerary.packingList.map((item, index) => (
              <p>
                <input type="checkbox" id={`packing-${index}`} />
                <label htmlFor={`packing-${index}`}>{item}</label>
              </p>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
