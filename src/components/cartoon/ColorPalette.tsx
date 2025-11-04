import { Card } from "@/components/ui/card";

export type ColorPalette = "classic" | "pastel" | "neon" | "vintage" | "monochrome";

const palettes = [
  { id: "classic", label: "Classic", colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"] },
  { id: "pastel", label: "Pastel", colors: ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA"] },
  { id: "neon", label: "Neon", colors: ["#FF00FF", "#00FFFF", "#FFFF00", "#FF0080"] },
  { id: "vintage", label: "Vintage", colors: ["#8B4513", "#D2691E", "#DEB887", "#F5DEB3"] },
  { id: "monochrome", label: "Mono", colors: ["#000000", "#404040", "#808080", "#CCCCCC"] },
];

interface ColorPaletteProps {
  value: ColorPalette;
  onChange: (palette: ColorPalette) => void;
}

export function ColorPalette({ value, onChange }: ColorPaletteProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Color Palette</h3>
      <div className="grid grid-cols-5 gap-2">
        {palettes.map((palette) => (
          <Card
            key={palette.id}
            onClick={() => onChange(palette.id as ColorPalette)}
            className={`p-2 cursor-pointer transition-all hover:scale-105 ${
              value === palette.id
                ? "border-2 border-primary bg-primary/10"
                : "border border-border hover:border-primary/50"
            }`}
          >
            <div className="flex gap-1 mb-2">
              {palette.colors.map((color, idx) => (
                <div
                  key={idx}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="text-[10px] font-medium text-center">{palette.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
