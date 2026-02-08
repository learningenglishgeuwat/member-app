import { supabase } from './supabase'
import type { User, UserUpdate } from '@/types/database'

// Get user profile
export async function getUserProfile(userId: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return { user: null, error: error.message }
    }

    return { user: data, error: null }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { user: null, error: 'An unexpected error occurred' }
  }
}

// Update user profile
export async function updateUserProfile(userId: string, updates: UserUpdate): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data, error } = await (supabase as any)
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      return { user: null, error: error.message }
    }

    return { user: data, error: null }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { user: null, error: 'An unexpected error occurred' }
  }
}

// Update user password (through Supabase Auth)
export async function updateUserPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      console.error('Error updating password:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Check if user can login based on status
export function canUserLogin(status: string): boolean {
  const allowedStatuses = ['active', 'paid', 'unpaid']
  return allowedStatuses.includes(status.toLowerCase())
}
