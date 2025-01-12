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

  return (
    <Wrapper className="flex flex-col justify-center relative">
      <div className="flex flex-col py-4 max-w-xl m-auto text-center xl:hidden">
        <h1 className="text-6xl font-bold mb-8 font-serif">Spin the Globe!</h1>
        <p className="text-xl font-light opacity-80 mb-8">
          Spun the globe and landed on these exciting cities. Explore them on
          the map and see where your curiosity takes you.
        </p>
      </div>
      <Carousel cities={cities} />
    </Wrapper>
  );
};

export default RandomCities;
