import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceItem } from "@/types";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { Save, Trash2, X } from "lucide-react";

interface PlanSidebarProps {
  plan: PlaceItem[];
  onUpdate: () => void;
}

export const PlanSidebar = ({ plan, onUpdate }: PlanSidebarProps) => {
  const handleClear = () => {
    if (plan.length === 0) return;
    
    if (confirm("Are you sure you want to clear your entire plan?")) {
      storage.clearPlan();
      onUpdate();
      toast.success("Plan cleared.");
    }
  };

  const handleRemove = (index: number) => {
    storage.removeFromPlan(index);
    onUpdate();
    toast.success("Removed from plan.");
  };

  const handleSave = () => {
    toast.success("Plan saved locally!");
  };

  return (
    <Card className="shadow-soft border-border/50 lg:sticky lg:top-20 h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Your Plan</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleSave}>
              <Save className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleClear}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {plan.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">
            No places added yet. Start exploring!
          </p>
        ) : (
          <ul className="space-y-3">
            {plan.map((item, index) => (
              <li
                key={index}
                className="p-3 rounded-xl border border-border bg-card/50 flex items-center gap-3 group hover:border-primary/50 transition-colors"
              >
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{item.address}</div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemove(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
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
