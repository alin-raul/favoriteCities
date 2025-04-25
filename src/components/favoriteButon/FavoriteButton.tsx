// src/components/FavoriteButton.tsx
"use client";

import { TiStarFullOutline } from "react-icons/ti";
import React, { useState } from "react";
import { getFavoriteCities } from "@/lib/getFavoriteCities"; // Assuming this is client-side too
import { handleDeleteFromFavorite } from "@/lib/handleDeleteFavorite"; // This is your Server Action DELETE handler
import type { City } from "@/lib/getFavoriteCities";
import { LocalCity } from "../local-cities/localCities";
import { useSession } from "next-auth/react";

// --- Define types (as you already have) ---
type Geometry = {
  coordinates: number[];
};

type CityProperties = {
  osm_id: number;
  name: string;
  country: string;
  countrycode: string;
  county: string;
  osm_type: string;
  osm_key: string;
  osm_value: string;
  extent: number[];
};

type FavoriteButtonProps = {
  // <-- Definition here
  handleToggleFavorite: (osmId: number) => void;
  city: LocalCity;
  full?: boolean;
};

// Assuming LocalCity type includes properties, geometry, image, and selected
// type LocalCity = { properties: CityProperties; geometry: Geometry; image: string | null; selected: boolean; }; // Example structure

// --- Corrected Client-Side handlePostFavorite function ---
// This function runs in the browser
async function handlePostFavorite(
  city: LocalCity,
  userId: string | number | undefined // <--- Add userId parameter
): Promise<City[] | undefined> {
  if (!userId) {
    console.error("Client: User ID is missing for POST operation.");
    throw new Error("User must be logged in to favorite cities."); // Fail if userId is missing
  }

  if (!city || !city.properties) {
    console.error("Client: Invalid city data for POST operation");
    return undefined;
  }

  try {
    console.log(
      `Client: Attempting to POST city for user ${userId} to /api/cities...`
    );
    const response = await fetch("/api/cities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // FIX: Include userId in the body
      body: JSON.stringify({
        ...city.properties, // Include properties directly if they match backend schema
        geometry: city.geometry,
        image: city.image,
        userId: userId, // <-- Include the user's database ID here
      }),
      credentials: "include", // Still need this for client-side fetch
    });

    // ... rest of response handling ...
    if (!response.ok) {
      /* ... error handling ... */
    }
    console.log("Client: City successfully added to favorites");
    const updatedCities = await getFavoriteCities();
    return updatedCities;
  } catch (error: any) {
    console.error("Client: Error in handlePostFavorite:", error.message);
    throw error; // Re-throw
  }
}

// --- FavoriteButton Component ---
const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  handleToggleFavorite,
  city,
  full = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession(); // <--- Get session client-side

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);

    // Get the user ID from the client-side session
    const currentUserId = session?.user?.id; // This should be the DB ID (string) from the session

    try {
      if (city.selected) {
        // handleDeleteFromFavorite is a Server Action, it gets session internally
        await handleDeleteFromFavorite(city.properties.osm_id);
        console.log("Favorite deleted via Server Action.");
      } else {
        // FIX: Pass the userId to handlePostFavorite
        if (!currentUserId) {
          console.error("Client: Cannot add favorite, user not logged in.");
          // Redirect to login, show message, etc.
          alert("You must be logged in to favorite cities."); // Basic alert
          return; // Stop the process
        }
        // Call the client-side handlePostFavorite, passing the userId
        await handlePostFavorite(city, currentUserId);
        console.log("Favorite posted via client fetch.");
      }

      // After successful operation (add or delete), trigger UI update/revalidation
      handleToggleFavorite(city.properties.osm_id); // Update local state
      // Optional: router.refresh() or revalidatePath('/') if needed
      // import { useRouter } from 'next/navigation'; const router = useRouter(); router.refresh();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert(`Operation failed: ${error.message}`); // Display error to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`flex justify-center items-center h-full ${
        full ? "h-full w-full" : ""
      }`}
      onClick={(e) => {
        // Prevent default button click and event propagation if needed
        e.stopPropagation();
        e.preventDefault();
        handleClick(); // Call our async handler
      }}
      disabled={isLoading} // Disable button while loading
    >
      {/* Icon changes based on city.selected state */}
      {city.selected ? (
        <TiStarFullOutline className="h-6 w-6 fill-yellow-500 hover:fill-yellow-300 hover:drop-shadow-sm" />
      ) : (
        <TiStarFullOutline className="h-6 w-6 opacity-40 hover:opacity-80 hover:fill-yellow-400 hover:drop-shadow-sm" />
      )}
      {isLoading && "..."} {/* Optional loading indicator */}
    </button>
  );
};

export default FavoriteButton;
