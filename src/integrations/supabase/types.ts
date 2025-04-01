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
      images: {
        Row: {
          alt: string
          created_at: string | null
          id: string
          position: number
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          alt?: string
          created_at?: string | null
          id?: string
          position?: number
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          alt?: string
          created_at?: string | null
          id?: string
          position?: number
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      links: {
        Row: {
          background_color: string | null
          border_radius: string | null
          created_at: string
          display_type: string | null
          icon: string | null
          id: string
          position: number
          shadow: string | null
          shadow_color: string | null
          text_color: string | null
          title: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          background_color?: string | null
          border_radius?: string | null
          created_at?: string
          display_type?: string | null
          icon?: string | null
          id?: string
          position: number
          shadow?: string | null
          shadow_color?: string | null
          text_color?: string | null
          title: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          background_color?: string | null
          border_radius?: string | null
          created_at?: string
          display_type?: string | null
          icon?: string | null
          id?: string
          position?: number
          shadow?: string | null
          shadow_color?: string | null
          text_color?: string | null
          title?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      names: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          background_image: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          font_color: string | null
          font_family: string | null
          grid_columns: number | null
          id: string
          image_layout: string | null
          logo: string | null
          show_social_icons: boolean | null
          theme: string | null
          updated_at: string
          use_infinite_slider: boolean | null
          username: string
        }
        Insert: {
          avatar?: string | null
          background_image?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          font_color?: string | null
          font_family?: string | null
          grid_columns?: number | null
          id: string
          image_layout?: string | null
          logo?: string | null
          show_social_icons?: boolean | null
          theme?: string | null
          updated_at?: string
          use_infinite_slider?: boolean | null
          username: string
        }
        Update: {
          avatar?: string | null
          background_image?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          font_color?: string | null
          font_family?: string | null
          grid_columns?: number | null
          id?: string
          image_layout?: string | null
          logo?: string | null
          show_social_icons?: boolean | null
          theme?: string | null
          updated_at?: string
          use_infinite_slider?: boolean | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
