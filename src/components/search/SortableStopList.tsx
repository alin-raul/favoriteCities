"use client";

import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { RxDragHandleDots2 } from "react-icons/rx";
import { IoMdClose, IoIosMore } from "react-icons/io";
import { SlLocationPin } from "react-icons/sl";
import { MdOutlineTripOrigin } from "react-icons/md";
import type { LocalCity } from "../local-cities/localCities";

export const SortableStopsList = ({
  items,
  onReorder,
  onRemove,
}: {
  items: LocalCity[];
  onReorder: (startIndex: number, endIndex: number) => void;
  onRemove: (index: number) => void;
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    onReorder(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable
        key={items.map((item) => {
          return `${item.properties.name}-${item.properties.osm_id}`;
        })}
        droppableId="unique-stops-droppable"
        isDropDisabled={false}
        isCombineEnabled={false}
        ignoreContainerClipping={false}
      >
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="w-full"
          >
            {items.map((city, index) => (
              <Draggable
                key={`${city.properties.name}-${city.properties.osm_id}`}
                draggableId={`${city.properties.name}-${city.properties.osm_id}`}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="p-1 mb-2 cursor-grab active:cursor-grabbing bg-dynamic rounded-[1rem]"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex items-center gap-2">
                        {/* Drag handle */}
                        <button
                          {...provided.dragHandleProps}
                          className="hover:bg-gray-500/10 p-1 rounded-lg cursor-grab active:cursor-grabbing"
                        >
                          <RxDragHandleDots2 className="w-5 h-5 opacity-60" />
                        </button>
                        <div className="ml-2 text-lg">
                          {items.length === 1 ? (
                            <SlLocationPin className="text-red-500" />
                          ) : index === 0 ? (
                            <MdOutlineTripOrigin className="text-blue-500" />
                          ) : index === items.length - 1 ? (
                            <SlLocationPin className="text-red-500" />
                          ) : (
                            <IoIosMore className="text-gray-500 rotate-90" />
                          )}
                        </div>
                      </div>

                      <div className="border flex justify-between p-1 rounded-xl w-full">
                        <span className="ml-2">{city.properties.name}</span>
                        <button
                          onClick={() => onRemove(index)}
                          className="opacity-60 hover:opacity-100 p-1 rounded-lg hover:bg-gray-500/10"
                          aria-label="Remove stop"
                        >
                          <IoMdClose className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
