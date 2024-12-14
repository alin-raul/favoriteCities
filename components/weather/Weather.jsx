"use client";

import React, { useEffect, useState } from "react";
import { weatherIconsCodeDescriptionsURL } from "@/globals/constants";
import { weatherCodeDescriptions } from "@/globals/constants";
import { ReactSVG } from "react-svg";
import SunCalc from "suncalc";

const getWeatherDescription = (weatherCode) => {
  return weatherCodeDescriptions[weatherCode] || "Unknown weather condition";
};

const isNightTime = (latitude, longitude, currentDate) => {
  const times = SunCalc.getTimes(currentDate, latitude, longitude);
  const sunrise = times.sunrise;
  const sunset = times.sunset;

  const currentTime = new Date(currentDate).getTime();
  const sunriseTime = sunrise.getTime();
  const sunsetTime = sunset.getTime();

  return currentTime < sunriseTime || currentTime > sunsetTime;
};

const getBackgroundGradient = (weatherCode, isNight) => {
  // Clear Sky
  if (weatherCode === 0) {
    return isNight
      ? "bg-gradient-to-br from-[#0a1929] to-[#1d2a42]" // Darker Night Sky
      : "bg-gradient-to-br from-[#FFB700] to-[#FF5733]"; // Lighter Day Sky
  }

  // Partly cloudy, Cloudy
  if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) {
    return isNight
      ? "bg-gradient-to-br from-[#1f2a37] to-[#2c3e50]" // Darker Night Clouds
      : "bg-gradient-to-br from-[#c8d6e5] to-[#95a5a6]"; // Lighter Day Clouds
  }

  // Rainy conditions
  if (weatherCode === 4 || weatherCode === 5) {
    return isNight
      ? "bg-gradient-to-br from-[#1c1c1c] to-[#2c3e50]" // Darker Night Rain
      : "bg-gradient-to-br from-[#64758b] to-[#839ba3]"; // Lighter Day Rain
  }

  // Snowy conditions
  if (weatherCode === 6 || weatherCode === 7) {
    return isNight
      ? "bg-gradient-to-br from-[#eaf2f8] to-[#a1b5c4]" // Darker Night Snow
      : "bg-gradient-to-br from-[#d6e5f3] to-[#a2b9c6]"; // Lighter Day Snow
  }

  // Thunderstorms
  if (weatherCode === 8 || weatherCode === 9) {
    return isNight
      ? "bg-gradient-to-br from-[#2c3e50] to-[#34495e]" // Darker Night Thunderstorm
      : "bg-gradient-to-br from-[#9b4d3d] to-[#d6614a]"; // Lighter Day Thunderstorm
  }

  // Foggy conditions
  if (weatherCode === 10 || weatherCode === 11 || weatherCode === 12) {
    return isNight
      ? "bg-gradient-to-br from-[#2f3d56] to-[#4f5b6b]" // Darker Night Fog
      : "bg-gradient-to-br from-[#9e9e9e] to-[#b0b0b0]"; // Lighter Day Fog
  }

  // Default cloudy or unknown weather
  return isNight
    ? "bg-gradient-to-br from-[#2f3d56] to-[#4f5b6b]" // Darker Default Night
    : "bg-gradient-to-br from-[#b0c4e3] to-[#a0aab8]"; // Lighter Default Day
};

const Weather = ({ weatherData, name = "", country = "", tiny = false }) => {
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const latitude = weatherData.latitude;
    const longitude = weatherData.longitude;
    const currentDate = new Date();

    setIsNight(isNightTime(latitude, longitude, currentDate));
  }, [weatherData]);

  const getIconForWeather = (weatherCode, isNight) => {
    if (isNight && (weatherCode === 2 || weatherCode === 3)) {
      return "/images/svg/b_4_cloudy_night.svg";
    }
    if ((isNight && weatherCode === 1) || weatherCode === 0) {
      return "/images/svg/a_4_night.svg";
    }

    return weatherIconsCodeDescriptionsURL[weatherCode];
  };

  const backgroundGradient = getBackgroundGradient(
    weatherData.current_weather.weathercode,
    isNight
  );

  if (tiny) {
    return (
      <div className="flex flex-col items-center p-2">
        <ReactSVG
          src={getIconForWeather(
            weatherData.current_weather.weathercode,
            isNight
          )}
          className="h-10 w-10 md:h-12 md:w-12"
        />
        <span className="ml-2 text-xl font-bold">
          {weatherData.current_weather.temperature}
          {weatherData.current_weather_units.temperature}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`w-auto h-full aspect-w-16 aspect-h-9 rounded-3xl shadow-inner text-white ${backgroundGradient} `}
    >
      <div className="flex justify-between w-full p-6 rounded-3xl shadow-lg">
        <div className="flex flex-col justify-between rounded-2xl p-6 w-full">
          <div className="flex items-center h-full">
            <div className="flex justify-end text-clip text-7xl font-light my-2 overflow-hidden">
              <span className="text-3xl md:text-5xl lg:text-8xl">
                {weatherData.current_weather.temperature}
                {weatherData.current_weather_units.temperature}
              </span>
            </div>
          </div>

          <div className="font-medium opacity-70 text-sm lg:text-xl mt-2">
            <span>H: {weatherData.daily.temperature_2m_max[0]}°</span>
            <span className="ml-4">
              L: {weatherData.daily.temperature_2m_min[0]}°
            </span>
          </div>

          <div className="text-sm lg:text-xl font-semibold opacity-80">
            <span>
              {name}, {country}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-end items-center rounded-2xl p-6 flex-auto w-full">
          <ReactSVG
            src={getIconForWeather(
              weatherData.current_weather.weathercode,
              isNight
            )}
            className="h-20 w-20 md:h-32 md:w-32 lg:h-48 lg:w-48 xl:h-56 xl:w-56 top-0 z-10"
          />
          <span className="text-sm lg:text-lg font-semibold opacity-90 capitalize mb-2">
            {getWeatherDescription(weatherData.current_weather.weathercode)}
          </span>
          <span className="text-sm lg:text-lg opacity-75">
            Wind: {weatherData.current_weather.windspeed}{" "}
            {weatherData.current_weather_units.windspeed}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Weather;
