"use client";

import React, { useState, useEffect } from "react";
import TransitionLink from "@/components/utils/TransitionLink";
import FavoriteButton from "@/components/favoriteButon/FavoriteButton";
import { FaXmark } from "react-icons/fa6";

const LocalCities = () => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const storedCities = localStorage.getItem("cities");

    if (storedCities) {
      setCities(JSON.parse(storedCities));
    }
  }, []);

  const handleToggleFavorite = (id) => {
    const updatedCities = cities.map((city) => {
      if (city.properties.osm_id === id) {
        return { ...city, selected: !city.selected };
      }
      return city;
    });

    setCities(updatedCities);

    localStorage.setItem("cities", JSON.stringify(updatedCities));
  };

  return (
    <div className="w-full flex flex-col justify-center items-center relative">
      <h1 className="text-2xl font-semibold mt-16 text-center">
        Your Saved Cities
        <br />
        <span className="text-sm font-normal opacity-70">
          *loaded from localStorage*
        </span>
      </h1>
      {cities.length === 0 ? (
        <div className="absolute top-0 h-screen-minus-nav flex items-center opacity-60">
          <p>No cities added yet.</p>
        </div>
      ) : (
        <div className="mt-32 max-w-screen-2xl gap-2 justify-center items-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {cities.map((city, index) => (
            <TransitionLink
              href={`/cities/${city.properties.name}`}
              className="w-full h-full p-4 rounded-xl shadow-lg mb-4 md:mb-0 flex flex-col justify-between bg-dynamic bg-dynamic-h "
              key={index}
            >
              <div className="relative">
                <div className="absolute right-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const updatedCities = [...cities];
                      updatedCities.splice(index, 1);
                      setCities(updatedCities);
                      localStorage.setItem(
                        "cities",
                        JSON.stringify(updatedCities)
                      );
                    }}
                  >
                    <FaXmark className="w-4 h-4 opacity-30 hover:opacity-100" />
                  </button>
                </div>
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
