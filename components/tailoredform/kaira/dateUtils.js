// Small local-date helpers for the trip planner. Everything works on
// "YYYY-MM-DD" strings (what the Redux slice and the itinerary API use) and
// local-midnight Date objects, never UTC, so a date never shifts a day for
// users east of Greenwich.

export const MON = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
export const MONF = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const DOW = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const DAY_MS = 86400000;

export const pad2 = (n) => String(n).padStart(2, "0");

/** Date (local midnight) -> "YYYY-MM-DD" */
export const toYMD = (d) =>
  d ? `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}` : null;

/** "YYYY-MM-DD" (or Date) -> Date at local midnight, or null */
export const fromYMD = (s) => {
  if (!s) return null;
  if (s instanceof Date) return new Date(s.getFullYear(), s.getMonth(), s.getDate());
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) {
    const d = new Date(s);
    return isNaN(d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
};

export const today = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

export const addDays = (d, n) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

/** whole days between two local-midnight dates */
export const diffDays = (a, b) => Math.round((b - a) / DAY_MS);

/** "7 Oct" */
export const fmtDayMon = (d) => (d ? `${d.getDate()} ${MON[d.getMonth()]}` : "");

/** "7 Oct - 16 Oct 2026" */
export const fmtRange = (start, end) =>
  start && end ? `${fmtDayMon(start)} - ${fmtDayMon(end)} ${end.getFullYear()}` : "";

/** "Oct '26" */
export const fmtMonShort = (monthIndex, year) =>
  `${MON[monthIndex]} '${String(year).slice(2)}`;
