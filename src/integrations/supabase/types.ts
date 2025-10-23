export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          interacted_at: string | null
          interaction_type: string | null
          reason: string | null
          recommendation_data: Json
          recommendation_type: string
          shown_at: string | null
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          interacted_at?: string | null
          interaction_type?: string | null
          reason?: string | null
          recommendation_data: Json
          recommendation_type: string
          shown_at?: string | null
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          interacted_at?: string | null
          interaction_type?: string | null
          reason?: string | null
          recommendation_data?: Json
          recommendation_type?: string
          shown_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      app_updates: {
        Row: {
          changes: Json
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          release_date: string | null
          status: string | null
          title: string
          update_type: string
          updated_at: string
          version: string
        }
        Insert: {
          changes: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          release_date?: string | null
          status?: string | null
          title: string
          update_type: string
          updated_at?: string
          version: string
        }
        Update: {
          changes?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          release_date?: string | null
          status?: string | null
          title?: string
          update_type?: string
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_updates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      couples: {
        Row: {
          code_expires_at: string | null
          created_at: string
          id: string
          paired_at: string | null
          pairing_code: string | null
          partner_1_id: string
          partner_2_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          code_expires_at?: string | null
          created_at?: string
          id?: string
          paired_at?: string | null
          pairing_code?: string | null
          partner_1_id: string
          partner_2_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          code_expires_at?: string | null
          created_at?: string
          id?: string
          paired_at?: string | null
          pairing_code?: string | null
          partner_1_id?: string
          partner_2_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "couples_partner_1_id_fkey"
            columns: ["partner_1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "couples_partner_2_id_fkey"
            columns: ["partner_2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_themes: {
        Row: {
          colors: Json
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          colors: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          colors?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_themes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discovered_places: {
        Row: {
          address: string | null
          category: string | null
          city: string | null
          created_at: string | null
          description: string | null
          discovery_context: string | null
          facebook_verified: boolean | null
          id: string
          lat: number | null
          lng: number | null
          name: string
          place_id: string
          source_url: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          discovery_context?: string | null
          facebook_verified?: boolean | null
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          place_id: string
          source_url?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          discovery_context?: string | null
          facebook_verified?: boolean | null
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          place_id?: string
          source_url?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      okc_events_cache: {
        Row: {
          created_at: string | null
          description: string | null
          discovered_by: string | null
          event_date: string
          event_name: string
          event_time: string | null
          event_type: string | null
          id: string
          price_range: string | null
          relevance_score: number | null
          updated_at: string | null
          url: string | null
          venue_address: string | null
          venue_name: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discovered_by?: string | null
          event_date: string
          event_name: string
          event_time?: string | null
          event_type?: string | null
          id?: string
          price_range?: string | null
          relevance_score?: number | null
          updated_at?: string | null
          url?: string | null
          venue_address?: string | null
          venue_name?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discovered_by?: string | null
          event_date?: string
          event_name?: string
          event_time?: string | null
          event_type?: string | null
          id?: string
          price_range?: string | null
          relevance_score?: number | null
          updated_at?: string | null
          url?: string | null
          venue_address?: string | null
          venue_name?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          gender: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          gender?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      shared_data: {
        Row: {
          couple_id: string
          created_at: string
          created_by: string | null
          data: Json
          data_type: string
          id: string
          updated_at: string
        }
        Insert: {
          couple_id: string
          created_at?: string
          created_by?: string | null
          data: Json
          data_type: string
          id?: string
          updated_at?: string
        }
        Update: {
          couple_id?: string
          created_at?: string
          created_by?: string | null
          data?: Json
          data_type?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_data_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_data_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_log: {
        Row: {
          activity_data: Json
          activity_type: string
          id: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          activity_data: Json
          activity_type: string
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          activity_data?: Json
          activity_type?: string
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          id: string
          interaction_count: number | null
          learned_from: string | null
          preference_type: string
          preference_value: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          interaction_count?: number | null
          learned_from?: string | null
          preference_type: string
          preference_value: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          interaction_count?: number | null
          learned_from?: string | null
          preference_type?: string
          preference_value?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
