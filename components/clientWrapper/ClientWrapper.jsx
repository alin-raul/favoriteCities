"use client";

import { usePathname } from "next/navigation";
import Navbar from "../nav-bar/NavBar";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();

  // Define paths where the navbar should be hidden
  const hiddenPaths = ["/login", "/signup"];

  return (
    <>
      {!hiddenPaths.includes(pathname) && <Navbar />}
      <main>{children}</main>
    </>
  );
}
