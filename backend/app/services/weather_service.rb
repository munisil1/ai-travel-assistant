require "net/http"
require "uri"
require "json"

class WeatherService
    def self.get_forecast(latitude:, longitude:, start_date:, end_date:)
        uri = URI("https://api.open-meteo.com/v1/forecast")

        params = {
            latitude: latitude,
            longitude: longitude,
            start_date: start_date,
            end_date: end_date,
            daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
            timezone: "auto"
        }

        uri.query = URI.encode_www_form(params)
        response = Net::HTTP.get_response(uri)

        JSON.parse(response.body) if response.is_a?(Net::HTTPSuccess)
    end
end
