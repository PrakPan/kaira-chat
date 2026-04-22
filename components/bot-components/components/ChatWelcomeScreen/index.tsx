import React, { useState, useCallback, useEffect } from "react";
import { MessageInputBox } from "../MessageInputBox";
import type { AttachmentFile } from "../ChatKitPanel";
import { useSelector } from "react-redux";
import StartScreen from "../StartScreen";

const CHATKIT_API_URL = "https://chat.tarzanway.com/chatkit";

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
}

const ChatWelcomeScreen: React.FC<ChatWelcomeScreenProps> = ({ onSubmit, onChatStart }) => {
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [showInspiration, setShowInspiration] = useState(false);

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
    onSubmit?.(prompt);
  };

  const reduxToken = useSelector((state: any) => state.auth.token);
  const reduxUserId = useSelector((state: any) => state.auth.id);
  const authToken = reduxToken ?? getAuthToken();

  const handleSubmit = () => {
    const val = inputValue.trim();
    const uploadedAttachments = attachments.filter((a) => a.status === "uploaded");
    if (!val && uploadedAttachments.length === 0) return;
    const attachmentIds = uploadedAttachments.map((a) => a.id);
    onSubmit?.(val, attachmentIds.length > 0 ? attachmentIds : undefined);
    setInputValue("");
    setAttachments([]);
  };

  const handleChipClick = (prompt: string) => {
    onSubmit?.(prompt);
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

  const promptChips = [
    {
      icon: "🗾",
      label: "Plan a 10-day Japan trip — temples, bullet trains, ryokans",
      sublabel: "",
      prompt: "Plan a 10-day Japan trip for 2 people. I want to cover Tokyo, Kyoto, and Osaka. Include bullet train travel, at least one ryokan stay, and key temples and food experiences. Suggest the best itinerary and budget.",
    },
    {
      icon: "💍",
      label: "Santorini or Amalfi Coast — which one for our honeymoon?",
      sublabel: "",
      prompt: "We are planning our honeymoon and deciding between Santorini and the Amalfi Coast. Can you compare both — best time to go, what to do, where to stay, and approximate budget for 7 nights for 2? Help us decide.",
    },
    {
      icon: "🏰",
      label: "Europe in summer — where should we actually go?",
      sublabel: "",
      prompt: "We want to do a Europe trip this summer but are not sure which country or combination works best. We have about 12 days and a budget of Rs 2L per person. Suggest the best Europe itinerary for us and explain why.",
    },
    {
      icon: "🌌",
      label: "Northern Lights — Iceland or Norway, and can we afford it?",
      sublabel: "",
      prompt: "I want to see the Northern Lights. Should I go to Iceland or Norway? What is the best time, what does it cost for an Indian traveller including flights, and what else is there to do beyond the lights? Give me a full picture.",
    },
    {
      icon: "🌏",
      label: "Best of Southeast Asia in 12 days — Vietnam, Thailand or both?",
      sublabel: "",
      prompt: "I have 12 days for a Southeast Asia trip. Should I do Vietnam, Thailand, or a combination of both? Budget is around Rs 1.2L per person. Suggest the best itinerary and tell me what I should not miss.",
    },
    {
      icon: "✨",
      label: "Take me somewhere in Asia I haven't thought of yet",
      sublabel: "",
      prompt: "Suggest an offbeat or underrated Asia destination that most Indian travellers have not explored yet. I want something with great experiences, good food, and preferably easy visa access. Budget flexible, around 8 to 10 days.",
    },
  ];

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
    />
  );

  return (
    <div
      className="flex flex-col h-full bg-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        .welcome-chip {
          transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
        }
        .welcome-chip:hover {
          background: #fffbeb;
          border-color: #fbbf24;
          transform: translateY(-1px);
        }
        .welcome-chip:active { transform: translateY(0); }
      `}</style>

      {/* Scrollable content — top-aligned on mobile, centered on desktop */}
      <div
        className="flex-1 overflow-y-auto flex flex-col items-center w-full px-6 py-6 md:justify-center"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Avatar */}
        <img
          src="/KairaInsta.png"
          alt="Kaira"
          className="mb-4 rounded-full w-20 h-20 md:w-28 md:h-28 object-cover flex-shrink-0"
        />

        {/* Heading */}
        <h1
          className="text-center font-semibold mb-2 text-[20px] md:text-[24px]"
          style={{ lineHeight: "1.3", letterSpacing: "-0.3px" }}
        >
          Your next trip is one conversation away
        </h1>

        {/* Subtitle */}
        <p className="text-center text-[#6E757A] mb-5 text-sm md:text-md leading-relaxed">
          Tell me where you want to go — I'll handle the rest.
        </p>

        {/* Prompt chips — 2-col grid on mobile and desktop */}
        <div className="w-full max-w-sm md:max-w-3xl grid grid-cols-2 gap-2.5 mb-4 md:mb-6">
          {promptChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => handleChipClick(chip.prompt)}
              className="welcome-chip flex flex-col md:flex-row items-start md:items-center gap-1.5 md:gap-3 p-3 md:p-[10px] rounded-xl border-[0.9px] bg-white text-left"
            >
              <span className="text-xl md:text-lg flex-shrink-0">{chip.icon}</span>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-sm font-semibold md:font-medium text-gray-900 line-clamp-2">{chip.label}</span>
                {chip.sublabel && (
                  <span className="text-xs text-gray-400 mt-0.5">{chip.sublabel}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input — desktop only, pinned at bottom (pb clears the TrustIndicators bar) */}
      <div className="max-ph:hidden flex-shrink-0 bg-white px-6 pt-2 pb-[68px] flex justify-center">
        <div className="w-full max-w-3xl">{inputBox}</div>
      </div>

      {/* Input — mobile only, pinned at bottom */}
      <div className="md:hidden flex-shrink-0 bg-white flex flex-col justify-end">
        <div className="px-4 pb-2 pt-2">{inputBox}</div>

        {/* Get Inspired CTA — mobile only */}
        <button
          type="button"
          onClick={() => setShowInspiration(true)}
          className="w-full flex items-center justify-center gap-1 py-2 text-[14px] font-medium"
          style={{ background: "#F7ECFF", color: "#922ADC" }}
        >
          <span>Get Inspired</span>
          <span aria-hidden>→</span>
        </button>
      </div>

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
                className="text-[20px] font-semibold text-gray-900"
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
              <StartScreen onPromptSelect={handleInspirationSelect} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWelcomeScreen;
