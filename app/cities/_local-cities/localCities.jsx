"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import TransitionLink from "@/components/utils/TransitionLink";

const LocalCities = () => {
  const [cities, setCities] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const storedCities = localStorage.getItem("cities");

    if (storedCities) {
      setCities(JSON.parse(storedCities));
    }
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="text-2xl font-semibold mb-5 mt-10">Saved Cities</h1>
      {cities.length === 0 ? (
        <p>No cities added yet.</p>
      ) : (
        <div className="max-w-screen-2xl sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 justify-center items-center">
          {cities.map((city, index) => (
            <div
              className="w-full h-full p-4 bg-dynamic rounded-lg shadow-lg mb-4 md:mb-0 flex flex-col justify-between"
              key={index}
            >
              <div>
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
              <div className="flex justify-end mt-4">
                <TransitionLink
                  className="mt-2"
                  href={`/cities/${city.properties.name}`}
                >
                  Link to {city.properties.name}
                </TransitionLink>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocalCities;
