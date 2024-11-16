"use client";

import { TiStarFullOutline } from "react-icons/ti";
import { CiStar } from "react-icons/ci";

// handleToggleFavorite now sends a POST request
const FavoriteButton = ({ handleToggleFavorite, city }) => {
  // Define the handleToggleFavorite to send a POST request
  const handlePostFavorite = async (osm_id) => {
    try {
      const response = await fetch("/api/cities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Pass the necessary city data, assuming `osm_id` is the only key required for the toggle
          osm_id: osm_id,
          name: city.properties.name,
          country: city.properties.country,
          countrycode: city.properties.countrycode,
          county: city.properties.county,
          osm_type: city.properties.osm_type,
          osm_key: city.properties.osm_key,
          osm_value: city.properties.osm_value,
          extent: city.properties.extent,
          geometry: city.geometry, // Include geometry if needed
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("City created:", data); // Log or handle the response data as needed
        handleToggleFavorite(city.properties.osm_id);
      } else {
        console.error("Error creating city:", data.message);
      }
    } catch (error) {
      console.error("Failed to create city:", error);
    }
  };

  return (
    <div className="flex justify-end mt-4 ">
      <button
        className="group relative"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          console.log(city);
          // Call the POST request function when the button is clicked
          handlePostFavorite(city.properties.osm_id); // Trigger POST request with osm_id
        }}
      >
        {/* If selected, show the full star, and do not show hover */}
        {city.selected ? (
          <TiStarFullOutline className="h-6 w-6 absolute fill-yellow-500 bottom-0 right-0 group-hover:hidden" />
        ) : (
          // If not selected, show the empty star and allow hover to show the filled star
          <CiStar className="h-6 w-6 absolute bottom-0 right-0 group-hover:hidden" />
        )}

        {/* Show full star on hover only if the city is not selected */}
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
