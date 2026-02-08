// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase connection...');
console.log('URL:', supabaseUrl ? 'Set' : 'Not set');
console.log('Key:', supabaseAnonKey ? 'Set' : 'Not set');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Environment variables not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Test by checking if we can access the users table
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connection successful!');
    
    // Test basic query to see if users table exists
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, fullname')
      .limit(5);
    
    if (usersError) {
      console.error('❌ Users table error:', usersError.message);
    } else {
      console.log(`📋 Found ${users.length} users in database`);
      if (users.length > 0) {
        console.log('👤 Sample user:', users[0]);
      }
    }
    
    // Test tiers table
    const { data: tiers, error: tiersError } = await supabase
      .from('tiers')
      .select('*')
      .limit(10);
    
    if (tiersError) {
      console.error('❌ Tiers table error:', tiersError.message);
    } else {
      console.log(`🏆 Found ${tiers.length} tiers in database`);
      tiers.forEach(tier => {
        console.log(`   - ${tier.tier_name}: ${tier.referral_bonus_percentage}% referral, ${tier.cashback_percentage}% cashback`);
      });
    }
    
    return true;
    
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    return false;
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
