"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { IoMdSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

const SearchInput = ({
  query,
  setQuery,
  handleClearSearch,
  isLoading,
  error,
  results,
  handleCitySelect,
  handleAddCity,
}) => {
  return (
    <div>
      <div className="relative">
        <IoMdSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
          aria-hidden="true"
        />
        <Input
          type="text"
          id="search"
          placeholder="Search destinations..."
          className="bg-dynamic rounded-xl pl-10 pr-10 shadow-inner"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search for a city"
        />
        {query && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 opacity-60 hover:opacity-100"
            aria-label="Clear search"
          >
            <IoMdClose />
          </button>
        )}
      </div>

      {isLoading && <p className="mt-4 opacity-60 text-sm">Loading...</p>}
      {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

      <div className={`mt-4 w-full ${query ? "" : "hidden"}`}>
        {results.length > 0 ? (
          <ul className="bg-dynamic rounded-lg max-h-60 overflow-y-auto shadow-inner">
            {results.map((result, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-500/10"
                onClick={() => {
                  handleCitySelect(result);
                  handleAddCity(result);
                }}
              >
                {result.properties.name} - {result.properties.country}
              </li>
            ))}
          </ul>
        ) : query && !isLoading ? (
          <p className="text-gray-500 text-sm">No results found</p>
        ) : null}
      </div>
    </div>
  );
};

export default SearchInput;
