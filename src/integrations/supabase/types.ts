export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ais_feeds: {
        Row: {
          api_endpoint: string
          api_key_ref: string | null
          config: Json | null
          created_at: string | null
          error_count: number | null
          id: string
          last_sync: string | null
          provider_name: string
          records_processed: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          api_endpoint: string
          api_key_ref?: string | null
          config?: Json | null
          created_at?: string | null
          error_count?: number | null
          id?: string
          last_sync?: string | null
          provider_name: string
          records_processed?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          api_endpoint?: string
          api_key_ref?: string | null
          config?: Json | null
          created_at?: string | null
          error_count?: number | null
          id?: string
          last_sync?: string | null
          provider_name?: string
          records_processed?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      api_integration_logs: {
        Row: {
          endpoint: string | null
          error_message: string | null
          id: string
          integration_type: string
          metadata: Json | null
          provider: string
          records_processed: number | null
          response_time_ms: number | null
          status_code: number | null
          timestamp_utc: string | null
        }
        Insert: {
          endpoint?: string | null
          error_message?: string | null
          id?: string
          integration_type: string
          metadata?: Json | null
          provider: string
          records_processed?: number | null
          response_time_ms?: number | null
          status_code?: number | null
          timestamp_utc?: string | null
        }
        Update: {
          endpoint?: string | null
          error_message?: string | null
          id?: string
          integration_type?: string
          metadata?: Json | null
          provider?: string
          records_processed?: number | null
          response_time_ms?: number | null
          status_code?: number | null
          timestamp_utc?: string | null
        }
        Relationships: []
      }
      data_retention_policies: {
        Row: {
          archive_to_storage: boolean | null
          compression_enabled: boolean | null
          created_at: string | null
          id: string
          policy_active: boolean | null
          retention_days: number
          table_name: string
          updated_at: string | null
        }
        Insert: {
          archive_to_storage?: boolean | null
          compression_enabled?: boolean | null
          created_at?: string | null
          id?: string
          policy_active?: boolean | null
          retention_days: number
          table_name: string
          updated_at?: string | null
        }
        Update: {
          archive_to_storage?: boolean | null
          compression_enabled?: boolean | null
          created_at?: string | null
          id?: string
          policy_active?: boolean | null
          retention_days?: number
          table_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          clearance_level: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          organization: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          clearance_level?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          organization?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          clearance_level?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          organization?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      satellite_images: {
        Row: {
          acquisition_time: string
          bbox_east: number | null
          bbox_north: number | null
          bbox_south: number | null
          bbox_west: number | null
          cloud_cover_percentage: number | null
          created_at: string | null
          file_size_mb: number | null
          id: string
          image_url: string
          metadata: Json | null
          processing_level: string | null
          provider: string
          resolution_meters: number | null
          satellite_name: string | null
          scene_id: string | null
          thumbnail_url: string | null
        }
        Insert: {
          acquisition_time: string
          bbox_east?: number | null
          bbox_north?: number | null
          bbox_south?: number | null
          bbox_west?: number | null
          cloud_cover_percentage?: number | null
          created_at?: string | null
          file_size_mb?: number | null
          id?: string
          image_url: string
          metadata?: Json | null
          processing_level?: string | null
          provider: string
          resolution_meters?: number | null
          satellite_name?: string | null
          scene_id?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          acquisition_time?: string
          bbox_east?: number | null
          bbox_north?: number | null
          bbox_south?: number | null
          bbox_west?: number | null
          cloud_cover_percentage?: number | null
          created_at?: string | null
          file_size_mb?: number | null
          id?: string
          image_url?: string
          metadata?: Json | null
          processing_level?: string | null
          provider?: string
          resolution_meters?: number | null
          satellite_name?: string | null
          scene_id?: string | null
          thumbnail_url?: string | null
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          component: string
          id: string
          metadata: Json | null
          metric_name: string
          metric_unit: string | null
          metric_value: number
          timestamp_utc: string | null
        }
        Insert: {
          component: string
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          timestamp_utc?: string | null
        }
        Update: {
          component?: string
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          timestamp_utc?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown | null
          last_activity: string | null
          session_data: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          last_activity?: string | null
          session_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          last_activity?: string | null
          session_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      vessel_positions: {
        Row: {
          course_degrees: number | null
          created_at: string | null
          data_quality_score: number | null
          heading_degrees: number | null
          id: string
          latitude: number
          longitude: number
          mmsi: string
          navigation_status: string | null
          raw_data: Json | null
          source_feed: string
          speed_knots: number | null
          timestamp_utc: string
          vessel_id: string | null
        }
        Insert: {
          course_degrees?: number | null
          created_at?: string | null
          data_quality_score?: number | null
          heading_degrees?: number | null
          id?: string
          latitude: number
          longitude: number
          mmsi: string
          navigation_status?: string | null
          raw_data?: Json | null
          source_feed: string
          speed_knots?: number | null
          timestamp_utc: string
          vessel_id?: string | null
        }
        Update: {
          course_degrees?: number | null
          created_at?: string | null
          data_quality_score?: number | null
          heading_degrees?: number | null
          id?: string
          latitude?: number
          longitude?: number
          mmsi?: string
          navigation_status?: string | null
          raw_data?: Json | null
          source_feed?: string
          speed_knots?: number | null
          timestamp_utc?: string
          vessel_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vessel_positions_vessel_id_fkey"
            columns: ["vessel_id"]
            isOneToOne: false
            referencedRelation: "vessels"
            referencedColumns: ["id"]
          },
        ]
      }
      vessels: {
        Row: {
          call_sign: string | null
          created_at: string | null
          flag_country: string | null
          gross_tonnage: number | null
          id: string
          imo: string | null
          length: number | null
          metadata: Json | null
          mmsi: string
          organization_id: string | null
          owner_company: string | null
          status: string | null
          updated_at: string | null
          vessel_name: string
          vessel_type: string | null
          width: number | null
        }
        Insert: {
          call_sign?: string | null
          created_at?: string | null
          flag_country?: string | null
          gross_tonnage?: number | null
          id?: string
          imo?: string | null
          length?: number | null
          metadata?: Json | null
          mmsi: string
          organization_id?: string | null
          owner_company?: string | null
          status?: string | null
          updated_at?: string | null
          vessel_name: string
          vessel_type?: string | null
          width?: number | null
        }
        Update: {
          call_sign?: string | null
          created_at?: string | null
          flag_country?: string | null
          gross_tonnage?: number | null
          id?: string
          imo?: string | null
          length?: number | null
          metadata?: Json | null
          mmsi?: string
          organization_id?: string | null
          owner_company?: string | null
          status?: string | null
          updated_at?: string | null
          vessel_name?: string
          vessel_type?: string | null
          width?: number | null
        }
        Relationships: []
      }
      weather_data: {
        Row: {
          barometric_pressure: number | null
          created_at: string | null
          id: string
          latitude: number
          longitude: number
          provider: string
          raw_data: Json | null
          temperature_celsius: number | null
          timestamp_utc: string
          visibility_km: number | null
          wave_height_meters: number | null
          weather_conditions: string | null
          wind_direction_degrees: number | null
          wind_speed_knots: number | null
        }
        Insert: {
          barometric_pressure?: number | null
          created_at?: string | null
          id?: string
          latitude: number
          longitude: number
          provider: string
          raw_data?: Json | null
          temperature_celsius?: number | null
          timestamp_utc: string
          visibility_km?: number | null
          wave_height_meters?: number | null
          weather_conditions?: string | null
          wind_direction_degrees?: number | null
          wind_speed_knots?: number | null
        }
        Update: {
          barometric_pressure?: number | null
          created_at?: string | null
          id?: string
          latitude?: number
          longitude?: number
          provider?: string
          raw_data?: Json | null
          temperature_celsius?: number | null
          timestamp_utc?: string
          visibility_km?: number | null
          wave_height_meters?: number | null
          weather_conditions?: string | null
          wind_direction_degrees?: number | null
          wind_speed_knots?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_positions: {
        Args: { days_to_keep?: number }
        Returns: number
      }
      get_system_health: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
