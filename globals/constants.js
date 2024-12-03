export const middleOfRo = [24.9668, 45.9432];

export const weatherCodeDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm (slight)",
  96: "Thunderstorm (slight hail)",
  99: "Thunderstorm (severe hail)",
};

export const weatherIconsCodeDescriptionsURL = {
  0: "/images/svg/a_1_sunny.svg", // sunny
  1: "/images/svg/a_4_night.svg", // clear night
  2: "/images/svg/b_1_partly_cloudy.svg", // partly cloudy
  3: "/images/svg/b_2_cloudy.svg", // cloudy
  45: "/images/svg/d_4_fog.svg", // fog
  48: "/images/svg/d_4_fog.svg", // fog
  51: "/images/svg/c_1_rainy.svg", // rainy (light rain)
  53: "/images/svg/c_1_rainy.svg", // rainy (moderate rain)
  55: "/images/svg/c_1_rainy.svg", // rainy (heavy rain)
  56: "/images/svg/d_3_sleet.svg", // snowy-rainy (light freezing rain)
  57: "/images/svg/d_3_sleet.svg", // snowy-rainy (heavy freezing rain)
  61: "/images/svg/c_1_rainy.svg", // rainy (light showers)
  63: "/images/svg/c_1_rainy.svg", // rainy (moderate showers)
  65: "/images/svg/c_2_heavy_rain.svg", // pouring (heavy showers)
  66: "/images/svg/d_3_sleet.svg", // snowy-rainy (freezing rain showers)
  67: "/images/svg/d_3_sleet.svg", // snowy-rainy (heavy freezing rain showers)
  71: "/images/svg/d_1_snow.svg", // snowy (light snow)
  73: "/images/svg/d_2_heavy_snow.svg", // snowy (moderate snow)
  75: "/images/svg/d_2_heavy_snow.svg", // snowy (heavy snow)
  77: "/images/svg/g_3_snowflake.svg", // snowy (snow grains)
  80: "/images/svg/c_1_rainy.svg", // rainy (light rain showers)
  81: "/images/svg/c_2_heavy_rain.svg", // rainy (moderate rain showers)
  82: "/images/svg/c_2_heavy_rain.svg", // pouring (heavy rain showers)
  85: "/images/svg/d_1_snow.svg", // snowy (light snow showers)
  86: "/images/svg/d_2_heavy_snow.svg", // snowy (heavy snow showers)
  95: "/images/svg/c_4_lightning.svg", // lightning (thunderstorm)
  96: "/images/svg/c_4_lightning.svg", // lightning-rainy (thunderstorm with rain)
  99: "/images/svg/c_4_lightning.svg", // lightning-rainy (severe thunderstorm with rain)
};

export const RANDOM_CITIES = [
  "Paris",
  "Berlin",
  "Madrid",
  "Rome",
  "Vienna",
  "Amsterdam",
  "Prague",
  "Lisbon",
  "Athens",
  "Budapest",
  "Dublin",
  "Stockholm",
  "Copenhagen",
  "Helsinki",
  "Warsaw",
  "New York",
  "Tokyo",
  "Beijing",
  "Mumbai",
  "Sydney",
  "Cape Town",
  "Buenos Aires",
  "Mexico City",
  "Cairo",
  "Dubai",
  "Rio de Janeiro",
  "Seoul",
  "Bangkok",
  "Toronto",
  "Singapore",
];

export const citiesTranslations = {
  Roma: "Rome", // Italian to English
  Praha: "Prague", // Czech to English
  München: "Munich", // German to English
  Zürich: "Zurich", // German to English
  Wien: "Vienna", // German to English
  Moskva: "Moscow", // Russian to English
  Lisboa: "Lisbon", // Portuguese to English
  København: "Copenhagen", // Danish to English
  Genève: "Geneva", // French to English
  Montréal: "Montreal", // French to English
  香港: "Hong Kong", // Chinese to English
  北京: "Beijing", // Chinese to English
  İstanbul: "Istanbul", // Turkish to English
  القاهرة: "Cairo", // Arabic to English
  新加坡: "Singapore", // Chinese to English
  Buenos_Aires: "Buenos Aires", // Spanish to English
  Santiago: "Santiago", // Spanish to English
  São_Paulo: "São Paulo", // Portuguese to English
  Rio_de_Janeiro: "Rio de Janeiro", // Portuguese to English
  Guadalajara: "Guadalajara", // Spanish to English
  Tokyo: "Tokyo", // Japanese to English (no translation necessary)
  "New York": "New York City", // Handle ambiguous cases like "New York"
  "Los Angeles": "Los Angeles", // Common for English
  "San Francisco": "San Francisco", // Common for English
  Vancouver: "Vancouver", // English to English
  Sydney: "Sydney", // English to English
  Melbourne: "Melbourne", // English to English
  Milan: "Milan", // Italian to English
  Florence: "Florence", // English translation for Firenze
  Madrid: "Madrid", // Spanish to English
  Barcelona: "Barcelona", // Spanish to English
  Paris: "Paris", // French to English
  Berlin: "Berlin", // German to English
  Rome: "Rome", // English to English (standard form)
  Lima: "Lima", // Spanish to English
  Cairo: "Cairo", // Arabic to English
  Dhaka: "Dhaka", // Bengali to English
  Lagos: "Lagos", // English to English
  Jakarta: "Jakarta", // Indonesian to English
  "Kuala Lumpur": "Kuala Lumpur", // English to English
  Seoul: "Seoul", // Korean to English
  Bangkok: "Bangkok", // Thai to English
  Hanoi: "Hanoi", // Vietnamese to English
  Lagos: "Lagos", // Nigerian city
  "Cape Town": "Cape Town", // English to English
  Abuja: "Abuja", // English to English
  Kinshasa: "Kinshasa", // French to English
  "Addis Ababa": "Addis Ababa", // English to English
  Riyadh: "Riyadh", // Arabic to English
  Manila: "Manila", // Filipino to English
  Mumbai: "Mumbai", // English to English
  Kolkata: "Kolkata", // Bengali to English
  Chennai: "Chennai", // Tamil to English
  Hyderabad: "Hyderabad", // English to English
  Karachi: "Karachi", // English to English
  Karachi: "Karachi", // Urdu to English
  Lahore: "Lahore", // Urdu to English
  Abidjan: "Abidjan", // French to English
  Douala: "Douala", // French to English
  Bamako: "Bamako", // French to English
  Accra: "Accra", // English to English
  "Dar es Salaam": "Dar es Salaam", // Swahili to English
  Nairobi: "Nairobi", // Swahili to English
  Algiers: "Algiers", // French to English
  Casablanca: "Casablanca", // Arabic to English
  Lima: "Lima", // Spanish to English
  Montevideo: "Montevideo", // Spanish to English
  Asunción: "Asunción", // Spanish to English
  Quito: "Quito", // Spanish to English
  "La Paz": "La Paz", // Spanish to English
  Santiago: "Santiago", // Spanish to English
  Guayaquil: "Guayaquil", // Spanish to English
  Tegucigalpa: "Tegucigalpa", // Spanish to English
  Lima: "Lima", // Spanish to English
  "Addis Ababa": "Addis Ababa", // Amharic to English
  Porto: "Porto", // Portuguese to English
  Tangier: "Tangier", // Arabic to English
  Amman: "Amman", // Arabic to English
  Yerevan: "Yerevan", // Armenian to English
  Belgrade: "Belgrade", // Serbian to English
  Warsaw: "Warsaw", // Polish to English
  Skopje: "Skopje", // Macedonian to English
  Sofia: "Sofia", // Bulgarian to English
  Riga: "Riga", // Latvian to English
  Tallinn: "Tallinn", // Estonian to English
  Vilnius: "Vilnius", // Lithuanian to English
  Zagreb: "Zagreb", // Croatian to English
  Podgorica: "Podgorica", // Montenegrin to English
  Sarajevo: "Sarajevo", // Bosnian to English
  Chisinau: "Chisinau", // Romanian to English
  Bucharest: "Bucharest", // Romanian to English
};
