import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, Palette } from "lucide-react";
import { isTheme } from "@/lib/themes";

export function ThemeSelector() {
  const { currentTheme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild><Button variant="outline" size="sm" aria-label="Change appearance" title="Choose your theme" className="appearance-trigger"><Palette /><span>Themes</span></Button></DialogTrigger>
    <DialogContent className="theme-sheet">
      <DialogHeader className="theme-sheet-header"><DialogTitle className="text-2xl">Pick your personality</DialogTitle><DialogDescription>Same couple. Different outfit.</DialogDescription></DialogHeader>
      <div className="theme-choices">{Object.entries(themes).map(([key, config]) => {
        const Icon = config.icon;
        return <Button key={key} variant="outline" aria-pressed={currentTheme === key} aria-label={`Choose ${config.name}`} className={`theme-preview theme-preview-${key} ${currentTheme === key ? "selected" : ""}`} onClick={() => { if (isTheme(key)) { setTheme(key); setOpen(false); } }}>
          <img src={config.image} alt={config.alt} width={1536} height={768} loading="lazy" />
          <div className="theme-preview-caption"><span className="flex items-center gap-2 font-semibold"><Icon className="h-4 w-4 shrink-0" /><span className="min-w-0">{config.name}</span>{currentTheme === key && <Check className="h-4 w-4 ml-auto shrink-0" />}</span><span className="block text-xs font-normal mt-1 leading-relaxed">{config.description}</span></div>
        </Button>;
      })}</div>
    </DialogContent>
  </Dialog>;
}
