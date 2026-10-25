import { useState } from 'react'
import { graphqlRequest, UPDATE_PACKING_STATUS_MUTATION, type GenerateItineraryResponse, type UpdatePackingStatusResponse } from '../api/graphql'
import { getWeatherIcon } from '../utils/weatherIcons'

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
  tripId: string
  packingStatus: Record<string, boolean>
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

const formatTripDate = (value: string) => {
  const date = new Date(`${value}T12:00:00`)

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export function ItineraryDisplay({ itinerary, tripId, packingStatus, tripMeta }: ItineraryDisplayProps) {
  const [savedPackingState, setSavedPackingState] = useState({ tripId, items: packingStatus })
  const [packingError, setPackingError] = useState<string | null>(null)
  const packedItems = savedPackingState.tripId === tripId ? savedPackingState.items : packingStatus

  if (!itinerary) {
    return (
      <section className="itinerary-display" aria-live="polite">
        <p>Generated itinerary will be displayed here</p>
      </section>
    )
  }

  const tripTags = tripMeta
    ? [
        { icon: '👥', label: 'Travelers', value: `${tripMeta.adults} adults` },
        tripMeta.travelPace ? { icon: '⚡', label: 'Pace', value: formatTagValue(tripMeta.travelPace) } : null,
        tripMeta.transportation ? { icon: '🚗', label: 'Transport', value: formatTagValue(tripMeta.transportation) } : null,
      ].filter((tag): tag is { icon: string; label: string; value: string } => Boolean(tag))
    : []
  const forecastDays = itinerary.days.filter((day) => day.weather)
  const averageTemperature = forecastDays.length
    ? Math.round(forecastDays.reduce((total, day) => total + (day.weather?.temperature ?? 0), 0) / forecastDays.length)
    : null
  const packedCount = itinerary.packingList.reduce(
    (count, item) => count + (packedItems[item] ? 1 : 0),
    0,
  )

  const updatePackedStatus = async (item: string, packed: boolean): Promise<void> => {
    const previousStatus = Boolean(packedItems[item])
    setSavedPackingState({ tripId, items: { ...packedItems, [item]: packed } })
    setPackingError(null)

    try {
      await graphqlRequest<UpdatePackingStatusResponse>(UPDATE_PACKING_STATUS_MUTATION, {
        input: { tripId, item, packed },
      })
    } catch (error) {
      setSavedPackingState((current) => ({
        tripId,
        items: { ...(current.tripId === tripId ? current.items : packedItems), [item]: previousStatus },
      }))
      setPackingError('Could not save packing progress. Please try again.')
      console.error('Error saving packing status:', error)
    }
  }

  return (
    <section className="itinerary-display" aria-live="polite">
      <header className="itinerary-overview">
        <p className="itinerary-overview__eyebrow">Your travel journal</p>
        <div className="itinerary-overview__heading">
          <div>
            <h2>{tripMeta?.destination || 'Your itinerary'}</h2>
            {tripMeta && (
              <p className="itinerary-overview__dates">
                {formatTripDate(tripMeta.departureDate)} <span aria-hidden="true">→</span> {formatTripDate(tripMeta.returnDate)}
              </p>
            )}
          </div>
          {averageTemperature !== null && (
            <div className="itinerary-overview__forecast" aria-label={`Forecast average ${averageTemperature} degrees Celsius across ${forecastDays.length} days`}>
              <span aria-hidden="true">{getWeatherIcon(forecastDays[0].weather?.conditions ?? '')}</span>
              <span><strong>{averageTemperature}°C</strong><small>average forecast</small></span>
            </div>
          )}
        </div>
        <p className="itinerary-overview__summary">{itinerary.summary}</p>

        {tripTags.length > 0 && (
          <dl className="itinerary-details" aria-label="Trip details">
            {tripTags.map((tag) => (
              <div className="itinerary-detail" key={`${tag.label}-${tag.value}`}>
                <dt><span aria-hidden="true">{tag.icon}</span>{tag.label}</dt>
                <dd>{tag.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      <section className="itinerary-plan" aria-labelledby="itinerary-plan-title">
        <div className="itinerary-section-heading">
          <p className="itinerary-overview__eyebrow">The days ahead</p>
          <h2 id="itinerary-plan-title">Your itinerary</h2>
        </div>
        <div className="itinerary-days">
        {itinerary.days.map((day) => (
          <article key={`${day.date}-${day.day}`} className="itinerary-day">
            <div className="itinerary-day__index">
              <h3>Day {String(day.day).padStart(2, '0')}</h3>
              <time dateTime={day.date}>{formatTripDate(day.date)}</time>
            </div>
            <div className="itinerary-day__content">
              <div className="itinerary-day__header">
                {day.weather && (
                  <p
                    className="itinerary-day__weather"
                    aria-label={`${day.weather.conditions}, ${Math.round(day.weather.temperature)} degrees Celsius`}
                    title={day.weather.conditions}
                  >
                    <span aria-hidden="true">{getWeatherIcon(day.weather.conditions)}</span>
                    <span>{Math.round(day.weather.temperature)}°C</span>
                    <small>{day.weather.conditions}</small>
                  </p>
                )}
              </div>
              <ol className="itinerary-activity-list">
                {day.activities.map((activity) => (
                  <li className="itinerary-activity" key={`${day.date}-${activity.timeOfDay}-${activity.title}`}>
                    <div className="itinerary-activity__time">{activity.timeOfDay}</div>
                    <div className="itinerary-activity__body">
                      <div className="itinerary-activity__title-row">
                        <h4>{activity.title}</h4>
                        {activity.duration && <span>{activity.duration}</span>}
                      </div>
                      <p>{activity.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </article>
        ))}
        </div>
      </section>

      {itinerary.packingList.length > 0 && (
        <section className="itinerary-packing-list" aria-labelledby="packing-list-title">
          <div className="itinerary-packing-list__heading">
            <div>
              <p className="itinerary-overview__eyebrow">Before you go</p>
              <h2 id="packing-list-title">Packing list</h2>
            </div>
            <p className="itinerary-packing-list__progress-text">
              {packedCount} of {itinerary.packingList.length} items packed
            </p>
          </div>
          <progress
            className="itinerary-packing-list__progress"
            value={packedCount}
            max={itinerary.packingList.length}
            aria-label="Packing progress"
          />
          {packingError && <p role="alert">{packingError}</p>}
          <ul className="itinerary-packing-list__items">
            {itinerary.packingList.map((item, index) => (
              <li className={packedItems[item] ? 'is-packed' : ''} key={`${item}-${index}`}>
                <input
                  type="checkbox"
                  id={`packing-${index}`}
                  checked={Boolean(packedItems[item])}
                  onChange={(event) => void updatePackedStatus(item, event.target.checked)}
                />
                <label htmlFor={`packing-${index}`}>{item}</label>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  )
}
