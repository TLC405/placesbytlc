import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, Copy, Send, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const AIPromptInterface = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [processing, setProcessing] = useState(false);

  const processPrompt = async () => {
    if (!userPrompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-prompt-processor", {
        body: {
          prompt: userPrompt,
          context: "code_update_request",
        },
      });

      if (error) throw error;

      setAiResponse(data.response);
      toast.success("✅ AI response generated!");
    } catch (error: any) {
      console.error("AI processing error:", error);
      toast.error(error.message || "Failed to process prompt");
    } finally {
      setProcessing(false);
    }
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(aiResponse);
    toast.success("Copied to clipboard!");
  };

  const downloadResponse = () => {
    const blob = new Blob([aiResponse], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-code-update-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black gradient-text">AI Prompt Reviewer</h2>
          <p className="text-sm text-muted-foreground">Review & refine code update requests</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Update Request</label>
          <Textarea
            placeholder="Describe the code changes you want to make..."
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            rows={6}
            className="resize-none font-mono text-sm"
          />
        </div>

        <Button
          onClick={processPrompt}
          disabled={processing || !userPrompt.trim()}
          className="w-full h-12 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
        >
          <Send className="w-5 h-5" />
          {processing ? "Processing..." : "Review & Generate"}
        </Button>

        {aiResponse && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">AI Refined Prompt</label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyResponse}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button size="sm" variant="outline" onClick={downloadResponse}>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                {aiResponse}
              </pre>
            </div>
            <p className="text-xs text-muted-foreground">
              Copy this refined prompt and send it to ChatGPT for implementation
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
