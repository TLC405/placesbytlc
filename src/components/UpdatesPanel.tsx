import { X, Sparkles, Heart, MapPin, Calendar } from "lucide-react";
import { Button } from "./ui/button";

interface UpdatesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdatesPanel = ({ isOpen, onClose }: UpdatesPanelProps) => {
  if (!isOpen) return null;

  const updates = [
    {
      version: "v2.0",
      date: "2025",
      icon: Sparkles,
      title: "Enhanced Experience",
      items: [
        "Food/Activity/Both filtering",
        "Category-based search",
        "Perfect Midpoint 2.0",
        "Improved place cards with distance"
      ]
    },
    {
      version: "v1.5",
      date: "2024",
      icon: Heart,
      title: "Love & Quizzes",
      items: [
        "Love Language Quiz",
        "MBTI Personality Quiz",
        "Relationship Profile Cards",
        "TeeFee Me gift recommendations"
      ]
    },
    {
      version: "v1.0",
      date: "2024",
      icon: MapPin,
      title: "The Beginning",
      items: [
        "Place discovery",
        "Plan creation & sharing",
        "Real-time sync",
        "Floating Cupid companion"
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-card p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-rose to-mauve bg-clip-text text-transparent">
              What's New
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Latest updates to enhance your love story
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {updates.map((update, idx) => (
            <div key={idx} className="relative pl-8 pb-6 border-l-2 border-rose/20 last:pb-0">
              <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-gradient-to-r from-rose to-mauve flex items-center justify-center">
                <update.icon className="h-4 w-4 text-white" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="pill text-xs font-semibold">{update.version}</span>
                  <span className="text-xs text-muted-foreground">{update.date}</span>
                </div>
                
                <h3 className="text-lg font-bold text-foreground">{update.title}</h3>
                
                <ul className="space-y-2 mt-3">
                  {update.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t bg-gradient-to-r from-bg1 to-bg2">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-rose" />
            <div>
              <p className="text-sm font-medium">More updates coming soon!</p>
              <p className="text-xs text-muted-foreground">Stay tuned for AI recommendations & more</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
