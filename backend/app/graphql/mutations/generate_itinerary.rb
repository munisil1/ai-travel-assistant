# frozen_string_literal: true

module Mutations
  class GenerateItinerary < BaseMutation
    argument :trip_id, ID, required: true

    field :itinerary, Types::ItineraryType, null: true

    def resolve(trip_id:)
      trip = Trip.find_by(id: trip_id)
      return { itinerary: nil } unless trip

      itinerary =
       if trip.itinerary.present?
        trip.itinerary
       else
        result = ::ItineraryGenerator.new(trip).call
        JSON.parse(result) if result.present?
       end

      itinerary = itinerary.deep_transform_keys(&:underscore) if itinerary.present?

      { itinerary: itinerary }

    end
  end
end
