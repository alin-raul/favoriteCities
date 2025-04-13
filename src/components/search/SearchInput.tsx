"use client";

import React from "react";
import { Input } from "../ui/input";
import { IoMdSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { SortableStopsList } from "./SortableStopsList";
import type { LocalCity } from "../local-cities/localCities"; // Import type

// Define props explicitly
interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  handleClearSearch: () => void;
  isLoading: boolean;
  error: string | null;
  results: LocalCity[];
  handleAddStop: (city: LocalCity) => void; // Changed from handleCitySelect/handleAddCity
  stops: LocalCity[];
  setStops: (stops: LocalCity[]) => void; // This is for reordering from SortableStopsList
  handleRemoveStop: (index: number) => void;
  endRoute: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  query,
  setQuery,
  handleClearSearch,
  isLoading,
  error,
  results,
  handleAddStop, // Use the unified handler
  stops,
  setStops, // Pass down for reordering
  handleRemoveStop,
  endRoute,
}) => {
  const getPlaceholderText = () => {
    if (stops.length === 0) return "Search destination...";
    if (stops.length === 1) return "Add destination or next stop...";
    return "Add another stop...";
  };

  return (
    <div className="w-full flex flex-col">
      {" "}
      {/* Ensure flex column */}
      {/* Input Section */}
      <div className="relative m-2 md:mx-2 md:my-2">
        {" "}
        {/* Consistent margin */}
        <IoMdSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 w-6 h-6 md:w-4 md:h-4 text-gray-400"
          aria-hidden="true"
        />
        <Input
          type="text"
          id="search"
          placeholder={getPlaceholderText()}
          className="bg-dynamic rounded-2xl pl-12 pr-12 text-lg shadow-inner h-14 md:h-10 md:pl-10 md:text-sm w-full" // Ensure w-full
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search for a city or location"
          autoComplete="off" // Prevent browser suggestions interfering
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
      {/* Stops List Section (only if stops exist) */}
      {stops.length > 0 && (
        // Added padding-left to align with input approximately
        <div className="w-full px-2 md:px-2 mt-1">
          <SortableStopsList
            stops={stops}
            // Pass the reorder handler received from Search component
            onReorder={setStops} // Framer Motion's onReorder expects the setter
            onRemove={handleRemoveStop}
            endRoute={endRoute}
          />
        </div>
      )}
      {/* Search Results Section (conditionally rendered) */}
      <div
        className={`relative w-full px-2 md:px-2 ${
          query && results.length > 0 ? "mt-2" : "mt-0"
        }`}
      >
        {" "}
        {/* Position results container */}
        {isLoading && query && (
          <p className="p-2 opacity-60 text-sm text-center">Loading...</p>
        )}
        {error && query && (
          <p className="p-2 text-red-500 text-sm text-center">{error}</p>
        )}
        {!isLoading && !error && query && results.length === 0 && (
          <p className="p-2 text-gray-500 text-sm text-center">
            No results found
          </p>
        )}
        {results.length > 0 &&
          query && ( // Ensure query is active to show results
            // Use absolute positioning to overlay results if needed, or keep inline
            <ul className="bg-dynamic rounded-xl max-h-60 overflow-y-auto shadow-md border dynamic-border mt-1">
              {/* Added some margin-top */}
              {results.map((result, index) => (
                <li
                  key={result.properties.osm_id || index} // Use a stable key like osm_id
                  className="p-2 cursor-pointer hover:bg-gray-500/10 mx-2 my-1 md:m-1 rounded-lg text-sm"
                  onClick={() => {
                    // Directly call handleAddStop when a result is clicked
                    handleAddStop(result);
                    // No need for handleCitySelect or handleAddCity here anymore
                  }}
                >
                  <span className="ml-2">
                    {result.properties.name}
                    {result.properties.county &&
                      `, ${result.properties.county}`}
                    {result.properties.country &&
                      `, ${result.properties.country}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
      </div>
    </div>
  );
};

export default SearchInput;
