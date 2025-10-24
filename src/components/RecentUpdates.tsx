import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Update {
  id: string;
  version: string;
  title: string;
  description: string;
  update_type: string;
  status: string;
  changes: string[];
  release_date: string | null;
  created_at: string;
}

export const RecentUpdates = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUpdates();
  }, []);

  const loadUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('app_updates')
        .select('*')
        .eq('status', 'implemented')
        .order('release_date', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      const formattedUpdates = (data || []).map(update => ({
        ...update,
        changes: (update.changes as string[]) || []
      }));
      
      setUpdates(formattedUpdates);
    } catch (error) {
      console.error('Failed to load updates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (updates.length === 0) return null;

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl animate-pulse">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-spin" />
          👑 What's New in Queen Felicia's Kingdom 👑
        </CardTitle>
        <CardDescription className="text-sm sm:text-base font-semibold">
          ✨ Royal updates and magical improvements ✨
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {updates.map((update) => (
          <div 
            key={update.id} 
            className="relative pl-6 sm:pl-8 pb-6 border-l-2 border-primary/30 last:pb-0"
          >
            <div className="absolute -left-[13px] sm:-left-[17px] top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs font-semibold">
                  {update.version}
                </Badge>
                {update.release_date && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(update.release_date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                )}
              </div>
              
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">
                  {update.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {update.description}
                </p>
              </div>
              
              <ul className="space-y-2 mt-3">
                {update.changes.map((change, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-primary/20">
          <div className="flex items-center gap-3 text-sm">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <div>
              <p className="font-medium">More exciting features coming soon!</p>
              <p className="text-xs text-muted-foreground">
                AI recommendations, photo galleries, and more...
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
