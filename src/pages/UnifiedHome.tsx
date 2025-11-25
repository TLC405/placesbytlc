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
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="relative z-10 sticky top-0 bg-card border-b-4 border-primary shadow-lg">
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
            <div className="cartoon-badge inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI-Powered Transformation
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tight leading-none">
              <span className="block cartoon-title mb-4">Turn Into</span>
              <span className="block text-primary text-7xl md:text-9xl">Your Cartoon!</span>
            </h2>
            <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto font-bold leading-relaxed">
              Upload Photo → Get AI Theme → Pick 12 Styles → Download Magic ✨
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto">
            <div className="cartoon-pill">
              <div className="cartoon-icon-box bg-primary">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-lg">Face-Lock Tech</span>
            </div>
            <div className="cartoon-pill">
              <div className="cartoon-icon-box bg-secondary">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-lg">AI Theme Gen</span>
            </div>
            <div className="cartoon-pill">
              <div className="cartoon-icon-box bg-accent">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-lg">12 Epic Styles</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto mb-20 space-y-12">
          {!generatedTheme ? (
            <PhotoThemeGenerator onThemeGenerated={handleThemeGenerated} />
          ) : (
            <div className="space-y-10 animate-scale-in">
              <div className="cartoon-card p-12 space-y-10">
                <div className="text-center space-y-6">
                  <div className="inline-block">
                    <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-2xl border-8 border-primary/20">
                      <Sparkles className="w-16 h-16 text-white animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-5xl md:text-6xl font-black cartoon-title">Your Theme is Ready! 🎉</h3>
                  <p className="text-2xl text-foreground/80 font-black max-w-2xl mx-auto">
                    {generatedTheme.personalityMatch}
                  </p>
                </div>

                {/* Theme Preview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-3 animate-bounce-pop">
                    <div 
                      className="h-32 border-8 border-foreground/10 rounded-3xl shadow-2xl"
                      style={{ backgroundColor: generatedTheme.primaryColor }}
                    />
                    <p className="text-sm text-center font-black uppercase tracking-wider">Primary</p>
                  </div>
                  <div className="space-y-3 animate-bounce-pop">
                    <div 
                      className="h-32 border-8 border-foreground/10 rounded-3xl shadow-2xl"
                      style={{ backgroundColor: generatedTheme.accentColor }}
                    />
                    <p className="text-sm text-center font-black uppercase tracking-wider">Accent</p>
                  </div>
                  <div className="space-y-3 animate-bounce-pop">
                    <div 
                      className="h-32 border-8 border-foreground/10 rounded-3xl shadow-2xl"
                      style={{ backgroundColor: generatedTheme.backgroundColor }}
                    />
                    <p className="text-sm text-center font-black uppercase tracking-wider">Background</p>
                  </div>
                  <div className="space-y-3 animate-bounce-pop">
                    <div className="h-32 border-8 border-foreground/10 rounded-3xl flex items-center justify-center bg-card shadow-2xl">
                      <span className="text-6xl">
                        {generatedTheme.vibe === "energetic" ? "⚡" : 
                         generatedTheme.vibe === "calm" ? "🌊" : 
                         generatedTheme.vibe === "playful" ? "🎨" : "✨"}
                      </span>
                    </div>
                    <p className="text-sm text-center font-black uppercase tracking-wider">{generatedTheme.vibe}</p>
                  </div>
                </div>

                {/* Suggested Style */}
                <div className="cartoon-card p-8 text-center bg-secondary/20">
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <span className="text-5xl">🎬</span>
                    <span className="font-black text-2xl">Best Style For You: 
                      <span className="cartoon-title ml-3 capitalize text-primary">{generatedTheme.suggestedStyle}</span>
                    </span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="cartoon-button w-full text-3xl py-12 group"
                  onClick={() => user ? navigate("/cartoonifier") : navigate("/auth", { state: { returnTo: "/cartoonifier" } })}
                >
                  <span className="flex items-center justify-center gap-4">
                    <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                    <span className="font-black">Transform Now! 🚀</span>
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-5xl md:text-6xl font-black cartoon-title">How It Works 🎯</h3>
            <p className="text-xl text-foreground/80 font-bold">Three super simple steps!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="cartoon-card p-10 text-center space-y-6 animate-bounce-pop group">
              <div className="relative inline-block">
                <div className="w-28 h-28 bg-primary rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform border-8 border-primary/20">
                  <span className="text-6xl font-black text-white">1</span>
                </div>
                <div className="absolute -top-3 -right-3 text-5xl">
                  <Upload className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h4 className="text-3xl font-black text-foreground">Upload Photo 📸</h4>
              <p className="text-lg text-foreground/70 font-bold leading-relaxed">
                AI scans your face and colors instantly!
              </p>
            </div>

            <div className="cartoon-card p-10 text-center space-y-6 animate-bounce-pop group">
              <div className="relative inline-block">
                <div className="w-28 h-28 bg-secondary rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform border-8 border-secondary/20">
                  <span className="text-6xl font-black text-white">2</span>
                </div>
                <div className="absolute -top-3 -right-3 text-5xl">
                  <Palette className="w-12 h-12 text-secondary" />
                </div>
              </div>
              <h4 className="text-3xl font-black text-foreground">Get Theme 🎨</h4>
              <p className="text-lg text-foreground/70 font-bold leading-relaxed">
                Custom colors & perfect style match!
              </p>
            </div>

            <div className="cartoon-card p-10 text-center space-y-6 animate-bounce-pop group">
              <div className="relative inline-block">
                <div className="w-28 h-28 bg-accent rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform border-8 border-accent/20">
                  <span className="text-6xl font-black text-white">3</span>
                </div>
                <div className="absolute -top-3 -right-3 text-5xl">
                  <Zap className="w-12 h-12 text-accent" />
                </div>
              </div>
              <h4 className="text-3xl font-black text-foreground">Transform! ⚡</h4>
              <p className="text-lg text-foreground/70 font-bold leading-relaxed">
                Face-locked in 12 TV cartoon styles!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t-4 border-primary py-16 px-4 bg-card mt-24">
        <div className="container mx-auto text-center space-y-6">
          <div className="flex flex-wrap justify-center gap-4">
            <span className="cartoon-badge">Face-Lock Tech</span>
            <span className="cartoon-badge">AI Theme Gen</span>
            <span className="cartoon-badge">12 TV Styles</span>
          </div>
          <p className="text-lg text-foreground/80 font-black">
            © 2025 TeeFeeMee by TLC • Powered by AI ✨
          </p>
        </div>
      </footer>
    </div>
  );
}
