import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Circle, AlertCircle, Rocket, Download, Shield, Code } from "lucide-react";

interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  status: "completed" | "pending" | "in-progress";
  priority: "critical" | "high" | "medium" | "low";
  notes?: string;
}

const initialChecklist: ChecklistItem[] = [
  // CRITICAL - Google Play Requirements
  { id: "1", category: "Google Play Store", task: "Create Google Play Developer Account ($25 one-time fee)", status: "pending", priority: "critical" },
  { id: "2", category: "Google Play Store", task: "Prepare app icon (512x512 PNG, no transparency)", status: "pending", priority: "critical" },
  { id: "3", category: "Google Play Store", task: "Prepare feature graphic (1024x500 PNG)", status: "pending", priority: "critical" },
  { id: "4", category: "Google Play Store", task: "Write app description (4000 chars max)", status: "pending", priority: "critical" },
  { id: "5", category: "Google Play Store", task: "Take 2-8 screenshots (phone + tablet)", status: "pending", priority: "critical" },
  { id: "6", category: "Google Play Store", task: "Create privacy policy URL", status: "pending", priority: "critical" },
  { id: "7", category: "Google Play Store", task: "Fill out content rating questionnaire", status: "pending", priority: "critical" },
  
  // Capacitor Setup
  { id: "8", category: "Capacitor Setup", task: "Export project to GitHub", status: "pending", priority: "critical" },
  { id: "9", category: "Capacitor Setup", task: "Git clone project locally", status: "pending", priority: "critical" },
  { id: "10", category: "Capacitor Setup", task: "Run 'npm install' in project directory", status: "pending", priority: "critical" },
  { id: "11", category: "Capacitor Setup", task: "Run 'npx cap add android'", status: "pending", priority: "critical" },
  { id: "12", category: "Capacitor Setup", task: "Run 'npm run build'", status: "pending", priority: "critical" },
  { id: "13", category: "Capacitor Setup", task: "Run 'npx cap sync android'", status: "pending", priority: "critical" },
  
  // Android Studio Setup
  { id: "14", category: "Android Studio", task: "Download and install Android Studio", status: "pending", priority: "critical" },
  { id: "15", category: "Android Studio", task: "Install Android SDK (API 33+)", status: "pending", priority: "high" },
  { id: "16", category: "Android Studio", task: "Open android folder in Android Studio", status: "pending", priority: "critical" },
  { id: "17", category: "Android Studio", task: "Wait for Gradle sync to complete", status: "pending", priority: "high" },
  { id: "18", category: "Android Studio", task: "Create signing keystore for release", status: "pending", priority: "critical" },
  { id: "19", category: "Android Studio", task: "Configure build.gradle with signing config", status: "pending", priority: "critical" },
  
  // App Configuration
  { id: "20", category: "App Config", task: "Update app name in strings.xml", status: "pending", priority: "high" },
  { id: "21", category: "App Config", task: "Update applicationId in build.gradle", status: "pending", priority: "critical" },
  { id: "22", category: "App Config", task: "Set versionCode and versionName", status: "pending", priority: "critical" },
  { id: "23", category: "App Config", task: "Configure AndroidManifest.xml permissions", status: "pending", priority: "high" },
  { id: "24", category: "App Config", task: "Add app icons (mipmap folders)", status: "pending", priority: "high" },
  { id: "25", category: "App Config", task: "Configure capacitor.config.ts server URL", status: "pending", priority: "medium" },
  
  // Testing
  { id: "26", category: "Testing", task: "Test app on Android emulator", status: "pending", priority: "critical" },
  { id: "27", category: "Testing", task: "Test app on physical Android device", status: "pending", priority: "critical" },
  { id: "28", category: "Testing", task: "Test all features work offline", status: "pending", priority: "high" },
  { id: "29", category: "Testing", task: "Test camera/file upload permissions", status: "pending", priority: "high" },
  { id: "30", category: "Testing", task: "Test on different screen sizes", status: "pending", priority: "medium" },
  
  // Build & Release
  { id: "31", category: "Build Release", task: "Generate signed release APK", status: "pending", priority: "critical" },
  { id: "32", category: "Build Release", task: "Generate signed App Bundle (AAB)", status: "pending", priority: "critical" },
  { id: "33", category: "Build Release", task: "Test release build on device", status: "pending", priority: "critical" },
  { id: "34", category: "Build Release", task: "Upload AAB to Google Play Console", status: "pending", priority: "critical" },
  { id: "35", category: "Build Release", task: "Create internal testing track first", status: "pending", priority: "high" },
  { id: "36", category: "Build Release", task: "Submit for production review", status: "pending", priority: "critical" },
  
  // Post-Launch
  { id: "37", category: "Post-Launch", task: "Monitor crash reports in Play Console", status: "pending", priority: "high" },
  { id: "38", category: "Post-Launch", task: "Respond to user reviews", status: "pending", priority: "medium" },
  { id: "39", category: "Post-Launch", task: "Track analytics and user engagement", status: "pending", priority: "medium" },
  { id: "40", category: "Post-Launch", task: "Plan updates and bug fixes", status: "pending", priority: "low" },
];

export function AppReadinessChecklist() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = Array.from(new Set(checklist.map(item => item.category)));

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === id
        ? { ...item, status: item.status === "completed" ? "pending" : "completed" }
        : item
    ));
    toast.success("Checklist updated");
  };

  const filteredItems = checklist.filter(item => {
    const statusMatch = filter === "all" || item.status === filter;
    const categoryMatch = categoryFilter === "all" || item.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const completedCount = checklist.filter(i => i.status === "completed").length;
  const totalCount = checklist.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const criticalPending = checklist.filter(i => i.priority === "critical" && i.status !== "completed").length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{progressPercent}%</div>
            <Progress value={progressPercent} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedCount} of {totalCount} tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Critical Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{criticalPending}</div>
            <p className="text-xs text-muted-foreground mt-2">Remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{completedCount}</div>
            <p className="text-xs text-muted-foreground mt-2">Tasks done</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Rocket className="w-4 h-4 text-blue-500" />
              Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">
              {criticalPending === 0 ? "READY" : "NOT READY"}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {criticalPending === 0 ? "All critical tasks done!" : "Complete critical tasks"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All ({totalCount})
            </Button>
            <Button
              size="sm"
              variant={filter === "pending" ? "default" : "outline"}
              onClick={() => setFilter("pending")}
            >
              Pending ({checklist.filter(i => i.status === "pending").length})
            </Button>
            <Button
              size="sm"
              variant={filter === "completed" ? "default" : "outline"}
              onClick={() => setFilter("completed")}
            >
              Completed ({completedCount})
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={categoryFilter === "all" ? "secondary" : "outline"}
              onClick={() => setCategoryFilter("all")}
            >
              All Categories
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={categoryFilter === cat ? "secondary" : "outline"}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Google Play Store Readiness Checklist
          </CardTitle>
          <CardDescription>
            Complete all critical tasks before publishing to Google Play Store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                  item.status === "completed"
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900"
                    : "bg-card border-border hover:border-primary/50"
                }`}
              >
                <Checkbox
                  checked={item.status === "completed"}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="mt-1"
                />
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {item.status === "completed" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className={`font-medium ${
                          item.status === "completed" ? "line-through text-muted-foreground" : ""
                        }`}>
                          {item.task}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <Badge
                          variant={
                            item.priority === "critical" ? "destructive" :
                            item.priority === "high" ? "default" :
                            "secondary"
                          }
                          className="text-xs"
                        >
                          {item.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Installation Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Android Studio Installation Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">📋 Prerequisites</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Windows 10/11 PC with at least 8GB RAM (16GB recommended)</li>
                <li>20GB free disk space minimum</li>
                <li>Git installed on your PC</li>
                <li>Node.js installed (v18 or higher)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">🔧 Step-by-Step Setup</h3>
              <div className="space-y-4 text-sm">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">1. Download Android Studio</h4>
                  <p className="mb-2">Visit: <code className="bg-primary/10 px-2 py-1 rounded">developer.android.com/studio</code></p>
                  <p>Download the latest version for Windows</p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">2. Install Android Studio</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Run the installer</li>
                    <li>Choose "Standard" installation</li>
                    <li>Wait for SDK components to download (15-30 minutes)</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">3. Export Project from Lovable</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Click "Export to GitHub" button in Lovable</li>
                    <li>Create/link GitHub repository</li>
                    <li>Clone to your PC: <code className="bg-primary/10 px-2 py-1 rounded">git clone [your-repo-url]</code></li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">4. Setup Capacitor</h4>
                  <pre className="bg-black text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
{`cd placesbytlc
npm install
npx cap add android
npm run build
npx cap sync android`}
                  </pre>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">5. Open in Android Studio</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Open Android Studio</li>
                    <li>File → Open → Select the <code className="bg-primary/10 px-2 py-1 rounded">android</code> folder</li>
                    <li>Wait for Gradle sync (5-10 minutes first time)</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">6. Create Emulator</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Tools → Device Manager</li>
                    <li>Create Device → Pixel 5 (recommended)</li>
                    <li>Select API Level 33 (Android 13)</li>
                    <li>Download system image if needed</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">7. Run App</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Click green "Run" button (Play icon)</li>
                    <li>Select your emulator</li>
                    <li>Wait for build and app to launch</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">8. Build Release APK</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Build → Generate Signed Bundle / APK</li>
                    <li>Create new keystore (save it safely!)</li>
                    <li>Build release variant</li>
                    <li>APK will be in <code className="bg-primary/10 px-2 py-1 rounded">android/app/release/</code></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
              <h3 className="font-bold text-lg mb-2">⚠️ Important Notes</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Keep your signing keystore safe - you cannot update your app without it!</li>
                <li>First Gradle sync takes a while - be patient</li>
                <li>If build fails, try: File → Invalidate Caches / Restart</li>
                <li>Test on real device before releasing to Play Store</li>
                <li>Update capacitor.config.ts with your production URL</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
