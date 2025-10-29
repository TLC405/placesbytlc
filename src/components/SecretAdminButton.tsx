import { useState } from "react";
import { Shield, Lock, Unlock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const SecretAdminButton = () => {
  const [clicks, setClicks] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    
    if (newClicks === 5) {
      setShowSecret(true);
      toast.success("🔓 Secret Admin Access Unlocked!", {
        description: "Click the shield to enter admin panel",
        duration: 5000,
      });
      
      setTimeout(() => {
        setClicks(0);
        setShowSecret(false);
      }, 10000);
    } else if (newClicks === 1) {
      setTimeout(() => setClicks(0), 3000);
    }
  };

  const handleAdminClick = () => {
    navigate("/admin");
    setShowSecret(false);
    setClicks(0);
  };

  return (
    <div className="fixed bottom-4 left-4 z-[80]">
      {showSecret ? (
        <button
          onClick={handleAdminClick}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-bounce border-2 border-white/50 hover:scale-110 transition-transform"
        >
          <Unlock className="w-6 h-6 text-white" />
        </button>
      ) : (
        <button
          onClick={handleClick}
          className="w-3 h-3 rounded-full bg-muted/30 hover:bg-muted/50 transition-colors"
          title="Secret"
        >
          <span className="sr-only">Secret button (click 5x)</span>
        </button>
      )}
    </div>
  );
};
