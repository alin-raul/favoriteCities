"use client";

import TransitionLink from "@/components/utils/TransitionLink";
import { Logo } from "../NavBar";
import { IoClose } from "react-icons/io5";
import Links from "@/globals/NavLinks";
import { useSidebar } from "@/context/SidebarContext";
import BurgerMenu from "../BurgerMenu";

const Sidebar = () => {
  const { isVisible, hideSidebar } = useSidebar();

  return (
    <>
      {isVisible && (
        <div
          className={`z-50 absolute inset-0 bg-black/60 w-screen h-screen md:hidden transition-opacity duration-300 ease-in-out ${
            isVisible
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={hideSidebar}
        />
      )}

      <nav
        className={`bg-dynamic backdrop-blur-md absolute h-screen w-72 p-6 z-50 transition-transform duration-300 ease-in-out transform md:hidden ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <BurgerMenu className="absolute top-4 right-4" icon={<IoClose />} />
        <div className="flex items-center gap-1 font-bold mt-3">
          <Logo />
          FavCity
        </div>
        <div className="p-4 ml-3">
          <ul>
            {Links.map((item) => (
              <li key={item.title} className="p-2" onClick={hideSidebar}>
                <TransitionLink href={item.url}>
                  {/* <item.icon /> */}
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
