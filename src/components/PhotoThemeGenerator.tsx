import { useState, useRef } from "react";
import { Upload, Sparkles } from "lucide-react";
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
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
      await analyzePhotoAndGenerateTheme(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const analyzePhotoAndGenerateTheme = async (photoDataUrl: string) => {
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("analyze-photo-theme", {
        body: { image: photoDataUrl.split(",")[1] },
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
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Main Upload Area */}
      <div
        className={`toon-card transition-all duration-500 ${
          isDragging ? 'scale-[1.02] shadow-[0_0_60px_rgba(168,85,247,0.4)]' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-12 text-center space-y-8">
          {!isAnalyzing && (
            <>
              <div className="text-center space-y-4">
                <div className="inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-4xl md:text-5xl font-black toon-text">Start Your Journey</h3>
                <p className="text-lg text-foreground/70 font-semibold leading-relaxed max-w-2xl mx-auto">
                  Upload your photo and watch AI create your personalized cartoon universe
                </p>
              </div>

              <div 
                className="group cursor-pointer p-16 rounded-3xl border-2 border-dashed border-primary/40 hover:border-primary transition-all duration-300 bg-gradient-to-br from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10" 
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-6">
                  <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-14 h-14 text-white animate-bounce" />
                  </div>
                  <h4 className="text-4xl font-black">
                    <span className="toon-text">Upload Your Photo</span>
                  </h4>
                  <p className="text-xl text-foreground/70 font-medium max-w-md mx-auto">
                    Drop your image here or click to browse
                  </p>
                  <div className="toon-badge inline-flex items-center gap-3 text-base">
                    <Sparkles className="w-5 h-5" />
                    <span>AI will generate your personalized cartoon theme</span>
                  </div>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </>
          )}

          {isAnalyzing && (
            <div className="animate-fade-in space-y-8">
              <div className="flex flex-col items-center gap-8">
                <div className="relative">
                  <div className="w-24 h-24 border-8 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-4xl font-black">
                    <span className="toon-text">AI Analyzing Your Photo</span>
                  </h3>
                  <p className="text-xl text-foreground/70 font-semibold">
                    Generating your personalized cartoon universe...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
