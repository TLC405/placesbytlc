import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, Link as LinkIcon, Calendar, Star } from "lucide-react";
import { toast } from "sonner";

export default function CoupleMode() {
  const [pairingCode, setPairingCode] = useState("");
  const [isPaired, setIsPaired] = useState(false);

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setPairingCode(code);
    toast.success("Share this code with your partner!");
  };

  const handlePair = () => {
    if (!pairingCode.trim()) {
      toast.error("Please enter a pairing code!");
      return;
    }
    setIsPaired(true);
    toast.success("Successfully paired! 💑");
  };

  return (
    <div className="min-h-screen space-y-8 pb-12">
      {/* Hero */}
      <Card className="bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 text-white border-0">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Users className="w-10 h-10" />
            </div>
          </div>
          <CardTitle className="text-4xl font-black">Couple Mode</CardTitle>
          <CardDescription className="text-white/90 text-lg">
            Plan dates together with shared calendar and wishlist
          </CardDescription>
        </CardHeader>
      </Card>

      {!isPaired ? (
        <>
          {/* Pairing Section */}
          <Card className="border-2 border-primary/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-6 h-6 text-primary" />
                Connect with Your Partner
              </CardTitle>
              <CardDescription>
                Generate a code or enter your partner's code to link accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Generate Code</h3>
                  <Button
                    onClick={generateCode}
                    size="lg"
                    className="w-full gradient-primary h-14"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Generate Pairing Code
                  </Button>
                  {pairingCode && (
                    <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border-2 border-primary/30 text-center">
                      <p className="text-sm text-muted-foreground mb-2">Your Code:</p>
                      <p className="text-4xl font-black gradient-text">{pairingCode}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Enter Partner's Code</h3>
                  <Input
                    placeholder="Enter 6-digit code"
                    value={pairingCode}
                    onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
                    className="h-14 text-center text-2xl font-bold"
                    maxLength={6}
                  />
                  <Button
                    onClick={handlePair}
                    size="lg"
                    variant="outline"
                    className="w-full h-14"
                  >
                    <LinkIcon className="w-5 h-5 mr-2" />
                    Pair Accounts
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <Card className="border-2 border-primary/30">
            <CardHeader>
              <CardTitle>What You'll Get</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Shared Calendar
                </h3>
                <p className="text-sm text-muted-foreground">
                  Plan dates together and see each other's availability
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-r from-accent/10 to-primary/10 border-2 border-accent/20">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-accent" />
                  Shared Wishlist
                </h3>
                <p className="text-sm text-muted-foreground">
                  Save places you both want to try and mark them as visited
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple/10 to-pink/10 border-2 border-purple/20">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  Shared Notes
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add memories and notes to each place you visit together
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              You're Connected! 💑
            </CardTitle>
            <CardDescription>
              Start planning your next date adventure together
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6 py-8">
              <Badge className="px-6 py-3 text-lg bg-gradient-to-r from-primary to-accent text-white">
                Couple Mode Active
              </Badge>
              <p className="text-muted-foreground">
                Full couple features coming soon! For now, explore places together and share your favorites.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
