import React, { useRef, useEffect, useState, useCallback } from "react";
// @ts-ignore — JS component
import Dictate from "../../Chatbot/Dictate";
import type { AttachmentFile } from "./ChatKitPanel";

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_9587_10060)">
    <path d="M15.4109 0.588091C15.1719 0.346176 14.8745 0.169994 14.5475 0.0765683C14.2205 -0.0168576 13.875 -0.0243699 13.5442 0.0547573L2.87755 2.30142C2.26327 2.38567 1.68471 2.63974 1.20702 3.03503C0.729331 3.43032 0.371492 3.95113 0.1738 4.5388C-0.0238923 5.12647 -0.0535854 5.75767 0.0880645 6.3613C0.229714 6.96494 0.537081 7.51704 0.97555 7.95542L2.12088 9.10009C2.18287 9.16206 2.23203 9.23565 2.26555 9.31664C2.29907 9.39763 2.31629 9.48444 2.31622 9.57209V11.6841C2.31769 11.981 2.38605 12.2739 2.51622 12.5408L2.51088 12.5454L2.52822 12.5628C2.72356 12.9555 3.0426 13.2732 3.43622 13.4668L3.45355 13.4841L3.45822 13.4788C3.72512 13.6089 4.01793 13.6773 4.31488 13.6788H6.42688C6.60358 13.6786 6.77311 13.7486 6.89822 13.8734L8.04288 15.0181C8.3499 15.3285 8.71532 15.5751 9.11807 15.7436C9.52083 15.9122 9.95295 15.9993 10.3896 16.0001C10.7534 15.9996 11.1147 15.9402 11.4595 15.8241C12.0418 15.6329 12.5591 15.2828 12.953 14.8132C13.3469 14.3437 13.6018 13.7734 13.6889 13.1668L15.9389 2.47676C16.0221 2.14318 16.0172 1.7937 15.9246 1.4626C15.8321 1.13149 15.655 0.830137 15.4109 0.588091ZM3.06488 8.15876L1.91888 7.01409C1.65203 6.75366 1.465 6.42252 1.37974 6.05953C1.29448 5.69654 1.31454 5.31675 1.43755 4.96476C1.55681 4.60364 1.77729 4.28437 2.07275 4.04493C2.36821 3.80549 2.72623 3.65595 3.10422 3.61409L13.6649 1.39076L3.64822 11.4088V9.57209C3.64923 9.30965 3.59819 9.04961 3.49806 8.80702C3.39794 8.56442 3.2507 8.34409 3.06488 8.15876ZM12.3789 12.9388C12.3277 13.307 12.1749 13.6537 11.9376 13.9398C11.7003 14.2261 11.388 14.4405 11.0356 14.559C10.6833 14.6775 10.3049 14.6955 9.94284 14.6109C9.58083 14.5263 9.24956 14.3425 8.98622 14.0801L7.83955 12.9334C7.65446 12.7473 7.43431 12.5998 7.19183 12.4993C6.94935 12.3988 6.68935 12.3474 6.42688 12.3481H4.59022L14.6082 2.33342L12.3789 12.9388Z" fill="white"/>
  </g>
  <defs>
    <clipPath id="clip0_9587_10060">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <g clip-path="url(#clip0_9587_10055)">
    <path d="M5.81586 20.006C4.66064 20.0087 3.53062 19.6684 2.56905 19.0281C1.60749 18.3878 0.857681 17.4765 0.414688 16.4096C-0.0283048 15.3427 -0.144535 14.1682 0.0807312 13.0352C0.305998 11.9021 0.862617 10.8615 1.68003 10.0452L10.5134 1.22432C11.2952 0.440715 12.3563 -0.000211935 13.4632 -0.00146218C14.5702 -0.00271242 15.6323 0.435816 16.4159 1.21765C17.1995 1.99949 17.6404 3.06059 17.6416 4.16752C17.6429 5.27446 17.2044 6.33655 16.4225 7.12015L7.58836 15.9402C7.11058 16.3955 6.47588 16.6495 5.81586 16.6495C5.15584 16.6495 4.52114 16.3955 4.04336 15.9402C3.81092 15.708 3.62652 15.4322 3.50071 15.1288C3.3749 14.8253 3.31014 14.4999 3.31014 14.1714C3.31014 13.8429 3.3749 13.5175 3.50071 13.2141C3.62652 12.9106 3.81092 12.6348 4.04336 12.4027L12.2884 4.17265L13.47 5.35182L5.22503 13.5835C5.0688 13.7398 4.98104 13.9517 4.98104 14.1727C4.98104 14.3936 5.0688 14.6055 5.22503 14.7618C5.38422 14.9137 5.59581 14.9985 5.81586 14.9985C6.0359 14.9985 6.2475 14.9137 6.40669 14.7618L15.2467 5.94099C15.7158 5.47078 15.9789 4.83348 15.9781 4.16929C15.9773 3.5051 15.7127 2.86842 15.2425 2.39932C14.7723 1.93022 14.135 1.66712 13.4708 1.6679C12.8066 1.66868 12.17 1.93328 11.7009 2.40349L2.86169 11.2235C2.07975 12.007 1.64107 13.069 1.64216 14.1759C1.64325 15.2829 2.08403 16.344 2.86753 17.126C3.65102 17.9079 4.71305 18.3466 5.81998 18.3455C6.92692 18.3444 7.98808 17.9036 8.77003 17.1202L18.7875 7.12015L19.9692 8.29932L9.95169 18.2993C9.40855 18.842 8.76363 19.2721 8.05391 19.5649C7.34418 19.8578 6.58363 20.0077 5.81586 20.006Z" fill="#374957"/>
  </g>
  <defs>
    <clipPath id="clip0_9587_10055">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg>
);

const StopIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toUpperCase() : "FILE";
}

function fileTypeColor(mimeType: string): { bg: string; fg: string } {
  if (mimeType.startsWith("image/")) return { bg: "#dbeafe", fg: "#2563eb" };
  if (mimeType === "application/pdf") return { bg: "#fee2e2", fg: "#dc2626" };
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return { bg: "#dcfce7", fg: "#16a34a" };
  if (mimeType.includes("word") || mimeType.includes("document"))
    return { bg: "#dbeafe", fg: "#2563eb" };
  return { bg: "#f3f4f6", fg: "#6b7280" };
}

/** Generates a local object URL for image previews */
function useImagePreview(file: File, mimeType: string): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!mimeType.startsWith("image/")) return;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file, mimeType]);
  return url;
}

/** Single attachment card */
const AttachmentCard: React.FC<{
  att: AttachmentFile;
  onRemove?: (id: string) => void;
}> = ({ att, onRemove }) => {
  const isImage = att.mimeType.startsWith("image/");
  const previewUrl = useImagePreview(att.file, att.mimeType);
  const colors = fileTypeColor(att.mimeType);
  const ext = fileExtension(att.name);
  const isUploading = att.status === "uploading";
  const isError = att.status === "error";

  return (
    <div
      style={{
        position: "relative",
        width: isImage ? 80 : undefined,
        minWidth: isImage ? 80 : 160,
        maxWidth: isImage ? 80 : 220,
        height: isImage ? 80 : undefined,
        borderRadius: 12,
        overflow: "hidden",
        border: isError ? "1.5px solid #fca5a5" : "1px solid #e5e7eb",
        background: isError ? "#fef2f2" : "#fff",
        flexShrink: 0,
        transition: "border-color 0.15s",
      }}
    >
      {/* Uploading overlay */}
      {isUploading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            borderRadius: 12,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="animate-spin"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#9ca3af"
              strokeWidth="3"
              strokeDasharray="60"
              strokeDashoffset="20"
            />
          </svg>
        </div>
      )}

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove?.(att.id)}
        style={{
          position: "absolute",
          top: 4,
          right: 4,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.55)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          lineHeight: 1,
          zIndex: 3,
          padding: 0,
        }}
        title="Remove"
      >
        &times;
      </button>

      {isImage && previewUrl ? (
        /* Image thumbnail */
        <img
          src={previewUrl}
          alt={att.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        /* File card */
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            height: "100%",
          }}
        >
          {/* Extension badge */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: colors.bg,
              color: colors.fg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 700,
              flexShrink: 0,
              letterSpacing: 0.5,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {ext.slice(0, 4)}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: isError ? "#dc2626" : "#1f2937",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: "'Inter', sans-serif",
              }}
              title={att.name}
            >
              {att.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: isError ? "#f87171" : "#9ca3af",
                marginTop: 2,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {isError ? "Upload failed" : formatFileSize(att.size)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Component ────────────────────────────────────────────────────────────────

interface MessageInputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Show the + attach button (default: true) */
  showAttach?: boolean;
  rotatePlaceholders?: string[];
  /** Called when user selects or drops files */
  onFilesSelected?: (files: File[]) => void;
  /** Currently attached files (managed by parent) */
  attachments?: AttachmentFile[];
  /** Remove an attachment by id */
  onRemoveAttachment?: (id: string) => void;
}

export const MessageInputBox: React.FC<MessageInputBoxProps> = ({
  value,
  onChange,
  onSubmit,
  onStop,
  isStreaming = false,
  disabled = false,
  placeholder = "Ask me anything",
  showAttach = true,
  rotatePlaceholders = [],
  onFilesSelected,
  attachments = [],
  onRemoveAttachment,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dictateRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tracks what the user manually typed (base for appending transcript)
  const [trackTyped, setTrackTyped] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounterRef = useRef(0);

  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (!rotatePlaceholders?.length) return;
    const interval = setInterval(() => {
      setFadingOut(true);
      setTimeout(() => {
        setPlaceholderIdx((i) => (i + 1) % rotatePlaceholders.length);
        setFadingOut(false);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [rotatePlaceholders]);

  const activePlaceholder =
    rotatePlaceholders?.length
      ? rotatePlaceholders[placeholderIdx]
      : placeholder;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  const hasUploadedAttachments = attachments.some((a) => a.status === "uploaded");
  const canSend =
    (value.trim().length > 0 || hasUploadedAttachments) && !isStreaming && !disabled;

  // When user manually types, keep trackTyped in sync
  const handleChange = (text: string) => {
    setTrackTyped(text);
    onChange(text);
  };

  // Dictate callbacks — same pattern as AskQuery.js
  const handleTranscriptChange = (transcript: string) => {
    const combined = `${trackTyped}${trackTyped ? " " : ""}${transcript}`;
    onChange(combined);
  };
  const stopDictation = () => {
    // Snapshot current value so next transcript starts from here
    setTrackTyped(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) handleSubmitInternal();
    }
  };

  const handleSubmitInternal = () => {
    dictateRef.current?.stop();
    onSubmit();
  };

  // ── File selection ──────────────────────────────────────────────────────
  const handleAttachClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFilesSelected?.(Array.from(files));
      }
      // Reset so same file can be re-selected
      e.target.value = "";
    },
    [onFilesSelected],
  );

  // ── Drag-and-drop ──────────────────────────────────────────────────────
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        onFilesSelected?.(Array.from(files));
      }
    },
    [onFilesSelected],
  );

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        borderRadius: 24,
        border: isDragOver
          ? "1.5px solid #3b82f6"
          : "1.5px solid #e5e7eb",
        background: isDragOver ? "#eff6ff" : "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        padding: "14px 14px",
        fontFamily: "'Inter', sans-serif",
        transition: "border-color 0.15s, background 0.15s",
      }}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />

      {/* Drag-over overlay hint */}
      {isDragOver && (
        <div
          style={{
            textAlign: "center",
            padding: "8px 0",
            color: "#3b82f6",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Drop files here
        </div>
      )}

      {/* Attachment cards */}
      {attachments.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 10,
            overflowX: "auto",
            paddingBottom: 2,
            scrollbarWidth: "none",
            msOverflowStyle: "none" as any,
          }}
        >
          {attachments.map((att) => (
            <AttachmentCard
              key={att.id}
              att={att}
              onRemove={onRemoveAttachment}
            />
          ))}
        </div>
      )}

      {/* Textarea + animated placeholder */}
      <div style={{ position: "relative" }}>
        <style>{`
          @keyframes slideUpIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
          @keyframes slideUpOut {
            from { opacity: 1; transform: translateY(0);     }
            to   { opacity: 0; transform: translateY(-10px); }
          }
          .ph-slide-in  { animation: slideUpIn  0.35s ease forwards; }
          .ph-slide-out { animation: slideUpOut 0.35s ease forwards; }
        `}</style>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isStreaming}
          placeholder=""
          rows={1}
          className="w-full bg-transparent resize-none outline-none"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            color: "#111827",
            lineHeight: "22px",
            minHeight: 24,
            maxHeight: 120,
            border: "none",
            padding: 0,
            marginBottom: 8,
          }}
        />

        {/* Animated placeholder overlay */}
        {!value && (
          <span
            key={placeholderIdx}
            className={fadingOut ? "ph-slide-out" : "ph-slide-in"}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              userSelect: "none",
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              lineHeight: "22px",
              color: "#9ca3af",
              whiteSpace: "nowrap",
              overflow: "hidden",
              maxWidth: "100%",
            }}
          >
            {activePlaceholder}
          </span>
        )}
      </div>

      {/* Bottom action row */}
      <div className="flex items-center justify-between">
        {/* Left: attach */}
        {showAttach ? (
          <button
            type="button"
            onClick={handleAttachClick}
            className="flex items-center justify-center transition-colors hover:bg-gray-100 rounded-full"
            title="Attach"
          >
            <PlusIcon />
          </button>
        ) : (
          <div />
        )}

        {/* Right: mic (Dictate) + send/stop */}
        <div className="flex items-center gap-2">
          {/* Dictate component handles mic button + recording state */}
          <Dictate
            ref={dictateRef}
            stopDictation={stopDictation}
            onTranscriptChange={handleTranscriptChange}
            disabled={disabled || isStreaming}
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              title="Stop generating"
              className="flex items-center justify-center transition-all"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#1c1917",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              <StopIcon />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitInternal}
              disabled={!canSend}
              title="Send"
              className="flex items-center justify-center transition-all"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#07213A",
                color: "#1c1917",
                border: "none",
                cursor: canSend ? "pointer" : "not-allowed",
                boxShadow: canSend ? "0 2px 8px rgba(251,191,36,0.35)" : "none",
              }}
            >
              <SendIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
