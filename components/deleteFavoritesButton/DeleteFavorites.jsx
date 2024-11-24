"use client";

import { React, useTransition } from "react";
import { Button } from "../ui/button";
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

  return <Button onClick={handleClick}>{label || "Delete"}</Button>;
};

export default DeleteFavorite;
