export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ApplicationStatus = "pending" | "approved" | "rejected"
export type ReviewStatus = "pending" | "approved"

export type Database = {
  public: {
    Tables: {
      freelancer_applications: {
        Row: {
          id: number
          name: string
          email: string
          role: string
          message: string
          linkedin_url: string
          image_url: string | null
          status: ApplicationStatus
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          role: string
          message: string
          linkedin_url: string
          image_url?: string | null
          status?: ApplicationStatus
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          role?: string
          message?: string
          linkedin_url?: string
          image_url?: string | null
          status?: ApplicationStatus
          created_at?: string
        }
        Relationships: []
      }
      freelancers: {
        Row: {
          id: number
          name: string
          role: string
          title_en: string | null
          title_so: string | null
          title_ar: string | null
          bio_en: string | null
          bio_so: string | null
          bio_ar: string | null
          image_url: string | null
          email: string
          linkedin_url: string
          message: string
        }
        Insert: {
          id?: number
          name: string
          role: string
          title_en?: string | null
          title_so?: string | null
          title_ar?: string | null
          bio_en?: string | null
          bio_so?: string | null
          bio_ar?: string | null
          image_url?: string | null
          email: string
          linkedin_url: string
          message: string
        }
        Update: {
          id?: number
          name?: string
          role?: string
          title_en?: string | null
          title_so?: string | null
          title_ar?: string | null
          bio_en?: string | null
          bio_so?: string | null
          bio_ar?: string | null
          image_url?: string | null
          email?: string
          linkedin_url?: string
          message?: string
        }
        Relationships: []
      }
      project_orders: {
        Row: {
          id: string
          plan: string | null
          description: string | null
          file_url: string | null
          customer_email: string | null
          service: string | null
          language: string | null
          status: string | null
          amount: number | null
          custom_amount: number | null
          currency: string | null
          provider: string | null
          payment_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          plan?: string | null
          description?: string | null
          file_url?: string | null
          customer_email?: string | null
          service?: string | null
          language?: string | null
          status?: string | null
          amount?: number | null
          custom_amount?: number | null
          currency?: string | null
          provider?: string | null
          payment_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          plan?: string | null
          description?: string | null
          file_url?: string | null
          customer_email?: string | null
          service?: string | null
          language?: string | null
          status?: string | null
          amount?: number | null
          custom_amount?: number | null
          currency?: string | null
          provider?: string | null
          payment_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          name: string
          message: string
          message_en: string | null
          message_so: string | null
          message_ar: string | null
          rating: number
          admin_response: string | null
          admin_response_en: string | null
          admin_response_so: string | null
          admin_response_ar: string | null
          status: ReviewStatus
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          message: string
          message_en?: string | null
          message_so?: string | null
          message_ar?: string | null
          rating: number
          admin_response?: string | null
          admin_response_en?: string | null
          admin_response_so?: string | null
          admin_response_ar?: string | null
          status?: ReviewStatus
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          message?: string
          message_en?: string | null
          message_so?: string | null
          message_ar?: string | null
          rating?: number
          admin_response?: string | null
          admin_response_en?: string | null
          admin_response_so?: string | null
          admin_response_ar?: string | null
          status?: ReviewStatus
          created_at?: string
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
