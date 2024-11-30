"use client";

import { Map, Source, Layer } from "@vis.gl/react-maplibre";
import { middleOfRo } from "@/globals/constants";
import YouAreHere from "@/components/location/YouAreHere";
import { useTheme } from "next-themes";
import { useMemo, useEffect, useRef, useState } from "react";

export default function MapDisplay({
  selectedCityArea,
  rounded = [0, 0, 0, 0],
}) {
  const { theme, resolvedTheme } = useTheme();
  const mapRef = useRef(null);
  const [polygonData, setPolygonData] = useState(null);

  const mapStyle = useMemo(() => {
    const lightMapStyle = "https://tiles.openfreemap.org/styles/liberty";
    const darkMapStyle = "https://tiles.openfreemap.org/styles/dark";

    return (theme === "system" ? resolvedTheme : theme) === "dark"
      ? darkMapStyle
      : lightMapStyle;
  }, [theme, resolvedTheme]);

  useEffect(() => {
    if (mapRef.current && selectedCityArea) {
      const [minLon, minLat, maxLon, maxLat] = selectedCityArea;
      const polygon = [
        [
          [minLon, minLat],
          [maxLon, minLat],
          [maxLon, maxLat],
          [minLon, maxLat],
          [minLon, minLat],
        ],
      ];
      setPolygonData(polygon);

      const bounds = [minLon - 0.1, minLat - 0.1, maxLon + 0.1, maxLat + 0.1];

      mapRef.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1000,
      });
    }
  }, [selectedCityArea]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: middleOfRo[0],
        latitude: middleOfRo[1],
        zoom: 2,
      }}
      style={{
        borderTopLeftRadius: rounded[0],
        borderBottomLeftRadius: rounded[1],
        borderBottomRightRadius: rounded[1],
        borderTopRightRadius: rounded[0],
      }}
      mapStyle={mapStyle}
    >
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
              "line-color": "#7c7c7c",
              "line-width": 2,
              "line-dasharray": [2, 4],
              "line-opacity": 0.4,
            }}
          />
        </Source>
      )}

      <YouAreHere />
    </Map>
  );
}
