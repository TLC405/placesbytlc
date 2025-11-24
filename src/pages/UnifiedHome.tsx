import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, Palette, Upload } from "lucide-react";
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
    
    sessionStorage.setItem("userTheme", JSON.stringify(theme));
    sessionStorage.setItem("userPhoto", photoDataUrl);

    setTimeout(() => {
      if (user) {
        navigate("/cartoonifier");
      } else {
        navigate("/auth", { state: { returnTo: "/cartoonifier" } });
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 overflow-hidden">
      {/* Animated Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[128px] animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 sticky top-0 bg-background/80 backdrop-blur-xl border-b border-primary/20 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <AppLogo />
            <DarkModeToggle />
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center space-y-12 mb-20 animate-fade-in">
          <div className="space-y-8">
            <div className="toon-badge text-base inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI-Powered Transformation Engine
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              <span className="block toon-text mb-4">Transform Into</span>
              <span className="block text-primary text-7xl md:text-9xl">A Cartoon</span>
            </h2>
            <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto font-semibold leading-relaxed">
              Upload your photo → AI generates your custom theme → Choose from 12 epic styles
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto">
            <div className="toon-card px-6 py-3 flex items-center gap-3 bg-primary/10 hover:scale-105 transition-transform">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-base">Face-Lock Tech</span>
            </div>
            <div className="toon-card px-6 py-3 flex items-center gap-3 bg-secondary/10 hover:scale-105 transition-transform">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-base">AI Theme Gen</span>
            </div>
            <div className="toon-card px-6 py-3 flex items-center gap-3 bg-accent/10 hover:scale-105 transition-transform">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-base">12 TV Styles</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto mb-20 space-y-12">
          {!generatedTheme ? (
            <PhotoThemeGenerator onThemeGenerated={handleThemeGenerated} />
          ) : (
            <div className="space-y-10 animate-scale-in">
              <div className="toon-card p-12 space-y-10 bg-gradient-to-br from-card to-primary/5">
                <div className="text-center space-y-6">
                  <div className="inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center shadow-2xl">
                      <Sparkles className="w-12 h-12 text-white animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-5xl md:text-6xl font-black toon-text">Your Universe is Ready!</h3>
                  <p className="text-xl text-foreground/70 font-semibold max-w-2xl mx-auto">
                    {generatedTheme.personalityMatch}
                  </p>
                </div>

                {/* Theme Preview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-3 toon-pop">
                    <div 
                      className="h-28 border-2 border-primary/30 rounded-2xl shadow-xl"
                      style={{ backgroundColor: generatedTheme.primaryColor }}
                    />
                    <p className="text-sm text-center font-bold uppercase tracking-wide">Primary</p>
                  </div>
                  <div className="space-y-3 toon-pop">
                    <div 
                      className="h-28 border-2 border-secondary/30 rounded-2xl shadow-xl"
                      style={{ backgroundColor: generatedTheme.accentColor }}
                    />
                    <p className="text-sm text-center font-bold uppercase tracking-wide">Accent</p>
                  </div>
                  <div className="space-y-3 toon-pop">
                    <div 
                      className="h-28 border-2 border-accent/30 rounded-2xl shadow-xl"
                      style={{ backgroundColor: generatedTheme.backgroundColor }}
                    />
                    <p className="text-sm text-center font-bold uppercase tracking-wide">Background</p>
                  </div>
                  <div className="space-y-3 toon-pop">
                    <div className="h-28 border-2 border-primary/30 rounded-2xl flex items-center justify-center bg-card shadow-xl">
                      <span className="text-5xl">
                        {generatedTheme.vibe === "energetic" ? "⚡" : 
                         generatedTheme.vibe === "calm" ? "🌊" : 
                         generatedTheme.vibe === "playful" ? "🎨" : "✨"}
                      </span>
                    </div>
                    <p className="text-sm text-center font-bold uppercase tracking-wide">{generatedTheme.vibe}</p>
                  </div>
                </div>

                {/* Suggested Style */}
                <div className="toon-card p-6 text-center bg-gradient-to-r from-primary/10 to-secondary/10">
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <span className="text-3xl">🎬</span>
                    <span className="font-black text-xl">Perfect Style: 
                      <span className="toon-text ml-2 capitalize">{generatedTheme.suggestedStyle}</span>
                    </span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="toon-button w-full text-2xl py-10 group relative overflow-hidden"
                  onClick={() => user ? navigate("/cartoonifier") : navigate("/auth", { state: { returnTo: "/cartoonifier" } })}
                >
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                    <span className="font-black">Transform Me Now!</span>
                    <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-5xl md:text-6xl font-black toon-text">How It Works</h3>
            <p className="text-xl text-foreground/70 font-semibold">Three simple steps to cartoon perfection</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="toon-card p-10 text-center space-y-6 bg-gradient-to-br from-primary/10 to-primary/5 toon-pop group">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-glow rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <span className="text-5xl font-black text-white">1</span>
                </div>
                <div className="absolute -top-2 -right-2 text-4xl">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h4 className="text-2xl font-black text-foreground">Upload Photo</h4>
              <p className="text-base text-foreground/70 font-medium leading-relaxed">
                AI analyzes your face, colors, and personality instantly
              </p>
            </div>

            <div className="toon-card p-10 text-center space-y-6 bg-gradient-to-br from-secondary/10 to-secondary/5 toon-pop group">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-secondary to-accent rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <span className="text-5xl font-black text-white">2</span>
                </div>
                <div className="absolute -top-2 -right-2 text-4xl">
                  <Palette className="w-10 h-10 text-secondary" />
                </div>
              </div>
              <h4 className="text-2xl font-black text-foreground">Get Your Theme</h4>
              <p className="text-base text-foreground/70 font-medium leading-relaxed">
                Custom color palette and perfect style match for you
              </p>
            </div>

            <div className="toon-card p-10 text-center space-y-6 bg-gradient-to-br from-accent/10 to-accent/5 toon-pop group">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-primary rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <span className="text-5xl font-black text-white">3</span>
                </div>
                <div className="absolute -top-2 -right-2 text-4xl">
                  <Zap className="w-10 h-10 text-accent" />
                </div>
              </div>
              <h4 className="text-2xl font-black text-foreground">Transform!</h4>
              <p className="text-base text-foreground/70 font-medium leading-relaxed">
                Face-locked magic in 12 epic TV cartoon styles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-primary/20 py-16 px-4 bg-background/80 backdrop-blur-xl mt-24">
        <div className="container mx-auto text-center space-y-6">
          <div className="flex flex-wrap justify-center gap-4">
            <span className="toon-badge text-xs">Face-Lock Tech</span>
            <span className="toon-badge text-xs">AI Theme Gen</span>
            <span className="toon-badge text-xs">12 TV Styles</span>
          </div>
          <p className="text-sm text-foreground/60 font-semibold">
            © 2024 TeeFeeMee by TLC • Powered by AI Magic
          </p>
        </div>
      </footer>
    </div>
  );
}
