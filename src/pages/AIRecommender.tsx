import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, ArrowLeft, MapPin, ChevronRight, Heart } from "lucide-react";
import { toast } from "sonner";

export default function AIRecommender() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<
    { name: string; type: string; desc: string }[]
  >([]);

  const quickPrompts = [
    "Romantic dinner under $100",
    "Fun outdoor date ideas",
    "Unique first date spots",
    "Cozy coffee shop vibes",
  ];

  const handleGetRecommendations = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe what you're looking for");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setRecommendations([
        { name: "The Mule", type: "Rooftop Bar", desc: "Stunning city views, perfect for sunset dates" },
        { name: "Paseo Arts District", type: "Arts & Culture", desc: "Gallery walks with dinner at The Press" },
        { name: "Scissortail Park", type: "Outdoor", desc: "Romantic evening stroll with food trucks" },
        { name: "Vast", type: "Fine Dining", desc: "49th floor panoramic views" },
        { name: "Factory Obscura", type: "Experience", desc: "Interactive art, fun and unique" },
      ]);

      toast.success("Found 5 recommendations!");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-content space-y-6">
        {/* Header */}
        <header className="animate-in">
          <button onClick={() => navigate("/")} className="btn-ghost -ml-3 mb-3">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-headline text-foreground">Cupid AI</h1>
              <p className="text-sm text-muted-foreground">Your personal date planner</p>
            </div>
          </div>
        </header>

        {/* Input Section */}
        <section className="space-y-4 animate-in-delay-1">
          <div className="card-luxury">
            <label className="text-caption mb-2 block">What are you looking for?</label>
            <Textarea
              placeholder="Describe your ideal date... budget, vibe, activities, food preferences"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] bg-muted/50 border-0 resize-none rounded-xl"
            />

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 mt-4">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(qp)}
                  className="chip hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGetRecommendations}
            disabled={loading || !prompt.trim()}
            className="btn-primary w-full h-12 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Finding spots...
              </span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Get Recommendations
              </>
            )}
          </button>
        </section>

        {/* Results */}
        {recommendations.length > 0 && (
          <section className="space-y-3 animate-in">
            <div className="section-header">
              <h2 className="section-title">Your Recommendations</h2>
              <span className="text-caption">{recommendations.length} spots</span>
            </div>

            {recommendations.map((rec, idx) => (
              <button
                key={idx}
                onClick={() => navigate("/places")}
                className="feature-card w-full"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="feature-icon bg-primary/10">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{rec.name}</h3>
                    <span className="chip text-[10px] py-0.5 px-2">{rec.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{rec.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </section>
        )}

        {/* Empty State */}
        {recommendations.length === 0 && !loading && (
          <section className="animate-in-delay-2">
            <div className="card-highlight text-center py-8">
              <Heart className="w-10 h-10 text-primary mx-auto mb-3 animate-pulse-soft" />
              <h3 className="font-semibold text-foreground mb-1">Let Cupid help you</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Describe your perfect date and get personalized spot recommendations
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}