"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TransitionLink = ({ children, href, isActive, ...props }) => {
  const router = useRouter();

  const handleTransition = async (e) => {
    e.preventDefault();

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
      className={`hover:opacity-100 ${isActive ? "opacity-100" : "opacity-60"}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default TransitionLink;
