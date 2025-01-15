"use server";

type Feature = {
  geometry: {
    coordinates: [number, number];
    type: "Point";
  };
  type: "Feature";
  properties: {
    osm_id: number;
    extent: [number, number, number, number];
    country: string;
    city: string;
    countrycode: string;
    postcode: string;
    type: string;
    osm_type: string;
    osm_key: string;
    housenumber: string;
    street: string;
    district: string;
    osm_value: string;
    name: string;
  };
};

type FeaturesResponse = Feature[];

export default async function searchCity(
  searchQuery: string
): Promise<FeaturesResponse> {
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
