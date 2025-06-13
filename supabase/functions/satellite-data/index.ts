
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const planetApiKey = Deno.env.get('PLANET_API_KEY');

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
    const { bbox, startDate, endDate, cloudCover = 0.1 } = await req.json();
    
    if (!bbox || !bbox.coordinates) {
      return new Response(JSON.stringify({ error: 'Bounding box coordinates are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!planetApiKey) {
      return new Response(JSON.stringify({ error: 'Planet Labs API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetching satellite data for bbox: ${JSON.stringify(bbox)}`);

    // Search for satellite images using Planet Labs API
    const searchRequest = {
      item_types: ["PSScene"],
      filter: {
        type: "AndFilter",
        config: [
          {
            type: "GeometryFilter",
            field_name: "geometry",
            config: {
              type: "Polygon",
              coordinates: bbox.coordinates
            }
          },
          {
            type: "DateRangeFilter",
            field_name: "acquired",
            config: {
              gte: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              lte: endDate || new Date().toISOString()
            }
          },
          {
            type: "RangeFilter",
            field_name: "cloud_cover",
            config: {
              gte: 0,
              lte: cloudCover
            }
          }
        ]
      }
    };

    const searchResponse = await fetch('https://api.planet.com/data/v1/quick-search', {
      method: 'POST',
      headers: {
        'Authorization': `api-key ${planetApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchRequest)
    });
    
    if (!searchResponse.ok) {
      console.error(`Planet Labs API error: ${searchResponse.status} ${searchResponse.statusText}`);
      return new Response(JSON.stringify({ 
        error: `Satellite API error: ${searchResponse.status}`,
        details: searchResponse.statusText
      }), {
        status: searchResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const searchData = await searchResponse.json();
    console.log(`Found ${searchData.features?.length || 0} satellite images`);

    // Transform Planet Labs data to our format
    const satelliteImages = searchData.features?.slice(0, 10).map((feature: any) => ({
      satellite_name: `PlanetScope-${feature.id.substring(0, 8)}`,
      image_url: `https://api.planet.com/data/v1/assets/${feature.id}`,
      thumbnail_url: feature._links?.thumbnail || null,
      scene_id: feature.id,
      acquisition_time: feature.properties.acquired,
      cloud_cover_percentage: feature.properties.cloud_cover * 100,
      resolution_meters: 3.0, // PlanetScope typical resolution
      bbox_north: feature.bbox[3],
      bbox_south: feature.bbox[1],
      bbox_east: feature.bbox[2],
      bbox_west: feature.bbox[0],
      file_size_mb: feature.properties.item_type === 'PSScene' ? 250 : 100,
      processing_level: 'L3B',
      provider: 'Planet Labs',
      metadata: {
        sun_azimuth: feature.properties.sun_azimuth,
        sun_elevation: feature.properties.sun_elevation,
        view_angle: feature.properties.view_angle,
        quality_category: feature.properties.quality_category
      }
    })) || [];

    return new Response(JSON.stringify({
      images: satelliteImages,
      total_count: searchData.features?.length || 0,
      search_parameters: {
        bbox,
        date_range: {
          start: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          end: endDate || new Date().toISOString()
        },
        max_cloud_cover: cloudCover
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in satellite-data function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
