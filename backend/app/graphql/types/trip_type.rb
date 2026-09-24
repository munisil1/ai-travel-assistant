module Types
  class TripType < Types::BaseObject
    field :id, ID, null: false
    field :destination, String, null: false
    field :departure_date, GraphQL::Types::ISO8601Date, null: false
    field :return_date, GraphQL::Types::ISO8601Date, null: false
    field :adults, Integer, null: false
    field :budget, String, null: false
    field :travel_pace, String, null: false
    field :transportation, String, null: false
    field :interests, [String], null: false
    field :children, GraphQL::Types::JSON, null: false
  end
end