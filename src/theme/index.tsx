import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useColorScheme } from "react-native";

interface ThemeTokens {
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceStrong: string;
  surfaceBorder: string;
  text: string;
  mutedText: string;
  accent: string;
  cardRadius: number;
  isLight: boolean;
}

const darkTokens: ThemeTokens = {
  background: "#0f0f1a",
  backgroundSecondary: "#162745",
  surface: "transparent",
  surfaceStrong: "transparent",
  surfaceBorder: "rgba(255,255,255,0.28)",
  text: "#f0f0f5",
  mutedText: "#8b8fa3",
  accent: "#7C3AED",
  cardRadius: 28,
  isLight: false,
};

const lightTokens: ThemeTokens = {
  background: "#f0f4ff",
  backgroundSecondary: "#d9ecff",
  surface: "transparent",
  surfaceStrong: "transparent",
  surfaceBorder: "rgba(255,255,255,0.72)",
  text: "#1a1a2e",
  mutedText: "#6b7280",
  accent: "#7C3AED",
  cardRadius: 28,
  isLight: true,
};

interface ThemeContextValue {
  tokens: ThemeTokens;
}

const ThemeContext = createContext<ThemeContextValue>({ tokens: darkTokens });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const tokens = colorScheme === "light" ? lightTokens : darkTokens;

  return (
    <ThemeContext.Provider value={{ tokens }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
