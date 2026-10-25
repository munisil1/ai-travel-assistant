# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2026_10_25_000000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "itineraries", force: :cascade do |t|
    t.bigint "trip_id", null: false
    t.text "summary", null: false
    t.jsonb "days", default: [], null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["trip_id"], name: "index_itineraries_on_trip_id", unique: true
  end

  create_table "packing_items", force: :cascade do |t|
    t.bigint "itinerary_id", null: false
    t.string "label", null: false
    t.integer "position", null: false
    t.boolean "packed", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["itinerary_id", "position"], name: "index_packing_items_on_itinerary_id_and_position", unique: true
    t.index ["itinerary_id"], name: "index_packing_items_on_itinerary_id"
  end

  create_table "trips", force: :cascade do |t|
    t.string "destination"
    t.date "departure_date"
    t.date "return_date"
    t.integer "adults"
    t.string "budget"
    t.string "travel_pace"
    t.string "transportation"
    t.jsonb "interests", default: []
    t.jsonb "children", default: []
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "itinerary"
    t.jsonb "packing_status", default: {}, null: false
  end

  add_foreign_key "itineraries", "trips", on_delete: :cascade
  add_foreign_key "packing_items", "itineraries", on_delete: :cascade
end
