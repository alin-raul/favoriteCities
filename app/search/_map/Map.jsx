"use client";

import { Map } from "@vis.gl/react-maplibre";
import { middleOfEU } from "@/globals/constants";
import YouAreHere from "@/components/location/YouAreHere";
import { useTheme } from "next-themes";

export default function MapDisplay() {
  const { theme, resolvedTheme } = useTheme();
  const lightMapStyle = "https://tiles.openfreemap.org/styles/liberty";
  const darkMapStyle = "https://tiles.openfreemap.org/styles/dark";

  const mapStyle =
    (theme === "system" ? resolvedTheme : theme) === "dark"
      ? darkMapStyle
      : lightMapStyle;

  return (
    <Map
      initialViewState={{
        longitude: middleOfEU[0],
        latitude: middleOfEU[1],
        zoom: 2,
      }}
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        zIndex: "-1",
        right: "0",
        left: "0",
        top: "0",
      }}
      mapStyle={mapStyle}
    >
      <YouAreHere />
    </Map>
  );
}
MapDisplay;
