export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          status: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          status?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      roles: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      permissions: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      role_permissions: {
        Row: {
          id: string;
          role_id: string;
          permission_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          role_id: string;
          permission_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          role_id?: string;
          permission_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role_id: string;
          assigned_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role_id: string;
          assigned_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role_id?: string;
          assigned_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      kids: {
        Row: {
          id: string;
          user_id: string;
          nickname: string;
          age: number;
          grade_level: string;
          creature_name: string | null;
          creature_type: string | null;
          creature_image_url: string | null;
          orbs: number;
          words_written: number;
          reading_level: string;
          family_id: string | null;
          classroom_id: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          nickname: string;
          age: number;
          grade_level: string;
          creature_name?: string | null;
          creature_type?: string | null;
          creature_image_url?: string | null;
          orbs?: number;
          words_written?: number;
          reading_level?: string;
          family_id?: string | null;
          classroom_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          nickname?: string;
          age?: number;
          grade_level?: string;
          creature_name?: string | null;
          creature_type?: string | null;
          creature_image_url?: string | null;
          orbs?: number;
          words_written?: number;
          reading_level?: string;
          family_id?: string | null;
          classroom_id?: string | null;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      families: {
        Row: {
          id: string;
          user_id: string;
          family_name: string;
          primary_contact_phone: string | null;
          subscription_tier: string;
          subscription_status: string;
          parent_pin?: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          family_name: string;
          primary_contact_phone?: string | null;
          subscription_tier?: string;
          subscription_status?: string;
          parent_pin?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          family_name?: string;
          primary_contact_phone?: string | null;
          subscription_tier?: string;
          subscription_status?: string;
          parent_pin?: string | null;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      family_members: {
        Row: {
          id: string;
          family_id: string;
          user_id: string;
          relationship: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          user_id: string;
          relationship?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          user_id?: string;
          relationship?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      teachers: {
        Row: {
          id: string;
          user_id: string;
          school_name: string;
          department: string | null;
          grade_level: string;
          verified: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          school_name: string;
          department?: string | null;
          grade_level: string;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          school_name?: string;
          department?: string | null;
          grade_level?: string;
          verified?: boolean;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      admin_profiles: {
        Row: {
          id: string;
          user_id: string;
          department: string;
          access_tier: string;
          last_active: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          department: string;
          access_tier?: string;
          last_active?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          department?: string;
          access_tier?: string;
          last_active?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          user_email: string | null;
          user_role: string | null;
          action: string;
          resource: string;
          resource_id: string | null;
          details: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          user_email?: string | null;
          user_role?: string | null;
          action: string;
          resource: string;
          resource_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          user_email?: string | null;
          user_role?: string | null;
          action?: string;
          resource?: string;
          resource_id?: string | null;
          details?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      system_settings: {
        Row: {
          key: string;
          value: Json;
          description: string | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
