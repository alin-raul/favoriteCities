// YouAreHere.tsx

import { useEffect, useState } from "react";
import { Marker } from "@vis.gl/react-maplibre"; // Removed Popup, useMap
import { getLocation } from "@/lib/getLocation";
import type { Location } from "../map/Map";

type YouAreHereProps = {
  noFetch?: boolean;
  setLocation: (location: Location | null) => void; // Function to update parent state
  advancedView: boolean; // To conditionally render marker
  refreshTrigger?: number; // To force a re-fetch
};

export default function YouAreHere({
  noFetch = false,
  setLocation,
  advancedView,
  refreshTrigger,
}: YouAreHereProps): React.ReactNode {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null); // Local state ONLY for rendering the marker

  useEffect(() => {
    let isMounted = true;

    const fetchAndSetLocation = async () => {
      if (noFetch) {
        console.log("YouAreHere: Skipping fetch (noFetch=true).");
        // Ensure parent knows location is null if we skip fetch
        // setLocation(null); // Or let previous state persist? Decide based on UX.
        return;
      }

      console.log("YouAreHere: Attempting to get location...");
      try {
        const location = await getLocation();

        if (!isMounted) return;

        if (location?.lon != null && location?.lat != null) {
          // Check for non-null numbers
          console.log("YouAreHere: Location received:", location);
          setLocation(location); // *** IMPORTANT: Update parent state ***
          setCurrentLocation(location); // Update local state for marker rendering
        } else {
          console.warn(
            "YouAreHere: Failed to get a valid location or permission denied."
          );
          setLocation(null); // Inform parent: location is unknown
          setCurrentLocation(null); // Clear local marker state
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("YouAreHere: Error fetching location:", error);
        setLocation(null); // Inform parent: location is unknown
        setCurrentLocation(null); // Clear local marker state
      }
    };

    fetchAndSetLocation();

    return () => {
      isMounted = false;
    };
    // Re-fetch when noFetch changes or refreshTrigger increments
  }, [noFetch, setLocation, refreshTrigger]);

  // Render marker ONLY if we have a valid location AND we are NOT in advanced view.
  // The map focusing logic is now handled in MapDisplay based on the parent's userLocation state.
  if (!currentLocation || advancedView) {
    // console.log("YouAreHere: Not rendering marker.", { hasLocation: !!currentLocation, advancedView });
    return null;
  }

  // console.log("YouAreHere: Rendering marker at:", currentLocation);
  return (
    <Marker
      longitude={currentLocation.lon}
      latitude={currentLocation.lat}
      anchor="center" // Anchor pulsing dot in the center
    >
      {/* Simple pulsing dot marker */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "24px",
          height: "24px",
          cursor: "pointer",
        }}
        title="Your current location"
      >
        <div
          style={{
            position: "absolute",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "rgba(0, 123, 255, 0.5)",
            animation: "pulse 2s infinite ease-out",
          }}
        ></div>
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#007bff",
            border: "2px solid white",
            zIndex: 1,
          }}
        ></div>
      </div>
      <style>{`
            @keyframes pulse {
                0% { transform: scale(0.8); opacity: 0.5; }
                50% { opacity: 1; }
                100% { transform: scale(2.5); opacity: 0; }
            }
        `}</style>
    </Marker>
  );
}
