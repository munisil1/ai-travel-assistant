# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :generate_itinerary, mutation: Mutations::GenerateItinerary
    field :create_trip, mutation: Mutations::CreateTrip
  end
end
