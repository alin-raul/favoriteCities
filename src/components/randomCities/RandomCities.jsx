"use client";

import React, { useState, useEffect } from "react";
import { RANDOM_CITIES } from "@/globals/constants";
import Carousel from "../carousel/carousel";
import Wrapper from "../pageWrapper/wrapper";

const RandomCities = () => {
  const [cities, setCities] = useState([]);

  const getRandomCities = () => {
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
