"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { IoMdSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io"; // Import Close Icon
import MapDisplay from "./Map";
import CityCard from "../_city-card/CityCard";
import searchCity from "@/lib/searchCity";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCityArea, setSelectedCityArea] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <>
      <div className="h-screen-minus-nav">
        <MapDisplay selectedCityArea={selectedCityArea} />
      </div>
      <div className="absolute w-full h-auto md:block md:p-4 md:w-80 z-20">
        <div className="backdrop-blur-md m-auto border-b border-white/20 md:border md:rounded-2xl shadow-md">
          <div className="p-4 flex flex-col justify-end items-center">
            <div className="relative w-full">
              <IoMdSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                aria-hidden="true"
              />
              <Input
                type="text"
                id="search"
                placeholder="Search cities..."
                className="bg-dynamic rounded-xl pl-10 pr-10"
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
            {isLoading && (
              <p className="mt-4 text-gray-500 text-sm">Loading...</p>
            )}
            {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
            <div className={`mt-4 w-full ${query ? "" : "hidden"}`}>
              {results.length > 0 ? (
                <ul className="bg-dynamic rounded-lg shadow-md max-h-60 overflow-y-auto">
                  {results.map((result, index) => (
                    <li
                      key={result.properties.osm_id + index}
                      className="p-2 cursor-pointer hover:bg-gray-500/10"
                      onClick={() => handleCitySelect(result)}
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
          />
        )}
      </div>
    </>
  );
};

export default Search;
