import type { GenerateItineraryResponse } from '../api/graphql'

type ItineraryDisplayProps = {
  itinerary: GenerateItineraryResponse['generateItinerary']['itinerary'] | null
}

export function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  if (!itinerary) {
    return (
      <section aria-live="polite">
        <p>Generated itinerary will be displayed here</p>
      </section>
    )
  }

  return (
    <section className="itinerary-display" aria-live="polite">
      <h3>Trip itinerary</h3>

      <p>{itinerary.summary}</p>

      {itinerary.days.map((day) => (
        <article key={`${day.date}-${day.day}`} className="itinerary-day">
          <h4>
            Day {day.day} · {day.date}
          </h4>

          <ul>
            {day.activities.map((activity) => (
              <li key={`${day.date}-${activity.timeOfDay}-${activity.title}`}>
                <strong>{activity.timeOfDay}:</strong> {activity.title}
                <p>{activity.description}</p>
                {activity.duration ? <small>{activity.duration}</small> : null}
              </li>
            ))}
          </ul>
        </article>
      ))}

      {itinerary.packingList.length > 0 && (
        <div>
          <h4>Packing list</h4>
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
