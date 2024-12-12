"use client";

import React, { useEffect } from "react";
import TransitionLink from "@/components/utils/TransitionLink";
import { Logo } from "../NavBar";
import { IoClose } from "react-icons/io5";
import navLinks from "@/globals/NavLinks";
import { useSidebar } from "@/context/SidebarContext";
import BurgerMenu from "../BurgerMenu";

const Sidebar = () => {
  const { isVisible, hideSidebar } = useSidebar();

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = ""; // Reset overflow when sidebar is hidden
    }

    // Cleanup to prevent unintended side effects
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  return (
    <>
      {/* Overlay Background */}
      {isVisible && (
        <div
          className={`z-40 fixed inset-0 bg-black/60 w-screen h-screen md:hidden transition-opacity duration-300 ease-in-out ${
            isVisible
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={hideSidebar}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`bg-dynamic backdrop-blur-md fixed top-0 left-0 h-full w-48 p-6 z-50 transition-transform duration-300 ease-in-out transform md:hidden ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <BurgerMenu className="absolute top-4 right-4" icon={<IoClose />} />

        {/* Logo */}
        <div className="flex items-center gap-1 font-bold mt-3">
          <Logo height="20px" width="20px" />
          Cardinal
        </div>

        {/* Navigation Links */}
        <div className="p-4">
          <ul>
            {navLinks.map((item) => (
              <li key={item.title} className="p-2" onClick={hideSidebar}>
                <TransitionLink href={item.url}>
                  <span>{item.title}</span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
