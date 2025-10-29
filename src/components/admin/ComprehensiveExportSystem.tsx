import { useState } from "react";
import { Download, Package, FileText, Code2, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExportSection {
  id: string;
  name: string;
  icon: any;
  description: string;
  fileCount: number;
  gradient: string;
  category: string;
}

export default function ComprehensiveExportSystem() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const exportSections: ExportSection[] = [
    {
      id: "teefeeme",
      name: "TeeFee Me Cartoonifier",
      icon: Sparkles,
      description: "AI-powered cartoon generator with full edge function logic",
      fileCount: 5,
      gradient: "from-purple-500 to-pink-500",
      category: "features"
    },
    {
      id: "places",
      name: "Places Discovery System",
      icon: Package,
      description: "Complete location search, filters, Google Maps integration",
      fileCount: 15,
      gradient: "from-blue-500 to-cyan-500",
      category: "features"
    },
    {
      id: "quizzes",
      name: "Quizzes & Assessments",
      icon: Code2,
      description: "Love language, MBTI quizzes with full question data",
      fileCount: 7,
      gradient: "from-green-500 to-emerald-500",
      category: "features"
    },
    {
      id: "period-tracker",
      name: "Period Tracker (Peripod)",
      icon: Zap,
      description: "Cycle tracking for partners with predictions",
      fileCount: 4,
      gradient: "from-rose-500 to-red-500",
      category: "features"
    },
    {
      id: "admin",
      name: "Admin Panel & Analytics",
      icon: FileText,
      description: "Complete admin dashboard, user tracking, analytics",
      fileCount: 12,
      gradient: "from-orange-500 to-amber-500",
      category: "admin"
    },
    {
      id: "auth",
      name: "Authentication System",
      icon: Code2,
      description: "PIN access, role management, security gates",
      fileCount: 6,
      gradient: "from-indigo-500 to-purple-500",
      category: "core"
    },
    {
      id: "ai-features",
      name: "AI & Recommendations",
      icon: Sparkles,
      description: "AI recommender engine with edge functions",
      fileCount: 5,
      gradient: "from-violet-500 to-fuchsia-500",
      category: "features"
    },
    {
      id: "couple-mode",
      name: "Couple Features",
      icon: Package,
      description: "Pairing system, shared data, couple dashboard",
      fileCount: 4,
      gradient: "from-pink-500 to-rose-500",
      category: "features"
    },
    {
      id: "ui-components",
      name: "UI Components Library",
      icon: Code2,
      description: "Reusable components, Cupid character, animations",
      fileCount: 20,
      gradient: "from-cyan-500 to-blue-500",
      category: "core"
    },
    {
      id: "tracking",
      name: "Analytics & Tracking",
      icon: FileText,
      description: "Session tracking, activity logs, user analytics",
      fileCount: 8,
      gradient: "from-yellow-500 to-orange-500",
      category: "admin"
    },
    {
      id: "database",
      name: "Database Schema & RLS",
      icon: Package,
      description: "Complete SQL migrations, tables, policies",
      fileCount: 18,
      gradient: "from-teal-500 to-green-500",
      category: "backend"
    },
    {
      id: "edge-functions",
      name: "All Edge Functions",
      icon: Zap,
      description: "Backend serverless functions (AI, SMS, tracking)",
      fileCount: 10,
      gradient: "from-red-500 to-pink-500",
      category: "backend"
    },
  ];

  const downloadSection = async (sectionId: string) => {
    setDownloading(sectionId);
    
    try {
      toast.info(`📦 Preparing ${sectionId} package...`);
      
      // Call edge function to generate ZIP
      const { data, error } = await supabase.functions.invoke('export-section', {
        body: { sectionId }
      });

      if (error) throw error;

      if (data?.downloadUrl) {
        // Create download link
        const a = document.createElement('a');
        a.href = data.downloadUrl;
        a.download = `${sectionId}-${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast.success(`✅ Downloaded ${data.fileName}`);
      } else {
        throw new Error('No download URL returned');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed to download: ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const downloadAll = async () => {
    toast.info("📦 Preparing complete codebase ZIP...");
    setDownloading('all');
    
    try {
      const { data, error } = await supabase.functions.invoke('export-section', {
        body: { sectionId: 'complete' }
      });

      if (error) throw error;

      if (data?.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
        toast.success(`✅ Complete codebase downloaded!`);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed: ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const categories = {
    features: exportSections.filter(s => s.category === 'features'),
    admin: exportSections.filter(s => s.category === 'admin'),
    core: exportSections.filter(s => s.category === 'core'),
    backend: exportSections.filter(s => s.category === 'backend')
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-black flex items-center gap-3">
                <Package className="w-8 h-8 text-primary" />
                Comprehensive Export System
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Download complete sections as ZIP files with full source code, documentation, and setup instructions
              </CardDescription>
            </div>
            <Button 
              onClick={downloadAll}
              disabled={downloading !== null}
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary to-primary-variant"
            >
              <Download className="w-5 h-5" />
              {downloading === 'all' ? 'Packaging...' : 'Download Complete App'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tabbed Categories */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="features">
            Features ({categories.features.length})
          </TabsTrigger>
          <TabsTrigger value="core">
            Core ({categories.core.length})
          </TabsTrigger>
          <TabsTrigger value="backend">
            Backend ({categories.backend.length})
          </TabsTrigger>
          <TabsTrigger value="admin">
            Admin ({categories.admin.length})
          </TabsTrigger>
        </TabsList>

        {Object.entries(categories).map(([key, sections]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections.map((section) => {
                const Icon = section.icon;
                const isDownloading = downloading === section.id;
                
                return (
                  <Card 
                    key={section.id}
                    className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Gradient Header */}
                    <div className={`h-2 bg-gradient-to-r ${section.gradient}`} />
                    
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${section.gradient} bg-opacity-10`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {section.fileCount} files
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-lg mt-4">
                        {section.name}
                      </CardTitle>
                      
                      <CardDescription className="text-sm">
                        {section.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <Button
                        onClick={() => downloadSection(section.id)}
                        disabled={isDownloading || downloading !== null}
                        className={`w-full gap-2 bg-gradient-to-r ${section.gradient}`}
                        size="sm"
                      >
                        {isDownloading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Packaging...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Download ZIP
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Instructions Card */}
      <Card className="border-2 border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Manual Update Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <h3 className="text-base font-semibold">How to use exported files:</h3>
            <ol className="text-sm space-y-2">
              <li>
                <strong>Download a section ZIP</strong> - Click any section's "Download ZIP" button
              </li>
              <li>
                <strong>Extract the files</strong> - Unzip to see all source code, documentation, and setup instructions
              </li>
              <li>
                <strong>Read SECTION_README.md</strong> - Every ZIP includes detailed documentation
              </li>
              <li>
                <strong>Copy files to your project</strong> - Follow the file structure in the README
              </li>
              <li>
                <strong>Install dependencies</strong> - Run <code>npm install</code> for any new packages
              </li>
              <li>
                <strong>Update environment variables</strong> - Copy required env vars from .env.example
              </li>
            </ol>

            <h3 className="text-base font-semibold mt-4">Each ZIP includes:</h3>
            <ul className="text-sm space-y-1">
              <li>✅ Complete source code for that section</li>
              <li>✅ Detailed README with setup instructions</li>
              <li>✅ File structure diagram</li>
              <li>✅ Dependencies list</li>
              <li>✅ Environment variables needed</li>
              <li>✅ Database migrations (if applicable)</li>
              <li>✅ Edge functions (if applicable)</li>
              <li>✅ Testing examples</li>
            </ul>

            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm font-semibold text-primary mb-2">💡 Pro Tip:</p>
              <p className="text-sm text-muted-foreground">
                Download the "Complete App" ZIP to get everything at once with a master README
                that explains the full architecture and how all sections work together.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
