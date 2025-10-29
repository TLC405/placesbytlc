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
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in p-4">
      <Card className="shadow-glow border-2 border-primary/30 overflow-hidden">
        <div className="h-3 bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-[length:200%_100%]" />
        
        <CardHeader className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-black gradient-text">
            Install FELICIA.TLC
          </CardTitle>
          <CardDescription className="text-lg">
            Get the full app experience on your phone!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {isInstalled ? (
            <div className="p-6 bg-success/10 border-2 border-success/30 rounded-xl space-y-3">
              <div className="flex items-center gap-3 justify-center">
                <Check className="w-8 h-8 text-success" />
                <h3 className="text-xl font-bold text-success">Already Installed! 🎉</h3>
              </div>
              <p className="text-center text-muted-foreground">
                FELICIA.TLC is installed on your device. Look for the app icon on your home screen!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-card border-2 border-border rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Works Offline</h4>
                    <p className="text-sm text-muted-foreground">
                      Access your saved date plans even without internet
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card border-2 border-border rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Like a Real App</h4>
                    <p className="text-sm text-muted-foreground">
                      Full-screen experience without browser navigation
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card border-2 border-border rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-success font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Quick Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Launch instantly from your home screen
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleInstall}
                className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-glow"
              >
                <Download className="w-6 h-6 mr-2" />
                Install App
              </Button>

              <div className="p-4 bg-muted/50 rounded-xl">
                <h4 className="font-semibold mb-2 text-sm">How to Install (iOS/Android):</h4>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li><strong>iPhone:</strong> Tap Share → Add to Home Screen</li>
                  <li><strong>Android:</strong> Tap Menu (⋮) → Install App or Add to Home Screen</li>
                  <li><strong>Desktop:</strong> Look for the install icon in your browser's address bar</li>
                </ol>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
