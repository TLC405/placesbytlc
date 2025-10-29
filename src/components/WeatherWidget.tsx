import { Cloud, CloudRain, CloudSnow, Sun, Wind } from "lucide-react";
import { Card } from "./ui/card";

interface WeatherWidgetProps {
  weather: {
    temp: number;
    condition: string;
    description: string;
  } | null;
  isLoading: boolean;
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "clear":
      return <Sun className="w-8 h-8 text-yellow-500" />;
    case "rain":
    case "drizzle":
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    case "snow":
      return <CloudSnow className="w-8 h-8 text-blue-300" />;
    case "clouds":
      return <Cloud className="w-8 h-8 text-gray-400" />;
    default:
      return <Wind className="w-8 h-8 text-gray-500" />;
  }
};

const getDateSuggestion = (temp: number, condition: string) => {
  if (temp < 50) {
    return "Perfect for cozy indoor dates! ☕";
  }
  if (temp > 85) {
    return "Stay cool - indoor activities recommended! 🧊";
  }
  if (condition.toLowerCase().includes("rain")) {
    return "Rainy day = movie date! 🎬";
  }
  if (condition.toLowerCase() === "clear" && temp > 65 && temp < 80) {
    return "Beautiful weather for outdoor dates! 🌳";
  }
  return "Great day for exploring! 💕";
};

export const WeatherWidget = ({ weather, isLoading }: WeatherWidgetProps) => {
  if (isLoading) {
    return (
      <Card className="p-4 glass-card animate-pulse">
        <div className="h-20 bg-muted/20 rounded" />
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card className="p-4 glass-card border-border/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {getWeatherIcon(weather.condition)}
          <div>
            <div className="text-3xl font-bold text-foreground">{weather.temp}°F</div>
            <div className="text-sm text-muted-foreground capitalize">{weather.description}</div>
          </div>
        </div>
      </div>
      <div className="mt-3 text-sm text-rose-600 dark:text-rose-400 font-medium">
        {getDateSuggestion(weather.temp, weather.condition)}
      </div>
    </Card>
  );
};
