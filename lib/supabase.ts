import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Schema extraction function
export async function extractDatabaseSchema() {
  try {
    console.log('🔍 Extracting database schema...')
    
    // Get all tables
    const { data: tables, error: tablesError } = await (supabase as any)
      .from('information_schema.tables')
      .select('table_name, table_type')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE')
    
    if (tablesError) {
      console.error('❌ Error fetching tables:', tablesError)
      return null
    }
    
    console.log('📋 Found tables:', (tables as Array<{ table_name: string }> | null)?.map(t => t.table_name))
    
    // Get column information for each table
    const schema = {}
    
    for (const table of tables || []) {
      const { data: columns, error: columnsError } = await (supabase as any)
        .from('information_schema.columns')
        .select('*')
        .eq('table_schema', 'public')
        .eq('table_name', table.table_name)
        .order('ordinal_position')
      
      if (columnsError) {
        console.error(`❌ Error fetching columns for ${table.table_name}:`, columnsError)
      } else {
        ;(schema as Record<string, unknown[]>)[table.table_name] = columns
      }
    }
    
    console.log('✅ Schema extraction completed')
    return schema
    
  } catch (error) {
    console.error('❌ Schema extraction failed:', error)
    return null
  }
}

// Test database connection
export async function testConnection() {
  try {
    console.log('🔌 Testing Supabase connection...')
    
    // Simple test query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection test failed:', error)
      return false
    }
    
    console.log('✅ Connection test successful')
    return true
    
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return false
  }
}
