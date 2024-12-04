"use server";

export const getWeatherData = async (location) => {
  if (
    !location ||
    !location[0] ||
    !location[0].geometry ||
    !location[0].geometry.coordinates
  ) {
    console.error("Invalid location data");
    return null;
  }

  const latitude = location[0].geometry.coordinates[1];
  const longitude = location[0].geometry.coordinates[0];

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
