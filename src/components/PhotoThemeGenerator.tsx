import { useState, useRef } from "react";
import { Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div
      className={`cartoon-card p-12 text-center space-y-8 cursor-pointer transition-all ${
        isDragging ? "border-primary bg-primary/10 scale-105" : "hover:scale-105"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isAnalyzing && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {!isAnalyzing ? (
        <>
          <div className="space-y-6">
            <div className="w-40 h-40 mx-auto bg-primary rounded-full flex items-center justify-center shadow-2xl border-8 border-primary/20">
              <Upload className="w-20 h-20 text-white" />
            </div>
            <div className="space-y-4">
              <h3 className="text-5xl md:text-6xl font-black cartoon-title">Upload Photo! 📸</h3>
              <p className="text-2xl text-foreground/80 font-bold max-w-2xl mx-auto leading-relaxed">
                AI analyzes your face & creates custom theme instantly! ✨
              </p>
            </div>
          </div>

          <Button size="lg" className="cartoon-button text-2xl py-10 px-12">
            <Upload className="w-8 h-8 mr-3" />
            <span className="font-black">Choose Photo</span>
          </Button>

          <p className="text-base text-foreground/60 font-bold">
            or drag & drop here
          </p>
        </>
      ) : (
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="w-40 h-40 mx-auto bg-primary rounded-full flex items-center justify-center shadow-2xl animate-pulse border-8 border-primary/20">
              <Sparkles className="w-24 h-24 text-white animate-spin" />
            </div>
            <div className="space-y-4">
              <h3 className="text-5xl md:text-6xl font-black cartoon-title">AI Working! 🚀</h3>
              <p className="text-2xl text-foreground/80 font-bold">
                Creating your custom theme... ✨
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
