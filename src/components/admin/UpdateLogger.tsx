import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Save, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type UpdateType = "feature" | "security" | "bugfix" | "ui";
type UpdateStatus = "coming_up" | "in_progress" | "implemented";

export const UpdateLogger = () => {
  const [version, setVersion] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [updateType, setUpdateType] = useState<UpdateType>("feature");
  const [status, setStatus] = useState<UpdateStatus>("implemented");
  const [changes, setChanges] = useState<string[]>([""]);
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addChange = () => {
    setChanges([...changes, ""]);
  };

  const removeChange = (index: number) => {
    setChanges(changes.filter((_, i) => i !== index));
  };

  const updateChange = (index: number, value: string) => {
    const newChanges = [...changes];
    newChanges[index] = value;
    setChanges(newChanges);
  };

  const handleSubmit = async () => {
    if (!version || !title || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("app_updates")
        .insert({
          title,
          version,
          description,
          update_type: updateType,
          status,
          changes: changes.filter(c => c.trim() !== ""),
          release_date: releaseDate,
        });

      if (error) throw error;

      toast.success("✅ UPDATE LOGGED TO CHANGELOG", {
        description: `Version ${version} has been added to the changelog`,
        duration: 5000,
      });

      // Reset form
      setVersion("");
      setTitle("");
      setDescription("");
      setUpdateType("feature");
      setStatus("implemented");
      setChanges([""]);
      setReleaseDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error("Error logging update:", error);
      toast.error("Failed to log update");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Log New Update
          </CardTitle>
          <CardDescription>Add a new entry to the app changelog</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Version & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="version">Version *</Label>
              <Input
                id="version"
                placeholder="e.g., 1.7.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Update Type *</Label>
              <Select value={updateType} onValueChange={(value: UpdateType) => setUpdateType(value)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">🎉 Feature</SelectItem>
                  <SelectItem value="security">🔒 Security</SelectItem>
                  <SelectItem value="bugfix">🐛 Bug Fix</SelectItem>
                  <SelectItem value="ui">🎨 UI/UX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., COD-Inspired Login System"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Brief overview of the update..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Status & Release Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={status} onValueChange={(value: UpdateStatus) => setStatus(value)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coming_up">🔮 Coming Up</SelectItem>
                  <SelectItem value="in_progress">🚧 In Progress</SelectItem>
                  <SelectItem value="implemented">✅ Implemented</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="releaseDate">Release Date</Label>
              <Input
                id="releaseDate"
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
              />
            </div>
          </div>

          {/* Changes */}
          <div className="space-y-2">
            <Label>Changes/Features</Label>
            <div className="space-y-2">
              {changes.map((change, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Change ${index + 1}...`}
                    value={change}
                    onChange={(e) => updateChange(index, e.target.value)}
                  />
                  {changes.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeChange(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addChange}>
              <Plus className="w-4 h-4 mr-2" />
              Add Change
            </Button>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Save className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Log Update
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {(title || description) && (
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">{version || "X.X.X"}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm capitalize">{updateType}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
              </div>
              <h3 className="font-bold text-lg">{title || "Update Title"}</h3>
              <p className="text-sm text-muted-foreground">{description || "Description..."}</p>
              {changes.filter(c => c.trim() !== "").length > 0 && (
                <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                  {changes.filter(c => c.trim() !== "").map((change, idx) => (
                    <li key={idx}>{change}</li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};