
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AISMessage {
  MessageType: string
  MetaData: {
    MMSI: number
    ShipName: string
    latitude: number
    longitude: number
    time_utc: string
  }
  Message: {
    PositionReport?: {
      Cog: number
      NavigationStatus: number
      Latitude: number
      Longitude: number
      RateOfTurn: number
      Sog: number
      TrueHeading: number
      Timestamp: number
      Valid: boolean
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const aisStreamApiKey = Deno.env.get('AISSTREAM_API_KEY')
    if (!aisStreamApiKey) {
      throw new Error('AISSTREAM_API_KEY not configured')
    }

    // Connect to AISStream WebSocket
    const ws = new WebSocket("wss://stream.aisstream.io/v0/stream")
    
    ws.onopen = () => {
      console.log('Connected to AISStream')
      
      // Subscribe to specific areas or all messages
      const subscriptionMessage = {
        APIKey: aisStreamApiKey,
        BoundingBoxes: [
          // North Atlantic
          [[40, -80], [70, -10]],
          // Mediterranean 
          [[30, -10], [45, 40]],
          // Arctic routes
          [[60, -180], [85, 180]]
        ],
        FilterMessageTypes: ["PositionReport"]
      }
      
      ws.send(JSON.stringify(subscriptionMessage))
    }

    ws.onmessage = async (event) => {
      try {
        const aisData: AISMessage = JSON.parse(event.data)
        
        if (aisData.MessageType === "PositionReport" && aisData.MetaData) {
          await processVesselPosition(supabaseClient, aisData)
        }
      } catch (error) {
        console.error('Error processing AIS message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('AISStream WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('AISStream connection closed')
    }

    return new Response(JSON.stringify({ status: 'AISStream integration started' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in AISStream integration:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function processVesselPosition(supabase: any, aisData: AISMessage) {
  const { MetaData, Message } = aisData
  
  if (!Message.PositionReport || !MetaData) return

  try {
    // Store or update vessel information
    const { data: vessel, error: vesselError } = await supabase
      .from('vessels')
      .upsert({
        mmsi: MetaData.MMSI.toString(),
        vessel_name: MetaData.ShipName || `Vessel-${MetaData.MMSI}`,
        vessel_type: 'unknown', // AISStream doesn't always provide type in position reports
        status: 'active'
      }, { onConflict: 'mmsi' })
      .select()
      .single()

    if (vesselError) {
      console.error('Error storing vessel:', vesselError)
      return
    }

    // Store position data
    const { error: positionError } = await supabase
      .from('vessel_positions')
      .insert({
        vessel_id: vessel.id,
        mmsi: MetaData.MMSI.toString(),
        latitude: Message.PositionReport.Latitude,
        longitude: Message.PositionReport.Longitude,
        speed_knots: Message.PositionReport.Sog,
        course_degrees: Message.PositionReport.Cog,
        heading_degrees: Message.PositionReport.TrueHeading,
        navigation_status: getNavigationStatusText(Message.PositionReport.NavigationStatus),
        timestamp_utc: new Date(Message.PositionReport.Timestamp * 1000).toISOString(),
        source_feed: 'aisstream',
        data_quality_score: Message.PositionReport.Valid ? 1.0 : 0.5
      })

    if (positionError) {
      console.error('Error storing position:', positionError)
    } else {
      console.log(`Stored position for vessel ${MetaData.MMSI}`)
    }

  } catch (error) {
    console.error('Error processing vessel position:', error)
  }
}

function getNavigationStatusText(status: number): string {
  const statusMap: { [key: number]: string } = {
    0: 'Under way using engine',
    1: 'At anchor',
    2: 'Not under command',
    3: 'Restricted manoeuvrability',
    4: 'Constrained by her draught',
    5: 'Moored',
    6: 'Aground',
    7: 'Engaged in fishing',
    8: 'Under way sailing',
    15: 'Undefined'
  }
  return statusMap[status] || 'Unknown'
}
