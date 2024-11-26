"use client";

import { useEffect, useState } from "react";
import { middleOfRo } from "@/globals/constants";
import { Popup, useMap } from "@vis.gl/react-maplibre";
import { getLocation } from "@/lib/getLocation";

export default function YouAreHere() {
  const [popupLocation, setPopupLocation] = useState(middleOfRo);
  const { current: map } = useMap();

  const MyLocation = async () => {
    const location = await getLocation();

    if (location && location !== middleOfRo) {
      setPopupLocation(location);
      if (map) {
        map.flyTo({ center: location, zoom: 8 });
      }
    }
  };

  useEffect(() => {
    if (!map) return;
    MyLocation();
  }, [map]);

  if (!map) return null;

  return (
    <Popup longitude={popupLocation[0]} latitude={popupLocation[1]}>
      <h3>You are approximately here!</h3>
    </Popup>
  );
}
