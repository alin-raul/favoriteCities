"use client";

import * as React from "react";
import { useTransition } from "react";
import { handleDeleteFromFavorite } from "@/lib/handleDeleteFavorite";

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

type City = {
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

type DeleteFavoriteProps = {
  label?: string;
  city: City;
};

const DeleteFavorite = ({ label, city }: DeleteFavoriteProps) => {
  const [isPending, startTransition] = useTransition();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await handleDeleteFromFavorite(city.osm_id);

      startTransition(() => {
        window.location.reload();
      });
      console.log(`Successfully deleted favorite with id: ${city.id}`);
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-dynamic-secondary z-30 rounded-2xl bg-dynamic p-3 border dynamic-border hover:bg-white/20  hover:drop-shadow-lg"
    >
      {label || "Delete"}
    </button>
  );
};

export default DeleteFavorite;
