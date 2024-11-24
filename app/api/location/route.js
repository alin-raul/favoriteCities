import { middleOfEU } from "@/globals/constants";

export async function getLocation() {
  try {
    const response = await fetch("http://ip-api.com/json/");
    const json = await response.json();
    if (typeof json.lat === "number" && typeof json.lon === "number") {
      return [json.lon, json.lat];
    }
  } catch (error) {
    console.error("Error fetching location:", error);
  }

  return middleOfEU;
}
