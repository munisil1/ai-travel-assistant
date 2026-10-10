require "net/http"
require "json"
require "uri"

class WeatherService
  def self.get_forecast(latitude:, longitude:, start_date:, end_date:)
    uri = URI(
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" \
      "#{latitude},#{longitude}/#{start_date}/#{end_date}"
    )

    params = {
      unitGroup: "metric",
      include: "days",
      key: ENV.fetch("VISUAL_CROSSING_API_KEY"),
      contentType: "json"
    }

    uri.query = URI.encode_www_form(params)

    response = Net::HTTP.get_response(uri)

    raise "Weather API error: #{response.code} #{response.body}" unless response.is_a?(Net::HTTPSuccess)

    JSON.parse(response.body)
  end
end
