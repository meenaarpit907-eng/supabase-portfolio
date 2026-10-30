// Database types for the `public` schema.
//
// Written to match the output of:
//   npx supabase gen types typescript --local --schema public
// Regenerate with `npm run db:types` after changing a migration.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with the right options
  __InternalSupabase: {
    PostgrestVersion: "13";
  };
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          read_at: string | null;
          subject: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          read_at?: string | null;
          subject?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          read_at?: string | null;
          subject?: string | null;
        };
        Relationships: [];
      };
      experience: {
        Row: {
          company: string;
          company_url: string | null;
          created_at: string;
          end_date: string | null;
          highlights: string[];
          id: string;
          location: string | null;
          published: boolean;
          role: string;
          start_date: string;
          summary: string;
          tech_stack: string[];
          updated_at: string;
        };
        Insert: {
          company: string;
          company_url?: string | null;
          created_at?: string;
          end_date?: string | null;
          highlights?: string[];
          id?: string;
          location?: string | null;
          published?: boolean;
          role: string;
          start_date: string;
          summary?: string;
          tech_stack?: string[];
          updated_at?: string;
        };
        Update: {
          company?: string;
          company_url?: string | null;
          created_at?: string;
          end_date?: string | null;
          highlights?: string[];
          id?: string;
          location?: string | null;
          published?: boolean;
          role?: string;
          start_date?: string;
          summary?: string;
          tech_stack?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      profile: {
        Row: {
          available_for_work: boolean;
          avatar_path: string | null;
          bio: string;
          created_at: string;
          email: string | null;
          full_name: string;
          github_url: string | null;
          headline: string;
          id: number;
          linkedin_url: string | null;
          location: string | null;
          resume_path: string | null;
          updated_at: string;
          website_url: string | null;
          x_url: string | null;
        };
        Insert: {
          available_for_work?: boolean;
          avatar_path?: string | null;
          bio?: string;
          created_at?: string;
          email?: string | null;
          full_name: string;
          github_url?: string | null;
          headline: string;
          id?: number;
          linkedin_url?: string | null;
          location?: string | null;
          resume_path?: string | null;
          updated_at?: string;
          website_url?: string | null;
          x_url?: string | null;
        };
        Update: {
          available_for_work?: boolean;
          avatar_path?: string | null;
          bio?: string;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          github_url?: string | null;
          headline?: string;
          id?: number;
          linkedin_url?: string | null;
          location?: string | null;
          resume_path?: string | null;
          updated_at?: string;
          website_url?: string | null;
          x_url?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          body: string;
          cover_image_path: string | null;
          created_at: string;
          featured: boolean;
          id: string;
          live_url: string | null;
          published: boolean;
          repo_url: string | null;
          slug: string;
          sort_order: number;
          summary: string;
          tech_stack: string[];
          title: string;
          updated_at: string;
        };
        Insert: {
          body?: string;
          cover_image_path?: string | null;
          created_at?: string;
          featured?: boolean;
          id?: string;
          live_url?: string | null;
          published?: boolean;
          repo_url?: string | null;
          slug: string;
          sort_order?: number;
          summary: string;
          tech_stack?: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          body?: string;
          cover_image_path?: string | null;
          created_at?: string;
          featured?: boolean;
          id?: string;
          live_url?: string | null;
          published?: boolean;
          repo_url?: string | null;
          slug?: string;
          sort_order?: number;
          summary?: string;
          tech_stack?: string[];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          category: string;
          created_at: string;
          id: string;
          name: string;
          proficiency: number;
          published: boolean;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          id?: string;
          name: string;
          proficiency?: number;
          published?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: string;
          name?: string;
          proficiency?: number;
          published?: boolean;
          sort_order?: number;
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
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];
