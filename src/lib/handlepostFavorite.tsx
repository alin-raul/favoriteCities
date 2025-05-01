"use server";

import { getFavoriteCities } from "./getFavoriteCities"; // Keep if needed for refetching after save
import type { LocalCity } from "@/components/local-cities/localCities";

// *** Import Clerk's authentication helper for Server Actions ***
import { auth } from "@clerk/nextjs/server"; // <--- Import auth() from server

export async function handlePostFavorite(city: LocalCity): Promise<any> {
  // Keep Promise<any> return type for now if you return getFavoriteCities()
  // Optional: Basic validation before getting auth if it's cheap
  if (!city || !city.properties) {
    console.error("handlePostFavorite: Invalid city data for POST operation");
    // Decide on return/error handling for invalid input
    throw new Error("Invalid city data provided."); // Throw an error for clarity
  }

  // *** Get Clerk user ID ***
  const { userId: clerkUserId } = await auth(); // <--- Get Clerk user ID (await is necessary)

  // *** Authentication check: User must be logged in (Clerk) ***
  if (!clerkUserId) {
    console.error("handlePostFavorite: User not authenticated (Clerk).");
    // Throw an error if user is not logged in. Frontend should catch this.
    throw new Error("User must be logged in to favorite cities.");
  }
  console.log(
    `handlePostFavorite: Clerk user ${clerkUserId} attempting to POST city to /api/cities...`
  );

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cities`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // REMOVE MANUAL AUTH/COOKIE HEADERS:
          // Clerk's context should handle authentication implicitly when calling internal routes.
          // No need for Authorization: Bearer ... or manually forwarding Cookie here.
        },
        body: JSON.stringify({
          // Include all necessary city data properties from the LocalCity object
          osm_id: city.properties.osm_id,
          name: city.properties.name,
          country: city.properties.country,
          countrycode: city.properties.countrycode,
          county: city.properties.county,
          osm_type: city.properties.osm_type,
          osm_key: city.properties.osm_key,
          osm_value: city.properties.osm_value,
          extent: city.properties.extent,
          geometry: city.geometry, // Assuming geometry structure matches backend schema
          image: city.image, // Assuming image property exists and matches backend schema
          // *** Include the Clerk User ID in the body ***
          clerkUserId: clerkUserId, // <--- Include the Clerk user's ID here
        }),
        // credentials: 'include' is not needed/relevant for server-to-server fetch
      }
    );

    // --- Handle Response from API Route ---
    if (!response.ok) {
      // Check for specific status codes if needed (e.g., 409 Conflict if already favorited)
      // if (response.status === 409) { ... }

      // Read error message from the response body
      try {
        const errorData = await response.json();
        console.error(
          "handlePostFavorite: API returned error:",
          response.status,
          errorData.message
        );
        // Throw an error with the backend message
        throw new Error(
          errorData.message || `Error creating city: ${response.status}`
        );
      } catch (jsonError) {
        // Handle case where backend didn't return JSON error body
        console.error(
          "handlePostFavorite: API returned error, could not parse body:",
          response.status,
          response.statusText
        );
        throw new Error(
          `Error creating city: ${response.status} ${response.statusText}`
        );
      }
    }

    console.log(
      "handlePostFavorite: City successfully added to favorites (API returned 2xx)"
    );

    // *** Refetch cities after successful add ***
    // Assuming getFavoriteCities is either a Server Action or a client function
    // that uses Clerk's authentication/fetches correctly.
    const updatedCities = await getFavoriteCities(); // Assuming getFavoriteCities is updated for Clerk
    return updatedCities; // Return the updated list
  } catch (error: any) {
    // Catch errors thrown above (invalid input, auth failure, fetch errors, API errors)
    console.error("handlePostFavorite: Failed to create city:", error.message);
    // Re-throw the error so the frontend component can handle displaying it
    throw error;
  }
}
