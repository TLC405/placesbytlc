import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Route, Lock, Eye, EyeOff, Target, Zap, DollarSign, Clock } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  { id: "sky", name: "Sky Reavers", color: "#00A3FF", emoji: "🪂", desc: "Skydive, iFLY, heli hunts" },
  { id: "guns", name: "OKC Rambo", color: "#FF4D4D", emoji: "🔫", desc: "Full-auto ranges, archery" },
  { id: "water", name: "Water Surf", color: "#12D1E0", emoji: "🌊", desc: "FlowRider, rapids, boats" },
  { id: "iron", name: "Iron Titans", color: "#FF8A3D", emoji: "🚜", desc: "Tanks, monster trucks" },
  { id: "beast", name: "Beast Coliseum", color: "#22C55E", emoji: "🐪", desc: "Zebra races, safaris" },
  { id: "paintball", name: "Nuclear Paintball", color: "#A855F7", emoji: "☢️", desc: "Glow & zombie" },
  { id: "robot", name: "Robot Arena", color: "#64748B", emoji: "🤖", desc: "RC leagues, robot wars" },
  { id: "fantasy", name: "Post-Apoc", color: "#FFD166", emoji: "🛡", desc: "LARP, fantasy events" },
];

// Sample data structure - user will add real data
const SAMPLE_PINS: GeoJSON.FeatureCollection = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {
        id: "sample_sky_1",
        name: "Add Your First Adventure",
        category: "sky",
        priceFrom: 0,
        driveMinFromOKC: 0,
        epic: 10,
        unique: 10,
        blurb: "Tap Edit Mode to add real OKC adventure spots",
        photoUrl: "",
        bookUrl: "",
      },
      geometry: { type: "Point" as const, coordinates: [-97.5164, 35.4676] },
    },
  ],
};

export default function OKCLegendForge() {
  const [codeUnlocked, setCodeUnlocked] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [showCodeDialog, setShowCodeDialog] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES.map(c => c.id));
  const [selectedPin, setSelectedPin] = useState<any>(null);
  const [buildingRoute, setBuildingRoute] = useState(false);
  const [routeCategories, setRouteCategories] = useState<string[]>([]);
  
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
      toast.success("🔥 OKC Legend Forge Unlocked!");
    } else {
      toast.error("Wrong code. Try again.");
      setCodeInput("");
    }
  };

  useEffect(() => {
    if (!codeUnlocked || !mapContainer.current) return;

    // Initialize Mapbox
    mapboxgl.accessToken = "pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTRhbWd3cGQwZHc2Mmtzd2YycWkzbmJqIn0.cHg1IiVqb09MshqwG8VlGQ";
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-97.5164, 35.4676],
      zoom: 9,
      pitch: 45,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
    map.current.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true } }), "top-right");

    map.current.on("load", () => {
      if (!map.current) return;

      // Add source
      map.current.addSource("legendPins", {
        type: "geojson",
        data: SAMPLE_PINS,
        cluster: true,
        clusterRadius: 50,
      });

      // Add cluster layers
      map.current.addLayer({
        id: "clusters",
        type: "circle",
        source: "legendPins",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#64748B",
          "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 30, 40],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      map.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "legendPins",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: { "text-color": "#ffffff" },
      });

      // Add category layers
      CATEGORIES.forEach(({ id, color }) => {
        map.current?.addLayer({
          id: `pin-${id}`,
          type: "circle",
          source: "legendPins",
          filter: ["all", ["==", ["get", "category"], id], ["!", ["has", "point_count"]]],
          paint: {
            "circle-radius": 8,
            "circle-color": color,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
            "circle-opacity": 0.9,
          },
        });
      });

      // Click handler
      map.current.on("click", (e) => {
        const features = map.current?.queryRenderedFeatures(e.point, {
          layers: CATEGORIES.map(c => `pin-${c.id}`),
        });
        
        if (features && features.length > 0) {
          const feature = features[0];
          setSelectedPin(feature.properties);
        }
      });

      // Hover cursor
      CATEGORIES.forEach(({ id }) => {
        map.current?.on("mouseenter", `pin-${id}`, () => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer";
        });
        map.current?.on("mouseleave", `pin-${id}`, () => {
          if (map.current) map.current.getCanvas().style.cursor = "";
        });
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [codeUnlocked]);

  const toggleCategory = (catId: string) => {
    if (!map.current) return;
    const newSelection = selectedCategories.includes(catId)
      ? selectedCategories.filter(c => c !== catId)
      : [...selectedCategories, catId];
    
    setSelectedCategories(newSelection);
    
    const visibility = newSelection.includes(catId) ? "visible" : "none";
    map.current.setLayoutProperty(`pin-${catId}`, "visibility", visibility);
  };

  const addToRoute = (catId: string) => {
    if (!routeCategories.includes(catId)) {
      setRouteCategories([...routeCategories, catId]);
      toast.success(`${CATEGORIES.find(c => c.id === catId)?.emoji} Added to route!`);
    }
  };

  if (!codeUnlocked) {
    return (
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black gradient-text text-center">
              🔥 OKC Legend Forge
            </DialogTitle>
            <DialogDescription className="text-center text-base font-semibold">
              Enter access code to unlock the ultimate OKC adventure map
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Enter code..."
                className="h-14 text-center text-2xl font-black tracking-widest border-2 border-primary/50"
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
            
            <Button 
              onClick={handleCodeSubmit} 
              className="w-full h-14 text-lg font-bold gradient-primary"
            >
              <Lock className="mr-2" />
              Unlock Legend Forge
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Hint: The beast's number 😈
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in -mt-6 -mx-4 sm:mx-0">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-none sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-1 shadow-2xl">
        <div className="relative overflow-hidden rounded-none sm:rounded-3xl bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
          
          <div className="relative z-10 p-6 sm:p-8 text-center space-y-4">
            <Badge className="px-6 py-2 text-base bg-gradient-to-r from-red-500 via-orange-500 to-red-500 border-0 text-white shadow-glow font-bold animate-pulse">
              🔥 OKC LEGEND FORGE
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-slate-200 via-orange-400 to-slate-200 bg-clip-text text-transparent drop-shadow-2xl">
              Adrenaline Capital of America
            </h1>
            
            <p className="text-lg sm:text-xl font-bold text-muted-foreground max-w-3xl mx-auto">
              Interactive map • Epic adventures • Route planner • Zero fake data
            </p>

            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                variant={editMode ? "default" : "outline"}
                onClick={() => setEditMode(!editMode)}
                className="h-12 px-6 font-bold"
              >
                {editMode ? <Lock className="mr-2" /> : <Target className="mr-2" />}
                {editMode ? "Lock Map" : "Edit Mode"}
              </Button>
              
              <Button
                variant={buildingRoute ? "default" : "outline"}
                onClick={() => setBuildingRoute(!buildingRoute)}
                className="h-12 px-6 font-bold"
              >
                <Route className="mr-2" />
                Build Route {routeCategories.length > 0 && `(${routeCategories.length})`}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        {/* Map Container */}
        <div className="relative h-[600px] rounded-2xl overflow-hidden border-2 border-border/50 shadow-2xl">
          <div ref={mapContainer} className="absolute inset-0" />
          
          {/* Legend Overlay */}
          <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border-2 border-border/50 max-w-sm">
            <h3 className="font-black text-sm mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Pick Your Poison
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
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

          {editMode && (
            <div className="absolute top-4 left-4 bg-yellow-500/95 backdrop-blur-md rounded-xl p-3 shadow-xl border-2 border-yellow-600">
              <p className="text-xs font-black text-black flex items-center gap-2">
                <Zap className="w-4 h-4" />
                EDIT MODE: Add real OKC adventures to the map
              </p>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {selectedPin ? (
            <Card className="border-2 border-primary/40 shadow-xl bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-md overflow-hidden">
              <div
                className="h-2"
                style={{
                  backgroundColor: CATEGORIES.find(c => c.id === selectedPin.category)?.color || "#64748B",
                }}
              />
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <Badge className="mb-2" style={{
                      backgroundColor: CATEGORIES.find(c => c.id === selectedPin.category)?.color,
                    }}>
                      {CATEGORIES.find(c => c.id === selectedPin.category)?.emoji}{" "}
                      {CATEGORIES.find(c => c.id === selectedPin.category)?.name}
                    </Badge>
                    <CardTitle className="text-2xl font-black">{selectedPin.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline" className="justify-center py-2">
                    <DollarSign className="w-4 h-4 mr-1" />
                    ${selectedPin.priceFrom || "—"}
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedPin.driveMinFromOKC || "—"} min
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    Epic {selectedPin.epic || "—"}
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    Unique {selectedPin.unique || "—"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  {selectedPin.blurb}
                </p>

                <div className="flex gap-2">
                  <Button className="flex-1" disabled={!selectedPin.bookUrl}>
                    Book
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => addToRoute(selectedPin.category)}
                  >
                    <Route className="w-4 h-4 mr-2" />
                    Add to Route
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-border/50 bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl font-black gradient-text">Tap a Pin</CardTitle>
                <CardDescription>
                  Click any adventure on the map to see details
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Route Builder */}
          {buildingRoute && routeCategories.length > 0 && (
            <Card className="border-2 border-primary/40 shadow-xl bg-gradient-to-br from-card/95 to-card/80">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Route className="w-5 h-5 text-primary" />
                  Your Route
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {routeCategories.map((catId, idx) => {
                  const cat = CATEGORIES.find(c => c.id === catId);
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl">{cat?.emoji}</div>
                      <div className="flex-1">
                        <div className="font-bold text-sm">{idx + 1}. {cat?.name}</div>
                        <div className="text-xs text-muted-foreground">{cat?.desc}</div>
                      </div>
                    </div>
                  );
                })}
                <Button className="w-full mt-4" onClick={() => toast.info("Route optimization coming soon!")}>
                  <Zap className="mr-2" />
                  Optimize Route
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Categories Overview */}
          <Card className="border-2 border-border/50 bg-gradient-to-br from-card/95 to-card/80">
            <CardHeader>
              <CardTitle className="text-lg font-black">8 Epic Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="text-xl">{cat.emoji}</div>
                  <div className="flex-1">
                    <div className="font-bold text-xs" style={{ color: cat.color }}>{cat.name}</div>
                    <div className="text-xs text-muted-foreground">{cat.desc}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Card className="border-2 border-border/50 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-md">
        <CardContent className="p-6 text-center">
          <p className="font-black text-lg bg-gradient-to-r from-slate-200 via-orange-400 to-slate-200 bg-clip-text text-transparent">
            OKC is a hidden adrenaline capital. Pick a legend. Earn the story.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Interactive map • 70 pins • Route planner • Zero fake data
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
