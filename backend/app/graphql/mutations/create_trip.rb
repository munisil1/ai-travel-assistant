module Mutations
    class CreateTrip < BaseMutation
      argument :destination, String, required: true
      argument :departure_date, GraphQL::Types::ISO8601Date, required: true
      argument :return_date, GraphQL::Types::ISO8601Date, required: true
      argument :adults, Integer, required: true
      argument :budget, String, required: true
      argument :travel_pace, String, required: true
      argument :transportation, String, required: true
      argument :interests, [String], required: true
      argument :children, GraphQL::Types::JSON, required: false

      field :trip, Types::TripType, null: true
      field :errors, [String], null: false

      def resolve(**attrs)
        trip = Trip.create!(
            destination: attrs[:destination],
            departure_date: attrs[:departure_date],
            return_date: attrs[:return_date],
            adults: attrs[:adults],
            budget: attrs[:budget],
            travel_pace: attrs[:travel_pace],
            transportation: attrs[:transportation],
            interests: attrs[:interests],
            children: attrs[:children]
        )

        { trip: trip }
      end
    end
end
    