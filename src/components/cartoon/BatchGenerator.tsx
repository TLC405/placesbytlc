import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Download, Sparkles } from "lucide-react";

interface BatchResult {
  styleId: string;
  styleName: string;
  imageUrl: string;
  emoji: string;
}

interface BatchGeneratorProps {
  originalImage: string;
}

const allStyles = [
  { id: "simpsons", name: "Simpsons", emoji: "🍩" },
  { id: "familyguy", name: "Family Guy", emoji: "🦆" },
  { id: "southpark", name: "South Park", emoji: "🚌" },
  { id: "rickandmorty", name: "Rick & Morty", emoji: "🌀" },
  { id: "kingofthehill", name: "King of the Hill", emoji: "🏡" },
  { id: "renandstimpy", name: "Ren & Stimpy", emoji: "🤪" },
  { id: "beavisandbutt", name: "Beavis & Butthead", emoji: "🎸" },
  { id: "spongebob", name: "SpongeBob", emoji: "🧽" },
  { id: "pokemon", name: "Pokémon", emoji: "⚡" },
  { id: "toontown", name: "Toontown", emoji: "🎩" },
  { id: "peppapig", name: "Peppa Pig", emoji: "🐷" },
  { id: "doraemon", name: "Doraemon", emoji: "🤖" },
];

export function BatchGenerator({ originalImage }: BatchGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [progress, setProgress] = useState(0);

  const generateAll = async () => {
    setGenerating(true);
    setResults([]);
    setProgress(0);
    const base64Data = originalImage.split(",")[1];

    const batchResults: BatchResult[] = [];
    let completed = 0;

    for (const style of allStyles) {
      try {
        const { data, error } = await supabase.functions.invoke("teefeeme-cartoonify", {
          body: { image: base64Data, style: style.id },
        });

        if (!error && data?.cartoonImage) {
          batchResults.push({
            styleId: style.id,
            styleName: style.name,
            imageUrl: `data:image/png;base64,${data.cartoonImage}`,
            emoji: style.emoji,
          });
        }
      } catch (err) {
        console.error(`Failed ${style.name}:`, err);
      }

      completed++;
      setProgress(Math.round((completed / allStyles.length) * 100));
    }

    setResults(batchResults);
    setGenerating(false);
    toast.success(`Generated ${batchResults.length}/12 styles!`);
  };

  const downloadAll = () => {
    results.forEach((result) => {
      const link = document.createElement("a");
      link.href = result.imageUrl;
      link.download = `tlc-${result.styleId}-${Date.now()}.png`;
      link.click();
    });
    toast.success("Downloaded all styles!");
  };

  return (
    <div className="space-y-6">
      <Button
        onClick={generateAll}
        disabled={generating}
        size="lg"
        className="cartoon-button w-full h-16 text-xl"
      >
        {generating ? (
          <>
            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            Generating... {progress}% 🎨
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6 mr-2" />
            Generate All 12 Styles! 🚀
          </>
        )}
      </Button>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black">Results ({results.length}/12) ✨</h3>
            <Button onClick={downloadAll} size="lg" className="cartoon-button">
              <Download className="w-5 h-5 mr-2" />
              Download All 💾
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {results.map((result) => (
              <Card key={result.styleId} className="cartoon-card p-3 space-y-2">
                <img
                  src={result.imageUrl}
                  alt={result.styleName}
                  className="w-full aspect-square object-cover rounded-2xl border-4 border-foreground/10"
                />
                <div className="text-center text-sm font-black">
                  {result.emoji} {result.styleName}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
