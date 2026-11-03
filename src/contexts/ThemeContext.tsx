import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { THEMES } from "@/data/themes";
import { getSavedTheme, isTheme, THEME_KEY, type ThemeType } from "@/lib/themes";
export type { ThemeType } from "@/lib/themes";
interface ThemeContextType {
  currentTheme: ThemeType;
  isHalloween: boolean;
  setTheme: (theme: ThemeType) => void;
  themes: typeof THEMES;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState(getSavedTheme);
  useEffect(() => {
    const root = document.documentElement;
    for (const token of ["--primary", "--accent", "--background", "--foreground"]) root.style.removeProperty(token);
    root.removeAttribute("data-season");
    root.setAttribute("data-theme", currentTheme);
    root.classList.remove("dark");
    try { localStorage.setItem(THEME_KEY, currentTheme); } catch { /* Appearance still works when storage is blocked. */ }
    const fonts: Record<ThemeType, string> = {
      spooky: "Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700",
      "love-letters": "Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600;700",
      "midnight-cinema": "Sora:wght@400;500;600;700&family=Manrope:wght@400;500;600;700",
      "garden-studio": "Lora:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600;700",
    };
    const id = `theme-font-${currentTheme}`;
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id; link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${fonts[currentTheme]}&display=swap`;
      document.head.appendChild(link);
    }
  }, [currentTheme]);
  useEffect(() => {
    const sync = (event: StorageEvent) => { if (event.key === THEME_KEY && isTheme(event.newValue)) setCurrentTheme(event.newValue); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const setTheme = (theme: ThemeType) => { setCurrentTheme(theme); toast.success(`${THEMES[theme].name} selected`); };
  return <ThemeContext.Provider value={{ currentTheme, isHalloween: currentTheme === "spooky", setTheme, themes: THEMES }}>{children}</ThemeContext.Provider>;
}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
