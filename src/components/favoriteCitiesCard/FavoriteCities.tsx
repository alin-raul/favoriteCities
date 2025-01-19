"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { getFavoriteCities } from "@/lib/getFavoriteCities";
import TransitionLink from "../utils/TransitionLink";
import Image from "next/image";

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

const FavoriteCities: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { theme, resolvedTheme } = useTheme();

  const systemThemeImageAddCards =
    resolvedTheme === "dark"
      ? "/images/illustrations/undraw_choose-card_es1o.svg"
      : "/images/illustrations/undraw_choose-card_es1o-light.svg";
  const systemThemeImageCover =
    resolvedTheme === "dark"
      ? "/images/illustrations/navigation-94.svg"
      : "/images/illustrations/navigation-94-light.svg";

  useEffect(() => {
    const fetchCities = async (): Promise<City[]> => {
      const citiesData = await getFavoriteCities();

      console.log(citiesData);

      if (!citiesData) {
        console.log("Error fetching data");
        setLoading(false);
        return;
      }

      setCities(citiesData);
      setLoading(false);
    };

    fetchCities();
  }, []);

  const citiesWithImages = cities.filter((city) => city.image);
  const citiesWithoutImages = cities.filter((city) => !city.image);

  return (
    <>
      {loading ? (
        <div className="flex gap-4 mb-2 w-full bg-dynamic lg:p-8 border rounded-[3rem]  m-auto min-h-96 pointer-events-none opacity-50">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              className="flex flex-col justify-center w-fit h-fit border rounded-[3rem] bg-dynamic bg-dynamic-h h transition-all m-auto p-4"
              key={index}
            >
              <div className="w-80 h-96 border relative rounded-[2rem] bg-gray-500/20"></div>
              <div className="flex flex-col justify-center h-24">
                <div className="text-lg font-semibold mb-2">
                  <Skeleton className="h-5 w-[140px]" />
                </div>
                <div className="text-sm opacity-50 mb-2">
                  <Skeleton className="h-4 w-[110px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : cities.length > 0 ? (
        <div>
          <div className="lg:flex flex-col items-center justify-center xl:max-w-screen-lg text-center mb-8 mx-auto hidden ">
            <h2 className="text-6xl font-bold mb-4 relative font-serif">
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
                  <TransitionLink href={`/cities/${city.name}`} className="">
                    <div className="p-4 border dynamic-border rounded-[3rem] shadow-inner flex flex-col justify-between bg-dynamic bg-dynamic-h hover:shadow-md active:shadow-lg transition-all group">
                      <div className="relative w-80 h-96 border rounded-[2rem] overflow-hidden">
                        <div className="relative w-full h-full">
                          <Image
                            src={city.image}
                            alt={`${city.name} image`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-[2rem] saturate-50 group-hover:saturate-100 group-hover:scale-100 transition-all ease-in-out "
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
                      <TransitionLink
                        href={`/cities/${city.name}`}
                        className="h-fit"
                      >
                        <div className="flex flex-col justify-center h-[253px] w-full p-4 border dynamic-border rounded-[3rem] shadow-inner bg-dynamic bg-dynamic-h transition-all text-center m-auto">
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
                <div className="flex flex-col justify-center items-center bg-dynamic h-[515px] min-w-[200px] w-auto flex-grow border rounded-[3rem] transition-all overflow-hidden">
                  <div className="translate-y-[30%] h-full w-full relative">
                    <div className="">
                      <p className="text-center text-2xl -translate-y-16 opacity-70">
                        Great. You can add other now!
                      </p>
                      <Image
                        src={
                          theme === "system"
                            ? systemThemeImageAddCards
                            : theme === "dark"
                            ? "/images/illustrations/undraw_choose-card_es1o.svg"
                            : "/images/illustrations/undraw_choose-card_es1o-light.svg"
                        }
                        alt="cards"
                        layout="fill"
                        style={{
                          objectFit: "cover",
                          objectPosition: "top",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center bg-dynamic max-h-[512px] max-w-screen-lg w-full mx-auto flex-grow lg:p-8 border rounded-[4rem] relative overflow-hidden">
          <div className="mb-8 max-w-md hidden lg:block ">
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
              src={
                theme === "system"
                  ? systemThemeImageCover
                  : theme === "dark"
                  ? "/images/illustrations/navigation-94.svg"
                  : "/images/illustrations/navigation-94-light.svg"
              }
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

export default FavoriteCities;
