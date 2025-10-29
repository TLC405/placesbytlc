import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Sparkles, Lightbulb, Rocket } from "lucide-react";
import { toast } from "sonner";

const PROMPT_IDEAS = [
  {
    id: 1,
    title: "🎨 Advanced Cartoonifier Features",
    category: "cartoonifier",
    prompt: `Add these advanced features to the Cartoonifier:
1. Batch Processing: Upload multiple photos at once, generate all cartoons in parallel
2. Style Preview: Show thumbnail previews of each style before generating
3. Auto-Style Detection: AI analyzes photo and auto-suggests best 3 styles
4. Background Removal: Option to remove/replace background before cartoonifying
5. Save Custom Presets: Let users save their favorite style mixes with names

Make the UI state-of-the-art with smooth animations and progress indicators.`,
  },
  {
    id: 2,
    title: "💑 Couples Mode Deep Integration",
    category: "couples",
    prompt: `Create a comprehensive Couples Mode with:
1. Partner Pairing: Simple code system to link two accounts
2. Shared Calendar: Visual calendar with date plans both can edit
3. Wishlist Board: Pinterest-style board for date ideas both can add to
4. Date History Timeline: Beautiful timeline of all past dates with photos
5. Couple Cartoons Gallery: All generated couple cartoons in one place
6. Shared Preferences: AI learns both partners' preferences for better suggestions

UI should feel special and romantic, not corporate.`,
  },
  {
    id: 3,
    title: "🤖 In-App AI Chat Assistant",
    category: "ai",
    prompt: `Build an AI chat assistant accessible from anywhere in the app:
1. Floating chat bubble in bottom-right corner
2. Context-aware: Knows what page user is on
3. Can help with: Finding date spots, suggesting activities, answering questions
4. Uses Lovable AI (google/gemini-2.5-flash model)
5. Conversation history saved per user
6. Quick actions: "Find me a restaurant", "Cartoonify this photo", "Plan a date"
7. Admin can see chat logs and most asked questions

Make it feel like a helpful friend, not a robot.`,
  },
  {
    id: 4,
    title: "📊 Admin Analytics Dashboard",
    category: "admin",
    prompt: `Create a comprehensive analytics dashboard in admin panel:
1. User Activity: Daily/weekly/monthly active users with charts
2. Feature Usage: Which features are most popular? (Cartoonifier, Search, etc.)
3. Geographic Heat Map: Where are users searching for dates?
4. Cartoon Stats: Most popular styles, generation times, success rates
5. User Journey Flow: Visualize how users navigate through the app
6. Retention Metrics: How many users come back? When do they churn?
7. Real-time Feed: Live stream of user actions

Make it look like a mission control dashboard with dark theme.`,
  },
  {
    id: 5,
    title: "🎮 Relationship Gamification System",
    category: "gamification",
    prompt: `Create a fun gamification system for couples:
1. Date Challenges: Weekly challenges like "Try a new cuisine" with point rewards
2. Streak Tracking: Track consecutive weeks with dates, show flame icon
3. Achievements: Unlock badges for milestones (10 dates, 50 cartoons, etc.)
4. Couple Level: XP system that levels up your relationship
5. Leaderboard: Anonymous rankings (optional opt-in)
6. Rewards: Unlock new cartoon styles, features as you level up
7. Date Ideas Unlock: Higher levels unlock premium date suggestions

Make it playful but not childish. Celebrate relationship milestones.`,
  },
];

const WORKFLOW_TIPS = [
  {
    title: "🔄 Quick Iteration Tips",
    items: [
      "Ask for ONE feature at a time for faster results",
      "Use Visual Edits for quick color/text changes (saves credits)",
      "Save working versions before big changes",
      "Test features immediately after building",
      "Break large requests into smaller steps"
    ]
  },
  {
    title: "💡 Better Prompting",
    items: [
      "Be specific: 'Add a dark mode toggle' vs 'Make it look better'",
      "Reference existing files: 'Update the Header.tsx component'",
      "Show examples: 'Like this: [description or link]'",
      "Mention constraints: 'Keep mobile responsive'",
      "State priorities: 'Focus on UX over animations'"
    ]
  },
  {
    title: "🐛 Debugging Faster",
    items: [
      "Check browser console for errors (F12)",
      "Use 'Check logs' button to see backend errors",
      "Describe the exact steps to reproduce bugs",
      "Screenshot unexpected behavior",
      "Mention what you expected vs what happened"
    ]
  },
  {
    title: "🚀 Development Flow",
    items: [
      "Plan features in this Prompt Library first",
      "Build backend (database/functions) before UI",
      "Test with real data, not dummy data",
      "Polish UI after functionality works",
      "Deploy often to catch issues early"
    ]
  }
];

export const PromptLibrary = () => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Prompt Library & Workflow Helper</h2>
          <p className="text-muted-foreground">Copy prompts to quickly build features</p>
        </div>
      </div>

      <Tabs defaultValue="prompts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prompts">
            <Lightbulb className="w-4 h-4 mr-2" />
            Prompt Ideas
          </TabsTrigger>
          <TabsTrigger value="tips">
            <Rocket className="w-4 h-4 mr-2" />
            Workflow Tips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prompts" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {PROMPT_IDEAS.map((idea) => (
              <Card key={idea.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold">{idea.title}</h3>
                    <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
                      {idea.prompt}
                    </pre>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(idea.prompt, idea.id)}
                    className="shrink-0"
                  >
                    {copiedId === idea.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tips" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {WORKFLOW_TIPS.map((tip, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-bold mb-4">{tip.title}</h3>
                <ul className="space-y-2">
                  {tip.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Pro Tip: Message Polishing
            </h3>
            <p className="text-sm mb-2">
              If your message is messy or unclear, just add to the end:
            </p>
            <pre className="text-sm bg-background p-3 rounded border">
              "Polish this prompt and make it clearer"
            </pre>
            <p className="text-sm text-muted-foreground mt-2">
              The AI will rewrite your request in a clearer way before executing it.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
