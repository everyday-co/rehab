export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          user_id: string
          address: string
          city: string
          state: string
          zip: string
          sqft: number | null
          sqft_above_grade: number | null
          sqft_basement: number | null
          beds: number | null
          baths: number | null
          lot_acres: number | null
          garage_spaces: number | null
          year_built: number | null
          purchase_price: number | null
          purchase_date: string | null
          arv_low: number | null
          arv_high: number | null
          condition: string | null
          status: string
          current_phase: number
          current_step: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          address: string
          city: string
          state: string
          zip: string
          sqft?: number | null
          sqft_above_grade?: number | null
          sqft_basement?: number | null
          beds?: number | null
          baths?: number | null
          lot_acres?: number | null
          garage_spaces?: number | null
          year_built?: number | null
          purchase_price?: number | null
          purchase_date?: string | null
          arv_low?: number | null
          arv_high?: number | null
          condition?: string | null
          status?: string
          current_phase?: number
          current_step?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          address?: string
          city?: string
          state?: string
          zip?: string
          sqft?: number | null
          sqft_above_grade?: number | null
          sqft_basement?: number | null
          beds?: number | null
          baths?: number | null
          lot_acres?: number | null
          garage_spaces?: number | null
          year_built?: number | null
          purchase_price?: number | null
          purchase_date?: string | null
          arv_low?: number | null
          arv_high?: number | null
          condition?: string | null
          status?: string
          current_phase?: number
          current_step?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rehab_items: {
        Row: {
          id: string
          property_id: string
          category: string
          item_key: string
          name: string
          unit: string
          quantity: number
          cost_low: number
          cost_high: number
          labor_pct: number | null
          priority: string | null
          is_included: boolean
          is_completed: boolean
          actual_cost: number | null
          notes: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          category: string
          item_key: string
          name: string
          unit: string
          quantity: number
          cost_low: number
          cost_high: number
          labor_pct?: number | null
          priority?: string | null
          is_included?: boolean
          is_completed?: boolean
          actual_cost?: number | null
          notes?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          category?: string
          item_key?: string
          name?: string
          unit?: string
          quantity?: number
          cost_low?: number
          cost_high?: number
          labor_pct?: number | null
          priority?: string | null
          is_included?: boolean
          is_completed?: boolean
          actual_cost?: number | null
          notes?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          property_id: string
          rehab_item_id: string | null
          amount: number
          description: string | null
          vendor: string | null
          date: string
          receipt_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          rehab_item_id?: string | null
          amount: number
          description?: string | null
          vendor?: string | null
          date: string
          receipt_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          rehab_item_id?: string | null
          amount?: number
          description?: string | null
          vendor?: string | null
          date?: string
          receipt_url?: string | null
          created_at?: string
        }
      }
      flip_results: {
        Row: {
          id: string
          property_id: string
          user_id: string
          sale_price: number | null
          total_cost: number | null
          gross_profit: number | null
          roi: number | null
          days_on_market: number | null
          projected_profit: number | null
          projected_roi: number | null
          lessons_learned: string[] | null
          what_worked: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          sale_price?: number | null
          total_cost?: number | null
          gross_profit?: number | null
          roi?: number | null
          days_on_market?: number | null
          projected_profit?: number | null
          projected_roi?: number | null
          lessons_learned?: string[] | null
          what_worked?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          sale_price?: number | null
          total_cost?: number | null
          gross_profit?: number | null
          roi?: number | null
          days_on_market?: number | null
          projected_profit?: number | null
          projected_roi?: number | null
          lessons_learned?: string[] | null
          what_worked?: string[] | null
          created_at?: string
        }
      }
      api_usage: {
        Row: {
          id: string
          user_id: string
          endpoint: string
          occurred_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          endpoint: string
          occurred_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          endpoint?: string
          occurred_at?: string
          metadata?: Json | null
        }
      }
      photos: {
        Row: {
          id: string
          property_id: string
          url: string
          thumbnail_url: string | null
          room: string | null
          stage: string | null
          is_main: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          url: string
          thumbnail_url?: string | null
          room?: string | null
          stage?: string | null
          is_main?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          url?: string
          thumbnail_url?: string | null
          room?: string | null
          stage?: string | null
          is_main?: boolean
          sort_order?: number
          created_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

