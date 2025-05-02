"use server";

import { middleOfRo } from "@/globals/constants";
import type { Location } from "@/components/map/Map";

// Define a simple interface for the expected successful response structure
interface LocationApiResponse {
  lon: number;
  lat: number;
}

export async function getLocation(): Promise<Location> {
  // No longer using process.env.NEXT_PUBLIC_BASE_URL here
  // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    // Use relative path - Next.js handles internal server-to-server fetch correctly
    const apiUrl = "/api/location"; // Simplified URL construction
    // Consider adding cache: 'no-store' if you need real-time location on every request
    const response = await fetch(apiUrl, { cache: "no-store" });

    if (!response.ok) {
      // Attempt to read response body for more detailed error info
      const errorBody = await response
        .text()
        .catch(() => "N/A (could not read body)");
      console.error(
        `Error fetching location from ${apiUrl}: Status ${response.status}, Body: ${errorBody}`
      );

      // Throw a specific error based on the status
      if (response.status === 404) {
        throw new Error(`Location API route not found (404)`);
      } else if (response.status === 401) {
        throw new Error(`Location API authentication failed (401)`);
      }
      // Default error for other non-OK statuses
      throw new Error(
        `Failed to fetch location from your server: ${response.status}`
      );
    }

    const json: LocationApiResponse = await response.json();

    // Validate the expected structure and types
    if (typeof json.lon === "number" && typeof json.lat === "number") {
      // Optional: Log successful fetch for clarity in logs
      // console.log("Successfully fetched location:", json);
      return { lon: json.lon, lat: json.lat }; // Ensure consistent return type
    } else {
      // Log the received invalid data structure
      console.error(`Invalid location data structure from ${apiUrl}:`, json);
      throw new Error("Invalid location data received from server");
    }
  } catch (error) {
    // Catch any errors during the fetch, parsing, or validation
    console.error("Caught exception while fetching location:", error);
    // The function will proceed to return the fallback
  }

  // Return fallback location if any error was caught
  console.log("Returning fallback location:", middleOfRo);
  return middleOfRo;
}
