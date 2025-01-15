"use client";

import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { Input } from "../ui/input";
import { RANDOM_CITIES } from "@/globals/constants";
import Link from "next/link";

const waitForMs = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function typeSentence(sentence, setQuery, delay = 100) {
  const letters = sentence.split("");
  let currentText = "";

  for (let i = 0; i < letters.length; i++) {
    await waitForMs(delay);
    currentText += letters[i];
    setQuery(currentText + "|");
  }

  setQuery(currentText + "|");
}

async function deleteSentence(setQuery, delay = 100) {
  while (true) {
    await waitForMs(delay);
    let shouldBreak = false;
    setQuery((prev) => {
      if (prev.length <= 1) {
        shouldBreak = true;
        return "|";
      }
      const updatedText = prev.slice(0, -2);
      return updatedText + "|";
    });
    if (shouldBreak) break;
  }
}

const SearchBar = ({ width, height }) => {
  const [query, setQuery] = useState("|");

  useEffect(() => {
    let isMounted = true;
    async function runCityTyping() {
      let i = 0;
      while (isMounted) {
        setQuery("|");
        await waitForMs(500);

        // Use the 'name' property from RANDOM_CITIES
        await typeSentence(RANDOM_CITIES[i].name, (currentText) =>
          setQuery(currentText)
        );

        let cursorVisible = true;
        const cursorBlinkInterval = setInterval(() => {
          if (cursorVisible) {
            setQuery(RANDOM_CITIES[i].name + "|");
          } else {
            setQuery(RANDOM_CITIES[i].name + " ");
          }
          cursorVisible = !cursorVisible;
        }, 500);

        await waitForMs(3000);
        clearInterval(cursorBlinkInterval);

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
    <div className="flex flex-col gap-8 w-full ">
      <div className="relative ">
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
      <div className="flex justify-end">
        <Link href="/search">
          <button className="bg-dynamic rounded-full p-6 border dynamic-border shadow-md font-medium text-xl h-full hover:brightness-110 hover:bg-gradient-to-br hover:from-[#4934b549] hover:to-[#86458e2f] transition-all">
            Click to Search
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SearchBar;
