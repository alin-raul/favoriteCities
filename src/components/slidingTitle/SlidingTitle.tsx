import React from "react";
import SearchBar from "../search/SearchBar";

const SlidingTitle: React.FC = () => {
  return (
    <div className="flex h-full px-4">
      <div className="flex justify-center items-center gap-36 m-auto">
        <div className="flex flex-col m-auto gap-12 my-8">
          <div className="font-serif font-normal text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
            <div className="flex items-center justify-center">
              <div className="sm:flex items-center justify-center">
                <div className="slider-container overflow-hidden">
                  <div>
                    <span className="mx-auto sm:ml-auto sm:mx-0">Search</span>
                  </div>
                  <div>
                    <span className="mx-auto sm:ml-auto sm:mx-0">Discover</span>
                  </div>
                  <div>
                    <span className="mx-auto sm:ml-auto sm:mx-0">Travel</span>
                  </div>
                  <div>
                    <span className="mx-auto sm:ml-auto sm:mx-0">Explore</span>
                  </div>
                </div>
                <div className="text-center">
                  <span>The World,</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-7xl lg:text-8xl xl:text-9xl">
              <span>Your Adventure Awaits</span>
            </div>
          </div>

          <p className="text-lg max-w-md md:max-w-3xl xl:max-w-5xl lg:text-xl xl:text-2xl font-light text-center opacity-90 mx-auto">
            Whether you&apos;re planning a weekend getaway, a business trip, or
            just dreaming about your next adventure — we&apos;ve got you
            covered.
          </p>

          <div className="max-w-3xl w-full m-auto gap-8">
            <SearchBar width="w-full" height="h-28" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlidingTitle;
