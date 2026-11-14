/* Connection to the live results database (Supabase).
   Both values are public by design: the database only lets the public READ results,
   and only the signed-in admin can write. Leave empty to run the site without live data. */
window.IGBS_CONFIG = {
  supabaseUrl: "https://fsnxtntxmbbbftnhxmwz.supabase.co",
  supabaseAnonKey: "sb_publishable_9M3DMJxCn_QZLCh9bvlhRw_rhfdHosg",
};
