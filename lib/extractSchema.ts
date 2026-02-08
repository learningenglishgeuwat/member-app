import { supabase, extractDatabaseSchema, testConnection } from './supabase'

// Test connection and extract schema
async function main() {
  console.log('🚀 Starting Supabase integration...')
  
  // Test connection first
  const isConnected = await testConnection()
  if (!isConnected) {
    console.error('❌ Cannot connect to Supabase. Please check your environment variables.')
    return
  }
  
  // Extract schema
  const schema = await extractDatabaseSchema()
  if (schema) {
    const typedSchema = schema as Record<string, unknown[]>
    console.log('📊 Schema extraction successful!')
    
    // Log table information
    Object.keys(typedSchema).forEach(tableName => {
      console.log(`📋 Table: ${tableName}`)
      console.log(`   Columns: ${typedSchema[tableName]?.length || 0}`)
    })
  } else {
    console.error('❌ Schema extraction failed')
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error)
}

export { main }
