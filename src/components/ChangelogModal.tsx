import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Heart, Shield, Zap, Star } from "lucide-react";

interface ChangelogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const versions = [
  {
    version: "1.6.0",
    date: "2025-10-23",
    type: "feature",
    icon: Sparkles,
    changes: [
      "✨ NEW: Felicia's Crown - AI Photo to Cartoon Generator!",
      "🎨 Transform your photos into stunning cartoon art",
      "👑 Choose from 5 different cartoon styles (Disney, Pixar, Anime, Comic, Watercolor)",
      "📸 Upload or take photos directly from your device",
      "💫 Beautiful dynamic gradient animations inspired by loading screen"
    ]
  },
  {
    version: "1.5.0",
    date: "2025-10-23",
    type: "feature",
    icon: Sparkles,
    changes: [
      "🔒 Enhanced security with input validation",
      "📝 Added comprehensive version changelog",
      "🎨 Improved UI animations and transitions",
      "⚡ Performance optimizations across the app"
    ]
  },
  {
    version: "1.4.0",
    date: "2025-10-20",
    type: "feature",
    icon: Heart,
    changes: [
      "💝 Beautiful loading screen with personalized message",
      "🔐 Secure API key management system",
      "📍 Location preset system for quick searches",
      "✨ Enhanced place card design with favorites"
    ]
  },
  {
    version: "1.3.0",
    date: "2025-10-15",
    type: "feature",
    icon: Star,
    changes: [
      "🎭 Category-based search (Food, Activity, Both)",
      "🏷️ Quick subcategory badges for faster searching",
      "📱 Mobile-responsive design improvements",
      "🎯 Advanced filtering and sorting options"
    ]
  },
  {
    version: "1.2.0",
    date: "2025-10-10",
    type: "security",
    icon: Shield,
    changes: [
      "🔐 Implemented secure storage system",
      "🛡️ Added XSS protection measures",
      "🔒 Enhanced data validation",
      "✅ Security audit passed"
    ]
  },
  {
    version: "1.1.0",
    date: "2025-10-05",
    type: "feature",
    icon: Zap,
    changes: [
      "⚡ Lightning-fast place search",
      "🗺️ Google Maps integration",
      "❤️ Favorites system",
      "📋 Date plan builder"
    ]
  },
  {
    version: "1.0.0",
    date: "2025-10-01",
    type: "launch",
    icon: Heart,
    changes: [
      "🎉 Initial launch of V1 Places",
      "🔍 Basic search functionality",
      "📍 Location-based discovery",
      "💖 Beautiful romantic theme"
    ]
  }
];

export const ChangelogModal = ({ open, onOpenChange }: ChangelogModalProps) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "security": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "launch": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "feature": return "New Features";
      case "security": return "Security Update";
      case "launch": return "Launch";
      default: return "Update";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">What's New</DialogTitle>
              <DialogDescription>
                Version history and updates for V1 Places
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {versions.map((version) => {
              const Icon = version.icon;
              const isSelected = selectedVersion === version.version;
              
              return (
                <div
                  key={version.version}
                  className={`border rounded-lg p-5 transition-all duration-300 cursor-pointer hover:shadow-md ${
                    isSelected ? 'border-primary shadow-md bg-accent/5' : 'border-border'
                  }`}
                  onClick={() => setSelectedVersion(isSelected ? null : version.version)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">Version {version.version}</h3>
                          <Badge variant="outline" className={getTypeColor(version.type)}>
                            {getTypeLabel(version.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{version.date}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`space-y-2 transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-70'}`}>
                    {version.changes.map((change, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{change}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
