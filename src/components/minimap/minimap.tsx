"use client";

import React from "react";
import MapDisplay from "../map/Map";

const Minimap: React.FC = () => {
  return <MapDisplay advancedView={true} />;
};

export default Minimap;
