/* Live results: loads results from Supabase and keeps them fresh.
   Without a configured database the site simply shows no results. */
(function () {
  "use strict";
  const api = window.IGBS, cfg = window.IGBS_CONFIG || {};
  api.configured = !!(cfg.supabaseUrl && cfg.supabaseAnonKey);
  api.connection = api.configured ? "connecting" : "off";

  function apply(rows) {
    const next = {};
    rows.forEach((r) => { next[r.match_id] = { a: r.a, b: r.b, status: r.status }; });
    if (JSON.stringify(next) === JSON.stringify(RESULTS)) return;
    Object.keys(RESULTS).forEach((k) => delete RESULTS[k]);
    Object.assign(RESULTS, next);
    api.emit();
  }

  async function load() {
    try {
      const { data, error } = await api.client.from("results").select("match_id,a,b,status");
      if (error) throw error;
      api.connection = "online";
      apply(data);
    } catch (e) {
      api.connection = "offline";
    }
    if (api.onConnection) api.onConnection(api.connection);
  }
  api.reload = load;

  function start() {
    api.client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
    api._resolveReady(api.client);
    load();
    api.client.channel("results-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "results" }, load)
      .subscribe();
    setInterval(load, 15000);                       /* safety net if the live link drops */
    document.addEventListener("visibilitychange", () => { if (!document.hidden) load(); });
    window.addEventListener("online", load);
  }

  if (!api.configured) { api._resolveReady(null); return; }
  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
  s.onload = start;
  s.onerror = () => { api.connection = "offline"; api._resolveReady(null); };
  document.head.appendChild(s);
})();
