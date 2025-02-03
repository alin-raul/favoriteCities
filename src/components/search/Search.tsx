"use client";

import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { LuHistory } from "react-icons/lu";
import MapDisplay from "../map/Map";
import CityCard from "../city-card/CityCard";
import searchCity from "@/lib/searchCity";
import LocalCities from "@/components/local-cities/localCities";
import handleAddCity from "../utils/handleAddCity";
import type { Location } from "../map/Map";
import type { LocalCity } from "@/components/local-cities/localCities";
import SearchInput from "./SearchInput";

type OnRoute = {
  routeStatus: boolean;
  route: { from: Location; to: Location };
};

export type RouteResponse = {
  bbox: [number, number, number, number];
  routes: Array<{
    summary: {
      distance: number;
      duration: number;
    };
    segments: Array<{
      distance: number;
      duration: number;
      steps: Array<{
        distance: number;
        duration: number;
        type: number;
        instruction: string;
        name: string;
        way_points: [number, number];
        [key: string]: any; // For additional step properties
      }>;
      [key: string]: any; // For additional segment properties
    }>;
    bbox: [number, number, number, number];
    geometry: string;
    way_points: [number, number];
    [key: string]: any; // For additional route properties
  }>;
  metadata: {
    attribution: string;
    service: string;
    timestamp: number;
    query: {
      coordinates: Array<[number, number]>;
      profile: string;
      profileName: string;
      format: string;
      [key: string]: any; // For additional query properties
    };
    engine: {
      version: string;
      build_date: string;
      graph_date: string;
      [key: string]: any; // For additional engine properties
    };
    [key: string]: any; // For additional metadata properties
  };
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
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [stops, setStops] = useState<LocalCity[]>([]);

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
    setSelectedCityArea(city.properties.extent);
    setQuery("");
    setResults([]);
    setRouteData(null);
    setOnRoute({
      routeStatus: false,
      route: {
        from: { lon: 0, lat: 0 },
        to: { lon: 0, lat: 0 },
      },
    });
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

  const handleRefreshLocation = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAddStop = (city: LocalCity) => {
    setStops((prev) => {
      if (prev.length === 0) return [city];
      if (prev.length === 1) return [city, ...prev];
      return [...prev.slice(0, -1), city, ...prev.slice(-1)];
    });
  };

  const handleRemoveStop = (index: number) => {
    setStops((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="md:flex relative bg-dynamic rounded-2xl h-full ">
      <div
        className={`absolute md:relative w-full flex flex-col md:w-80 z-20 md:border-r-2 ${
          height ? `${height}` : "h-fit md:h-screen-minus-nav"
        }`}
      >
        <div className="md:m-4 border-b md:rounded-3xl md:border shadow-sm active:brightness-105 active:backdrop-blur-md transition-all">
          <div className="flex flex-col justify-end items-center bg-dynamic w-full md:rounded-3xl">
            <SearchInput
              query={query}
              setQuery={setQuery}
              handleClearSearch={handleClearSearch}
              isLoading={isLoading}
              error={error}
              results={results}
              handleCitySelect={(city) => {
                handleCitySelect(city);
                handleAddStop(city);
              }}
              handleAddCity={handleAddCity}
              stops={stops}
              setStops={setStops}
              handleRemoveStop={handleRemoveStop}
            />
          </div>
        </div>

        {stops[stops.length - 1] && (
          <CityCard
            stops={stops}
            onClose={() => setSelectedCity(null)}
            endRoute={endRoute}
            onRoute={onRoute}
            setOnRoute={setOnRoute}
            routeData={routeData}
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
            routeData={routeData}
            stops={stops}
            setStops={setStops}
            handleAddStop={handleAddStop}
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
          routeData={routeData}
          setRouteData={setRouteData}
          rounded={height ? [".5rem", ".5rem", ".5rem", ".5rem"] : ""}
          userLocation={userLocation}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
};

export default Search;
