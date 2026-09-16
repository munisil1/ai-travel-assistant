import { useEffect, useRef, useState, type ChangeEvent } from 'react'

export interface SelectedDestination {
  name: string
  formatted: string
  country: string
  countryCode: string
  city: string | null
  state: string | null
  resultType: string
}

interface DestinationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (destination: SelectedDestination) => void
}

type GeoapifyResult = SelectedDestination

const MINIMUM_QUERY_LENGTH = 2
const DEBOUNCE_DELAY_MS = 350

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getString = (value: unknown): string =>
  typeof value === 'string' ? value : ''

const getNullableString = (value: unknown): string | null => {
  const stringValue = getString(value)
  return stringValue || null
}

const parseResult = (value: unknown): GeoapifyResult | null => {
  if (!isRecord(value)) {
    return null
  }

  const formatted = getString(value.formatted)
  const name = getString(value.name) || formatted
  const country = getString(value.country)
  const countryCode = getString(value.country_code)
  const resultType = getString(value.result_type)

  if (!name || !formatted || !country || !countryCode || !resultType) {
    return null
  }

  return {
    name,
    formatted,
    country,
    countryCode,
    city: getNullableString(value.city),
    state: getNullableString(value.state),
    resultType,
  }
}

const parseResponse = (value: unknown): GeoapifyResult[] => {
  if (!isRecord(value) || !Array.isArray(value.results)) {
    return []
  }

  return value.results.flatMap((result) => {
    const parsedResult = parseResult(result)
    return parsedResult ? [parsedResult] : []
  })
}

export function DestinationAutocomplete({
  value,
  onChange,
  onSelect,
}: DestinationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<GeoapifyResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const requestIdRef = useRef(0)
  const skipNextSearchRef = useRef(false)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  useEffect(() => {
    const query = value.trim()
    const requestId = ++requestIdRef.current

    // A selected result updates the controlled input value, but that value is already validated.
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false
      return
    }

    if (query.length < MINIMUM_QUERY_LENGTH) {
      return
    }

    const abortController = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY

      if (!apiKey) {
        setErrorMessage('Destination search is not configured.')
        setIsLoading(false)
        setIsOpen(true)
        return
      }

      setIsLoading(true)
      setErrorMessage(null)
      setIsOpen(true)

      const searchParams = new URLSearchParams({
        text: query,
        limit: '5',
        format: 'json',
        apiKey,
      })

      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?${searchParams.toString()}`,
          { signal: abortController.signal },
        )

        console.log("gotten here before response ", response);

        if (!response.ok) {
          throw new Error('Destination search failed.')
        }

        const responseBody: unknown = await response.json()
        const nextSuggestions = parseResponse(responseBody)

        // The request id prevents a slower response from an older query from replacing current results.
        if (requestId === requestIdRef.current) {
          setSuggestions(nextSuggestions)
          setIsLoading(false)
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        if (requestId === requestIdRef.current) {
          setSuggestions([])
          setErrorMessage('Could not load destinations. Please try again.')
          setIsLoading(false)
        }
      }
    }, DEBOUNCE_DELAY_MS)

    return () => {
      window.clearTimeout(timeoutId)
      abortController.abort()
    }
  }, [value])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    // Any edit invalidates the previous selection until the user chooses a new result.
    const nextValue = event.target.value
    onChange(nextValue)
    setSuggestions([])
    setIsLoading(false)
    setErrorMessage(null)
    setIsOpen(nextValue.trim().length >= MINIMUM_QUERY_LENGTH)
  }

  const handleSuggestionSelect = (suggestion: GeoapifyResult): void => {
    skipNextSearchRef.current = true
    onChange(suggestion.formatted)
    onSelect(suggestion)
    setSuggestions([])
    setIsOpen(false)
    setErrorMessage(null)
  }

  const statusMessage = isLoading
    ? 'Searching destinations...'
    : errorMessage ?? (suggestions.length === 0 ? 'No destinations found.' : null)

  return (
    <div className="destination-autocomplete" ref={containerRef}>
      <input
        id="destination"
        name="destination"
        type="text"
        placeholder="City, country, or region"
        value={value}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls="destination-suggestions"
        onChange={handleInputChange}
        onFocus={() => {
          if (value.trim().length >= MINIMUM_QUERY_LENGTH) {
            setIsOpen(true)
          }
        }}
      />

      {isOpen && value.trim().length >= MINIMUM_QUERY_LENGTH && (
        <div className="destination-dropdown" id="destination-suggestions">
          {statusMessage ? (
            <p className="destination-dropdown__status" role="status">
              {statusMessage}
            </p>
          ) : (
            <ul className="destination-dropdown__list" role="listbox">
              {suggestions.map((suggestion) => (
                <li key={`${suggestion.formatted}-${suggestion.resultType}`}>
                  <button
                    type="button"
                    role="option"
                    className="destination-suggestion"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    <span className="destination-suggestion__name">
                      {suggestion.name}
                    </span>
                    <span className="destination-suggestion__context">
                      {suggestion.city ?? suggestion.state ?? suggestion.country}
                      {suggestion.city && suggestion.state ? `, ${suggestion.state}` : ''}
                      {` · ${suggestion.country}`}
                    </span>
                    <span className="destination-suggestion__type">
                      {suggestion.resultType}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
