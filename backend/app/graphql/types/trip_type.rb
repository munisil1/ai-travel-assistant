module Types
  class TripType < Types::BaseObject
    field :id, ID, null: false
    field :destination, String, null: false
    field :departure_date, GraphQL::Types::ISO8601Date, null: false
    field :return_date, GraphQL::Types::ISO8601Date, null: false
    field :adults, Integer, null: false
    field :budget, String, null: true
    field :travel_pace, String, null: true
    field :transportation, String, null: true
    field :interests, [String], null: false
    field :children, GraphQL::Types::JSON, null: false
    field :packing_status, GraphQL::Types::JSON, null: false
    field :itinerary, Types::ItineraryType, null: true

    def itinerary
      return unless object.itinerary

      object.itinerary.deep_transform_keys do |key|
        key.to_s.underscore
      end
    end
  end
end