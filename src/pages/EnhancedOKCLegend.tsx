import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Route, Lock, Eye, EyeOff, Skull, Anchor, Compass, Map as MapIcon } from "lucide-react";
import { toast } from "sonner";
import { useDevMode } from "@/contexts/DevModeContext";

const CATEGORIES = [
  { id: "sky", name: "Sky Reavers", color: "#00A3FF", emoji: "🪂", desc: "Aerial adventures" },
  { id: "guns", name: "OKC Rambo", color: "#FF4D4D", emoji: "🔫", desc: "Tactical experiences" },
  { id: "water", name: "Water Surf", color: "#12D1E0", emoji: "🌊", desc: "Aquatic thrills" },
  { id: "iron", name: "Iron Titans", color: "#FF8A3D", emoji: "🚜", desc: "Heavy machinery" },
  { id: "beast", name: "Beast Coliseum", color: "#22C55E", emoji: "🐪", desc: "Wildlife encounters" },
  { id: "paintball", name: "Nuclear Paintball", color: "#A855F7", emoji: "☢️", desc: "Combat zones" },
  { id: "robot", name: "Robot Arena", color: "#64748B", emoji: "🤖", desc: "Tech battles" },
  { id: "fantasy", name: "Post-Apoc", color: "#FFD166", emoji: "🛡", desc: "LARP adventures" },
];

export default function EnhancedOKCLegend() {
  const { isDevMode } = useDevMode();
  const [codeUnlocked, setCodeUnlocked] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [showCodeDialog, setShowCodeDialog] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES.map(c => c.id));
  const [selectedPin, setSelectedPin] = useState<any>(null);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const unlocked = sessionStorage.getItem("okc_legend_unlocked");
    if (unlocked === "true") {
      setCodeUnlocked(true);
      setShowCodeDialog(false);
    }
  }, []);

  const handleCodeSubmit = () => {
    if (codeInput === "666") {
      setCodeUnlocked(true);
      setShowCodeDialog(false);
      sessionStorage.setItem("okc_legend_unlocked", "true");
      toast.success("🏴‍☠️ OKC Legend Unlocked - Pirate Map Activated!");
    } else {
      toast.error("Wrong code, matey. Try again.");
      setCodeInput("");
    }
  };

  useEffect(() => {
    if (!codeUnlocked || !mapContainer.current) return;

    mapboxgl.accessToken = "pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTRhbWd3cGQwZHc2Mmtzd2YycWkzbmJqIn0.cHg1IiVqb09MshqwG8VlGQ";
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [-97.5164, 35.4676],
      zoom: 10,
      pitch: 45,
    });

    // Add pirate-themed controls
    map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

    // Add pirate-themed overlays
    map.current.on("load", () => {
      if (!map.current) return;

      // Add aged paper texture overlay
      map.current.setPaintProperty('satellite', 'raster-opacity', 0.6);
      map.current.setPaintProperty('satellite', 'raster-saturation', -0.5);
      map.current.setPaintProperty('satellite', 'raster-contrast', 0.3);
    });

    return () => {
      map.current?.remove();
    };
  }, [codeUnlocked]);

  if (!codeUnlocked) {
    return (
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="max-w-md border-4 border-amber-900 bg-gradient-to-br from-amber-950 to-stone-950">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <Skull className="w-16 h-16 text-amber-600 animate-pulse" />
            </div>
            <DialogTitle className="text-4xl font-black text-center bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
              🏴‍☠️ PIRATE'S TREASURE MAP
            </DialogTitle>
            <DialogDescription className="text-center text-lg font-bold text-amber-700">
              Enter the devil's code to unlock the legendary OKC adventure map
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Enter code..."
                className="h-16 text-center text-3xl font-black tracking-widest border-4 border-amber-900 bg-stone-900 text-amber-400"
                onKeyPress={(e) => e.key === "Enter" && handleCodeSubmit()}
                maxLength={3}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-3 text-amber-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </Button>
            </div>
            
            <Button 
              onClick={handleCodeSubmit} 
              className="w-full h-16 text-xl font-black bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-white shadow-2xl border-2 border-amber-900"
            >
              <Anchor className="mr-2 w-6 h-6" />
              HOIST THE COLORS
            </Button>
            
            <div className="text-center text-sm text-amber-700 font-bold space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Compass className="w-4 h-4" />
                <span>Hint: The beast's number 😈</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in -mt-6 -mx-4 sm:mx-0">
      {/* Pirate Hero Header */}
      <div className="relative overflow-hidden rounded-none sm:rounded-3xl bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950 p-1 shadow-2xl border-4 border-amber-900">
        <div className="relative overflow-hidden rounded-none sm:rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAgMCBMIDAgMCAwIDEwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjQ1LDE1OCw0NCwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] backdrop-blur-xl p-8">
          
          <div className="relative z-10 text-center space-y-4">
            <div className="flex justify-center gap-4 mb-4">
              <Skull className="w-10 h-10 text-amber-600 animate-bounce" />
              <Anchor className="w-10 h-10 text-amber-600 animate-pulse" />
              <Compass className="w-10 h-10 text-amber-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            
            <Badge className="px-6 py-2 text-base bg-gradient-to-r from-amber-700 to-orange-700 border-2 border-amber-900 text-white shadow-glow font-black animate-pulse">
              🏴‍☠️ YE OLDE TREASURE MAP
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl">
              OKC ADVENTURE LEGENDS
            </h1>
            
            <p className="text-lg sm:text-xl font-bold text-amber-700 max-w-3xl mx-auto">
              🗺️ Ancient map of legendary adventures • 8 quest zones • No landlubber mock data
            </p>

            <div className="flex items-center justify-center gap-2 text-amber-600">
              <MapIcon className="w-5 h-5" />
              <span className="font-bold text-sm">
                Click the categories below to filter your adventure path
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        {/* Pirate Map Container */}
        <div className="relative h-[600px] rounded-2xl overflow-hidden border-4 border-amber-900 shadow-2xl">
          {/* Aged paper border effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/10 via-transparent to-stone-900/10 pointer-events-none z-10" />
          
          <div ref={mapContainer} className="absolute inset-0 sepia-[0.3] saturate-[0.7]" />
          
          {/* Pirate-themed Legend Overlay */}
          <div className="absolute bottom-4 left-4 bg-gradient-to-br from-amber-950/95 to-stone-950/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border-4 border-amber-900 max-w-sm">
            <h3 className="font-black text-sm mb-3 flex items-center gap-2 text-amber-400">
              <Skull className="w-4 h-4" />
              QUEST CATEGORIES
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    const newSelection = selectedCategories.includes(cat.id)
                      ? selectedCategories.filter(c => c !== cat.id)
                      : [...selectedCategories, cat.id];
                    setSelectedCategories(newSelection);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all duration-300 hover:scale-110 ${
                    selectedCategories.includes(cat.id)
                      ? "opacity-100 shadow-lg"
                      : "opacity-40"
                  }`}
                  style={{
                    backgroundColor: selectedCategories.includes(cat.id) ? cat.color : "transparent",
                    borderColor: cat.color,
                    color: selectedCategories.includes(cat.id) ? "#fff" : cat.color,
                  }}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Compass Rose */}
          <div className="absolute top-4 right-4 w-20 h-20 opacity-30 pointer-events-none">
            <Compass className="w-full h-full text-amber-600 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <Card className="border-4 border-amber-900 shadow-2xl bg-gradient-to-br from-amber-950/95 to-stone-950/95 backdrop-blur-md overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700" />
            <CardHeader>
              <CardTitle className="text-2xl font-black text-amber-400 flex items-center gap-2">
                <Anchor className="w-6 h-6" />
                {selectedPin ? "ADVENTURE DETAILS" : "SELECT A QUEST"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedPin ? (
                <div className="text-center py-8 space-y-4">
                  <Skull className="w-16 h-16 text-amber-600 mx-auto animate-pulse" />
                  <p className="text-amber-700 font-bold">
                    Click any location on the map to view adventure details
                  </p>
                  <div className="text-xs text-amber-800 font-medium">
                    💀 Real OKC adventures only - no mock data
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-amber-400">
                  <div className="text-lg font-bold">{selectedPin.name || "Unknown Location"}</div>
                  <div className="text-sm text-amber-700">{selectedPin.description || "No description available"}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pirate Legend */}
          <Card className="border-4 border-amber-900 shadow-2xl bg-gradient-to-br from-stone-950/95 to-amber-950/95">
            <CardContent className="p-6 space-y-3 text-amber-700 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Skull className="w-4 h-4" />
                <span>🏴‍☠️ This be a genuine pirate's map</span>
              </div>
              <div className="flex items-center gap-2">
                <Anchor className="w-4 h-4" />
                <span>⚓ No fake treasures - real adventures only</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span>🧭 Chart yer course through 8 quest zones</span>
              </div>
              {isDevMode && (
                <div className="flex items-center gap-2 text-purple-400">
                  <span className="text-xl">💎</span>
                  <span>PLATINUM MODE: Enhanced map features active</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        .sepia-\[0\.3\] {
          filter: sepia(0.3) contrast(1.1);
        }
        .saturate-\[0\.7\] {
          filter: saturate(0.7);
        }
      `}</style>
    </div>
  );
}
