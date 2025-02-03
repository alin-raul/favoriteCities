"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { IoMdSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { SortableStopsList } from "./SortableStopList";

const SearchInput = ({
  query,
  setQuery,
  handleClearSearch,
  isLoading,
  error,
  results,
  handleCitySelect,
  handleAddCity,
  stops,
  setStops,
  handleRemoveStop,
}) => {
  return (
    <div className="w-full">
      <div className="relative m-5 md:m-2">
        <IoMdSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 w-6 h-6 md:w-4 md:h-4"
          aria-hidden="true"
        />
        <Input
          type="text"
          id="search"
          placeholder={`${
            stops.length === 0
              ? "Search destinations..."
              : stops.length > 0 && stops.length < 2
              ? "Chose start location..."
              : "Add stops..."
          }`}
          className="bg-dynamic rounded-2xl pl-12 pr-12 text-lg shadow-inner h-14 md:h-10 md:pl-10 md:text-sm "
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

      <div className="">
        <div className="">
          {stops.length > 0 && (
            <div className="w-full pr-4 mt-2">
              <SortableStopsList
                items={stops}
                onReorder={(startIndex, endIndex) => {
                  const newStops = [...stops];
                  const [removed] = newStops.splice(startIndex, 1);
                  newStops.splice(endIndex, 0, removed);
                  setStops(newStops);
                }}
                onRemove={handleRemoveStop}
              />
            </div>
          )}
        </div>
      </div>

      {isLoading && <p className="mt-4 opacity-60 text-sm">Loading...</p>}
      {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

      <div className={`mt-2 w-full ${query ? "" : "hidden"}`}>
        {results.length > 0 ? (
          <ul className="bg-dynamic rounded-t-xl rounded-b-3xl max-h-60 overflow-y-auto shadow-inner">
            {results.map((result, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-500/10 mx-4 md:m-0 rounded-2xl"
                onClick={() => {
                  handleCitySelect(result);
                  handleAddCity(result);
                }}
              >
                <span className="ml-2">
                  {result.properties.name} - {result.properties.country}
                </span>
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
