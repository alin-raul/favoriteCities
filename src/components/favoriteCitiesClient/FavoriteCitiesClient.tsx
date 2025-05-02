// src/components/favoriteCitiesClient/FavoriteCitiesClient.tsx
"use client";

import React from "react";
import { useTheme } from "next-themes";
import TransitionLink from "../utils/TransitionLink";
import Image from "next/image";
import type { City } from "@/lib/getFavoriteCities"; // Assuming City type is defined correctly
import { GiModernCity } from "react-icons/gi";

type FavoriteCitiesClientProps = {
  initialCities: City[];
};

const FavoriteCitiesClient: React.FC<FavoriteCitiesClientProps> = ({
  initialCities,
}) => {
  const { theme, resolvedTheme } = useTheme();

  // Use initialCities prop directly, no need for useState or useEffect for initial data
  const cities = initialCities;

  const systemThemeImageCover =
    resolvedTheme === "dark"
      ? "/images/illustrations/navigation-94.svg"
      : "/images/illustrations/navigation-94-light.svg";

  const citiesWithImages = cities.filter((city) => city.image);
  const citiesWithoutImages = cities.filter((city) => !city.image);

  return (
    <>
      {/* Loading state is handled by Suspense or parent ErrorBoundary if fetching in Server Component */}
      {/* If you still need a loading state for *other* dynamic actions in this component, implement separately */}

      {cities.length > 0 ? (
        <div>
          <div className="lg:flex flex-col items-center justify-center text-center mb-8 mx-auto hidden">
            <h2 className="font-bold text-5xl xl:text-7xl 2xl:text-8xl mx-auto mb-4 font-serif">
              View your saved destinations!
            </h2>
            <p className="text-xl font-light opacity-80 max-w-2xl">
              The &quot;Favorite Cities&quot; feature allows you to save cities
              you love or wish to visit. You can create your personal list,
              making it easier to keep track of the cities that interest you the
              most.
            </p>
          </div>

          <div className="flex gap-8 overflow-x-scroll">
            <div className="flex gap-4 overflow-x-auto w-full max-w-screen-3xl p-4">
              {citiesWithImages.map((city, index) => (
                <div key={index}>
                  <TransitionLink href={`/cities/${city.name}`}>
                    <div className="p-4 border dynamic-border rounded-[3rem] shadow-inner flex flex-col justify-between bg-dynamic bg-dynamic-h hover:shadow-md active:shadow-lg transition-all group">
                      <div className="relative w-80 h-96 border rounded-[2rem] overflow-crop">
                        <div className="relative w-full h-full">
                          <Image
                            src={city.image!} // Use non-null assertion if filtering ensures image exists
                            alt={`${city.name} image`}
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "100%",
                            }}
                            width={320}
                            height={400}
                            className="rounded-[2rem] saturate-50 group-hover:saturate-100 group-hover:scale-100 transition-all ease-in-out"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col justify-center pl-2 h-24">
                        <h3 className="text-2xl font-semibold">{city.name}</h3>
                        <p className="text-sm opacity-50">
                          {city.country}, {city.countrycode}
                        </p>
                      </div>
                    </div>
                  </TransitionLink>
                </div>
              ))}
              {citiesWithoutImages.length > 0 && (
                <div className="grid grid-cols-2 auto-cols-fr auto-rows-1fr gap-2 min-w-96 max-h-[514px] overflow-y-auto pr-4">
                  {citiesWithoutImages.map((city, index) => (
                    <div key={index}>
                      <TransitionLink href={`/cities/${city.name}`}>
                        <div className="flex flex-col justify-center items-center h-[253px] w-full p-4 border dynamic-border rounded-[3rem] shadow-inner bg-dynamic-h transition-all text-center m-auto bg-dynamic relative">
                          <GiModernCity className="w-10 h-10 mx-auto mb-2" />
                          <h3 className="text-xl font-semibold">{city.name}</h3>
                          <p className="text-sm opacity-50">
                            {city.country}, {city.countrycode}
                          </p>
                        </div>
                      </TransitionLink>
                    </div>
                  ))}
                </div>
              )}
              {cities.length > 0 && citiesWithImages.length < 4 && (
                <div className="flex flex-col justify-center items-center bg-dynamic h-[515px] min-w-[200px] w-auto flex-grow border rounded-[3rem] transition-all">
                  <div className="flex justify-center items-center h-full w-full relative">
                    <p className="mt-4 opacity-70 text-center md:text-lg px-2">
                      Great. You can add other now!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center bg-dynamic max-h-[512px] max-w-screen-lg w-full mx-auto flex-grow lg:p-8 border rounded-[4rem] relative overflow-hidden">
          <div className="mb-8 max-w-md hidden lg:block">
            <h2 className="text-6xl font-bold mb-4 relative font-serif">
              Explore Your Favorite Cities!
            </h2>
            <p className="text-2xl font-light opacity-80 text-justify mr-5">
              Keep track of the places you love or dream of visiting with our
              &quot;Favorite Cities&quot; feature. Create a personalized list of
              destinations and easily revisit them anytime, helping you plan
              your travels or simply celebrate the cities that inspire you most.
            </p>
          </div>
          <div className="relative">
            <Image
              src={systemThemeImageCover}
              alt="Navigation"
              width={600}
              height={700}
              style={{
                objectFit: "cover",
                width: "full",
                height: "full",
                right: 0,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FavoriteCitiesClient;
