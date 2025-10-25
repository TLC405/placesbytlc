import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Check } from "lucide-react";
import { toast } from "sonner";

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      toast.info("To install: Tap Share → Add to Home Screen", {
        duration: 5000,
      });
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success("App installed successfully! 🎉");
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in p-4">
      <Card className="shadow-2xl shadow-primary/10 border-2 border-primary/40 overflow-hidden hover:shadow-primary/20 transition-all duration-500 bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-md">
        <div className="h-3 bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-[length:200%_100%]" />
        
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="relative inline-block mx-auto">
            <div className="absolute inset-0 animate-ping opacity-30">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent" />
            </div>
            <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/50 animate-pulse">
              <Smartphone className="w-12 h-12 text-white drop-shadow-xl" />
            </div>
          </div>
          <CardTitle className="text-4xl md:text-5xl font-black gradient-text drop-shadow-xl animate-pulse">
            ✨ Install Queen Felicia's App ✨
          </CardTitle>
          <CardDescription className="text-xl font-bold bg-gradient-to-r from-rose-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            👑 Experience the full royal FELICIA.TLC magic! 👑
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 p-6">
          {isInstalled ? (
            <div className="p-8 bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/40 rounded-2xl space-y-4 shadow-xl animate-scale-in">
              <div className="flex items-center gap-4 justify-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping opacity-30">
                    <Check className="w-10 h-10 text-success" />
                  </div>
                  <Check className="w-10 h-10 text-success relative" />
                </div>
                <h3 className="text-2xl font-black text-success drop-shadow-lg">Already Installed! 🎉</h3>
              </div>
              <p className="text-center text-muted-foreground text-lg font-bold">
                ✨ Queen Felicia's FELICIA.TLC is ready! Look for the royal crown icon on your home screen! 👑
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-card to-card/50 border-2 border-primary/30 rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-black text-lg">1</span>
                  </div>
                  <div>
                    <h4 className="font-black mb-2 text-lg">Works Offline</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                      Access your saved date plans even without internet
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-card to-card/50 border-2 border-accent/30 rounded-2xl hover:border-accent/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-black text-lg">2</span>
                  </div>
                  <div>
                    <h4 className="font-black mb-2 text-lg">Like a Real App</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                      Full-screen experience without browser navigation
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-card to-card/50 border-2 border-success/30 rounded-2xl hover:border-success/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success to-success/70 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-black text-lg">3</span>
                  </div>
                  <div>
                    <h4 className="font-black mb-2 text-lg">Quick Access</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                      Launch instantly from your home screen
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleInstall}
                className="w-full h-20 text-2xl font-black bg-gradient-to-r from-primary via-accent to-primary hover:opacity-90 shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
              >
                <Download className="w-7 h-7 mr-3 animate-bounce" />
                Install Queen Felicia's App
              </Button>

              <div className="p-6 bg-gradient-to-br from-muted/80 to-muted/50 rounded-2xl border-2 border-border/50 shadow-inner">
                <h4 className="font-black mb-4 text-base">📲 How to Install:</h4>
                <ol className="text-sm text-muted-foreground space-y-2 font-medium">
                  <li className="flex items-start gap-3">
                    <span className="font-black text-primary">iPhone:</span>
                    <span>Tap Share → Add to Home Screen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-black text-accent">Android:</span>
                    <span>Tap Menu (⋮) → Install App or Add to Home Screen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-black text-success">Desktop:</span>
                    <span>Look for the install icon in your browser's address bar</span>
                  </li>
                </ol>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
