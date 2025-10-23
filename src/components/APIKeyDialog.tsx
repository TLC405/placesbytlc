import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, Key } from "lucide-react";

interface APIKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (key: string, remember: boolean) => void;
  currentKey?: string;
}

export const APIKeyDialog = ({ open, onOpenChange, onSave, currentKey }: APIKeyDialogProps) => {
  const [key, setKey] = useState(currentKey || "");
  const [remember, setRemember] = useState(true);

  const handleSave = () => {
    if (!key.trim()) return;
    onSave(key.trim(), remember);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-xl">Google Maps API Key</DialogTitle>
          </div>
          <DialogDescription>
            Enter your Google Maps API key to search for date night locations. Your key is stored
            securely on your device.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              placeholder="AIza..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked as boolean)}
            />
            <label
              htmlFor="remember"
              className="text-sm text-muted-foreground cursor-pointer select-none"
            >
              Remember in this browser
            </label>
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <div className="text-sm space-y-2">
              <p className="font-medium">Need an API key?</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Visit Google Cloud Console</li>
                <li>Create a project and enable Places API</li>
                <li>Create credentials (API key)</li>
                <li>Copy and paste it here</li>
              </ol>
              <a
                href="https://developers.google.com/maps/documentation/javascript/get-api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm mt-2"
              >
                Get API Key Guide
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!key.trim()}>
            Save Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
