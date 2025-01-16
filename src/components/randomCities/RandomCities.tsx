"use client";

import React, { useState, useEffect } from "react";
import { RANDOM_CITIES } from "@/globals/constants";
import Carousel from "../carousel/carousel";

type City = {
  name: string;
  image: string;
  country: string;
  lat: number;
  lon: number;
};

const RandomCities: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);

  const getRandomCities = (): City[] => {
    const shuffled = RANDOM_CITIES.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 7);
  };

  useEffect(() => {
    const randomCities = getRandomCities();
    setCities(randomCities);
  }, []);

  return <Carousel cities={cities} />;
};

export default RandomCities;
