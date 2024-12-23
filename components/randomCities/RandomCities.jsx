"use client";

import React, { useState, useEffect } from "react";
import { RANDOM_CITIES } from "@/globals/constants";
import searchCity from "@/lib/searchCity";
import { Skeleton } from "@/components/ui/skeleton";
import MapDisplay from "@/components/map/Map";
import Carousel from "../carousel/carousel";

const RandomCities = ({ height }) => {
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
    if (cities.length === 0) return; // Prevent interval if cities are empty

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cities.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [cities]); // Now depends on cities

  const selectedCityArea = cities[currentIndex]?.properties?.extent;

  return (
    <div className="lg:flex lg:flex-grow lg:items-stretch w-full lg:flex-row rounded-2xl lg:shadow-lg">
      <div className="border rounded-2xl bg-dynamic h-96 mb-4 relative p-2 lg:rounded-r-none shadow-lg lg:h-[480px] lg:flex-grow lg:mb-0 lg:shadow-none pointer-events-none">
        <MapDisplay
          noFetch={true}
          selectedCityArea={selectedCityArea}
          rounded={["1rem", "1rem", "1rem", "1rem"]}
          zIndex={"0"}
        />
      </div>

      <div className="border flex flex-col justify-center items-center rounded-2xl h-36 bg-dynamic overflow-hidden relative shadow-lg lg:border-l-0 lg:rounded-l-none lg:min-h-[480px] lg:h-full lg:w-fit lg:shadow-none px-4">
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
