"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const TransitionLink = ({ children, href, ...props }) => {
  const router = useRouter();

  const handleTransition = async (e) => {
    e.preventDefault();

    const mainContent = document.querySelector("main");
    mainContent?.classList.add("page-transition-start");
    await sleep(400);
    mainContent?.classList.remove("page-transition-start");
    router.push(href);
    mainContent?.classList.add("page-transition-end");
    await sleep(400);
    mainContent?.classList.remove("page-transition-end");
  };

  return (
    <Link href={href} onClick={handleTransition} {...props}>
      {children}
    </Link>
  );
};

export default TransitionLink;
