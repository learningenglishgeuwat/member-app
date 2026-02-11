import { supabase } from './supabase'
import type { User, UserInsert } from '@/types/database'

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
      const { error: userError } = await supabase
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
        } as any)

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
    const timeoutMs = 12000
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Sign in timeout')), timeoutMs)
    )

    const signInPromise = supabase.auth.signInWithPassword({
      email,
      password,
    })

    const { data, error } = await Promise.race([signInPromise, timeoutPromise]) as Awaited<typeof signInPromise>

    if (error) {
      return { success: false, error: error.message }
    }

    if (data.user) {
      return { success: true, userId: data.user.id }
    }

    return { success: false, error: 'Unknown error occurred' }
  } catch (error) {
    if (error instanceof Error && error.message === 'Sign in timeout') {
      return { success: false, error: 'Koneksi lambat. Silakan coba lagi.' }
    }
    console.error('Sign in error:', error)
    return { success: false, error: 'An unexpected error occurred' }
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
