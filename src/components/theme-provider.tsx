"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
} & Partial<ThemeProviderProps>): React.ReactElement {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
