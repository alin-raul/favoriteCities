"use server";

import { getFavoriteCities } from "./getFavoriteCities";

export async function handlePostFavorite(city) {
  if (!city || !city.properties) {
    console.error("Invalid city data for POST operation");
    return;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cities`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          image: city.image,
        }),
      }
    );

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
