"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import FavoriteButton from "@/components/favoriteButon/FavoriteButton";
import { FaXmark } from "react-icons/fa6";
import { useNavigationEvents } from "@/components/navigation-events/useNavigationEvents";
// Removed MdOutlineDirections, MdOutlineDirectionsOff as they weren't used directly here
import { FaArrowRightToCity } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { getFavoriteCities } from "@/lib/getFavoriteCities";
import type { Location } from "../map/Map";
import type { OnRoute, RouteResponse } from "../search/Search"; // Import from Search
import { SlLocationPin } from "react-icons/sl";
// Make sure LocalCity type definition is accessible (imported or defined here)
// Assuming it's defined as before:
type CityProperties = {
  osm_type: string;
  osm_id: number;
  extent: number[];
  country: string;
  osm_key: string;
  city: string;
  countrycode: string;
  osm_value: string;
  name: string;
  county?: string;
  type: string;
};
type CityGeometry = {
  coordinates: number[];
  type: string;
};
export type LocalCity = {
  geometry: CityGeometry;
  properties: CityProperties;
  image?: string;
  addedAt?: string; // Make sure this is consistently set when adding cities
  selected?: boolean; // Used for favorite status maybe?
  type: "Feature";
};

// --- Define the structure for categorized cities ---
type CategorizedCities = {
  Today: LocalCity[];
  Yesterday: LocalCity[];
  "Last 7 days": LocalCity[];
  "This month": LocalCity[];
  "Last month": LocalCity[];
  Older: LocalCity[]; // Added category for anything older
  // Add more categories as needed
};

type LocalCitiesProps = {
  selectedCityArea: number[] | null;
  onCityFocus: (city: LocalCity) => void;
  onAddStopFromHistory: (city: LocalCity) => void;
  onRoute: OnRoute;
  endRoute: () => void;
  setOnRoute: (onRoute: OnRoute) => void;
  routeData: RouteResponse | null;
  userLocation: Location | null;
  stops: LocalCity[];
};

const LocalCities: React.FC<LocalCitiesProps> = ({
  selectedCityArea,
  onCityFocus,
  onAddStopFromHistory,
  onRoute,
  endRoute,
  setOnRoute,
  routeData,
  userLocation, // Kept in case needed later
  stops, // Kept in case needed later
}) => {
  const [cities, setCities] = useState<LocalCity[]>([]);
  // --- Restore pathSummery state ---
  const [pathSummery, setPathSummery] = useState<{
    distance: number;
    duration: number;
  } | null>(null);
  const router = useRouter();
  const pathname = useNavigationEvents();

  // --- Restore effect for pathSummery ---
  useEffect(() => {
    if (!routeData) {
      setPathSummery(null);
      return; // Exit early if no route data
    }
    if (routeData && routeData.routes && routeData.routes[0]?.summary) {
      const { distance, duration } = routeData.routes[0].summary;

      // Basic validation
      if (typeof distance === "number" && typeof duration === "number") {
        // Convert distance to km (assuming it's in meters) and round
        const distanceInKm = Math.round(distance / 1000);
        // Convert duration to hours (assuming it's in seconds) and round to 1 decimal
        const durationInHours = parseFloat((duration / 3600).toFixed(1));

        setPathSummery({
          distance: distanceInKm,
          duration: durationInHours,
        });
      } else {
        console.warn(
          "Invalid route summary data:",
          routeData.routes[0].summary
        );
        setPathSummery(null); // Reset if data is invalid
      }
    } else {
      setPathSummery(null); // Reset if structure is missing
    }
  }, [routeData]); // Re-run when routeData changes

  // --- Restore loadCitiesFromStorage implementation ---
  const loadCitiesFromStorage = async () => {
    try {
      const storedCitiesJson = localStorage.getItem("cities");
      const storedCities = storedCitiesJson ? JSON.parse(storedCitiesJson) : [];

      if (Array.isArray(storedCities)) {
        const validCities: LocalCity[] = storedCities.filter(
          (
            city
          ): city is LocalCity => // Type guard for validation
            city &&
            city.properties &&
            typeof city.properties.name === "string" &&
            city.geometry &&
            Array.isArray(city.geometry.coordinates) &&
            city.properties.osm_id // Check for essential properties
        );

        // Fetch favorite status (optional, adjust if needed)
        const favoriteCities = await getFavoriteCities(); // Assuming this async function works
        const favoriteCityIds = new Set(
          favoriteCities.map((fav) => fav.osm_id)
        ); // Use ID for matching

        const updatedCities = validCities.map((city) => ({
          ...city,
          selected: favoriteCityIds.has(city.properties.osm_id), // 'selected' indicates favorite
          addedAt: city.addedAt || new Date().toISOString(), // Ensure addedAt exists
        }));

        // Sort by date, newest first
        updatedCities.sort(
          (a, b) =>
            new Date(b.addedAt!).getTime() - new Date(a.addedAt!).getTime()
        );
        setCities(updatedCities);
      } else {
        console.warn("Stored 'cities' is not an array.");
        setCities([]); // Reset to empty array if invalid data
      }
    } catch (error) {
      console.error("Error parsing cities from storage:", error);
      setCities([]); // Reset on error
    }
  };

  // --- Restore handleToggleFavorite (assuming it updates local storage) ---
  const handleToggleFavorite = (id: number) => {
    // This function likely needs to interact with your actual favorite storage mechanism
    // For now, just update the local state and localStorage if `selected` represents favorite
    const updatedCities = cities.map((city) => {
      if (city.properties.osm_id === id) {
        // Here you would also call your API/DB function to add/remove favorite
        // e.g., addFavoriteCity(city) or removeFavoriteCity(id)
        return { ...city, selected: !city.selected };
      }
      return city;
    });
    setCities(updatedCities);
    // Optionally update localStorage immediately, though loadCitiesFromStorage might handle it
    // localStorage.setItem("cities", JSON.stringify(updatedCities));
    // Note: A full implementation would likely involve fetching favorites again
    // or directly manipulating the favorite state via API calls.
  };

  // --- Restore categorizeCities implementation with correct typing ---
  const categorizeCities = useMemo((): CategorizedCities => {
    const categories: CategorizedCities = {
      Today: [],
      Yesterday: [],
      "Last 7 days": [],
      "This month": [],
      "Last month": [],
      Older: [],
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
    const lastMonthEnd = new Date(thisMonthStart); // Day before this month started
    lastMonthEnd.setDate(lastMonthEnd.getDate() - 1);

    cities.forEach((city) => {
      if (!city.addedAt) {
        categories.Older.push(city); // Push to Older if no date
        return;
      }
      const cityDate = new Date(city.addedAt);

      if (isNaN(cityDate.getTime())) {
        categories.Older.push(city); // Push to Older if invalid date
        return;
      }

      if (cityDate >= todayStart) {
        categories.Today.push(city);
      } else if (cityDate >= yesterdayStart) {
        // No need for && cityDate < todayStart due to order
        categories.Yesterday.push(city);
      } else if (cityDate >= last7DaysStart) {
        categories["Last 7 days"].push(city);
      } else if (cityDate >= thisMonthStart) {
        categories["This month"].push(city);
      } else if (cityDate >= lastMonthStart) {
        // Check if it's within the last month
        categories["Last month"].push(city);
      } else {
        categories.Older.push(city); // Catch all for anything older
      }
    });

    return categories;
  }, [cities]); // Recalculate when cities array changes

  useEffect(() => {
    loadCitiesFromStorage();

    // Add listener for storage changes (optional but good for multi-tab sync)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "cities") {
        loadCitiesFromStorage();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Load on mount

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto pb-4">
        {" "}
        {/* Added padding-bottom */}
        {/* --- Type the destructured value explicitly --- */}
        {Object.entries(categorizeCities).map(
          (
            [category, categoryCities]: [string, LocalCity[]] // Explicitly type here
          ) =>
            categoryCities.length > 0 && ( // Now .length is accessible
              <div key={category} className="w-full p-4 pt-2">
                {" "}
                {/* Reduced top padding */}
                <h2 className="text-base font-semibold mb-2 opacity-60 sticky top-0 bg-background/80 backdrop-blur-sm py-1 z-10">
                  {" "}
                  {/* Make category title sticky */}
                  {category}
                </h2>
                {/* Now .map is accessible */}
                {categoryCities.map((city) => {
                  const isCurrentlyFocused =
                    selectedCityArea &&
                    city.properties.extent && // Check if extent exists
                    city.properties.extent.length === selectedCityArea.length && // Check length match
                    city.properties.extent.every(
                      (val, i) => val === selectedCityArea[i]
                    );

                  // Format date safely
                  const formattedDate = city.addedAt
                    ? new Date(city.addedAt).toLocaleDateString("en-GB", {
                        // Just date for history
                        // weekday: 'short',
                        day: "numeric",
                        month: "short",
                        // year: 'numeric', // Optionally add year
                      })
                    : "N/A";

                  return (
                    <div
                      key={city.properties.osm_id} // Use stable ID
                      className={`h-fit p-3 rounded-2xl border dynamic-border shadow-sm flex flex-col justify-between bg-dynamic-s bg-dynamic-h mb-2 cursor-pointer hover:shadow-md active:shadow-inner transition-all ${
                        isCurrentlyFocused
                          ? "ring-2 ring-blue-500 shadow-md"
                          : "hover:bg-gray-500/5" // Enhanced hover/focus
                      }`}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest("button")) {
                          return;
                        }
                        onCityFocus(city);
                      }}
                    >
                      {/* Top section */}
                      <div className="flex justify-between items-start">
                        <div className="flex-grow min-w-0 mr-2">
                          <h3 className={`text-sm font-medium truncate`}>
                            {" "}
                            {/* Smaller heading */}
                            {city.properties.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs opacity-60">
                            <span>
                              {city.properties.country ||
                                city.properties.countrycode}
                            </span>
                            {/* Add county if available */}
                            {city.properties.county && (
                              <span>, {city.properties.county}</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedCities = cities.filter(
                              (c) =>
                                c.properties.osm_id !== city.properties.osm_id
                            );
                            setCities(updatedCities); // Update state
                            localStorage.setItem(
                              // Update storage
                              "cities",
                              JSON.stringify(updatedCities)
                            );
                          }}
                          className="ml-1 p-1 opacity-40 hover:opacity-100 hover:bg-red-500/10 rounded-full flex-shrink-0" // Ensure it doesn't shrink content
                          aria-label={`Remove ${city.properties.name} from history`}
                        >
                          <FaXmark className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Action Buttons Area */}
                      <div className="mt-2 pt-2 border-t flex flex-wrap items-center justify-start gap-2">
                        {" "}
                        {/* Align buttons left */}
                        {/* Add Stop Button */}
                        <Button
                          variant="ghost" // Subtle button style
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddStopFromHistory(city);
                          }}
                          className="rounded-full text-xs px-2 py-1 h-auto" // Compact size
                          aria-label={`Add ${city.properties.name} as a stop`}
                        >
                          <SlLocationPin className="mr-1 h-3 w-3" /> Add Stop
                        </Button>
                        {/* View City Button */}
                        {pathname !== "/cities" && ( // Show only if not already on cities page
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/cities/${city.properties.name}`);
                            }}
                            className="rounded-full text-xs px-2 py-1 h-auto"
                            aria-label={`View details for ${city.properties.name}`}
                          >
                            <FaArrowRightToCity className="mr-1 h-3 w-3" /> View
                          </Button>
                        )}
                        {/* Favorite Button (Positioned to the right potentially) */}
                        <div className="ml-auto">
                          {" "}
                          {/* Pushes favorite button to the right */}
                          <FavoriteButton
                            handleToggleFavorite={handleToggleFavorite}
                            city={city}
                            full={false}
                          />
                        </div>
                      </div>

                      {/* Route Info (Only if focused and route exists) */}
                      {isCurrentlyFocused && routeData && pathSummery && (
                        <div className="mt-2 pt-2 border-t dynamic-border">
                          <div className="flex justify-between py-1 px-2 rounded-full text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                            {" "}
                            {/* Themed info bar */}
                            <span>{`${pathSummery.distance} km`}</span>
                            <span>{`${pathSummery.duration} h`}</span>
                          </div>
                        </div>
                      )}

                      {/* Date Added (Only if not focused) */}
                      {/* {!isCurrentlyFocused && ( // Show date only when not focused
                        <div className="mt-1 text-right">
                          <span className="opacity-50 font-light text-xs">
                            {formattedDate}
                          </span>
                        </div>
                      )} */}
                    </div>
                  );
                })}
              </div>
            )
        )}
        {cities.length === 0 && (
          <p className="p-4 text-center text-sm opacity-60">
            No search history yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default LocalCities;
