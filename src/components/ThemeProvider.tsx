'use client'; // Mark this as a client component

import { useAppSelector } from "@/lib/hooks";
import { selectTheme } from "@/lib/slices/themeSlice";
import { useEffect } from "react";

const ThemeProvider = () => {
  const theme = useAppSelector(selectTheme);
  console.log("theme - ", theme);
  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    console.log(root.classList);
  }, [theme]);

  return null; // No UI component, this just manages theme state
};

export default ThemeProvider;
