import { useState } from "react";
import { Upload, Sparkles, Loader2 } from "lucide-react";
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
  const [isDragActive, setIsDragActive] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
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
    <div className="comic-border p-10 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-block">
          <div className="w-20 h-20 bg-primary border-4 border-foreground/80 rounded-full flex items-center justify-center transform -rotate-12 shadow-[6px_6px_0px_0px] shadow-foreground/30 toon-pop">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>
        <h3 className="text-4xl md:text-5xl font-black toon-text">Start Your Journey!</h3>
        <p className="text-lg text-foreground/70 font-bold leading-relaxed max-w-2xl mx-auto">
          Upload your photo and AI creates your epic cartoon universe
        </p>
      </div>

      <div className="space-y-6">
        <label 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`block toon-card p-16 text-center cursor-pointer transition-all duration-200 ${
            isDragActive 
              ? 'border-primary bg-primary/10 scale-105 shadow-[8px_8px_0px_0px]' 
              : 'bg-card hover:bg-primary/5'
          } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            disabled={isAnalyzing}
            className="hidden"
          />
          <div className="space-y-6">
            <div className="inline-block">
              <div className="w-24 h-24 bg-primary border-4 border-foreground/80 rounded-2xl flex items-center justify-center transform rotate-6 shadow-[6px_6px_0px_0px] shadow-foreground/30">
                <Upload className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-foreground">
                {isDragActive ? "Drop It Here!" : "Upload Your Selfie"}
              </p>
              <p className="text-base text-foreground/60 font-bold">
                Drag & drop or click to choose
              </p>
            </div>
          </div>
        </label>

        {isAnalyzing && (
          <div className="speech-bubble text-center space-y-6 p-10 bg-primary/10">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-primary border-4 border-foreground/80 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <p className="text-xl font-black text-primary">
              AI is crafting your cartoon universe...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
