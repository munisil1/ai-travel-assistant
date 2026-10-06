require "net/http"
require "json"
require "uri"

class GeocodingService
  def self.get_coordinates(destination)
    uri = URI("https://geocoding-api.open-meteo.com/v1/search")

    params = {
      name: destination,
      count: 1,
      language: "en",
      format: "json"
    }

    uri.query = URI.encode_www_form(params)

    response = Net::HTTP.get_response(uri)

    data = JSON.parse(response.body)

    result = data.dig("results", 0)

    return nil unless result

    {
      latitude: result["latitude"],
      longitude: result["longitude"]
    }
  end
end
