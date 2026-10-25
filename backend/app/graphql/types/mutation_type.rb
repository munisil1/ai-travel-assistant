# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :generate_itinerary, mutation: Mutations::GenerateItinerary
    field :create_trip, mutation: Mutations::CreateTrip
    field :update_packing_status, mutation: Mutations::UpdatePackingStatus
  end
end
