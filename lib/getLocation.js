import { middleOfRo } from "@/globals/constants";

export async function getLocation() {
  try {
    const response = await fetch("/api/location");

    if (!response.ok) {
      throw new Error(
        `Failed to fetch location from your server: ${response.status}`
      );
    }

    const json = await response.json();

    if (typeof json.lon === "number" && typeof json.lat === "number") {
      return [json.lon, json.lat];
    } else {
      throw new Error("Invalid location data received from server");
    }
  } catch (error) {
    console.log("Error fetching location:", error);
  }

  return middleOfRo;
}
