
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
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
  }

  async getCurrentWeather(lat: number, lng: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Return mock data for development
      return {
        main: { temp: 15, pressure: 1013, humidity: 70 },
        weather: [{ main: 'Clear', description: 'clear sky' }],
        wind: { speed: 5, deg: 180 },
        visibility: 10000,
        clouds: { all: 20 }
      };
    }
  }
}

export const weatherService = new WeatherService();
