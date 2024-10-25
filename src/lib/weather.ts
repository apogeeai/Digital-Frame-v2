import { formatDate } from './utils';

const WEATHER_API_KEY = '8acaa5a6f6c7e550dfba748aab75c288';
const ZIP_CODE = '01906';
const COUNTRY_CODE = 'US';

export interface WeatherData {
  current: {
    temp: number;
    weather: {
      main: string;
      icon: string;
    }[];
    humidity: number;
    wind_speed: number;
  };
  daily: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: Array<{
      main: string;
      icon: string;
    }>;
  }>;
}

export async function getWeatherData(): Promise<WeatherData | null> {
  try {
    // First, get coordinates from zip code
    const geoUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${ZIP_CODE},${COUNTRY_CODE}&appid=${WEATHER_API_KEY}`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoResponse.ok) {
      console.error('Geocoding error:', geoData.message);
      return null;
    }

    if (!geoData.lat || !geoData.lon) {
      console.error('Invalid geocoding response:', geoData);
      return null;
    }

    // Get current weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${geoData.lat}&lon=${geoData.lon}&units=imperial&appid=${WEATHER_API_KEY}`;
    const currentResponse = await fetch(currentWeatherUrl);
    const currentData = await currentResponse.json();

    if (!currentResponse.ok) {
      console.error('Current weather API error:', currentData.message);
      return null;
    }

    // Get 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${geoData.lat}&lon=${geoData.lon}&units=imperial&appid=${WEATHER_API_KEY}`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    if (!forecastResponse.ok) {
      console.error('Forecast API error:', forecastData.message);
      return null;
    }

    // Process and combine the data
    const processedData: WeatherData = {
      current: {
        temp: currentData.main.temp,
        weather: currentData.weather,
        humidity: currentData.main.humidity,
        wind_speed: currentData.wind.speed
      },
      daily: forecastData.list
        .filter((item: any, index: number) => index % 8 === 0) // Get one reading per day
        .slice(0, 5) // Get 5 days
        .map((day: any) => ({
          dt: day.dt,
          temp: {
            min: day.main.temp_min,
            max: day.main.temp_max
          },
          weather: day.weather
        }))
    };

    return processedData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}