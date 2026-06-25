import React, { useState, useCallback, useEffect, useRef } from "react";
import { MessageInputBox } from "../MessageInputBox";
import type { AttachmentFile } from "../ChatKitPanel";
import { useSelector } from "react-redux";
import StartScreen from "../StartScreen";
import BotLoginModal from "../BotLoginModal";
import type { ThemeConfig } from "../../types/themeConfig";

const CHATKIT_API_URL = "https://chat.tarzanway.com/chatkit";

// Right-pane design ported from chat-empty-v4 reference. Scoped under `.cws-root`
// so the generic class names (.chip, .trust-line, etc.) can't leak globally.
const CWS_STYLES = `
.cws-root {
  --yellow: #f7e700;
  --ink: #0b1220;
  --ink-rail: #0f1a2e;
  --ink-2: #1a2436;
  --ink-3: #445069;
  --ink-4: #8a93a6;
  --line: #ececec;
  --line-soft: #f4f3ec;
  --bg-2: #fafaf5;
  --peach: #ffede0;
  --coral: #ff9d6e;
  --mint: #e0f2e9;
  --sky-a: #a8d2f5;
  --sky-b: #7ab8e8;
  --green: #1f8a5a;
  background: var(--bg-2);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--ink);
}
.cws-serif { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; letter-spacing: -0.015em; }

/* scroll area — mirrors .pane-right-inner: top-aligned with top spacing,
   bottom content scrolls when it doesn't fit. */
.cws-pane-inner {
  flex: 1; min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 56px 32px 18px;
  overflow-y: auto;
}
.cws-pane-inner::-webkit-scrollbar { display: none; }
@media (max-width: 900px) {
  .cws-pane-inner { padding: 40px 22px 24px; }
}

/* hero */
.cws-kaira-hero {
  display: flex; flex-direction: column;
  align-items: center; text-align: center;
  margin-bottom: 20px;
}
.cws-kaira-portrait {
  position: relative;
  width: 152px; height: 152px;
  margin-bottom: 18px;
  flex-shrink: 0;
}
.cws-kaira-portrait-ring {
  position: absolute; inset: -5px; border-radius: 50%;
  background: conic-gradient(from 0deg, var(--yellow) 0deg, var(--coral) 90deg, #ff6b9d 180deg, var(--peach) 270deg, var(--yellow) 360deg);
  animation: cwsKairaSpin 8s linear infinite;
  z-index: 1; filter: blur(0.5px);
}
@keyframes cwsKairaSpin { to { transform: rotate(360deg); } }
.cws-kaira-portrait-img {
  position: relative; z-index: 2;
  width: 100%; height: 100%;
  border-radius: 50%; object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 10px 26px -8px rgba(11,18,32,0.22);
  display: block;
  background: linear-gradient(180deg, var(--sky-a), var(--sky-b));
}
.cws-kaira-portrait-dot {
  position: absolute; bottom: 3px; right: 3px; z-index: 3;
  width: 20px; height: 20px;
  background: var(--green); border: 3px solid white; border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(31,138,90,0.18);
  animation: cwsDotPulse 2.4s ease-in-out infinite;
}
@keyframes cwsDotPulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(31,138,90,0.18); }
  50% { box-shadow: 0 0 0 6px rgba(31,138,90,0.05); }
}
.cws-kaira-portrait-bubble {
  position: absolute; top: -8px; right: -10px; z-index: 4;
  width: 36px; height: 36px;
  background: white; border-radius: 50%;
  display: grid; place-items: center;
  box-shadow: 0 6px 16px -4px rgba(11,18,32,0.18);
  font-size: 18px;
  animation: cwsBubbleFloat 3.6s ease-in-out infinite;
}
@keyframes cwsBubbleFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.cws-live-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 11px;
  background: var(--mint); color: var(--green);
  border-radius: 999px; font-size: 11.5px; font-weight: 700;
  margin-bottom: 12px;
}
.cws-live-pill .cws-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--green);
  animation: cwsLiveBlink 2s ease-in-out infinite;
}
@keyframes cwsLiveBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.cws-usp-kicker {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 12px;
  background: var(--ink); color: var(--yellow);
  border-radius: 999px;
  font-size: 10.5px; font-weight: 800;
  letter-spacing: 0.08em; text-transform: uppercase;
  margin-bottom: 14px;
}
.cws-usp-icon { width: 11px; height: 11px; }
.cws-usp-icon svg { width: 100%; height: 100%; }
.cws-kaira-hero h1 {
  font-size: 34px; font-weight: 800;
  letter-spacing: -0.03em; line-height: 1.02;
  margin-bottom: 10px; max-width: 440px;
}
@media (max-width: 480px) { .cws-kaira-hero h1 { font-size: 28px; line-height: 1.06; } }
.cws-kaira-hero h1 .cws-serif { font-weight: 400; }
.cws-kaira-hero h1 .cws-hl { position: relative; display: inline-block; padding: 0 4px; }
.cws-kaira-hero h1 .cws-hl::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 3px;
  height: 9px; background: var(--yellow); z-index: -1;
  opacity: 0.85; transform: skewX(-6deg);
}
.cws-kaira-hero p {
  font-size: 14px; color: var(--ink-3);
  line-height: 1.5; max-width: 380px;
}
.cws-kaira-hero p b { color: var(--ink); font-weight: 600; }

/* input — mirrors .chat-input spacing */
.cws-input-wrap { margin-bottom: 12px; }

/* chips */
.cws-chip-row {
  display: flex; flex-wrap: wrap;
  gap: 6px; margin-bottom: 0;
}
.cws-chip {
  padding: 6px 11px;
  background: white; border: 1px solid var(--line);
  border-radius: 999px;
  font-family: inherit; font-size: 12px;
  color: var(--ink-2); cursor: pointer;
  transition: all 0.15s;
  display: inline-flex; align-items: center; gap: 5px;
  text-align: left;
}
.cws-chip:hover { background: var(--yellow); border-color: var(--yellow); color: var(--ink); }
.cws-chip-icon { font-size: 13px; line-height: 1; }

/* how it works */
.cws-hiw-strip {
  margin-top: 14px;
  padding: 16px 18px;
  background: white; border: 1px solid var(--line);
  border-radius: 16px;
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 4px; position: relative;
}
.cws-hiw-step { text-align: center; padding: 4px 8px; position: relative; }
.cws-hiw-step + .cws-hiw-step::before {
  content: ''; position: absolute; left: -2px; top: 14px;
  width: 12px; height: 2px; background: var(--line);
}
.cws-hiw-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px;
  background: var(--yellow); color: var(--ink);
  border-radius: 50%;
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-weight: 600; font-size: 14px; line-height: 1;
  margin-bottom: 6px;
}
.cws-hiw-text {
  font-size: 12px; color: var(--ink); font-weight: 600;
  letter-spacing: -0.005em; line-height: 1.3;
}
.cws-hiw-text .cws-sub {
  display: block; font-size: 10.5px;
  color: var(--ink-4); font-weight: 500; margin-top: 2px;
}

/* get inspired (mobile) — pinned bottom bar, stays put while content scrolls */
.cws-inspire-cta {
  flex-shrink: 0;
  width: 100%;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 14px;
  border: 0; border-top: 1px solid var(--line);
  background: #F7ECFF; color: #922ADC;
  font-family: inherit; font-size: 14px; font-weight: 600;
  cursor: pointer;
}
@media (min-width: 768px) { .cws-inspire-cta { display: none !important; } }
`;

function getAuthToken(): string | null {
  return (
    localStorage.getItem("token") ??
    localStorage.getItem("authToken") ??
    localStorage.getItem("access_token") ??
    null
  );
}

interface ChatWelcomeScreenProps {
  onSubmit?: (message: string, attachmentIds?: string[]) => void;
  onChatStart?: () => void;
  themeConfig?: ThemeConfig;
  /** Mobile-only: rendered to the right of the logo in the welcome-screen
   *  header. Lets BotApp inject MobileHeaderMenu so the chat tab keeps the
   *  history/new-chat/profile actions accessible even though the global
   *  MobileHeader is hidden on the chat tab. */
  mobileMenu?: React.ReactNode;
}

const ChatWelcomeScreen: React.FC<ChatWelcomeScreenProps> = ({ onSubmit, onChatStart, mobileMenu, themeConfig }) => {
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [showInspiration, setShowInspiration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  // Action to resume once the user logs in (submit / chip / inspiration prompt)
  const pendingActionRef = useRef<(() => void) | null>(null);

  // Lock body scroll while the bottom sheet is open
  useEffect(() => {
    if (!showInspiration) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showInspiration]);

  const handleInspirationSelect = (prompt: string) => {
    setShowInspiration(false);
    runWhenAuthed(() => onSubmit?.(prompt));
  };

  const reduxToken = useSelector((state: any) => state.auth.token);
  const reduxUserId = useSelector((state: any) => state.auth.id);
  const authToken = reduxToken ?? getAuthToken();
  const isLoggedIn = !!authToken;

  // Gate any user action behind login. If logged out, stash the action and
  // open the login modal — it resumes automatically on successful login.
  const runWhenAuthed = (action: () => void) => {
    if (!isLoggedIn) {
      pendingActionRef.current = action;
      setShowLogin(true);
      return;
    }
    action();
  };

  const handleSubmit = () => {
    const val = inputValue.trim();
    const uploadedAttachments = attachments.filter((a) => a.status === "uploaded");
    if (!val && uploadedAttachments.length === 0) return;
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    const attachmentIds = uploadedAttachments.map((a) => a.id);
    onSubmit?.(val, attachmentIds.length > 0 ? attachmentIds : undefined);
    setInputValue("");
    setAttachments([]);
  };

  const handleChipClick = (prompt: string) => {
    runWhenAuthed(() => onSubmit?.(prompt));
  };

  // ── Attachment upload logic ──────────────────────────────────────────────
  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const entry: AttachmentFile = {
          id: tempId,
          name: file.name,
          size: file.size,
          mimeType: file.type || "application/octet-stream",
          status: "uploading",
          file,
        };
        setAttachments((prev) => [...prev, entry]);

        try {
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          };
          const createBody: Record<string, unknown> = {
            type: "attachments.create",
            params: {
              name: file.name,
              size: file.size,
              mime_type: file.type || "application/octet-stream",
            },
            model: "high",
            platform:
              typeof window !== "undefined" && window.innerWidth < 768
                ? "mobile"
                : "desktop",
            ...(authToken ? { access_token: authToken } : {}),
            ...(reduxUserId != null ? { user_id: reduxUserId } : {}),
          };

          const createRes = await fetch(CHATKIT_API_URL, {
            method: "POST",
            headers,
            body: JSON.stringify(createBody),
          });
          if (!createRes.ok) throw new Error(`Create failed: ${createRes.status}`);
          const createData = await createRes.json();
          const serverId: string = createData.id;
          const uploadUrl: string = createData.upload_descriptor?.url;

          if (!uploadUrl) throw new Error("No upload URL returned");

          const formData = new FormData();
          formData.append("file", file);
          const uploadRes = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
          });
          if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);

          setAttachments((prev) =>
            prev.map((a) =>
              a.id === tempId ? { ...a, id: serverId, status: "uploaded" as const } : a,
            ),
          );
        } catch (err) {
          console.error("[Welcome Attachment upload error]", err);
          setAttachments((prev) =>
            prev.map((a) =>
              a.id === tempId ? { ...a, status: "error" as const } : a,
            ),
          );
        }
      }
    },
    [authToken, reduxUserId],
  );

  const handleRemoveAttachment = useCallback(
    async (id: string) => {
      const target = attachments.find((a) => a.id === id);
      // Always remove from local state immediately for snappy UX
      setAttachments((prev) => prev.filter((a) => a.id !== id));

      // Skip server delete for entries that never got a server-assigned id
      if (!target || target.status !== "uploaded" || id.startsWith("temp-")) return;

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        };
        const body: Record<string, unknown> = {
          type: "attachments.delete",
          params: { attachment_id: id },
          model: "high",
          platform:
            typeof window !== "undefined" && window.innerWidth < 768
              ? "mobile"
              : "desktop",
          ...(authToken ? { access_token: authToken } : {}),
          ...(reduxUserId != null ? { user_id: reduxUserId } : {}),
        };
        const res = await fetch(CHATKIT_API_URL, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      } catch (err) {
        console.error("[Welcome Attachment delete error]", err);
      }
    },
    [attachments, authToken, reduxUserId],
  );

  const defaultPromptChips = [
    {
      icon: "🗾",
      label: "Plan a 10-day Japan trip",
      sublabel: "",
      prompt: "Plan a 10-day Japan trip for 2 people. I want to cover Tokyo, Kyoto, and Osaka. Include bullet train travel, at least one ryokan stay, and key temples and food experiences. Suggest the best itinerary and budget.",
    },
    {
      icon: "💍",
      label: "Santorini or Amalfi Coast",
      sublabel: "",
      prompt: "We are planning our honeymoon and deciding between Santorini and the Amalfi Coast. Can you compare both — best time to go, what to do, where to stay, and approximate budget for 7 nights for 2? Help us decide.",
    },
    {
      icon: "🏰",
      label: "Europe in summer",
      sublabel: "",
      prompt: "We want to do a Europe trip this summer but are not sure which country or combination works best. We have about 12 days and a budget of Rs 2L per person. Suggest the best Europe itinerary for us and explain why.",
    },
    {
      icon: "🌌",
      label: "Northern Lights — Iceland or Norway",
      sublabel: "",
      prompt: "I want to see the Northern Lights. Should I go to Iceland or Norway? What is the best time, what does it cost for an Indian traveller including flights, and what else is there to do beyond the lights? Give me a full picture.",
    },
    {
      icon: "🌏",
      label: "Best of Southeast Asia in 12 days",
      sublabel: "",
      prompt: "I have 12 days for a Southeast Asia trip. Should I do Vietnam, Thailand, or a combination of both? Budget is around Rs 1.2L per person. Suggest the best itinerary and tell me what I should not miss.",
    },
    {
      icon: "✨",
      label: "Take me somewhere in Asia",
      sublabel: "",
      prompt: "Suggest an offbeat or underrated Asia destination that most Indian travellers have not explored yet. I want something with great experiences, good food, and preferably easy visa access. Budget flexible, around 8 to 10 days.",
    },
  ];

  const promptChips = themeConfig?.welcome?.promptChips ?? defaultPromptChips;
  const subtitle =
    themeConfig?.welcome?.subtitle ??
    "AI plans, locals verify, you book in one tap.";

  const inputBox = (
    <MessageInputBox
      value={inputValue}
      onChange={setInputValue}
      onSubmit={handleSubmit}
      rotatePlaceholders={[
        "Try:  Plan a 10-day Japan trip",
        "Try:  Santorini or Amalfi for our honeymoon?",
        "Try:  Northern Lights — Iceland or Norway?",
        "Try:  Europe in summer — where should we go?",
      ]}
      showAttach={true}
      onFilesSelected={handleFilesSelected}
      attachments={attachments}
      onRemoveAttachment={handleRemoveAttachment}
      requireAuth={!isLoggedIn}
      onAuthRequired={() => setShowLogin(true)}
    />
  );

  return (
    <div className="cws-root flex flex-col h-full">
      <style>{CWS_STYLES}</style>

      {/* ── Mobile-only header — logo + injected menu actions. Mirrors
           ChatKitPanel's top bar so the welcome screen has parity with the
           rest of the chat tab now that MobileHeader is hidden there. ── */}
      <div className="md:hidden flex-shrink-0 flex items-center justify-between gap-2 px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logoblack.svg" height={22} width={22} alt="logo" />
          <span className="font-semibold text-gray-800 ttw-type-body">thetarzanway</span>
        </div>
        {mobileMenu && <div className="flex-shrink-0">{mobileMenu}</div>}
      </div>

      {/* Right-pane scroll area */}
      <div className="cws-pane-inner" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {/* ── Kaira hero ── */}
        <div className="cws-kaira-hero">
          <div className="cws-kaira-portrait">
            <div className="cws-kaira-portrait-ring" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/KairaInsta.png" alt="Kaira" className="cws-kaira-portrait-img" />
            <span className="cws-kaira-portrait-bubble">✈️</span>
            <span className="cws-kaira-portrait-dot" />
          </div>

          <div className="cws-live-pill">
            <span className="cws-dot" />
            Kaira · online · replies in ~2s
          </div>

          <span className="cws-usp-kicker">
            <span className="cws-usp-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
              </svg>
            </span>
            Real holidays · booked &amp; protected
          </span>

          <h1>
            We don&apos;t just chat — <span className="cws-serif">we sell</span>{" "}
            <span className="cws-hl">holidays.</span>
          </h1>
          <p>{subtitle} <b>10,000+ trips delivered.</b></p>
        </div>

        {/* ── Input ── */}
        <div className="cws-input-wrap">{inputBox}</div>

        {/* ── Prompt chips (dynamic + default) ── */}
        <div className="cws-chip-row">
          {promptChips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              className="cws-chip"
              onClick={() => handleChipClick(chip.prompt)}
            >
              {chip.icon && <span className="cws-chip-icon">{chip.icon}</span>}
              {chip.label}
            </button>
          ))}
        </div>

        {/* ── How it works strip ── */}
        <div className="cws-hiw-strip">
          <div className="cws-hiw-step">
            <div className="cws-hiw-num">1</div>
            <div className="cws-hiw-text">Tell me <span className="cws-serif">where</span><span className="cws-sub">~30 sec</span></div>
          </div>
          <div className="cws-hiw-step">
            <div className="cws-hiw-num">2</div>
            <div className="cws-hiw-text">I plan it <span className="cws-serif">all</span><span className="cws-sub">~90 sec</span></div>
          </div>
          <div className="cws-hiw-step">
            <div className="cws-hiw-num">3</div>
            <div className="cws-hiw-text">Book in <span className="cws-serif">one tap</span><span className="cws-sub">we handle the rest</span></div>
          </div>
        </div>
      </div>

      {/* ── Get Inspired CTA — mobile only, pinned to the bottom on scroll ── */}
      <button
        type="button"
        onClick={() => setShowInspiration(true)}
        className="cws-inspire-cta md:hidden"
      >
        <span>Get Inspired</span>
        <span aria-hidden>→</span>
      </button>

      {/* Inspiration Bottom Sheet — mobile only */}
      {showInspiration && (
        <div className="md:hidden fixed inset-0 z-[1600]">
          {/* Backdrop */}
          <div
            onClick={() => setShowInspiration(false)}
            className="absolute inset-0"
            style={{
              background: "rgba(0,0,0,0.5)",
              animation: "inspFadeIn 0.25s ease-out forwards",
            }}
          />

          {/* Sheet */}
          <div
            className="absolute left-0 right-0 bottom-0 bg-white flex flex-col"
            style={{
              height: "65vh",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              animation: "inspSlideUp 0.3s ease-out forwards",
              boxShadow: "0 -8px 24px rgba(0,0,0,0.12)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Inspiration"
          >
            <style>{`
              @keyframes inspFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes inspSlideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
            `}</style>

            {/* Drag handle */}
            <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
              <div
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 999,
                  background: "#E5E7EB",
                }}
              />
            </div>

            {/* Header */}
            {/* <div className="flex items-center justify-between px-5 pt-2 pb-2 flex-shrink-0">
              <h2
                className="ttw-type-h3 font-semibold text-gray-900"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Inspiration
              </h2>
              <button
                type="button"
                onClick={() => setShowInspiration(false)}
                aria-label="Close"
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div> */}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <StartScreen
                onPromptSelect={handleInspirationSelect}
                themeConfig={themeConfig}
              />
            </div>
          </div>
        </div>
      )}

      {/* Login gate — shown when a logged-out user tries to use the input,
          a prompt chip, or an inspiration prompt. */}
      <BotLoginModal
        show={showLogin}
        onhide={() => setShowLogin(false)}
        zIndex={"3300"}
        onSuccess={() => {
          setShowLogin(false);
          const action = pendingActionRef.current;
          pendingActionRef.current = null;
          if (action) setTimeout(action, 0);
        }}
      />
    </div>
  );
};

export default ChatWelcomeScreen;
