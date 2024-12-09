"use client";

import { usePathname } from "next/navigation";

export function navigationEvents() {
  const pathname = usePathname();

  return pathname;
}
