import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceItem } from "@/types";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { Download, Trash2, X } from "lucide-react";

export default function Plan() {
  const [plan, setPlan] = useState<PlaceItem[]>([]);

  useEffect(() => {
    setPlan(storage.getPlan());
  }, []);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tlc-plan.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("Plan exported!");
  };

  const handleClear = () => {
    if (plan.length === 0) return;
    
    if (confirm("Are you sure you want to clear your entire plan?")) {
      storage.clearPlan();
      setPlan([]);
      toast.success("Plan cleared.");
    }
  };

  const handleRemove = (index: number) => {
    storage.removeFromPlan(index);
    setPlan(storage.getPlan());
    toast.success("Removed from plan.");
  };

  return (
    <div className="animate-in fade-in duration-500">
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Saved Plan</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport} disabled={plan.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={plan.length === 0}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {plan.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg font-semibold">No places in your plan yet</p>
              <p className="text-sm">Start exploring to add date spots!</p>
            </div>
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plan.map((item, index) => (
                <li key={index} className="group">
                  <Card className="shadow-sm hover:shadow-md transition-all">
                    <div className="relative">
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemove(index)}
                        className="absolute top-2 right-2 bg-card/90 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-base mb-1">{item.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.address}</p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
