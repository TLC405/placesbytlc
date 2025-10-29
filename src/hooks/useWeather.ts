import { useState, useEffect } from "react";

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  description: string;
}

export const useWeather = (location: { lat: number; lng: number }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        // Using OpenWeatherMap free API - requires API key
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
        
        if (!API_KEY) {
          console.log("Weather API key not configured");
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${API_KEY}&units=imperial`
        );
        
        if (!response.ok) throw new Error("Weather fetch failed");
        
        const data = await response.json();
        
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main,
          icon: data.weather[0].icon,
          description: data.weather[0].description,
        });
      } catch (error) {
        console.error("Weather fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (location.lat && location.lng) {
      fetchWeather();
    }
  }, [location.lat, location.lng]);

  return { weather, isLoading };
};
