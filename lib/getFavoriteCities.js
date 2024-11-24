"use server";

export async function getFavoriteCities() {
  try {
    const response = await fetch("http://localhost:3000/api/cities", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
