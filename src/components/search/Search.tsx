"use client";

import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { LuHistory } from "react-icons/lu";
import { BiCurrentLocation } from "react-icons/bi";
import MapDisplay from "../map/Map";
import CityCard from "../city-card/CityCard";
import searchCity from "@/lib/searchCity";
import LocalCities from "@/components/local-cities/localCities";
import handleAddCity from "../utils/handleAddCity";

import type { Location } from "../map/Map";
import type { LocalCity } from "@/components/local-cities/localCities";
import SearchInput from "./SearchInput";

export type OnRoute = {
  routeStatus: boolean;
  route: { from: Location | null; stopPoints: Location[]; to: Location | null }; // Allow null for initial state
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
  const [selectedCity, setSelectedCity] = useState<LocalCity | null>(null); // City for CityCard display
  const [selectedCityArea, setSelectedCityArea] = useState<number[] | null>(
    null // Area for Map focus
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stops, setStops] = useState<LocalCity[]>([]); // The list of stops for the route
  const [onRoute, setOnRoute] = useState<OnRoute>({
    routeStatus: false,
    route: {
      from: null, // Start as null
      stopPoints: [],
      to: null, // Start as null
    },
  });
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [refocusTrigger, setRefocusTrigger] = useState<number>(0);

  // --- Effect for search query ---
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query && query.trim().length > 0) {
        // Add trim check
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
        setError(null); // Clear error when query is empty
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // --- Effect to update route object when stops change ---
  useEffect(() => {
    if (stops.length >= 2) {
      const fromLocation = stops[0];
      const toLocation = stops[stops.length - 1];
      const intermediateStops = stops.slice(1, -1);

      setOnRoute((prev) => ({
        ...prev,
        // Keep routeStatus as is unless specifically changed
        route: {
          from: {
            lon: fromLocation.geometry.coordinates[0],
            lat: fromLocation.geometry.coordinates[1],
          },
          stopPoints: intermediateStops.map((stop) => ({
            lon: stop.geometry.coordinates[0],
            lat: stop.geometry.coordinates[1],
          })),
          to: {
            lon: toLocation.geometry.coordinates[0],
            lat: toLocation.geometry.coordinates[1],
          },
        },
      }));
      // Optionally trigger route calculation here if needed,
      // although MapDisplay usually handles this based on `onRoute` changes.
      // setRouteData(null); // Clear old route data to force recalc
    } else {
      // If less than 2 stops, clear the specific route points but keep status potentially
      endRoute(); // Or a more nuanced clear
    }
  }, [stops]); // Re-run whenever stops array changes

  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
    // Don't clear selectedCity/Area here, as they relate to stops now
  };

  const endRoute = () => {
    setOnRoute({
      routeStatus: false, // Explicitly set routeStatus to false
      route: {
        from: null,
        stopPoints: [],
        to: null,
      },
    });
    setRouteData(null); // Clear route data when ending the route
  };

  // --- Centralized function to add a stop ---
  const handleAddStop = (city: LocalCity) => {
    console.log("handleAddStop called with:", city.properties.name);
    // 1. Add the city to the stops array
    const newStops = [...stops, city];
    setStops(newStops);

    // 2. Update the display focus (CityCard and Map) to the *newly added* stop
    setSelectedCity(city); // Show this city in CityCard
    setSelectedCityArea(city.properties.extent); // Focus map on this city

    // 3. Clear search input and results
    setQuery("");
    setResults([]);

    // 4. Add to local storage history (using the utility function)
    handleAddCity(city);

    // 5. Reset error state
    setError(null);

    // 6. Optional: Decide if adding a stop should automatically start route calculation
    //    or clear existing route data. Often, you wait for user action or MapDisplay effect.
    //    If adding a stop should *invalidate* the current route shown:
    // setRouteData(null);
    //    If adding the *second* stop should automatically show directions:
    // if (newStops.length === 2) {
    //   setOnRoute(prev => ({ ...prev, routeStatus: true }));
    // }
  };

  // --- Function to remove a stop ---
  const handleRemoveStop = (index: number) => {
    console.log("handleRemoveStop called for index:", index);
    const cityToRemove = stops[index];
    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops);

    // Logic to update selectedCity/Area after removal:
    if (newStops.length === 0) {
      // If all stops removed, clear selection
      setSelectedCity(null);
      setSelectedCityArea(null);
      endRoute(); // Ensure route state is cleared
    } else {
      // If the removed city was the one being displayed,
      // update display to the *new last stop*
      if (selectedCity?.properties.osm_id === cityToRemove.properties.osm_id) {
        const lastStop = newStops[newStops.length - 1];
        setSelectedCity(lastStop);
        setSelectedCityArea(lastStop.properties.extent);
      }
      // Otherwise, keep the current selection (which might be another stop)
    }
    // Removing a stop likely invalidates the current route
    setRouteData(null);
    // If fewer than 2 stops remain, end the route display
    if (newStops.length < 2) {
      endRoute();
    }
  };

  // --- Function to reorder stops (passed to SortableStopsList via SearchInput) ---
  const handleReorderStops = (reorderedStops: LocalCity[]) => {
    console.log("handleReorderStops called");
    setStops(reorderedStops);
    // Reordering invalidates the current route
    setRouteData(null);
    // If less than 2 stops (shouldn't happen with reorder but good practice), end route
    if (reorderedStops.length < 2) {
      endRoute();
    } else {
      // Update focus to the *new* last stop after reorder
      const lastStop = reorderedStops[reorderedStops.length - 1];
      setSelectedCity(lastStop);
      setSelectedCityArea(lastStop.properties.extent);
    }
  };

  // --- Handler for the refocus button ---
  const handleRefocusMap = () => {
    if (userLocation) {
      console.log("Search: Triggering map refocus to:", userLocation);
      setRefocusTrigger((prev) => prev + 1);
      // Optionally clear city selection when focusing on user
      // setSelectedCity(null);
      // setSelectedCityArea(null);
    } else {
      console.warn("Search: Cannot refocus, user location unknown.");
      alert("Your current location is not available.");
    }
  };

  // --- Select City for Map Focus Only (e.g., from History without adding as stop initially) ---
  // Renamed for clarity - this only focuses the map
  const handleFocusMapOnCity = (city: LocalCity) => {
    setSelectedCity(null); // Don't show card just for focus
    setSelectedCityArea(city.properties.extent);
    endRoute(); // Focusing on a single history item clears any active route
    setRouteData(null);
  };

  return (
    <div className="md:flex relative bg-dynamic rounded-2xl h-full ">
      {/* Left Panel (Search, Stops, History) */}
      <div
        className={`absolute md:relative w-full flex flex-col md:w-80 z-20 md:border-r-2 ${
          height ? `${height}` : "h-fit md:h-screen-minus-nav"
        }`}
        style={{
          backgroundColor: "rgba(var(--background-start-rgb), 0.9)",
          backdropFilter: "blur(10px)",
        }} // Example styling
      >
        {/* Search Input & Stops List Area */}
        <div className="md:m-4 border-b md:rounded-3xl md:border shadow-sm transition-all">
          <div className="flex flex-col justify-end items-center bg-dynamic w-full md:rounded-3xl">
            <SearchInput
              query={query}
              setQuery={setQuery}
              handleClearSearch={handleClearSearch}
              isLoading={isLoading}
              error={error}
              results={results}
              // Pass the *single* function for adding a stop from results
              handleAddStop={handleAddStop}
              stops={stops}
              // Pass the reorder function directly
              setStops={handleReorderStops} // Pass the reorder handler
              handleRemoveStop={handleRemoveStop}
              endRoute={endRoute} // Pass endRoute for potential use in SortableList actions
            />
          </div>
        </div>

        {/* Display City Card only if a specific stop is selected */}
        {/* selectedCity now represents the city to show in the card (usually the last added/focused) */}
        {selectedCity && (
          <CityCard
            city={selectedCity}
            stops={stops} // Pass all stops for context if needed
            // Decide what onClose does - maybe just hide the card, or remove the *specific* selected city?
            // Option 1: Close hides the card
            onClose={() => setSelectedCity(null)}
            // Option 2: Close removes the specific city shown in the card
            // onClose={() => {
            //   const indexToRemove = stops.findIndex(s => s.properties.osm_id === selectedCity.properties.osm_id);
            //   if (indexToRemove !== -1) {
            //      handleRemoveStop(indexToRemove);
            //   }
            //   setSelectedCity(null); // Hide card after removal
            // }}
            endRoute={endRoute}
            onRoute={onRoute}
            setOnRoute={setOnRoute} // Allow CityCard to potentially start directions
            routeData={routeData}
            userLocation={userLocation}
          />
        )}

        {/* Local Cities History */}
        <div className="px-4 pt-4 mb-2 items-center gap-2 opacity-60 hidden md:flex">
          <LuHistory className="w-5 h-5" /> <span>Searched cities history</span>
        </div>
        <div className="flex-grow overflow-y-auto hidden md:block">
          <LocalCities
            // Pass the focus function
            onCityFocus={handleFocusMapOnCity}
            // Pass the add stop function
            onAddStopFromHistory={handleAddStop}
            // Pass other necessary props
            selectedCityArea={selectedCityArea} // To highlight the focused one
            onRoute={onRoute}
            setOnRoute={setOnRoute}
            routeData={routeData}
            endRoute={endRoute}
            userLocation={userLocation}
            // LocalCities doesn't directly manage stops array, but might need it for context
            stops={stops}
            // It doesn't need setStops directly
          />
        </div>
      </div>

      {/* Map Area */}
      <div
        className={`relative flex-grow rounded-2xl ${
          height ? `${height} p-2` : "h-screen-minus-nav" // Removed backdrop-blur here, add if needed
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
          setUserLocation={setUserLocation}
          refreshTrigger={refreshTrigger}
          refocusTrigger={refocusTrigger}
          stops={stops} // Pass stops to map for marker display
        />
        {/* Refocus Button */}
        <button
          onClick={handleRefocusMap}
          disabled={!userLocation}
          title="Center map on your location"
          className={`absolute bottom-16 right-2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity`}
          aria-label="Center map on current location"
        >
          <BiCurrentLocation className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </button>
      </div>
    </div>
  );
};

export default Search;
