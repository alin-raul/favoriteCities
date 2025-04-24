// src/lib/handleDeleteFavorite.tsx
"use server";

import { getServerSession } from "next-auth";
import { getFavoriteCities } from "./getFavoriteCities";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { headers } from "next/headers"; // Import headers function

export async function handleDeleteFromFavorite(id: number): Promise<any> {
  try {
    // Check session here - this confirms the user was authenticated *when calling the Server Action*
    const session = await getServerSession(options);
    if (!session || !session.user) {
      console.error(
        "handleDeleteFromFavorite: User not authenticated server-side."
      );
      throw new Error("User not authenticated.");
    }
    console.log(
      `handleDeleteFromFavorite: User ${session.user.id} attempting to delete city ${id} via Server Action.`
    );

    // --- FIX: Await the headers() call ---
    const requestHeaders = await headers(); // Await the promise
    const cookieHeader = requestHeaders.get("cookie"); // Now .get() exists on ReadonlyHeaders

    // --- Make the internal API fetch call ---
    const fetchHeaders: HeadersInit = {
      // Use HeadersInit type for clarity
      "Content-Type": "application/json",
      // Add the cookie header IF it exists
      ...(cookieHeader && { cookie: cookieHeader }), // Spread operator to conditionally add
    };

    console.log(
      "handleDeleteFromFavorite: Fetching /api/cities with headers:",
      fetchHeaders
    ); // Log headers being sent

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cities`,
      {
        method: "DELETE",
        // Use the fetchHeaders which now include the cookie
        headers: fetchHeaders,
        body: JSON.stringify({ osm_id: id }),
      }
    );

    // --- Handle Response ---
    if (!response.ok) {
      if (response.status === 401) {
        console.error("handleDeleteFromFavorite: Received 401 from API.");
        throw new Error("Authentication failed during delete.");
      }
      // Try to parse error body even if not 401, in case of other server errors
      try {
        const errorData = await response.json();
        console.error(
          "Failed to delete city:",
          response.status,
          errorData.message
        );
        throw new Error(
          errorData.message || `Error deleting city: ${response.status}`
        );
      } catch (jsonError) {
        console.error(
          "Failed to delete city (could not parse error body):",
          response.status,
          response.statusText
        );
        throw new Error(
          `Error deleting city: ${response.status} ${response.statusText}`
        );
      }
    }

    console.log("City successfully deleted from favorites");

    // Refetch cities after successful delete
    // Assuming getFavoriteCities also correctly fetches and is imported
    const updatedCities = await getFavoriteCities();
    return updatedCities;
  } catch (error) {
    console.error(
      "Failed to delete city in handleDeleteFromFavorite:",
      error.message
    );
    throw error; // Re-throw the error
  }
}
