/* Admin page for volunteers: sign in, find a match (search + filters), enter the final result.
   Group matches: one set. Quarterfinals, semifinals and finals: one set or best of three,
   chosen per match. Everything saves to the database and shows live for everyone. */
(function () {
  "use strict";
  const api = window.IGBS;
  const app = document.getElementById("app");
  const connEl = document.getElementById("conn");
  const outBtn = document.getElementById("signout");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad2 = (n) => String(n).padStart(2, "0");
  const LABELS = { posOf: (g, p) => `${g} place ${p}`, winnerOf: (id) => `Winner of ${id}` };
  const STAGE = { G: "Group", QF: "Quarterfinal", SF: "Semifinal", F: "Final" };
  const isKO = (m) => m.stage !== "G";
  const ALL = api.MATCHES.slice().sort((a, b) => api.toMin(a.time) - api.toMin(b.time) || a.court - b.court);
  const TIMES = [...new Set(ALL.map((m) => m.time))];
  const DEFAULTS = { q: "", stage: "all", level: "all", court: "all", time: "all", status: "pending" };
  const state = { user: null, ...DEFAULTS, open: null, kept: null, mode: {}, draft: {}, notes: {}, confirm: {} };

  const side = (m, k) => {
    const r = api.resolveSide(m[k], LABELS);
    return r.team
      ? { code: r.team, name: TEAMS[r.team].short, players: TEAMS[r.team].players.join(" / "), known: true }
      : { code: "", name: r.label, players: "", known: false };
  };
  const ready = (m) => side(m, "a").known && side(m, "b").known;

  /* ---------- connection light ---------- */
  function setConn() {
    const c = api.connection;
    connEl.className = "conn " + (c === "online" ? "online" : c === "offline" ? "offline" : "");
    connEl.textContent = c === "online" ? "Connected" : c === "offline" ? "Offline, retrying" : c === "connecting" ? "Connecting" : "Not connected";
  }
  api.onConnection = setConn;

  /* ---------- search + filters ---------- */
  function haystack(m) {
    const A = side(m, "a"), B = side(m, "b");
    return [m.id, m.time, `court ${m.court + 2}`, m.group || STAGE[m.stage], A.code, A.name, A.players, B.code, B.name, B.players]
      .filter(Boolean).join(" ").toLowerCase();
  }
  function matches() {
    const q = state.q.trim().toLowerCase();
    const numeric = /^\d{1,2}$/.test(q) ? "m" + pad2(q) : null;       /* "5" or "05" finds M05 */
    return ALL.filter((m) => {
      if (state.stage !== "all" && m.stage !== state.stage) return false;
      if (state.level !== "all" && String(m.level) !== state.level) return false;
      if (state.court !== "all" && String(m.court) !== state.court) return false;
      if (state.time !== "all" && m.time !== state.time) return false;
      const done = api.isDone(m.id);
      if (!q) {                                  /* a search always finds the match, saved or not */
        if (m.id !== state.kept) {
          if (state.status === "ready" && (done || !ready(m))) return false;
          if (state.status === "pending" && done) return false;
        }
        if (state.status === "saved" && !done) return false;
      }
      if (q) {
        if (numeric) return m.id.toLowerCase() === numeric;
        return q.split(/\s+/).every((w) => haystack(m).includes(w));
      }
      return true;
    });
  }

  /* ---------- screens ---------- */
  function showMessage(title, body) {
    app.innerHTML = `<section class="card"><h1>${esc(title)}</h1><p>${body}</p></section>`;
  }

  function showLogin(msg) {
    app.innerHTML = `
      <section class="card">
        <h1>Sign in</h1>
        <p>Only the tournament team can enter results.</p>
        <form id="login" autocomplete="on">
          <label>Email <input type="email" name="email" autocomplete="username" required></label>
          <label>Password <input type="password" name="password" autocomplete="current-password" required></label>
          <button class="primary" type="submit">Sign in</button>
          <p class="msg ${msg ? "err" : ""}" id="login-msg" role="alert">${esc(msg || "")}</p>
        </form>
      </section>`;
    document.getElementById("login").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target, btn = f.querySelector("button"), out = document.getElementById("login-msg");
      btn.disabled = true; out.className = "msg"; out.textContent = "Signing in…";
      const { error } = await api.client.auth.signInWithPassword({ email: f.email.value.trim(), password: f.password.value });
      if (error) { out.className = "msg err"; out.textContent = "Wrong email or password. Check both and try again."; btn.disabled = false; return; }
      boot();
    });
  }

  const opts = (list, cur) => list.map(([v, t]) => `<option value="${v}" ${v === cur ? "selected" : ""}>${esc(t)}</option>`).join("");

  function showAdmin() {
    app.innerHTML = `
      <section class="tools">
        <input type="search" id="q" placeholder="Search: match no. (12), team (2K), player" value="${esc(state.q)}" aria-label="Search matches" autocomplete="off" enterkeyhint="search">
        <details class="fil" ${Object.keys(DEFAULTS).some((k) => k !== "q" && state[k] !== DEFAULTS[k]) ? "open" : ""}>
        <summary>Filters</summary>
        <div class="filters">
          <label>Status<select data-f="status">${opts([["pending", "Not saved yet"], ["ready", "Ready to enter"], ["saved", "Saved"], ["all", "All"]], state.status)}</select></label>
          <label>Stage<select data-f="stage">${opts([["all", "All stages"], ["G", "Group"], ["QF", "Quarterfinal"], ["SF", "Semifinal"], ["F", "Final"]], state.stage)}</select></label>
          <label>Level<select data-f="level">${opts([["all", "Both levels"], ["1", "Level 1"], ["2", "Level 2"]], state.level)}</select></label>
          <label>Court<select data-f="court">${opts([["all", "All courts"], ["1", "Court 3"], ["2", "Court 4"], ["3", "Court 5"], ["4", "Court 6"]], state.court)}</select></label>
          <label class="wide">Time<select data-f="time">${opts([["all", "All times"], ...TIMES.map((t) => [t, t])], state.time)}</select></label>
        </div></details>
        <div class="tools-row"><span id="count" role="status"></span><button type="button" class="link" data-act="reset">Reset filters</button></div>
      </section>
      <div id="list"></div>
      <p class="help">Find the match, tap it, enter the points and press Save. The public site updates within a second or two. Standings and knockout line-ups fill in by themselves.</p>`;
    renderList();
  }

  /* ---------- the list ---------- */
  function resText(m) {
    const r = api.result(m.id);
    if (!r) return "";
    const sets = api.SETS[m.id];
    return isKO(m) && sets && sets.length ? `${r.a}–${r.b}` : `${r.a}–${r.b}`;
  }

  function panel(m) {
    const A = side(m, "a"), B = side(m, "b"), r = api.result(m.id), note = state.notes[m.id];
    if (!(A.known && B.known)) return `<div class="panel"><p class="tbd-note">Waiting for the teams to be decided.</p></div>`;
    const ko = isKO(m);
    const saved = ko ? (api.SETS[m.id] || []) : r ? [[r.a, r.b]] : [];
    const mode = ko ? (state.mode[m.id] || (saved.length === 1 ? "single" : saved.length > 1 ? "best3" : m.stage === "QF" ? "single" : "best3")) : "single";
    const rows = mode === "single" ? 1 : 3;
    const d = state.draft[m.id];
    const val = (i, k) => (d && d[i] ? d[i][k] : saved[i] ? String(saved[i][k]) : "");
    const head = (S) => `<span class="tn">${esc(S.name)}${S.known && S.players ? `<small>${esc(S.code)}  ${esc(S.players)}</small>` : ""}</span>`;
    let body = "";
    for (let i = 0; i < rows; i++) {
      const label = ko ? (mode === "best3" && i === 2 ? "Set 3 (if 1–1)" : `Set ${i + 1}`) : "Points";
      body += `<div class="set-row" data-n="${i}"><span class="sl">${label}</span>
        <input type="number" inputmode="numeric" min="0" max="99" data-k="0" aria-label="${label}: points for ${esc(A.name)}" value="${esc(val(i, 0))}" placeholder="0">
        <input type="number" inputmode="numeric" min="0" max="99" data-k="1" aria-label="${label}: points for ${esc(B.name)}" value="${esc(val(i, 1))}" placeholder="0"></div>`;
    }
    return `<div class="panel">
      ${ko ? `<div class="mode" role="group" aria-label="Number of sets">
        <button type="button" data-act="mode" data-mode="single" aria-pressed="${mode === "single"}">One set</button>
        <button type="button" data-act="mode" data-mode="best3" aria-pressed="${mode === "best3"}">Best of 3 sets</button></div>` : ""}
      <div class="sc-table"><div class="sc-head"><span></span>${head(A)}${head(B)}</div>${body}</div>
      <div class="m-actions">
        <button type="button" class="final" data-act="save">${r ? "Update result" : "Save result"}</button>
        <button type="button" class="clear" data-act="clear" ${r ? "" : "disabled"}>Clear</button>
        ${note ? `<p class="m-note ${note.kind}" role="status">${esc(note.text)}</p>` : ""}
      </div></div>`;
  }

  function row(m) {
    const A = side(m, "a"), B = side(m, "b"), r = api.result(m.id), open = state.open === m.id;
    const sets = api.SETS[m.id];
    const setTxt = isKO(m) && sets && sets.length > 1 ? sets.map((s) => `${s[0]}–${s[1]}`).join(", ") : "";
    return `
      <article class="m ${r ? "done" : ""} ${open ? "open" : ""}" data-id="${m.id}">
        <button type="button" class="m-sum" data-act="toggle" aria-expanded="${open}">
          <span class="no">${m.id}</span>
          <span class="when">${m.time}  Court ${m.court + 2}  ${m.group || STAGE[m.stage] + " L" + m.level}</span>
          <span class="teams"><b>${esc(A.name)}</b> v <b>${esc(B.name)}</b></span>
          <span class="res">${r ? `<b>${resText(m)}</b>${setTxt ? `<small>${setTxt}</small>` : ""}` : ""}</span>
          <span class="state">${r ? "Saved" : ready(m) ? "Open" : "Waiting"}</span>
        </button>
        ${open ? panel(m) : ""}
      </article>`;
  }

  function renderList() {
    const list = matches();
    if (state.q.trim() && list.length === 1 && state.open !== list[0].id) state.open = list[0].id;
    const saved = ALL.filter((m) => api.isDone(m.id)).length;
    document.getElementById("count").textContent = `${list.length} of ${ALL.length} matches · ${saved} saved`;
    document.getElementById("list").innerHTML = list.length
      ? list.map(row).join("")
      : `<p class="empty">No matches found. Check the spelling or press Reset filters.</p>`;
  }

  /* ---------- reading the inputs ---------- */
  const readRows = (card) => [...card.querySelectorAll(".set-row")].map((r) => [...r.querySelectorAll("input")].map((i) => i.value.trim()));
  function keepDraft(card) { state.draft[card.dataset.id] = readRows(card); }

  function parse(m, card) {
    const mode = isKO(m) ? (state.mode[m.id] || null) : "single";
    const rows = readRows(card);
    const sets = [];
    let gap = false;
    for (let i = 0; i < rows.length; i++) {
      const [a, b] = rows[i];
      if (a === "" && b === "") { gap = true; continue; }
      if (a === "" || b === "") return { error: `${rows.length > 1 ? "Set " + (i + 1) + ": e" : "E"}nter the points for both sides.` };
      if (gap) return { error: "Fill the sets in order, without leaving one empty." };
      sets.push([Math.min(99, parseInt(a, 10)), Math.min(99, parseInt(b, 10))]);
    }
    if (!sets.length) return { error: "Enter the points first." };
    for (let i = 0; i < sets.length; i++) if (sets[i][0] === sets[i][1]) return { error: `${sets.length > 1 ? "Set " + (i + 1) + " cannot" : "A set cannot"} end level. Check the points.` };
    let wa = 0, wb = 0;
    const oddScore = sets.some((s) => !validSet(s[0], s[1]));
    if (!isKO(m)) return { sets, wa: sets[0][0], wb: sets[0][1], odd: oddScore, plain: true };
    const single = rows.length === 1;
    if (single) {
      sets[0][0] > sets[0][1] ? wa++ : wb++;
      return { sets, wa, wb, odd: oddScore };
    }
    if (sets.length < 2) return { error: "Best of 3 needs at least 2 sets. Enter set 2, or switch to One set." };
    for (let i = 0; i < sets.length; i++) {
      if (wa === 2 || wb === 2) return { error: `Set ${i + 1} is not needed: the match was already decided 2–0.` };
      sets[i][0] > sets[i][1] ? wa++ : wb++;
    }
    if (wa < 2 && wb < 2) return { error: "The sets are level at 1–1. Enter set 3." };
    return { sets, wa, wb, odd: oddScore };
  }

  /* one set: 15 with a 2-point lead from 14-14, capped at 21 */
  function validSet(a, b) {
    const w = Math.max(a, b), l = Math.min(a, b);
    return (w === 15 && l <= 13) || (w > 15 && w <= 20 && w - l === 2) || (w === 21 && l >= 19 && l <= 20);
  }

  /* ---------- saving ---------- */
  const note = (id, kind, text) => { state.notes[id] = { kind, text }; };
  const now = () => new Date().toISOString();

  async function save(m, p) {
    const id = m.id, before = api.result(id) ? { ...api.result(id) } : null, beforeSets = api.SETS[id] ? api.SETS[id].map((s) => [...s]) : null;
    const rows = [{ match_id: id, a: p.wa, b: p.wb, status: "done", updated_at: now() }];
    if (!p.plain) p.sets.forEach((s, i) => rows.push({ match_id: `${id}#${i + 1}`, a: s[0], b: s[1], status: "done", updated_at: now() }));
    RESULTS[id] = { a: p.wa, b: p.wb, status: "done" };
    if (!p.plain) api.SETS[id] = p.sets;
    api.emit();
    let { error } = await api.client.from("results").upsert(rows);
    if (!error && !p.plain) {
      const extra = []; for (let n = p.sets.length + 1; n <= 3; n++) extra.push(`${id}#${n}`);
      if (extra.length) ({ error } = await api.client.from("results").delete().in("match_id", extra));
    }
    if (error) {
      if (before) RESULTS[id] = before; else delete RESULTS[id];
      if (beforeSets) api.SETS[id] = beforeSets; else delete api.SETS[id];
      note(id, "err", "Not saved. Check your connection and the sign-in, then try again.");
      api.emit(); renderList(); return;
    }
    delete state.draft[id]; delete state.confirm[id];
    note(id, "ok", "Saved"); state.kept = id; state.open = null;
    api.emit(); renderList();
  }

  async function clearResult(m) {
    const id = m.id, before = { ...api.result(id) }, beforeSets = api.SETS[id];
    delete RESULTS[id]; delete api.SETS[id]; api.emit();
    const { error } = await api.client.from("results").delete().in("match_id", [id, `${id}#1`, `${id}#2`, `${id}#3`]);
    if (error) { RESULTS[id] = before; if (beforeSets) api.SETS[id] = beforeSets; note(id, "err", "Not cleared. Check your connection and try again."); }
    else { delete state.draft[id]; note(id, "ok", "Cleared"); state.kept = id; }
    api.emit(); renderList();
  }

  /* ---------- events ---------- */
  app.addEventListener("input", (e) => {
    if (e.target.id === "q") { state.q = e.target.value; state.kept = null; renderList(); return; }
    const card = e.target.closest(".m");
    if (card && e.target.matches(".set-row input")) keepDraft(card);
  });

  app.addEventListener("change", (e) => {
    const f = e.target.dataset && e.target.dataset.f;
    if (f) { state[f] = e.target.value; state.kept = null; state.open = null; renderList(); }
  });

  app.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const act = btn.dataset.act;
    if (act === "reset") { Object.assign(state, DEFAULTS, { kept: null, open: null }); showAdmin(); return; }
    const card = btn.closest(".m");
    if (!card) return;
    const m = api.matchById[card.dataset.id], id = m.id;
    if (act === "toggle") { state.open = state.open === id ? null : id; delete state.notes[id]; renderList(); return; }
    if (act === "mode") { keepDraft(card); state.mode[id] = btn.dataset.mode; renderList(); return; }
    delete state.notes[id];
    if (act === "clear") { await clearResult(m); return; }
    if (act === "save") {
      const p = parse(m, card);
      if (p.error) { note(id, "err", p.error); keepDraft(card); renderList(); return; }
      const key = id + JSON.stringify(p.sets);
      if (p.odd && state.confirm[id] !== key) {
        state.confirm[id] = key; keepDraft(card);
        note(id, "err", "This is not a normal finish (15 points with 2 clear, or 21 at 20-20). Tap Save again to keep it anyway.");
        renderList(); return;
      }
      await save(m, p);
    }
  });

  /* live changes from other volunteers: refresh the list, unless someone is typing in it */
  api.onResults(() => {
    if (!state.user || !document.getElementById("list")) return;
    const a = document.activeElement;
    if (a && a.tagName === "INPUT" && a.closest("#list")) return;
    renderList();
  });

  outBtn.addEventListener("click", async () => { await api.client.auth.signOut(); state.user = null; boot(); });

  async function boot() {
    setConn();
    if (!api.configured) {
      outBtn.hidden = true;
      return showMessage("Database not connected", "The live results database is not set up yet. Add its address and key to <code>config.js</code> to turn this page on.");
    }
    const client = await api.ready;
    if (!client) return showMessage("Cannot reach the database", "Check your internet connection and reload this page.");
    const { data } = await client.auth.getSession();
    state.user = data && data.session ? data.session.user : null;
    outBtn.hidden = !state.user;
    if (!state.user) return showLogin();
    showAdmin();
  }
  boot();
})();
