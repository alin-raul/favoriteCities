"use client";

import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { Input } from "../ui/input";
import { RANDOM_CITIES } from "@/globals/constants";

const waitForMs = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function typeSentence(sentence, setQuery, delay = 100) {
  const letters = sentence.split("");
  let currentText = "";

  for (let i = 0; i < letters.length; i++) {
    await waitForMs(delay);
    currentText += letters[i];
    setQuery(currentText + "|"); // Cursor appears at the end of the typed text
  }

  setQuery(currentText + "|"); // Ensure the cursor remains at the end after typing is complete
}

async function deleteSentence(setQuery, delay = 100) {
  while (true) {
    await waitForMs(delay);
    let shouldBreak = false;
    setQuery((prev) => {
      if (prev.length <= 1) {
        // Only cursor "|" is left
        shouldBreak = true;
        return "|"; // Show only the cursor when the string is empty
      }
      const updatedText = prev.slice(0, -2); // Remove last character, keep the cursor "|"
      return updatedText + "|"; // Add the cursor at the end
    });
    if (shouldBreak) break;
  }
}

const SearchBar = ({ width, height }) => {
  const [query, setQuery] = useState("|"); // Start with only the cursor visible

  useEffect(() => {
    let isMounted = true;
    async function runCityTyping() {
      let i = 0;
      while (isMounted) {
        // Start with the cursor visible
        setQuery("|");
        await waitForMs(500);

        // Type the sentence with the cursor visible at the end
        await typeSentence(RANDOM_CITIES[i], (currentText) =>
          setQuery(currentText)
        );

        // Blink the cursor at the end of the query
        let cursorVisible = true;
        const cursorBlinkInterval = setInterval(() => {
          if (cursorVisible) {
            setQuery(RANDOM_CITIES[i] + "|");
          } else {
            setQuery(RANDOM_CITIES[i] + " "); // Space to maintain alignment
          }
          cursorVisible = !cursorVisible;
        }, 500);

        await waitForMs(3000);
        clearInterval(cursorBlinkInterval);

        // Delete the sentence but keep the cursor visible
        await deleteSentence(setQuery);

        await waitForMs(500);

        i++;
        if (i >= RANDOM_CITIES.length) i = 0;
      }
    }

    runCityTyping();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div className="relative">
        <IoMdSearch
          className="absolute left-6 top-1/2 transform -translate-y-1/2 w-10 h-10 opacity-80 z-10"
          aria-hidden="true"
        />
        <Input
          type="text"
          id="search"
          placeholder=""
          className={`bg-dynamic rounded-full pl-20 pr-10 shadow-md font-medium opacity-90 text-3xl pointer-events-none ${width} ${height}`}
          value={query}
          readOnly
          aria-label="Search for a city"
        />
      </div>
    </div>
  );
};

export default SearchBar;
