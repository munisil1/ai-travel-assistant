const GRAPHQL_URL = "http://localhost:3000/graphql";

export async function graphqlRequest<T>(
    query: string,
    variables?: Record<string, any>
): Promise<T> {
    const response = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
        throw new Error(`GraphQL request failed with status ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
}


export const CREATE_TRIP_MUTATION = `
    mutation CreateTrip($input: CreateTripInput!) {
        createTrip(input: $input) {
            trip {
                id
                destination
                departureDate
                returnDate
                adults
                budget
                travelPace
                transportation
                interests
                children
            }
        }
    }
`;

export interface CreateTripResponse {
    createTrip: {
        trip: {
            id: string;
            destination: string;
            departureDate: string;
            returnDate: string;
            adults: number;
            budget: string | null;
            travelPace: string | null;
            transportation: string | null;
            interests: string[];
            children: string[] | null;
        };
    };
}

export const GENERATE_ITINERARY_MUTATION = `
  mutation GenerateItinerary($input: GenerateItineraryInput!) {
    generateItinerary(input: $input) {
      itinerary {
        summary
        days {
          day
          date
          weather {
            temperature
            conditions
          }
          activities {
            timeOfDay
            title
            description
            duration
          }
        }
        packingList
      }
    }
  }
`;

export interface GenerateItineraryResponse {
    generateItinerary: {
        itinerary: {
            summary: string;
            days: {
                day: number;
                date: string;
                weather?: {
                    temperature: number;
                    conditions: string;
                }
                activities: {
                    timeOfDay: string;
                    title: string;
                    description: string;
                    duration: string;
                }[];
            }[];
            packingList: string[];
        };
    };
}


export const GET_TRIP_QUERY = `
    query GetTrip($id: ID!) {
        trip(id: $id) {
            id
            destination
            departureDate
            returnDate
            adults
            budget
            travelPace
            transportation
            interests
            children
            itinerary {
                summary
                days {
                    day
                    date
                    weather {
                        temperature
                        conditions
                    }
                    activities {
                        timeOfDay
                        title
                        description
                        duration
                    }
                }
                packingList
            }
        }
    }
`;

export interface GetTripResponse {
    trip: CreateTripResponse["createTrip"]["trip"] & {
        itinerary?: GenerateItineraryResponse["generateItinerary"]["itinerary"] | null;
    } | null;
}

export const GET_TRIPS_QUERY = `
    query GetTrips {
        trips {
            id
            destination
            departureDate
            returnDate
            adults
            budget
            travelPace
            transportation
            interests
            children
            itinerary {
              summary
            }
        }
    }
`;

export interface GetTripsResponse {
    trips: (CreateTripResponse["createTrip"]["trip"] & {
        itinerary?: {
            summary: string;
        } | null;
    })[];
}
