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

  return (
    <div className="w-auto flex flex-col items-center ">
      <div className="flex flex-col sm:flex-row justify-between w-full bg-dynamic-secondary rounded-3xl p-6 shadow-xl space-y-6 sm:space-y-0 sm:space-x-6">
        <div className="flex flex-col justify-between bg-dynamic rounded-2xl p-6 shadow-inner w-full">
          <div className="flex items-center h-full">
            <div className="flex justify-end text-clip text-7xl font-light my-2 overflow-hidden">
              <span className="text-7xl sm:text-6xl md:text-8xl">
                {weatherData.current_weather.temperature}
                {weatherData.current_weather_units.temperature}
              </span>
            </div>
          </div>

          <div className="font-medium opacity-70 text-lg mt-2">
            <span>H: {weatherData.daily.temperature_2m_max[0]}°</span>
            <span className="ml-4">
              L: {weatherData.daily.temperature_2m_min[0]}°
            </span>
          </div>

          <div className="text-xl font-semibold opacity-80 mt-4">
            <span>
              {name}, {country}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center bg-dynamic rounded-2xl p-6 shadow-inner w-full">
          <ReactSVG
            src={getIconForWeather(
              weatherData.current_weather.weathercode,
              isNight
            )}
            className="w-36 h-36 mb-4"
          />
          <span className="text-lg font-semibold opacity-90 capitalize mb-1">
            {getWeatherDescription(weatherData.current_weather.weathercode)}
          </span>
          <span className="text-sm opacity-75">
            Wind: {weatherData.current_weather.windspeed}{" "}
            {weatherData.current_weather_units.windspeed}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Weather;
