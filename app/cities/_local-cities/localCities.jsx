"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TransitionLink from "@/components/utils/TransitionLink";
import { TiStarFullOutline } from "react-icons/ti";
import { CiStar } from "react-icons/ci";

const LocalCities = () => {
  const [cities, setCities] = useState([]);
  console.log(cities);

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
      <h1 className="text-2xl font-semibold mt-16">Saved Cities</h1>
      {cities.length === 0 ? (
        <p>No cities added yet.</p>
      ) : (
        <div className="mt-32 max-w-screen-2xl gap-2 justify-center items-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {cities.map((city, index) => (
            <TransitionLink
              href={`/cities/${city.properties.name}`}
              className="w-full h-full p-4 rounded-xl shadow-lg mb-4 md:mb-0 flex flex-col justify-between bg-dynamic bg-dynamic-h z-0"
              key={index}
            >
              <div className="relative z-10">
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
              <div className="flex justify-end mt-4 ">
                <button
                  className="group relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleToggleFavorite(city.properties.osm_id);
                  }}
                >
                  {/* If selected, show the full star, and do not show hover */}
                  {city.selected ? (
                    <TiStarFullOutline className="h-6 w-6 absolute fill-yellow-500 bottom-0 right-0 group-hover:hidden" />
                  ) : (
                    // If not selected, show the empty star and allow hover to show the filled star
                    <CiStar className="h-6 w-6 absolute bottom-0 right-0 group-hover:hidden" />
                  )}

                  {/* Show full star on hover only if the city is not selected */}
                  <TiStarFullOutline
                    className={`h-6 w-6 absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                      city.selected ? "hidden" : ""
                    }`}
                  />
                </button>
              </div>
            </TransitionLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocalCities;
