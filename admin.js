/* Admin page: sign in, then enter the final points of each finished match. */
(function () {
  "use strict";
  const api = window.IGBS;
  const app = document.getElementById("app");
  const connEl = document.getElementById("conn");
  const outBtn = document.getElementById("signout");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const LABELS = { posOf: (g, p) => `${g} place ${p}`, winnerOf: (id) => `Winner of ${id}` };
  const PLAYSLOTS = api.SLOTS.map((s, i) => ({ s, i })).filter((x) => x.s.matches.length);
  const RESULTS_DRAFT = {};
  const state = { user: null, slot: null, notes: {}, confirm: {} };

  const side = (m, k) => {
    const r = api.resolveSide(m[k], LABELS);
    return r.team ? { code: r.team, name: TEAMS[r.team].short, players: TEAMS[r.team].players.join(" / "), known: true } : { name: r.label, known: false };
  };
  const slotLabel = (s) => `${s.time}  ${s.round ? "Round " + s.round : [...new Set(s.matches.map((m) => ({ QF: "Quarterfinals", SF: "Semifinals", F: "Finals" }[m.stage])))].join(", ")}`;

  /* the slot that needs attention first: first one with an unfinished match */
  function defaultSlot() {
    const open = PLAYSLOTS.findIndex((x) => x.s.matches.some((m) => !api.isDone(m.id)));
    return open >= 0 ? open : PLAYSLOTS.length - 1;
  }

  function setConn() {
    const c = api.connection;
    connEl.className = "conn " + (c === "online" ? "online" : c === "offline" ? "offline" : "");
    connEl.textContent = c === "online" ? "Connected" : c === "offline" ? "Offline, retrying" : c === "connecting" ? "Connecting" : "Not connected";
  }
  api.onConnection = setConn;

  /* ---------- screens ---------- */
  function showMessage(title, body) {
    app.innerHTML = `<section class="card"><h1>${esc(title)}</h1><p>${body}</p></section>`;
  }

  function showLogin(msg) {
    app.innerHTML = `
      <section class="card">
        <h1>Sign in</h1>
        <p>Only the tournament admin can enter results.</p>
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

  function matchCard(m) {
    const A = side(m, "a"), B = side(m, "b"), r = api.result(m.id);
    const ready = A.known && B.known;
    const done = !!r;
    const note = state.notes[m.id];
    const tag = m.stage === "G" ? m.group : `${{ QF: "Quarterfinal", SF: "Semifinal", F: "Final" }[m.stage]}, Level ${m.level}`;
    const row = (S, k) => `
      <div class="side-row ${S.known ? "" : "tbd"}">
        <div class="nm">${esc(S.name)}${S.known ? `<small>${S.code}  ${esc(S.players)}</small>` : ""}</div>
        <div class="score-ctl">
          <input type="number" inputmode="numeric" min="0" max="99" data-k="${k}" aria-label="Points for ${esc(S.name)}" value="${RESULTS_DRAFT[m.id] ? RESULTS_DRAFT[m.id][k] : done ? r[k] : ""}" placeholder="0" ${ready ? "" : "disabled"}>
        </div>
      </div>`;
    return `
      <article class="m ${done ? "done" : ""}" data-id="${m.id}">
        <div class="m-head"><span class="court">Court ${m.court}</span><span class="id">${m.id}  ${esc(tag)}</span>
          <span class="state">${done ? "Saved" : "No result"}</span></div>
        ${row(A, "a")}${row(B, "b")}
        ${ready ? `<div class="m-actions">
          <button type="button" class="final" data-act="save">${done ? "Update result" : "Save result"}</button>
          <button type="button" class="clear" data-act="clear" ${done ? "" : "disabled"}>Clear</button>
          ${note ? `<p class="m-note ${note.kind}" role="status">${esc(note.text)}</p>` : ""}
        </div>` : `<p class="tbd-note">Waiting for the teams to be decided.</p>`}
      </article>`;
  }

  function showAdmin() {
    if (state.slot === null) state.slot = defaultSlot();
    const cur = PLAYSLOTS[state.slot];
    app.innerHTML = `
      <div class="nav">
        <button type="button" class="step" data-nav="-1" aria-label="Earlier time" ${state.slot === 0 ? "disabled" : ""}><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
        <select id="slot-pick" aria-label="Time">${PLAYSLOTS.map((x, j) => `<option value="${j}" ${j === state.slot ? "selected" : ""}>${esc(slotLabel(x.s))}</option>`).join("")}</select>
        <button type="button" class="step" data-nav="1" aria-label="Later time" ${state.slot === PLAYSLOTS.length - 1 ? "disabled" : ""}><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
      </div>
      ${[...cur.s.matches].sort((a, b) => a.court - b.court).map(matchCard).join("")}
      <p class="help">Enter both teams' points when a match is over and press Save result. The public site updates within a second or two. Standings and knockout line-ups fill in by themselves.</p>`;
  }

  /* ---------- saving ---------- */
  function note(id, kind, text) { state.notes[id] = { kind, text }; }

  async function save(id, a, b, status) {
    const before = api.result(id) ? { ...api.result(id) } : null;
    RESULTS[id] = { a, b, status };                         /* show the change at once */
    api.emit(); showAdmin();
    const { error } = await api.client.from("results").upsert({ match_id: id, a, b, status, updated_at: new Date().toISOString() });
    if (error) {
      if (before) RESULTS[id] = before; else delete RESULTS[id];
      note(id, "err", "Not saved. Check your connection and the sign-in, then try again.");
      api.emit(); showAdmin(); return false;
    }
    note(id, "ok", "Saved"); showAdmin(); return true;
  }

  async function clearResult(id) {
    const before = { ...api.result(id) };
    delete RESULTS[id]; api.emit(); showAdmin();
    const { error } = await api.client.from("results").delete().eq("match_id", id);
    if (error) { RESULTS[id] = before; note(id, "err", "Not cleared. Check your connection and try again."); api.emit(); }
    else note(id, "ok", "Cleared");
    showAdmin();
  }

  const validFinal = (a, b) => Math.max(a, b) >= 15 && Math.abs(a - b) >= 2;

  app.addEventListener("click", async (e) => {
    const nav = e.target.closest("[data-nav]");
    if (nav) { state.slot = Math.max(0, Math.min(PLAYSLOTS.length - 1, state.slot + Number(nav.dataset.nav))); showAdmin(); return; }
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const card = btn.closest(".m"); if (!card) return;
    const id = card.dataset.id, act = btn.dataset.act;
    delete state.notes[id];
    if (act === "save") {
      const [ia, ib] = card.querySelectorAll("input");
      if (ia.value === "" || ib.value === "") { note(id, "err", "Enter the points for both sides."); showAdmin(); return; }
      const a = Math.max(0, Math.min(99, parseInt(ia.value, 10))), b = Math.max(0, Math.min(99, parseInt(ib.value, 10)));
      if (a === b) { note(id, "err", "A match cannot end level. Check the points."); showAdmin(); return; }
      if (!validFinal(a, b) && state.confirm[id] !== `${a}:${b}`) {
        state.confirm[id] = `${a}:${b}`;
        note(id, "err", `${a} : ${b} is not a normal finish (15 points, 2 clear). Tap Save again to keep it anyway.`);
        RESULTS_DRAFT[id] = { a, b }; showAdmin(); return;
      }
      delete state.confirm[id]; delete RESULTS_DRAFT[id];
      await save(id, a, b, "done");
    } else if (act === "clear") {
      await clearResult(id);
    }
  });

  app.addEventListener("change", (e) => {
    if (e.target.id === "slot-pick") { state.slot = Number(e.target.value); showAdmin(); }
  });

  /* when results change elsewhere (or on first load) redraw, unless someone is typing */
  api.onResults(() => { if (state.user && !(document.activeElement && document.activeElement.tagName === "INPUT")) showAdmin(); });

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
    state.slot = null; showAdmin();
  }
  boot();
})();
