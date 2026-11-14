/* IGBS Badminton 2026 — site logic. Data comes from data.js. */
(function () {
  "use strict";

  /* ---------- text in both languages ---------- */
  const TEXT = {
    bn: {
      org: "IGBS e.V. আয়োজিত",
      title: "ব্যাডমিন্টন টুর্নামেন্ট ২০২৬",
      tabHome: "হোম", tabFixture: "ফিক্সচার", tabGroups: "গ্রুপ", tabKnockout: "নকআউট", tabRules: "নিয়ম",
      date: "তারিখ", dateVal: "২২ নভেম্বর ২০২৬, রবিবার", time: "সময়", timeVal: "দুপুর ২টা – রাত ১০টা", venue: "স্থান",
      daysToGo: (n) => `আর ${n} দিন বাকি`, today: "আজ দুপুর ২:১৫ এ খেলা শুরু", inPlay: "খেলা চলছে", finished: "টুর্নামেন্ট শেষ হয়েছে",
      round: (n) => `রাউন্ড ${n}`, QF: "কোয়ার্টার ফাইনাল", SF: "সেমিফাইনাল", F: "ফাইনাল",
      firstUp: "প্রথম রাউন্ড", prayer: { asr: "আসরের নামাজ", maghrib: "মাগরিবের নামাজ", isha: "এশার নামাজ", confirm: "যোগ্য দল নিশ্চিত করা" }, noPlay: (a, b, k) => (k === "confirm" ? `লেভেল ১ এর গ্রুপ শেষ, কোয়ার্টার ফাইনালের দল নিশ্চিত করা হচ্ছে, ${a} – ${b}। এই সময়ে কোনো খেলা নেই।` : `নামাজের বিরতি, ${a} – ${b}। এই সময়ে কোনো খেলা নেই।`), now: "এখন", court: "কোর্ট", freeCourt: "এই সময়ে কোর্ট ফাঁকা", live: "লাইভ",
      prev: "আগের সময়", next: "পরের সময়",
      planTitle: "দিনের সূচি",
      plan: [
        ["14:00 – 14:15", "আসরের নামাজ"],
        ["14:15 – 17:50", "লেভেল ২ গ্রুপ পর্ব"],
        ["15:55 – 18:50", "লেভেল ১ গ্রুপ পর্ব, শেষ দিকে চারটি কোর্টে"],
        ["16:15 – 16:30", "মাগরিবের নামাজ"],
        ["18:50 – 19:00", "যোগ্য দল নিশ্চিত করা"],
        ["19:00 – 19:40", "কোয়ার্টার ফাইনাল, দুই লেভেল একসাথে, চারটি কোর্টে"],
        ["19:40 – 19:55", "এশার নামাজ"],
        ["19:55", "চারটি সেমিফাইনাল একসাথে"],
        ["20:35", "দুই লেভেলের ফাইনাল"],
        ["20:55", "ট্রফি প্রদান ও ছবি"],
      ],
      quickFixture: "আপনার খেলা খুঁজুন", quickFixtureSub: "দল বেছে নিলে আপনার সব ম্যাচ, সময় ও কোর্ট দেখাবে",
      quickGroups: "গ্রুপ ও পয়েন্ট টেবিল", quickGroupsSub: "৫টি গ্রুপ, ২৪টি দল",
      quickRules: "খেলার নিয়ম", quickRulesSub: "১৫ পয়েন্টের এক গেম",
      fixtureTitle: "ফিক্সচার", fixtureSub: "৪৬টি গ্রুপ ম্যাচ ও ১৪টি নকআউট ম্যাচ, চারটি কোর্টে।",
      all: "সব", level: (n) => `লেভেল ${n}`, myTeam: "আমার দল", allTeams: "সব দল",
      noMatches: "এই বাছাইয়ে কোনো ম্যাচ নেই।",
      groupsTitle: "গ্রুপ ও পয়েন্ট টেবিল", groupsSub: "জয়ের সংখ্যা আগে, সমান হলে পয়েন্টের ব্যবধান। খেলা শেষ হলে টেবিল নিজে থেকেই হালনাগাদ হবে।",
      teams: (n) => `${n}টি দল`, topQ: (n) => `প্রথম ${n}টি দল কোয়ার্টার ফাইনালে`,
      thTeam: "দল", thP: "খেলা", thW: "জয়", thL: "হার", thPts: "পয়েন্ট", thDiff: "ব্যবধান",
      legendCut: "দাগের উপরের দলগুলো কোয়ার্টার ফাইনালে উঠবে।",
      koTitle: "নকআউট পর্ব", koSub: "গ্রুপ পর্ব শেষ হলে দলের নাম এখানে বসবে। কোয়ার্টার ফাইনালে একই গ্রুপের দল মুখোমুখি হবে না।",
      winnerOf: (id) => `${id} এর বিজয়ী`, posOf: (g, p) => `${g} গ্রুপের ${p} নম্বর`,
      rulesTitle: "নিয়মাবলী",
      rules: [
        ["খেলার ধরন", [
          "প্রতিটি ম্যাচ এক গেমের, ১৫ পয়েন্টে।",
          "জিততে হলে দুই পয়েন্টের ব্যবধান লাগবে।",
        ]],
        ["গ্রুপ পর্ব", [
          "২৪টি দল, ৪৮ জন খেলোয়াড়, পাঁচটি গ্রুপ। গ্রুপের ম্যাচ M01 থেকে M46।",
          "L1-A ও L1-B: প্রতি গ্রুপে ৫টি দল, প্রথম ৪টি দল কোয়ার্টার ফাইনালে উঠবে।",
          "L2-A ও L2-B: প্রতি গ্রুপে ৫টি দল, প্রথম ৩টি দল উঠবে। L2-C: ৪টি দল, প্রথম ২টি দল উঠবে।",
          "অবস্থান ঠিক হবে জয়ের সংখ্যা দিয়ে, এরপর পয়েন্টের ব্যবধান দিয়ে। হিসাব শুধু নিজের গ্রুপের মধ্যে।",
        ]],
        ["সময় ও কোর্ট", [
          "আসরের নামাজের পর ১৪:১৫ এ লেভেল ২ এর গ্রুপ ম্যাচ শুরু। L2-A কোর্ট ৩ এ, L2-B কোর্ট ৪ এ, আর L2-C কোর্ট ১ ও ২ এ খেলবে।",
          "লেভেল ১ এর গ্রুপ ম্যাচ ১৫:৫৫ এ শুরু। L1-A কোর্ট ১ এ এবং L1-B কোর্ট ২ এ খেলবে।",
          "L2-C এর সব খেলা ১৫:৫৫ এর মধ্যে শেষ হবে। L2-A ও L2-B এর বাকি খেলা কোর্ট ৩ ও ৪ এ চলবে, ১৭:৫০ পর্যন্ত।",
          "লেভেল ২ শেষ হলে লেভেল ১ এর বাকি ম্যাচগুলো (১৭:৫০ থেকে ১৮:৩০) চারটি কোর্টেই খেলা হবে।",
          "লেভেল ১ এর শেষ ম্যাচগুলো দ্রুত শেষ করতে ছয়টি দল পরপর দুই রাউন্ডে খেলবে: 1D ও 1I (১৭:৫০), 1C ও 1H (১৮:১০), 1E ও 1J (১৮:৩০)। আর কোনো দল পরপর খেলবে না।",
          "নামাজের বিরতি ১৫ মিনিট করে: আসর ১৪:০০ – ১৪:১৫, মাগরিব ১৬:১৫ – ১৬:৩০, এশা ১৯:৪০ – ১৯:৫৫। এই সময়ে কোনো খেলা হবে না।",
        ]],
        ["নকআউট পর্ব", [
          "কোয়ার্টার ফাইনাল, সেমিফাইনাল ও ফাইনাল, দুই লেভেলে আলাদাভাবে।",
          "কোয়ার্টার ফাইনালে একই গ্রুপের দল মুখোমুখি হবে না।",
          "দুই লেভেলের কোয়ার্টার ফাইনাল একসাথে, চারটি কোর্টে: ১৯:০০ এ প্রতি লেভেলের দুটি এবং ১৯:২০ এ বাকি দুটি করে। তার আগে ১৮:৫০ – ১৯:০০ লেভেল ১ এর যোগ্য দল নিশ্চিত করা হবে।",
          "এরপর এশার নামাজ (১৯:৪০ – ১৯:৫৫), তারপর ১৯:৫৫ এ চারটি সেমিফাইনাল একসাথে। দুই লেভেলের ফাইনাল ২০:৩৫ এ।",
        ]],
      ],
      foot: "IGBS e.V. · হামবুর্গ",
    },
    en: {
      org: "Organised by IGBS e.V.",
      title: "Badminton Tournament 2026",
      tabHome: "Home", tabFixture: "Fixture", tabGroups: "Groups", tabKnockout: "Knockout", tabRules: "Rules",
      date: "Date", dateVal: "Sunday, 22 November 2026", time: "Time", timeVal: "14:00 – 22:00", venue: "Venue",
      daysToGo: (n) => (n === 1 ? "1 day to go" : `${n} days to go`), today: "Play starts today at 14:15", inPlay: "Play is under way", finished: "The tournament has finished",
      round: (n) => `Round ${n}`, QF: "Quarterfinals", SF: "Semifinals", F: "Finals",
      firstUp: "First round", prayer: { asr: "Asr prayer", maghrib: "Maghrib prayer", isha: "Isha prayer", confirm: "Qualifiers confirmed" }, noPlay: (a, b, k) => (k === "confirm" ? `Level 1 groups are over and the quarterfinal line-up is confirmed, ${a} – ${b}. No play on any court.` : `Prayer break, ${a} – ${b}. No play on any court.`), now: "Now", court: "Court", freeCourt: "No match on this court", live: "Live",
      prev: "Earlier slot", next: "Later slot",
      planTitle: "Plan for the day",
      plan: [
        ["14:00 – 14:15", "Asr prayer"],
        ["14:15 – 17:50", "Level 2 group stage"],
        ["15:55 – 18:50", "Level 1 group stage, on all four courts near the end"],
        ["16:15 – 16:30", "Maghrib prayer"],
        ["18:50 – 19:00", "Qualifiers confirmed"],
        ["19:00 – 19:40", "Quarterfinals of both levels together, on four courts"],
        ["19:40 – 19:55", "Isha prayer"],
        ["19:55", "All four semifinals together"],
        ["20:35", "Finals for both levels"],
        ["20:55", "Trophies and photographs"],
      ],
      quickFixture: "Find your matches", quickFixtureSub: "Pick your team to see every match, time and court",
      quickGroups: "Groups and standings", quickGroupsSub: "5 groups, 24 teams",
      quickRules: "Rules", quickRulesSub: "One game to 15 points",
      fixtureTitle: "Fixture", fixtureSub: "46 group matches and 14 knockout matches on four courts.",
      all: "All", level: (n) => `Level ${n}`, myTeam: "My team", allTeams: "All teams",
      noMatches: "No matches for this selection.",
      groupsTitle: "Groups and standings", groupsSub: "Wins count first, then points difference. The tables update on their own as results come in.",
      teams: (n) => `${n} teams`, topQ: (n) => `Top ${n} reach the quarterfinals`,
      thTeam: "Team", thP: "Played", thW: "Won", thL: "Lost", thPts: "Points", thDiff: "Diff",
      legendCut: "Teams above the dashed line reach the quarterfinals.",
      koTitle: "Knockout stage", koSub: "Team names appear here once the groups finish. Quarterfinals keep teams from the same group apart.",
      winnerOf: (id) => `Winner of ${id}`, posOf: (g, p) => `${g} place ${p}`,
      rulesTitle: "Rules",
      rules: [
        ["Match format", [
          "Every match is one game to 15 points.",
          "A two-point lead is needed to win.",
        ]],
        ["Group stage", [
          "24 teams, 48 players, five groups. Group matches are M01 to M46.",
          "L1-A and L1-B: 5 teams each, the top 4 reach the quarterfinals.",
          "L2-A and L2-B: 5 teams each, the top 3 go through. L2-C: 4 teams, the top 2 go through.",
          "Standings go by wins first, then points difference, within the group only.",
        ]],
        ["Times and courts", [
          "Level 2 group matches start at 14:15, after Asr. L2-A plays on Court 3, L2-B on Court 4, and L2-C on Courts 1 and 2.",
          "Level 1 group matches start at 15:55. L1-A plays on Court 1 and L1-B on Court 2.",
          "L2-C finishes by 15:55. The remaining L2-A and L2-B matches continue on Courts 3 and 4 until 17:50.",
          "Once Level 2 finishes, the remaining Level 1 matches (17:50 to 18:30) use all four courts.",
          "To finish Level 1 sooner, six teams play two rounds in a row: 1D and 1I (17:50), 1C and 1H (18:10), 1E and 1J (18:30). No other team does.",
          "Prayer breaks of 15 minutes: Asr 14:00 – 14:15, Maghrib 16:15 – 16:30, Isha 19:40 – 19:55. No play during these.",
        ]],
        ["Knockout stage", [
          "Quarterfinals, semifinals and a final, separately for each level.",
          "Quarterfinals avoid opponents from the same group.",
          "Quarterfinals of both levels run together on four courts: two per level at 19:00 and the other two per level at 19:20. The Level 1 qualifiers are confirmed from 18:50 to 19:00 first.",
          "Then Isha (19:40 – 19:55), then all four semifinals together at 19:55. Both finals are at 20:35.",
        ]],
      ],
      foot: "IGBS e.V. · Hamburg",
    },
  };

  /* ---------- state ---------- */
  const store = {
    get(k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };
  const state = {
    lang: store.get("igbs-lang", "bn"),
    level: "all",
    team: store.get("igbs-team", ""),
    slot: null,
  };
  const T = () => TEXT[state.lang];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- build the match list ---------- */
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
  const slotName = (s) => s.brk ? T().prayer[s.brk] : (s.round ? T().round(s.round) : [...new Set(s.matches.map((m) => T()[m.stage]))].join(", "));

  /* ---------- results, standings, knockout sides ---------- */
  const result = (id) => RESULTS[id] || null;
  const isDone = (id) => { const r = result(id); return !!r && r.status === "done"; };
  const winnerSide = (id) => { const r = result(id); return isDone(id) ? (r.a > r.b ? "a" : "b") : null; };

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

  /* returns { team } when known, otherwise { label } */
  function resolveSide(side) {
    if (typeof side === "string") return { team: side };
    if (side.g) {
      const st = standings(groupById[side.g]);
      return st.complete ? { team: st.list[side.pos - 1].team } : { label: T().posOf(side.g, side.pos) };
    }
    const src = matchById[side.w], w = winnerSide(side.w);
    return w ? resolveSide(src[w]) : { label: T().winnerOf(side.w) };
  }

  /* ---------- clock ---------- */
  const at = (hhmm) => new Date(`${EVENT.date}T${hhmm}:00${EVENT.tz}`);
  function phase() {
    const now = new Date();
    if (now < at(EVENT.start)) {
      const days = Math.ceil((at("00:00") - now) / 864e5);
      return days > 0 ? { key: "before", days } : { key: "today" };
    }
    return now < at(EVENT.end) ? { key: "live" } : { key: "after" };
  }
  function currentSlotIndex() {
    const live = SLOTS.findIndex((s) => s.matches.some((m) => result(m.id) && result(m.id).status === "live"));
    if (live >= 0) return live;
    const ph = phase().key;
    if (ph === "before" || ph === "today") return FIRST_PLAY;
    if (ph === "after") return SLOTS.length - 1;
    const now = new Date();
    let idx = 0;
    SLOTS.forEach((s, i) => { if (now >= at(s.time)) idx = i; });
    return idx;
  }

  /* ---------- pieces ---------- */
  const ICONS = {
    home: '<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>',
    fixture: '<rect x="4" y="5" width="16" height="15" rx="1"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    groups: '<path d="M5 20V10M12 20V4M19 20v-7"/>',
    knockout: '<path d="M4 5h5v6h6M4 19h5v-6M15 12h5"/>',
    rules: '<path d="M6 4h9l4 4v12H6zM14 4v5h5M9 13h7M9 16h7"/>',
  };
  const TABS = [["home", "tabHome"], ["fixture", "tabFixture"], ["groups", "tabGroups"], ["knockout", "tabKnockout"], ["rules", "tabRules"]];

  function sideView(m, key) {
    const r = resolveSide(m[key]);
    return r.team ? { code: r.team, name: TEAMS[r.team].short, known: true } : { code: "", name: r.label, known: false };
  }

  function matchCard(m, opts = {}) {
    const r = result(m.id), win = winnerSide(m.id), a = sideView(m, "a"), b = sideView(m, "b");
    const mine = state.team && (a.code === state.team || b.code === state.team);
    const cls = ["match"];
    if (r && r.status === "live") cls.push("is-live");
    if (m.stage === "F") cls.push("final");
    if (opts.highlight && state.team) cls.push(mine ? "is-mine" : "is-dim");
    const row = (s, k) => `
      <div class="row ${win ? (win === k ? "won" : "lost") : ""} ${s.known ? "" : "tbd"}">
        <span class="nm">${s.code ? `<span class="cd">${s.code}</span>` : ""}${esc(s.name)}</span>
        ${r ? `<span class="sc">${r[k]}</span>` : ""}
      </div>`;
    const tag = m.stage === "G" ? m.group : `${T()[m.stage]}, ${T().level(m.level)}`;
    return `
      <article class="${cls.join(" ")}">
        <div class="ct"><span>${T().court}</span><b>${m.court}</b></div>
        <div class="body">
          <div class="meta"><span>${m.id} ${opts.showTime ? `<span class="when">${m.time}</span>` : ""}</span><span>${r && r.status === "live" ? T().live : tag}</span></div>
          ${row(a, "a")}${row(b, "b")}
        </div>
      </article>`;
  }

  function courtView(no, m) {
    if (!m) return `<div class="court is-empty"><span class="court-no">${T().court} ${no}</span><p>${T().freeCourt}</p></div>`;
    const r = result(m.id), win = winnerSide(m.id), a = sideView(m, "a"), b = sideView(m, "b");
    const half = (s, k) => `
      <div class="side ${win === k ? "won" : ""}">
        <span class="who">${esc(s.name).replace(" / ", "<br>")}</span>
        ${s.code ? `<span class="code">${s.code}</span>` : ""}
      </div>`;
    const net = r
      ? `<span class="score">${r.a}</span>${r.status === "live" ? `<span class="live">${T().live}</span>` : "<span>:</span>"}<span class="score">${r.b}</span>`
      : `<span>${m.id}</span><span>${m.stage === "G" ? m.group : T()[m.stage]}</span>`;
    return `
      <div class="court">
        <span class="court-no">${T().court} ${no}</span>
        <i class="tramline l"></i><i class="tramline r"></i>
        ${half(a, "a")}<div class="net">${net}</div>${half(b, "b")}
      </div>`;
  }

  /* ---------- pages ---------- */
  function home() {
    const t = T(), ph = phase();
    const statusText = ph.key === "before" ? t.daysToGo(ph.days) : ph.key === "today" ? t.today : ph.key === "live" ? t.inPlay : t.finished;
    const cur = currentSlotIndex();
    if (state.slot === null) state.slot = cur;
    const s = SLOTS[state.slot];
    const label = state.slot === cur ? (ph.key === "live" ? t.now : state.slot === FIRST_PLAY ? t.firstUp : slotName(s)) : slotName(s);
    const arrow = (d) => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;
    return `
      <section class="hero"><div class="hero-inner">
        <p class="org">${t.org}</p>
        <h1>${t.title}</h1>
        <dl class="facts">
          <div><dt>${t.date}</dt><dd>${t.dateVal}</dd></div>
          <div><dt>${t.time}</dt><dd>${t.timeVal}</dd></div>
          <div><dt>${t.venue}</dt><dd><a href="${EVENT.mapUrl}" target="_blank" rel="noopener">${EVENT.venue}</a></dd></div>
        </dl>
        <p class="status ${ph.key === "live" ? "is-live" : ""}"><span class="dot"></span>${statusText}</p>
      </div></section>

      <section class="hall" aria-live="polite"><div class="hall-inner">
        <div class="hall-bar">
          <div class="slot">
            <div class="slot-time">${s.time}</div>
            <div class="slot-name">${label}${label !== slotName(s) ? `, ${slotName(s)}` : ""}</div>
          </div>
          <button class="step" data-step="-1" aria-label="${t.prev}" ${state.slot === 0 ? "disabled" : ""}>${arrow("M15 5l-7 7 7 7")}</button>
          <button class="step" data-step="1" aria-label="${t.next}" ${state.slot === SLOTS.length - 1 ? "disabled" : ""}>${arrow("M9 5l7 7-7 7")}</button>
        </div>
        ${s.brk ? `<p class="pause">${t.noPlay(s.time, s.end, s.brk)}</p>` : `<div class="courts">${[1, 2, 3, 4].map((n) => courtView(n, s.matches.find((m) => m.court === n))).join("")}</div>`}
      </div></section>

      <section class="section">
        <div class="quick">
          <a href="#fixture"><strong>${t.quickFixture}</strong><span>${t.quickFixtureSub}</span></a>
          <a href="#groups"><strong>${t.quickGroups}</strong><span>${t.quickGroupsSub}</span></a>
          <a href="#rules"><strong>${t.quickRules}</strong><span>${t.quickRulesSub}</span></a>
        </div>
      </section>

      <section class="section">
        <h2>${t.planTitle}</h2>
        <ol class="plan">${t.plan.map(([a, b]) => `<li><span class="t">${a}</span><span>${b}</span></li>`).join("")}</ol>
      </section>`;
  }

  function fixture() {
    const t = T(), cur = currentSlotIndex(), live = phase().key === "live";
    const teamOpts = GROUPS.map((g) => `<optgroup label="${g.id}">${g.teams.map((c) =>
      `<option value="${c}" ${state.team === c ? "selected" : ""}>${c} ${esc(TEAMS[c].short)}</option>`).join("")}</optgroup>`).join("");
    const involves = (m) => ["a", "b"].some((k) => sideView(m, k).code === state.team);
    const blocks = SLOTS.map((s, i) => {
      if (s.brk) return `
        <section class="slot-block is-break">
          <div class="slot-head"><span class="t">${s.time}</span><span class="n">${slotName(s)}</span></div>
          <p class="pause">${t.noPlay(s.time, s.end, s.brk)}</p>
        </section>`;
      let ms = s.matches.filter((m) => state.level === "all" || String(m.level) === state.level);
      if (state.team) ms = ms.filter((m) => m.stage !== "G" || involves(m));
      if (!ms.length) return "";
      ms.sort((a, b) => a.court - b.court);
      return `
        <section class="slot-block">
          <div class="slot-head"><span class="t">${s.time}</span><span class="n">${slotName(s)}</span>${live && i === cur ? `<span class="now">${t.now}</span>` : ""}</div>
          <div class="matches">${ms.map((m) => matchCard(m, { highlight: m.stage !== "G" })).join("")}</div>
        </section>`;
    }).join("");
    const seg = (v, label) => `<button type="button" data-level="${v}" aria-pressed="${state.level === v}">${label}</button>`;
    return `
      <div class="page-head"><h1>${t.fixtureTitle}</h1><p>${t.fixtureSub}</p></div>
      <div class="filters">
        <div class="seg" role="group">${seg("all", t.all)}${seg("1", t.level(1))}${seg("2", t.level(2))}</div>
        <label class="pick">${t.myTeam}
          <select id="team-pick"><option value="">${t.allTeams}</option>${teamOpts}</select>
        </label>
      </div>
      ${blocks || `<p class="empty">${t.noMatches}</p>`}`;
  }

  function groups() {
    const t = T();
    const table = (g) => {
      const st = standings(g);
      const rows = st.list.map((r, i) => `
        <tr class="${i < g.qualify ? "q" : ""} ${i === g.qualify - 1 ? "cut" : ""}">
          <td class="pos">${i + 1}</td>
          <td class="team"><span class="p">${esc(TEAMS[r.team].players[0])}</span><span class="p">${esc(TEAMS[r.team].players[1])}</span><span class="c">${r.team}</span></td>
          <td>${r.p}</td><td class="w">${r.w}</td><td>${r.l}</td><td>${r.pf}:${r.pa}</td><td>${r.pf - r.pa > 0 ? "+" : ""}${r.pf - r.pa}</td>
        </tr>`).join("");
      return `
        <section class="group">
          <h3>${g.id} <small>${t.teams(g.teams.length)}, ${t.topQ(g.qualify)}</small></h3>
          <div class="table-wrap"><table>
            <thead><tr><th></th><th class="team">${t.thTeam}</th><th>${t.thP}</th><th>${t.thW}</th><th>${t.thL}</th><th>${t.thPts}</th><th>${t.thDiff}</th></tr></thead>
            <tbody>${rows}</tbody>
          </table></div>
        </section>`;
    };
    const level = (n) => `
      <section class="section"><h2>${t.level(n)}</h2>
        <div class="group-grid">${GROUPS.filter((g) => g.level === n).map(table).join("")}</div>
      </section>`;
    return `
      <div class="page-head"><h1>${t.groupsTitle}</h1><p>${t.groupsSub}</p></div>
      ${level(1)}${level(2)}
      <p class="legend">${t.legendCut}</p>`;
  }

  function knockout() {
    const t = T();
    const col = (n) => `
      <section><h2>${t.level(n)}</h2>
        ${["QF", "SF", "F"].map((st) => `
          <div class="ko-stage"><h3>${t[st]}</h3>
            <div class="matches">${KNOCKOUT.filter((k) => k.level === n && k.stage === st).map((k) => matchCard(matchById[k.id], { showTime: true })).join("")}</div>
          </div>`).join("")}
      </section>`;
    return `
      <div class="page-head"><h1>${t.koTitle}</h1><p>${t.koSub}</p></div>
      <div class="ko-cols section">${col(1)}${col(2)}</div>`;
  }

  function rules() {
    const t = T();
    return `
      <div class="page-head"><h1>${t.rulesTitle}</h1></div>
      <div class="rules">
        ${t.rules.map(([h, items]) => `<h2>${h}</h2><ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>`).join("")}
      </div>`;
  }

  const PAGES = { home, fixture, groups, knockout, rules };

  /* ---------- render and events ---------- */
  const view = document.getElementById("view");
  const currentTab = () => { const h = location.hash.slice(1); return PAGES[h] ? h : "home"; };

  function render() {
    const tab = currentTab(), t = T();
    document.documentElement.lang = state.lang;
    document.getElementById("tabs").innerHTML = TABS.map(([id, key]) =>
      `<a href="#${id}" ${id === tab ? 'aria-current="page"' : ""}><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[id]}</svg>${t[key]}</a>`).join("");
    document.querySelectorAll(".lang button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === state.lang));
    document.getElementById("foot-text").textContent = t.foot;
    view.innerHTML = PAGES[tab]();
  }

  document.querySelector(".lang").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-lang]");
    if (!b) return;
    state.lang = b.dataset.lang; store.set("igbs-lang", state.lang); render();
  });
  view.addEventListener("click", (e) => {
    const step = e.target.closest("[data-step]");
    if (step) { state.slot = Math.max(0, Math.min(SLOTS.length - 1, state.slot + Number(step.dataset.step))); render(); return; }
    const lv = e.target.closest("[data-level]");
    if (lv) { state.level = lv.dataset.level; render(); }
  });
  view.addEventListener("change", (e) => {
    if (e.target.id === "team-pick") { state.team = e.target.value; store.set("igbs-team", state.team); render(); }
  });
  window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });

  render();
})();
