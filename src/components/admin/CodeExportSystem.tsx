import { useState } from "react";
import { Download, Folder, FileCode, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeFile {
  name: string;
  path: string;
  category: string;
}

interface CodeCategory {
  id: string;
  name: string;
  icon: string;
  files: CodeFile[];
}

export const CodeExportSystem = () => {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const codeStructure: CodeCategory[] = [
    {
      id: "teefeeme",
      name: "TeeFee Me (Cartoonifier)",
      icon: "🎨",
      files: [
        { name: "TeeFeeMeCartoonifier.tsx", path: "src/pages/TeeFeeMeCartoonifier.tsx", category: "teefeeme" },
        { name: "teefeeme-cartoonify (Edge Function)", path: "supabase/functions/teefeeme-cartoonify/index.ts", category: "teefeeme" },
      ]
    },
    {
      id: "places",
      name: "Places by TLC (Search & Discovery)",
      icon: "📍",
      files: [
        { name: "NewHome.tsx", path: "src/pages/NewHome.tsx", category: "places" },
        { name: "Home.tsx", path: "src/pages/Home.tsx", category: "places" },
        { name: "SearchBar.tsx", path: "src/components/SearchBar.tsx", category: "places" },
        { name: "FilterBar.tsx", path: "src/components/FilterBar.tsx", category: "places" },
        { name: "PlaceCard.tsx", path: "src/components/PlaceCard.tsx", category: "places" },
        { name: "PlaceDetailsModal.tsx", path: "src/components/PlaceDetailsModal.tsx", category: "places" },
        { name: "usePlacesSearch.ts", path: "src/hooks/usePlacesSearch.ts", category: "places" },
        { name: "useGeolocation.ts", path: "src/hooks/useGeolocation.ts", category: "places" },
        { name: "useGoogleMaps.ts", path: "src/hooks/useGoogleMaps.ts", category: "places" },
        { name: "googleMaps.ts", path: "src/lib/googleMaps.ts", category: "places" },
        { name: "midpointCalculator.ts", path: "src/lib/midpointCalculator.ts", category: "places" },
        { name: "discover-date-spots (Edge Function)", path: "supabase/functions/discover-date-spots/index.ts", category: "places" },
        { name: "event-discovery (Edge Function)", path: "supabase/functions/event-discovery/index.ts", category: "places" },
      ]
    },
    {
      id: "quizzes",
      name: "Quizzes & Assessments",
      icon: "🧠",
      files: [
        { name: "Quizzes.tsx", path: "src/pages/Quizzes.tsx", category: "quizzes" },
        { name: "QuizLove.tsx", path: "src/pages/QuizLove.tsx", category: "quizzes" },
        { name: "QuizMBTI.tsx", path: "src/pages/QuizMBTI.tsx", category: "quizzes" },
        { name: "loveLanguageQuiz.ts", path: "src/data/loveLanguageQuiz.ts", category: "quizzes" },
        { name: "mbtiQuiz.ts", path: "src/data/mbtiQuiz.ts", category: "quizzes" },
      ]
    },
    {
      id: "period-tracker",
      name: "Period Tracker (Peripod)",
      icon: "📅",
      files: [
        { name: "PeriodTracker.tsx", path: "src/pages/PeriodTracker.tsx", category: "period-tracker" },
        { name: "PeriodTrackerForGuys.tsx", path: "src/components/PeriodTrackerForGuys.tsx", category: "period-tracker" },
        { name: "period-tracker-setup (Edge Function)", path: "supabase/functions/period-tracker-setup/index.ts", category: "period-tracker" },
      ]
    },
    {
      id: "admin",
      name: "Admin Panel",
      icon: "⚙️",
      files: [
        { name: "AdminPanel.tsx", path: "src/pages/AdminPanel.tsx", category: "admin" },
        { name: "CommandStation.tsx", path: "src/components/admin/CommandStation.tsx", category: "admin" },
        { name: "UserAnalyticsDashboard.tsx", path: "src/components/admin/UserAnalyticsDashboard.tsx", category: "admin" },
        { name: "UserProfileViewer.tsx", path: "src/components/admin/UserProfileViewer.tsx", category: "admin" },
        { name: "CodeExportSystem.tsx", path: "src/components/admin/CodeExportSystem.tsx", category: "admin" },
        { name: "admin-portal-data (Edge Function)", path: "supabase/functions/admin-portal-data/index.ts", category: "admin" },
      ]
    },
    {
      id: "auth",
      name: "Authentication & Access Control",
      icon: "🔐",
      files: [
        { name: "CodeGate.tsx", path: "src/components/CodeGate.tsx", category: "auth" },
        { name: "AppAuthGate.tsx", path: "src/components/AppAuthGate.tsx", category: "auth" },
        { name: "AuthPanel.tsx", path: "src/components/AuthPanel.tsx", category: "auth" },
      ]
    },
    {
      id: "ai",
      name: "AI & Recommendations",
      icon: "✨",
      files: [
        { name: "AIRecommender.tsx", path: "src/pages/AIRecommender.tsx", category: "ai" },
        { name: "AIRecommendations.tsx", path: "src/components/AIRecommendations.tsx", category: "ai" },
        { name: "ai-recommender (Edge Function)", path: "supabase/functions/ai-recommender/index.ts", category: "ai" },
      ]
    },
    {
      id: "couple",
      name: "Couple Mode & Shared Features",
      icon: "💑",
      files: [
        { name: "CoupleMode.tsx", path: "src/pages/CoupleMode.tsx", category: "couple" },
      ]
    },
    {
      id: "gamification",
      name: "Gamification & Legend Forge",
      icon: "🎮",
      files: [
        { name: "Gamification.tsx", path: "src/pages/Gamification.tsx", category: "gamification" },
        { name: "OKCLegendForge.tsx", path: "src/pages/OKCLegendForge.tsx", category: "gamification" },
      ]
    },
    {
      id: "ui-components",
      name: "Shared UI Components",
      icon: "🎨",
      files: [
        { name: "Header.tsx", path: "src/components/Header.tsx", category: "ui-components" },
        { name: "LoadingScreen.tsx", path: "src/components/LoadingScreen.tsx", category: "ui-components" },
        { name: "ErrorBoundary.tsx", path: "src/components/ErrorBoundary.tsx", category: "ui-components" },
        { name: "DetailedCupid.tsx", path: "src/components/DetailedCupid.tsx", category: "ui-components" },
        { name: "FloatingHearts.tsx", path: "src/components/FloatingHearts.tsx", category: "ui-components" },
      ]
    },
    {
      id: "tracking",
      name: "Analytics & Tracking",
      icon: "📊",
      files: [
        { name: "ActivityTracker.tsx", path: "src/components/ActivityTracker.tsx", category: "tracking" },
        { name: "useSessionTracker.ts", path: "src/hooks/useSessionTracker.ts", category: "tracking" },
        { name: "session-tracker (Edge Function)", path: "supabase/functions/session-tracker/index.ts", category: "tracking" },
        { name: "track-activity (Edge Function)", path: "supabase/functions/track-activity/index.ts", category: "tracking" },
      ]
    },
    {
      id: "core",
      name: "Core App Files",
      icon: "⚙️",
      files: [
        { name: "App.tsx", path: "src/App.tsx", category: "core" },
        { name: "main.tsx", path: "src/main.tsx", category: "core" },
        { name: "index.css", path: "src/index.css", category: "core" },
        { name: "tailwind.config.ts", path: "tailwind.config.ts", category: "core" },
        { name: "vite.config.ts", path: "vite.config.ts", category: "core" },
      ]
    },
  ];

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleFile = (filePath: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(filePath)) {
      newSelected.delete(filePath);
    } else {
      newSelected.add(filePath);
    }
    setSelectedFiles(newSelected);
  };

  const selectAllInCategory = (category: CodeCategory) => {
    const newSelected = new Set(selectedFiles);
    category.files.forEach(file => newSelected.add(file.path));
    setSelectedFiles(newSelected);
  };

  const deselectAllInCategory = (category: CodeCategory) => {
    const newSelected = new Set(selectedFiles);
    category.files.forEach(file => newSelected.delete(file.path));
    setSelectedFiles(newSelected);
  };

  const selectAll = () => {
    const allPaths = codeStructure.flatMap(cat => cat.files.map(f => f.path));
    setSelectedFiles(new Set(allPaths));
  };

  const deselectAll = () => {
    setSelectedFiles(new Set());
  };

  const downloadSelected = () => {
    if (selectedFiles.size === 0) {
      toast.error("No files selected");
      return;
    }

    const selectedFilesList = Array.from(selectedFiles);
    const exportData = {
      appName: "FELICIA.TLC - Places by TLC",
      exportDate: new Date().toISOString(),
      selectedFiles: selectedFilesList,
      fileCount: selectedFiles.size,
      categories: codeStructure
        .filter(cat => cat.files.some(f => selectedFiles.has(f.path)))
        .map(cat => cat.name),
      instructions: `
# FELICIA.TLC Code Export

## Exported Files (${selectedFiles.size} files)

${selectedFilesList.map(path => `- ${path}`).join('\n')}

## How to Use This Export

1. Each file path listed above corresponds to a specific part of the application
2. Use these paths to locate the exact files in your project structure
3. You can use this list to regenerate or modify specific features
4. Share this list with AI assistants to help them understand your codebase structure

## Feature Categories Included

${codeStructure
  .filter(cat => cat.files.some(f => selectedFiles.has(f.path)))
  .map(cat => `### ${cat.icon} ${cat.name}\n${cat.files
    .filter(f => selectedFiles.has(f.path))
    .map(f => `- ${f.name} (\`${f.path}\`)`)
    .join('\n')
  }`).join('\n\n')}

## AI Prompt Template

You can use this template when asking AI to help with your codebase:

\`\`\`
I need help with my FELICIA.TLC application. Here are the relevant files:

${selectedFilesList.map(path => `- ${path}`).join('\n')}

[Your specific question or request here]
\`\`\`

---
Generated: ${new Date().toLocaleString()}
`,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2) + '\n\n' + exportData.instructions], { 
      type: 'text/markdown' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `felicia-tlc-code-export-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`Exported ${selectedFiles.size} file references`);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
              <FileCode className="w-6 h-6" />
              Code Export System
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select files to export as organized AI prompt reference
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={deselectAll}>
              Clear All
            </Button>
            <Button 
              onClick={downloadSelected}
              disabled={selectedFiles.size === 0}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export ({selectedFiles.size})
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {codeStructure.map((category) => {
              const isExpanded = expandedCategories.has(category.id);
              const selectedInCategory = category.files.filter(f => 
                selectedFiles.has(f.path)
              ).length;
              const allSelected = selectedInCategory === category.files.length;

              return (
                <Card key={category.id} className="p-4 hover:shadow-soft transition-all">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <ChevronRight 
                        className={`w-5 h-5 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                      <Folder className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <div className="font-semibold flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {category.files.length} files
                          {selectedInCategory > 0 && ` • ${selectedInCategory} selected`}
                        </div>
                      </div>
                    </button>
                    <div className="flex gap-2">
                      {!allSelected ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => selectAllInCategory(category)}
                        >
                          Select All
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deselectAllInCategory(category)}
                        >
                          Deselect All
                        </Button>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 ml-8 space-y-2">
                      {category.files.map((file) => (
                        <div
                          key={file.path}
                          className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            checked={selectedFiles.has(file.path)}
                            onCheckedChange={() => toggleFile(file.path)}
                          />
                          <FileCode className="w-4 h-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{file.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {file.path}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};
