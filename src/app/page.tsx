// src/app/page.tsx
import React from "react"; // Import React

import Wrapper from "@/components/pageWrapper/wrapper";
import RandomCities from "@/components/randomCities/RandomCities";
import FavoriteCitiesClient from "@/components/favoriteCitiesClient/FavoriteCitiesClient";
import ListCarousel from "@/components/list-carousel/ListCarousel";
import SlidingTitle from "@/components/slidingTitle/SlidingTitle";
import CardinalRotating from "@/components/cardinal/CardinalRotating";
// import Minimap from "@/components/minimap/minimap"; // Commented out in JSX
// import LavaLampCanvas from "@/components/cardinal/LavaLampCanvas"; // Not used in JSX

import { getFavoriteCities } from "@/lib/getFavoriteCities"; // Import the data fetching function
import type { City } from "@/lib/getFavoriteCities"; // Import the City type

import ErrorBoundary from "@/components/ErrorBoundary"; // Import ErrorBoundary (assuming you created it)

// Make the component async to fetch data
const Home = async (): Promise<React.ReactNode> => {
  let cities: City[] = [];
  let fetchError: string | null = null;

  // Fetch data directly in the Server Component
  try {
    console.log("Fetching favorite cities for the root page...");
    cities = await getFavoriteCities();
    console.log(`Root page fetched ${cities.length} favorite cities.`);
  } catch (error: any) {
    console.error(
      "Error fetching cities in root page Server Component:",
      error
    );
    fetchError =
      error.message ||
      "An unknown error occurred while fetching favorite cities.";
    // Continue rendering the page, but indicate that fetch failed
    cities = []; // Ensure cities is an empty array on error
  }

  return (
    <div className="relative z-20">
      <div className="noise bg-[url('/images/other/noise.webp')] bg-repeat h-screen w-screen fixed top-0 left-0"></div>

      <div className="m-auto h-screen relative">
        <div className="flex justify-start absolute w-full z-[-1]">
          <CardinalRotating
            invert={false}
            position={"translate-x-[10%] scale-[8]"}
          />
        </div>
        <SlidingTitle />
      </div>

      {/* ... Minimap section commented out ... */}

      <div className="flex flex-col justify-center h-[1200px] gradient-bg-cities">
        <div className="flex flex-col py-4 mx-auto text-center">
          <h1 className="font-bold text-6xl md:text-8xl mx-auto mb-4 font-serif">
            Spin the Globe!
          </h1>
          <p className="text-lg md:max-w-3xl xl:max-w-5xl lg:text-xl xl:text-2xl font-light opacity-80 mb-8 max-w-xl">
            Spun the globe and landed on these exciting cities. Explore them on
            the map and see where your curiosity takes you.
          </p>
        </div>
        <div>
          {/* Assuming RandomCities fetches its own data or is a Client Component */}
          {/* If RandomCities is a Server Component fetching data, ensure it also handles errors */}
          <ErrorBoundary
            fallback={
              <div className="p-4 border border-red-400 bg-red-100 text-red-700 rounded-md my-4">
                <p>Could not load random cities.</p>
              </div>
            }
          >
            <RandomCities />
          </ErrorBoundary>
        </div>
      </div>

      <Wrapper>
        <section className="flex flex-col justify-center pb-4 xl:max-w-[1900px] m-auto">
          {/* ... Favorite Cities heading and text (keep or remove based on design) ... */}
          <div className="flex flex-col items-center justify-center xl:max-w-screen-lg text-center mb-8 lg:hidden">
            <h2 className="font-bold text-5xl xl:text-7xl 2xl:text-9xl mx-auto mb-4 font-serif">
              View your saved destinations!
            </h2>
            <p className="text-lg md:max-w-3xl xl:max-w-5xl lg:text-xl xl:text-2xl font-light opacity-80">
              The &quot;Favorite Cities&quot; feature allows you to save cities
              you love or wish to visit. You can create your personal list,
              making it easier to keep track of the cities that interest you the
              most.
            </p>
          </div>

          {/* Wrap FavoriteCitiesClient with ErrorBoundary and pass the fetched cities */}
          <ErrorBoundary
            fallback={
              <div className="p-4 border border-red-400 bg-red-100 text-red-700 rounded-md my-4">
                <p>Could not load favorite cities.</p>
                {fetchError && (
                  <p className="text-sm mt-2">Details: {fetchError}</p>
                )}
              </div>
            }
          >
            {/* Pass the cities fetched in this Server Component */}
            {/* Handle the case where fetchError occurred or cities is empty */}
            {!fetchError && cities.length > 0 ? (
              <FavoriteCitiesClient initialCities={cities} />
            ) : fetchError ? (
              <div className="text-center mt-8 opacity-60">
                <p>{fetchError}</p> {/* Display the error message */}
              </div>
            ) : (
              // cities.length === 0 && !fetchError
              <div className="text-center mt-8 opacity-60">
                <p>No cities added yet.</p>
              </div>
            )}
          </ErrorBoundary>
        </section>
      </Wrapper>

      <Wrapper>
        <section className="max-w-screen-2xl m-auto py-4 md:mt-40">
          <div className="mb-8 mb:mb-0">
            <h2 className="text-4xl font-semibold mb-4 opacity-90">
              About This Project
            </h2>
            <p className="text-lg font-semibold text-justify opacity-70">
              This project is the result of my participation in the
              <span className="font-bold"> Digital Nation</span> community and
              course — a nationwide initiative where members collaborate and
              support one another in a journey of continuous learning,
              self-improvement, and professional growth. This is an ongoing
              project where I continue to refine my skills in web development
              and design. Some features and designs are still a work in
              progress, but they reflect my growth and learning journey.
              Feedback and suggestions are always welcome!
            </p>
          </div>

          <h3 className="text-3xl font-medium mt-4 mb-2 opacity-90">
            Technologies Used
          </h3>
        </section>
      </Wrapper>
      <ListCarousel />

      <div className="hero"></div>
    </div>
  );
};

export default Home;
