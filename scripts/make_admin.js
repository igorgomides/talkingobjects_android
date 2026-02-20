const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function updateAdmin(email) {
    console.log(`Updating user: ${email}`);

    // 1. Get User ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        console.log('User not found.');
        return;
    }

    // 2. Update Profile to Admin and Set Name
    const { error } = await supabase
        .from('profiles')
        .update({
            role: 'admin',
            full_name: 'Igor Gomides' // Setting a default name
        })
        .eq('id', user.id);

    if (error) {
        console.log('Error updating profile:', error);
    } else {
        console.log('✅ User updated to ADMIN and Name set!');
    }
}

updateAdmin('igor.sgomides@gmail.com');
