"use client";

import { React, useTransition } from "react";
import { handleDeleteFromFavorite } from "@/lib/handleDeleteFavorite";

const DeleteFavorite = ({ label, city }) => {
  const [isPending, startTransition] = useTransition();

  const handleClick = async (e) => {
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
