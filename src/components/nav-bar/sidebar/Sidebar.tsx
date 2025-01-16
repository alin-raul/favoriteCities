"use client";

import React, { useEffect } from "react";
import TransitionLink from "@/components/utils/TransitionLink";
import { Logo } from "../NavBar";
import { IoClose } from "react-icons/io5";
import navLinks from "@/globals/NavLinks";
import { useSidebar } from "@/context/SidebarContext";
import BurgerMenu from "../BurgerMenu";

const Sidebar: React.FC = () => {
  const { isVisible, hideSidebar } = useSidebar();

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  return (
    <>
      {isVisible && (
        <div
          className={`z-40 fixed inset-0 bg-black/60  w-screen h-screen md:hidden transition-opacity duration-300 ease-in-out ${
            isVisible
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={hideSidebar}
        />
      )}

      <nav
        className={`backdrop-blur-xl fixed top-0 left-0 h-full w-full p-6 z-50 duration-300 ease-in-out md:hidden  ${
          isVisible
            ? "opacity-100 scale-100 pointer-events-auto blur-none"
            : "opacity-0 scale-99 pointer-events-none blur-md invisible"
        }`}
      >
        <BurgerMenu
          className="absolute top-4 right-8"
          icon={<IoClose className="w-6 h-6" />}
        />

        <div className="flex items-center text-4xl text-white gap-1 font-bold mt-3">
          <Logo height="2.2rem" width="2.2rem" fill="#000" />
          <span className="ml-4">Cardinal</span>
        </div>

        <div className="pl-14 text-white">
          <ul className="mt-4">
            {navLinks.map((item) => (
              <li
                key={item.title}
                className="py-2 text-2xl"
                onClick={hideSidebar}
              >
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
