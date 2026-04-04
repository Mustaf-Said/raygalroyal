export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ApplicationStatus = "pending" | "approved" | "rejected"
export type ReviewStatus = "pending" | "approved"
export type FreelancerStatus = "pending" | "approved" | "rejected"

export type Database = {
  public: {
    Tables: {
      freelancers: {
        Row: {
          id: number
          user_id: string | null
          name: string
          role: string | null
          bio: string | null
          profile_image: string | null
          phone: string | null
          github: string | null
          status: FreelancerStatus
          created_at: string
          title_en: string | null
          title_so: string | null
          title_ar: string | null
          bio_en: string | null
          bio_so: string | null
          bio_ar: string | null
          email: string
          message: string
        }
        Insert: {
          id?: number
          user_id?: string | null
          name: string
          role?: string | null
          bio?: string | null
          profile_image?: string | null
          phone?: string | null
          github?: string | null
          status?: FreelancerStatus
          created_at?: string
          title_en?: string | null
          title_so?: string | null
          title_ar?: string | null
          bio_en?: string | null
          bio_so?: string | null
          bio_ar?: string | null
          email: string
          message?: string
        }
        Update: {
          id?: number
          user_id?: string | null
          name?: string
          role?: string | null
          bio?: string | null
          profile_image?: string | null
          phone?: string | null
          github?: string | null
          status?: FreelancerStatus
          created_at?: string
          title_en?: string | null
          title_so?: string | null
          title_ar?: string | null
          bio_en?: string | null
          bio_so?: string | null
          bio_ar?: string | null
          email?: string
          message?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          message?: string
          created_at?: string
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
      orders: {
        Row: {
          id: string
          domain: string
          price: number
          user_email: string
          payment_provider: string
          status: string
          payment_id: string | null
          currency: string | null
          total_price: number | null
          customer_name: string | null
          extras: Json | null
          registrar_order_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          domain: string
          price: number
          user_email: string
          payment_provider: string
          status?: string
          payment_id?: string | null
          currency?: string | null
          total_price?: number | null
          customer_name?: string | null
          extras?: Json | null
          registrar_order_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          domain?: string
          price?: number
          user_email?: string
          payment_provider?: string
          status?: string
          payment_id?: string | null
          currency?: string | null
          total_price?: number | null
          customer_name?: string | null
          extras?: Json | null
          registrar_order_id?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      hosting_accounts: {
        Row: {
          id: string
          domain: string
          server_id: string
          plan: string
          created_at: string | null
        }
        Insert: {
          id?: string
          domain: string
          server_id: string
          plan: string
          created_at?: string | null
        }
        Update: {
          id?: string
          domain?: string
          server_id?: string
          plan?: string
          created_at?: string | null
        }
        Relationships: []
      }
      email_accounts: {
        Row: {
          id: string
          domain: string
          email_address: string
          provider: string
          created_at: string | null
        }
        Insert: {
          id?: string
          domain: string
          email_address: string
          provider?: string
          created_at?: string | null
        }
        Update: {
          id?: string
          domain?: string
          email_address?: string
          provider?: string
          created_at?: string | null
        }
        Relationships: []
      }
      ssl_certificates: {
        Row: {
          id: string
          domain: string
          status: string
          issued_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          domain: string
          status?: string
          issued_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          domain?: string
          status?: string
          issued_at?: string | null
          created_at?: string | null
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
