import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Lock, Eye, EyeOff, ChevronRight, Navigation } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { id: "dining", name: "Dining", color: "hsl(var(--primary))", emoji: "🍽️" },
  { id: "outdoors", name: "Outdoors", color: "hsl(142 76% 36%)", emoji: "🌳" },
  { id: "entertainment", name: "Entertainment", color: "hsl(262 83% 58%)", emoji: "🎭" },
  { id: "nightlife", name: "Nightlife", color: "hsl(330 81% 60%)", emoji: "🌙" },
  { id: "culture", name: "Culture", color: "hsl(25 95% 53%)", emoji: "🎨" },
  { id: "adventure", name: "Adventure", color: "hsl(199 89% 48%)", emoji: "🎢" },
];

export default function EnhancedOKCLegend() {
  const navigate = useNavigate();
  const [codeUnlocked, setCodeUnlocked] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [showCodeDialog, setShowCodeDialog] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES.map(c => c.id));
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const unlocked = sessionStorage.getItem("places_unlocked");
    if (unlocked === "true") {
      setCodeUnlocked(true);
      setShowCodeDialog(false);
    }
  }, []);

  const handleCodeSubmit = () => {
    if (codeInput === "666") {
      setCodeUnlocked(true);
      setShowCodeDialog(false);
      sessionStorage.setItem("places_unlocked", "true");
      toast.success("Places unlocked!");
    } else {
      toast.error("Wrong code");
      setCodeInput("");
    }
  };

  useEffect(() => {
    if (!codeUnlocked || !mapContainer.current) return;

    const storedToken = localStorage.getItem('mapbox_access_token');
    if (!storedToken) {
      toast.error("Add your Mapbox token to localStorage as 'mapbox_access_token'");
      return;
    }
    mapboxgl.accessToken = storedToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-97.5164, 35.4676],
      zoom: 10,
      pitch: 30,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    return () => {
      map.current?.remove();
    };
  }, [codeUnlocked]);

  if (!codeUnlocked) {
    return (
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="card-luxury max-w-sm border-0">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-display">Places</DialogTitle>
            <DialogDescription className="text-body">
              Enter code to unlock curated date spots
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Enter code..."
                className="h-14 text-center text-2xl font-semibold tracking-widest bg-muted border-0 rounded-xl"
                onKeyPress={(e) => e.key === "Enter" && handleCodeSubmit()}
                maxLength={3}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Button>
            </div>
            
            <Button onClick={handleCodeSubmit} className="btn-primary w-full h-12">
              <Lock className="w-4 h-4 mr-2" />
              Unlock Places
            </Button>
            
            <p className="text-caption text-center">Hint: 😈</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-content space-y-6">
        {/* Header */}
        <header className="animate-in">
          <button onClick={() => navigate("/")} className="text-muted-foreground mb-2 flex items-center gap-1 text-sm">
            ← Back
          </button>
          <h1 className="text-display">Places</h1>
          <p className="text-body">Curated date spots in OKC</p>
        </header>

        {/* Categories */}
        <section className="animate-in-delay-1">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  const newSelection = selectedCategories.includes(cat.id)
                    ? selectedCategories.filter(c => c !== cat.id)
                    : [...selectedCategories, cat.id];
                  setSelectedCategories(newSelection);
                }}
                className={`chip flex-shrink-0 ${
                  selectedCategories.includes(cat.id) ? "chip-primary" : ""
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Map */}
        <section className="animate-in-delay-2">
          <div className="relative h-[400px] rounded-2xl overflow-hidden border border-border">
            <div ref={mapContainer} className="absolute inset-0" />
            
            {/* Map overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="card-glass p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Oklahoma City</span>
                  </div>
                  <span className="text-caption">70+ spots</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured */}
        <section className="animate-in-delay-3">
          <div className="section-header">
            <h2 className="section-title">Featured Spots</h2>
            <button className="section-action flex items-center gap-1">
              See all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="grid gap-3">
            {[
              { name: "Paseo Arts District", type: "Culture", emoji: "🎨" },
              { name: "Bricktown", type: "Entertainment", emoji: "🌃" },
              { name: "Automobile Alley", type: "Dining", emoji: "🍽️" },
            ].map((spot, i) => (
              <button key={i} className="feature-card">
                <div className="feature-icon bg-muted">
                  <span className="text-xl">{spot.emoji}</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-foreground">{spot.name}</h3>
                  <p className="text-caption">{spot.type}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
