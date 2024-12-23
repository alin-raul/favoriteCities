"use client";

import { usePathname } from "next/navigation";

export function useNavigationEvents() {
  const pathname = usePathname();

  return pathname;
}
