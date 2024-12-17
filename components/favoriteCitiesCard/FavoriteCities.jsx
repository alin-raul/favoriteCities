"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getFavoriteCities } from "@/lib/getFavoriteCities";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import TransitionLink from "../utils/TransitionLink";

const FavoriteCities = ({ height }) => {
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
      <div className="justify-center w-full h-fit p-6 pr-2 bg-dynamic border rounded-2xl shadow-lg relative">
        {loading ? (
          <div>
            <div className="text-xl font-semibold my-4">
              <Skeleton className="h-5 w-[189px]" />
            </div>
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                className="flex flex-col mb-2 pr-4 w-full pointer-events-none opacity-50"
                key={index}
              >
                <div className="w-full h-fit p-6 border rounded-xl shadow-inner mb-2 flex flex-col justify-between bg-dynamic">
                  <div className="text-lg font-semibold mb-2">
                    <Skeleton className="h-5 w-[225px]" />
                  </div>
                  <div className="text-sm opacity-50 mb-2">
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <div className="text-sm opacity-50 mb-2">
                    <Skeleton className="h-4 w-[120px]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : cities.length > 0 ? (
          <div className="flex flex-col w-full">
            <h2 className="text-xl font-semibold mt-2 mb-4">
              Your Favorite Cities
            </h2>
            <div className={`${height} overflow-y-scroll pr-4`}>
              {cities.map((city, index) => (
                <TransitionLink
                  href={`/cities/${city.name}`}
                  className="w-full h-fit p-6 border rounded-xl shadow-inner mb-2 flex flex-col justify-between bg-dynamic bg-dynamic-h hover:shadow-md active:scale-105 active:shadow-lg transition-all"
                  key={index}
                >
                  <h3 className="text-lg font-semibold">{city.name}</h3>
                  <p className="text-sm opacity-50">
                    {city.country}, {city.countrycode}
                  </p>
                  <p className="text-sm opacity-50">({city.osm_value})</p>
                </TransitionLink>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-28">
            <span className="opacity-40">
              You haven't saved any city yet...
            </span>
          </div>
        )}
      </div>
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
