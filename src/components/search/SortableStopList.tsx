"use client";

import React from "react";
import { RxDragHandleDots2 } from "react-icons/rx";
import { IoMdClose, IoIosMore } from "react-icons/io";
import { SlLocationPin } from "react-icons/sl";
import { MdOutlineTripOrigin } from "react-icons/md";
import type { LocalCity } from "../local-cities/localCities";
import { Reorder, useDragControls } from "framer-motion";

// Create a separate component for individual items
const SortableItem = ({
  city,
  index,
  onRemove,
  stops,
  endRoute,
}: {
  city: LocalCity;
  index: number;
  onRemove: (index: number) => void;
  stops: LocalCity[];
  endRoute: () => void;
}) => {
  const controls = useDragControls(); // Individual controls per item

  return (
    <Reorder.Item value={city} dragListener={false} dragControls={controls}>
      <div className="p-1 mb-2 bg-dynamic rounded-[1rem]">
        <div className="flex items-center gap-2 w-full">
          <div className="flex items-center gap-2">
            {/* Drag handle */}
            <button
              className="hover:bg-gray-500/10 p-1 rounded-lg cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => controls.start(e)}
            >
              <RxDragHandleDots2 className="w-5 h-5 opacity-60" />
            </button>
            <div className="ml-2 text-lg">
              {stops.length === 1 ? (
                <SlLocationPin className="text-red-500" />
              ) : index === 0 ? (
                <MdOutlineTripOrigin className="text-blue-500" />
              ) : index === stops.length - 1 ? (
                <SlLocationPin className="text-red-500" />
              ) : (
                <IoIosMore className="text-gray-500 rotate-90" />
              )}
            </div>
          </div>

          <div className="border flex justify-between p-1 rounded-xl w-full">
            <span className="ml-2">{city.properties.name}</span>
            <button
              onClick={() => {
                onRemove(index);
                endRoute();
              }}
              className="opacity-60 hover:opacity-100 p-1 rounded-lg hover:bg-gray-500/10"
              aria-label="Remove stop"
            >
              <IoMdClose className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
};

export const SortableStopsList = ({
  stops,
  setStops,
  onRemove,
  endRoute,
}: {
  stops: LocalCity[];
  setStops: (stops: LocalCity[]) => void;
  onRemove: (index: number) => void;
  endRoute: () => void;
}) => {
  return (
    <Reorder.Group values={stops} onReorder={setStops}>
      {stops.map((city, index) => (
        <SortableItem
          key={city.properties.name}
          city={city}
          index={index}
          onRemove={onRemove}
          stops={stops}
          endRoute={endRoute}
        />
      ))}
    </Reorder.Group>
  );
};
