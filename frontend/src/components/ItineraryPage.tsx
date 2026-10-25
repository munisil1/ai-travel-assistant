import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { graphqlRequest, GET_TRIP_QUERY, type GetTripResponse } from '../api/graphql'
import { ItineraryDisplay } from './ItineraryDisplay'

type Trip = NonNullable<GetTripResponse['trip']>
type RouteState = { from?: string } | null

export function ItineraryPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tripId) return

    const loadTrip = async (): Promise<void> => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await graphqlRequest<GetTripResponse>(GET_TRIP_QUERY, { id: tripId })

        if (!result.trip) {
          setError('This trip could not be found.')
          return
        }

        if (!result.trip.itinerary) {
          setError('This trip does not have a saved itinerary yet.')
          return
        }

        setTrip(result.trip)
      } catch (loadError) {
        console.error('Error loading saved itinerary:', loadError)
        setError('Could not load this itinerary. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadTrip()
  }, [tripId])

  const routeState = location.state as RouteState
  const backPath = routeState?.from === '/saved-trips' ? '/saved-trips' : '/'

  return (
    <section className="planner-form planner-form--itinerary" aria-live="polite">
      <button type="button" className="back-button" onClick={() => navigate(backPath)}>
        {backPath === '/saved-trips' ? '← Back to saved trips' : '← Back to planner'}
      </button>

      {!tripId ? (
        <p className="saved-trips-view__message saved-trips-view__message--error" role="alert">
          No trip was specified.
        </p>
      ) : isLoading ? (
        <p className="saved-trips-view__message" role="status">Loading itinerary...</p>
      ) : error ? (
        <p className="saved-trips-view__message saved-trips-view__message--error" role="alert">
          {error}
        </p>
      ) : trip?.itinerary ? (
        <ItineraryDisplay
          itinerary={trip.itinerary}
          tripMeta={{
            destination: trip.destination,
            departureDate: trip.departureDate,
            returnDate: trip.returnDate,
            adults: trip.adults,
            travelPace: trip.travelPace ?? undefined,
            transportation: trip.transportation ?? undefined,
          }}
        />
      ) : null}
    </section>
  )
}