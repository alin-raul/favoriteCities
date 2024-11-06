"use client";

import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const useSidebar = () => {
  return useContext(SidebarContext);
};

export const SidebarProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleSidebar = () => {
    setIsVisible((prevState) => !prevState);
  };

  const showSidebar = () => {
    setIsVisible(true);
  };

  const hideSidebar = () => {
    setIsVisible(false);
  };

  return (
    <SidebarContext.Provider
      value={{ isVisible, toggleSidebar, showSidebar, hideSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
