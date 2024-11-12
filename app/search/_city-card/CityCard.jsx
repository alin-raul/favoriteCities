"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import TransitionLink from "@/components/utils/TransitionLink";

const CityCard = ({ selectedCity }) => {
  const [weather, setWeather] = useState(null);
  const coordinates = {
    latitude: selectedCity.geometry.coordinates[1],
    longitude: selectedCity.geometry.coordinates[0],
  };

  const router = useRouter();

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

  const handleAddCity = () => {
    const storedCities = JSON.parse(localStorage.getItem("cities")) || [];

    const cityExists = storedCities.some(
      (city) => city.properties.osm_id === selectedCity.properties.osm_id
    );

    if (cityExists) {
      alert("City is in your list already");
    } else {
      storedCities.push(selectedCity);
      localStorage.setItem("cities", JSON.stringify(storedCities));
      alert("City added to list");
    }
  };

  return (
    <div className="absolute left-0 top-22 p-4 w-80 ">
      <div className="p-4 bg-dynamic backdrop-blur-md rounded-2xl shadow-lg z-20">
        <h3 className="text-lg font-semibold">
          {selectedCity.properties.name}
        </h3>
        <p className="text-sm opacity-50">
          Country: {selectedCity.properties.country}
        </p>
        <p className="text-sm opacity-50">
          Type: {selectedCity.properties.osm_value}
        </p>
        <p className="text-sm opacity-50">
          Coordinates: ({selectedCity.geometry.coordinates[1].toFixed(4)},{" "}
          {selectedCity.geometry.coordinates[0].toFixed(4)})
        </p>
        <p className="text-sm opacity-50">
          Bounding Box: [{selectedCity.properties.extent?.join(", ")}]
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

        <div className="flex justify-end pt-6">
          <Button onClick={handleAddCity}>Add city to list</Button>
        </div>
      </div>
    </div>
  );
};

export default CityCard;
