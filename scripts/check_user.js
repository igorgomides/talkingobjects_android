const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkProfile(email) {
    console.log(`Checking profile for: ${email}`);

    // 1. Get User ID from Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email.toLowerCase().includes(email.toLowerCase()));

    if (!user) {
        console.log('User not found in Auth.');
        return;
    }

    console.log(`User ID: ${user.id}`);

    // 2. Get Profile
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        console.log('Error fetching profile:', error);
    } else {
        console.log('Profile Data:', profile);
    }
}

// Check for the user from previous context
checkProfile('igor'); 
