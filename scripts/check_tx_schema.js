const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkTable() {
    console.log('Checking transactions table structure...');

    // Method 1: Select one row to see keys
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .limit(1);

    if (error) {
        console.log('Error selecting:', error);
    } else if (data && data.length > 0) {
        console.log('Columns found in first row:', Object.keys(data[0]));
        console.log('Sample Row:', data[0]);
    } else {
        console.log('Table is empty or not found. Trying to insert a dummy to see error or success (dry run).');
    }
}

checkTable();
