import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Flame, Crown, Award } from "lucide-react";

export default function Gamification() {
  const achievements = [
    { id: 1, name: "First Date", description: "Visit your first place", icon: Heart, earned: true, points: 10 },
    { id: 2, name: "Foodie Explorer", description: "Try 5 different restaurants", icon: Star, earned: true, points: 25 },
    { id: 3, name: "Activity Adventurer", description: "Visit 3 activity spots", icon: Target, earned: false, points: 25 },
    { id: 4, name: "Weekly Warrior", description: "Go on dates 3 weeks in a row", icon: Flame, earned: false, points: 50 },
    { id: 5, name: "Date Master", description: "Complete 20 dates", icon: Crown, earned: false, points: 100 },
  ];

  const totalPoints = 35;
  const nextLevel = 100;
  const currentLevel = 1;

  return (
    <div className="min-h-screen space-y-8 pb-12">
      {/* Hero */}
      <Card className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white border-0">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Trophy className="w-10 h-10" />
            </div>
          </div>
          <CardTitle className="text-4xl font-black">Achievements & Rewards</CardTitle>
          <CardDescription className="text-white/90 text-lg">
            Level up your dating game and earn exclusive badges
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Level Progress */}
      <Card className="border-2 border-primary/30 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500" />
              Level {currentLevel}
            </CardTitle>
            <Badge className="px-4 py-2 text-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              {totalPoints} / {nextLevel} XP
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={(totalPoints / nextLevel) * 100} className="h-4" />
          <p className="text-sm text-muted-foreground text-center">
            {nextLevel - totalPoints} XP until Level {currentLevel + 1}
          </p>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="space-y-6">
        <h2 className="text-3xl font-black gradient-text">Your Achievements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <Card
                key={achievement.id}
                className={`border-2 transition-all hover:shadow-xl ${
                  achievement.earned
                    ? "border-amber-500/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30"
                    : "border-border/30 opacity-60"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        achievement.earned
                          ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{achievement.name}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {achievement.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={achievement.earned ? "default" : "secondary"}>
                      {achievement.points} XP
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Coming Soon */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-400/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-600" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-white/50 dark:bg-black/20">
            <h3 className="font-bold mb-2">🏆 Leaderboards</h3>
            <p className="text-sm text-muted-foreground">
              Compete with other couples and see who's exploring the most
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-white/50 dark:bg-black/20">
            <h3 className="font-bold mb-2">🎯 Weekly Challenges</h3>
            <p className="text-sm text-muted-foreground">
              New challenges every week with bonus rewards
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-white/50 dark:bg-black/20">
            <h3 className="font-bold mb-2">💎 Premium Rewards</h3>
            <p className="text-sm text-muted-foreground">
              Unlock exclusive perks and discounts at partner locations
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Missing Heart import
import { Heart } from "lucide-react";
