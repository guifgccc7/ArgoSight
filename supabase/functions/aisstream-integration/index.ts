import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const aisStreamApiKey = Deno.env.get('AISSTREAM_API_KEY')!

    if (!aisStreamApiKey) {
      console.error('AISSTREAM_API_KEY not configured')
      return new Response(
        JSON.stringify({ 
          error: 'AISSTREAM_API_KEY not configured',
          status: 'error'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Starting AISStream WebSocket connection...')

    // Create WebSocket connection to AISStream
    const ws = new WebSocket('wss://stream.aisstream.io/v0/stream')

    // Authentication message for AISStream
    const authMessage = {
      APIKey: aisStreamApiKey,
      BoundingBoxes: [
        [[-90, -180], [90, 180]] // Global coverage
      ],
      FiltersShipAndCargo: false,
      FilterMessageTypes: ["PositionReport"]
    }

    let processedCount = 0
    let errorCount = 0

    ws.onopen = () => {
      console.log('WebSocket connection opened successfully')
      ws.send(JSON.stringify(authMessage))
    }

    ws.onmessage = async (event) => {
      try {
        // Handle both string and blob data
        let messageData: string
        if (event.data instanceof Blob) {
          messageData = await event.data.text()
        } else {
          messageData = event.data
        }

        const aisMessage = JSON.parse(messageData)
        
        if (aisMessage.MessageType === "PositionReport") {
          const vessel = aisMessage.Message.PositionReport
          
          // Insert or update vessel
          const { data: vesselData, error: vesselError } = await supabase
            .from('vessels')
            .upsert({
              mmsi: vessel.UserID.toString(),
              vessel_name: vessel.ShipName || `Vessel-${vessel.UserID}`,
              vessel_type: vessel.ShipAndCargoType || 'Unknown',
              status: 'active'
            }, { onConflict: 'mmsi' })
            .select()
            .single()

          if (vesselError) {
            console.error('Error upserting vessel:', vesselError)
            errorCount++
            return
          }

          // Insert position
          const { error: positionError } = await supabase
            .from('vessel_positions')
            .insert({
              vessel_id: vesselData.id,
              mmsi: vessel.UserID.toString(),
              latitude: vessel.Latitude,
              longitude: vessel.Longitude,
              speed_knots: vessel.Sog,
              course_degrees: vessel.Cog,
              heading_degrees: vessel.TrueHeading,
              navigation_status: vessel.NavigationalStatus,
              timestamp_utc: new Date().toISOString(),
              source_feed: 'aisstream',
              data_quality_score: 1.0
            })

          if (positionError) {
            console.error('Error inserting position:', positionError)
            errorCount++
          } else {
            processedCount++
            console.log(`Processed vessel ${vessel.UserID} at ${vessel.Latitude}, ${vessel.Longitude} (Total: ${processedCount})`)
          }
        }
      } catch (error) {
        console.error('Error processing AIS message:', error)
        errorCount++
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = (event) => {
      console.log(`WebSocket connection closed: ${event.code} ${event.reason}`)
      console.log(`Session summary - Processed: ${processedCount}, Errors: ${errorCount}`)
    }

    // Keep the function running for 5 minutes to collect data
    setTimeout(() => {
      console.log(`Closing WebSocket after 5 minutes. Final stats - Processed: ${processedCount}, Errors: ${errorCount}`)
      ws.close()
    }, 5 * 60 * 1000)

    return new Response(
      JSON.stringify({ 
        message: 'AISStream integration started successfully',
        status: 'success',
        session_info: {
          duration_minutes: 5,
          api_key_configured: !!aisStreamApiKey
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in AISStream integration:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
