import { useLocation, useNavigate } from "react-router-dom";
import { Home, Crosshair, Droplets, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const tabs = [
  { id: "home", label: "Home", icon: Home, path: "/", iconIndex: 0 },
  { id: "recon", label: "Dates", icon: Crosshair, path: "/recon", iconIndex: 2 },
  { id: "cycle", label: "Cycle", icon: Droplets, path: "/her-cycle", iconIndex: 3 },
  { id: "sync", label: "Sync", icon: Link2, path: "/sync", iconIndex: 4 },
];

export function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTheme, themes } = useTheme();

  const isActive = (path: string) => {
    if (path === "/") return ["/", "/index"].includes(location.pathname) || location.pathname.startsWith("/quiz");
    if (path === "/recon") return ["/recon", "/places", "/ai-recommender"].includes(location.pathname);
    if (path === "/her-cycle") return ["/her-cycle", "/cycle"].includes(location.pathname);
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="tab-bar" aria-label="Main navigation">
      <div className="tab-bar-inner">
        {tabs.map((tab) => {
          const Icon = themes[currentTheme].navIcons[tab.iconIndex] || tab.icon;
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
