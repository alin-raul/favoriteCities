"use client";

import React, { useEffect, useState, memo } from "react";
import { IoMdSearch } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";
import { Input } from "../ui/input";
import { RANDOM_CITIES } from "@/globals/constants";
import Link from "next/link";

const waitForMs = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

async function typeSentence(
  sentence: string,
  setQuery: React.Dispatch<React.SetStateAction<string>>,
  delay: number = 100
): Promise<void> {
  const letters = sentence.split("");
  let currentText = "";

  for (let i = 0; i < letters.length; i++) {
    await waitForMs(delay);
    currentText += letters[i];
    setQuery(currentText + "|");
  }

  setQuery(currentText + "|");
}

async function deleteSentence(
  setQuery: React.Dispatch<React.SetStateAction<string>>,
  delay: number = 100
): Promise<void> {
  while (true) {
    await waitForMs(delay);
    let shouldBreak = false;
    setQuery((prev: string) => {
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

interface SearchBarProps {
  width: string;
  height: string;
}

const SearchBar: React.FC<SearchBarProps> = memo(({ width, height }) => {
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function runCityTyping() {
      let i = 0;
      while (isMounted) {
        await waitForMs(250);
        for (let j = 0; j < 3; j++) {
          // Blink twice before starting
          setQuery((prev) =>
            prev.endsWith("|") ? prev.slice(0, -1) : prev + "|"
          );
          await waitForMs(500);
        }

        // Start typing
        await typeSentence(RANDOM_CITIES[i].name, setQuery);

        const cursorBlinkInterval = setInterval(() => {
          setQuery((prev) =>
            prev.endsWith("|") ? prev.slice(0, -1) : prev + "|"
          );
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
    <div className="flex flex-col gap-8 w-full h-full">
      <div className="relative h-full">
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
          <button className="bg-dynamic rounded-full p-6 border dynamic-border shadow-md font-medium text-xl h-full hover:brightness-110 hover:bg-gradient-to-br hover:from-[#4934b590] hover:to-[#86458e50] transition-all">
            <div className="flex gap-6 items-center">
              Click to Search
              <MdArrowOutward className="w-6 h-6" />
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
});

export default SearchBar;
