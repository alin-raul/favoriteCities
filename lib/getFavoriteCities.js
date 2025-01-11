"use server";
import { headers } from "next/headers";

export async function getFavoriteCities() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cities`,
      {
        method: "GET",
        headers: await headers(),
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching cities: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch cities:", error.message);
    return null;
  }
}
