class CreateTrips < ActiveRecord::Migration[7.0]
  def change
    create_table :trips do |t|
      t.string :destination
      t.date :departure_date
      t.date :return_date
      t.integer :adults
      t.string :budget
      t.string :travel_place
      t.string :transportation
      t.jsonb :interests, default: []
      t.jsonb :children, default: []

      t.timestamps
    end
  end
end
