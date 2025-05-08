"use server";

type User = {
  id: number;
  username: string;
  email: string;
  password: string | null;
  createdAt: string;
  githubId: string | null;
};

type Geometry = {
  coordinates: number[];
};

export type City = {
  id: number;
  name: string;
  country: string;
  countrycode: string;
  county: string;
  osm_type: string;
  osm_id: number;
  osm_key: string;
  osm_value: string;
  extent: number[];
  geometry: Geometry;
  selected: boolean;
  image: string;
  users: User[];
};

import { auth } from "@clerk/nextjs/server";

export async function getFavoriteCities(): Promise<City[] | []> {
  // Get Clerk user ID - Check authentication state
  const { userId: clerkUserId, getToken } = await auth(); // <--- Use auth() here

  const sessionToken = await getToken();

  // If user is not logged in, return an empty array immediately
  if (!clerkUserId || !sessionToken) {
    console.log("getFavoriteCities: User not logged in, returning empty list.");
    return [];
  }

  console.log(
    `getFavoriteCities: User ${clerkUserId} is logged in. Fetching favorite cities.`
  );

  try {
    // Use the absolute URL for the API call
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error("getFavoriteCities: NEXT_PUBLIC_BASE_URL env var not set.");
      // Decide error handling - throw or return empty?
      throw new Error("Application base URL is not configured.");
    }
    const apiUrl = `${baseUrl}/api/cities`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${sessionToken}`, // <--- Pass the session token
      },
    });

    if (!response.ok) {
      const errorBody = await response
        .text()
        .catch(() => "N/A (could not read error body)");
      console.error(
        `getFavoriteCities: API returned error from ${apiUrl}: Status ${response.status}, Body: ${errorBody}`
      );
      // Throw an error with status information
      // Check for 401 specifically if helpful, though API should handle that with auth()
      if (response.status === 401) {
        throw new Error("Authentication failed while fetching cities.");
      }
      throw new Error(
        `Failed to fetch cities from ${apiUrl}: Status ${response.status}`
      );
    }

    const data = await response.json();

    // Assuming your API returns { success: boolean, data: City[] | [] }
    if (data && typeof data.success === "boolean") {
      if (data.success && Array.isArray(data.data)) {
        console.log(
          `getFavoriteCities: Successfully fetched ${data.data.length} favorite cities.`
        );
        return data.data; // Return the array of cities
      } else if (!data.success) {
        // API returned success: false with a message
        console.error(
          "getFavoriteCities: API returned success: false:",
          data.message
        );
        throw new Error(`API reported failure: ${data.message}`);
      }
    }

    console.error("getFavoriteCities: Unexpected API response format:", data);
    throw new Error("Unexpected data format received from cities API");
  } catch (error: any) {
    console.error("Caught exception in getFavoriteCities:", error);
    // Re-throw the error so the caller can handle it (or return empty array as before)
    // Decide on fallback strategy: returning empty array vs letting error propagate
    // return []; // Return empty array on error as fallback
    throw error; // Let the calling page handle the error state
  }
}
