"use client";

import React, { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import { MdOutlineDirections } from "react-icons/md";
import { MdOutlineDirectionsOff } from "react-icons/md";
import TransitionLink from "@/components/utils/TransitionLink";
import { Button } from "@/components/ui/button";
import Weather from "@/components/weather/Weather";
import { getWeatherData } from "@/lib/getWeather";

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

type WeatherUnits = {
  time: string;
  interval: string;
  temperature: string;
  windspeed: string;
  winddirection: string;
  is_day: string;
  weathercode: string;
};

type CurrentWeather = {
  time: string;
  interval: number;
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
};

type HourlyUnits = {
  time: string;
  temperature_2m: string;
  precipitation: string;
  windspeed_10m: string;
};

type HourlyData = {
  time: string[];
  temperature_2m: number[];
  precipitation: number[];
  windspeed_10m: number[];
};

type DailyUnits = {
  time: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  precipitation_sum: string;
};

type DailyData = {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
};

type WeatherData = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather_units: WeatherUnits;
  current_weather: CurrentWeather;
  hourly_units: HourlyUnits;
  hourly: HourlyData;
  daily_units: DailyUnits;
  daily: DailyData;
};

type Location = {
  lon: number;
  lat: number;
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
};

const CityCard: React.FC<CityCardProps> = ({
  selectedCity,
  onClose,
  endRoute,
  onRoute,
  setOnRoute,
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!selectedCity) return;
      const weather = await getWeatherData(selectedCity);
      setWeatherData(weather);
    };
    fetchWeatherData();
  }, [selectedCity]);

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
          <div className="">
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
            )}
          </div>
        </div>
      </TransitionLink>
    </div>
  );
};

export default CityCard;
