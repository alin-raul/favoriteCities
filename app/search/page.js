import React from "react";
import Search from "./_map/Search";

import MapDisplay from "./_map/Map";

const SearchPage = () => {
  return (
    <div className="flex ">
      <Search />
      <div className="">
        <MapDisplay />
      </div>
    </div>
  );
};

export default SearchPage;
