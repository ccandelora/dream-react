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
      dreams: {
        Row: {
          id: string
          user_id: string
          content: string
          tags: string[]
          likes: number
          comments: number
          created_at: string
          clarity: number
          analysis: Json | null
          privacy: 'public' | 'anonymous' | 'private'
          image_url: string | null
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          tags?: string[]
          likes?: number
          comments?: number
          created_at?: string
          clarity?: number
          analysis?: Json | null
          privacy?: 'public' | 'anonymous' | 'private'
          image_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          tags?: string[]
          likes?: number
          comments?: number
          created_at?: string
          clarity?: number
          analysis?: Json | null
          privacy?: 'public' | 'anonymous' | 'private'
          image_url?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          bio: string | null
          joined_date: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          bio?: string | null
          joined_date?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          bio?: string | null
          joined_date?: string
        }
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
  }
}