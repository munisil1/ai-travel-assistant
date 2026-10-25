class AddPackingStatusToTrips < ActiveRecord::Migration[7.0]
  def change
    add_column :trips, :packing_status, :jsonb, default: {}, null: false
  end
end