import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto">
        {/* Hero Section */}
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl">
              Start your date night
            </CardTitle>
            <CardDescription className="text-base">
              Find amazing spots, build your perfect date night plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/explore">
              <Button size="lg" className="w-full md:w-auto gap-2">
                <Play className="w-5 h-5" />
                Start Date Night
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
