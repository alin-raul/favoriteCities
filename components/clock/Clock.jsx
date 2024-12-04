"use client";

import React, { useState, useEffect } from "react";

const Clock = ({ weatherData }) => {
  const [currentTime, setCurrentTime] = useState({
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
    <div className="flex flex-col items-center h-full w-fit md:min-w-72 py-4 px-6">
      <div className="sm:flex text-end justify-between w-full font-normal leading-3 text-sm opacity-80">
        <div className="">
          {currentTime.weekday} {currentTime.day} {currentTime.month}{" "}
        </div>
        <span>{currentTime.year}</span>
      </div>
      <div className="text-end my-2 w-full">
        <span className="font-normal text-center text-4xl sm:text-6xl md:text-8xl w-full">
          {currentTime.time}
        </span>
      </div>
    </div>
  );
};

export default Clock;
