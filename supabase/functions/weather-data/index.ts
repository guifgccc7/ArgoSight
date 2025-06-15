
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openWeatherApiKey = Deno.env.get('OPENWEATHER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lng } = await req.json();
    
    if (!lat || !lng) {
      console.error('Missing required parameters: lat, lng');
      return new Response(JSON.stringify({ 
        error: 'Latitude and longitude are required',
        received: { lat, lng }
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openWeatherApiKey) {
      console.error('OpenWeather API key not configured');
      return new Response(JSON.stringify({ 
        error: 'OpenWeather API key not configured. Please add OPENWEATHER_API_KEY to your Supabase secrets.',
        configuration_required: true
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetching weather data for coordinates: ${lat}, ${lng}`);

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${openWeatherApiKey}&units=metric`;
    
    const response = await fetch(weatherUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenWeather API error: ${response.status} ${response.statusText} - ${errorText}`);
      return new Response(JSON.stringify({ 
        error: `Weather API error: ${response.status}`,
        details: response.statusText,
        api_response: errorText
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const weatherData = await response.json();
    console.log(`Weather data fetched successfully: ${weatherData.name || 'Unknown location'}`);

    // Enhanced response with additional metadata
    const enhancedResponse = {
      ...weatherData,
      api_metadata: {
        fetched_at: new Date().toISOString(),
        coordinates: { lat, lng },
        api_provider: 'OpenWeatherMap',
        status: 'success'
      }
    };

    return new Response(JSON.stringify(enhancedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in weather-data function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
