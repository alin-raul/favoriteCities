"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { IoMdSearch } from "react-icons/io";
import MapOverlay from "./_map/Map";

const SearchPage = () => {
  return (
    <div className="">
      <div className="absolute h-full w-screen right-0">
        <MapOverlay />
      </div>
      <div className="h-60 p-4 flex flex-col justify-end items-center">
        <div className="relative w-full max-w-md">
          <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            id="search"
            placeholder="Search..."
            className="bg-dynamic rounded-xl pl-10"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
