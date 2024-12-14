"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { IoMdSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { LuHistory } from "react-icons/lu";
import MapDisplay from "./Map";
import CityCard from "../_city-card/CityCard";
import searchCity from "@/lib/searchCity";
import LocalCities from "@/app/cities/_local-cities/localCities";
import useHandleAddCity from "@/components/utils/useHandleAddCity";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCityArea, setSelectedCityArea] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [onRoute, setOnRoute] = useState({
    routeStatus: false,
    from: [],
    to: [],
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
    setOnRoute({ routeStatus: false, from: [], to: [] });
  };

  return (
    <div className="md:flex">
      <div className="absolute md:relative w-full flex flex-col h-fit md:h-screen-minus-nav md:w-80 z-20 md:border-r-2 ">
        <div className="md:m-4 border-b md:border md:rounded-2xl shadow-inner hover:shadow-md active:brightness-125 transition-all">
          <div className="p-4 flex flex-col justify-end items-center bg-dynamic  w-full md:rounded-2xl">
            <div className="relative w-full">
              <IoMdSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                aria-hidden="true"
              />
              <Input
                type="text"
                id="search"
                placeholder="Search cities..."
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
                        useHandleAddCity(result);
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
          <LuHistory className="w-5 h-5" /> <span>Cities searched history</span>
        </div>
        <div className="flex-grow overflow-y-auto hidden md:block">
          <LocalCities
            className={
              "w-full rounded-xl border shadow-inner flex flex-col justify-between bg-dynamic bg-dynamic-h mb-4 cursor-pointer hover:shadow-md active:scale-105 active:shadow-lg transition-all"
            }
            selectedCityArea={selectedCityArea}
            setSelectedCityArea={setSelectedCityArea}
            endRoute={endRoute}
            onRoute={onRoute}
            setOnRoute={setOnRoute}
          />
        </div>
      </div>
      <div className="flex-grow h-screen-minus-nav">
        <MapDisplay
          selectedCityArea={selectedCityArea}
          noFetch={false}
          onRoute={onRoute}
        />
      </div>
    </div>
  );
};

export default Search;
