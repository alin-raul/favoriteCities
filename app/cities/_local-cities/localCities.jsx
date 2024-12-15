"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FavoriteButton from "@/components/favoriteButon/FavoriteButton";
import { FaXmark } from "react-icons/fa6";
import { navigationEvents } from "@/components/navigation-events/navigationEvents";
import { MdOutlineDirections, MdOutlineDirectionsOff } from "react-icons/md";
import { FaArrowRightToCity } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import useFlagEmoji from "@/components/utils/useFlagEmoji";

const LocalCities = ({
  selectedCityArea,
  setSelectedCityArea,
  onRoute,
  endRoute,
  setOnRoute,
  ...props
}) => {
  const [cities, setCities] = useState([]);
  const router = useRouter();
  const pathname = navigationEvents();

  const loadCitiesFromStorage = () => {
    try {
      const storedCities = localStorage.getItem("cities")
        ? JSON.parse(localStorage.getItem("cities"))
        : [];
      if (Array.isArray(storedCities)) {
        const validCities = storedCities.filter(
          (city) => city && city.properties
        );

        validCities.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        setCities(validCities);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error("Error parsing cities from storage", error);
      setCities([]);
    }
  };

  useEffect(() => {
    loadCitiesFromStorage();

    const handleStorageChange = () => {
      loadCitiesFromStorage();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
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

  const categorizeCities = () => {
    const categories = {
      Today: [],
      Yesterday: [],
      "Last 7 days": [],
      "This month": [],
      "Last month": [],
    };

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const last7DaysStart = new Date(todayStart);
    last7DaysStart.setDate(last7DaysStart.getDate() - 7);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    cities.forEach((city) => {
      const cityDate = new Date(city.addedAt);

      if (cityDate >= todayStart) {
        categories.Today.push(city);
      } else if (cityDate >= yesterdayStart && cityDate < todayStart) {
        categories.Yesterday.push(city);
      } else if (cityDate >= last7DaysStart) {
        categories["Last 7 days"].push(city);
      } else if (cityDate >= thisMonthStart) {
        categories["This month"].push(city);
      } else if (cityDate >= lastMonthStart && cityDate <= lastMonthEnd) {
        categories["Last month"].push(city);
      }
    });

    return categories;
  };

  const categories = categorizeCities();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        {Object.entries(categories).map(
          ([category, cities]) =>
            cities.length > 0 && (
              <div key={category} className="w-full p-4">
                <h2 className="text-xl font-bold mb-2">{category}</h2>
                {cities.map((city, index) => {
                  const formattedDate = new Date(city.addedAt).toLocaleString(
                    "en-GB",
                    {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }
                  );

                  return (
                    <div
                      key={index}
                      {...props}
                      onClick={() => {
                        if (pathname === "/cities") {
                          router.push(`/cities/${city.properties.name}`);
                        } else {
                          setSelectedCityArea(city.properties.extent);
                          endRoute();
                        }
                      }}
                    >
                      <div
                        className={`p-4 ${
                          pathname === "/search" &&
                          city.properties.extent === selectedCityArea
                            ? "rounded-xl bg-dynamic-s outline outline-1 shadow-md"
                            : ""
                        }`}
                      >
                        <div className="flex justify-end">
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
                        <h2 className={`text-lg font-semibold`}>
                          {city.properties.name}
                        </h2>
                        <div className="flex items-center gap-2">
                          <span>
                            {city.properties.country},{" "}
                            {city.properties.countrycode}
                          </span>
                          <span>
                            {useFlagEmoji(city.properties.countrycode)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="opacity-60 font-thin text-xs">
                            {formattedDate}
                          </span>
                          <FavoriteButton
                            handleToggleFavorite={handleToggleFavorite}
                            city={city}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default LocalCities;
