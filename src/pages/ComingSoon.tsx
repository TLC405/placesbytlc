import { Card } from "@/components/ui/card";
import { Heart, Link2, Sparkles } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-12 text-center space-y-8 bg-gradient-to-br from-background via-primary/5 to-accent/5 border-2 border-primary/20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 opacity-20 blur-3xl animate-pulse" />
          <div className="relative flex items-center justify-center gap-4 mb-6">
            <Heart className="w-16 h-16 text-primary animate-pulse" fill="currentColor" />
            <Link2 className="w-12 h-12 text-accent animate-pulse" />
            <Heart className="w-16 h-16 text-primary animate-pulse" fill="currentColor" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent animate-pulse">
            👻 BOO MODE 👻
          </h1>
          <p className="text-2xl font-bold text-primary/80 animate-pulse">
            COMING SOON
          </p>
        </div>

        <div className="space-y-4 text-lg text-muted-foreground">
          <p className="font-medium">
            Linking partners together into one app.
          </p>
          <p className="font-medium">
            One new adventure.
          </p>
          <p className="font-medium">
            Whether you're together or away,
          </p>
          <p className="text-2xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent">
            You two shall play.
          </p>
        </div>

        <div className="pt-6 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <p className="text-sm text-muted-foreground font-medium">
            Stay tuned for updates
          </p>
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        </div>
      </Card>
    </div>
  );
}
