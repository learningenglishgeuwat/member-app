import { supabase, supabaseLoose } from './supabase'
import type { User } from '@/types/database'

// Sign up function
export async function signUp(email: string, password: string, userData: Partial<User>) {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return { success: false, error: authError.message }
    }

    if (authData.user) {
      // Create user record in our users table
      const { error: userError } = await supabaseLoose
        .from('users')
        .insert({
          email: userData.email || email,
          fullname: userData.fullname || '',
          whatsapp: userData.whatsapp || null,
          role: 'member',
          status: 'unpaid',
          tier: 'Rookie',
          referral_code: generateReferralCode(),
          referred_by: userData.referred_by || null,
          balance: '0',
          referral_period: new Date().toISOString().slice(0, 7),
          monthly_referral_count: 0,
          tier_period: null,
          membership_start: null,
          subscription_expires_at: null,
          updated_at: null,
        })

      if (userError) {
        console.error('Error creating user record:', userError)
        return { success: false, error: 'Failed to create user record' }
      }

      return { success: true }
    }

    return { success: false, error: 'Unknown error occurred' }
  } catch (error) {
    console.error('Sign up error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Sign in function
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Categorize error types
      const errorMessage = error.message.toLowerCase()
      
      // Check for network/connection errors
      if (
        errorMessage.includes('fetch') ||
        errorMessage.includes('network') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('connection') ||
        error.status === 0
      ) {
        return { 
          success: false, 
          error: error.message,
          errorType: 'network' as const
        }
      }
      
      // Check for invalid credentials
      if (
        errorMessage.includes('invalid login credentials') ||
        errorMessage.includes('invalid email or password') ||
        error.status === 400
      ) {
        return { 
          success: false, 
          error: error.message,
          errorType: 'credentials' as const
        }
      }
      
      // Other errors
      return { 
        success: false, 
        error: error.message,
        errorType: 'unknown' as const
      }
    }

    if (data.user) {
      return { success: true, userId: data.user.id }
    }

    return { success: false, error: 'Unknown error occurred', errorType: 'unknown' as const }
  } catch (error) {
    console.error('Sign in error:', error)
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { 
        success: false, 
        error: 'Koneksi internet bermasalah. Periksa koneksi Anda.',
        errorType: 'network' as const
      }
    }
    
    return { 
      success: false, 
      error: 'Terjadi kesalahan yang tidak terduga',
      errorType: 'unknown' as const
    }
  }
}

// Sign out function
export async function signOut() {
  try {
    await supabase.auth.signOut()
    return { success: true }
  } catch (error) {
    console.error('Sign out error:', error)
    return { success: false, error: 'Failed to sign out' }
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      // Fetch user data from our users table
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      return userData
    }
    
    return null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Helper function to generate referral code
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
