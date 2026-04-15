import React, { useState, useCallback } from "react";
import { MessageInputBox } from "../MessageInputBox";
import type { AttachmentFile } from "../ChatKitPanel";
import { useSelector } from "react-redux";

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

  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const promptChips = [
    {
      icon: "✈️",
      label: "Plan a Bali Trip",
      sublabel: "₹1.2L for 2",
      prompt: "Plan a 7-day Bali trip for 2 people. Budget ₹1.2 lakh. Include beaches, temples, and at least one villa stay.",
    },
    {
      icon: "🎲",
      label: "Surprise Me",
      sublabel: "4 Days, ₹80K",
      prompt: "Surprise me with an offbeat trip. 4 days, budget ₹80,000. I like experiences over touristy places.",
    },
    {
      icon: "🏕️",
      label: "Rajasthan Desert Camp",
      sublabel: "2 nights",
      prompt: "Plan a 4-night Rajasthan trip. Desert camp in Jaisalmer, camel safari at golden hour, heritage hotel stay.",
    },
    {
      icon: "🏖️",
      label: "Best Beach in India this April",
      sublabel: "",
      prompt: "What are the best beaches in India to visit in April? I prefer fewer crowds. Suggest itinerary options.",
    },
  ];

  const inputBox = (
    <MessageInputBox
      value={inputValue}
      onChange={setInputValue}
      onSubmit={handleSubmit}
      rotatePlaceholders={[
        "Try:  Plan a Bali Trip",
        "Try:  Best hill stations near Bangalore",
        "Try:  La Tomatina trip from India",
        "Try:  Surprise me — 4 days, ₹80K",
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

        {/* Prompt chips — 2-col grid on mobile, 1-col on desktop */}
        <div className="w-full max-w-sm grid grid-cols-2 md:grid-cols-1 gap-2.5 mb-4 md:mb-6">
          {promptChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => handleChipClick(chip.prompt)}
              className="welcome-chip flex flex-col md:flex-row items-start md:items-center gap-1.5 md:gap-3 p-3 md:p-[10px] rounded-xl border-[0.9px] bg-white text-left"
            >
              <span className="text-xl md:text-lg flex-shrink-0">{chip.icon}</span>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-sm font-semibold md:font-medium text-gray-900 line-clamp-2 md:truncate">{chip.label}</span>
                {chip.sublabel && (
                  <span className="text-xs text-gray-400 mt-0.5">{chip.sublabel}</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Input — desktop only inside scroll area (vertically centered with content) */}
        <div className="md:block max-ph:hidden w-full max-w-[32rem] flex flex-col justify-end">
          {inputBox}
        </div>
      </div>

      {/* Input — mobile only, pinned at bottom */}
      <div className="md:hidden flex-shrink-0 px-4 pb-4 pt-2 bg-white flex flex-col justify-end">
        {inputBox}
      </div>
    </div>
  );
};

export default ChatWelcomeScreen;
