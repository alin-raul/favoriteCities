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

    const features = data.features as Feature[];

    const filteredFeatures = features.filter((feature: Feature) => {
      const { osm_type, type } = feature.properties;

      const isCityType =
        type === "city" || type === "town" || type === "village";
      const isNotRegionOrCountry = osm_type !== "relation";

      return isCityType && isNotRegionOrCountry;
    });

    const uniqueFeatures = Array.from(
      new Map(
        filteredFeatures.map((feature) => [feature.properties.osm_id, feature])
      ).values()
    );

    return uniqueFeatures || [];
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return [];
  }
}
