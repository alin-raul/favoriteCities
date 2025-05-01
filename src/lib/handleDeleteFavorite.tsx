// src/lib/handleDeleteFavorite.tsx
"use server";

import { getFavoriteCities } from "./getFavoriteCities";
// *** Import auth from Clerk server ***
import { auth } from "@clerk/nextjs/server"; // <--- Import auth()

export async function handleDeleteFromFavorite(id: number): Promise<any> {
  try {
    // *** Get Clerk auth object and session token ***
    const authObject = await auth(); // Get the full auth object
    const clerkUserId = authObject.userId; // Extract userId
    const sessionToken = await authObject.getToken();

    // *** Authentication check: User must be logged in (Clerk) ***
    if (!clerkUserId || !sessionToken) {
      // Check for both user ID and token
      console.error(
        "handleDeleteFromFavorite: User not authenticated (Clerk) or session token missing."
      );
      throw new Error("User must be logged in to delete cities.");
    }
    console.log(
      `handleDeleteFromFavorite: Clerk user ${clerkUserId} attempting to delete city ${id} via Server Action.`
    );

    // --- Make the internal API fetch call ---
    // *** Include the Authorization header with the session token ***
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cities`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // *** ADD Authorization header with session token ***
          Authorization: `Bearer ${sessionToken}`, // <--- Pass the session token
        },
        body: JSON.stringify({ osm_id: id }),
        // credentials: 'include' is not needed/relevant for server-to-server fetch
      }
    );

    // --- Handle Response from API Route ---
    if (!response.ok) {
      // Check for 401 specifically - this confirms if the API route's auth check passed/failed
      if (response.status === 401) {
        console.error(
          "handleDeleteFromFavorite: Received 401 from API. Clerk user ID:",
          clerkUserId
        );
        // The API route's auth check failed *despite* sending the token. This might indicate token invalidity
        // or a mismatch in how the API route is validating.
        throw new Error(
          "Authentication failed during delete (API returned 401). Please try logging in again."
        );
      }
      // Handle other API errors (404, 500, etc.)
      try {
        const errorData = await response.json();
        console.error(
          "handleDeleteFromFavorite: API returned error:",
          response.status,
          errorData.message
        );
        throw new Error(
          errorData.message || `Error deleting city: ${response.status}`
        );
      } catch (jsonError) {
        console.error(
          "handleDeleteFromFavorite: API returned error, could not parse body:",
          response.status,
          response.statusText
        );
        throw new Error(
          `Error deleting city: ${response.status} ${response.statusText}`
        );
      }
    }

    console.log("City successfully deleted from favorites (API returned 2xx)");

    // Refetch cities after successful delete
    // Assuming getFavoriteCities is either a Server Action or client function using Clerk auth
    const updatedCities = await getFavoriteCities();
    return updatedCities; // Return the updated list
  } catch (error: any) {
    console.error(
      "handleDeleteFromFavorite: Failed to delete city:",
      error.message
    );
    throw error; // Re-throw the error
  }
}
