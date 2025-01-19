"use client";

import React, { useState, useEffect } from "react";

type WeatherData = {
  timezone: string;
};

type CurrentTime = {
  weekday: string;
  month: string;
  day: string;
  year: string;
  time: string;
};

type ClockProps = {
  weatherData: WeatherData;
};

const Clock = ({ weatherData }: ClockProps) => {
  const [currentTime, setCurrentTime] = useState<CurrentTime>({
    weekday: "",
    month: "",
    day: "",
    year: "",
    time: "",
  });

  useEffect(() => {
    if (!weatherData || !weatherData.timezone) {
      console.error("Invalid weather data or missing timezone.");
      return;
    }

    const updateClock = () => {
      const currentTime = new Date();

      const weekdayFormatter = new Intl.DateTimeFormat([], {
        weekday: "long",
        timeZone: weatherData.timezone,
      });

      const monthFormatter = new Intl.DateTimeFormat([], {
        month: "long",
        timeZone: weatherData.timezone,
      });

      const dayFormatter = new Intl.DateTimeFormat([], {
        day: "2-digit",
        timeZone: weatherData.timezone,
      });

      const yearFormatter = new Intl.DateTimeFormat([], {
        year: "numeric",
        timeZone: weatherData.timezone,
      });

      const timeFormatter = new Intl.DateTimeFormat([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: weatherData.timezone,
      });

      const weekday = weekdayFormatter.format(currentTime);
      const month = monthFormatter.format(currentTime);
      const day = dayFormatter.format(currentTime);
      const year = yearFormatter.format(currentTime);
      const time = timeFormatter.format(currentTime);

      setCurrentTime({ weekday, month, day, year, time });
    };

    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, [weatherData]);

  if (!currentTime.time) {
    return <div>Loading clock...</div>;
  }

  return (
    <div className="flex justify-end w-full">
      <span>{currentTime.time}</span>
    </div>
  );
};

export default Clock;
