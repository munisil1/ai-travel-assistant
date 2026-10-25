import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  graphqlRequest,
  GET_TRIPS_QUERY,
  type GetTripsResponse,
} from '../api/graphql'
import { SavedTripsList } from './SavedTripsList'

export function SavedTripsPage() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState<GetTripsResponse['trips']>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const loadTrips = async (): Promise<void> => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await graphqlRequest<GetTripsResponse>(GET_TRIPS_QUERY)
        setTrips(result.trips)
      } catch (loadError) {
        console.error('Error loading saved trips:', loadError)
        setError('Could not load saved trips. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadTrips()
  }, [reloadKey])

  return (
    <SavedTripsList
      trips={trips}
      isLoading={isLoading}
      loadingTripId={null}
      error={error}
      onBack={() => navigate('/')}
      onViewItinerary={(tripId) =>
        navigate(`/trips/${tripId}`, { state: { from: '/saved-trips' } })
      }
      onRetry={() => setReloadKey((currentKey) => currentKey + 1)}
    />
  )
}