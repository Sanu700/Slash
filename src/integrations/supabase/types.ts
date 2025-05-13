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
      booking_items: {
        Row: {
          booking_id: string
          experience_id: string
          id: string
          price_at_booking: number
          quantity: number
        }
        Insert: {
          booking_id: string
          experience_id: string
          id?: string
          price_at_booking: number
          quantity?: number
        }
        Update: {
          booking_id?: string
          experience_id?: string
          id?: string
          price_at_booking?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_items_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          id: string
          notes: string | null
          payment_method: string | null
          status: string
          total_amount: number
          user_id: string
        }
        Insert: {
          booking_date?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          status?: string
          total_amount: number
          user_id: string
        }
        Update: {
          booking_date?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          status?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      career_listings: {
        Row: {
          created_at: string
          department: string
          description: string
          id: string
          is_active: boolean | null
          is_remote: boolean | null
          location: string
          requirements: string
          salary_range: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department: string
          description: string
          id?: string
          is_active?: boolean | null
          is_remote?: boolean | null
          location: string
          requirements: string
          salary_range?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string
          description?: string
          id?: string
          is_active?: boolean | null
          is_remote?: boolean | null
          location?: string
          requirements?: string
          salary_range?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          experience_id: string
          id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          experience_id: string
          id?: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          experience_id?: string
          id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      company_pages: {
        Row: {
          content: Json
          created_at: string
          id: string
          meta_description: string | null
          page_name: string
          title: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          meta_description?: string | null
          page_name: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          meta_description?: string | null
          page_name?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          adventurous: boolean | null
          category: string
          created_at: string
          date: string
          description: string
          duration: string
          featured: boolean | null
          group_activity: boolean | null
          id: string
          image_url: string
          location: string
          niche_category: string | null
          participants: string
          price: number
          romantic: boolean | null
          title: string
          trending: boolean | null
          updated_at: string
        }
        Insert: {
          adventurous?: boolean | null
          category: string
          created_at?: string
          date: string
          description: string
          duration: string
          featured?: boolean | null
          group_activity?: boolean | null
          id?: string
          image_url: string
          location: string
          niche_category?: string | null
          participants: string
          price: number
          romantic?: boolean | null
          title: string
          trending?: boolean | null
          updated_at?: string
        }
        Update: {
          adventurous?: boolean | null
          category?: string
          created_at?: string
          date?: string
          description?: string
          duration?: string
          featured?: boolean | null
          group_activity?: boolean | null
          id?: string
          image_url?: string
          location?: string
          niche_category?: string | null
          participants?: string
          price?: number
          romantic?: boolean | null
          title?: string
          trending?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          display_order: number
          id: string
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category: string
          created_at?: string
          display_order?: number
          id?: string
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      gift_personalizations: {
        Row: {
          card_style: string
          category: string | null
          created_at: string
          delivery_method: string
          id: string
          message: string | null
          recipient_email: string | null
          recipient_name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          card_style: string
          category?: string | null
          created_at?: string
          delivery_method: string
          id?: string
          message?: string | null
          recipient_email?: string | null
          recipient_name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          card_style?: string
          category?: string | null
          created_at?: string
          delivery_method?: string
          id?: string
          message?: string | null
          recipient_email?: string | null
          recipient_name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      gift_questionnaire_responses: {
        Row: {
          adventurous: number | null
          amazon: string | null
          budget: string
          created_at: string
          facebook: string | null
          id: string
          instagram: string | null
          interests: string[]
          learning: number | null
          occasion: string
          recipient: string
          relationship: string
          relaxation: number | null
          social: number | null
          user_id: string | null
        }
        Insert: {
          adventurous?: number | null
          amazon?: string | null
          budget: string
          created_at?: string
          facebook?: string | null
          id?: string
          instagram?: string | null
          interests: string[]
          learning?: number | null
          occasion: string
          recipient: string
          relationship: string
          relaxation?: number | null
          social?: number | null
          user_id?: string | null
        }
        Update: {
          adventurous?: number | null
          amazon?: string | null
          budget?: string
          created_at?: string
          facebook?: string | null
          id?: string
          instagram?: string | null
          interests?: string[]
          learning?: number | null
          occasion?: string
          recipient?: string
          relationship?: string
          relaxation?: number | null
          social?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      press_releases: {
        Row: {
          created_at: string
          excerpt: string
          external_link: string | null
          full_content: string | null
          id: string
          is_featured: boolean | null
          publication: string
          publication_logo_url: string | null
          published_date: string
          title: string
        }
        Insert: {
          created_at?: string
          excerpt: string
          external_link?: string | null
          full_content?: string | null
          id?: string
          is_featured?: boolean | null
          publication: string
          publication_logo_url?: string | null
          published_date: string
          title: string
        }
        Update: {
          created_at?: string
          excerpt?: string
          external_link?: string | null
          full_content?: string | null
          id?: string
          is_featured?: boolean | null
          publication?: string
          publication_logo_url?: string | null
          published_date?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      support_pages: {
        Row: {
          content: Json
          created_at: string
          id: string
          meta_description: string | null
          page_name: string
          title: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          meta_description?: string | null
          page_name: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          meta_description?: string | null
          page_name?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          experience_id: string | null
          id: string
          is_featured: boolean | null
          name: string
          quote: string
          rating: number | null
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          experience_id?: string | null
          id?: string
          is_featured?: boolean | null
          name: string
          quote: string
          rating?: number | null
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          experience_id?: string | null
          id?: string
          is_featured?: boolean | null
          name?: string
          quote?: string
          rating?: number | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      viewed_experiences: {
        Row: {
          experience_id: string
          id: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          experience_id: string
          id?: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          experience_id?: string
          id?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "viewed_experiences_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          added_at: string
          experience_id: string
          id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          experience_id: string
          id?: string
          user_id: string
        }
        Update: {
          added_at?: string
          experience_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      migrate_hardcoded_experiences: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
