class RenameTravelPlacetoPace < ActiveRecord::Migration[7.0]
  def change
    rename_column :trips, :travel_place, :travel_pace
  end
end
