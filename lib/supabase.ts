import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Reuse singleton client for metadata/utility queries outside generated Database typing.
const supabaseLoose = supabase as any

type InformationSchemaTable = {
  table_name: string
  table_type: string
}

type InformationSchemaColumnsMap = Record<string, unknown[]>

// Schema extraction function
export async function extractDatabaseSchema() {
  try {
    console.log('Extracting database schema...')

    const { data: tableRows, error: tablesError } = await supabaseLoose
      .from('information_schema.tables')
      .select('table_name, table_type')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE')

    if (tablesError) {
      console.error('Error fetching tables:', tablesError)
      return null
    }

    const tables = (tableRows ?? []) as InformationSchemaTable[]
    console.log(
      'Found tables:',
      tables.map((table) => table.table_name),
    )

    const schema: InformationSchemaColumnsMap = {}

    for (const table of tables) {
      const { data: columns, error: columnsError } = await supabaseLoose
        .from('information_schema.columns')
        .select('*')
        .eq('table_schema', 'public')
        .eq('table_name', table.table_name)
        .order('ordinal_position')

      if (columnsError) {
        console.error(`Error fetching columns for ${table.table_name}:`, columnsError)
      } else {
        schema[table.table_name] = columns ?? []
      }
    }

    console.log('Schema extraction completed')
    return schema
  } catch (error) {
    console.error('Schema extraction failed:', error)
    return null
  }
}

// Test database connection
export async function testConnection() {
  try {
    console.log('Testing Supabase connection...')

    const { error } = await supabase.from('users').select('count').limit(1)

    if (error) {
      console.error('Connection test failed:', error)
      return false
    }

    console.log('Connection test successful')
    return true
  } catch (error) {
    console.error('Connection test failed:', error)
    return false
  }
}
