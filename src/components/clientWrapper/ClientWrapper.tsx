"use client";

import { usePathname } from "next/navigation";
import Navbar from "../nav-bar/NavBar";

type ClientWrapperProps = {
  children: React.ReactNode;
};

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const pathname = usePathname();

  const hiddenPaths = ["/login", "/signup"];

  return (
    <>
      {!hiddenPaths.includes(pathname) && <Navbar />}
      <main>{children}</main>
    </>
  );
}
