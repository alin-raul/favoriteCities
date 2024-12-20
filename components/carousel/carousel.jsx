"use client";

import { motion, AnimatePresence } from "framer-motion";

const Carousel = ({ cities, currentIndex }) => {
  return (
    <div className="relative justify-center items-center min-w-40 h-full lg:flex lg:px-2 lg:flex-row p-2">
      <AnimatePresence>
        {cities.map((city, index) => {
          const isLargeScreen =
            typeof window !== "undefined" &&
            window.matchMedia("(min-width: 1024px)").matches;
          const offset = (index - currentIndex) * (isLargeScreen ? 120 : 160);
          const isSelected = currentIndex === index;

          return (
            <motion.div
              key={index}
              className={`absolute bg-dynamic flex min-w-40 items-center border rounded-xl h-32 animate-out ${
                isSelected ? "lg:shadow-md" : "lg:shadow-inner"
              }`}
              initial={{
                opacity: 0,
                x: isLargeScreen ? 0 : 100,
                y: isLargeScreen ? 100 : 0,
                zIndex: 0,
              }}
              animate={{
                opacity: isSelected ? 1 : 0.2,
                x: isLargeScreen ? 0 : offset,
                y: isLargeScreen ? offset : 0,
                scale: isSelected ? 1 : 0.9,
                zIndex: 1,
              }}
              exit={{
                opacity: 0,
                x: isLargeScreen ? 0 : -100,
                y: isLargeScreen ? -100 : 0,
                zIndex: 0,
              }}
              transition={{
                duration: 1,
                opacity: { duration: 1 },
                x: { duration: 1 },
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
