"use client";

import { usePathname } from "next/navigation";

export function navigationEvents() {
  const pathname = usePathname();
  //   const searchParams = useSearchParams();

  // useEffect(() => {
  //   // const url = `${pathname}?${searchParams}`;
  // }, [pathname]);
  return pathname;
}
