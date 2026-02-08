// Database Types for GEUWAT Member App
// Based on Supabase Database Schema

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          fullname: string
          email: string
          whatsapp: string | null
          role: 'member' | 'admin'
          status: 'unpaid' | 'paid' | 'active' | 'inactive' | 'suspend' | 'ban'
          tier: 'Rookie' | 'Pro' | 'Legend'
          tier_period: string | null
          referral_code: string
          referred_by: string | null
          membership_start: string | null
          subscription_expires_at: string | null
          balance: string
          referral_period: string
          monthly_referral_count: number
          created_at: string
          updated_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'referral_code'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      tiers: {
        Row: {
          id: string
          tier_name: 'Rookie' | 'Pro' | 'Legend'
          referral_bonus_percentage: string
          cashback_percentage: string
          min_referrals: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tiers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tiers']['Insert']>
      }
      user_tier_history: {
        Row: {
          id: string
          user_id: string
          period: string
          tier: 'Rookie' | 'Pro' | 'Legend'
          referral_count: number
          referral_bonus_percentage: string
          cashback_percentage: string
          calculated_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_tier_history']['Row'], 'id' | 'calculated_at'>
        Update: Partial<Database['public']['Tables']['user_tier_history']['Insert']>
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_user_id: string
          period: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['referrals']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['referrals']['Insert']>
      }
      wallet_transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          amount: string
          status: string
          source_period: string | null
          applied_percentage: string | null
          tier_at_time: 'Rookie' | 'Pro' | 'Legend' | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['wallet_transactions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['wallet_transactions']['Insert']>
      }
      withdraw_requests: {
        Row: {
          id: string
          user_id: string
          amount: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['withdraw_requests']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['withdraw_requests']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          recipient_id: string
          type: string
          content: string
          status: string
          created_at: string
          read_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      invitation_links: {
        Row: {
          id: string
          referral_code: string
          tier: 'Rookie' | 'Pro' | 'Legend'
          status: 'active' | 'used' | 'expired'
          expires_at: string
          used_by: string | null
          used_at: string | null
          created_by: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['invitation_links']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['invitation_links']['Insert']>
      }
      subscription_price: {
        Row: {
          id: string
          name: string
          price_cents: number
          currency: string
          interval: string
          stripe_price_id: string | null
          active: boolean
          metadata: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['subscription_price']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['subscription_price']['Insert']>
      }
      system_config: {
        Row: {
          id: string
          config_key: string
          config_value: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['system_config']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['system_config']['Insert']>
      }
      unpaid_members: {
        Row: {
          id: number
          name: string
          email: string
          role: string
          registered_at: string
          due_date: string
          amount_due: number
          days_overdue: number
          status: 'unpaid' | 'paid' | 'overdue'
        }
        Insert: Omit<Database['public']['Tables']['unpaid_members']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['unpaid_members']['Insert']>
      }
      extension_requests: {
        Row: {
          id: string
          user_id: string
          requested_days: number
          reason: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
          reviewed_by: string | null
          review_notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['extension_requests']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['extension_requests']['Insert']>
      }
      app_settings: {
        Row: {
          key: string
          maintenance_mode: boolean
          maintenance_message: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['app_settings']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['app_settings']['Insert']>
      }
      general_updates: {
        Row: {
          id: string
          type: string
          title: string | null
          content: string
          is_active: boolean
          published_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['general_updates']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['general_updates']['Insert']>
      }
      broadcast_messages: {
        Row: {
          id: string
          title: string
          content: string
          target_type: 'tier' | 'all' | 'specific'
          target_value: string | null
          scheduled_date: string | null
          sent_date: string | null
          status: string
          recipient_count: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['broadcast_messages']['Row'], 'id' | 'created_at' | 'updated_at' | 'sent_date'>
        Update: Partial<Omit<Database['public']['Tables']['broadcast_messages']['Row'], 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: {
      [key: string]: never
    }
    Functions: {
      [key: string]: never
    }
    Enums: {
      tier_enum: 'Rookie' | 'Pro' | 'Legend'
      user_role_enum: 'member' | 'admin'
      user_status_enum: 'unpaid' | 'paid' | 'active' | 'inactive' | 'suspend' | 'ban'
    }
    CompositeTypes: {
      [key: string]: never
    }
  }
}

// Export commonly used types
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Tier = Database['public']['Tables']['tiers']['Row']
export type TierInsert = Database['public']['Tables']['tiers']['Insert']
export type TierUpdate = Database['public']['Tables']['tiers']['Update']

export type UserTierHistory = Database['public']['Tables']['user_tier_history']['Row']
export type UserTierHistoryInsert = Database['public']['Tables']['user_tier_history']['Insert']
export type UserTierHistoryUpdate = Database['public']['Tables']['user_tier_history']['Update']

export type Referral = Database['public']['Tables']['referrals']['Row']
export type ReferralInsert = Database['public']['Tables']['referrals']['Insert']
export type ReferralUpdate = Database['public']['Tables']['referrals']['Update']

export type WalletTransaction = Database['public']['Tables']['wallet_transactions']['Row']
export type WalletTransactionInsert = Database['public']['Tables']['wallet_transactions']['Insert']
export type WalletTransactionUpdate = Database['public']['Tables']['wallet_transactions']['Update']

export type WithdrawRequest = Database['public']['Tables']['withdraw_requests']['Row']
export type WithdrawRequestInsert = Database['public']['Tables']['withdraw_requests']['Insert']
export type WithdrawRequestUpdate = Database['public']['Tables']['withdraw_requests']['Update']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']

export type InvitationLink = Database['public']['Tables']['invitation_links']['Row']
export type InvitationLinkInsert = Database['public']['Tables']['invitation_links']['Insert']
export type InvitationLinkUpdate = Database['public']['Tables']['invitation_links']['Update']

export type SystemConfig = Database['public']['Tables']['system_config']['Row']
export type SystemConfigInsert = Database['public']['Tables']['system_config']['Insert']
export type SystemConfigUpdate = Database['public']['Tables']['system_config']['Update']

export type UnpaidMember = Database['public']['Tables']['unpaid_members']['Row']
export type UnpaidMemberInsert = Database['public']['Tables']['unpaid_members']['Insert']
export type UnpaidMemberUpdate = Database['public']['Tables']['unpaid_members']['Update']

export type ExtensionRequest = Database['public']['Tables']['extension_requests']['Row']
export type ExtensionRequestInsert = Database['public']['Tables']['extension_requests']['Insert']
export type ExtensionRequestUpdate = Database['public']['Tables']['extension_requests']['Update']

export type AppSettings = Database['public']['Tables']['app_settings']['Row']
export type AppSettingsInsert = Database['public']['Tables']['app_settings']['Insert']
export type AppSettingsUpdate = Database['public']['Tables']['app_settings']['Update']

export type GeneralUpdate = Database['public']['Tables']['general_updates']['Row']
export type GeneralUpdateInsert = Database['public']['Tables']['general_updates']['Insert']
export type GeneralUpdateUpdate = Database['public']['Tables']['general_updates']['Update']

export type BroadcastMessage = Database['public']['Tables']['broadcast_messages']['Row']
export type BroadcastMessageInsert = Database['public']['Tables']['broadcast_messages']['Insert']
export type BroadcastMessageUpdate = Database['public']['Tables']['broadcast_messages']['Update']

// Utility types
export type UserRole = User['role']
export type UserStatus = User['status']
export type UserTier = User['tier']
export type TierEnum = Database['public']['Enums']['tier_enum']
export type UserStatusEnum = Database['public']['Enums']['user_status_enum']
