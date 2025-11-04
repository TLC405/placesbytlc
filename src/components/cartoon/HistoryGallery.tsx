import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Generation {
  id: string;
  style_id: string;
  cartoon_image_url: string;
  created_at: string;
}

interface HistoryGalleryProps {
  onSelect: (imageUrl: string) => void;
}

export function HistoryGallery({ onSelect }: HistoryGalleryProps) {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("cartoon_generations")
        .select("id, style_id, cartoon_image_url, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setGenerations(data || []);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("cartoon_generations")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
      setGenerations([]);
      toast.success("History cleared!");
    } catch (error) {
      toast.error("Failed to clear history");
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) return <div className="text-sm text-muted-foreground">Loading history...</div>;
  if (generations.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Recent Generations ({generations.length}/20)</h3>
        <Button variant="ghost" size="sm" onClick={clearHistory}>
          <Trash2 className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-3 p-4">
          {generations.map((gen) => (
            <Card
              key={gen.id}
              onClick={() => onSelect(gen.cartoon_image_url)}
              className="flex-shrink-0 w-24 h-24 cursor-pointer hover:scale-105 transition-transform overflow-hidden"
            >
              <img
                src={gen.cartoon_image_url}
                alt={`${gen.style_id} generation`}
                className="w-full h-full object-cover"
              />
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
