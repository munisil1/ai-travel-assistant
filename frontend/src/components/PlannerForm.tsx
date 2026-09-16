import { useState, type FormEvent } from 'react'
import {
  DestinationAutocomplete,
  type SelectedDestination,
} from './DestinationAutocomplete'

type ChildAgeRange = 'Infant' | 'Toddler' | 'Child' | 'Teen'

interface PlannerFormData {
  destination: string
  selectedDestination: SelectedDestination | null
  departureDate: string
  returnDate: string
  adults: number
  travelingWithChildren: boolean
  childAgeRanges: ChildAgeRange[]
}

const childAgeOptions: ChildAgeRange[] = ['Infant', 'Toddler', 'Child', 'Teen']

const initialFormData: PlannerFormData = {
  destination: '',
  selectedDestination: null,
  departureDate: '',
  returnDate: '',
  adults: 2,
  travelingWithChildren: false,
  childAgeRanges: [],
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    console.log('Travel planner form data:', formData)
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
          <span>Destination</span>
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
          <span>Departure</span>
          <input
            id="departure-date"
            name="departureDate"
            type="date"
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
          <span>Return</span>
          <input
            id="return-date"
            name="returnDate"
            type="date"
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

      <button className="submit-button" type="submit">
        Plan My Trip
        <span aria-hidden="true">→</span>
      </button>
    </form>
  )
}
