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

import { headers } from "next/headers";

export async function getFavoriteCities(): Promise<City[] | []> {
  try {
    console.log(
      "Fetching favorite cities from:",
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cities`
    );
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cities`,
      {
        method: "GET",
        headers: await headers(),
        // Consider adding a revalidate tag or setting cache control if needed
        // next: { tags: ['favorite-cities'] }
      }
    );

    if (!response.ok) {
      // Try to read the response body for more details if available
      const errorBody = await response
        .text()
        .catch(() => "N/A (could not read error body)");
      console.error(
        `Failed to fetch cities: Status ${response.status}, Body: ${errorBody}`
      );
      // Throw an error with status information
      throw new Error(`Error fetching cities: Status ${response.status}`);
    }

    const data = await response.json(); // Assuming the response structure is { success: boolean, data: City[] }

    // Basic validation of the expected data format
    if (data && Array.isArray(data.data)) {
      console.log(`Successfully fetched ${data.data.length} favorite cities.`);
      return data.data;
    } else {
      console.error(
        "Failed to fetch cities: Invalid response data format",
        data
      );
      // Throw an error if the data format is unexpected
      throw new Error("Invalid data format received from cities API");
    }
  } catch (error: any) {
    // Log the full error object for better debugging
    console.error("Caught exception while fetching cities:", error);
    // Return an empty array as a graceful fallback
    return [];
  }
}
