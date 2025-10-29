import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, Key, Heart } from "lucide-react";
import { toast } from "sonner";

interface APIKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (key: string, remember: boolean) => void;
  currentKey?: string;
}

export const APIKeyDialog = ({ open, onOpenChange, onSave, currentKey }: APIKeyDialogProps) => {
  const [key, setKey] = useState(currentKey || "");
  const [remember, setRemember] = useState(true);

  const handleSave = () => {
    if (!key.trim()) return;
    
    const secretCode = 'tlcinokc';
    const enteredKey = key.trim().toLowerCase();
    
    if (enteredKey === secretCode) {
      // If the secret code is entered, use the stored API key
      // API key should be configured via environment or secure method
      const storedKey = localStorage.getItem('gm_api_key_secure');
      if (storedKey) {
        onSave(storedKey, remember);
        onOpenChange(false);
      } else {
        toast.error("API key not configured. Contact administrator.");
      }
    } else {
      toast.error("That's not the right code! Try again 💕");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && key.trim()) {
      handleSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] border-primary/20 shadow-glow">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-romantic animate-bounce-in">
              <Key className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl gradient-text">Key to TLC's Heart 🔑💕</DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed">
            🗺️ Enter your Google Maps API key to unlock location features! 
            Enter the enchanted key below to discover all the amazing date spots waiting for us. 
            This special key opens up a kingdom of possibilities for our journey together. ✨💕
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-4">
            <Label htmlFor="apiKey" className="text-base font-semibold">Enter the Secret Code 💕</Label>
            <Input
              id="apiKey"
              placeholder="Type the magic words..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center text-lg h-14 shadow-sm focus:shadow-glow transition-all"
              autoFocus
            />
            <div className="flex justify-center">
              <Button 
                onClick={handleSave}
                disabled={!key.trim()}
                size="lg"
                className="w-32 h-32 rounded-full shadow-glow hover:shadow-romantic transition-all hover:scale-110 disabled:opacity-50 disabled:scale-100"
              >
                <Heart className="w-16 h-16 fill-current" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">Hint: It's the special code TLC gave you 🔑</p>
          </div>

          <div className="flex items-center space-x-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked as boolean)}
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium cursor-pointer select-none flex items-center gap-1"
            >
              💝 Keep this key safe in my browser
            </label>
          </div>

          <div className="rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🗝️</span>
              <p className="font-semibold text-foreground">Need your own API key?</p>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-2">
              <li>Visit <span className="font-medium text-foreground">Google Cloud Console</span></li>
              <li>Create a project and enable <span className="font-medium text-foreground">Places API</span></li>
              <li>Create credentials (API key) and copy it</li>
              <li>Come back and paste it above! 💕</li>
            </ol>
            <a
              href="https://developers.google.com/maps/documentation/javascript/get-api-key"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm mt-2 hover:underline transition-all"
            >
              📖 Step-by-Step Guide
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="shadow-sm">
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
