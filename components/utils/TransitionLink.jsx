"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNavigationEvents } from "../navigation-events/useNavigationEvents";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TransitionLink = ({
  children,
  href,
  isActive,
  ignore,
  card,
  ...props
}) => {
  const router = useRouter();
  const currentPath = useNavigationEvents();
  const prevPathRef = useRef(null);

  useEffect(() => {
    if (prevPathRef.current !== currentPath) {
      console.log(currentPath);
      prevPathRef.current = currentPath;
    }
  }, [currentPath]);

  const handleTransition = async (e) => {
    e.preventDefault();

    if (currentPath === href) return;

    const mainContent = document.querySelector("main");
    if (!mainContent || mainContent.classList.contains("transitioning")) return;

    mainContent.classList.add("transitioning");

    try {
      mainContent.classList.add("page-transition-start");
      await sleep(400);
      mainContent.classList.remove("page-transition-start");

      router.push(href);

      mainContent.classList.add("page-transition-end");
      await sleep(400);
      mainContent.classList.remove("page-transition-end");
    } catch (error) {
      console.error("Navigation failed:", error);
    } finally {
      mainContent.classList.remove("transitioning");
    }
  };

  return (
    <Link
      href={href}
      onClick={handleTransition}
      className={`hover:opacity-100 ${
        card
          ? ""
          : isActive
          ? "opacity-100 font-semibold"
          : `${ignore ? "opacity-100 hover:brightness-110" : "opacity-60"}`
      }`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default TransitionLink;
