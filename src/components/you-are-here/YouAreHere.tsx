import { useEffect, useState } from "react";
import { middleOfRo } from "@/globals/constants";
import { Popup, useMap } from "@vis.gl/react-maplibre";
import { getLocation } from "@/lib/getLocation";
import { Marker } from "@vis.gl/react-maplibre";
import type { Location } from "../map/Map";


type YouAreHereProps = {
  noFetch: boolean;
  setLocation: (location: Location) => void;
  advancedView: boolean;
};

export default function YouAreHere({
  noFetch,
  setLocation,
  advancedView,
}: YouAreHereProps): React.ReactNode {
  const [popupLocation, setPopupLocation] = useState<Location>(middleOfRo);
  const { current: map } = useMap();

  useEffect(() => {
    const MyLocation = async () => {
      if (noFetch) return;
      const location = await getLocation();
      setLocation(location);

      if (location && location !== middleOfRo) {
        setPopupLocation(location);
        if (map) {
          map.flyTo({ center: location, zoom: 16 });
        }
      }
    };

    if (!map) return;
    MyLocation();
  }, [map, noFetch, setLocation]);

  if (!map) return null;

  return (
    <>
      {!noFetch && !advancedView && (
        <div>
          <Popup longitude={popupLocation.lon} latitude={popupLocation.lat}>
            <h3>You are approximately here!</h3>
          </Popup>
          <Marker longitude={popupLocation.lon} latitude={popupLocation.lat}>
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
