import { useLocation, useNavigate } from "react-router-dom";
import { Home, Brain, Crosshair, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "psych", label: "Mind", icon: Brain, path: "/quizzes" },
  { id: "recon", label: "Dates", icon: Crosshair, path: "/recon" },
  { id: "cycle", label: "Sync", icon: Droplets, path: "/her-cycle" },
];

export function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="tab-bar">
      <div className="tab-bar-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={cn("tab-item", active && "active")}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="tab-icon" strokeWidth={active ? 2.5 : 2} />
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
