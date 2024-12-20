"use client";

import { ModeToggle } from "../mode-toggle/ModeToggle";
import NavLinks from "./NavLinks";
import SignInAndOutButton from "./SignInAndOutButton";
import { navigationEvents } from "../navigation-events/navigationEvents";

export const Logo = ({ width, height, fill = "#fff" }) => {
  return (
    <div className="logo">
      <svg
        fill={fill}
        width={width}
        height={height}
        viewBox="0 0 24 24"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <metadata>
            <export format="svg" path="cardinal.icon.svg" />
          </metadata>
        </defs>
        <title>Cardinal icon</title>
        <path d="M 12 0 L 8.076 8.076 L 0 12 L 8.076 15.924 L 12 24 L 15.924 15.924 L 24 12 L 15.924 8.076 L 12 0 Z" />
      </svg>
    </div>
  );
};

const Navbar = ({ session }) => {
  const pathname = navigationEvents();
  return (
    <div
      className={`top-0 left-0 right-0 shadow-sm z-40 ${
        ["/login", "/signup"].includes(pathname) ? "hidden" : "sticky"
      }`}
    >
      <nav className="flex items-center justify-center w-screen md:border-b border-white/20 h-14 backdrop-blur-md">
        <div className="max-w-screen-xl flex items-center justify-between w-full mx-2 sm:mx-8">
          <NavLinks pathname={pathname} />
          <div className="gap-2 flex items-center">
            <ModeToggle />
            <SignInAndOutButton session={session} />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
