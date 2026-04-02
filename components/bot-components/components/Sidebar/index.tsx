import React, { useEffect, useState } from "react";

const CHATKIT_API_URL = "https://chat.tarzanway.com/chatkit";

interface Thread {
  id: string;
  title: string;
  created_at: string;
}

interface SidebarProps {
  onNewChat?: () => void;
  onToggle?: () => void;
  isCollapsed?: boolean;
  onThreadSelect?: (threadId: string) => void;
  activeThreadId?: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  onNewChat,
  onToggle,
  isCollapsed = true,
  onThreadSelect,
  activeThreadId,
}) => {
  const [threads, setThreads] = useState<Thread[]>([]);

  const fetchThreads = async (sessionId: string) => {
    const currentMatch = window.location.pathname.match(/\/chat\/([a-f0-9-]+)/);
  if (currentMatch) {
    window.history.replaceState({}, "", `/chat/${sessionId}`);
  } else {
    window.history.pushState({}, "", `/chat/${sessionId}`);
  }

    try {
      const res = await fetch(CHATKIT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "threads.list",
          params: { limit: 9999, order: "desc" },
          filter_session_id: sessionId,
        }),
      });
      const data = await res.json();
      setThreads(data.data ?? []);
    } catch (err) {
      console.error("Failed to fetch threads:", err);
    }
  };

  const getSessionId = (): string | null => {
    // Try URL first
    const match = window.location.pathname.match(/\/chat\/([a-f0-9-]+)/);
    if (match) return match[1];
    // Fall back to sessionStorage (covers /chat with no sessionId yet)
    const keys = Object.keys(sessionStorage).filter(k =>
      k.startsWith("chatkit_session_")
    );
    for (const key of keys) {
      const val = sessionStorage.getItem(key);
      if (val) return val;
    }
    return null;
  };

  // Load threads on mount
  useEffect(() => {
    const sessionId = getSessionId();
    if (sessionId) fetchThreads(sessionId);
  }, []);

  // Reload threads whenever activeThreadId changes (new chat created)
  useEffect(() => {
    if (!activeThreadId) return;
    const sessionId = getSessionId();
    if (sessionId) fetchThreads(sessionId);
  }, [activeThreadId]);

  const handleChatHistoryClick = () => {
    // Expand sidebar if collapsed so threads become visible
    if (isCollapsed) onToggle?.();
    // Refresh thread list
    const sessionId = getSessionId();
    if (sessionId) fetchThreads(sessionId);
  };

  return (
    <>
      {!isCollapsed && (
        <div className="absolute inset-0 z-[150]" onClick={onToggle} />
      )}

      <div
        className="absolute left-0 top-0 h-full flex flex-col bg-white overflow-visible pb-[50px] z-[160] shadow-md flex-shrink-0 transition-all duration-300 ease-in-out"
        style={{ width: isCollapsed ? 64 : "14rem"}}
      >
        {/* Logo + Toggle */}
        <div
          className="flex-shrink-0 px-4 py-3 border-b border-gray-100 flex items-center"
          style={{ minHeight: 56 }}
        >
          {!isCollapsed ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <img src="/logoblack.svg" height={22} width={22} alt="logo" />
              <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                thetarzanway
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <img src="/logoblack.svg" height={22} width={22} alt="logo" />
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-[200]"
          style={{
            top: 36,
            right: -14,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#07213A",
            border: "2px solid #fff",
            boxShadow: "0 2px 8px rgba(7,33,58,0.18)",
            color: "#fff",
          }}
        >
          <svg
            width={13}
            height={13}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Navigation */}
       <nav
  className={`flex-1 px-3 py-4 ${
    isCollapsed ? "overflow-hidden" : "overflow-y-auto"
  }`}
>
          {/* New Chat */}
          <button
            onClick={onNewChat}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center px-0" : "gap-3 px-2"
            } py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors mb-1 group relative`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none" className="flex-shrink-0">
              <path d="M8.30612 1.52887L6.80613 1.52354C3.05615 1.51021 1.55083 3.00487 1.5375 6.75485L1.52151 11.2548C1.50818 15.0048 3.00284 16.5101 6.75282 16.5234L11.2528 16.5394C15.0028 16.5528 16.5081 15.0581 16.5214 11.3081L16.5267 9.80814" stroke="#07213A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.15411 8.19642C5.92831 8.42062 5.70174 8.86231 5.6556 9.18465L5.32508 11.441C5.20217 12.2581 5.77764 12.8301 6.59554 12.7205L8.85417 12.406C9.16933 12.3622 9.61262 12.1387 9.84592 11.9146L15.7769 6.0256C16.8005 5.00923 17.2847 3.82595 15.7901 2.32063C14.2954 0.815305 13.1087 1.29109 12.0851 2.30746L6.15411 8.19642Z" stroke="#07213A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.2358 3.15234C11.732 4.94662 13.1295 6.35409 14.9277 6.87049" stroke="#07213A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!isCollapsed && <span className="whitespace-nowrap">New Chat</span>}
            {isCollapsed && (
              <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                New Chat
              </span>
            )}
          </button>

          {/* Chat History */}
          <button
            onClick={handleChatHistoryClick}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center px-0" : "gap-3 px-2"
            } py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors group relative`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="flex-shrink-0">
              <path d="M10.0306 11.7021C9.57231 11.7004 9.18067 11.5357 8.85572 11.2079C8.53022 10.8806 8.36828 10.4878 8.36991 10.0295C8.37154 9.57114 8.53626 9.17923 8.86409 8.85372C9.19136 8.52877 9.58416 8.36711 10.0425 8.36874C10.5008 8.37037 10.8927 8.53482 11.2182 8.86209C11.5432 9.18991 11.7048 9.58299 11.7032 10.0413C11.7016 10.4996 11.5371 10.8913 11.2099 11.2162C10.882 11.5417 10.489 11.7037 10.0306 11.7021ZM10.0099 17.5353C8.07937 17.5285 6.40802 16.887 4.99588 15.6109C3.58374 14.3353 2.77689 12.7457 2.57532 10.8422L4.28364 10.8483C4.47295 12.2934 5.11092 13.4901 6.19756 14.4384C7.28475 15.3868 8.55751 15.8635 10.0158 15.8687C11.6408 15.8745 13.0212 15.3133 14.1568 14.1851C15.2931 13.0574 15.8641 11.6811 15.8699 10.0561C15.8756 8.43114 15.3144 7.05052 14.1862 5.91428C13.0586 4.7786 11.6823 4.20787 10.0573 4.2021C9.09897 4.19869 8.20235 4.41773 7.36744 4.85921C6.53254 5.30069 5.82898 5.90931 5.25677 6.68505L7.54843 6.6932L7.5425 8.35985L2.54254 8.34209L2.5603 3.34212L4.22696 3.34804L4.22 5.30636C4.93149 4.42 5.79865 3.73557 6.82148 3.25309C7.84376 2.77061 8.92434 2.5314 10.0632 2.53544C11.1049 2.53915 12.08 2.74039 12.9886 3.13918C13.8966 3.53852 14.6864 4.07605 15.3579 4.75177C16.0288 5.42805 16.5607 6.22161 16.9536 7.13246C17.3459 8.04386 17.5402 9.02039 17.5365 10.0621C17.5328 11.1037 17.3316 12.0786 16.9328 12.9866C16.5334 13.8952 15.9959 14.6849 15.3202 15.3559C14.6439 16.0274 13.8503 16.5595 12.9395 16.9524C12.0281 17.3447 11.0516 17.5391 10.0099 17.5353Z" fill="#07213A"/>
            </svg>
            {!isCollapsed && <span className="whitespace-nowrap">Chat History</span>}
            {isCollapsed && (
              <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                Chat History
              </span>
            )}
          </button>

          {/* Thread list */}
          {!isCollapsed && threads.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider mb-1.5 px-2">
                Chats
              </p>
              <div className="flex flex-col gap-0.5">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => onThreadSelect?.(thread.id)}
                    className={`w-full text-left px-2 py-2 rounded-lg text-[13px] transition-colors truncate ${
                      activeThreadId === thread.id
                        ? "bg-slate-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
                    }`}
                    title={thread.title || "Untitled"}
                  >
                    {thread.title || "Untitled"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>

      <div className="flex-shrink-0" style={{ width: 64 }} />
    </>
  );
};

export default Sidebar;