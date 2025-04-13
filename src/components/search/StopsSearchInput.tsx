"use client";

import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { IoMdSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import type { LocalCity } from "../local-cities/localCities";

export const StopsSearchInput = ({ onSelect, onClose, searchCity }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocalCity[]>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query && searchCity) {
        searchCity(query).then(setResults);
      } else if (!query) {
        // Optionally clear results when query is empty
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchCity]);

  return (
    <div className="relative">
      <div className="relative">
        <IoMdSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
          aria-hidden="true"
        />
        <Input
          type="text"
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Add stop..."
          className="bg-dynamic rounded-xl pl-10 pr-10 shadow-inner"
        />
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 opacity-60 hover:opacity-100"
          aria-label="Clear search"
          onClick={onClose}
        >
          <IoMdClose />
        </button>
      </div>
      <ul className="bg-dynamic rounded-lg max-h-60 overflow-y-auto shadow-inner mt-4">
        {results.map((result, index) => (
          <li
            key={index}
            onClick={() => {
              onSelect(result);
              onClose();
            }}
            className="p-2 cursor-pointer hover:bg-gray-500/10"
          >
            {result.properties.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
