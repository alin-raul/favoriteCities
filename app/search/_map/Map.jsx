"use client";

import { Map, Source, Layer } from "@vis.gl/react-maplibre";
import { middleOfEU } from "@/globals/constants";
import YouAreHere from "@/components/location/YouAreHere";
import { useTheme } from "next-themes";
import { useMemo, useEffect, useRef, useState } from "react";

export default function MapDisplay({ selectedCityArea }) {
  const { theme, resolvedTheme } = useTheme();
  const mapRef = useRef(null); // Reference to the map instance
  const [polygonData, setPolygonData] = useState(null); // State to store the polygon coordinates

  const mapStyle = useMemo(() => {
    const lightMapStyle = "https://tiles.openfreemap.org/styles/liberty";
    const darkMapStyle = "https://tiles.openfreemap.org/styles/dark";

    return (theme === "system" ? resolvedTheme : theme) === "dark"
      ? darkMapStyle
      : lightMapStyle;
  }, [theme, resolvedTheme]);

  useEffect(() => {
    if (mapRef.current && selectedCityArea) {
      // Create polygon coordinates from selectedCityArea (bounding box)
      const [minLon, minLat, maxLon, maxLat] = selectedCityArea;
      const polygon = [
        [
          [minLon, minLat], // bottom left
          [maxLon, minLat], // bottom right
          [maxLon, maxLat], // top right
          [minLon, maxLat], // top left
          [minLon, minLat], // close the polygon
        ],
      ];
      setPolygonData(polygon); // Store the polygon data in state

      // Define a bounding box based on selected coordinates
      const bounds = [
        minLon - 0.1, // minLongitude
        minLat - 0.1, // minLatitude
        maxLon + 0.1, // maxLongitude
        maxLat + 0.1, // maxLatitude
      ];

      // Use fitBounds to adjust map view
      mapRef.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 }, // Optional padding
        duration: 1000, // Optional animation duration (in ms)
      });
    }
  }, [selectedCityArea]); // Only run when selectedCityArea changes

  return (
    <div className="h-screen-minus-nav w-screen absolute z-10">
      <Map
        ref={mapRef} // Attach the map reference here
        initialViewState={{
          longitude: middleOfEU[0],
          latitude: middleOfEU[1],
          zoom: 2,
        }}
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          zIndex: "-1",
        }}
        mapStyle={mapStyle}
      >
        {/* Add a polygon layer to highlight the area */}
        {polygonData && (
          <Source
            id="highlight-area"
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: { type: "Polygon", coordinates: polygonData },
                },
              ],
            }}
          >
            <Layer
              id="highlight-area-outline"
              type="line"
              paint={{
                "line-color": "#7c7c7c", // Dotted outline color
                "line-width": 2, // Outline thickness
                "line-dasharray": [2, 4], // Dotted effect
                "line-opacity": 0.4,
              }}
            />
          </Source>
        )}

        <YouAreHere />
      </Map>
    </div>
  );
}
