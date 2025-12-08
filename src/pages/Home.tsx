import { useNavigate } from "react-router-dom";
import { MapPin, Brain, Sparkles, Heart, ChevronRight, Star } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      id: "places",
      title: "Places",
      desc: "70+ curated OKC date spots",
      icon: MapPin,
      color: "bg-primary/10",
      iconColor: "text-primary",
      path: "/places",
    },
    {
      id: "cupid",
      title: "Cupid AI",
      desc: "Get personalized recommendations",
      icon: Sparkles,
      color: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-500",
      path: "/ai-recommender",
    },
    {
      id: "quizzes",
      title: "Quizzes",
      desc: "Discover your love language & style",
      icon: Brain,
      color: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-500",
      path: "/quizzes",
    },
  ];

  const stats = [
    { label: "Date Spots", value: "70+" },
    { label: "Categories", value: "6" },
    { label: "Quizzes", value: "3" },
  ];

  return (
    <div className="page-shell">
      <div className="page-content space-y-8">
        {/* Hero */}
        <header className="text-center pt-6 animate-in">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <Heart className="w-10 h-10 text-primary animate-pulse-soft" />
          </div>
          <h1 className="text-display text-foreground">Places by TLC</h1>
          <p className="text-body mt-2 max-w-xs mx-auto">
            Discover perfect date spots, explore your love style, and plan unforgettable adventures
          </p>
        </header>

        {/* Stats Row */}
        <section className="animate-in-delay-1">
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, idx) => (
              <div key={idx} className="card-luxury text-center py-4">
                <span className="text-2xl font-bold text-primary">{stat.value}</span>
                <p className="text-caption mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Main Features */}
        <section className="space-y-3 animate-in-delay-1">
          <div className="section-header">
            <h2 className="section-title">Explore</h2>
          </div>
          
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => navigate(feature.path)}
                className="feature-card w-full"
              >
                <div className={`feature-icon ${feature.color}`}>
                  <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </section>

        {/* Highlight Card */}
        <section className="animate-in-delay-2">
          <div className="card-highlight text-center py-6">
            <Star className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="text-headline text-foreground mb-2">Made for Couples</h3>
            <p className="text-body text-sm max-w-xs mx-auto">
              Every spot is hand-picked and verified by real couples in Oklahoma City
            </p>
            <button
              onClick={() => navigate("/places")}
              className="btn-primary mt-5"
            >
              <MapPin className="w-4 h-4" />
              Explore Places
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}