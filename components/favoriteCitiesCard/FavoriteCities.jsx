"use client";

import React, { useState, useEffect } from "react";
import CustomCard from "../card/CustomCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getFavoriteCities } from "@/lib/getFavoriteCities";

const FavoriteCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchCities = async () => {
      const citiesData = await getFavoriteCities();

      if (!citiesData) {
        console.log("Error fetching data");
        return [];
      }

      setCities(citiesData.data);
      setLoading(false); // Set loading to false once data is fetched
    };

    fetchCities();
  }, []);

  return (
    <CustomCard className="w-full pt-4 overflow-y-scroll md:w-1/3">
      <h2 className="text-xl font-semibold my-2">Favorite Cities</h2>

      {loading
        ? // Display skeleton while loading
          Array.from({ length: 5 }).map((_, index) => (
            <div
              className="my-2 pointer-events-none opacity-50 overflow-hidden "
              key={index}
            >
              <CustomCard>
                <div className="text-lg font-semibold mb-2">
                  <Skeleton className="h-5 w-[225px]" />
                </div>
                <div className="text-sm opacity-50 mb-2">
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <div className="text-sm opacity-50 mb-2">
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <div className="text-sm opacity-50 mb-2">
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </CustomCard>
            </div>
          ))
        : cities.map((city, index) => (
            <div className="my-2" key={index}>
              <CustomCard>
                <h3 className="text-lg font-semibold">{city.name}</h3>
                <p className="text-sm opacity-50">Country: {city.country}</p>
                <p className="text-sm opacity-50">Type: {city.osm_value}</p>
                <p className="text-sm opacity-50">
                  Coordinates: ({city.geometry.coordinates[1].toFixed(4)},{" "}
                  {city.geometry.coordinates[0].toFixed(4)})
                </p>
              </CustomCard>
            </div>
          ))}
    </CustomCard>
  );
};

export default FavoriteCities;
