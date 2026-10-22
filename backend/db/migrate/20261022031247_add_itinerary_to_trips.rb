class AddItineraryToTrips < ActiveRecord::Migration[7.0]
  def change
    add_column :trips, :itinerary, :jsonb
  end
end
