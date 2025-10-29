import { ReactNode } from "react";
import { useUserRole, UserRole } from "@/hooks/useUserRole";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Sparkles, Crown, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface RoleGuardProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  allowedRoles?: UserRole[];
  fallbackMessage?: string;
  featureName?: string;
}

const roleInfo: Record<UserRole, { icon: React.ReactNode; color: string; name: string }> = {
  admin: { icon: <Crown className="w-6 h-6" />, color: "text-yellow-400", name: "Admin" },
  moderator: { icon: <Shield className="w-6 h-6" />, color: "text-purple-400", name: "Moderator" },
  alpha: { icon: <Sparkles className="w-6 h-6" />, color: "text-blue-400", name: "Alpha Tester" },
  beta: { icon: <Zap className="w-6 h-6" />, color: "text-green-400", name: "Beta Tester" },
  delta: { icon: <Sparkles className="w-6 h-6" />, color: "text-cyan-400", name: "Delta Tester" },
  user: { icon: <Shield className="w-6 h-6" />, color: "text-gray-400", name: "User" },
};

export const RoleGuard = ({ 
  children, 
  requiredRoles,
  allowedRoles,
  fallbackMessage,
  featureName = "This feature"
}: RoleGuardProps) => {
  const { hasAnyRole, isLoading, userId } = useUserRole();
  const { showLogin } = useAuth();
  
  const roles = allowedRoles || requiredRoles || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Not logged in
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <Card className="max-w-md w-full p-8 bg-slate-900/50 border-2 border-green-500/30 shadow-2xl backdrop-blur">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Lock className="w-16 h-16 text-green-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-green-400 mb-2 font-mono">
                [ ACCESS REQUIRED ]
              </h2>
              <p className="text-green-300/80 font-mono text-sm">
                {featureName} requires authentication
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-green-400/60 font-mono">
                REQUIRED CLEARANCE LEVELS:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {roles.map(role => {
                  const info = roleInfo[role];
                  return (
                    <div key={role} className={`flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-green-500/20 ${info.color}`}>
                      {info.icon}
                      <span className="text-xs font-mono font-bold">{info.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <Button 
              onClick={showLogin}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-bold font-mono"
            >
              [ AUTHENTICATE ]
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Logged in but insufficient role
  if (!hasAnyRole(roles)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <Card className="max-w-md w-full p-8 bg-slate-900/50 border-2 border-red-500/30 shadow-2xl backdrop-blur">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Shield className="w-16 h-16 text-red-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-red-400 mb-2 font-mono">
                [ ACCESS DENIED ]
              </h2>
              <p className="text-red-300/80 font-mono text-sm">
                {fallbackMessage || `${featureName} is available only to specific roles`}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-red-400/60 font-mono">
                REQUIRED CLEARANCE LEVELS:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {roles.map(role => {
                  const info = roleInfo[role];
                  return (
                    <div key={role} className={`flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-red-500/20 ${info.color}`}>
                      {info.icon}
                      <span className="text-xs font-mono font-bold">{info.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg border border-red-500/20">
              <p className="text-xs text-red-300/60 font-mono">
                Contact an administrator to request access or participate in beta testing programs.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
