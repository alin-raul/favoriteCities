"use client";

import TransitionLink from "../utils/TransitionLink";
import navigationLinks from "@/globals/NavLinks";
import BurgerMenu from "./BurgerMenu";
import { RxHamburgerMenu } from "react-icons/rx";
import { Logo } from "./NavBar";

const NavLinks = ({ pathname }) => {
  return (
    <div className="flex items-center gap-6">
      <BurgerMenu icon={<RxHamburgerMenu />} />
      <div className="hidden items-center gap-6 md:flex">
        <ul className="flex">
          <div className="flex items-center gap-1 ">
            <Logo />
            <TransitionLink href="/" isActive={pathname === "/"}>
              {" "}
              <span className="font-bold pr-2">FavCity</span>
            </TransitionLink>
          </div>
          {navigationLinks.slice(1).map((item) => (
            <li key={item.title} className={`p-2`}>
              <TransitionLink href={item.url} isActive={pathname === item.url}>
                {" "}
                <span>{item.title}</span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavLinks;
