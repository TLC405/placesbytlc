import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Shield, Calendar, Palette, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TesterDashboard = () => {
  const [smsUsage, setSmsUsage] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadSmsUsage();
  }, []);

  const loadSmsUsage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("sms_usage")
        .select("*")
        .eq("user_id", user.id)
        .order("sent_at", { ascending: false });

      if (error) throw error;
      setSmsUsage(data || []);
    } catch (error) {
      console.error("Error loading SMS usage:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been logged out successfully.",
    });
    navigate("/");
  };

  const freeSmsUsed = smsUsage.filter(s => s.is_free_message).length;
  const hasFreeSmS = freeSmsUsed === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold">Tester Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant={hasFreeSmS ? "default" : "secondary"}>
                {hasFreeSmS ? "Free SMS Available" : "Free SMS Used"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You have {hasFreeSmS ? "1 free SMS message" : "used your free SMS"}. 
              Testers get 1 complimentary SMS on signup.
            </p>
          </CardContent>
        </Card>

        {/* Available Features */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Available Features</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button
              className="w-full justify-start h-auto py-4"
              variant="outline"
              onClick={() => navigate("/teefeeme")}
            >
              <Palette className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Cartoon Generator</div>
                <div className="text-xs text-muted-foreground">
                  Transform photos into cartoons
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* SMS Usage History */}
        {smsUsage.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>SMS Usage History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {smsUsage.map((sms) => (
                  <div
                    key={sms.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{sms.message_type}</p>
                      <p className="text-xs text-muted-foreground">
                        To: {sms.phone_number}
                      </p>
                    </div>
                    <div className="text-right">
                      {sms.is_free_message && (
                        <Badge variant="secondary" className="mb-1">
                          Free
                        </Badge>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(sms.sent_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TesterDashboard;
