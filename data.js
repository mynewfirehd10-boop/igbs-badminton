/* IGBS Badminton Tournament 2026 — tournament data.
   Source: IGBS-Badminton-Groups-and-Fixture-2026.pdf only.
   Everything the site shows comes from this file.
   Later, RESULTS (and the rest) will be loaded from the live database instead. */

const EVENT = {
  date: "2026-11-22",
  start: "15:00",
  end: "22:00",
  tz: "+01:00",
  venue: "Billwerder Billdeich 607, 21033 Hamburg",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Billwerder+Billdeich+607+21033+Hamburg",
  slotMinutes: 20,
};

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
  "2D": { short: "Rayhanul / Rashed", players: ["Rayhanul Islam", "Rashedul Hasan"] },
  "2E": { short: "Haider / Fahim", players: ["Julfiqur Haider", "Abrar Fahim"] },
  "2F": { short: "Abu Bakkar / Tasuar", players: ["Abubakar Abdullah", "SK Tashowar Tanzim Rahul"] },
  "2G": { short: "Raihan / Ifti", players: ["Md. Abdullah Al Mamun Raihan", "Ifti Salauddin"] },
  "2H": { short: "Riad / Mahbub Alam", players: ["Md Hasanur Rahman Riad", "Mahbub Alam"] },
  "2I": { short: "Zahin Azad / Fazlay Rabbi", players: ["Zaheen Azad", "Fazle Rabbee"] },
  "2J": { short: "Mishuk / Hosnayen", players: ["Mishuk Barua", "Hosnayen Alam Siddiquee"] },
  "2K": { short: "Kaium / Nurruddin", players: ["Kaium Ahmed", "Muhammad Nuruddin"] },
  "2L": { short: "Dipto / Robin", players: ["Dipto Bormon", "Mainuddin Monsur Robin"] },
  "2M": { short: "Fayez / Mridul", players: ["Fayez Mohammad Khan", "Mridul Chandra Roy"] },
  "2N": { short: "Sami / Tanvir Ahmed", players: ["Azizul Sami", "Tanvir Ahmed"] },
};

/* Group stage: [match id, round, court, group, side A, side B] */
const GROUP_MATCHES = [
  ["M01", 1, 1, "L1-A", "1A", "1B"], ["M02", 1, 2, "L1-B", "1F", "1G"], ["M03", 1, 3, "L2-A", "2A", "2D"], ["M04", 1, 4, "L2-B", "2F", "2I"],
  ["M05", 2, 1, "L1-A", "1C", "1D"], ["M06", 2, 2, "L1-B", "1H", "1I"], ["M07", 2, 3, "L2-A", "2B", "2E"], ["M08", 2, 4, "L2-B", "2H", "2J"],
  ["M09", 3, 1, "L1-A", "1A", "1E"], ["M10", 3, 2, "L1-B", "1F", "1J"], ["M11", 3, 3, "L2-A", "2A", "2C"], ["M12", 3, 4, "L2-B", "2F", "2G"],
  ["M13", 4, 1, "L1-A", "1B", "1C"], ["M14", 4, 2, "L1-B", "1G", "1H"], ["M15", 4, 3, "L2-A", "2B", "2D"], ["M16", 4, 4, "L2-B", "2I", "2J"],
  ["M17", 5, 1, "L1-A", "1D", "1E"], ["M18", 5, 2, "L1-B", "1I", "1J"], ["M19", 5, 3, "L2-A", "2C", "2E"], ["M20", 5, 4, "L2-B", "2G", "2H"],
  ["M21", 6, 1, "L1-A", "1A", "1C"], ["M22", 6, 2, "L1-B", "1F", "1H"], ["M23", 6, 3, "L2-C", "2K", "2N"], ["M24", 6, 4, "L2-B", "2F", "2J"],
  ["M25", 7, 1, "L1-A", "1B", "1D"], ["M26", 7, 2, "L1-B", "1G", "1I"], ["M27", 7, 3, "L2-A", "2B", "2C"], ["M28", 7, 4, "L2-C", "2L", "2M"],
  ["M29", 8, 1, "L1-A", "1C", "1E"], ["M30", 8, 2, "L1-B", "1H", "1J"], ["M31", 8, 3, "L2-A", "2A", "2E"], ["M32", 8, 4, "L2-B", "2F", "2H"],
  ["M33", 9, 1, "L1-A", "1A", "1D"], ["M34", 9, 2, "L1-B", "1F", "1I"], ["M35", 9, 3, "L2-C", "2K", "2M"], ["M36", 9, 4, "L2-B", "2G", "2I"],
  ["M37", 10, 1, "L1-A", "1B", "1E"], ["M38", 10, 2, "L1-B", "1G", "1J"], ["M39", 10, 3, "L2-A", "2D", "2E"], ["M40", 10, 4, "L2-C", "2L", "2N"],
  /* Rounds 11 and 12: pairings are certain (the only games left in each group);
     the round/court order is to be confirmed against the printed fixture. */
  ["M41", 11, 1, "L2-B", "2H", "2I"], ["M42", 11, 3, "L2-A", "2A", "2B"], ["M43", 11, 4, "L2-B", "2G", "2J"],
  ["M44", 12, 1, "L2-C", "2K", "2L"], ["M45", 12, 3, "L2-A", "2C", "2D"], ["M46", 12, 4, "L2-C", "2M", "2N"],
];

/* Knockout: side is {g, pos} = position in a group, or {w} = winner of a match */
const KNOCKOUT = [
  { id: "1QF1", stage: "QF", level: 1, time: "19:10", court: 1, a: { g: "L1-A", pos: 1 }, b: { g: "L1-B", pos: 4 } },
  { id: "1QF2", stage: "QF", level: 1, time: "19:10", court: 2, a: { g: "L1-B", pos: 2 }, b: { g: "L1-A", pos: 3 } },
  { id: "2QF1", stage: "QF", level: 2, time: "19:10", court: 3, a: { g: "L2-A", pos: 1 }, b: { g: "L2-B", pos: 3 } },
  { id: "2QF2", stage: "QF", level: 2, time: "19:10", court: 4, a: { g: "L2-C", pos: 1 }, b: { g: "L2-A", pos: 3 } },
  { id: "1QF3", stage: "QF", level: 1, time: "19:30", court: 1, a: { g: "L1-B", pos: 1 }, b: { g: "L1-A", pos: 4 } },
  { id: "1QF4", stage: "QF", level: 1, time: "19:30", court: 2, a: { g: "L1-A", pos: 2 }, b: { g: "L1-B", pos: 3 } },
  { id: "2QF3", stage: "QF", level: 2, time: "19:30", court: 3, a: { g: "L2-B", pos: 1 }, b: { g: "L2-C", pos: 2 } },
  { id: "2QF4", stage: "QF", level: 2, time: "19:30", court: 4, a: { g: "L2-A", pos: 2 }, b: { g: "L2-B", pos: 2 } },
  { id: "1SF1", stage: "SF", level: 1, time: "20:10", court: 1, a: { w: "1QF1" }, b: { w: "1QF2" } },
  { id: "1SF2", stage: "SF", level: 1, time: "20:10", court: 2, a: { w: "1QF3" }, b: { w: "1QF4" } },
  { id: "2SF1", stage: "SF", level: 2, time: "20:10", court: 3, a: { w: "2QF1" }, b: { w: "2QF2" } },
  { id: "2SF2", stage: "SF", level: 2, time: "20:10", court: 4, a: { w: "2QF3" }, b: { w: "2QF4" } },
  { id: "1F", stage: "F", level: 1, time: "20:50", court: 1, a: { w: "1SF1" }, b: { w: "1SF2" } },
  { id: "2F", stage: "F", level: 2, time: "20:50", court: 3, a: { w: "2SF1" }, b: { w: "2SF2" } },
];

/* Results. Example:  M01: { a: 15, b: 11, status: "done" }   status: "live" or "done" */
const RESULTS = {};
