import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function FeliciaModPanel() {
  const [cupidEnabled, setCupidEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'cupid_visible')
        .single();

      if (error) throw error;
      
      const settingValue = data?.setting_value as { enabled?: boolean } | null;
      setCupidEnabled(settingValue?.enabled ?? true);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleCupidToggle = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({ setting_value: { enabled } })
        .eq('setting_key', 'cupid_visible');

      if (error) throw error;

      setCupidEnabled(enabled);
      toast.success(enabled ? "Cupid enabled! 💘" : "Cupid disabled");
    } catch (error) {
      console.error('Failed to update setting:', error);
      toast.error("Failed to update setting");
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

  return (
    <Card className="border-rose-500/50 bg-gradient-to-br from-rose-50/50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 fill-rose-500" />
          Felicia's Mod Panel
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Control app features and settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-4 p-4 rounded-lg bg-background/50 border">
          <div className="space-y-1 flex-1">
            <Label htmlFor="cupid-toggle" className="text-base font-semibold cursor-pointer">
              Floating Cupid Character
            </Label>
            <p className="text-sm text-muted-foreground">
              Show the cute Cupid mascot hopping around the app
            </p>
          </div>
          <Switch
            id="cupid-toggle"
            checked={cupidEnabled}
            onCheckedChange={handleCupidToggle}
            className="data-[state=checked]:bg-rose-500"
          />
        </div>

        <div className="p-4 rounded-lg bg-muted/50 border-2 border-dashed">
          <p className="text-sm text-muted-foreground text-center">
            💝 More mod features coming soon! 💝
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
