const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Error: Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkSchema() {
    // Try to select the new columns
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url')
        .limit(1);

    if (error) {
        console.error('Schema Check Failed:', error);
        if (error.code === 'PGRST100') { // Or similar schema error
            console.log('Use this command in SQL Editor to reload cache: NOTIFY pgrst, "reload config";');
        }
    } else {
        console.log('✅ Columns found! The API knows about full_name and avatar_url.');
        console.log('Sample Row:', data);
    }
}

checkSchema();
