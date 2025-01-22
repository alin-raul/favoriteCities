"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { IoMdSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { LuHistory } from "react-icons/lu";
import MapDisplay from "../map/Map";
import CityCard from "../city-card/CityCard";
import searchCity from "@/lib/searchCity";
import LocalCities from "@/components/local-cities/localCities";
import handleAddCity from "../utils/handleAddCity";
import type { Location } from "../map/Map";
import type { LocalCity } from "@/components/local-cities/localCities";

type OnRoute = {
  routeStatus: boolean;
  route: { from: Location; to: Location };
};

const Search = ({ height = 0, noFetch = false }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<LocalCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<LocalCity | null>(null);
  const [selectedCityArea, setSelectedCityArea] = useState<number[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [onRoute, setOnRoute] = useState<OnRoute>({
    routeStatus: false,
    route: {
      from: { lon: 0, lat: 0 },
      to: { lon: 0, lat: 0 },
    },
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        setIsLoading(true);
        searchCity(query)
          .then((res) => {
            setResults(res);
            setError(null);
          })
          .catch(() => setError("Failed to fetch results"))
          .finally(() => setIsLoading(false));
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedCityArea(city.properties.extent);
    setQuery("");
    setResults([]);
  };

  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
    setSelectedCity(null);
    setSelectedCityArea(null);
  };

  const endRoute = () => {
    setOnRoute({
      routeStatus: false,
      route: {
        from: { lon: 0, lat: 0 },
        to: { lon: 0, lat: 0 },
      },
    });
  };

  return (
    <div className="md:flex relative bg-dynamic rounded-2xl h-full ">
      <div
        className={`absolute md:relative w-full flex flex-col md:w-80 z-20 md:border-r-2 ${
          height ? `${height}` : "h-fit md:h-screen-minus-nav"
        }`}
      >
        <div className="md:m-4 border-b md:rounded-2xl md:border shadow-sm hover:shadow-md active:brightness-105 active:backdrop-blur-md transition-all">
          <div className="p-4 md:p-2 flex flex-col justify-end items-center bg-dynamic w-full md:rounded-2xl">
            <div className="relative w-full">
              <IoMdSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                aria-hidden="true"
              />
              <Input
                type="text"
                id="search"
                placeholder="Search destinations..."
                className="bg-dynamic rounded-xl pl-10 pr-10 shadow-inner"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search for a city"
              />
              {query && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 opacity-60 hover:opacity-100"
                  aria-label="Clear search"
                >
                  <IoMdClose />
                </button>
              )}
            </div>

            {isLoading && <p className="mt-4 opacity-60 text-sm">Loading...</p>}
            {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

            <div className={`mt-4 w-full ${query ? "" : "hidden"}`}>
              {results.length > 0 ? (
                <ul className="bg-dynamic rounded-lg max-h-60 overflow-y-auto shadow-inner">
                  {results.map((result, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-500/10"
                      onClick={() => {
                        handleCitySelect(result);
                        handleAddCity(result);
                      }}
                    >
                      {result.properties.name} - {result.properties.country}
                    </li>
                  ))}
                </ul>
              ) : query && !isLoading ? (
                <p className="text-gray-500 text-sm">No results found</p>
              ) : null}
            </div>
          </div>
        </div>

        {selectedCity && (
          <CityCard
            selectedCity={selectedCity}
            onClose={() => setSelectedCity(null)}
            endRoute={endRoute}
            onRoute={onRoute}
            setOnRoute={setOnRoute}
          />
        )}
        <div className="px-4 pt-4 mb-2 items-center gap-2 opacity-60 hidden md:flex">
          <LuHistory className="w-5 h-5" /> <span>Searched cities history</span>
        </div>
        <div className="flex-grow overflow-y-auto hidden md:block">
          <LocalCities
            selectedCityArea={selectedCityArea}
            setSelectedCityArea={setSelectedCityArea}
            endRoute={endRoute}
            onRoute={onRoute}
            setOnRoute={setOnRoute}
          />
        </div>
      </div>
      <div
        className={`flex-grow rounded-2xl ${
          height ? `${height} p-2 backdrop-blur-sm` : "h-screen-minus-nav"
        }`}
      >
        <MapDisplay
          selectedCityArea={selectedCityArea}
          noFetch={noFetch}
          onRoute={onRoute}
          rounded={height ? [".5rem", ".5rem", ".5rem", ".5rem"] : ""}
        />
      </div>
    </div>
  );
};

export default Search;
