"use client";

import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import TransitionLink from "@/components/utils/TransitionLink";

const CityCard = ({ selectedCity, onClose }) => {
  const [weather, setWeather] = useState(null);

  const coordinates = {
    latitude: selectedCity.geometry.coordinates[1],
    longitude: selectedCity.geometry.coordinates[0],
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&hourly=temperature_2m`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.hourly) {
          setWeather(data.hourly.temperature_2m[0]);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, [coordinates]);

  return (
    <div className="w-full md:px-4">
      <TransitionLink
        href={`/cities/${selectedCity.properties.name}`}
        className="w-full h-fit p-4 border md:rounded-2xl shadow-inner mb-2 flex flex-col justify-between bg-dynamic bg-dynamic-h backdrop-blur-md md:backdrop-blur-none hover:shadow-md active:brightness-125 transition-all"
      >
        <div>
          <div className="w-full flex justify-end">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="opacity-60 hover:opacity-100"
              aria-label="Close city card"
            >
              <IoMdClose size={20} />
            </button>
          </div>

          <h3 className="text-2xl font-semibold">
            {selectedCity.properties.name}
          </h3>
          <p className="text-sm opacity-50">
            Country: {selectedCity.properties.country}
          </p>
          <p className="text-sm opacity-50">
            Type: {selectedCity.properties.osm_value}
          </p>

          <div className="mt-4">
            {weather !== null ? (
              <div>
                <h4 className="text-lg font-semibold">Weather:</h4>
                <p className="text-sm opacity-50">Temperature: {weather}°C</p>
              </div>
            ) : (
              <p className="text-sm opacity-50">Loading weather...</p>
            )}
          </div>
        </div>
      </TransitionLink>
    </div>
  );
};

export default CityCard;
