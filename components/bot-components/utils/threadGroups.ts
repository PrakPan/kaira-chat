// Shared chat-history bucketing for the desktop rail (components/Sidebar) and
// the mobile header drawer (BotApp's MobileHeaderMenu). Both surfaces show the
// same Today / Yesterday / Previous 7 days / Older grouping, so the logic lives
// here rather than being duplicated per surface.
//
// Threads are bucketed and stamped in IST, matching how the rest of the app
// reports trip dates.

export interface Thread {
  id: string;
  title: string;
  created_at: string;
  session_id?: string;
  filter_session_id?: string;
  customer_name?: string;
}

const IST_OFFSET = (5 * 60 + 30) * 60 * 1000;
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Timestamps arrive without a timezone suffix; treat those as UTC. */
export const parseIso = (iso?: string): number => {
  if (!iso) return NaN;
  const normalized = /[Z+\-]/.test(iso.slice(10)) ? iso : iso + "Z";
  return new Date(normalized).getTime();
};

/** Which IST calendar day a UTC instant falls on. */
const istDayIndex = (ms: number): number => Math.floor((ms + IST_OFFSET) / DAY);

/** Compact age for a history row: "2h", "1d", "3w", "1mo". */
export const formatCompactTime = (iso?: string): string => {
  const then = parseIso(iso);
  if (Number.isNaN(then)) return "";

  const diff = Math.max(0, Date.now() - then);
  if (diff < MINUTE) return "now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h`;

  const days = Math.floor(diff / DAY);
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.round(days / 7)}w`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${Math.round(days / 365)}y`;
};

export interface ThreadGroup {
  label: string;
  threads: Thread[];
}

/** Bucket threads into Today / Yesterday / Previous 7 days / Older, order kept. */
export const groupThreads = (threads: Thread[]): ThreadGroup[] => {
  const today: Thread[] = [];
  const yesterday: Thread[] = [];
  const week: Thread[] = [];
  const older: Thread[] = [];

  const todayIndex = istDayIndex(Date.now());

  for (const thread of threads) {
    const then = parseIso(thread.created_at);
    if (Number.isNaN(then)) {
      older.push(thread);
      continue;
    }
    const age = todayIndex - istDayIndex(then);
    if (age <= 0) today.push(thread);
    else if (age === 1) yesterday.push(thread);
    else if (age < 7) week.push(thread);
    else older.push(thread);
  }

  return [
    { label: "Today", threads: today },
    { label: "Yesterday", threads: yesterday },
    { label: "Previous 7 days", threads: week },
    { label: "Older", threads: older },
  ].filter((group) => group.threads.length > 0);
};
