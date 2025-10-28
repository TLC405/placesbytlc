import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart, Settings2, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function CupidSettingsPanel() {
  const [loading, setLoading] = useState(true);
  const [cupidEnabled, setCupidEnabled] = useState(true);
  const [settings, setSettings] = useState({
    speed: 5000,
    dodgeDistance: 150,
    size: 80,
    hideTime: 8000,
    floatAnimation: true,
    evasiveness: 0.7,
    soundEnabled: true,
    actionFrequency: 5000,
    transparency: 1,
    shadowIntensity: 0.3
  });

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
      
      const settingValue = data?.setting_value as any;
      setCupidEnabled(settingValue?.enabled ?? true);
      
      if (settingValue?.settings) {
        setSettings(prev => ({ ...prev, ...settingValue.settings }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({ 
          setting_value: { 
            enabled: cupidEnabled,
            settings 
          } 
        })
        .eq('setting_key', 'cupid_visible');

      if (error) throw error;
      toast.success("Settings saved! 🎯");
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error("Failed to save settings");
    }
  };

  const resetCupidState = () => {
    localStorage.removeItem('cupid_popped');
    localStorage.removeItem('cupid_hidden_until');
    toast.success("Cupid state reset! Refresh to see changes.");
  };

  const resetToDefaults = () => {
    setSettings({
      speed: 5000,
      dodgeDistance: 150,
      size: 80,
      hideTime: 8000,
      floatAnimation: true,
      evasiveness: 0.7,
      soundEnabled: true,
      actionFrequency: 5000,
      transparency: 1,
      shadowIntensity: 0.3
    });
    toast.info("Reset to defaults. Click Save to apply.");
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
    <Card className="border-rose-500/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          Advanced Cupid Settings
        </CardTitle>
        <CardDescription>
          Fine-tune every aspect of the floating Cupid character
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Master Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
          <div className="space-y-1">
            <Label htmlFor="cupid-master" className="text-base font-semibold">
              Enable Cupid
            </Label>
            <p className="text-sm text-muted-foreground">
              Master switch for Cupid visibility
            </p>
          </div>
          <Switch
            id="cupid-master"
            checked={cupidEnabled}
            onCheckedChange={setCupidEnabled}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Size */}
          <div className="space-y-2">
            <Label>Size: {settings.size}px</Label>
            <Slider
              value={[settings.size]}
              onValueChange={([v]) => setSettings(s => ({ ...s, size: v }))}
              min={40}
              max={150}
              step={10}
            />
            <p className="text-xs text-muted-foreground">How big Cupid appears on screen</p>
          </div>

          {/* 2. Evasiveness */}
          <div className="space-y-2">
            <Label>Evasiveness: {Math.round(settings.evasiveness * 100)}%</Label>
            <Slider
              value={[settings.evasiveness * 100]}
              onValueChange={([v]) => setSettings(s => ({ ...s, evasiveness: v / 100 }))}
              min={0}
              max={100}
              step={5}
            />
            <p className="text-xs text-muted-foreground">Chance to dodge when cursor is near</p>
          </div>

          {/* 3. Dodge Distance */}
          <div className="space-y-2">
            <Label>Dodge Distance: {settings.dodgeDistance}px</Label>
            <Slider
              value={[settings.dodgeDistance]}
              onValueChange={([v]) => setSettings(s => ({ ...s, dodgeDistance: v }))}
              min={50}
              max={300}
              step={10}
            />
            <p className="text-xs text-muted-foreground">How close cursor can get before dodge</p>
          </div>

          {/* 4. Action Frequency */}
          <div className="space-y-2">
            <Label>Action Frequency: {settings.actionFrequency / 1000}s</Label>
            <Slider
              value={[settings.actionFrequency]}
              onValueChange={([v]) => setSettings(s => ({ ...s, actionFrequency: v }))}
              min={2000}
              max={15000}
              step={1000}
            />
            <p className="text-xs text-muted-foreground">How often Cupid performs actions</p>
          </div>

          {/* 5. Hide Time After Pop */}
          <div className="space-y-2">
            <Label>Hide Time: {settings.hideTime === 0 ? '∞' : `${settings.hideTime / 1000}s`}</Label>
            <Slider
              value={[settings.hideTime]}
              onValueChange={([v]) => setSettings(s => ({ ...s, hideTime: v }))}
              min={0}
              max={30000}
              step={1000}
            />
            <p className="text-xs text-muted-foreground">How long Cupid stays popped (0 = forever)</p>
          </div>

          {/* 6. Transparency */}
          <div className="space-y-2">
            <Label>Transparency: {Math.round(settings.transparency * 100)}%</Label>
            <Slider
              value={[settings.transparency * 100]}
              onValueChange={([v]) => setSettings(s => ({ ...s, transparency: v / 100 }))}
              min={10}
              max={100}
              step={5}
            />
            <p className="text-xs text-muted-foreground">Cupid's opacity level</p>
          </div>

          {/* 7. Shadow Intensity */}
          <div className="space-y-2">
            <Label>Shadow Intensity: {Math.round(settings.shadowIntensity * 100)}%</Label>
            <Slider
              value={[settings.shadowIntensity * 100]}
              onValueChange={([v]) => setSettings(s => ({ ...s, shadowIntensity: v / 100 }))}
              min={0}
              max={100}
              step={5}
            />
            <p className="text-xs text-muted-foreground">Drop shadow strength</p>
          </div>
        </div>

        {/* Toggle Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 8. Float Animation */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
            <Label htmlFor="float-anim" className="text-sm">Float Animation</Label>
            <Switch
              id="float-anim"
              checked={settings.floatAnimation}
              onCheckedChange={(v) => setSettings(s => ({ ...s, floatAnimation: v }))}
            />
          </div>

          {/* 9. Sound Effects */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
            <Label htmlFor="sound" className="text-sm">Sound Effects</Label>
            <Switch
              id="sound"
              checked={settings.soundEnabled}
              onCheckedChange={(v) => setSettings(s => ({ ...s, soundEnabled: v }))}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button onClick={saveSettings} className="flex-1">
            <Settings2 className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
          <Button onClick={resetCupidState} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset State
          </Button>
          <Button onClick={resetToDefaults} variant="outline">
            Defaults
          </Button>
        </div>

        {/* Info Box */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs text-muted-foreground">
            <strong>Tip:</strong> After clicking "Save Settings", refresh the page to see changes take effect. 
            Use "Reset State" to unpop Cupid if he's been clicked.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
