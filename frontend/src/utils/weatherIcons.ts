const weatherConditionIcons: Array<{ match: RegExp; icon: string }> = [
  { match: /thunder|storm|lightning/i, icon: '⛈️' },
  { match: /snow|ice|sleet/i, icon: '❄️' },
  { match: /rain|drizzle|shower/i, icon: '🌧️' },
  { match: /fog|mist|haze/i, icon: '🌫️' },
  { match: /partly|partially|mostly cloudy/i, icon: '🌤️' },
  { match: /cloud|overcast/i, icon: '☁️' },
  { match: /clear|sun/i, icon: '☀️' },
]

export function getWeatherIcon(conditions: string): string {
  return weatherConditionIcons.find(({ match }) => match.test(conditions))?.icon ?? '🌡️'
}
