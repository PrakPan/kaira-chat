import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as authaction from "../../../../store/actions/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { createPortal } from "react-dom";
import Image from "next/image";
import { getPlatform } from "../../hooks/useChat";
import BotLoginModal from "../BotLoginModal";
import {
  getUserAvatarColor,
  getUserInitial,
  clearUserAvatarColor,
} from "../../utils/avatarColor";
import {
  Thread,
  formatCompactTime,
  groupThreads,
} from "../../utils/threadGroups";
import { LOGO_HEIGHT } from "../../constants";
import {
  ChevronIcon,
  HistoryIcon,
  LogoutIcon,
  MapIcon,
  PlusIcon,
  SuitcaseIcon,
  UserIcon,
} from "../kairaIcons";
import { useTripsCount } from "../../hooks/useTripsCount";

const CHATKIT_API_URL = "https://chat.tarzanway.com/chatkit";

const SIDEBAR_WIDTH_EXPANDED = 288;
const SIDEBAR_WIDTH_COLLAPSED = 76;

/**
 * Controls inside the collapsed rail keep their own action and must not also
 * trigger the rail's click-to-open, which would toggle it a second time.
 */
const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

interface SidebarProps {
  onNewChat?: () => void;
  onToggle?: () => void;
  isCollapsed?: boolean;
  onThreadSelect?: (
    threadId: string,
    sessionId?: string,
    customerName?: string,
  ) => void;
  activeThreadId?: string | null;
  /** True when itinerary is fully created (P2), false/undefined = P1 */
  isComplete?: boolean;
  onLoginSuccess?: () => void | Promise<void>;
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

  useEffect(() => {
    if (disabled) setVisible(false);
  }, [disabled]);

  return (
    <>
      <div
        ref={ref}
        className="w-full flex items-center justify-center"
        onMouseEnter={show}
        onMouseLeave={hide}
        onClick={hide}
      >
        {children}
      </div>
      {visible && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: pos.top,
            left: pos.left,
            transform: "translateY(-50%)",
          }}
        >
          <span className="px-2.5 py-1.5 bg-gray-900 text-white ttw-type-small rounded-lg whitespace-nowrap shadow-lg block">
            {label}
          </span>
        </div>
      )}
    </>
  );
};

// ── Chat history list ─────────────────────────────────────────────────────────
const ChatHistoryList: React.FC<{
  threads: Thread[];
  activeThreadId?: string | null;
  onThreadSelect?: (
    id: string,
    sessionId?: string,
    customerName?: string,
  ) => void;
  loading: boolean;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}> = ({
  threads,
  activeThreadId,
  onThreadSelect,
  loading,
  hasMore,
  loadingMore,
  onLoadMore,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || !hasMore || loadingMore || loading) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;
    if (nearBottom) onLoadMore?.();
  };

  if (loading) {
    return (
      <div className="kaira-hist-scroll">
        <div className="flex flex-col gap-1.5 pt-3 px-1">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-9 rounded-[10px] animate-pulse"
              style={{ background: "var(--k-paper-2)", opacity: 1 - i * 0.12 }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="kaira-hist-scroll">
        <div className="flex flex-col items-center justify-center text-center gap-1.5 px-3 py-10">
          <p style={{ fontSize: 13.5, fontWeight: 600 }}>No chats yet</p>
          <p style={{ fontSize: 12.5, color: "var(--k-ink-4)" }}>
            Start a new chat to see history here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} onScroll={handleScroll} className="kaira-hist-scroll">
      {groupThreads(threads).map((group) => (
        <div key={group.label} className="mb-1.5">
          <div className="kaira-mono kaira-hist-group-label">{group.label}</div>
          {group.threads.map((thread) => {
            const isActive = activeThreadId === thread.id;
            return (
              <button
                key={thread.id}
                onClick={() =>
                  onThreadSelect?.(
                    thread.id,
                    thread.session_id ?? thread.filter_session_id,
                    thread.customer_name,
                  )
                }
                className={`kaira-hist-item${isActive ? " is-active" : ""}`}
                title={thread.title || "Untitled"}
              >
                <span className="kaira-hist-title">
                  {thread.title || "Untitled"}
                </span>
                {thread.itinerary_created && (
                  <span className="kaira-hist-marker" title="Itinerary created">
                    <MapIcon />
                  </span>
                )}
                <span className="kaira-hist-time kaira-mono tabular-nums">
                  {formatCompactTime(thread.created_at)}
                </span>
              </button>
            );
          })}
        </div>
      ))}

      {loadingMore && (
        <div className="flex items-center justify-center py-3">
          <div
            className="h-4 w-4 rounded-full animate-spin"
            style={{
              border: "2px solid var(--k-ink-6)",
              borderTopColor: "var(--k-ink-3)",
            }}
          />
        </div>
      )}
      {!loadingMore && hasMore && (
        <button
          onClick={() => onLoadMore?.()}
          className="kaira-mono w-full text-center py-2"
          style={{ color: "var(--k-ink-4)", background: "none", border: "none" }}
        >
          Load more
        </button>
      )}
    </div>
  );
};

// ── Footer (my trips · profile · log out) ─────────────────────────────────────
const SidebarFooter: React.FC<{
  isCollapsed: boolean;
  onLoginSuccess?: () => void | Promise<void>;
}> = ({ isCollapsed, onLoginSuccess }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.auth?.token);
  const name = useSelector((state: any) => state.auth?.name);
  const image = useSelector((state: any) => state.auth?.image);
  const [showLogin, setShowLogin] = useState(false);
  const tripsCount = useTripsCount();
  const [localImg, setLocalImg] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("user_image") : null,
  );

  useEffect(() => {
    if (token && showLogin) setShowLogin(false);
  }, [token]);

  useEffect(() => {
    if (token) {
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem("user_image")
          : null;
      setLocalImg(stored);
    } else {
      setLocalImg(null);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_image");
    clearUserAvatarColor(); // ← next user gets a fresh letter-avatar color
    setLocalImg(null); // ← clears the avatar immediately
    try {
      dispatch((authaction as any).authLogout?.() ?? { type: "AUTH_LOGOUT" });
    } catch {
      dispatch({ type: "AUTH_LOGOUT" });
    }
  };

  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
  const avatarSrc = token
    ? image && image !== "null" && image !== null
      ? imgUrlEndPoint + image
      : localImg && localImg !== "null"
        ? imgUrlEndPoint + localImg
        : null
    : null;

  // Logged in with no picture → colored letter avatar (Google-Workspace style).
  // The color is persisted in localStorage so it never changes.
  const showColorAvatar = !!token && !avatarSrc;
  const [avatarColor, setAvatarColor] = useState<string | null>(null);
  useEffect(() => {
    setAvatarColor(showColorAvatar ? getUserAvatarColor(name) : null);
  }, [showColorAvatar, name]);

  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w: string) => w[0]?.toUpperCase() ?? "")
        .join("")
    : "T";

  const avatar = (
    <div
      className="kaira-avatar"
      style={avatarColor ? { background: avatarColor } : undefined}
      title={name || "Profile"}
    >
      {avatarSrc ? (
        <Image
          src={avatarSrc}
          alt={name || "Profile"}
          width={34}
          height={34}
          className="object-cover"
        />
      ) : showColorAvatar ? (
        getUserInitial(name)
      ) : (
        initials
      )}
    </div>
  );

  const loginModal =
    showLogin &&
    typeof document !== "undefined" &&
    createPortal(
      <>
        <div
          onClick={() => setShowLogin(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 3299,
          }}
        />
        <div onClick={(e) => e.stopPropagation()}>
          <BotLoginModal
            show={showLogin}
            onhide={() => setShowLogin(false)}
            zIndex="3300"
            message="Please login to continue"
            onSuccess={async () => {
              await onLoginSuccess?.();
            }}
          />
        </div>
      </>,
      document.body,
    );

  // Logged out — the CTA takes the whole footer slot.
  if (!token) {
    return (
      <>
        {loginModal}
        {isCollapsed ? (
          <SidebarTooltip label="Login / Signup" disabled={showLogin}>
            <button
              className="kaira-icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowLogin(true);
              }}
              aria-label="Login / Signup"
            >
              <UserIcon />
            </button>
          </SidebarTooltip>
        ) : (
          <button
            className="kaira-login-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowLogin(true);
            }}
          >
            <UserIcon />
            Login / Signup
          </button>
        )}
      </>
    );
  }

  if (isCollapsed) {
    return (
      <>
        {loginModal}
        <div className="flex flex-col items-center gap-1.5">
          <SidebarTooltip label={name || "Profile"}>{avatar}</SidebarTooltip>
          <SidebarTooltip
            label={tripsCount !== null ? `My trips (${tripsCount})` : "My trips"}
          >
            <Link href="/dashboard" passHref legacyBehavior>
              <a
                className="kaira-icon-btn"
                aria-label="My trips"
                onClick={stopPropagation}
              >
                <span className="kaira-trips-tile is-lg">
                  <SuitcaseIcon size={18} />
                </span>
              </a>
            </Link>
          </SidebarTooltip>
          {/* No log out here — it lives in the expanded footer only, so a
              stray tap on the narrow rail can't sign the user out. */}
        </div>
      </>
    );
  }

  return (
    <>
      {loginModal}
      <div className="kaira-profile-row">
        {avatar}
        <div className="flex-1 min-w-0">
          <div className="kaira-profile-name">{name || "My Profile"}</div>
          <div className="kaira-mono kaira-profile-meta">Signed in</div>
        </div>
      </div>

      <Link href="/dashboard" passHref legacyBehavior>
        <a className="kaira-footer-link">
          <span className="kaira-trips-tile">
            <SuitcaseIcon />
          </span>
          My trips
          {tripsCount !== null && (
            <span className="kaira-count">{tripsCount}</span>
          )}
        </a>
      </Link>

      <button className="kaira-logout-btn" onClick={handleLogout}>
        <span className="kaira-logout-tile">
          <LogoutIcon size={15} />
        </span>
        Log out
      </button>
    </>
  );
};

// ── Main Sidebar ──────────────────────────────────────────────────────────────
const Sidebar: React.FC<SidebarProps> = ({
  onNewChat,
  onToggle,
  isCollapsed = true,
  onThreadSelect,
  activeThreadId,
  isComplete,
  onLoginSuccess,
}) => {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreThreads, setHasMoreThreads] = useState(false);
  const userId = useSelector((state: any) => state.auth?.id);
  const isLoggedIn = !!userId;

  const THREADS_PAGE_SIZE = 20;

  const fetchThreads = async (after?: string) => {
    if (!userId) return;
    const isInitial = !after;
    if (isInitial) setLoading(true);
    else setLoadingMore(true);
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
          platform: getPlatform(),
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
      if (isInitial) setLoading(false);
      else setLoadingMore(false);
    }
  };

  const handleLoadMoreThreads = () => {
    if (loadingMore || loading || !hasMoreThreads) return;
    const lastId =
      threads.length > 0 ? threads[threads.length - 1].id : undefined;
    if (!lastId) return;
    fetchThreads(lastId);
  };

  // History is now always on screen when expanded, so it loads as soon as we
  // know the user — not only once a thread is active. On logout, wipe the
  // previous session's threads so they can't linger in memory (and can't flash
  // for the next user who signs in before their own fetch lands).
  useEffect(() => {
    if (userId) {
      fetchThreads();
    } else {
      setThreads([]);
      setHasMoreThreads(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThreadId, userId]);

  // Anywhere on the collapsed rail opens it. Expanded, the rail is inert —
  // clicking outside it (the backdrop below) is what closes it again.
  const handleRailClick = () => {
    if (isCollapsed) onToggle?.();
  };

  return (
    <>
      {!isCollapsed && (
        <div className="absolute inset-0 z-[150]" onClick={onToggle} />
      )}

      <aside
        onClick={handleRailClick}
        className={`kaira-scope kaira-sidebar absolute left-0 top-0 h-full flex flex-col overflow-hidden z-[160] flex-shrink-0 transition-all duration-300 ease-in-out${
          isCollapsed ? " is-collapsed" : ""
        }`}
        style={{
          width: isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
        }}
      >
        {/* Logo */}
        <div className={`kaira-logo-row${isCollapsed ? " is-collapsed" : ""}`}>
          {isCollapsed ? (
            <SidebarTooltip label="The Tarzan Way">
              <div
                className="flex items-center justify-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/");
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo/ttw-mark.svg"
                  height={LOGO_HEIGHT.DESKTOP}
                  width={LOGO_HEIGHT.DESKTOP}
                  alt="The Tarzan Way"
                />
              </div>
            </SidebarTooltip>
          ) : (
            <>
              <div
                className="flex items-center overflow-hidden cursor-pointer min-w-0"
                onClick={() => router.push("/")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo/ttw-lockup.svg"
                  height={LOGO_HEIGHT.DESKTOP}
                  alt="The Tarzan Way"
                  style={{ height: LOGO_HEIGHT.DESKTOP, width: "auto" }}
                />
              </div>
              <button
                onClick={onToggle}
                className="kaira-collapse-btn ml-auto"
                aria-label="Collapse sidebar"
              >
                <ChevronIcon direction="left" size={15} />
              </button>
            </>
          )}
        </div>

        {/* Expand */}
        {isCollapsed && (
          <div className="flex justify-center pb-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle?.();
              }}
              className="kaira-collapse-btn is-standalone"
              aria-label="Expand sidebar"
            >
              <ChevronIcon direction="right" size={18} />
            </button>
          </div>
        )}

        {/* New chat */}
        {isCollapsed ? (
          <div className="flex justify-center pb-3">
            <SidebarTooltip label="New chat">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNewChat?.();
                }}
                className="kaira-newchat-icon-btn"
                aria-label="New chat"
              >
                <PlusIcon size={18} />
              </button>
            </SidebarTooltip>
          </div>
        ) : (
          <div className="px-3.5 pb-3">
            <button onClick={onNewChat} className="kaira-newchat-btn">
              <PlusIcon size={17} className="kaira-nc-icon" />
              New chat
            </button>
          </div>
        )}

        {/* Recent chats — only when signed in. Logged out there's no history
            to show, so we drop the section and let a spacer hold the footer at
            the bottom (the list/icon block is what normally grows to fill). */}
        {!isLoggedIn ? (
          <div className="flex-1" />
        ) : isCollapsed ? (
          <div className="flex-1 flex flex-col items-center pt-0.5">
            <SidebarTooltip label="Recent chats">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle?.();
                }}
                className="kaira-icon-btn is-boxed"
                aria-label="Recent chats"
              >
                <HistoryIcon size={18} />
              </button>
            </SidebarTooltip>
          </div>
        ) : (
          <>
            <div className="kaira-hist-header">
              <HistoryIcon size={13} />
              <span className="kaira-mono">Recent chats</span>
            </div>
            <ChatHistoryList
              threads={threads}
              activeThreadId={activeThreadId}
              onThreadSelect={onThreadSelect}
              loading={loading}
              hasMore={hasMoreThreads}
              loadingMore={loadingMore}
              onLoadMore={handleLoadMoreThreads}
            />
          </>
        )}

        {/* Footer */}
        <div className={`kaira-footer${isCollapsed ? " is-collapsed" : ""}`}>
          <SidebarFooter
            isCollapsed={isCollapsed}
            onLoginSuccess={onLoginSuccess}
          />
        </div>
      </aside>

      <div
        className="flex-shrink-0"
        style={{ width: SIDEBAR_WIDTH_COLLAPSED }}
      />
    </>
  );
};

export default Sidebar;
