"use client";

import React, { useState } from "react"; // Import useState if needed for defaults, though often not
import MapDisplay from "../map/Map";
// Make sure necessary types are imported or defined
// Assuming they might come from Search or a central types file
import type { RouteResponse, OnRoute } from "../search/Search";
import type { Location } from "../map/Map";
import type { LocalCity } from "../local-cities/localCities";

// --- Define Dummy Handlers ---
// These do nothing, satisfying the function type requirement
const dummySetRouteData = (_: RouteResponse | null) => {};
const dummySetUserLocation = (_: Location | null) => {};

const Minimap: React.FC = () => {
  // You generally don't need state here unless the minimap
  // itself needs to manage some minimal state.
  // Using constants or direct null/empty values is usually sufficient.

  return (
    // It's often better to apply rounding and overflow hidden to the container
    // rather than the map component itself, especially if the map library
    // doesn't handle border-radius perfectly on the map tiles.
    <div className="w-full h-full pointer-events-none overflow-hidden rounded-[3rem]">
      <MapDisplay
        // Provided props:
        advancedView={true} // Keep if it simplifies UI elements suitable for minimap
        // Set map's internal rounding to none if the container handles it
        rounded={"0"}
        noFetch={true} // Crucial: Prevents the map from trying to fetch data
        // --- Provide required props with dummy/default values ---
        routeData={null} // No route data
        setRouteData={dummySetRouteData} // Dummy setter
        userLocation={null} // No specific user location tracking needed here
        setUserLocation={dummySetUserLocation} // Dummy setter
        refreshTrigger={0} // Static trigger value
        refocusTrigger={0} // Static trigger value
        stops={[]}

        // --- Optional props (can be omitted or set as needed) ---
        // selectedCityArea={null}            // Optional: Can be omitted
        // zIndex={1}                         // Optional: Set z-index if needed
        // onRoute={undefined}                // Optional: Can be omitted
      />
    </div>
  );
};

export default Minimap;
