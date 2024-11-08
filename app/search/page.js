import React from "react";
import { Input } from "@/components/ui/input";
import { IoMdSearch } from "react-icons/io";

const SearchPage = () => {
  return (
    <div className="">
      <div className="h-60 p-4 flex flex-col justify-end items-center bg-[url('/images/city-grid.svg')] bg-cover bg-center gradient-mask">
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
      <p>
        Welcome to Favorite Cities, the app that brings the world's most
        captivating cities right to your fingertips. Whether you're a seasoned
        traveler or dreaming up your first adventure, we’ve designed this app to
        be your ultimate guide to finding, exploring, and saving all your
        must-visit destinations. Dive into hand-picked city profiles that
        feature not only the best sights and sounds but also hidden gems known
        only to locals. From iconic landmarks and cozy cafes to bustling markets
        and tranquil parks, every city has a unique story to tell—and we're here
        to help you uncover it. With customizable city lists, detailed maps, and
        real-time recommendations, Favorite Cities makes it easy to curate and
        organize your travel bucket list. Love a city? Mark it as a favorite and
        get personalized tips, local weather updates, and new activity ideas
        every time you revisit the app. Our mission is simple: to inspire,
        guide, and keep you connected to the places that mean the most to you.
        So go ahead, explore the world, and let Favorite Cities be your compass
        for every journey.
      </p>
    </div>
  );
};

export default SearchPage;
