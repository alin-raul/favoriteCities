"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FavoriteButton from "@/components/favoriteButon/FavoriteButton";
import { FaXmark } from "react-icons/fa6";
import { navigationEvents } from "@/components/navigation-events/navigationEvents";
import { MdOutlineDirections } from "react-icons/md";
import { MdOutlineDirectionsOff } from "react-icons/md";
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        {cities.length === 0 ? (
          <div className="h-full flex items-center justify-center opacity-60">
            <p>No cities added yet.</p>
          </div>
        ) : (
          <div className="w-full p-4">
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
                    className={`${
                      pathname === "/search" &&
                      city.properties.extent === selectedCityArea
                        ? "rounded-xl bg-dynamic-s outline outline-1 p-4 shadow-md"
                        : "p-4"
                    } `}
                  >
                    <div>
                      <div className="w-full flex justify-end">
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
                      <h2
                        className={`${
                          pathname === "/cities"
                            ? "text-5xl font-black"
                            : "text-lg font-semibold"
                        }`}
                      >
                        {city.properties.name}
                      </h2>
                      <div className="flex items-center gap-2">
                        <div className="">
                          <span
                            className={`opacity ${
                              pathname === "/cities" ? "text-xl" : "text-sm"
                            }`}
                          >
                            {city.properties.country},{" "}
                            {city.properties.countrycode}
                          </span>
                        </div>
                        <div className="">
                          <span
                            className={` ${
                              pathname === "/cities" ? "text-3xl" : "text-lg"
                            }`}
                          >
                            {useFlagEmoji(city.properties.countrycode)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {pathname === "/search" &&
                      city.properties.extent === selectedCityArea ? (
                        <div className="flex items-center justify-between gap-2 w-full overflow-y-hidden mt-4">
                          {onRoute.routeStatus === false ? (
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOnRoute({
                                  routeStatus: true,
                                  from: [],
                                  to: city.geometry.coordinates,
                                });
                              }}
                              className="rounded-3xl z-30"
                            >
                              <MdOutlineDirections size={24} />
                              <span>Directions</span>
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                endRoute();
                              }}
                              className="rounded-3xl z-30"
                            >
                              <MdOutlineDirectionsOff /> Stop drive
                            </Button>
                          )}
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              endRoute();
                              router.push(`/cities/${city.properties.name}`);
                            }}
                            className="rounded-3xl z-30"
                          >
                            <FaArrowRightToCity size={24} />
                            <span>City</span>
                          </Button>

                          <FavoriteButton
                            handleToggleFavorite={handleToggleFavorite}
                            city={city}
                            full={true}
                          />
                        </div>
                      ) : (
                        <div className="flex justify-between items-center mt-4">
                          <span className="opacity-60 font-thin text-xs">
                            {formattedDate}
                          </span>
                          <FavoriteButton
                            handleToggleFavorite={handleToggleFavorite}
                            city={city}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalCities;
