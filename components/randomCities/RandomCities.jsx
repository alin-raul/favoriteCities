"use client";

import React, { useState, useEffect } from "react";
import { RANDOM_CITIES } from "@/globals/constants";
import searchCity from "@/lib/searchCity";
import { Skeleton } from "@/components/ui/skeleton";
import MapDisplay from "@/app/search/_map/Map";
import Carousel from "../carousel/carousel";

const RandomCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getRandomCities = () => {
    const shuffled = RANDOM_CITIES.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  useEffect(() => {
    const fetchRandomCities = async () => {
      const randomCities = getRandomCities();
      const fetchedCities = [];

      for (const city of randomCities) {
        try {
          const cityData = await searchCity(city);
          if (cityData && cityData.length > 0) {
            fetchedCities.push(cityData[0]);
          }
          {
            !loading && cities.length === 0 && (
              <div>No cities available at the moment.</div>
            );
          }
        } catch (error) {
          console.error(`Error fetching data for ${city}:`, error);
        }
      }

      setCities(fetchedCities);
      setLoading(false);
    };

    fetchRandomCities();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cities.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [cities]);

  const selectedCityArea = cities[currentIndex]?.properties?.extent;

  return (
    <div className="lg:flex lg:flex-grow lg:items-stretch lg:flex-row rounded-2xl lg:shadow-lg">
      <div className="border rounded-2xl bg-dynamic w-full h-96 mb-4 relative p-2 lg:rounded-r-none shadow-lg lg:w-96 lg:h-full lg:mb-0 lg:shadow-none pointer-events-none">
        <MapDisplay
          noFetch={true}
          selectedCityArea={selectedCityArea}
          rounded={["1rem", "1rem", "1rem", "1rem"]}
          zIndex={"0"}
        />
      </div>

      <div className="border flex flex-col justify-center rounded-2xl h-32 bg-dynamic overflow-hidden relative px-2 shadow-lg lg:border-l-0 lg:rounded-l-none lg:min-h-96 lg:h-full lg:w-48 lg:shadow-none">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              className="my-2 opacity-50 flex justify-center w-full"
              key={index}
            >
              <div className="p-4 bg-dynamic border rounded-2xl shadow-lg relative w-full lg:w-40">
                <div className="text-lg font-semibold mb-2">
                  <Skeleton className="h-5 w-[100px]" />
                </div>
                <div className="text-sm opacity-50 mb-2">
                  <Skeleton className="h-4 w-[130px]" />
                </div>
                <div className="text-sm opacity-50 mb-2">
                  <Skeleton className="h-4 w-[70px]" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <Carousel cities={cities} currentIndex={currentIndex} />
        )}
      </div>
    </div>
  );
};

export default RandomCities;
