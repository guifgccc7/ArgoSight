
import { supabase } from '@/integrations/supabase/client';

export interface WeatherData {
  main: {
    temp: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  clouds: {
    all: number;
  };
  name?: string;
  sys?: {
    country: string;
  };
}

class WeatherService {
  async getCurrentWeather(lat: number, lng: number): Promise<WeatherData> {
    try {
      console.log(`Fetching real weather data for coordinates: ${lat}, ${lng}`);
      
      const { data, error } = await supabase.functions.invoke('weather-data', {
        body: { lat, lng }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Weather API error: ${error.message}`);
      }

      if (data.error) {
        console.error('Weather API error:', data.error);
        throw new Error(data.error);
      }

      console.log('Real weather data received:', data.name || 'Unknown location');
      return data;
      
    } catch (error) {
      console.error('Error fetching real weather data:', error);
      
      // Only fall back to mock data if there's a network/API issue
      console.warn('Falling back to mock weather data');
      return this.generateMockWeatherData(lat, lng);
    }
  }

  private generateMockWeatherData(lat: number, lng: number): WeatherData {
    const baseTemp = this.getBaseTemperatureForLocation(lat);
    const variation = (Math.random() - 0.5) * 10;
    
    const weatherConditions = [
      { main: 'Clear', description: 'clear sky' },
      { main: 'Clouds', description: 'few clouds' },
      { main: 'Clouds', description: 'scattered clouds' },
      { main: 'Rain', description: 'light rain' },
      { main: 'Thunderstorm', description: 'thunderstorm' }
    ];
    
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    let windSpeed = Math.random() * 10;
    if (randomCondition.main === 'Thunderstorm') {
      windSpeed = 15 + Math.random() * 15;
    } else if (randomCondition.main === 'Rain') {
      windSpeed = 8 + Math.random() * 10;
    }
    
    let visibility = 10000;
    if (randomCondition.main === 'Rain') {
      visibility = 1000 + Math.random() * 4000;
    } else if (randomCondition.main === 'Thunderstorm') {
      visibility = 500 + Math.random() * 2000;
    }

    return {
      main: { 
        temp: baseTemp + variation, 
        pressure: 1013 + (Math.random() - 0.5) * 40, 
        humidity: 60 + Math.random() * 30 
      },
      weather: [randomCondition],
      wind: { 
        speed: windSpeed, 
        deg: Math.random() * 360 
      },
      visibility: Math.round(visibility),
      clouds: { 
        all: randomCondition.main === 'Clear' ? Math.random() * 20 : 50 + Math.random() * 50 
      },
      name: 'Mock Location',
      sys: { country: 'XX' }
    };
  }

  private getBaseTemperatureForLocation(lat: number): number {
    const absLat = Math.abs(lat);
    if (absLat < 23.5) return 27 - (absLat * 0.2);
    if (absLat < 45) return 20 - ((absLat - 23.5) * 0.5);
    if (absLat < 66.5) return 10 - ((absLat - 45) * 0.7);
    return -10 - ((absLat - 66.5) * 0.3);
  }
}

export const weatherService = new WeatherService();
