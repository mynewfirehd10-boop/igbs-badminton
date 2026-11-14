/* IGBS Badminton 2026 — shared logic for the public site and the admin page.
   Builds the match list from data.js, works out standings and who plays in the knockouts. */
(function () {
  "use strict";
  const pad = (n) => String(n).padStart(2, "0");
  const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const fromMin = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
  const groupById = Object.fromEntries(GROUPS.map((g) => [g.id, g]));

  const MATCHES = [
    ...GROUP_MATCHES.map(([id, round, court, group, a, b]) => ({
      id, stage: "G", round, court, group, level: groupById[group].level,
      time: ROUND_TIMES[round - 1], a, b,
    })),
    ...KNOCKOUT.map((k) => ({ ...k })),
  ];
  const matchById = Object.fromEntries(MATCHES.map((m) => [m.id, m]));

  const SLOTS = [];
  MATCHES.forEach((m) => {
    let s = SLOTS.find((x) => x.time === m.time);
    if (!s) { s = { time: m.time, matches: [] }; SLOTS.push(s); }
    s.matches.push(m);
    if (m.stage === "G") s.round = m.round;
  });
  BREAKS.forEach((b) => SLOTS.push({ time: b.time, end: b.end, brk: b.key, matches: [] }));
  SLOTS.sort((a, b) => toMin(a.time) - toMin(b.time));
  const FIRST_PLAY = SLOTS.findIndex((s) => s.matches.length);

  /* results: { a, b, status: "live" | "done" } */
  const result = (id) => RESULTS[id] || null;
  const isLive = (id) => { const r = result(id); return !!r && r.status === "live"; };
  const isDone = (id) => { const r = result(id); return !!r && r.status === "done"; };
  const winnerSide = (id) => { const r = result(id); return isDone(id) ? (r.a > r.b ? "a" : "b") : null; };

  /* Standings: wins first, then points difference (scored minus conceded).
     Head-to-head is not used. Only if still level: points scored, then team code. */
  function standings(group) {
    const rows = Object.fromEntries(group.teams.map((t) => [t, { team: t, p: 0, w: 0, l: 0, pf: 0, pa: 0 }]));
    const games = MATCHES.filter((m) => m.group === group.id);
    games.forEach((m) => {
      if (!isDone(m.id)) return;
      const r = result(m.id), A = rows[m.a], B = rows[m.b];
      A.p++; B.p++; A.pf += r.a; A.pa += r.b; B.pf += r.b; B.pa += r.a;
      if (r.a > r.b) { A.w++; B.l++; } else { B.w++; A.l++; }
    });
    const list = Object.values(rows).sort((x, y) =>
      y.w - x.w || (y.pf - y.pa) - (x.pf - x.pa) || y.pf - x.pf || x.team.localeCompare(y.team));
    return { list, complete: games.every((m) => isDone(m.id)) };
  }

  /* Returns { team } once known, otherwise { label }. labels = { posOf(group, pos), winnerOf(matchId) } */
  function resolveSide(side, labels) {
    if (typeof side === "string") return { team: side };
    if (side.g) {
      const st = standings(groupById[side.g]);
      return st.complete ? { team: st.list[side.pos - 1].team } : { label: labels.posOf(side.g, side.pos) };
    }
    const src = matchById[side.w], w = winnerSide(side.w);
    return w ? resolveSide(src[w], labels) : { label: labels.winnerOf(side.w) };
  }

  /* listeners are told whenever results change (live updates, admin edits) */
  const listeners = [];
  window.IGBS = {
    toMin, fromMin, groupById, MATCHES, matchById, SLOTS, FIRST_PLAY,
    result, isLive, isDone, winnerSide, standings, resolveSide,
    onResults: (fn) => listeners.push(fn),
    emit: () => listeners.forEach((fn) => fn()),
    client: null,
    ready: null,
  };
  window.IGBS.ready = new Promise((resolve) => { window.IGBS._resolveReady = resolve; });
})();
