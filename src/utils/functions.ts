import { supabase } from "../config/supabase";

export  async function handleSignOut() {
    console.log('hola')
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error);
    } else {
        console.log('Logout successful');
    }
}
