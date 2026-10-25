import { useLocation, useNavigate } from "react-router-dom";
import { Home, Brain, Crosshair, Droplets, Link2, Ghost, Moon, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PumpkinIcon, BatIcon } from "@/components/HalloweenIcon";
import { useTheme } from "@/contexts/ThemeContext";

const tabs = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "psych", label: "Mind", icon: Brain, path: "/quizzes" },
  { id: "recon", label: "Dates", icon: Crosshair, path: "/recon" },
  { id: "cycle", label: "Cycle", icon: Droplets, path: "/her-cycle" },
  { id: "sync", label: "Sync", icon: Link2, path: "/sync" },
];

export function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isHalloween } = useTheme();
  const seasonalIcons = [PumpkinIcon, Ghost, BatIcon, Moon, Heart];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" || location.pathname === "/index";
    if (path === "/quizzes") return location.pathname.startsWith("/quiz");
    if (path === "/recon") return ["/recon", "/places", "/ai-recommender"].includes(location.pathname);
    if (path === "/her-cycle") return ["/her-cycle", "/cycle"].includes(location.pathname);
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="tab-bar" aria-label="Main navigation">
      <div className="tab-bar-inner">
        {tabs.map((tab, index) => {
          const Icon = isHalloween ? seasonalIcons[index] : tab.icon;
          const active = isActive(tab.path);
          return (
            <Button
              variant="ghost"
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={cn("tab-item", active && "active")}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="tab-icon" strokeWidth={active ? 2.5 : 2} />
              <span className="tab-label">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
