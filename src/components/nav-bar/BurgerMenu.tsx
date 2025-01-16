"use client";

import React, { FC, ButtonHTMLAttributes } from "react";
import { useSidebar } from "@/context/SidebarContext";

interface BurgerMenuProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}

const BurgerMenu: FC<BurgerMenuProps> = ({ icon, ...props }) => {
  const { toggleSidebar } = useSidebar();

  return (
    <div>
      <button
        className="p-2 rounded-md hover:bg-dynamic md:hidden z-50"
        onClick={toggleSidebar}
        {...props}
      >
        {icon}
      </button>
    </div>
  );
};

export default BurgerMenu;
