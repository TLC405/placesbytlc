import { useState } from "react";
import { Shield, Zap, Crown, User, Settings, LogOut, Lock, Home, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FloatingRobotMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

export const FloatingRobotMenu = ({ isOpen, onClose, position }: FloatingRobotMenuProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasRole } = useUserRole();
  const [showAdminPIN, setShowAdminPIN] = useState(false);
  
  const isAdmin = hasRole('admin');

  if (!isOpen) return null;

  const handleAdminAccess = () => {
    navigate("/admin");
    onClose();
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("✨ Logged out successfully");
      onClose();
      window.location.href = "/";
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleAuth = () => {
    navigate("/auth");
    onClose();
  };

  const menuItems = [
    {
      icon: Home,
      label: "Home",
      action: () => {
        navigate("/");
        onClose();
      },
      color: "text-blue-400",
    },
    {
      icon: user ? LogOut : LogIn,
      label: user ? "Logout" : "Login",
      action: user ? handleLogout : handleAuth,
      color: user ? "text-red-400" : "text-green-400",
    },
    {
      icon: Lock,
      label: "Admin",
      action: handleAdminAccess,
      color: "text-purple-400",
      special: true,
    },
    {
      icon: Settings,
      label: "Settings",
      action: () => {
        navigate("/admin");
        onClose();
      },
      color: "text-orange-400",
    },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-[100]"
        onClick={onClose}
      />
      
      <div
        className="fixed z-[101] bg-black/95 backdrop-blur-xl rounded-2xl border-2 border-green-500/30 shadow-2xl shadow-green-500/50 p-4 min-w-[200px] animate-fade-in"
        style={{
          left: `${Math.min(position.x + 60, window.innerWidth - 220)}px`,
          top: `${Math.min(position.y, window.innerHeight - 300)}px`,
        }}
      >
        <div className="mb-3 pb-3 border-b border-green-500/30">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <div className="text-green-400 font-black text-sm">GUARDIAN BOT</div>
              <div className="text-green-500/70 text-xs font-mono">SYSTEM_MENU</div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-green-500/10 border border-transparent hover:border-green-500/30 ${
                item.special ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10" : ""
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="font-bold text-green-400">{item.label}</span>
              {item.special && <Crown className="w-4 h-4 text-yellow-400 ml-auto" />}
            </button>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-green-500/30 text-center">
          <div className="text-xs text-green-500/50 font-mono">
            {isAdmin ? "ADMIN_ACCESS • AUTHORIZED" : "SECURE_MODE • ACTIVE"}
          </div>
        </div>
      </div>
    </>
  );
};
