
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
}

class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    // In a browser environment, we'll use mock data for demo purposes
    // In production, you would get the API key from your backend or use Vite env vars
    this.apiKey = import.meta.env?.VITE_OPENWEATHER_API_KEY || '';
  }

  async getCurrentWeather(lat: number, lng: number): Promise<WeatherData> {
    try {
      // If no API key is available, return realistic mock data
      if (!this.apiKey) {
        return this.generateMockWeatherData(lat, lng);
      }

      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        console.warn(`Weather API error: ${response.status}, falling back to mock data`);
        return this.generateMockWeatherData(lat, lng);
      }
      
      return await response.json();
    } catch (error) {
      console.warn('Error fetching weather data, using mock data:', error);
      return this.generateMockWeatherData(lat, lng);
    }
  }

  private generateMockWeatherData(lat: number, lng: number): WeatherData {
    // Generate realistic weather data based on location and time
    const baseTemp = this.getBaseTemperatureForLocation(lat);
    const variation = (Math.random() - 0.5) * 10; // ±5°C variation
    
    // Simulate different weather conditions
    const weatherConditions = [
      { main: 'Clear', description: 'clear sky' },
      { main: 'Clouds', description: 'few clouds' },
      { main: 'Clouds', description: 'scattered clouds' },
      { main: 'Rain', description: 'light rain' },
      { main: 'Thunderstorm', description: 'thunderstorm' }
    ];
    
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    // Generate wind speed based on weather condition
    let windSpeed = Math.random() * 10; // Base wind speed 0-10 m/s
    if (randomCondition.main === 'Thunderstorm') {
      windSpeed = 15 + Math.random() * 15; // 15-30 m/s for storms
    } else if (randomCondition.main === 'Rain') {
      windSpeed = 8 + Math.random() * 10; // 8-18 m/s for rain
    }
    
    // Generate visibility based on weather
    let visibility = 10000; // Default 10km
    if (randomCondition.main === 'Rain') {
      visibility = 1000 + Math.random() * 4000; // 1-5km in rain
    } else if (randomCondition.main === 'Thunderstorm') {
      visibility = 500 + Math.random() * 2000; // 0.5-2.5km in storms
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
      }
    };
  }

  private getBaseTemperatureForLocation(lat: number): number {
    // Simplified temperature model based on latitude
    // Equator is ~27°C, poles are ~-10°C
    const absLat = Math.abs(lat);
    if (absLat < 23.5) return 27 - (absLat * 0.2); // Tropical
    if (absLat < 45) return 20 - ((absLat - 23.5) * 0.5); // Temperate
    if (absLat < 66.5) return 10 - ((absLat - 45) * 0.7); // Cold temperate
    return -10 - ((absLat - 66.5) * 0.3); // Polar
  }
}

export const weatherService = new WeatherService();
