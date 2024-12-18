"use client";

import { motion, AnimatePresence } from "framer-motion";

const Carousel = ({ cities, currentIndex }) => {
  return (
    <div className="relative justify-center items-center w-full h-full lg:flex lg:px-2 lg:flex-row">
      <AnimatePresence>
        {cities.map((city, index) => {
          const offset = (index - currentIndex) * 120; // Numeric value
          const isSelected = currentIndex === index;

          return (
            <motion.div
              key={index}
              className={`absolute bg-dynamic flex min-w-40 w-full h-full items-center lg:border lg:rounded-xl lg:w-40 lg:h-32 animate-out  ${
                isSelected ? "lg:shadow-md" : "lg:shadow-inner"
              }`}
              initial={{
                opacity: 0,
                y: 100, // Changed from "100%" to 100
              }}
              animate={{
                opacity: isSelected ? 1 : 0.2,
                y: offset, // Numeric value
                scale: isSelected ? 1 : 0.9,
              }}
              exit={{
                opacity: 0,
                y: -100, // Changed from "-100%" to -100
              }}
              transition={{
                duration: 1,
                opacity: { duration: 1 },
                y: { duration: 1 },
              }}
            >
              <div className="flex flex-col p-4 rounded-lg">
                <span className="text-lg font-semibold">
                  {city.properties.name}
                </span>
                <span className="text-sm opacity-50">
                  {city.properties.country}
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Carousel;
