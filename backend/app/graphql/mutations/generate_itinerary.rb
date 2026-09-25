# frozen_string_literal: true

module Mutations
  class GenerateItinerary < BaseMutation
    argument :trip_id, ID, required: true

    field :itinerary, Types::ItineraryType, null: true

    def resolve(trip_id:)
      trip = Trip.find_by(id: trip_id)
      return { itinerary: nil } unless trip

      result = ::ItineraryGenerator.new(trip).call
      itinerary = JSON.parse(result).deep_transform_keys(&:underscore) if result.present?

      { itinerary: itinerary }

    end
  end
end
