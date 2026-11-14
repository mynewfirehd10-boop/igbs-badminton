/* Admin page: sign in, then enter live and final scores. Every tap saves straight to the database. */
(function () {
  "use strict";
  const api = window.IGBS;
  const app = document.getElementById("app");
  const connEl = document.getElementById("conn");
  const outBtn = document.getElementById("signout");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const LABELS = { posOf: (g, p) => `${g} place ${p}`, winnerOf: (id) => `Winner of ${id}` };
  const PLAYSLOTS = api.SLOTS.map((s, i) => ({ s, i })).filter((x) => x.s.matches.length);
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
    const st = r ? r.status : "none";
    const note = state.notes[m.id];
    const tag = m.stage === "G" ? m.group : `${{ QF: "Quarterfinal", SF: "Semifinal", F: "Final" }[m.stage]}, Level ${m.level}`;
    const row = (S, k) => `
      <div class="side-row ${S.known ? "" : "tbd"}">
        <div class="nm">${esc(S.name)}${S.known ? `<small>${S.code}  ${esc(S.players)}</small>` : ""}</div>
        <div class="score-ctl">
          <button type="button" data-act="dec" data-k="${k}" aria-label="One point less for ${esc(S.name)}" ${ready && r ? "" : "disabled"}>−</button>
          <input type="number" inputmode="numeric" min="0" max="99" data-act="set" data-k="${k}" aria-label="Points for ${esc(S.name)}" value="${r ? r[k] : ""}" placeholder="0" ${ready ? "" : "disabled"}>
          <button type="button" class="plus" data-act="inc" data-k="${k}" aria-label="One point more for ${esc(S.name)}" ${ready ? "" : "disabled"}>+</button>
        </div>
      </div>`;
    return `
      <article class="m ${st === "live" ? "live" : st === "done" ? "done" : ""}" data-id="${m.id}">
        <div class="m-head"><span class="court">Court ${m.court}</span><span class="id">${m.id}  ${esc(tag)}</span>
          <span class="state">${st === "live" ? "Live" : st === "done" ? "Final" : "Not started"}</span></div>
        ${row(A, "a")}${row(B, "b")}
        ${ready ? `<div class="m-actions">
          <button type="button" data-act="live" ${st === "live" ? "disabled" : ""}>${st === "done" ? "Reopen as live" : "Start match"}</button>
          <button type="button" class="final" data-act="final" ${st === "done" ? "disabled" : ""}>Final result</button>
          <button type="button" class="clear" data-act="clear" ${r ? "" : "disabled"}>Clear</button>
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
      <p class="help">Tap + for each point and the public site updates within a second or two. Press Final result when the match is over. Standings and knockout line-ups fill in by themselves.</p>`;
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
    const id = card.dataset.id, act = btn.dataset.act, k = btn.dataset.k;
    const r = api.result(id) || { a: 0, b: 0, status: "live" };
    delete state.notes[id];
    if (act === "inc" || act === "dec") {
      const next = { a: r.a, b: r.b }; next[k] = Math.max(0, next[k] + (act === "inc" ? 1 : -1));
      delete state.confirm[id];
      await save(id, next.a, next.b, r.status === "done" ? "done" : "live");
    } else if (act === "live") {
      await save(id, r.a, r.b, "live");
    } else if (act === "final") {
      if (!validFinal(r.a, r.b) && !state.confirm[id]) {
        state.confirm[id] = true;
        note(id, "err", `${r.a} : ${r.b} is not a normal finish (15 points, 2 clear). Tap Final result again to save it anyway.`);
        showAdmin(); return;
      }
      delete state.confirm[id];
      await save(id, r.a, r.b, "done");
    } else if (act === "clear") {
      await clearResult(id);
    }
  });

  app.addEventListener("change", async (e) => {
    if (e.target.id === "slot-pick") { state.slot = Number(e.target.value); showAdmin(); return; }
    const inp = e.target.closest("input[data-act='set']"); if (!inp) return;
    const id = inp.closest(".m").dataset.id, k = inp.dataset.k;
    const r = api.result(id) || { a: 0, b: 0, status: "live" };
    const v = Math.max(0, Math.min(99, parseInt(inp.value, 10) || 0));
    const next = { a: r.a, b: r.b }; next[k] = v;
    delete state.notes[id]; delete state.confirm[id];
    await save(id, next.a, next.b, r.status === "done" ? "done" : "live");
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
