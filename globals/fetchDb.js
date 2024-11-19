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
    console.log("Cities fetched successfully");
    return data;
  } catch (error) {
    console.error("Failed to fetch cities:", error.message);
    return null;
  }
}

export async function handlePostFavorite(city) {
  if (!city || !city.properties) {
    console.error("Invalid city data for POST operation");
    return;
  }

  try {
    const response = await fetch("/api/cities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        osm_id: city.properties.osm_id,
        name: city.properties.name,
        country: city.properties.country,
        countrycode: city.properties.countrycode,
        county: city.properties.county,
        osm_type: city.properties.osm_type,
        osm_key: city.properties.osm_key,
        osm_value: city.properties.osm_value,
        extent: city.properties.extent,
        geometry: city.geometry,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error creating city: ${errorData.message}`);
    }

    console.log("City successfully added to favorites");

    return await getFavoriteCities();
  } catch (error) {
    console.error("Failed to create city:", error.message);
  }
}

export async function handleDelete(id) {
  try {
    const response = await fetch("/api/cities", {
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
