import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Carousel = ({ cities, currentIndex }) => {
  return (
    <div className="relative justify-center items-center w-full h-full overflow-hidden lg:flex px-2 lg:flex-row">
      <AnimatePresence>
        {cities.map((city, index) => {
          const offset = (index - currentIndex) * 110;
          const isSelected = currentIndex === index;

          return (
            <motion.div
              key={index}
              className="absolute flex justify-center items-center lg:shadow-lg lg:border lg:rounded-xl w-40 min-h-32"
              initial={{
                opacity: 0,
                y: "100%",
              }}
              animate={{
                opacity: isSelected ? 1 : 0.2,
                y: `${offset}%`,
              }}
              exit={{
                opacity: 0,
                y: "-100%",
              }}
              transition={{
                duration: 1,
                opacity: { duration: 1 },
                y: { duration: 1 },
              }}
            >
              <div className="p-4 rounded-lg ">
                <h3 className="text-lg font-semibold">
                  {city.properties.name}
                </h3>
                <p className="text-sm opacity-50">
                  Country: {city.properties.country}
                </p>
                <p className="text-sm opacity-50">
                  Type: {city.properties.osm_value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Carousel;
