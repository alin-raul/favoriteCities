"use client";

import React, { useState, useEffect } from "react";
import CustomCard from "../card/CustomCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getFavoriteCities } from "@/lib/getFavoriteCities";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import TransitionLink from "../utils/TransitionLink";

const FavoriteCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      const citiesData = await getFavoriteCities();

      if (!citiesData) {
        console.log("Error fetching data");
        return [];
      }

      setCities(citiesData.data);
      setLoading(false);
    };

    fetchCities();
  }, []);

  return (
    <>
      <CustomCard className="justify-center w-full h-full ">
        {loading ? (
          <>
            <div className="text-xl font-semibold my-4">
              <Skeleton className="h-5 w-[189px]" />
            </div>
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                className="flex flex-col mb-2 w-full pointer-events-none opacity-50 "
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
                    <Skeleton className="h-4 w-[120px]" />
                  </div>
                  <div className="text-sm opacity-50 mb-2">
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </CustomCard>
              </div>
            ))}
          </>
        ) : cities.length > 0 ? (
          <div className="flex flex-col w-full">
            <h2 className="text-xl font-semibold my-2">Your Favorite Cities</h2>

            {cities.map((city, index) => (
              <div className="my-2 w-full" key={index}>
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
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-28">
            <span className="opacity-40">
              You haven't saved any city yet...
            </span>
          </div>
        )}
      </CustomCard>
      {cities.length <= 0 && cities ? (
        <div className="flex justify-end items-center mt-4 rounded-md shadow-dotted-2xl shadow-opacity-60">
          <span className="opacity-80 mx-2">Search and add cities</span>
          <TransitionLink href="/search">
            <Button variant="outline" className="w-fit">
              <ChevronRight />
            </Button>
          </TransitionLink>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default FavoriteCities;
