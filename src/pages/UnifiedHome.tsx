import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, Shield, Palette } from "lucide-react";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { AppLogo } from "@/components/AppLogo";
import { PhotoThemeGenerator, GeneratedTheme } from "@/components/PhotoThemeGenerator";
import { useAuth } from "@/contexts/AuthContext";

export default function UnifiedHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [generatedTheme, setGeneratedTheme] = useState<GeneratedTheme | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  const handleThemeGenerated = (theme: GeneratedTheme, photoDataUrl: string) => {
    setGeneratedTheme(theme);
    setUserPhoto(photoDataUrl);
    
    // Store in session for cartoonifier page
    sessionStorage.setItem("userTheme", JSON.stringify(theme));
    sessionStorage.setItem("userPhoto", photoDataUrl);

    // Auto-navigate after 2 seconds
    setTimeout(() => {
      if (user) {
        navigate("/cartoonifier");
      } else {
        navigate("/auth", { state: { returnTo: "/cartoonifier" } });
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl floating-cartoon" />
        <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl floating-cartoon" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 rounded-full bg-primary/5 blur-3xl floating-cartoon" style={{animationDelay: '2s'}} />
      </div>

      {/* Header */}
      <header className="border-b-2 border-primary/20 backdrop-blur-xl sticky top-0 z-50 bg-background/90 premium-glow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="sticker-effect">
                <AppLogo />
              </div>
              <div>
                <h1 className="text-2xl cartoon-text text-foreground">ToonMe Studios</h1>
                <span className="cartoon-badge text-xs">Photo-Powered Themes</span>
              </div>
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16 pop-in">
          <div className="space-y-4">
            <div className="inline-block">
              <span className="cartoon-badge text-lg px-6 py-2">
                🚀 Revolutionary AI Technology
              </span>
            </div>
            <h2 className="text-6xl md:text-7xl cartoon-text text-foreground leading-tight">
              Your Face.<br />
              <span className="text-primary">Your Universe.</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-semibold">
              Upload your photo → AI creates your personalized cartoon theme → Transform with perfect face-lock technology
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="premium-card px-6 py-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm">Face-Locked Identity</span>
            </div>
            <div className="premium-card px-6 py-3 flex items-center gap-2">
              <Palette className="w-5 h-5 text-accent" />
              <span className="font-bold text-sm">AI Theme Generation</span>
            </div>
            <div className="premium-card px-6 py-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm">12 Cartoon Styles</span>
            </div>
          </div>
        </div>

        {/* Main Photo Upload / Theme Display */}
        <div className="max-w-3xl mx-auto mb-16">
          {!generatedTheme ? (
            <PhotoThemeGenerator onThemeGenerated={handleThemeGenerated} />
          ) : (
            <div className="space-y-6 pop-in">
              {/* Generated Theme Display */}
              <div className="premium-card p-8 space-y-6">
                <div className="text-center space-y-3">
                  <div className="inline-block">
                    <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-black cartoon-text">Your Universe is Ready!</h3>
                  <p className="text-muted-foreground font-semibold">
                    {generatedTheme.personalityMatch}
                  </p>
                </div>

                {/* Theme Preview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div 
                      className="h-20 rounded-xl border-2 border-primary/20 premium-glow"
                      style={{ backgroundColor: generatedTheme.primaryColor }}
                    />
                    <p className="text-xs text-center font-bold">Primary</p>
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="h-20 rounded-xl border-2 border-primary/20"
                      style={{ backgroundColor: generatedTheme.accentColor }}
                    />
                    <p className="text-xs text-center font-bold">Accent</p>
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="h-20 rounded-xl border-2 border-primary/20"
                      style={{ backgroundColor: generatedTheme.backgroundColor }}
                    />
                    <p className="text-xs text-center font-bold">Background</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 rounded-xl border-2 border-primary/20 flex items-center justify-center bg-muted">
                      <span className="text-3xl">{generatedTheme.vibe === "energetic" ? "⚡" : generatedTheme.vibe === "calm" ? "🌊" : generatedTheme.vibe === "playful" ? "🎨" : "✨"}</span>
                    </div>
                    <p className="text-xs text-center font-bold capitalize">{generatedTheme.vibe}</p>
                  </div>
                </div>

                {/* Suggested Style */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 cartoon-badge text-base px-6 py-3">
                    <span className="text-2xl">🎬</span>
                    <span>Suggested Style: <strong>{generatedTheme.suggestedStyle}</strong></span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  variant="premium" 
                  className="w-full text-xl py-8"
                  onClick={() => user ? navigate("/cartoonifier") : navigate("/auth", { state: { returnTo: "/cartoonifier" } })}
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                  Transform Me Now
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h3 className="text-4xl cartoon-text text-foreground mb-3">How It Works</h3>
            <p className="text-muted-foreground font-semibold">Three simple steps to your cartoon universe</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="premium-card p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto premium-glow">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h4 className="text-xl font-black text-foreground">Upload Photo</h4>
              <p className="text-sm text-muted-foreground">
                AI analyzes your face, colors, and personality
              </p>
            </div>

            <div className="premium-card p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto premium-glow">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h4 className="text-xl font-black text-foreground">Get Your Theme</h4>
              <p className="text-sm text-muted-foreground">
                Personalized color palette and style recommendations
              </p>
            </div>

            <div className="premium-card p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto premium-glow">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h4 className="text-xl font-black text-foreground">Transform</h4>
              <p className="text-sm text-muted-foreground">
                Face-locked cartoonification in 12 TV styles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-primary/20 py-12 px-4 bg-card/50 backdrop-blur-xl mt-20">
        <div className="container mx-auto text-center space-y-4">
          <p className="text-sm text-muted-foreground font-semibold">
            🔒 Face-Lock Technology • 🎨 AI Theme Generation • ✨ Perfect Identity Preservation
          </p>
          <p className="text-xs text-muted-foreground">
            © 2024 ToonMe Studios • Powered by Advanced AI
          </p>
        </div>
      </footer>
    </div>
  );
}