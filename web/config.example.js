/* Copy this file to config.js and add only the Supabase project URL and anon/public key.
   Never place a service_role/secret key in browser JavaScript. */
window.GN_CONFIG = {
  mode: 'cloud',
  supabaseUrl: '', // e.g. https://YOUR-PROJECT-REF.supabase.co
  supabaseAnonKey: '', // public/anon key only
  schemaV2: true,
  schemaV3: false, // true only after applying supabase/migrations/*_add_entry_behavior_details.sql
  privacyContact: ''
};
