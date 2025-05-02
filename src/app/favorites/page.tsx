// src/app/favorites/page.tsx
import React from "react"; // Import React
import TransitionLink from "@/components/utils/TransitionLink";
import DeleteFavorite from "@/components/deleteFavoritesButton/DeleteFavorites";
import Wrapper from "@/components/pageWrapper/wrapper";
import { getFavoriteCities } from "@/lib/getFavoriteCities";
// import getFlagEmoji from "@/lib/getFlagEmoji"; // Not used
import Image from "next/image"; // Use next/image correctly if needed
import type { City } from "@/lib/getFavoriteCities"; // Assuming City type is defined correctly in getFavoriteCities or a shared type file
import { GiModernCity } from "react-icons/gi";

import ErrorBoundary from "@/components/ErrorBoundary"; // <-- Import ErrorBoundary
import FavoriteCitiesClient from "@/components/favoriteCitiesClient/FavoriteCitiesClient";

const FavoritesPage = async (): Promise<React.ReactNode> => {
  // Renamed to FavoritesPage for clarity
  let cities: City[] = [];
  let fetchError: string | null = null;

  try {
    cities = await getFavoriteCities();
  } catch (error: any) {
    console.error(
      "Error fetching cities in FavoritesPage Server Component:",
      error
    );
    fetchError =
      error.message || "An unknown error occurred while fetching cities.";
    // No need to throw here, ErrorBoundary will handle rendering errors or we display a message
  }

  return (
    <Wrapper>
      <div className="w-full flex flex-col justify-center items-center relative">
        <h1 className="text-2xl font-semibold mt-16 text-center">
          Your Favorite Cities
          <br />
          <span className="text-sm font-normal opacity-70">
            *loaded from database*
          </span>
        </h1>

        {/* Wrap the content that uses the fetched data with ErrorBoundary */}
        {/* Provide a fallback UI for the ErrorBoundary */}
        <ErrorBoundary
          fallback={
            <div className="p-4 border border-red-400 bg-red-100 text-red-700 rounded-md mt-32">
              <p>Could not display favorite cities due to an error.</p>
              {fetchError && (
                <p className="text-sm mt-2">Details: {fetchError}</p>
              )}
            </div>
          }
        >
          {/* You might want to pass the fetched cities to the client component */}
          {/* Or, keep the client component fetching approach if preferred, */}
          {/* but ensure the client component also handles loading/error states */}

          {/* Option 1: Pass cities fetched server-side (requires FavoriteCitiesClient to accept cities prop) */}
          {/* <FavoriteCitiesClient initialCities={cities} /> */}

          {/* Option 2: Keep client-side fetch in FavoriteCitiesClient, display message here if server fetch failed */}
          {fetchError ? (
            <div className="absolute top-0 h-screen-minus-nav flex items-center opacity-60 mt-32">
              <p>{fetchError}</p> {/* Display the error message */}
            </div>
          ) : cities.length === 0 ? ( // Check cities length only if server fetch succeeded without error
            <div className="absolute top-0 h-screen-minus-nav flex items-center opacity-60 mt-32">
              <p>No cities added yet.</p>
            </div>
          ) : (
            // Render your list here using the server-fetched 'cities'
            // This avoids the duplicate fetch in the client component's useEffect
            <div className="flex flex-col mt-32 w-full max-w-screen-2xl gap-4 justify-center items-center lg:grid lg:grid-cols-2 2xl:grid-cols-3 last:mb-4">
              {cities.map((city, index) => (
                <div
                  key={city.name + `-${index}`}
                  className="relative w-full h-full"
                >
                  <div className="absolute inset-0 w-full h-full z-10 rounded-[3rem]" />

                  {/* Ensure TransitionLink and other components handle potential undefined/null values gracefully */}
                  {/* For Image, use next/image and ensure 'alt' prop is always provided */}
                  <TransitionLink
                    href={`/cities/${city.name}`}
                    className="w-full h-full p-6 border dynamic-border rounded-[3rem] shadow-inner flex flex-col justify-between bg-dynamic bg-dynamic-h hover:shadow-md active:shadow-lg transition-all relative z-30"
                    card={true}
                  >
                    {city.image ? (
                      <Image
                        src={city.image}
                        alt={`${city.name} image`} // Added alt prop
                        width={600}
                        height={400}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                        className="rounded-[2rem] max-h-72 w-full mb-4 z-40"
                      />
                    ) : (
                      <div className="h-[288px] w-full flex justify-center items-center">
                        <GiModernCity className="w-14 h-14" />
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto z-50">
                      <div className="relative">
                        <h2 className="text-5xl font-semibold">{city.name}</h2>
                        <span className="opacity-80">
                          {city.country}, {city.countrycode}
                        </span>
                      </div>
                      <div>
                        {/* DeleteFavorite must be a Server Action or Client Component */}
                        {/* If Client Component, it needs to manage its state and likely trigger router.refresh() after delete */}
                        <DeleteFavorite label="Remove" city={city} />
                      </div>
                    </div>
                  </TransitionLink>
                </div>
              ))}
            </div>
          )}
        </ErrorBoundary>

        {/* If you kept the Client Component, decide if you still need it or replace it */}
        {/* <FavoriteCitiesClient /> */}
      </div>
    </Wrapper>
  );
};

export default FavoritesPage; // Export the Server Component
