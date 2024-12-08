"use server";

export default async function searchCity(searchQuery) {
  try {
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(
        searchQuery
      )}&lang=en`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error("Failed to fetch locations:", error);
  }
}
