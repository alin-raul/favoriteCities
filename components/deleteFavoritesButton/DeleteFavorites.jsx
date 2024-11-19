"use client";

import { React, useTransition } from "react";
import { Button } from "../ui/button";
import { handleDelete } from "@/globals/fetchDb";

const DeleteFavorite = ({ label, city }) => {
  const [isPending, startTransition] = useTransition();
  console.log(city);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await handleDelete(city.osm_id);

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
