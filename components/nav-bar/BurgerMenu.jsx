"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext";

const BurgerMenu = ({ icon, ...props }) => {
  const { toggleSidebar } = useSidebar();

  return (
    <div>
      <button
        className="p-2 rounded-md hover:bg-dynamic md:hidden"
        onClick={toggleSidebar}
        {...props}
      >
        {icon}
      </button>
    </div>
  );
};

export default BurgerMenu;
