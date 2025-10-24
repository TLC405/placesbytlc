import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Heart, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function AIRecommender() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const handleGetRecommendations = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe what you're looking for!");
      return;
    }

    setLoading(true);
    try {
      // Simulate AI recommendations for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setRecommendations([
        "The Mule - Rooftop bar with stunning city views, perfect for sunset dates",
        "Paseo Arts District - Walk through galleries and grab dinner at The Press",
        "Scissortail Park - Romantic evening stroll with food trucks nearby",
        "Vast - Upscale dining on the 49th floor with panoramic views",
        "Factory Obscura - Interactive art experience, fun and unique date"
      ]);
      
      toast.success("Got your recommendations!");
    } catch (error) {
      toast.error("Failed to get recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen space-y-8 pb-12">
      {/* Hero */}
      <Card className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white border-0">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-10 h-10" />
            </div>
          </div>
          <CardTitle className="text-4xl font-black">AI Date Recommender</CardTitle>
          <CardDescription className="text-white/90 text-lg">
            Get personalized date spot recommendations powered by AI
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Input Section */}
      <Card className="border-2 border-primary/30 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            What are you looking for?
          </CardTitle>
          <CardDescription>
            Describe your ideal date - budget, vibe, activities, food preferences, etc.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Example: Looking for a romantic dinner under $100, preferably Italian, with a nice ambiance and maybe live music..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[150px] text-base"
          />
          
          <Button
            onClick={handleGetRecommendations}
            disabled={loading}
            size="lg"
            className="w-full gradient-primary text-lg h-14"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                Getting Recommendations...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Get AI Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {recommendations.length > 0 && (
        <Card className="border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Your Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20 hover:shadow-lg transition-all hover:scale-102"
              >
                <div className="flex items-start gap-4">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 text-lg px-3 py-1">
                    {index + 1}
                  </Badge>
                  <p className="text-base font-medium leading-relaxed">{rec}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Coming Soon Notice */}
      <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-2 border-yellow-400/50">
        <CardContent className="p-6">
          <p className="text-center text-sm text-muted-foreground">
            🚧 <strong>Beta Feature:</strong> AI recommendations are being enhanced with real-time data and smarter personalization. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
