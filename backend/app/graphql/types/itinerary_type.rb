module Types 

  class ActivityType < Types::BaseObject
    field :time_of_day, String, null: false
    field :title, String, null: false
    field :description, String, null: false
    field :duration, String, null: true
  end

  class WeatherType < Types::BaseObject
    field :temperature, Float, null: false
    field :conditions, String, null: false
  end

  class DayType < Types::BaseObject
    field :day, Integer, null: false
    field :date, String, null: false
    field :activities, [Types::ActivityType], null: true
    field :weather, Types::WeatherType, null: true
  end

  class ItineraryType < Types::BaseObject
    field :summary, String, null: false
    field :days, [Types::DayType], null: false
    field :packing_list, [String], null: false
  end
end
