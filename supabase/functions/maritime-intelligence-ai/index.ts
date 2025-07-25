import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      analysisType, 
      data, 
      query, 
      context = "maritime intelligence"
    } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let systemPrompt = '';
    let userMessage = '';

    switch (analysisType) {
      case 'threat_assessment':
        systemPrompt = `You are an expert maritime intelligence analyst specializing in threat assessment and security analysis. 
        Analyze vessel data, movement patterns, and behaviors to identify potential threats, suspicious activities, or security concerns.
        Focus on: Ghost vessels, AIS manipulation, route deviations, speed anomalies, restricted area violations, and coordination patterns.
        Provide risk levels: CRITICAL, HIGH, MEDIUM, LOW with detailed reasoning.`;
        userMessage = `Analyze the following maritime intelligence data for threats and suspicious activities:\n\n${JSON.stringify(data, null, 2)}`;
        break;

      case 'pattern_recognition':
        systemPrompt = `You are a maritime pattern recognition specialist. Analyze vessel movement data to identify:
        1. Coordinated vessel movements
        2. Unusual traffic patterns
        3. Potential dark fleet operations
        4. Route optimization opportunities
        5. Seasonal migration patterns
        Provide insights with confidence levels and recommendations.`;
        userMessage = `Analyze these vessel movement patterns and identify significant trends:\n\n${JSON.stringify(data, null, 2)}`;
        break;

      case 'report_generation':
        systemPrompt = `You are a maritime intelligence report writer. Generate comprehensive, professional intelligence reports.
        Include: Executive Summary, Key Findings, Threat Assessment, Recommendations, and Supporting Data.
        Use maritime terminology and maintain security classification awareness.`;
        userMessage = `Generate a maritime intelligence report based on this data:\n\n${JSON.stringify(data, null, 2)}`;
        break;

      case 'natural_language_query':
        // First, fetch relevant data based on the query
        const { data: vesselData } = await supabase
          .from('vessel_positions')
          .select(`
            *,
            vessels (*)
          `)
          .order('timestamp_utc', { ascending: false })
          .limit(100);

        const { data: alertData } = await supabase
          .from('alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        systemPrompt = `You are ArgoSight's maritime intelligence AI assistant. Answer questions about maritime operations, vessel tracking, threats, and intelligence data.
        You have access to real-time vessel positions, alerts, weather data, and intelligence reports.
        Provide accurate, actionable intelligence responses with specific data when available.
        Available data context: ${vesselData?.length || 0} recent vessel positions, ${alertData?.length || 0} recent alerts.`;
        
        userMessage = `Maritime Intelligence Query: ${query}\n\nAvailable Data Context:\nVessels: ${JSON.stringify(vesselData?.slice(0, 10), null, 2)}\nAlerts: ${JSON.stringify(alertData?.slice(0, 5), null, 2)}`;
        break;

      case 'route_optimization':
        systemPrompt = `You are a maritime route optimization expert. Analyze routes for efficiency, safety, and cost-effectiveness.
        Consider: Weather conditions, traffic density, fuel consumption, regulatory restrictions, and threat levels.
        Provide specific recommendations with reasoning.`;
        userMessage = `Optimize the following maritime route data:\n\n${JSON.stringify(data, null, 2)}`;
        break;

      case 'weather_impact_analysis':
        systemPrompt = `You are a maritime meteorologist and operations analyst. Assess weather impacts on maritime operations.
        Analyze: Storm systems, ice conditions, wave heights, visibility, and operational safety.
        Provide operational recommendations and risk assessments.`;
        userMessage = `Analyze weather impact on maritime operations:\n\n${JSON.stringify(data, null, 2)}`;
        break;

      default:
        throw new Error(`Unknown analysis type: ${analysisType}`);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const aiResponse = await response.json();
    const analysis = aiResponse.choices[0].message.content;

    // Log the analysis for audit purposes
    await supabase
      .from('ai_analysis_logs')
      .insert({
        analysis_type: analysisType,
        input_data: data,
        analysis_result: analysis,
        model_used: 'gpt-4.1-2025-04-14',
        timestamp: new Date().toISOString()
      });

    return new Response(JSON.stringify({ 
      analysis,
      analysisType,
      timestamp: new Date().toISOString(),
      model: 'gpt-4.1-2025-04-14'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in maritime-intelligence-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});