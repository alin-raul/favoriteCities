"use server";

type User = {
  id: number;
  username: string;
  email: string;
  password: string | null;
  createdAt: string;
  githubId: string | null;
};

type Geometry = {
  coordinates: number[];
};

export type City = {
  id: number;
  name: string;
  country: string;
  countrycode: string;
  county: string;
  osm_type: string;
  osm_id: number;
  osm_key: string;
  osm_value: string;
  extent: number[];
  geometry: Geometry;
  selected: boolean;
  image: string;
  users: User[];
};

import { headers } from "next/headers";

export async function getFavoriteCities(): Promise<City[] | []> {
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

    const cities = await response.json();

    return cities.data;
  } catch (error) {
    console.error("Failed to fetch cities:", error.message);
    return [];
  }
}
