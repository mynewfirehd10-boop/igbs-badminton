/* IGBS Badminton Tournament 2026 — tournament data.
   Teams and groups: IGBS-Badminton-Groups-and-Fixture-2026.pdf. Timetable: revised 14 Nov (Level 2 from 14:00, Level 1 from 15:55, 15-minute prayer breaks).
   Everything the site shows comes from this file.
   RESULTS starts empty: live.js fills it from the database while the site is open. */

const EVENT = {
  date: "2026-11-22",
  start: "14:00",
  end: "22:00",
  tz: "+01:00",
  venue: "Billwerder Billdeich 607, 21033 Hamburg",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Billwerder+Billdeich+607+21033+Hamburg",
  slotMinutes: 20,
};

/* Start time of each group-stage round. Round 6 is followed by the Maghrib break (15 minutes). */
const ROUND_TIMES = [
  "14:15", "14:35", "14:55", "15:15", "15:35", "15:55",
  "16:30", "16:50", "17:10", "17:30", "17:50", "18:10", "18:30",
];

/* Breaks: no play on any court. "confirm" is the 10-minute check of Level 1 qualifiers. */
const BREAKS = [
  { key: "asr", time: "14:00", end: "14:15" },
  { key: "maghrib", time: "16:15", end: "16:30" },
  { key: "confirm", time: "18:50", end: "19:00" },
  { key: "isha", time: "19:40", end: "19:55" },
];

/* qualify = how many teams go through to the quarterfinals */
const GROUPS = [
  { id: "L1-A", level: 1, qualify: 4, teams: ["1A", "1B", "1C", "1D", "1E"] },
  { id: "L1-B", level: 1, qualify: 4, teams: ["1F", "1G", "1H", "1I", "1J"] },
  { id: "L2-A", level: 2, qualify: 3, teams: ["2A", "2B", "2C", "2D", "2E"] },
  { id: "L2-B", level: 2, qualify: 3, teams: ["2F", "2G", "2H", "2I", "2J"] },
  { id: "L2-C", level: 2, qualify: 2, teams: ["2K", "2L", "2M", "2N"] },
];

/* short = name used in the fixture, players = full names */
const TEAMS = {
  "1A": { short: "Adnan / Prince", players: ["Adnan Abdul Hai", "Prince Mahbub Dewan"] },
  "1B": { short: "Siam / Imran", players: ["Md Shahriar Hossain Siam", "Md Shafiqul Islam Imran"] },
  "1C": { short: "Shuvo / Wassim", players: ["Afran Shuvo", "Wasaim Sazzad"] },
  "1D": { short: "Rakib / Tayeb", players: ["Rakib Hasan", "Jahid Hasan Tayeb"] },
  "1E": { short: "Alif / Gani", players: ["Alif Md Asif Khan", "Sayed Md Abrar Gani"] },
  "1F": { short: "Mirfath / Tanvir Hossain", players: ["Mirfath Karim", "Md Tanvir Hossain"] },
  "1G": { short: "Badhon / Imon", players: ["S M Badhan", "Imon Hosen"] },
  "1H": { short: "Inad / Tawhid", players: ["Sayed Md Inteaser Gani", "Md Golam Mosabbir Tawhid"] },
  "1I": { short: "Samin / Rifat", players: ["Samin Yasar Mahir", "Md Rifat Bhuiyan"] },
  "1J": { short: "Sayem / Abidur", players: ["Sayem Chowdhury", "Abidur Rahman"] },
  "2A": { short: "Asifur / Arik", players: ["Asifur Rahman", "Arik Mahmood"] },
  "2B": { short: "Pial / Istiaque", players: ["Pial Chowdhury", "Istiak Salauddin"] },
  "2C": { short: "Goni / Naveed", players: ["Kazi Ataul Goni Shahin", "Md Naveed Hasnain"] },
  "2D": { short: "Rayhanul / Asif", players: ["Rayhanul Islam", "Asif"] },
  "2E": { short: "Haider / Fahim", players: ["Julfiqur Haider", "Abrar Fahim"] },
  "2F": { short: "Abdullah / Tashowar", players: ["Abubakar Abdullah", "SK Tashowar Tanzim Rahul"] },
  "2G": { short: "Raihan / Ifti", players: ["Md. Abdullah Al Mamun Raihan", "Ifti Salauddin"] },
  "2H": { short: "Riad / Mahbub Alam", players: ["Md Hasanur Rahman Riad", "Mahbub Alam"] },
  "2I": { short: "Zahin Azad / Fazlay Rabbi", players: ["Zaheen Azad", "Fazle Rabbee"] },
  "2J": { short: "Mishuk / Hosnayen", players: ["Mishuk Barua", "Hosnayen Alam Siddiquee"] },
  "2K": { short: "Kaium / Nurruddin", players: ["Kaium Ahmed", "Muhammad Nuruddin"] },
  "2L": { short: "Dipto / Robin", players: ["Dipto Bormon", "Mainuddin Monsur Robin"] },
  "2M": { short: "Fayez / Mridul", players: ["Fayez Mohammad Khan", "Mridul Chandra Roy"] },
  "2N": { short: "Sami / Tanvir Ahmed", players: ["Azizul Sami", "Tanvir Ahmed"] },
};

/* Group stage: [match id, round, court, group, side A, side B]
   Round times are in ROUND_TIMES. Level 2 starts at 14:15 after Asr on all four courts.
   NOTE: court numbers 1-4 here are the hall's courts 3-6 (the site adds 2 when showing them).
   From 16:00 (round 6) L1-A plays on Court 1 and L1-B on Court 2, and the rest of
   L2-A and L2-B stay on Courts 3 and 4. After Level 2 finishes, Level 1 uses all four courts (rounds 11 to 13, 17:50 to 18:30).
   Six teams play two rounds in a row (1D, 1I at 17:50; 1C, 1H at 18:10; 1E, 1J at 18:30).
   Quarterfinals of both levels run together (19:00, 19:20), then all four semifinals at 19:55. */
const GROUP_MATCHES = [
  ["M01", 1, 1, "L2-C", "2K", "2L"], ["M02", 1, 2, "L2-C", "2M", "2N"], ["M03", 1, 3, "L2-A", "2A", "2B"], ["M04", 1, 4, "L2-B", "2F", "2G"],
  ["M05", 2, 3, "L2-A", "2C", "2D"], ["M06", 2, 4, "L2-B", "2H", "2I"],
  ["M07", 3, 1, "L2-C", "2K", "2M"], ["M08", 3, 2, "L2-C", "2L", "2N"], ["M09", 3, 3, "L2-A", "2A", "2E"], ["M10", 3, 4, "L2-B", "2F", "2J"],
  ["M11", 4, 3, "L2-A", "2B", "2C"], ["M12", 4, 4, "L2-B", "2G", "2H"],
  ["M13", 5, 1, "L2-C", "2K", "2N"], ["M14", 5, 2, "L2-C", "2L", "2M"], ["M15", 5, 3, "L2-A", "2D", "2E"], ["M16", 5, 4, "L2-B", "2I", "2J"],
  ["M17", 6, 1, "L1-A", "1A", "1B"], ["M18", 6, 2, "L1-B", "1F", "1G"], ["M19", 6, 3, "L2-A", "2A", "2C"], ["M20", 6, 4, "L2-B", "2F", "2H"],
  ["M21", 7, 1, "L1-A", "1C", "1D"], ["M22", 7, 2, "L1-B", "1H", "1I"], ["M23", 7, 3, "L2-A", "2B", "2D"], ["M24", 7, 4, "L2-B", "2G", "2I"],
  ["M25", 8, 1, "L1-A", "1A", "1E"], ["M26", 8, 2, "L1-B", "1F", "1J"], ["M27", 8, 3, "L2-A", "2C", "2E"], ["M28", 8, 4, "L2-B", "2H", "2J"],
  ["M29", 9, 1, "L1-A", "1B", "1C"], ["M30", 9, 2, "L1-B", "1G", "1H"], ["M31", 9, 3, "L2-A", "2A", "2D"], ["M32", 9, 4, "L2-B", "2F", "2I"],
  ["M33", 10, 1, "L1-A", "1D", "1E"], ["M34", 10, 2, "L1-B", "1I", "1J"], ["M35", 10, 3, "L2-A", "2B", "2E"], ["M36", 10, 4, "L2-B", "2G", "2J"],
  ["M37", 11, 1, "L1-A", "1A", "1C"], ["M38", 11, 2, "L1-B", "1F", "1H"], ["M39", 11, 3, "L1-A", "1B", "1D"], ["M40", 11, 4, "L1-B", "1G", "1I"],
  ["M41", 12, 1, "L1-A", "1C", "1E"], ["M42", 12, 2, "L1-B", "1H", "1J"],
  ["M43", 13, 3, "L1-A", "1A", "1D"], ["M44", 13, 4, "L1-B", "1F", "1I"], ["M45", 13, 1, "L1-A", "1B", "1E"], ["M46", 13, 2, "L1-B", "1G", "1J"],
];

/* Knockout: side is {g, pos} = position in a group, or {w} = winner of a match */
const KNOCKOUT = [
  { id: "1QF1", stage: "QF", level: 1, time: "19:00", court: 1, a: { g: "L1-A", pos: 1 }, b: { g: "L1-B", pos: 4 } },
  { id: "1QF2", stage: "QF", level: 1, time: "19:00", court: 2, a: { g: "L1-B", pos: 2 }, b: { g: "L1-A", pos: 3 } },
  { id: "2QF1", stage: "QF", level: 2, time: "19:00", court: 3, a: { g: "L2-A", pos: 1 }, b: { g: "L2-B", pos: 3 } },
  { id: "2QF2", stage: "QF", level: 2, time: "19:00", court: 4, a: { g: "L2-C", pos: 1 }, b: { g: "L2-A", pos: 3 } },
  { id: "1QF3", stage: "QF", level: 1, time: "19:20", court: 1, a: { g: "L1-B", pos: 1 }, b: { g: "L1-A", pos: 4 } },
  { id: "1QF4", stage: "QF", level: 1, time: "19:20", court: 2, a: { g: "L1-A", pos: 2 }, b: { g: "L1-B", pos: 3 } },
  { id: "2QF3", stage: "QF", level: 2, time: "19:20", court: 3, a: { g: "L2-B", pos: 1 }, b: { g: "L2-C", pos: 2 } },
  { id: "2QF4", stage: "QF", level: 2, time: "19:20", court: 4, a: { g: "L2-A", pos: 2 }, b: { g: "L2-B", pos: 2 } },
  { id: "1SF1", stage: "SF", level: 1, time: "19:55", court: 1, a: { w: "1QF1" }, b: { w: "1QF2" } },
  { id: "1SF2", stage: "SF", level: 1, time: "19:55", court: 2, a: { w: "1QF3" }, b: { w: "1QF4" } },
  { id: "2SF1", stage: "SF", level: 2, time: "19:55", court: 3, a: { w: "2QF1" }, b: { w: "2QF2" } },
  { id: "2SF2", stage: "SF", level: 2, time: "19:55", court: 4, a: { w: "2QF3" }, b: { w: "2QF4" } },
  { id: "1F", stage: "F", level: 1, time: "20:35", court: 1, a: { w: "1SF1" }, b: { w: "1SF2" } },
  { id: "2F", stage: "F", level: 2, time: "20:35", court: 3, a: { w: "2SF1" }, b: { w: "2SF2" } },
];

/* Results. Example:  M01: { a: 15, b: 11, status: "done" }   status: "live" or "done" */
const RESULTS = {};

// Match officials (volunteers): referee + 2 line referees. Empty string = no volunteer assigned yet.
const OFFICIALS = {"M01": {"ref": "Adnan (1A)","line": ["Badhon (1G)",""]},"M02": {"ref": "Wassim (1C)","line": ["",""]},"M03": {"ref": "Fahim (2E)","line": ["Goni (2C)","Naveed (2C)"]},"M04": {"ref": "Mishuk (2J)","line": ["Hosnayen (2J)","Riad (2H)"]},"M05": {"ref": "Pial (2B)","line": ["Istiaque (2B)","Asifur (2A)"]},"M06": {"ref": "Abdullah (2F)","line": ["Raihan (2G)","Ifti (2G)"]},"M07": {"ref": "Adnan (1A)","line": ["Badhon (1G)",""]},"M08": {"ref": "Wassim (1C)","line": ["",""]},"M09": {"ref": "Rayhanul (2D)","line": ["Asif (2D)","Pial (2B)"]},"M10": {"ref": "Zahin Azad (2I)","line": ["Fazlay Rabbi (2I)","Mahbub Alam (2H)"]},"M11": {"ref": "Arik (2A)","line": ["Asifur (2A)","Rayhanul (2D)"]},"M12": {"ref": "Abdullah (2F)","line": ["Tashowar (2F)","Zahin Azad (2I)"]},"M13": {"ref": "","line": ["",""]},"M14": {"ref": "","line": ["",""]},"M15": {"ref": "Istiaque (2B)","line": ["Arik (2A)","Goni (2C)"]},"M16": {"ref": "Raihan (2G)","line": ["Ifti (2G)","Tashowar (2F)"]},"M17": {"ref": "Alif (1E)","line": ["Gani (1E)","Shuvo (1C)"]},"M18": {"ref": "Sayem (1J)","line": ["Abidur (1J)","Inad (1H)"]},"M19": {"ref": "Fahim (2E)","line": ["Asif (2D)","Pial (2B)"]},"M20": {"ref": "Mishuk (2J)","line": ["Hosnayen (2J)","Fazlay Rabbi (2I)"]},"M21": {"ref": "Siam (1B)","line": ["Imran (1B)","Prince (1A)"]},"M22": {"ref": "Imon (1G)","line": ["Mirfath (1F)","Tanvir Hossain (1F)"]},"M23": {"ref": "Naveed (2C)","line": ["Asifur (2A)","Arik (2A)"]},"M24": {"ref": "Riad (2H)","line": ["Mahbub Alam (2H)","Tashowar (2F)"]},"M25": {"ref": "Rakib (1D)","line": ["Tayeb (1D)","Siam (1B)"]},"M26": {"ref": "Samin (1I)","line": ["Rifat (1I)","Tawhid (1H)"]},"M27": {"ref": "Istiaque (2B)","line": ["Rayhanul (2D)","Asif (2D)"]},"M28": {"ref": "Raihan (2G)","line": ["Ifti (2G)","Zahin Azad (2I)"]},"M29": {"ref": "Prince (1A)","line": ["Rakib (1D)","Tayeb (1D)"]},"M30": {"ref": "Mirfath (1F)","line": ["Tanvir Hossain (1F)","Samin (1I)"]},"M31": {"ref": "Goni (2C)","line": ["Naveed (2C)","Fahim (2E)"]},"M32": {"ref": "Riad (2H)","line": ["Mahbub Alam (2H)","Mishuk (2J)"]},"M33": {"ref": "Imran (1B)","line": ["Shuvo (1C)","Prince (1A)"]},"M34": {"ref": "Imon (1G)","line": ["Inad (1H)","Tawhid (1H)"]},"M35": {"ref": "Abdullah (2F)","line": ["Adnan (1A)","Wassim (1C)"]},"M36": {"ref": "Fazlay Rabbi (2I)","line": ["Badhon (1G)",""]},"M37": {"ref": "Alif (1E)","line": ["Kaium (2K)","Nurruddin (2K)"]},"M38": {"ref": "Sayem (1J)","line": ["Fayez (2M)","Mridul (2M)"]},"M39": {"ref": "Gani (1E)","line": ["Dipto (2L)","Robin (2L)"]},"M40": {"ref": "Abidur (1J)","line": ["Sami (2N)","Tanvir Ahmed (2N)"]},"M41": {"ref": "Siam (1B)","line": ["Imran (1B)","Rakib (1D)"]},"M42": {"ref": "Rifat (1I)","line": ["Mirfath (1F)","Tanvir Hossain (1F)"]},"M43": {"ref": "Fayez (2M)","line": ["Tanvir Ahmed (2N)","Kaium (2K)"]},"M44": {"ref": "Tawhid (1H)","line": ["Robin (2L)","Hosnayen (2J)"]},"M45": {"ref": "Shuvo (1C)","line": ["Mridul (2M)","Sami (2N)"]},"M46": {"ref": "Inad (1H)","line": ["Nurruddin (2K)","Dipto (2L)"]}};
