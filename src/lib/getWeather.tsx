"use server";

type WeatherUnits = {
  time: string;
  interval: string;
  temperature: string;
  windspeed: string;
  winddirection: string;
  is_day: string;
  weathercode: string;
};

type CurrentWeather = {
  time: string;
  interval: number;
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
};

type HourlyUnits = {
  time: string;
  temperature_2m: string;
  precipitation: string;
  windspeed_10m: string;
};

type HourlyData = {
  time: string[];
  temperature_2m: number[];
  precipitation: number[];
  windspeed_10m: number[];
};

type DailyUnits = {
  time: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  precipitation_sum: string;
};

type DailyData = {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
};

type WeatherData = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather_units: WeatherUnits;
  current_weather: CurrentWeather;
  hourly_units: HourlyUnits;
  hourly: HourlyData;
  daily_units: DailyUnits;
  daily: DailyData;
};

export const getWeatherData = async (location: {
  geometry?: { coordinates?: number[] };
}): Promise<WeatherData> => {
  if (!location || !location?.geometry?.coordinates) {
    console.error("Invalid location data");
    return null;
  }

  const latitude = location.geometry.coordinates[1];
  const longitude = location.geometry.coordinates[0];

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data || {};
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    return null;
  }
};
