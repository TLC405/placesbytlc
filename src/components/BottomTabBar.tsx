import { useLocation, useNavigate } from "react-router-dom";
import { Home, MapPin, Sparkles, ClipboardList, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "places", label: "Places", icon: MapPin, path: "/okc-legend" },
  { id: "cupid", label: "Cupid", icon: Sparkles, path: "/ai-recommender" },
  { id: "quizzes", label: "Quizzes", icon: ClipboardList, path: "/quizzes" },
  { id: "profile", label: "Profile", icon: User, path: "/auth" },
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
