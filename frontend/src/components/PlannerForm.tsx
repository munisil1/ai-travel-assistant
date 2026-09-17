import { useState, type FormEvent } from 'react'
import {
  DestinationAutocomplete,
  type SelectedDestination,
} from './DestinationAutocomplete'

type ChildAgeRange = 'Infant' | 'Toddler' | 'Child' | 'Teen'
type BudgetLevel = 'budget' | 'moderate' | 'luxury'
type InterestValue =
  | 'food'
  | 'nature'
  | 'history'
  | 'shopping'
  | 'beaches'
  | 'nightlife'
  | 'arts'
  | 'family'
  | 'adventure'
  | 'relaxation'
type TravelPace = 'relaxed' | 'balanced' | 'packed'
type TransportationMode =
  | 'public_transport'
  | 'rental_car'
  | 'walking_rideshare'
  | 'no_preference'

interface PlannerFormData {
  destination: string
  selectedDestination: SelectedDestination | null
  departureDate: string
  returnDate: string
  adults: number
  travelingWithChildren: boolean
  childAgeRanges: ChildAgeRange[]
  budget?: BudgetLevel
  interests?: InterestValue[]
  travelPace?: TravelPace
  transportation?: TransportationMode
}

const childAgeOptions: ChildAgeRange[] = ['Infant', 'Toddler', 'Child', 'Teen']

const budgetOptions: Array<{ value: BudgetLevel; label: string }> = [
  { value: 'budget', label: 'Budget' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'luxury', label: 'Luxury' },
]

const interestOptions: Array<{ value: InterestValue; label: string }> = [
  { value: 'food', label: 'Food & restaurants' },
  { value: 'nature', label: 'Nature & outdoors' },
  { value: 'history', label: 'History & culture' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'beaches', label: 'Beaches' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'arts', label: 'Arts & museums' },
  { value: 'family', label: 'Family activities' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'relaxation', label: 'Relaxation' },
]

const travelPaceOptions: Array<{ value: TravelPace; label: string }> = [
  {
    value: 'relaxed',
    label: 'Relaxed; Fewer activities and more downtime',
  },
  {
    value: 'balanced',
    label: 'Balanced; A mix of activities and downtime',
  },
  {
    value: 'packed',
    label: 'Packed; Maximize sightseeing and activities',
  },
]

const transportationOptions: Array<{ value: TransportationMode; label: string }> = [
  { value: 'public_transport', label: 'Public transportation' },
  { value: 'rental_car', label: 'Rental car' },
  { value: 'walking_rideshare', label: 'Walking / rideshare' },
  { value: 'no_preference', label: 'No preference' },
]

const initialFormData: PlannerFormData = {
  destination: '',
  selectedDestination: null,
  departureDate: '',
  returnDate: '',
  adults: 2,
  travelingWithChildren: false,
  childAgeRanges: [],
  budget: undefined,
  interests: [],
  travelPace: undefined,
  transportation: undefined,
}

export function PlannerForm() {
  const [formData, setFormData] = useState<PlannerFormData>(initialFormData)

  const updateChildAgeRange = (ageRange: ChildAgeRange): void => {
    setFormData((currentData) => {
      const hasAgeRange = currentData.childAgeRanges.includes(ageRange)
      const childAgeRanges = hasAgeRange
        ? currentData.childAgeRanges.filter((range) => range !== ageRange)
        : [...currentData.childAgeRanges, ageRange]

      return { ...currentData, childAgeRanges }
    })
  }

  const setTravelingWithChildren = (travelingWithChildren: boolean): void => {
    setFormData((currentData) => ({
      ...currentData,
      travelingWithChildren,
      childAgeRanges: travelingWithChildren ? currentData.childAgeRanges : [],
    }))
  }

  const updateInterest = (interest: InterestValue): void => {
    setFormData((currentData) => {
      const currentInterests = currentData.interests ?? []
      const hasInterest = currentInterests.includes(interest)
      const interests = hasInterest
        ? currentInterests.filter((currentInterest) => currentInterest !== interest)
        : [...currentInterests, interest]

      return { ...currentData, interests }
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const destinationIsValid = formData.destination.trim().length > 0
    const departureDateIsValid = formData.departureDate.trim().length > 0
    const returnDateIsValid = formData.returnDate.trim().length > 0

    if (!destinationIsValid || !departureDateIsValid || !returnDateIsValid) {
      return
    }

    const payload = {
      destination: formData.destination.trim(),
      departureDate: formData.departureDate,
      returnDate: formData.returnDate,
      adults: formData.adults,
      children: formData.travelingWithChildren ? formData.childAgeRanges : [],
      ...(formData.budget ? { budget: formData.budget } : {}),
      ...(formData.interests && formData.interests.length > 0
        ? { interests: formData.interests }
        : {}),
      ...(formData.travelPace ? { travelPace: formData.travelPace } : {}),
      ...(formData.transportation ? { transportation: formData.transportation } : {}),
    }

    console.log('Travel planner form data:', payload)
  }

  return (
    <form className="planner-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="form-heading__overline">Start planning</p>
          <h2>Where will you go?</h2>
        </div>
        <span className="form-heading__step">01 / 01</span>
      </div>

      <div className="form-grid">
        <label className="field field--wide" htmlFor="destination">
          <span>Destination*</span>
          <DestinationAutocomplete
            value={formData.destination}
            onChange={(destination) =>
              setFormData((currentData) => ({
                ...currentData,
                destination,
                selectedDestination: null,
              }))
            }
            onSelect={(selectedDestination) =>
              setFormData((currentData) => ({
                ...currentData,
                selectedDestination,
              }))
            }
          />
        </label>

        <label className="field" htmlFor="departure-date">
          <span>Departure*</span>
          <input
            id="departure-date"
            name="departureDate"
            type="date"
            required
            value={formData.departureDate}
            onChange={(event) =>
              setFormData((currentData) => ({
                ...currentData,
                departureDate: event.target.value,
              }))
            }
          />
        </label>

        <label className="field" htmlFor="return-date">
          <span>Return*</span>
          <input
            id="return-date"
            name="returnDate"
            type="date"
            required
            min={formData.departureDate || undefined}
            value={formData.returnDate}
            onChange={(event) =>
              setFormData((currentData) => ({
                ...currentData,
                returnDate: event.target.value,
              }))
            }
          />
        </label>

        <label className="field" htmlFor="adults">
          <span>Adults</span>
          <select
            id="adults"
            name="adults"
            value={formData.adults}
            onChange={(event) =>
              setFormData((currentData) => ({
                ...currentData,
                adults: Number(event.target.value),
              }))
            }
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((adultCount) => (
              <option key={adultCount} value={adultCount}>
                {adultCount} {adultCount === 1 ? 'adult' : 'adults'}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="children-fieldset">
        <legend>Traveling with children?</legend>
        <div className="choice-toggle">
          <label>
            <input
              type="radio"
              name="travelingWithChildren"
              checked={!formData.travelingWithChildren}
              onChange={() => setTravelingWithChildren(false)}
            />
            <span>No</span>
          </label>
          <label>
            <input
              type="radio"
              name="travelingWithChildren"
              checked={formData.travelingWithChildren}
              onChange={() => setTravelingWithChildren(true)}
            />
            <span>Yes</span>
          </label>
        </div>

        {formData.travelingWithChildren && (
          <div className="age-picker" aria-label="Select child age ranges">
            <p>Which age ranges are traveling?</p>
            <div className="age-picker__options">
              {childAgeOptions.map((ageRange) => {
                const isSelected = formData.childAgeRanges.includes(ageRange)

                return (
                  <label className="age-option" key={ageRange}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateChildAgeRange(ageRange)}
                    />
                    <span>{ageRange}</span>
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </fieldset>

      <div className="preferences-panel">
        <div className="preferences-panel__row">
          <label className="field" htmlFor="budget">
            <span>Budget</span>
            <select
              id="budget"
              name="budget"
              value={formData.budget ?? ''}
              onChange={(event) =>
                setFormData((currentData) => ({
                  ...currentData,
                  budget: event.target.value
                    ? (event.target.value as BudgetLevel)
                    : undefined,
                }))
              }
            >
              <option value="">Select budget</option>
              {budgetOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field" htmlFor="travel-pace">
            <span>Travel pace</span>
            <select
              id="travel-pace"
              name="travelPace"
              value={formData.travelPace ?? ''}
              onChange={(event) =>
                setFormData((currentData) => ({
                  ...currentData,
                  travelPace: event.target.value
                    ? (event.target.value as TravelPace)
                    : undefined,
                }))
              }
            >
              <option value="">Select pace</option>
              {travelPaceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="field" htmlFor="transportation">
          <span>Transportation</span>
          <select
            id="transportation"
            name="transportation"
            value={formData.transportation ?? ''}
            onChange={(event) =>
              setFormData((currentData) => ({
                ...currentData,
                transportation: event.target.value
                  ? (event.target.value as TransportationMode)
                  : undefined,
              }))
            }
          >
            <option value="">No preference</option>
            {transportationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="interests-fieldset">
          <legend>Interests</legend>
          <div className="chip-picker" aria-label="Select travel interests">
            {interestOptions.map(({ label, value }) => {
              const selectedInterests = formData.interests ?? []
              const isSelected = selectedInterests.includes(value)

              return (
                <label className="chip-option" key={value}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => updateInterest(value)}
                  />
                  <span>{label}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
      </div>

      <button className="submit-button" type="submit">
        Plan My Trip
        <span aria-hidden="true">→</span>
      </button>
    </form>
  )
}
