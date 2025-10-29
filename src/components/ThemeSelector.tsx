import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Palette } from "lucide-react";

export const ThemeSelector = () => {
  const { currentTheme, setTheme, themes } = useTheme();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Palette className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black gradient-text">🎨 Select Your Vibe</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 p-4">
          {Object.entries(themes).map(([key, config]) => (
            <Card
              key={key}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                currentTheme === key 
                  ? 'border-4 border-primary shadow-glow' 
                  : 'border-2 border-border/50 hover:border-primary/50'
              }`}
              onClick={() => setTheme(key as any)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{config.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{config.displayName}</CardTitle>
                    {currentTheme === key && (
                      <div className="text-xs text-primary font-bold mt-1">✓ ACTIVE</div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed">
                  {config.description}
                </CardDescription>
                <div className="flex gap-2 mt-3">
                  {Object.values(config.colors).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full border-2 border-white/20"
                      style={{ backgroundColor: `hsl(${color})` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
