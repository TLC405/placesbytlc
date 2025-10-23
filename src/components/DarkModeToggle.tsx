import { Moon, Sun, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || false;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsDark(!isDark)}
      className="relative group"
      title={isDark ? "Dark Cupid Mode" : "Light Mode"}
    >
      {isDark ? (
        <div className="relative">
          <Heart className="w-5 h-5 text-pink-500 animate-pulse absolute inset-0" />
          <Moon className="w-5 h-5" />
        </div>
      ) : (
        <Sun className="w-5 h-5" />
      )}
      <span className="sr-only">Toggle dark mode</span>
    </Button>
  );
};
