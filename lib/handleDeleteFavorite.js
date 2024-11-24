"use server";

export async function handleDeleteFromFavorite(id) {
  try {
    const response = await fetch("http://localhost:3000/api/cities", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ where: { osm_id: id } }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error deleting city: ${errorData.message}`);
    }

    console.log("City successfully deleted from favorites");
    const updatedCities = await getFavoriteCities();
    return updatedCities;
  } catch (error) {
    console.error("Failed to delete city:", error.message);
  }
}
