import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface GeneratedTheme {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  suggestedStyle: string;
  vibe: "energetic" | "calm" | "playful" | "sophisticated";
  dominantColors: string[];
  personalityMatch: string;
}

interface PhotoThemeGeneratorProps {
  onThemeGenerated: (theme: GeneratedTheme, photoDataUrl: string) => void;
}

export function PhotoThemeGenerator({ onThemeGenerated }: PhotoThemeGeneratorProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setPreview(dataUrl);
      await analyzePhotoAndGenerateTheme(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const analyzePhotoAndGenerateTheme = async (photoDataUrl: string) => {
    setAnalyzing(true);
    
    try {
      // Call edge function to analyze photo and generate theme
      const { data, error } = await supabase.functions.invoke("analyze-photo-theme", {
        body: { 
          image: photoDataUrl.split(",")[1] 
        },
      });

      if (error) throw error;

      const theme: GeneratedTheme = data.theme;
      
      toast.success("✨ Your Cartoon Universe Created!", {
        description: `${theme.personalityMatch} • ${theme.vibe} vibes`,
      });

      onThemeGenerated(theme, photoDataUrl);
    } catch (error: any) {
      toast.error("Theme Generation Failed", {
        description: error.message || "Try another photo",
      });
      setPreview(null);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Card className="premium-card border-4 border-primary/30 overflow-hidden">
      <CardContent className="p-0">
        {!preview ? (
          <label className="cursor-pointer block">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={analyzing}
            />
            <div className="min-h-[400px] flex flex-col items-center justify-center p-12 space-y-6 hover:bg-muted/30 transition-all">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center premium-glow">
                  <Camera className="w-16 h-16 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <h3 className="text-3xl font-black cartoon-text text-foreground">
                  Upload Your Photo
                </h3>
                <p className="text-muted-foreground font-semibold max-w-md">
                  AI will analyze your face and generate a personalized cartoon universe just for you
                </p>
              </div>

              <Button size="lg" variant="premium" className="px-12 py-6 text-xl">
                <Upload className="w-6 h-6 mr-3" />
                Choose Your Photo
              </Button>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="cartoon-badge">✓ Face Detection</span>
                <span className="cartoon-badge">✓ Color Analysis</span>
                <span className="cartoon-badge">✓ Style Matching</span>
              </div>
            </div>
          </label>
        ) : (
          <div className="relative">
            {analyzing && (
              <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 space-y-4">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <div className="text-center space-y-2">
                  <p className="text-xl font-bold cartoon-text">Analyzing Your Photo...</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>🔍 Detecting facial features</p>
                    <p>🎨 Extracting color palette</p>
                    <p>✨ Matching cartoon style</p>
                    <p>🌈 Generating your universe</p>
                  </div>
                </div>
              </div>
            )}
            <img 
              src={preview} 
              alt="Your photo" 
              className="w-full h-[400px] object-cover"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}