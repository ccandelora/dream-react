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
      comments: {
        Row: {
          id: string
          dream_id: string
          user_id: string
          content: string
          likes: number
          created_at: string
        }
        Insert: {
          id?: string
          dream_id: string
          user_id: string
          content: string
          likes?: number
          created_at?: string
        }
        Update: {
          id?: string
          dream_id?: string
          user_id?: string
          content?: string
          likes?: number
          created_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          icon: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string
          icon?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          icon?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      collection_dreams: {
        Row: {
          collection_id: string
          dream_id: string
          added_at: string
        }
        Insert: {
          collection_id: string
          dream_id: string
          added_at?: string
        }
        Update: {
          collection_id?: string
          dream_id?: string
          added_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string
          bio: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string
          bio?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string
          bio?: string | null
          created_at?: string
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