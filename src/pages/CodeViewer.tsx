import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, FileCode, Search, Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";

const projectStructure = {
  "src/pages": [
    "Home.tsx", "Explore.tsx", "Plan.tsx", "Quizzes.tsx", "QuizLove.tsx", "QuizMBTI.tsx",
    "TeeFeeMeCartoonifier.tsx", "PeriodTracker.tsx", "Install.tsx", "AdminPanel.tsx", "NotFound.tsx"
  ],
  "src/components": [
    "Header.tsx", "PlaceCard.tsx", "SearchBar.tsx", "FilterBar.tsx", "PlanSidebar.tsx",
    "DetailedCupid.tsx", "LoadingScreen.tsx", "ActivityTracker.tsx", "DarkModeToggle.tsx"
  ],
  "src/hooks": [
    "useGoogleMaps.ts", "useGeolocation.ts", "usePlacesSearch.ts", "use-mobile.tsx"
  ],
  "src/lib": [
    "googleMaps.ts", "midpointCalculator.ts", "utils.ts", "storage.ts", "secureStorage.ts"
  ]
};

export default function CodeViewer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const repoUrl = "https://github.com/lovable-dev/placesbytlc";
  const rawBaseUrl = "https://raw.githubusercontent.com/lovable-dev/placesbytlc/main";

  const handleCopyLink = (file: string, folder: string) => {
    const link = `${rawBaseUrl}/${folder}/${file}`;
    navigator.clipboard.writeText(link);
    setCopiedFile(file);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const filteredStructure = Object.entries(projectStructure).reduce((acc, [folder, files]) => {
    const filtered = files.filter(file => 
      file.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[folder] = filtered;
    }
    return acc;
  }, {} as typeof projectStructure);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in p-4">
      <Card className="shadow-glow border-2 border-primary/30">
        <div className="h-3 bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-[length:200%_100%]" />
        
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black gradient-text">
                  Places Source Code
                </CardTitle>
                <CardDescription className="text-base">
                  Open source • Built with React, TypeScript & Lovable
                </CardDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.open(repoUrl, "_blank")}
            >
              <Download className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs defaultValue="structure" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="structure">File Structure</TabsTrigger>
              <TabsTrigger value="tech">Tech Stack</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="space-y-4">
              <ScrollArea className="h-[600px] rounded-lg border p-4">
                {Object.entries(filteredStructure).map(([folder, files]) => (
                  <div key={folder} className="mb-6">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-primary" />
                      {folder}
                    </h3>
                    <div className="space-y-2 ml-4">
                      {files.map((file) => (
                        <div 
                          key={file}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <code className="text-sm font-mono">{file}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyLink(file, folder)}
                          >
                            {copiedFile === file ? (
                              <Check className="w-4 h-4 text-success" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="tech" className="space-y-4">
              <Card className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">Frontend Framework</h3>
                  <ul className="space-y-2 ml-4">
                    <li>• <strong>React 18</strong> - Modern UI library with hooks</li>
                    <li>• <strong>TypeScript</strong> - Type-safe development</li>
                    <li>• <strong>Vite</strong> - Lightning-fast build tool</li>
                    <li>• <strong>React Router</strong> - Client-side routing</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">UI & Styling</h3>
                  <ul className="space-y-2 ml-4">
                    <li>• <strong>Tailwind CSS</strong> - Utility-first styling</li>
                    <li>• <strong>shadcn/ui</strong> - Beautiful component library</li>
                    <li>• <strong>Radix UI</strong> - Accessible primitives</li>
                    <li>• <strong>Lucide Icons</strong> - Consistent iconography</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Backend & Services</h3>
                  <ul className="space-y-2 ml-4">
                    <li>• <strong>Supabase</strong> - PostgreSQL database & auth</li>
                    <li>• <strong>Google Maps API</strong> - Places & geolocation</li>
                    <li>• <strong>Edge Functions</strong> - Serverless backend logic</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Progressive Web App</h3>
                  <ul className="space-y-2 ml-4">
                    <li>• <strong>vite-plugin-pwa</strong> - PWA capabilities</li>
                    <li>• <strong>Workbox</strong> - Service worker management</li>
                    <li>• <strong>Web App Manifest</strong> - Installable app</li>
                  </ul>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <Card className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">Core Features</h3>
                  <ul className="space-y-2 ml-4">
                    <li>✨ <strong>Smart Place Discovery</strong> - AI-powered date spot recommendations</li>
                    <li>📍 <strong>Geolocation</strong> - Find places near you or calculate midpoints</li>
                    <li>💝 <strong>Date Planning</strong> - Save and organize your favorite places</li>
                    <li>🎯 <strong>Advanced Filters</strong> - Search by type, price, rating, and distance</li>
                    <li>🌓 <strong>Dark Mode</strong> - Beautiful themes for any lighting</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Fun Features</h3>
                  <ul className="space-y-2 ml-4">
                    <li>💕 <strong>Love Language Quiz</strong> - Discover your love language</li>
                    <li>🧠 <strong>MBTI Personality Test</strong> - Find your personality type</li>
                    <li>📅 <strong>Period Tracker</strong> - For thoughtful partners</li>
                    <li>🎨 <strong>Cartoon Generator</strong> - Create fun avatars</li>
                    <li>💘 <strong>Interactive Cupid</strong> - Animated mascot companion</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Technical Highlights</h3>
                  <ul className="space-y-2 ml-4">
                    <li>🔐 <strong>Secure Authentication</strong> - User accounts with Supabase Auth</li>
                    <li>📊 <strong>Activity Tracking</strong> - Analytics for user behavior</li>
                    <li>⚡ <strong>Performance Optimized</strong> - Code splitting & lazy loading</li>
                    <li>📱 <strong>Mobile First</strong> - Responsive design for all devices</li>
                    <li>♿ <strong>Accessible</strong> - ARIA labels & semantic HTML</li>
                  </ul>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30">
            <div className="flex items-start gap-4">
              <Code2 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">For AI Assistants & Developers</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This page is designed to help AI assistants (ChatGPT, Claude, Grok, etc.) understand
                  and reference the Places codebase. All files are publicly accessible and well-documented.
                </p>
                <div className="space-y-1 text-sm">
                  <p>• <strong>GitHub:</strong> <code className="bg-background px-2 py-1 rounded">{repoUrl}</code></p>
                  <p>• <strong>License:</strong> Open Source</p>
                  <p>• <strong>Built with:</strong> React, TypeScript, Lovable, Supabase</p>
                </div>
              </div>
            </div>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
