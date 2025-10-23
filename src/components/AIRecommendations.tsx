import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, X, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Recommendation {
  id: string;
  recommendation_type: string;
  recommendation_data: any;
  confidence_score: number;
  reason: string;
}

export const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .is('shown_at', null)
        .order('confidence_score', { ascending: false })
        .limit(3);

      if (error) throw error;

      if (data && data.length > 0) {
        setRecommendations(data);
        
        // Mark as shown
        const ids = data.map(r => r.id);
        await supabase
          .from('ai_recommendations')
          .update({ shown_at: new Date().toISOString() })
          .in('id', ids);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await supabase
        .from('ai_recommendations')
        .update({ 
          interacted_at: new Date().toISOString(),
          interaction_type: 'dismissed'
        })
        .eq('id', id);

      setRecommendations(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error dismissing recommendation:', error);
    }
  };

  const handleAccept = async (rec: Recommendation) => {
    try {
      await supabase
        .from('ai_recommendations')
        .update({ 
          interacted_at: new Date().toISOString(),
          interaction_type: 'saved'
        })
        .eq('id', rec.id);

      toast({
        title: "Added to your interests",
        description: "We'll keep learning your preferences",
      });

      setRecommendations(prev => prev.filter(r => r.id !== rec.id));
    } catch (error) {
      console.error('Error accepting recommendation:', error);
    }
  };

  if (loading || recommendations.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">AI Suggestions</h3>
        <Badge variant="secondary" className="gap-1">
          <TrendingUp className="w-3 h-3" />
          Learning
        </Badge>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="p-4 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => handleDismiss(rec.id)}
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="mb-2">
              <Badge variant="outline" className="text-xs mb-2">
                {Math.round(rec.confidence_score * 100)}% match
              </Badge>
              <h4 className="font-medium text-sm line-clamp-2">
                {rec.recommendation_data.name || rec.recommendation_data.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {rec.reason}
              </p>
            </div>

            <Button 
              size="sm" 
              className="w-full mt-2"
              onClick={() => handleAccept(rec)}
            >
              Interested
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
