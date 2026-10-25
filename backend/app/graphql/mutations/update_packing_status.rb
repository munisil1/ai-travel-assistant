# frozen_string_literal: true

module Mutations
  class UpdatePackingStatus < BaseMutation
    argument :trip_id, ID, required: true
    argument :item, String, required: true
    argument :packed, Boolean, required: true

    field :packing_status, GraphQL::Types::JSON, null: false

    def resolve(trip_id:, item:, packed:)
      trip = Trip.find(trip_id)
      packing_status = (trip.packing_status || {}).merge(item => packed)
      trip.update!(packing_status: packing_status)

      { packing_status: trip.packing_status }
    end
  end
end