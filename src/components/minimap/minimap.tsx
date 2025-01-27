"use client";

import React from "react";
import MapDisplay from "../map/Map";

const Minimap: React.FC = () => {
  return (
    <div className="w-full h-full pointer-events-none">
      <MapDisplay
        advancedView={true}
        rounded={["3rem", "3rem", "3rem", "3rem"]}
      />
    </div>
  );
};

export default Minimap;
