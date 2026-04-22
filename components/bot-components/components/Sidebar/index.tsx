import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as authaction from "../../../../store/actions/auth";
import Link from "next/link";
import LogInModal from "../../../userauth/LogInModal";
import { createPortal } from "react-dom";
import Image from "next/image";

const CHATKIT_API_URL = "https://chat.tarzanway.com/chatkit";

interface Thread {
  id: string;
  title: string;
  created_at: string;
  session_id?: string;
  filter_session_id?: string;
}

// ── Relative time formatter (used in chat history drawer) ───────────────────
const formatRelativeTime = (iso?: string): string => {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "just now";
  if (diffMs < hour) {
    const mins = Math.floor(diffMs / minute);
    return `${mins} min ago`;
  }
  if (diffMs < day) {
    const hrs = Math.floor(diffMs / hour);
    return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  }

  // Day-aware boundary: compare calendar days so "yesterday" is accurate
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const dayDiff = Math.floor((startOfToday.getTime() - then) / day) + 1;
  if (dayDiff === 1) return "yesterday";
  if (dayDiff < 7) return `${dayDiff} days ago`;

  // Older — show date (short month + day, include year if not current year)
  const d = new Date(iso);
  const currentYear = new Date().getFullYear();
  const opts: Intl.DateTimeFormatOptions =
    d.getFullYear() === currentYear
      ? { month: "short", day: "numeric" }
      : { month: "short", day: "numeric", year: "numeric" };
  return d.toLocaleDateString("en-GB", opts);
};

interface SidebarProps {
  onNewChat?: () => void;
  onToggle?: () => void;
  isCollapsed?: boolean;
  onThreadSelect?: (threadId: string, sessionId?: string) => void;
  activeThreadId?: string | null;
  /** True when itinerary is fully created (P2), false/undefined = P1 */
  isComplete?: boolean;
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
const SidebarTooltip: React.FC<{
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}> = ({ label, children, disabled }) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const show = () => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ top: rect.top + rect.height / 2, left: rect.right + 10 });
    setVisible(true);
  };
  const hide = () => setVisible(false);

  return (
    <>
      <div ref={ref} className="w-full flex items-center justify-center" onMouseEnter={show} onMouseLeave={hide}>
        {children}
      </div>
      {visible && (
        <div className="fixed z-[9999] pointer-events-none" style={{ top: pos.top, left: pos.left, transform: "translateY(-50%)" }}>
          <span className="px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap shadow-lg block">{label}</span>
        </div>
      )}
    </>
  );
};

// ── Chat History Drawer ───────────────────────────────────────────────────────
const ChatHistoryDrawer: React.FC<{
  open: boolean;
  onClose: () => void;
  threads: Thread[];
  activeThreadId?: string | null;
  onThreadSelect?: (id: string, sessionId?: string) => void;
  loading: boolean;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}> = ({ open, onClose, threads, activeThreadId, onThreadSelect, loading, hasMore, loadingMore, onLoadMore }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || !hasMore || loadingMore || loading) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;
    if (nearBottom) onLoadMore?.();
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-[300] bg-black/20 backdrop-blur-[1px]" onClick={onClose} />}
      <div
        className="fixed top-0 left-0 h-full z-[350] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out w-full md:w-[30%]"
        style={{ transform: open ? "translateX(0)" : "translateX(-110%)" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <HistoryIcon />
            <span className="font-semibold text-gray-800 text-[15px]">Chat History</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500" aria-label="Close drawer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-3 py-3">
          {loading ? (
            <div className="flex flex-col gap-2 mt-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" style={{ opacity: 1 - i * 0.12 }} />
              ))}
            </div>
          ) : threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center"><HistoryIcon /></div>
              <p className="text-sm text-gray-500">No chats yet</p>
              <p className="text-xs text-gray-400">Start a new chat to see history here</p>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {threads.map((thread) => {
                const isActive = activeThreadId === thread.id;
                const relative = formatRelativeTime(thread.created_at);
                return (
                  <button
                    key={thread.id}
                    onClick={() => { onThreadSelect?.(thread.id, thread.session_id ?? thread.filter_session_id); onClose(); }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-[13.5px] transition-colors flex items-center gap-2.5 ${
                      isActive ? "bg-[#07213A] text-white font-medium" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    title={thread.title || "Untitled"}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-50">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="truncate flex-1 min-w-0">{thread.title || "Untitled"}</span>
                    {relative && (
                      <span
                        className={`flex-shrink-0 text-[11px] whitespace-nowrap tabular-nums ${
                          isActive ? "text-white/70" : "text-gray-400"
                        }`}
                      >
                        {relative}
                      </span>
                    )}
                  </button>
                );
              })}
              {loadingMore && (
                <div className="flex items-center justify-center py-3">
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
                </div>
              )}
              {!loadingMore && hasMore && (
                <button
                  onClick={() => onLoadMore?.()}
                  className="w-full text-center py-2 text-xs text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Load more
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex-shrink-0 border-t border-gray-100 px-4 py-3">
          <p className="text-xs text-gray-400 text-center">
            {threads.length > 0 ? `${threads.length} conversation${threads.length !== 1 ? "s" : ""}` : ""}
          </p>
        </div>
      </div>
    </>
  );
};

// ── Profile ───────────────────────────────────────────────────────────────────
const SidebarProfile: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.auth?.token);
  const name = useSelector((state: any) => state.auth?.name);
  const image = useSelector((state: any) => state.auth?.image);
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
  if (token && showLogin) setShowLogin(false);
}, [token]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("access_token");
    try {
      dispatch((authaction as any).authLogout?.() ?? { type: "AUTH_LOGOUT" });
    } catch {
      dispatch({ type: "AUTH_LOGOUT" });
    }
    setOpen(false);
  };

  const handleShowLogin = () => {
    setOpen(false);      // close the dropdown
    setShowLogin(true);  // ✅ modal is rendered independently — still mounts
  };

  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
  const localImg = typeof window !== "undefined" ? localStorage.getItem("user_image") : null;
  const avatarSrc =
    image && image !== "null" && image !== null ? imgUrlEndPoint + image
    : localImg && localImg !== "null" ? imgUrlEndPoint + localImg
    : null;

  const initials = name
    ? name.trim().split(/\s+/).slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? "").join("")
    : "T";

  const avatarEl = (
    <button
      onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
      className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center cursor-pointer border-2 border-gray-200 hover:border-gray-400 transition-colors flex-shrink-0 bg-gray-100 focus:outline-none"
      aria-label="Profile menu"
    >
      {avatarSrc
        // eslint-disable-next-line @next/next/no-img-element
        ? <Image
  src={avatarSrc}
  alt={name || "Profile"}
  width={32}
  height={32}
  className="object-cover"
/>
        : <span className="text-[11px] font-bold text-gray-600 select-none">{initials}</span>
      }
    </button>
  );

  // Shared menu items
  const menuItems = !token ? (
    <button
      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
      onClick={handleShowLogin}
    >
      <UserIcon />
      Login / Signup
    </button>
  ) : (
    <>
      <Link href="/dashboard" passHref legacyBehavior>
        <a className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setOpen(false)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          My Trips
        </a>
      </Link>
      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors" onClick={handleLogout}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Logout
      </button>
    </>
  );

  // Collapsed: floating panel to the right
  const floatingDropdown = open && isCollapsed && (
    <div className="absolute z-[400] bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 overflow-hidden" style={{ bottom: 8, left: "calc(100% + 8px)", minWidth: 200 }}>
      {menuItems}
    </div>
  );

  // Expanded: inline panel below trigger
  const inlineDropdown = open && !isCollapsed && (
    <div className="mt-1 rounded-xl border border-gray-100 bg-white shadow-lg overflow-hidden">
      {menuItems}
    </div>
  );

  return (
    <>
      {/* ✅ Portal lives at the TOP LEVEL of the return — completely independent
          of `open` state, so setOpen(false) in handleShowLogin doesn't unmount it */}
      {showLogin && typeof document !== "undefined" && createPortal(
        <>
          <div
            onClick={() => setShowLogin(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 3299 }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff", borderRadius: 16,
              width: "min(480px, 95vw)", maxHeight: "90vh", overflowY: "auto",
              zIndex: 3300, boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            }}
          >
            <LogInModal
              show={showLogin}
              onhide={() => setShowLogin(false)}
              zIndex="3300"
              message="Please login to continue"
            />
          </div>
        </>,
        document.body
      )}

      <div ref={ref} className="w-full">
        {isCollapsed ? (
          <SidebarTooltip label={token ? name || "Profile" : "Login / Signup"}>
            <div className="flex items-center justify-center py-2 w-full relative">
              {avatarEl}
              {floatingDropdown}
            </div>
          </SidebarTooltip>
        ) : (
          <div>
            <div
              className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setOpen((v) => !v)}
            >
              {avatarEl}
              <span className="text-sm font-medium text-gray-700 truncate whitespace-nowrap select-none">
                {token ? name || "My Profile" : "Login / Signup"}
              </span>
              <svg
                className="ml-auto flex-shrink-0 text-gray-400 transition-transform duration-200"
                style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            {inlineDropdown}
          </div>
        )}
      </div>
    </>
  );
};

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

// ── Main Sidebar ──────────────────────────────────────────────────────────────
const Sidebar: React.FC<SidebarProps> = ({
  onNewChat,
  onToggle,
  isCollapsed = true,
  onThreadSelect,
  activeThreadId,
  isComplete,
}) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerLoadingMore, setDrawerLoadingMore] = useState(false);
  const [hasMoreThreads, setHasMoreThreads] = useState(false);
  const userId = useSelector((state: any) => state.auth?.id);

  const THREADS_PAGE_SIZE = 20;

  const fetchThreads = async (after?: string) => {
    if (!userId) return;
    const isInitial = !after;
    if (isInitial) setDrawerLoading(true);
    else setDrawerLoadingMore(true);
    try {
      const params: Record<string, unknown> = {
        limit: THREADS_PAGE_SIZE,
        order: "desc",
      };
      if (after) params.after = after;

      const res = await fetch(CHATKIT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "threads.list",
          params,
          filter_user_id: String(userId),
          // filter_bot: isComplete ? "P2" : "P1",
        }),
      });
      const data = await res.json();
      const next: Thread[] = data.data ?? [];
      setHasMoreThreads(!!data.has_more);
      if (isInitial) {
        setThreads(next);
      } else {
        setThreads((prev) => {
          const seen = new Set(prev.map((t) => t.id));
          const merged = [...prev];
          for (const t of next) if (!seen.has(t.id)) merged.push(t);
          return merged;
        });
      }
    } catch (err) {
      console.error("Failed to fetch threads:", err);
    } finally {
      if (isInitial) setDrawerLoading(false);
      else setDrawerLoadingMore(false);
    }
  };

  const handleLoadMoreThreads = () => {
    if (drawerLoadingMore || drawerLoading || !hasMoreThreads) return;
    const lastId = threads.length > 0 ? threads[threads.length - 1].id : undefined;
    if (!lastId) return;
    fetchThreads(lastId);
  };

  useEffect(() => {
    if (activeThreadId && userId) fetchThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThreadId, userId]);

  const handleChatHistoryClick = () => {
    fetchThreads();
    setDrawerOpen(true);
  };

  return (
    <>
      <ChatHistoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        threads={threads}
        activeThreadId={activeThreadId}
        onThreadSelect={onThreadSelect}
        loading={drawerLoading}
        hasMore={hasMoreThreads}
        loadingMore={drawerLoadingMore}
        onLoadMore={handleLoadMoreThreads}
      />

      {!isCollapsed && <div className="absolute inset-0 z-[150]" onClick={onToggle} />}

      <div
        className="absolute left-0 top-0 h-full flex flex-col bg-white overflow-visible z-[160] shadow-md flex-shrink-0 transition-all duration-300 ease-in-out"
        style={{ width: isCollapsed ? 64 : "14rem" }}
      >
        {/* Logo */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100 flex items-center" style={{ minHeight: 56 }}>
          {!isCollapsed ? (
            <div className="flex items-center gap-2 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logoblack.svg" height={22} width={22} alt="logo" />
              <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">thetarzanway</span>
            </div>
          ) : (
            <SidebarTooltip label="thetarzanway">
              <div className="flex items-center justify-center w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logoblack.svg" height={22} width={22} alt="logo" />
              </div>
            </SidebarTooltip>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-[200]"
          style={{ top: 36, right: -14, width: 28, height: 28, borderRadius: "50%", background: "#07213A", border: "2px solid #fff", boxShadow: "0 2px 8px rgba(7,33,58,0.18)", color: "#fff" }}
        >
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-visible">

          <div className="mt-1">
            <SidebarProfile isCollapsed={isCollapsed} />
          </div>
          
          {isCollapsed ? (
            <SidebarTooltip label="New Chat">
              <button onClick={onNewChat} className="w-full flex items-center justify-center py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors mb-1">
                <NewChatIcon />
              </button>
            </SidebarTooltip>
          ) : (
            <button onClick={onNewChat} className="w-full flex items-center gap-3 px-2 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors mb-1">
              <NewChatIcon /><span className="whitespace-nowrap">New Chat</span>
            </button>
          )}

          {isCollapsed ? (
            <SidebarTooltip label="Chat History">
              <button onClick={handleChatHistoryClick} className="w-full flex items-center justify-center py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors mb-1">
                <HistoryIcon />
              </button>
            </SidebarTooltip>
          ) : (
            <button onClick={handleChatHistoryClick} className="w-full flex items-center gap-3 px-2 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors mb-1">
              <HistoryIcon /><span className="whitespace-nowrap">Chat History</span>
            </button>
          )}

          
        </nav>
      </div>

      <div className="flex-shrink-0" style={{ width: 64 }} />
    </>
  );
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const NewChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none" className="flex-shrink-0">
    <path d="M8.30612 1.52887L6.80613 1.52354C3.05615 1.51021 1.55083 3.00487 1.5375 6.75485L1.52151 11.2548C1.50818 15.0048 3.00284 16.5101 6.75282 16.5234L11.2528 16.5394C15.0028 16.5528 16.5081 15.0581 16.5214 11.3081L16.5267 9.80814" stroke="#07213A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.15411 8.19642C5.92831 8.42062 5.70174 8.86231 5.6556 9.18465L5.32508 11.441C5.20217 12.2581 5.77764 12.8301 6.59554 12.7205L8.85417 12.406C9.16933 12.3622 9.61262 12.1387 9.84592 11.9146L15.7769 6.0256C16.8005 5.00923 17.2847 3.82595 15.7901 2.32063C14.2954 0.815305 13.1087 1.29109 12.0851 2.30746L6.15411 8.19642Z" stroke="#07213A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.2358 3.15234C11.732 4.94662 13.1295 6.35409 14.9277 6.87049" stroke="#07213A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="flex-shrink-0">
    <path d="M10.0306 11.7021C9.57231 11.7004 9.18067 11.5357 8.85572 11.2079C8.53022 10.8806 8.36828 10.4878 8.36991 10.0295C8.37154 9.57114 8.53626 9.17923 8.86409 8.85372C9.19136 8.52877 9.58416 8.36711 10.0425 8.36874C10.5008 8.37037 10.8927 8.53482 11.2182 8.86209C11.5432 9.18991 11.7048 9.58299 11.7032 10.0413C11.7016 10.4996 11.5371 10.8913 11.2099 11.2162C10.882 11.5417 10.489 11.7037 10.0306 11.7021ZM10.0099 17.5353C8.07937 17.5285 6.40802 16.887 4.99588 15.6109C3.58374 14.3353 2.77689 12.7457 2.57532 10.8422L4.28364 10.8483C4.47295 12.2934 5.11092 13.4901 6.19756 14.4384C7.28475 15.3868 8.55751 15.8635 10.0158 15.8687C11.6408 15.8745 13.0212 15.3133 14.1568 14.1851C15.2931 13.0574 15.8641 11.6811 15.8699 10.0561C15.8756 8.43114 15.3144 7.05052 14.1862 5.91428C13.0586 4.7786 11.6823 4.20787 10.0573 4.2021C9.09897 4.19869 8.20235 4.41773 7.36744 4.85921C6.53254 5.30069 5.82898 5.90931 5.25677 6.68505L7.54843 6.6932L7.5425 8.35985L2.54254 8.34209L2.5603 3.34212L4.22696 3.34804L4.22 5.30636C4.93149 4.42 5.79865 3.73557 6.82148 3.25309C7.84376 2.77061 8.92434 2.5314 10.0632 2.53544C11.1049 2.53915 12.08 2.74039 12.9886 3.13918C13.8966 3.53852 14.6864 4.07605 15.3579 4.75177C16.0288 5.42805 16.5607 6.22161 16.9536 7.13246C17.3459 8.04386 17.5402 9.02039 17.5365 10.0621C17.5328 11.1037 17.3316 12.0786 16.9328 12.9866C16.5334 13.8952 15.9959 14.6849 15.3202 15.3559C14.6439 16.0274 13.8503 16.5595 12.9395 16.9524C12.0281 17.3447 11.0516 17.5391 10.0099 17.5353Z" fill="#07213A"/>
  </svg>
);

export default Sidebar;