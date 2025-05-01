"use server";

import { middleOfRo } from "@/globals/constants";
import type { Location } from "@/components/map/Map";

export async function getLocation(): Promise<Location> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const apiUrl = new URL("/api/location", baseUrl);
    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error(
        `Failed to fetch location from your server: ${response.status}`
      );
    }

    const json = await response.json();

    if (typeof json.lon === "number" && typeof json.lat === "number") {
      return json;
    } else {
      throw new Error("Invalid location data received from server");
    }
  } catch (error) {
    console.log("Error fetching location:", error);
  }

  return middleOfRo;
}
