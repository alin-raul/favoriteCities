"use client";

import React from "react";
import { RxDragHandleDots2 } from "react-icons/rx";
import { IoMdClose, IoIosMore } from "react-icons/io";
import { SlLocationPin } from "react-icons/sl"; // Destination
import { MdOutlineTripOrigin } from "react-icons/md"; // Origin
import { FaRegDotCircle } from "react-icons/fa"; // Intermediate stop
import type { LocalCity } from "../local-cities/localCities";
import { Reorder, useDragControls } from "framer-motion";

// Individual Item Component
const SortableItem = ({
  city,
  index,
  onRemove,
  stopsCount, // Pass total count for icon logic
  endRoute,
}: {
  city: LocalCity;
  index: number;
  onRemove: (index: number) => void;
  stopsCount: number;
  endRoute: () => void;
}) => {
  const controls = useDragControls();

  const getIcon = () => {
    if (stopsCount <= 1) {
      // If only one stop, it acts as a destination pin until another is added
      return (
        <SlLocationPin className="text-red-500" aria-label="Destination" />
      );
    }
    if (index === 0) {
      return (
        <MdOutlineTripOrigin className="text-blue-500" aria-label="Origin" />
      );
    }
    if (index === stopsCount - 1) {
      return (
        <SlLocationPin
          className="text-red-500"
          aria-label="Final Destination"
        />
      );
    }
    return <FaRegDotCircle className="text-gray-500" aria-label="Stop" />; // Use a clearer intermediate stop icon
  };

  return (
    // Use the city's unique ID for the value and key if possible
    <Reorder.Item
      key={city.properties.osm_id || `stop-${index}`} // Prefer OSM ID
      value={city}
      dragListener={false}
      dragControls={controls}
      className="p-1 mb-1 bg-dynamic rounded-[0.75rem] list-none" // Ensure list-none
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-1 w-full">
        {/* Drag handle */}
        <button
          className="hover:bg-gray-500/10 p-1 rounded-lg cursor-grab active:cursor-grabbing touch-none" // Added touch-none
          onPointerDown={(e) => controls.start(e)}
          aria-label={`Drag to reorder stop: ${city.properties.name}`}
        >
          <RxDragHandleDots2 className="w-5 h-5 opacity-60" />
        </button>
        {/* Icon */}
        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-lg">
          {getIcon()}
        </div>

        {/* Stop Name and Remove Button */}
        <div className="flex-grow flex justify-between items-center p-1 rounded-lg min-w-0">
          {" "}
          {/* Added min-w-0 */}
          <span className="ml-1 text-sm truncate" title={city.properties.name}>
            {" "}
            {/* Added truncate */}
            {city.properties.name}
          </span>
          <button
            onClick={() => {
              onRemove(index);
              // endRoute(); // Removing might not immediately end the route if > 2 stops remain
            }}
            className="opacity-60 hover:opacity-100 p-1 rounded-lg hover:bg-red-500/10 flex-shrink-0"
            aria-label={`Remove stop: ${city.properties.name}`}
          >
            <IoMdClose className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
};

// Main List Component
export const SortableStopsList = ({
  stops,
  onReorder, // Changed prop name to match Framer Motion convention
  onRemove,
  endRoute,
}: {
  stops: LocalCity[];
  onReorder: (stops: LocalCity[]) => void; // Expects the reorder handler
  onRemove: (index: number) => void;
  endRoute: () => void;
}) => {
  return (
    // Use Reorder.Group and pass the onReorder handler
    <Reorder.Group
      axis="y"
      values={stops}
      onReorder={onReorder}
      className="w-full"
    >
      {stops.map((city, index) => (
        <SortableItem
          // Key needs to be stable, prefer ID if available
          key={city.properties.osm_id || `stop-${index}`}
          city={city}
          index={index}
          onRemove={onRemove}
          stopsCount={stops.length} // Pass count for icon logic
          endRoute={endRoute}
        />
      ))}
    </Reorder.Group>
  );
};
