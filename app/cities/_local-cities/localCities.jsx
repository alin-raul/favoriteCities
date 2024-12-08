"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TransitionLink from "@/components/utils/TransitionLink";
import FavoriteButton from "@/components/favoriteButon/FavoriteButton";
import { FaXmark } from "react-icons/fa6";
import Cookies from "js-cookie";
import { navigationEvents } from "@/components/navigation-events/navigationEvents";

const LocalCities = ({ ...props }) => {
  const [cities, setCities] = useState([]);

  const pathname = navigationEvents();

  useEffect(() => {
    try {
      const storedCities = Cookies.get("cities")
        ? JSON.parse(Cookies.get("cities"))
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
      console.error("Error parsing cities from cookies", error);
      setCities([]);
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
    Cookies.set("cities", JSON.stringify(updatedCities), { expires: 7 });
  };

  const getFlagEmoji = (countryCode) => {
    return countryCode
      .toUpperCase()
      .split("")
      .map((char) => String.fromCodePoint(0x1f1e6 - 65 + char.charCodeAt(0)))
      .join("");
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
                <TransitionLink
                  href={`/cities/${city.properties.name}`}
                  key={index}
                  {...props}
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
                          Cookies.set("cities", JSON.stringify(updatedCities), {
                            expires: 7,
                          });
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
                          {getFlagEmoji(city.properties.countrycode)}
                        </span>
                      </div>
                    </div>
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
                </TransitionLink>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalCities;
