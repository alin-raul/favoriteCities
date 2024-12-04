"use client";

import React, { useEffect, useState } from "react";
import CustomCard from "../card/CustomCard";
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
  // Weather conditions and their respective background gradients (diagonal)
  if (weatherCode === 0) {
    // Clear sky
    return isNight
      ? "bg-gradient-to-br from-[#0c2544] to-[#1c3964]"
      : "bg-gradient-to-br from-[#FFB700] to-[#FF5733]";
  }
  if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) {
    // Partly cloudy to cloudy
    return isNight
      ? "bg-gradient-to-br from-[#2c3e50] to-[#34495e]"
      : "bg-gradient-to-br from-[#c8d6e5] to-[#95a5a6]";
  }
  if (weatherCode === 4 || weatherCode === 5) {
    // Rainy conditions
    return "bg-gradient-to-br from-[#1c1c1c] to-[#2c3e50]";
  }
  if (weatherCode === 6 || weatherCode === 7) {
    // Snow
    return "bg-gradient-to-br from-[#eaf2f8] to-[#9bb0c4]";
  }
  return "bg-gradient-to-br from-[#2f3d56] to-[#3a4b64]"; // Default cloudy or unknown weather
};

const Weather = ({ weatherData, name, country }) => {
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
    return weatherIconsCodeDescriptionsURL[weatherCode];
  };

  const backgroundGradient = getBackgroundGradient(
    weatherData.current_weather.weathercode,
    isNight
  );

  return (
    <div
      className={`w-auto h-full aspect-w-16 aspect-h-9 rounded-3xl shadow-inner text-white ${backgroundGradient} `}
    >
      <div className="flex justify-between w-full p-6 rounded-3xl shadow-lg   ">
        <div className="flex flex-col justify-between rounded-2xl p-6  w-full">
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

        <div className="flex flex-col justify-end items-center rounded-2xl p-6  flex-auto w-full ">
          <ReactSVG
            src={getIconForWeather(
              weatherData.current_weather.weathercode,
              isNight
            )}
            className="h-20 w-20 md:h-32 md:w-32 lg:h-48 lg:w-48 xl:h-56 xl:w-56  top-0 z-10"
          />
          <span className="text-sm lg:text-lg font-semibold opacity-90 capitalize mb-2">
            {getWeatherDescription(weatherData.current_weather.weathercode)}
          </span>
          <span className="text-sm lg:text-lg  opacity-75">
            Wind: {weatherData.current_weather.windspeed}{" "}
            {weatherData.current_weather_units.windspeed}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Weather;
