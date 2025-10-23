import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaceItem } from "@/types";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { Save, Trash2, X, Heart, Star, MapPin } from "lucide-react";

interface PlanSidebarProps {
  plan: PlaceItem[];
  onUpdate: () => void;
  onClearPlan?: () => void;
}

export const PlanSidebar = ({ plan, onUpdate, onClearPlan }: PlanSidebarProps) => {
  const handleClear = () => {
    if (plan.length === 0) return;
    
    if (onClearPlan) {
      onClearPlan();
    } else {
      storage.clearPlan();
      onUpdate();
      toast.success("Plan cleared. Time to start fresh! ✨");
    }
  };

  const handleRemove = (index: number) => {
    storage.removeFromPlan(index);
    onUpdate();
    toast.success("Removed from your date plan.");
  };

  const handleSave = () => {
    if (plan.length === 0) {
      toast.info("Add some places first! 😊");
      return;
    }
    toast.success("Your perfect date plan is saved! 💕");
  };

  return (
    <Card className="shadow-glow border-primary/20 lg:sticky lg:top-20 h-fit overflow-hidden">
      <div className="gradient-primary h-1" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-current animate-pulse" />
            <CardTitle className="text-xl gradient-text">Your Date Plan</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleSave}
              className="shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleClear}
              className="shadow-sm hover:shadow-md transition-all hover:scale-105 hover:border-destructive/50 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {plan.length > 0 && (
          <Badge variant="secondary" className="w-fit mt-2">
            {plan.length} {plan.length === 1 ? 'place' : 'places'} planned
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {plan.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">No places yet</p>
              <p className="text-sm text-muted-foreground">
                Start adding places to build your perfect date! 💕
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {plan.map((item, index) => (
              <li
                key={index}
                className="p-3 rounded-xl border-2 border-border/50 bg-gradient-to-br from-card to-card/50 flex items-start gap-3 group hover:border-primary/50 hover:shadow-soft transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                  />
                  {item.rating && (
                    <Badge className="absolute -top-2 -right-2 bg-white/95 text-foreground border-0 shadow-md px-1.5 py-0.5 text-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                      {item.rating}
                    </Badge>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </div>
                  {item.distance && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {item.distance} mi away
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground line-clamp-1 flex items-start gap-1">
                    <span className="mt-0.5">📍</span>
                    <span>{item.address}</span>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemove(index)}
                  className="opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive flex-shrink-0 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
