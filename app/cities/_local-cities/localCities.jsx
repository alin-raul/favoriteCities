"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TransitionLink from "@/components/utils/TransitionLink";
import FavoriteButton from "@/components/favoriteButon/FavoriteButton";

const LocalCities = () => {
  const [cities, setCities] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const storedCities = localStorage.getItem("cities");

    if (storedCities) {
      setCities(JSON.parse(storedCities));
    }
  }, []);

  const handleToggleFavorite = (id) => {
    const updatedCities = cities.map((city) => {
      if (city.properties.osm_id === id) {
        // Toggle the selected property
        return { ...city, selected: !city.selected };
      }
      return city;
    });

    // Update the cities state with the modified array
    setCities(updatedCities);

    // Optionally, update localStorage to persist the change
    localStorage.setItem("cities", JSON.stringify(updatedCities));
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="text-2xl font-semibold mt-16">
        Saved cities from localStorage
      </h1>
      {cities.length === 0 ? (
        <p>No cities added yet.</p>
      ) : (
        <div className="mt-32 max-w-screen-2xl gap-2 justify-center items-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {cities.map((city, index) => (
            <TransitionLink
              href={`/cities/${city.properties.name}`}
              className="w-full h-full p-4 rounded-xl shadow-lg mb-4 md:mb-0 flex flex-col justify-between bg-dynamic bg-dynamic-h "
              key={index}
            >
              <div className="relative">
                <h2 className="text-lg font-semibold">
                  {city.properties.name}
                </h2>
                <p>Country: {city.properties.country}</p>
                <p>Type: {city.properties.osm_value}</p>
                <p>
                  Coordinates: ({city.geometry.coordinates[1].toFixed(4)},{" "}
                  {city.geometry.coordinates[0].toFixed(4)})
                </p>
                <p>Bounding Box: [{city.properties.extent.join(", ")}]</p>
              </div>

              {/* Button/Star icon */}
              <FavoriteButton
                handleToggleFavorite={handleToggleFavorite}
                city={city}
              />
            </TransitionLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocalCities;
