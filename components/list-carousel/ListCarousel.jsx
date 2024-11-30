"use client";

import { motion } from "framer-motion";

const InfiniteCarousel = () => {
  const items = [
    "React",
    "Next.js",
    "SQLite",
    "TypeORM",
    "Authentication (Auth)",
    "Node.js APIs",
    "Geolocation APIs",
    "Weather APIs",
  ];

  return (
    <div className="overflow-hidden relative w-full h-36">
      <motion.ul
        className="absolute flex list-inside text-lg opacity-80"
        style={{ width: "100vw" }} // Ensure the list spans the full width of the viewport
        animate={{
          x: ["100%", "-100%"], // Move the list from 100% to -100% (off-screen)
        }}
        transition={{
          repeat: Infinity, // Loop the animation infinitely
          duration: 10, // Duration of one full cycle
          ease: "linear", // Smooth continuous motion
        }}
      >
        {items.map((item, index) => (
          <motion.li
            key={index}
            className="flex justify-center items-center bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md"
            initial={{ x: "100%" }} // Start with each item off-screen
            animate={{ x: "-100%" }} // Animate each item to the left off-screen
            transition={{
              delay: index * 0.5, // Delay each item to start after a small interval
              duration: 10, // Each item takes 10 seconds to move across the screen
              ease: "linear", // Smooth continuous motion
            }}
            style={{
              flexShrink: 0, // Prevent shrinking, maintain equal size for each item
              width: "100vw", // Ensure each item spans the full width of the viewport
            }}
          >
            {item}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default InfiniteCarousel;
