"use client";

import { TiStarFullOutline } from "react-icons/ti";
import React, { useState } from "react";
import { getFavoriteCities } from "@/lib/getFavoriteCities";
import { handleDeleteFromFavorite } from "@/lib/handleDeleteFavorite";
import type { City } from "@/lib/getFavoriteCities";
import { LocalCity } from "../local-cities/localCities";

type Geometry = {
  coordinates: number[];
};

type CityProperties = {
  osm_id: number;
  name: string;
  country: string;
  countrycode: string;
  county: string;
  osm_type: string;
  osm_key: string;
  osm_value: string;
  extent: number[];
};

// type CityWithProperties = {
//   properties: CityProperties;
//   geometry: Geometry;
//   image: string;
//   selected: boolean;
// };

type FavoriteButtonProps = {
  handleToggleFavorite: (osmId: number) => void;
  city: LocalCity;
  full?: boolean;
};

async function handlePostFavorite(
  city: LocalCity
): Promise<City[] | undefined> {
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
        image: city.image,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error creating city: ${errorData.message}`);
    }

    console.log("City successfully added to favorites");

    return await getFavoriteCities();
  } catch (error: any) {
    console.error("Failed to create city:", error.message);
  }
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  handleToggleFavorite,
  city,
  full = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (city.selected) {
        await handleDeleteFromFavorite(city.properties.osm_id);
        handleToggleFavorite(city.properties.osm_id);
      } else {
        await handlePostFavorite(city);
        handleToggleFavorite(city.properties.osm_id);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`flex justify-center items-center h-full ${
        full ? "h-full w-full" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleClick();
      }}
      disabled={isLoading}
    >
      {city.selected ? (
        <TiStarFullOutline className="h-6 w-6 fill-yellow-500 hover:fill-yellow-300 hover:drop-shadow-sm" />
      ) : (
        <TiStarFullOutline className="h-6 w-6 opacity-40 hover:opacity-80 hover:fill-yellow-400 hover:drop-shadow-sm" />
      )}
    </button>
  );
};

export default FavoriteButton;
