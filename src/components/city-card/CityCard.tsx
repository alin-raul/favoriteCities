"use client";

import React, { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import { MdOutlineDirections } from "react-icons/md";
import { MdOutlineDirectionsOff } from "react-icons/md";
import TransitionLink from "@/components/utils/TransitionLink";
import { Button } from "@/components/ui/button";
import Weather from "@/components/weather/Weather";
import { getWeatherData } from "@/lib/getWeather";
import type { WeatherData } from "@/lib/getWeather";
import type { Location } from "../map/Map";
import type { RouteResponse } from "../search/Search";

type CityProperties = {
  osm_type: string;
  osm_id: number;
  extent: number[];
  country: string;
  osm_key: string;
  city: string;
  countrycode: string;
  osm_value: string;
  name: string;
  county?: string;
  type: string;
};

type CityGeometry = {
  coordinates: number[];
  type: string;
};

type City = {
  geometry: CityGeometry;
  properties: CityProperties;
  type: string;
  image?: string;
};

type OnRoute = {
  routeStatus: boolean;
  route: { from: Location; to: Location };
};

type CityCardProps = {
  selectedCity: City;
  onClose: () => void;
  endRoute: () => void;
  onRoute: OnRoute;
  setOnRoute: (onRoute: OnRoute) => void;
  routeData: RouteResponse;
};

const CityCard: React.FC<CityCardProps> = ({
  selectedCity,
  onClose,
  endRoute,
  onRoute,
  setOnRoute,
  routeData,
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [pathSummery, setPathSummery] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!selectedCity) return;
      const weather = await getWeatherData(selectedCity);
      setWeatherData(weather);
    };
    fetchWeatherData();
  }, [selectedCity]);

  useEffect(() => {
    if (!routeData) setPathSummery(null);
    if (routeData && routeData.routes && routeData.routes[0]?.summary) {
      const { distance, duration } = routeData.routes[0].summary;

      if (typeof distance === "number" && typeof duration === "number") {
        const distanceInKm = (distance / 1000).toFixed(2);
        const durationInHours = (duration / 3600).toFixed(2);

        setPathSummery({
          distance: parseFloat(distanceInKm),
          duration: parseFloat(durationInHours),
        });
      } else {
        console.warn("Invalid route summary:", routeData.routes[0].summary);
      }
    }
  }, [routeData]);

  return (
    <div className="w-full md:px-4">
      <TransitionLink
        href={`/cities/${selectedCity.properties.name}`}
        className="w-full h-fit p-4 border md:rounded-2xl shadow-inner mb-2 flex flex-col justify-between bg-dynamic bg-dynamic-h backdrop-blur-md md:backdrop-blur-none hover:shadow-md active:brightness-125 transition-all"
      >
        <div>
          <div className="w-full flex justify-end">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
                setOnRoute({
                  routeStatus: false,
                  route: {
                    from: { lon: 0, lat: 0 },
                    to: { lon: 0, lat: 0 },
                  },
                });
              }}
              className="opacity-60 hover:opacity-100"
              aria-label="Close city card"
            >
              <FaXmark size={16} />
            </button>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col justify-center">
              <span className="text-2xl font-semibold">
                {selectedCity.properties.name}
              </span>
              <p className="text-sm opacity-50">
                {selectedCity.properties.country},{" "}
                {selectedCity.properties.countrycode}
              </p>
            </div>

            <div className="mt-auto">
              {weatherData !== null ? (
                <Weather weatherData={weatherData} tiny={true} />
              ) : (
                <p className="text-sm opacity-50">Loading weather...</p>
              )}
            </div>
          </div>
          <div>
            {!onRoute.routeStatus ? (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOnRoute({
                    routeStatus: true,
                    route: {
                      from: {} as Location,
                      to: {
                        lon: selectedCity.geometry.coordinates[0],
                        lat: selectedCity.geometry.coordinates[1],
                      },
                    },
                  });
                }}
                className="mt-4 rounded-3xl z-30"
              >
                <MdOutlineDirections size={24} />
                <span>Directions</span>
              </Button>
            ) : (
              <div className="">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    endRoute();
                  }}
                  className="mt-4 rounded-3xl z-30"
                >
                  <MdOutlineDirectionsOff /> Stop drive
                </Button>
                <div>
                  {pathSummery ? (
                    <div className="contrast flex justify-between py-1 px-3 rounded-[3rem] text-xl mt-4  ">
                      <span>{`${pathSummery.distance} km`}</span>
                      <span>{`${pathSummery.duration} h`}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </TransitionLink>
    </div>
  );
};

export default CityCard;
