"use client";

import React, { useState, useEffect } from "react";

const LocalCities = () => {
  const [cities, setCities] = useState([]); // Array to hold cities

  // Fetch cities from localStorage when the component is mounted
  useEffect(() => {
    const storedCities = localStorage.getItem("cities");

    if (storedCities) {
      setCities(JSON.parse(storedCities)); // Parse and set the cities array
    }
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-semibold mb-4">Saved Cities</h1>
      {cities.length === 0 ? (
        <p>No cities added yet.</p>
      ) : (
        cities.map((city, index) => (
          <div
            key={index}
            className="w-80 p-4 bg-dynamic rounded-lg shadow-lg mb-4"
          >
            <h2 className="text-lg font-semibold">{city.properties.name}</h2>
            <p>Country: {city.properties.country}</p>
            <p>Type: {city.properties.osm_value}</p>
            <p>
              Coordinates: ({city.geometry.coordinates[1].toFixed(4)},{" "}
              {city.geometry.coordinates[0].toFixed(4)})
            </p>
            <p>Bounding Box: [{city.properties.extent.join(", ")}]</p>
          </div>
        ))
      )}
    </div>
  );
};

export default LocalCities;
