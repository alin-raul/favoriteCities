// src/components/FavoriteButton.tsx
"use client";

import { TiStarFullOutline } from "react-icons/ti";
import React, { useState } from "react";
import { getFavoriteCities } from "@/lib/getFavoriteCities"; // Assuming this is client-side and will eventually fetch using Clerk auth
import { handleDeleteFromFavorite } from "@/lib/handleDeleteFavorite"; // This is your Server Action DELETE handler (needs updating for Clerk too)
import type { City } from "@/lib/getFavoriteCities";
import { LocalCity } from "../local-cities/localCities";

// *** REMOVE NextAuth import ***
// import { useSession } from "next-auth/react"; // <--- Remove this

// *** KEEP Clerk imports ***
import { useUser, useAuth } from "@clerk/nextjs"; // <--- Use Clerk hooks

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
  handleToggleFavorite: (osmId: number) => void;
  city: LocalCity;
  full?: boolean;
};

// --- Corrected Client-Side handlePostFavorite function ---
// This function runs in the browser
// It now ACCEPTS the userId as a parameter, obtained from the component using useAuth()
async function handlePostFavorite(
  city: LocalCity,
  clerkUserId: string // <--- Accept Clerk userId as a string parameter
): Promise<City[] | undefined> {
  // *** REMOVE useAuth() call here ***
  // const { userId } = useAuth(); // <--- REMOVE THIS HOOK CALL

  if (!clerkUserId) {
    // Check the passed parameter
    console.error("Client: User ID is missing for POST operation.");
    throw new Error("User must be logged in to favorite cities."); // Fail if userId is missing
  }

  if (!city || !city.properties) {
    console.error("Client: Invalid city data for POST operation");
    return undefined;
  }

  try {
    console.log(
      `Client: Attempting to POST city for user ${clerkUserId} to /api/cities...`
    );
    const response = await fetch("/api/cities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // FIX: Include clerkUserId in the body
      body: JSON.stringify({
        // ... city data properties ...
        osm_id: city.properties.osm_id,
        name: city.properties.name,
        country: city.properties.country,
        countrycode: city.properties.countrycode,
        county: city.properties.county,
        osm_type: city.properties.osm_type,
        osm_key: city.properties.osm_key,
        osm_value: city.properties.osm_value,
        extent: city.properties.extent,
        geometry: city.geometry,
        image: city.image,
        // Ensure the backend POST handler expects 'clerkUserId' or 'userId' (use 'clerkUserId' for clarity)
        clerkUserId: clerkUserId, // <--- Include the Clerk user's ID here
      }),
      credentials: "include", // Still needed for client-side fetch to send session cookie (managed by Clerk)
    });

    // --- Handle Response ---
    if (!response.ok) {
      // Improved error handling to read message from body
      try {
        const errorData = await response.json();
        console.error(
          "Client: Failed to create city:",
          response.status,
          errorData.message
        );
        throw new Error(
          errorData.message || `Error creating city: ${response.status}`
        );
      } catch (jsonError) {
        console.error(
          "Client: Failed to create city (could not parse error body):",
          response.status,
          response.statusText
        );
        throw new Error(
          `Error creating city: ${response.status} ${response.statusText}`
        );
      }
    }

    console.log("Client: City successfully added to favorites");

    // Refetch cities after successful add (make sure getFavoriteCities uses Clerk auth too)
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

  // *** REMOVE NextAuth hook ***
  // const { data: session } = useSession(); // <--- Remove this

  // *** Get Clerk user and auth state using Clerk hooks ***
  const { isLoaded, isSignedIn } = useUser(); // isLoaded: true when user object is available
  const { userId } = useAuth(); // userId: Clerk user ID (string) or null/undefined

  const handleClick = async () => {
    // Disable if loading or Clerk hooks not ready or not signed in
    if (isLoading || !isLoaded || !isSignedIn) return;
    setIsLoading(true);

    // Get the user ID from the Clerk useAuth hook
    const currentClerkUserId = userId; // This is the Clerk user ID (string)

    try {
      if (city.selected) {
        // handleDeleteFromFavorite is a Server Action, it should get the Clerk user ID using auth() internally
        // If you didn't update handleDeleteFromFavorite yet, it will still use old NextAuth logic and might fail.
        // After migration, DELETE API route will use auth() too.
        await handleDeleteFromFavorite(city.properties.osm_id);
        console.log(
          "Favorite deleted via Server Action (hopefully using Clerk auth)."
        );
      } else {
        // FIX: Pass the Clerk userId to handlePostFavorite
        if (!currentClerkUserId) {
          // Check if Clerk userId is available
          console.error(
            "Client: Cannot add favorite, user not logged in (Clerk state)."
          );
          // Handle not logged in state (e.g., redirect to Clerk login)
          // You might use Clerk's <SignInButton /> or redirect logic here
          alert("You must be logged in to favorite cities."); // Basic alert
          return; // Stop the process
        }
        // Call the client-side handlePostFavorite, passing the Clerk userId
        await handlePostFavorite(city, currentClerkUserId); // <--- Pass the Clerk userId
        console.log("Favorite posted via client fetch using Clerk userId.");
      }

      // After successful operation (add or delete), trigger UI update/revalidation
      handleToggleFavorite(city.properties.osm_id); // Update local state
      // Consider router.refresh() from 'next/navigation' to revalidate data server-side
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
      // Disable if loading or Clerk hooks not ready or not signed in
      disabled={isLoading || !isLoaded || !isSignedIn} // <--- Disable based on Clerk state
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
