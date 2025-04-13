"use client";

import {
  Map,
  Source,
  Layer,
  Marker,
  MapRef,
  useMap,
} from "@vis.gl/react-maplibre";
import { middleOfRo } from "@/globals/constants";
import YouAreHere from "../you-are-here/YouAreHere";
import { useTheme } from "next-themes";
import { useMemo, useEffect, useRef, useState } from "react";
import axios from "axios";
import polyline from "polyline";
import { FaLocationDot } from "react-icons/fa6";
import type { RouteResponse, OnRoute } from "../search/Search"; // Import OnRoute
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Position,
} from "geojson";
import { LocalCity } from "../local-cities/localCities";

export type Location = {
  lon: number;
  lat: number;
};

type PolygonCoordinates = Position[][];

type MapDisplayProps = {
  selectedCityArea?: number[] | null;
  rounded?: [string, string, string, string] | string;
  zIndex?: number;
  noFetch?: boolean;
  advancedView?: boolean;
  routeData: RouteResponse | null;
  setRouteData: (routeData: RouteResponse | null) => void;
  onRoute?: OnRoute;
  userLocation: Location | null;
  setUserLocation: (location: Location | null) => void;
  refreshTrigger: number;
  refocusTrigger: number;
  stops: LocalCity[];
};

const geoJsonData = (data: FeatureCollection): FeatureCollection => data;

export default function MapDisplay({
  selectedCityArea,
  rounded = ["0px", "0px", "0px", "0px"],
  zIndex,
  noFetch,
  advancedView = false,
  onRoute,
  routeData,
  setRouteData,
  userLocation, // Receive from parent
  setUserLocation, // Receive from parent
  refreshTrigger, // Receive from parent
  refocusTrigger, // Receive from parent
}: MapDisplayProps) {
  const { theme, resolvedTheme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const initialFocusDone = useRef(false); // Track if initial focus happened
  // Remove local derivedLocation state, use userLocation prop directly
  // const [derivedLocation, setDerivedLocation] = useState<Location | null>(userLocation);
  const [polygonData, setPolygonData] = useState<PolygonCoordinates | null>(
    null
  );
  const [routePath, setRoutePath] = useState<Array<[number, number]> | null>(
    null
  );

  const mapStyle = useMemo(() => {
    // ... (map style logic remains the same)
    const lightMapStyle = "https://tiles.openfreemap.org/styles/liberty";
    const darkMapStyle = "/map/dark-map.json";

    return (theme === "system" ? resolvedTheme : theme) === "dark"
      ? darkMapStyle
      : lightMapStyle;
  }, [theme, resolvedTheme]);

  // Effect for focusing on selected city area (bounds)
  useEffect(() => {
    setPolygonData(null); // Clear previous polygon first
    if (!selectedCityArea || selectedCityArea.length < 4 || !mapRef.current)
      return;

    const [minLon, minLat, maxLon, maxLat] = selectedCityArea;
    const polygonCoords: PolygonCoordinates = [
      [
        [minLon, minLat],
        [maxLon, minLat],
        [maxLon, maxLat],
        [minLon, maxLat],
        [minLon, minLat],
      ],
    ];
    setPolygonData(polygonCoords);

    const bounds: [[number, number], [number, number]] = [
      [minLon, minLat],
      [maxLon, maxLat],
    ];

    // Check if bounds are valid before fitting
    if (
      isFinite(minLon) &&
      isFinite(minLat) &&
      isFinite(maxLon) &&
      isFinite(maxLat)
    ) {
      console.log("MapDisplay: Fitting bounds to selected area:", bounds);
      mapRef.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1000,
      });
      // If we fit to bounds, maybe reset the initial focus flag?
      // Or assume user action overrides initial auto-focus
      // initialFocusDone.current = true; // Prevent auto-focus if user selects city? Your choice.
    } else {
      console.warn(
        "MapDisplay: Invalid bounds provided for selected area:",
        selectedCityArea
      );
    }
  }, [selectedCityArea]);

  // --- NEW: Effect for Initial Focus on User Location ---
  useEffect(() => {
    // Only run if location is available, map exists, and initial focus hasn't happened
    if (userLocation && mapRef.current && !initialFocusDone.current) {
      // Also check if a city area isn't *currently* selected, to avoid immediate override
      if (!selectedCityArea) {
        console.log(
          "MapDisplay: Performing initial focus on user location:",
          userLocation
        );
        mapRef.current.flyTo({
          center: [userLocation.lon, userLocation.lat],
          zoom: 13, // Adjust initial zoom as needed
          duration: 1500,
        });
        initialFocusDone.current = true; // Mark initial focus as done
      } else {
        console.log("MapDisplay: Skipping initial focus, city area selected.");
        initialFocusDone.current = true; // Mark as done anyway if a city is pre-selected
      }
    }
  }, [userLocation, selectedCityArea]); // Depend on userLocation and selectedCityArea

  // --- NEW: Effect for Refocus Button Trigger ---
  useEffect(() => {
    // Don't run on initial mount (trigger starts at 0)
    if (refocusTrigger > 0 && userLocation && mapRef.current) {
      console.log("MapDisplay: Refocusing map on user location:", userLocation);
      // Clear selected area highlight when refocusing on user? Optional.
      // setPolygonData(null);
      mapRef.current.flyTo({
        center: [userLocation.lon, userLocation.lat],
        zoom: 14, // Adjust refocus zoom as needed
        duration: 1000,
      });
    }
  }, [refocusTrigger, userLocation]); // Depend on the trigger and location

  // Effect for fetching and drawing route
  useEffect(() => {
    const fetchRoute = async () => {
      // Clear existing route visuals first
      setRouteData(null);
      setRoutePath(null);

      if (!onRoute?.routeStatus) {
        return; // Exit if not routing
      }

      console.log("MapDisplay: Fetching route:", onRoute);

      const startLocation = onRoute.route.from;
      const middleLocations = onRoute.route.stopPoints;
      const endLocation = onRoute.route.to;

      if (!endLocation?.lon || !endLocation?.lat) {
        console.log("MapDisplay: No valid endpoint for route.");
        return;
      }

      // Use userLocation as the ultimate fallback start point if needed
      const start =
        startLocation?.lon && startLocation?.lat ? startLocation : userLocation; // Fallback to user's current location

      if (!start?.lon || !start?.lat) {
        console.log(
          "MapDisplay: No valid start location for route (neither explicit nor user location available)."
        );
        // Maybe show an error to the user here
        return;
      }

      try {
        const apiUrl = "/api/directions";
        const response = await axios.post(apiUrl, {
          startLocation: { lon: start.lon, lat: start.lat },
          middleLocations,
          endLocation: { lon: endLocation.lon, lat: endLocation.lat },
        });

        const routeDataResponse: RouteResponse = response.data;
        setRouteData(routeDataResponse); // Update parent state

        if (routeDataResponse?.routes?.[0]?.geometry) {
          const routeGeometry = routeDataResponse.routes[0].geometry;
          const decodedCoordinates = polyline.decode(routeGeometry) as Array<
            [number, number]
          >;
          // Filter out potential invalid points just in case
          const validPath = decodedCoordinates.filter(
            (coord) =>
              Array.isArray(coord) &&
              coord.length === 2 &&
              isFinite(coord[0]) &&
              isFinite(coord[1])
          );
          if (validPath.length > 0) {
            setRoutePath(validPath);
          } else {
            console.error(
              "MapDisplay: Decoded route path contained no valid coordinates."
            );
            setRoutePath(null);
          }
        } else {
          console.error("MapDisplay: Route geometry missing in response");
          setRoutePath(null);
        }
      } catch (error) {
        console.error(
          "MapDisplay: Error fetching route:",
          axios.isAxiosError(error)
            ? error.response?.data || error.message
            : error
        );
        setRouteData(null);
        setRoutePath(null);
      }
    };

    fetchRoute();
  }, [onRoute, userLocation, setRouteData]); // Depend on route status and userLocation (for fallback start)

  // Effect for fitting map bounds to the route path
  useEffect(() => {
    if (!routePath || routePath.length === 0 || !mapRef.current) return;

    try {
      const { minLng, minLat, maxLng, maxLat } =
        calculateBoundingBox(routePath);

      if (
        !isFinite(minLng) ||
        !isFinite(minLat) ||
        !isFinite(maxLng) ||
        !isFinite(maxLat)
      ) {
        console.error("MapDisplay: Calculated invalid bounds from routePath.");
        return;
      }

      console.log("MapDisplay: Fitting bounds to route path");
      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 60 } // Increased padding slightly
      );
    } catch (error) {
      console.error("MapDisplay: Error fitting bounds for route:", error);
    }
  }, [routePath]); // Only depend on routePath

  // Helper function to calculate bounding box (remains the same)
  const calculateBoundingBox = (coordinates: Array<[number, number]>) => {
    let minLng = Infinity,
      minLat = Infinity,
      maxLng = -Infinity,
      maxLat = -Infinity;
    coordinates.forEach(([lat, lng]) => {
      // Remember polyline is [lat, lng]
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });
    return { minLng, minLat, maxLng, maxLat };
  };

  // Helper to format rounded style (remains the same)
  const getBorderStyle = () => {
    if (typeof rounded === "string") {
      return { borderRadius: rounded };
    }
    // Corrected indices
    return {
      borderTopLeftRadius: rounded[0],
      borderBottomLeftRadius: rounded[1],
      borderBottomRightRadius: rounded[2],
      borderTopRightRadius: rounded[3],
    };
  };

  return (
    <Map
      ref={mapRef}
      antialias={advancedView}
      interactive={!advancedView}
      initialViewState={{
        longitude: middleOfRo[0],
        latitude: middleOfRo[1],
        zoom: 6, // Keep initial zoom somewhat broad until location is found
        pitch: 0,
        bearing: 0,
      }}
      style={{
        width: "100%",
        height: "100%",
        ...getBorderStyle(),
        zIndex: zIndex,
        overflow: "hidden",
      }}
      mapStyle={mapStyle}
      // Prevent map interaction from resetting the initial focus flag incorrectly
      // onMove={() => { /* No action needed here based on movement */ }}
      // onZoomEnd={() => { /* No action needed here */ }}
    >
      {/* Polygon for Selected City Area */}
      {polygonData && (
        <Source
          id="highlight-area"
          type="geojson"
          data={geoJsonData({
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: { type: "Polygon", coordinates: polygonData },
                properties: {},
              },
            ],
          })}
        >
          <Layer
            id="highlight-area-outline"
            type="line"
            paint={{
              /* ... styles ... */ "line-color": "#7c7c7c",
              "line-width": 1,
              "line-dasharray": [2, 4],
              "line-opacity": 0.4,
            }}
          />
        </Source>
      )}

      {/* Route Line */}
      {routePath && routePath.length > 0 && (
        <Source
          id="route-line"
          type="geojson"
          data={geoJsonData({
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: routePath.map(([lat, lon]) => [lon, lat]),
                },
                properties: {},
              },
            ],
          })}
        >
          <Layer
            id="route-line-layer"
            type="line"
            layout={{ /* ... */ "line-join": "round", "line-cap": "round" }}
            paint={{
              /* ... */ "line-color": "#007bff",
              "line-width": 5,
              "line-opacity": 0.9,
            }}
          />
        </Source>
      )}

      {/* Route Markers */}
      {routePath &&
        routePath.length > 1 &&
        onRoute?.routeStatus && ( // Ensure > 1 point and routing active
          <>
            {/* Start Marker (Example: blue dot, only if different from user location?) */}
            {/* You might want conditional logic here */}
            {/* <Marker longitude={routePath[0][1]} latitude={routePath[0][0]} anchor="center">
              <div style={{ width: '10px', height: '10px', backgroundColor: 'blue', borderRadius: '50%' }}></div>
          </Marker> */}

            {/* End Marker (Red location pin) */}
            <Marker
              longitude={routePath[routePath.length - 1][1]}
              latitude={routePath[routePath.length - 1][0]}
              anchor="bottom"
            >
              <div style={{ textAlign: "center" }}>
                <FaLocationDot
                  style={{
                    fontSize: "2rem",
                    color: "red",
                    transform: "translateY(50%)",
                  }}
                />
              </div>
            </Marker>
          </>
        )}

      {/* Pass the necessary props down to YouAreHere */}
      <YouAreHere
        noFetch={noFetch}
        setLocation={setUserLocation} // Pass the state setter from Search -> MapDisplay
        advancedView={advancedView}
        refreshTrigger={refreshTrigger} // Pass trigger from Search -> MapDisplay
      />
    </Map>
  );
}
