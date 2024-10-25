import { useEffect, useState } from 'react';
import { Cloud, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeatherData, type WeatherData, getWeatherIconUrl } from '@/lib/weather';

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);
        const data = await getWeatherData();
        
        if (!mounted) return;
        
        if (!data) {
          setError('Unable to load weather data');
          return;
        }
        
        setWeather(data);
      } catch (err) {
        if (!mounted) return;
        setError('Failed to load weather data');
        console.error('Weather widget error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchWeather();

    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-white mx-auto" />
        <p className="text-sm text-white/70 mt-2">Loading weather data...</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="py-6 text-center">
        <Cloud className="mx-auto h-6 w-6 mb-2 text-white" />
        <p className="text-sm text-white">{error || 'Unable to load weather'}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-xs text-white/70 hover:text-white mt-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h3 className="text-lg font-medium mb-4">Weather for Saugus, MA</h3>
      
      {/* Current Weather */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <img 
            src={getWeatherIconUrl(weather.current.weather[0].icon)}
            alt={weather.current.weather[0].main}
            className="h-16 w-16 brightness-0 invert" // Makes the icon pure white
          />
        </div>
        <div className="text-3xl font-bold text-white">
          {Math.round(weather.current.temp)}°F
        </div>
        <div className="text-white">
          {weather.current.weather[0].main}
        </div>
        <div className="text-sm text-white/70 mt-1">
          Humidity: {weather.current.humidity}% | 
          Wind: {Math.round(weather.current.wind_speed)} mph
        </div>
      </div>

      {/* Weekly Forecast */}
      <div className="grid grid-cols-4 gap-2">
        {weather.daily.slice(1, 5).map((day) => (
          <div key={day.dt} className="text-center">
            <div className="text-sm text-white mb-1">
              {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <img 
              src={getWeatherIconUrl(day.weather[0].icon)}
              alt={day.weather[0].main}
              className="h-8 w-8 mx-auto brightness-0 invert" // Makes the icon pure white
            />
            <div className="text-sm mt-1">
              <span className="text-white">{Math.round(day.temp.max)}°</span>
              <span className="text-white/70 ml-1">{Math.round(day.temp.min)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}