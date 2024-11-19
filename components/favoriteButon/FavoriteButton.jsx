"use client";

import { TiStarFullOutline } from "react-icons/ti";
import { CiStar } from "react-icons/ci";
import { handlePostFavorite, handleDelete } from "@/globals/fetchDb";

import React, { useState } from "react";

const FavoriteButton = ({ handleToggleFavorite, city }) => {
  const [isLoading, setIsLoading] = useState(false);
  console.log(city);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (city.selected) {
        await handleDelete(city.properties.osm_id);
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
    <div className="flex justify-end mt-4">
      <button
        className="group relative h-6 w-6"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleClick();
        }}
        disabled={isLoading}
      >
        {city.selected ? (
          <TiStarFullOutline className="h-6 w-6 absolute fill-yellow-500 bottom-0 right-0 group-hover:hidden" />
        ) : (
          <CiStar className="h-6 w-6 absolute bottom-0 right-0 group-hover:hidden" />
        )}

        <TiStarFullOutline
          className={`h-6 w-6 absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
            city.selected ? "hidden" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default FavoriteButton;
