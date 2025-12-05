import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthPanel } from "@/components/AuthPanel";
import { X } from "lucide-react";

interface AppAuthGateProps {
  children: React.ReactNode;
}

export const AppAuthGate = ({ children }: AppAuthGateProps) => {
  const { isAuthModalOpen, hideLogin } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 300);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in">
          <div className="w-full max-w-md relative">
            <button
              onClick={hideLogin}
              className="absolute -top-14 right-0 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <AuthPanel />
          </div>
        </div>
      )}
    </>
  );
};
