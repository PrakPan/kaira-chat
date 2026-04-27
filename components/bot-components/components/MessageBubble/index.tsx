import React, { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Message, ProgressStep, ThinkingTask } from "../../hooks/useChat";
import { WidgetRenderer } from "../WidgetRenderer";

// ─── Image lightbox (full-size preview) ───────────────────────────────────────
const ImageLightbox: React.FC<{ url: string; alt?: string; onClose: () => void }> = ({
  url,
  alt,
  onClose,
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 3400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "zoom-out",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.55)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          lineHeight: 1,
          padding: 0,
          zIndex: 1,
        }}
      >
        &times;
      </button>
      <img
        src={url}
        alt={alt ?? "preview"}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "92vw",
          maxHeight: "92vh",
          objectFit: "contain",
          borderRadius: 8,
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          cursor: "default",
        }}
      />
    </div>,
    document.body,
  );
};

// ─── Image attachment with hover preview icon ─────────────────────────────────
const ImageAttachment: React.FC<{ url: string; name?: string }> = ({ url, name }) => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setOpen(true)}
        style={{
          position: "relative",
          width: 140,
          height: 140,
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <img
          src={url}
          alt={name ?? "attachment"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.15s ease",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111827"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        </div>
      </div>
      {open && <ImageLightbox url={url} alt={name} onClose={() => setOpen(false)} />}
    </>
  );
};

interface MessageBubbleProps {
  message: Message;
  entities?: Record<string, { name: string; type: string }>;
  onWidgetAction?: (action: {
    type: string;
    payload?: Record<string, unknown>;
  }) => void;
  /**
   * When true, the widget rendered for this message should disable all its
   * CTAs. ChatKitPanel sets this for history-restored widgets and for widgets
   * whose CTA was already clicked this session.
   */
  widgetDisabled?: boolean;
  /** Current feedback (thumbs up/down) for this message, or null. */
  feedback?: { feedbackId: string; type: "up" | "down" } | null;
  /** Disables feedback buttons while a request is in flight. */
  feedbackLoading?: boolean;
  /** Toggle feedback for this message; ChatKitPanel handles create/change/delete. */
  onFeedback?: (messageId: string, type: "up" | "down") => void;
}

// ─── Feedback icons (thumbs up / thumbs down) ─────────────────────────────────

const ThumbsUpIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M18.9775 6.43432C18.5867 5.98399 18.1038 5.62288 17.5613 5.37545C17.0189 5.12801 16.4296 5.00002 15.8333 5.00015H12.5092L12.7892 3.29932C12.8882 2.70037 12.7687 2.08576 12.4524 1.5676C12.1361 1.04944 11.644 0.662246 11.066 0.476645C10.488 0.291044 9.8625 0.319403 9.30365 0.556548C8.74479 0.793693 8.2898 1.22382 8.02167 1.76849L6.42667 5.00015H4.16667C3.062 5.00147 2.00296 5.44089 1.22185 6.222C0.440735 7.00312 0.00132321 8.06216 0 9.16682L0 13.3335C0.00132321 14.4381 0.440735 15.4972 1.22185 16.2783C2.00296 17.0594 3.062 17.4988 4.16667 17.5002H15.25C16.2529 17.496 17.221 17.1321 17.9782 16.4745C18.7354 15.8168 19.2313 14.9092 19.3758 13.9168L19.9633 9.75015C20.0461 9.1591 20.0009 8.55716 19.8308 7.98509C19.6607 7.41302 19.3697 6.88417 18.9775 6.43432ZM1.66667 13.3335V9.16682C1.66667 8.50378 1.93006 7.86789 2.3989 7.39905C2.86774 6.93021 3.50363 6.66682 4.16667 6.66682H5.83333V15.8335H4.16667C3.50363 15.8335 2.86774 15.5701 2.3989 15.1013C1.93006 14.6324 1.66667 13.9965 1.66667 13.3335ZM18.3092 9.51599L17.7208 13.6827C17.6348 14.2776 17.3381 14.822 16.8847 15.2167C16.4312 15.6114 15.8512 15.8303 15.25 15.8335H7.5V6.44515C7.57853 6.37673 7.64355 6.2942 7.69167 6.20182L9.51583 2.50599C9.58424 2.38259 9.68095 2.27719 9.79802 2.19845C9.91509 2.11971 10.0492 2.06987 10.1893 2.05303C10.3293 2.0362 10.4714 2.05284 10.6038 2.10159C10.7362 2.15035 10.8551 2.22982 10.9508 2.33348C11.0327 2.42869 11.0926 2.54079 11.1261 2.66179C11.1597 2.78279 11.1661 2.90971 11.145 3.03349L10.705 5.70015C10.6857 5.8193 10.6925 5.94123 10.7249 6.05749C10.7574 6.17375 10.8147 6.28158 10.8929 6.37351C10.9711 6.46544 11.0684 6.53928 11.178 6.58993C11.2875 6.64057 11.4068 6.6668 11.5275 6.66682H15.8333C16.1912 6.66677 16.5448 6.74354 16.8705 6.89194C17.1961 7.04034 17.486 7.25691 17.7207 7.52701C17.9555 7.79712 18.1294 8.11446 18.231 8.4576C18.3325 8.80073 18.3591 9.16166 18.3092 9.51599Z"
      fill="currentColor"
    />
  </svg>
);

const ThumbsDownIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M19.9592 10.25L19.3717 6.08333C19.2273 5.09161 18.7319 4.18459 17.9756 3.52706C17.2193 2.86952 16.2522 2.5051 15.25 2.5H4.16666C3.062 2.50132 2.00296 2.94073 1.22184 3.72185C0.440727 4.50296 0.00131559 5.562 -7.62939e-06 6.66667L-7.62939e-06 10.8333C0.00131559 11.938 0.440727 12.997 1.22184 13.7782C2.00296 14.5593 3.062 14.9987 4.16666 15H6.42666L8.02166 18.2317C8.2898 18.7763 8.74479 19.2065 9.30364 19.4436C9.86249 19.6807 10.488 19.7091 11.066 19.5235C11.644 19.3379 12.1361 18.9507 12.4524 18.4326C12.7687 17.9144 12.8882 17.2998 12.7892 16.7008L12.5092 15H15.8333C16.4298 15 17.0193 14.872 17.5621 14.6245C18.1048 14.3771 18.5881 14.016 18.9792 13.5657C19.3704 13.1154 19.6603 12.5863 19.8293 12.0143C19.9984 11.4423 20.0427 10.8406 19.9592 10.25ZM4.16666 4.16667H5.83333V13.3333H4.16666C3.50362 13.3333 2.86773 13.0699 2.39889 12.6011C1.93005 12.1323 1.66666 11.4964 1.66666 10.8333V6.66667C1.66666 6.00363 1.93005 5.36774 2.39889 4.8989C2.86773 4.43006 3.50362 4.16667 4.16666 4.16667ZM17.72 12.4733C17.4853 12.7433 17.1955 12.9598 16.87 13.1081C16.5445 13.2565 16.191 13.3333 15.8333 13.3333H11.5275C11.4066 13.3333 11.2872 13.3596 11.1775 13.4103C11.0678 13.4611 10.9704 13.5351 10.8922 13.6272C10.8139 13.7193 10.7567 13.8273 10.7243 13.9438C10.692 14.0603 10.6854 14.1824 10.705 14.3017L11.145 16.9683C11.1661 17.0921 11.1597 17.219 11.1261 17.34C11.0926 17.461 11.0327 17.5731 10.9508 17.6683C10.8548 17.7718 10.7356 17.851 10.603 17.8995C10.4705 17.9479 10.3283 17.9642 10.1882 17.9469C10.0481 17.9297 9.91405 17.8794 9.79716 17.8003C9.68028 17.7211 9.58386 17.6154 9.51583 17.4917L7.69166 13.7983C7.64354 13.706 7.57853 13.6234 7.49999 13.555V4.16667H15.25C15.8519 4.16887 16.4329 4.38727 16.8872 4.78208C17.3416 5.17689 17.6389 5.7218 17.725 6.3175L18.3133 10.4842C18.3627 10.8389 18.3352 11.2001 18.2329 11.5432C18.1305 11.8864 17.9556 12.2036 17.72 12.4733Z"
      fill="currentColor"
    />
  </svg>
);

const FeedbackButtons: React.FC<{
  messageId: string;
  feedback: { feedbackId: string; type: "up" | "down" } | null;
  loading: boolean;
  onFeedback: (messageId: string, type: "up" | "down") => void;
}> = ({ messageId, feedback, loading, onFeedback }) => {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 6,
    border: "none",
    background: "transparent",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background 0.15s ease, color 0.15s ease",
    padding: 0,
  };
  const activeColor = "#0d0d0d";
  const idleColor = "#9ca3af";
  const upActive = feedback?.type === "up";
  const downActive = feedback?.type === "down";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        marginTop: 8,
        marginLeft: -6,
      }}
    >
      <button
        type="button"
        aria-label={upActive ? "Remove thumbs up" : "Thumbs up"}
        aria-pressed={upActive}
        disabled={loading}
        onClick={() => onFeedback(messageId, "up")}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        style={{ ...baseStyle, color: upActive ? activeColor : idleColor }}
      >
        <ThumbsUpIcon />
      </button>
      <button
        type="button"
        aria-label={downActive ? "Remove thumbs down" : "Thumbs down"}
        aria-pressed={downActive}
        disabled={loading}
        onClick={() => onFeedback(messageId, "down")}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        style={{ ...baseStyle, color: downActive ? activeColor : idleColor }}
      >
        <ThumbsDownIcon />
      </button>
    </div>
  );
};

// ─── Markdown renderer ────────────────────────────────────────────────────────

function renderContent(
  text: string,
  entities: Record<string, { name: string; type: string }> = {},
): React.ReactNode[] {
  const resolved = resolveEntityTokens(text, entities);
  const nodes: React.ReactNode[] = [];
  const lines = resolved.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^[\-\*•]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[\-\*•]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[\-\*•]\s/, ""));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`}>
          {items.map((item, idx) => (
            <li key={idx}>
              <span>{inlineFormat(item)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`}>
          {items.map((item, idx) => (
            <li key={idx}>{inlineFormat(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^(#+)/)?.[1].length ?? 1;
      const content = line.replace(/^#+\s/, "");
      const Tag = `h${Math.min(level, 3)}` as "h1" | "h2" | "h3";
      nodes.push(<Tag key={`h-${i}`}>{inlineFormat(content)}</Tag>);
      i++;
      continue;
    }

    if (/^>\s/.test(line)) {
      const content = line.replace(/^>\s/, "");
      nodes.push(
        <blockquote key={`bq-${i}`}>{inlineFormat(content)}</blockquote>,
      );
      i++;
      continue;
    }

    if (line.trim() === "") {
      nodes.push(<div key={`sp-${i}`} style={{ height: 6 }} />);
      i++;
      continue;
    }

    nodes.push(<p key={`p-${i}`}>{inlineFormat(line)}</p>);
    i++;
  }

  return nodes;
}

function inlineFormat(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i}>{part.slice(1, -1)}</code>;
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch)
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkMatch[1]}
        </a>
      );
    return part;
  });
}

function resolveEntityTokens(
  text: string,
  entities: Record<string, { name: string; type: string }>,
): string {
  return text.replace(/\[\[(\w+):([^\]]+)\]\]/g, (_, _type, id) => {
    const entity = entities[id];
    return entity ? `**${entity.name}**` : id;
  });
}

// ─── ProgressLoader ───────────────────────────────────────────────────────────

const ProgressLoader: React.FC<{ steps: ProgressStep[] }> = ({ steps }) => {
  const [expanded, setExpanded] = useState(false);
  const allDone = steps.length > 0 && steps.every((s) => s.done);

  const [seconds, setSeconds] = useState(0);
  const finalSeconds = React.useRef<number>(0);
  React.useEffect(() => {
    if (allDone) {
      finalSeconds.current = seconds;
      return;
    }
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [allDone]);

  const latest = steps[steps.length - 1];
  if (!latest) return null;

  // ── In-progress: bordered card with bulb + current message ──
  if (!allDone) {
    return (
      <div
        style={{
          marginBottom: 12,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          padding: "10px 14px 12px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 8,
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V17a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2.8C7.21 13.16 6 11.22 6 9a6 6 0 0 1 6-6z" />
          </svg>
          <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>
            Thinking
          </span>
          <svg width="12" height="12" viewBox="0 0 20 20" fill="#9ca3af">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div
          key={latest.text}
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#374151",
            paddingLeft: 2,
            animation: "thinkFadeIn 0.15s ease-out",
          }}
        >
          {latest.text}
        </div>

        <style>{`
          @keyframes thinkFadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ── Done: no card, collapsible toggle ──
  return (
    <div style={{ marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          marginBottom: expanded ? 12 : 0,
        }}
      >
        <span style={{ fontSize: 14, color: "#374151", fontWeight: 400 }}>
          Thought for {finalSeconds.current || seconds}s
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="#9ca3af"
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {expanded && (
        <div style={{ paddingLeft: 2 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 20,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "1.5px solid #d1d5db",
                    background: "#fff",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      flex: 1,
                      background: "#e5e7eb",
                      minHeight: 16,
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#9ca3af",
                  paddingLeft: 10,
                  paddingBottom: i < steps.length - 1 ? 12 : 0,
                  lineHeight: "20px",
                }}
              >
                {step.text}
              </div>
            </div>
          ))}

          <div style={{ display: "flex", alignItems: "center", marginTop: 7 }}>
            <div
              style={{ width: 20, display: "flex", justifyContent: "center" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="10" />
                <path
                  d="M9 12l2 2 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span style={{ fontSize: 14, color: "#9ca3af", paddingLeft: 10 }}>
              Done
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ThinkingBlock ────────────────────────────────────────────────────────────
// Driven by workflow thought tasks from the SSE stream.
// While tasks are streaming in (not all done) → open, animated.
// Once workflow.item.done fires (all tasks marked done) AND content starts → collapses to a toggleable pill.

// ─── ThinkingBlock ────────────────────────────────────────────────────────────
// Matches ChatKit design:
// • While thinking: rounded border card, lightbulb icon, "Thinking >" header,
//   shows only the LATEST (current) task below in bold — single message at a time
// • When done: no card border, "Thought for Xs ∨" header (toggleable),
//   full task list with circle icons + vertical connector lines, "Done" at bottom

const ThinkingBlock: React.FC<{
  tasks: ThinkingTask[];
  isStreaming: boolean;
}> = ({ tasks, isStreaming }) => {
  const allDone = tasks.length > 0 && tasks.every((t) => t.done);
  const isThinking = !allDone || isStreaming;
  const [expanded, setExpanded] = useState(false);

  // Timer: count seconds while thinking
  const [seconds, setSeconds] = useState(0);
  const finalSeconds = React.useRef<number>(0);
  React.useEffect(() => {
    if (!isThinking) {
      finalSeconds.current = seconds;
      return;
    }
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isThinking]);

  const cleanContent = (text: string) => text.replace(/\*\*/g, "");

  // Current active task (last non-done, or last task while streaming)
  const currentTask = isThinking
    ? ([...tasks].reverse().find((t) => !t.done) ?? tasks[tasks.length - 1])
    : null;

  // ── Thinking state: bordered card ──────────────────────────────────────────
  if (isThinking) {
    return (
      <div
        style={{
          marginBottom: 12,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          padding: "10px 14px 12px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 8,
          }}
        >
          {/* Lightbulb icon */}
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V17a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2.8C7.21 13.16 6 11.22 6 9a6 6 0 0 1 6-6z" />
          </svg>
          <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>
            Thinking
          </span>
          {/* Right chevron */}
          <svg width="12" height="12" viewBox="0 0 20 20" fill="#9ca3af">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Current single task — bold, animated fade */}
        {currentTask && (
          <div
            key={currentTask.content}
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              paddingLeft: 2,
              animation: "thinkFadeIn 0.15s ease-out",
            }}
          >
            {cleanContent(currentTask.content)}
          </div>
        )}

        <style>{`
          @keyframes thinkFadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ── Done state: no card, toggle list ───────────────────────────────────────
  const displaySeconds = finalSeconds.current || seconds;

  return (
    <div
      style={{
        marginBottom: 12,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header — clickable */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          marginBottom: expanded ? 12 : 0,
        }}
      >
        <span style={{ fontSize: 14, color: "#374151", fontWeight: 400 }}>
          Thought for {displaySeconds}s
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="#9ca3af"
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Expanded task list */}
      {expanded && (
        <div style={{ paddingLeft: 2 }}>
          {tasks.map((task, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "flex-start", gap: 0 }}
            >
              {/* Icon + vertical line column */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 20,
                  flexShrink: 0,
                }}
              >
                {/* Circle icon */}
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "1.5px solid #d1d5db",
                    background: "#fff",
                    flexShrink: 0,
                    marginTop: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                {/* Vertical connector (not after last item) */}
                {i < tasks.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      flex: 1,
                      background: "#e5e7eb",
                      minHeight: 16,
                    }}
                  />
                )}
              </div>

              {/* Task text */}
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#9ca3af",
                  paddingLeft: 10,
                  paddingBottom: i < tasks.length - 1 ? 12 : 0,
                  lineHeight: "20px",
                }}
              >
                {cleanContent(task.content)}
              </div>
            </div>
          ))}

          {/* Done row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              marginTop: "7px",
            }}
          >
            <div
              style={{ width: 20, display: "flex", justifyContent: "center" }}
            >
              {/* Circled checkmark */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="10" />
                <path
                  d="M9 12l2 2 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize: 14,
                color: "#9ca3af",
                paddingLeft: 10,
                fontWeight: 400,
              }}
            >
              Done
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MessageBubble ────────────────────────────────────────────────────────────

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onWidgetAction,
  entities = {},
  widgetDisabled = false,
  feedback = null,
  feedbackLoading = false,
  onFeedback,
}) => {
  const rendered = useMemo(
    () => renderContent(message.content, entities ?? {}),
    [message.content, entities],
  );
  const isUser = message.role === "user";

  if (message.type === "widget" && message.widgetItem) {
    return (
      <WidgetRenderer
        widget={message.widgetItem.widget}
        onAction={onWidgetAction}
        disabled={widgetDisabled}
      />
    );
  }

  if (isUser) {
    const hasAttachments = (message.attachments?.length ?? 0) > 0;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          marginBottom: 16,
          gap: 6,
        }}
      >
        {hasAttachments && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              gap: 6,
              maxWidth: "85%",
            }}
          >
            {message.attachments!.map((att) => {
              const isImage = att.mimeType?.startsWith("image/");
              if (isImage && att.previewUrl) {
                return (
                  <ImageAttachment
                    key={att.id}
                    url={att.previewUrl}
                    name={att.name}
                  />
                );
              }
              return (
                <div
                  key={att.id}
                  style={{
                    padding: "8px 12px",
                    background: "#f3f4f6",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "#374151",
                    fontFamily: "'Inter', sans-serif",
                    maxWidth: 220,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={att.name}
                >
                  📎 {att.name ?? "Attachment"}
                </div>
              );
            })}
          </div>
        )}
        {message.content && (
          <div
            style={{
              maxWidth: "85%",
              background: "#f8fafc",
              color: "#0d0d0d",
              padding: "10px 16px",
              borderRadius: 12,
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              lineHeight: "24px",
              fontWeight: 400,
            }}
          >
            {message.content}
          </div>
        )}
      </div>
    );
  }

  // ── Derive display state ──────────────────────────────────────────────────
  const hasProgress = (message.progressSteps?.length ?? 0) > 0;
  const hasTasks = (message.thinkingTasks?.length ?? 0) > 0;
  const hasContent = !!message.content;
  const streaming = !!message.isStreaming;
  const allTasksDone = hasTasks && message.thinkingTasks!.every((t) => t.done);

  // Show thinking block if we have tasks (whether streaming or done)
  const showThinking = hasTasks;
  // Show dots only when truly nothing else: no progress, no tasks, no content
  const showDots = !hasProgress && !hasTasks && !hasContent && streaming;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          width: "98%",
        }}
      >
        <div
          className="chatWrapper"
          style={{ padding: "10px 16px", color: "#374151", minWidth: "98%" }}
        >
          {/* Progress steps (e.g. from progress_update events) */}
          {hasProgress && <ProgressLoader steps={message.progressSteps!} />}

          {/* Thinking block — shows tasks, collapses to pill once done + content arrives */}
          {showThinking && (
            <ThinkingBlock
              tasks={message.thinkingTasks!}
              // Still "streaming" visually until both workflow done AND content has started
              isStreaming={!allTasksDone || (!hasContent && streaming)}
            />
          )}

          {/* Main response content */}
          {hasContent && (
            <div
              style={{
                willChange: "contents",
                transition: "opacity 0.1s ease",
              }}
            >
              {renderContent(message.content, entities ?? {})}
            </div>
          )}

          {/* Fallback bubble dots */}
          {showDots && <ThinkingDots />}

          {/* Feedback (thumbs up / down) — only on completed bot text replies */}
          {hasContent && !streaming && onFeedback && message.id && (
            <FeedbackButtons
              messageId={message.id}
              feedback={feedback}
              loading={feedbackLoading}
              onFeedback={onFeedback}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const ThinkingDots: React.FC = () => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "12px 16px",
      // borderRadius: "18px 18px 18px 4px",
      // background: "#f1f3f4",
      alignSelf: "flex-start",
      marginTop: 4,
    }}
  >
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#111",
          display: "inline-block",
          animation: "thinkPulse 1.4s infinite ease-in-out",
          animationDelay: `${[-0.32, -0.16, 0][i]}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes thinkPulse {
        0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; }
        40%            { transform: scale(1);   opacity: 1; }
      }
    `}</style>
  </div>
);
