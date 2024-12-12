"use client";

import { useEffect, useState } from "react";
import { middleOfRo } from "@/globals/constants";
import { Popup, useMap } from "@vis.gl/react-maplibre";
import { getLocation } from "@/lib/getLocation";
import { Marker } from "@vis.gl/react-maplibre";

export default function YouAreHere({ noFetch, setLocation }) {
  const [popupLocation, setPopupLocation] = useState(middleOfRo);
  const { current: map } = useMap();

  const MyLocation = async () => {
    if (noFetch) return;
    const location = await getLocation();
    setLocation(location);

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
    <>
      {!noFetch && (
        <div className="">
          <Popup longitude={popupLocation[0]} latitude={popupLocation[1]}>
            <h3>You are approximately here!</h3>
          </Popup>
          <Marker longitude={popupLocation[0]} latitude={popupLocation[1]}>
            <div className="flex flex-col justify-center items-center">
              <div className="relative flex justify-center items-center">
                <div className="animate-ping absolute h-8 w-8 rounded-full bg-blue-400 opacity-75"></div>
                <div className="h-6 w-6 bg-blue-500 rounded-full border-2 border-gray-200"></div>
              </div>
            </div>
          </Marker>
        </div>
      )}
    </>
  );
}
