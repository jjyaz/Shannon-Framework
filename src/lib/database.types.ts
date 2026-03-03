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
      consents: {
        Row: {
          id: string
          user_id: string | null
          organization_name: string
          target_domain: string
          authorized: boolean
          terms_accepted: boolean
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          organization_name: string
          target_domain: string
          authorized?: boolean
          terms_accepted?: boolean
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          organization_name?: string
          target_domain?: string
          authorized?: boolean
          terms_accepted?: boolean
          ip_address?: string | null
          created_at?: string
        }
      }
      scans: {
        Row: {
          id: string
          user_id: string | null
          consent_id: string | null
          target_domain: string
          target_ip: string | null
          scope_description: string | null
          scan_depth: string
          status: string
          risk_score: number
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          consent_id?: string | null
          target_domain: string
          target_ip?: string | null
          scope_description?: string | null
          scan_depth?: string
          status?: string
          risk_score?: number
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          consent_id?: string | null
          target_domain?: string
          target_ip?: string | null
          scope_description?: string | null
          scan_depth?: string
          status?: string
          risk_score?: number
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      scan_modules: {
        Row: {
          id: string
          scan_id: string | null
          module_name: string
          enabled: boolean
          status: string
          results: Json
          created_at: string
        }
        Insert: {
          id?: string
          scan_id?: string | null
          module_name: string
          enabled?: boolean
          status?: string
          results?: Json
          created_at?: string
        }
        Update: {
          id?: string
          scan_id?: string | null
          module_name?: string
          enabled?: boolean
          status?: string
          results?: Json
          created_at?: string
        }
      }
      findings: {
        Row: {
          id: string
          scan_id: string | null
          module_name: string | null
          title: string
          description: string | null
          severity: string
          cvss_score: number | null
          affected_url: string | null
          evidence: string | null
          remediation: string | null
          cwe_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          scan_id?: string | null
          module_name?: string | null
          title: string
          description?: string | null
          severity?: string
          cvss_score?: number | null
          affected_url?: string | null
          evidence?: string | null
          remediation?: string | null
          cwe_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          scan_id?: string | null
          module_name?: string | null
          title?: string
          description?: string | null
          severity?: string
          cvss_score?: number | null
          affected_url?: string | null
          evidence?: string | null
          remediation?: string | null
          cwe_id?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          scan_id: string | null
          report_type: string
          title: string
          content: string
          format: string
          generated_by: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          scan_id?: string | null
          report_type?: string
          title: string
          content: string
          format?: string
          generated_by?: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          scan_id?: string | null
          report_type?: string
          title?: string
          content?: string
          format?: string
          generated_by?: string
          metadata?: Json
          created_at?: string
        }
      }
      attack_paths: {
        Row: {
          id: string
          scan_id: string | null
          source_node: string
          target_node: string
          path_data: Json
          severity: string
          exploitability: number | null
          created_at: string
        }
        Insert: {
          id?: string
          scan_id?: string | null
          source_node: string
          target_node: string
          path_data?: Json
          severity?: string
          exploitability?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          scan_id?: string | null
          source_node?: string
          target_node?: string
          path_data?: Json
          severity?: string
          exploitability?: number | null
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
