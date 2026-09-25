class ItineraryGenerator
    def initialize(trip)
      @trip = trip
      @client = OpenAI::Client.new(
        api_key: ENV.fetch('OPENAI_API_KEY')
        )
    end

    def call
        response = @client.responses.create(
            model: "gpt-5.6-luna",
            input: prompt,
            text: {
                format: {
                    type: "json_schema",
                    name: "travel_itinerary",
                    strict: true,
                    schema: {
                    type: "object",
                    properties: {
                        summary: {
                        type: "string"
                        },
                        days: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                            day: {
                                type: "integer"
                            },
                            date: {
                                type: "string"
                            },
                            activities: {
                                type: "array",
                                items: {
                                type: "object",
                                properties: {
                                    timeOfDay: {
                                    type: "string"
                                    },
                                    title: {
                                    type: "string"
                                    },
                                    description: {
                                    type: "string"
                                    },
                                    duration: {
                                    type: "string"
                                    }
                                },
                                required: [
                                    "timeOfDay",
                                    "title",
                                    "description",
                                    "duration"
                                ],
                                additionalProperties: false
                                }
                            }
                            },
                            required: [
                            "day",
                            "date",
                            "activities"
                            ],
                            additionalProperties: false
                        }
                        },
                        packingList: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                        }
                    },
                    required: [
                        "summary",
                        "days",
                        "packingList"
                    ],
                    additionalProperties: false
                    }
                }
}
        )

      #  Rails.logger.info("OpenAI API response: #{response.to_h}")

        response.output_text
    end

    private 

    def prompt
    <<~PROMPT
      Create a personalized travel itinerary for the following trip.

      Destination: #{@trip.destination}
      Departure date: #{@trip.departure_date}
      Return date: #{@trip.return_date}
      Adults: #{@trip.adults}
      Children: #{@trip.children}
      Budget: #{@trip.budget}
      Interests: #{@trip.interests}
      Travel pace: #{@trip.travel_pace}
      Transportation: #{@trip.transportation}

      Create a practical itinerary that matches the traveler's
      interests, budget, pace, and transportation preferences.

      Return the response as JSON.
    PROMPT
    end
end
