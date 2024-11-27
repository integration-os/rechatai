"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import * as Tooltip from '@radix-ui/react-tooltip';


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props} >
      <Tooltip.Provider>{children}</Tooltip.Provider>
    </NextThemesProvider>
  );
}
