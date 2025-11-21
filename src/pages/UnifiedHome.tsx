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
      {/* Comic Book Pattern Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, hsl(var(--foreground)) 0px, transparent 1px, transparent 20px),
                           repeating-linear-gradient(90deg, hsl(var(--foreground)) 0px, transparent 1px, transparent 20px)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Header */}
      <header className="border-b-4 border-foreground/20 sticky top-0 z-50 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <AppLogo />
            <DarkModeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center space-y-10 mb-16 bounce-in">
          <div className="space-y-6">
            <div className="inline-block toon-badge text-base">
              🎨 AI-Powered Cartoon Magic
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              <span className="block text-foreground toon-text transform -rotate-1">Your Face.</span>
              <span className="block text-primary toon-text transform rotate-1">Your Cartoon.</span>
              <span className="block text-accent toon-text transform -rotate-1">Your Universe!</span>
            </h2>
            <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto font-bold leading-relaxed">
              Upload a selfie → Get your custom cartoon theme → Transform into 12 epic TV styles!
            </p>
          </div>

          {/* Feature Cards */}
          <div className="flex flex-wrap gap-6 justify-center max-w-4xl mx-auto">
            <div className="toon-card px-8 py-4 flex items-center gap-3 bg-primary/10">
              <div className="w-12 h-12 bg-primary border-3 border-foreground/80 rounded-xl flex items-center justify-center transform -rotate-6">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-black text-base">Face-Lock Tech</span>
            </div>
            <div className="toon-card px-8 py-4 flex items-center gap-3 bg-accent/10">
              <div className="w-12 h-12 bg-accent border-3 border-foreground/80 rounded-xl flex items-center justify-center transform rotate-6">
                <Palette className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="font-black text-base">AI Theme Gen</span>
            </div>
            <div className="toon-card px-8 py-4 flex items-center gap-3 bg-secondary/10">
              <div className="w-12 h-12 bg-secondary border-3 border-foreground/80 rounded-xl flex items-center justify-center transform -rotate-3">
                <Zap className="w-6 h-6 text-secondary-foreground" />
              </div>
              <span className="font-black text-base">12 TV Styles</span>
            </div>
          </div>
        </div>

        {/* Main Photo Upload / Theme Display */}
        <div className="max-w-3xl mx-auto mb-16">
          {!generatedTheme ? (
            <PhotoThemeGenerator onThemeGenerated={handleThemeGenerated} />
          ) : (
            <div className="space-y-8 bounce-in">
              {/* Generated Theme Display */}
              <div className="comic-border p-10 space-y-8">
                <div className="text-center space-y-4">
                  <div className="inline-block">
                    <div className="w-20 h-20 bg-primary border-4 border-foreground/80 rounded-full flex items-center justify-center transform rotate-12 shadow-[6px_6px_0px_0px] shadow-foreground/30">
                      <Sparkles className="w-10 h-10 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black toon-text">Your Universe is Ready!</h3>
                  <p className="text-lg text-foreground/70 font-bold">
                    {generatedTheme.personalityMatch}
                  </p>
                </div>

                {/* Theme Preview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-3 toon-pop">
                    <div 
                      className="h-24 border-4 border-foreground/80 rounded-2xl shadow-[4px_4px_0px_0px] shadow-foreground/20"
                      style={{ backgroundColor: generatedTheme.primaryColor }}
                    />
                    <p className="text-sm text-center font-black uppercase">Primary</p>
                  </div>
                  <div className="space-y-3 toon-pop">
                    <div 
                      className="h-24 border-4 border-foreground/80 rounded-2xl shadow-[4px_4px_0px_0px] shadow-foreground/20"
                      style={{ backgroundColor: generatedTheme.accentColor }}
                    />
                    <p className="text-sm text-center font-black uppercase">Accent</p>
                  </div>
                  <div className="space-y-3 toon-pop">
                    <div 
                      className="h-24 border-4 border-foreground/80 rounded-2xl shadow-[4px_4px_0px_0px] shadow-foreground/20"
                      style={{ backgroundColor: generatedTheme.backgroundColor }}
                    />
                    <p className="text-sm text-center font-black uppercase">Background</p>
                  </div>
                  <div className="space-y-3 toon-pop">
                    <div className="h-24 border-4 border-foreground/80 rounded-2xl flex items-center justify-center bg-card shadow-[4px_4px_0px_0px] shadow-foreground/20">
                      <span className="text-4xl">{generatedTheme.vibe === "energetic" ? "⚡" : generatedTheme.vibe === "calm" ? "🌊" : generatedTheme.vibe === "playful" ? "🎨" : "✨"}</span>
                    </div>
                    <p className="text-sm text-center font-black uppercase">{generatedTheme.vibe}</p>
                  </div>
                </div>

                {/* Suggested Style */}
                <div className="text-center">
                  <div className="speech-bubble inline-block">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🎬</span>
                      <span className="font-black text-lg">Perfect Style: <span className="text-primary">{generatedTheme.suggestedStyle}</span></span>
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full text-xl py-8 toon-button bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => user ? navigate("/cartoonifier") : navigate("/auth", { state: { returnTo: "/cartoonifier" } })}
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                  <span className="font-black">Transform Me Now!</span>
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h3 className="text-5xl font-black toon-text transform -rotate-1">How It Works</h3>
            <p className="text-xl text-foreground/70 font-bold">Three super simple steps!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="toon-card p-8 text-center space-y-6 bg-primary/5 transform hover:scale-105 transition-transform">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-primary border-4 border-foreground/80 rounded-2xl flex items-center justify-center transform -rotate-6 shadow-[6px_6px_0px_0px] shadow-foreground/30">
                  <span className="text-4xl font-black">1</span>
                </div>
                <div className="absolute -top-2 -right-2 text-3xl">📸</div>
              </div>
              <h4 className="text-2xl font-black text-foreground">Upload Photo</h4>
              <p className="text-base text-foreground/70 font-bold leading-relaxed">
                AI analyzes your face, colors, and personality instantly
              </p>
            </div>

            <div className="toon-card p-8 text-center space-y-6 bg-accent/5 transform hover:scale-105 transition-transform">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-accent border-4 border-foreground/80 rounded-2xl flex items-center justify-center transform rotate-6 shadow-[6px_6px_0px_0px] shadow-foreground/30">
                  <span className="text-4xl font-black">2</span>
                </div>
                <div className="absolute -top-2 -right-2 text-3xl">🎨</div>
              </div>
              <h4 className="text-2xl font-black text-foreground">Get Your Theme</h4>
              <p className="text-base text-foreground/70 font-bold leading-relaxed">
                Custom color palette and perfect style match for you
              </p>
            </div>

            <div className="toon-card p-8 text-center space-y-6 bg-secondary/5 transform hover:scale-105 transition-transform">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-secondary border-4 border-foreground/80 rounded-2xl flex items-center justify-center transform -rotate-3 shadow-[6px_6px_0px_0px] shadow-foreground/30">
                  <span className="text-4xl font-black">3</span>
                </div>
                <div className="absolute -top-2 -right-2 text-3xl">⚡</div>
              </div>
              <h4 className="text-2xl font-black text-foreground">Transform!</h4>
              <p className="text-base text-foreground/70 font-bold leading-relaxed">
                Face-locked magic in 12 epic TV cartoon styles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-4 border-foreground/20 py-16 px-4 bg-card/50 backdrop-blur-md mt-24">
        <div className="container mx-auto text-center space-y-6">
          <div className="flex flex-wrap justify-center gap-4">
            <span className="toon-badge text-xs">🔒 Face-Lock Tech</span>
            <span className="toon-badge text-xs">🎨 AI Theme Gen</span>
            <span className="toon-badge text-xs">⚡ 12 TV Styles</span>
          </div>
          <p className="text-sm text-foreground/60 font-bold">
            © 2024 TeeFeeMee by TLC • Powered by Cartoon Magic 🪄
          </p>
        </div>
      </footer>
    </div>
  );
}