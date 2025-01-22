import { usePathname } from "next/navigation";

export const useNavigationEvents = (): string => {
  const pathname = usePathname();

  return pathname;
};
