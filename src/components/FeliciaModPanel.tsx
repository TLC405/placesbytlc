import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Crown, Plus, Trash2, Sparkles, Palette, List } from "lucide-react";

export default function FeliciaModPanel() {
  const [user, setUser] = useState<any>(null);
  const [isModeratorOrAdmin, setIsModeratorOrAdmin] = useState(false);
  const [updates, setUpdates] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // New update form state
  const [newUpdate, setNewUpdate] = useState({
    version: "",
    title: "",
    description: "",
    update_type: "feature" as "feature" | "bugfix" | "security" | "launch",
    status: "coming_up" as "implemented" | "coming_up" | "archived",
    changes: [""]
  });

  useEffect(() => {
    checkAuth();
    loadUpdates();
    loadThemes();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/");
      return;
    }

    setUser(user);

    // Check if user has moderator or admin role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const isMod = roles?.some(r => r.role === "moderator" || r.role === "admin");
    setIsModeratorOrAdmin(!!isMod);

    if (!isMod) {
      toast({
        title: "Access Denied",
        description: "You need moderator or admin privileges to access this page.",
        variant: "destructive"
      });
      navigate("/");
    }
  };

  const loadUpdates = async () => {
    const { data } = await supabase
      .from("app_updates")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setUpdates(data);
  };

  const loadThemes = async () => {
    const { data } = await supabase
      .from("custom_themes")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setThemes(data);
  };

  const addChangeItem = () => {
    setNewUpdate(prev => ({
      ...prev,
      changes: [...prev.changes, ""]
    }));
  };

  const updateChangeItem = (index: number, value: string) => {
    setNewUpdate(prev => ({
      ...prev,
      changes: prev.changes.map((item, i) => i === index ? value : item)
    }));
  };

  const removeChangeItem = (index: number) => {
    setNewUpdate(prev => ({
      ...prev,
      changes: prev.changes.filter((_, i) => i !== index)
    }));
  };

  const handleCreateUpdate = async () => {
    if (!newUpdate.version || !newUpdate.title || newUpdate.changes.some(c => !c)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from("app_updates")
      .insert({
        version: newUpdate.version,
        title: newUpdate.title,
        description: newUpdate.description,
        update_type: newUpdate.update_type,
        status: newUpdate.status,
        changes: newUpdate.changes.filter(c => c.trim()),
        release_date: newUpdate.status === "implemented" ? new Date().toISOString().split('T')[0] : null,
        created_by: user?.id
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success! ✨",
      description: "Update added successfully!"
    });

    // Reset form
    setNewUpdate({
      version: "",
      title: "",
      description: "",
      update_type: "feature",
      status: "coming_up",
      changes: [""]
    });

    loadUpdates();
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "implemented" ? "coming_up" : "implemented";
    
    const { error } = await supabase
      .from("app_updates")
      .update({ 
        status: newStatus,
        release_date: newStatus === "implemented" ? new Date().toISOString().split('T')[0] : null
      })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Status Updated! 🎉",
      description: `Update moved to ${newStatus === "implemented" ? "Implemented" : "Coming Up"}`
    });

    loadUpdates();
  };

  const handleDeleteUpdate = async (id: string) => {
    const { error } = await supabase
      .from("app_updates")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Deleted",
      description: "Update removed successfully"
    });

    loadUpdates();
  };

  if (!isModeratorOrAdmin) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <Card className="gradient-primary text-white border-0">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Crown className="w-10 h-10" />
            <div>
              <CardTitle className="text-3xl">Felicia's Mod Panel</CardTitle>
              <CardDescription className="text-white/80">
                Control updates, themes, and app features ✨
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="updates" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="updates">
            <List className="w-4 h-4 mr-2" />
            Updates
          </TabsTrigger>
          <TabsTrigger value="new-update">
            <Plus className="w-4 h-4 mr-2" />
            New Update
          </TabsTrigger>
          <TabsTrigger value="themes">
            <Palette className="w-4 h-4 mr-2" />
            Themes
          </TabsTrigger>
        </TabsList>

        {/* Manage Updates */}
        <TabsContent value="updates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Updates</CardTitle>
              <CardDescription>View and manage all app updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {updates.map((update) => (
                <Card key={update.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">v{update.version}</CardTitle>
                          <Badge variant={update.status === "implemented" ? "default" : "secondary"}>
                            {update.status}
                          </Badge>
                          <Badge variant="outline">{update.update_type}</Badge>
                        </div>
                        <CardDescription>{update.title}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(update.id, update.status)}
                        >
                          {update.status === "implemented" ? "→ Coming Up" : "→ Implemented"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUpdate(update.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {(update.changes as string[]).map((change, idx) => (
                        <li key={idx} className="text-sm flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* New Update Form */}
        <TabsContent value="new-update" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Update</CardTitle>
              <CardDescription>Add new features to the app changelog</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Version *</Label>
                  <Input
                    id="version"
                    placeholder="1.7.0"
                    value={newUpdate.version}
                    onChange={(e) => setNewUpdate({ ...newUpdate, version: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-type">Type *</Label>
                  <Select
                    value={newUpdate.update_type}
                    onValueChange={(value: any) => setNewUpdate({ ...newUpdate, update_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">Feature</SelectItem>
                      <SelectItem value="bugfix">Bug Fix</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="launch">Launch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Couples Mode Launch"
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Optional detailed description..."
                  value={newUpdate.description}
                  onChange={(e) => setNewUpdate({ ...newUpdate, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={newUpdate.status}
                  onValueChange={(value: any) => setNewUpdate({ ...newUpdate, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="implemented">Implemented</SelectItem>
                    <SelectItem value="coming_up">Coming Up</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Changes *</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addChangeItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Change
                  </Button>
                </div>
                <div className="space-y-2">
                  {newUpdate.changes.map((change, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="✨ New awesome feature..."
                        value={change}
                        onChange={(e) => updateChangeItem(index, e.target.value)}
                      />
                      {newUpdate.changes.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={() => removeChangeItem(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleCreateUpdate} className="w-full" size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Update
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Themes Tab */}
        <TabsContent value="themes">
          <Card>
            <CardHeader>
              <CardTitle>Custom Themes</CardTitle>
              <CardDescription>Coming soon - Create and manage custom themes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Theme management will be available in the next update! 🎨
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
