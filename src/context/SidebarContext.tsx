"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SidebarContextType = {
  isVisible: boolean;
  toggleSidebar: () => void;
  showSidebar: () => void;
  hideSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

type SidebarProviderProps = {
  children: ReactNode;
};

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

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
