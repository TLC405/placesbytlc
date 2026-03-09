import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Send, ArrowLeft, MapPin, Heart, Clock, DollarSign, ExternalLink, Star, Zap, Coffee, Palette, Music, Utensils } from "lucide-react";
import { toast } from "sonner";
import { PoweredByTLC } from "@/components/PoweredByTLC";
import { supabase } from "@/integrations/supabase/client";

interface Recommendation {
  name: string;
  type: string;
  category: string;
  match_score: number;
  cupid_note: string;
  price_indicator: string;
  best_for: string;
  address?: string;
  event_date?: string;
  event_url?: string;
}

interface DatePlan {
  title: string;
  steps: string[];
  estimated_cost: string;
  duration: string;
}

interface CupidResponse {
  message: string;
  recommendations: Recommendation[];
  date_plan?: DatePlan;
  follow_up?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  data?: CupidResponse;
  timestamp: Date;
}

const MOODS = [
  { id: "romantic", emoji: "💕", label: "Romantic" },
  { id: "adventurous", emoji: "🔥", label: "Adventurous" },
  { id: "chill", emoji: "☕", label: "Chill" },
  { id: "cultural", emoji: "🎨", label: "Cultural" },
  { id: "foodie", emoji: "🍽️", label: "Foodie" },
  { id: "fun", emoji: "🎉", label: "Fun" },
];

const BUDGET_LEVELS = [
  { id: 1, label: "$", desc: "Budget-friendly" },
  { id: 2, label: "$$", desc: "Moderate" },
  { id: 3, label: "$$$", desc: "Splurge" },
];

const QUICK_PROMPTS = [
  "Plan a perfect Friday night date",
  "Something unique we haven't done before",
  "Romantic dinner with a view",
  "Fun double date ideas",
  "Best places for a first date",
  "Outdoor date for this weekend",
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "food": return Utensils;
    case "entertainment": return Music;
    case "activity": return Zap;
    case "both": return Star;
    default: return MapPin;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 85) return "text-green-500";
  if (score >= 70) return "text-primary";
  return "text-muted-foreground";
};

export default function AIRecommender() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showSetup, setShowSetup] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const userPrompt = text || prompt.trim();
    if (!userPrompt) return;

    setPrompt("");
    setShowSetup(false);

    const userMsg: ChatMessage = { role: "user", content: userPrompt, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const conversation = messages.map((m) => ({
        role: m.role,
        content: m.role === "user" ? m.content : m.data?.message || m.content,
      }));

      const { data, error } = await supabase.functions.invoke("ai-recommender", {
        body: { prompt: userPrompt, mood, budget, conversation },
      });

      if (error) throw error;

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.message || "Here's what I found!",
        data: data as CupidResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Cupid error:", err);
      toast.error(err.message || "Cupid couldn't process that");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Hmm, I had trouble with that. Try rephrasing?", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="page-shell">
      <div className="page-content flex flex-col h-[calc(100dvh-5rem)]">
        {/* Header */}
        <header className="flex-shrink-0 animate-in pb-4">
          <button onClick={() => navigate("/")} className="btn-ghost -ml-3 mb-3">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="icon-premium w-14 h-14 rounded-2xl" style={{ animation: "glow-pulse 3s ease-in-out infinite" }}>
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-headline text-foreground">Cupid AI</h1>
              <p className="text-xs text-muted-foreground">Powered by real OKC data • {messages.length > 0 ? "Chatting" : "Ready"}</p>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-hide">
          {/* Setup / Welcome */}
          {showSetup && messages.length === 0 && (
            <div className="space-y-5 animate-in-delay-1">
              {/* Mood Selector */}
              <div>
                <p className="text-caption mb-2.5">What's the vibe?</p>
                <div className="grid grid-cols-3 gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMood(mood === m.id ? null : m.id)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${
                        mood === m.id
                          ? "bg-primary/15 ring-2 ring-primary/30 scale-[1.02]"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <span className="text-xl">{m.emoji}</span>
                      <span className="text-[11px] font-medium text-foreground">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Selector */}
              <div>
                <p className="text-caption mb-2.5">Budget range</p>
                <div className="grid grid-cols-3 gap-2">
                  {BUDGET_LEVELS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBudget(budget === b.id ? null : b.id)}
                      className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
                        budget === b.id
                          ? "bg-primary/15 ring-2 ring-primary/30 scale-[1.02]"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <span className="text-lg font-bold text-foreground">{b.label}</span>
                      <span className="text-[10px] text-muted-foreground">{b.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Prompts */}
              <div>
                <p className="text-caption mb-2.5">Quick ideas</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(qp)}
                      className="chip hover:bg-primary/10 hover:text-primary transition-all text-xs"
                    >
                      {qp}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, idx) => (
            <div key={idx} className={`animate-in ${msg.role === "user" ? "flex justify-end" : ""}`}>
              {msg.role === "user" ? (
                <div className="max-w-[85%] bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3">
                  <p className="text-sm">{msg.content}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Cupid message */}
                  <div className="flex gap-3">
                    <div className="icon-premium w-8 h-8 flex-shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3 max-w-[90%]">
                      <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {msg.data?.recommendations?.map((rec, rIdx) => (
                    <RecommendationCard key={rIdx} rec={rec} index={rIdx} />
                  ))}

                  {/* Date Plan */}
                  {msg.data?.date_plan && <DatePlanCard plan={msg.data.date_plan} />}

                  {/* Follow-up */}
                  {msg.data?.follow_up && (
                    <button
                      onClick={() => sendMessage(msg.data!.follow_up!)}
                      className="chip bg-primary/10 text-primary hover:bg-primary/20 transition-all ml-11 text-xs"
                    >
                      💬 {msg.data.follow_up}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 animate-in">
              <div className="icon-premium w-8 h-8 flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="text-xs text-muted-foreground ml-2">Cupid is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 pt-3 border-t border-border space-y-2">
          {messages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMood(mood === m.id ? null : m.id)}
                  className={`chip flex-shrink-0 text-[10px] py-1 ${mood === m.id ? "bg-primary/15 text-primary" : ""}`}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Cupid anything..."
              rows={1}
              className="flex-1 bg-muted border-0 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !prompt.trim()}
              className="btn-primary h-11 w-11 p-0 flex items-center justify-center rounded-xl disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-shrink-0 pt-2">
          <PoweredByTLC />
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const Icon = getCategoryIcon(rec.category);

  return (
    <div
      className="ml-11 card-premium p-4 space-y-2.5"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="icon-premium w-10 h-10 flex-shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground text-sm">{rec.name}</h3>
            <span className={`text-xs font-bold ${getScoreColor(rec.match_score)}`}>
              {rec.match_score}% match
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="chip text-[10px] py-0.5 px-2 capitalize">{rec.best_for || rec.category}</span>
            {rec.price_indicator && (
              <span className="text-[10px] text-muted-foreground font-medium">{rec.price_indicator}</span>
            )}
            {rec.type === "event" && rec.event_date && (
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Clock className="w-2.5 h-2.5" />
                {new Date(rec.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed italic">"{rec.cupid_note}"</p>

      {rec.address && (
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" /> {rec.address}
        </p>
      )}

      {rec.event_url && (
        <a
          href={rec.event_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-primary font-medium hover:underline"
        >
          <ExternalLink className="w-3 h-3" /> View event
        </a>
      )}
    </div>
  );
}

function DatePlanCard({ plan }: { plan: DatePlan }) {
  return (
    <div className="ml-11 card-premium p-4 bg-primary/5 space-y-3">
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-foreground text-sm">{plan.title}</h3>
      </div>

      <div className="space-y-2">
        {plan.steps.map((step, idx) => (
          <div key={idx} className="flex gap-2.5">
            <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-primary">{idx + 1}</span>
            </div>
            <p className="text-xs text-foreground leading-relaxed">{step}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-1">
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <DollarSign className="w-3 h-3" /> {plan.estimated_cost}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="w-3 h-3" /> {plan.duration}
        </span>
      </div>
    </div>
  );
}
