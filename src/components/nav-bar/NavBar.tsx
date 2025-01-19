"use client";

import { ModeToggle } from "../mode-toggle/ModeToggle";
import NavLinks from "./NavLinks";
import SignInAndOutButton from "./SignInAndOutButton";
import { useNavigationEvents } from "../navigation-events/useNavigationEvents";

type LogoProps = {
  width: string | number;
  height: string | number;
  fill?: string;
};

type Session = {
  user: User;
};

type User = {
  name: string;
  email: string;
  image: string | null;
};

type NavbarProps = {
  session?: Session;
};

export const Logo: React.FC<LogoProps> = ({ width, height, fill = "#fff" }) => {
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
        <title>Cardinal icon</title>
        <path d="M 12 0 L 8.076 8.076 L 0 12 L 8.076 15.924 L 12 24 L 15.924 15.924 L 24 12 L 15.924 8.076 L 12 0 Z" />
      </svg>
    </div>
  );
};

const Navbar: React.FC<NavbarProps> = ({ session }) => {
  const pathname: string = useNavigationEvents();
  return (
    <div
      className={`top-0 left-0 right-0 shadow-sm z-40 ${
        ["/login", "/signup"].includes(pathname) ? "hidden" : "sticky"
      }`}
    >
      <nav className="flex items-center justify-center w-screen md:border-b border-white/20 h-14 bg-dynamic">
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
