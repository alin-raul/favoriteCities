"use server";

import { getServerSession } from "next-auth";
import { getFavoriteCities } from "./getFavoriteCities";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function handleDeleteFromFavorite(id) {
  try {
    // Get the session server-side
    const session = await getServerSession(options); // Ensure you're passing the right options here

    console.log(session);

    if (!session || !session.user) {
      console.error("User not authenticated.");
      return;
    }

    // Fetch request headers with the session token
    const requestHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.id}`, // Assuming session contains the user ID
    };

    // Send the DELETE request to the API, passing headers
    const response = await fetch("http://localhost:3000/api/cities", {
      method: "DELETE",
      headers: requestHeaders,
      body: JSON.stringify({ osm_id: id }), // Pass osm_id as part of the body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error deleting city: ${errorData.message}`);
    }

    console.log("City successfully deleted from favorites");

    const updatedCities = await getFavoriteCities();
    return updatedCities;
  } catch (error) {
    console.error("Failed to delete city:", error.message);
  }
}
