import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthPanel } from "@/components/AuthPanel";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AppAuthGateProps {
  children: React.ReactNode;
}

export const AppAuthGate = ({ children }: AppAuthGateProps) => {
  const { isAuthModalOpen, hideLogin } = useAuth();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Quick load check
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-green-400" />
          <p className="text-green-400 animate-pulse font-mono">INITIALIZING SYSTEM...</p>
        </div>
      </div>
    );
  }

  // Show auth panel as floating modal when triggered
  return (
    <>
      {children}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md relative">
            <button
              onClick={hideLogin}
              className="absolute -top-12 right-0 text-green-400 hover:text-green-300 transition-colors font-mono text-xl font-bold"
            >
              [X] CLOSE
            </button>
            <AuthPanel />
          </div>
        </div>
      )}
    </>
  );
};
