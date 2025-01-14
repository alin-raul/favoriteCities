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

const Weather = ({ weatherData, name = "", country = "", tiny = false }) => {
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const latitude = weatherData.latitude;
    const longitude = weatherData.longitude;
    const currentDate = new Date();

    setIsNight(isNightTime(latitude, longitude, currentDate));
  }, [weatherData]);

  const getIconForWeather = (weatherCode, isNight) => {
    if (isNight && (weatherCode === 0 || weatherCode === 1)) {
      return "/images/weather/a_4_night.svg";
    }
    if (isNight && weatherCode === 2) {
      return "/images/weather/b_4_cloudy_night.svg";
    }

    return weatherIconsCodeDescriptionsURL[weatherCode];
  };

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
      </div>
    );
  }

  return (
    <div className="w-fit">
      <ReactSVG
        src={getIconForWeather(
          weatherData.current_weather.weathercode,
          isNight
        )}
        className="w-32 h-32 mx-auto"
      />
      <div className="text-center">
        <span className="opacity-90 capitalize mb-2">
          {getWeatherDescription(weatherData.current_weather.weathercode)}
        </span>
        <span className="ml-2">
          {weatherData.current_weather.temperature}
          {weatherData.current_weather_units.temperature}
        </span>
      </div>
    </div>
  );
};

export default Weather;
