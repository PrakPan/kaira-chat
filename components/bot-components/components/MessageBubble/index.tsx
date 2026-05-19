import React, { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import type { Message, ProgressStep, ThinkingTask } from "../../hooks/useChat";
import { WidgetRenderer } from "../WidgetRenderer";

const USER_IMAGE_CDN = "https://d31aoa0ehgvjdi.cloudfront.net/";

function useUserAvatarSrc(): string | null {
  const reduxImage = useSelector((state: any) => state?.auth?.image);
  const token = useSelector((state: any) => state?.auth?.token);
  const [localImg, setLocalImg] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("user_image") : null,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setLocalImg(token ? localStorage.getItem("user_image") : null);
  }, [token]);

  if (!token) return null;
  const candidate =
    reduxImage && reduxImage !== "null" ? reduxImage : localImg;
  if (!candidate || candidate === "null") return null;
  if (/^https?:\/\//i.test(candidate)) return candidate;
  return USER_IMAGE_CDN + candidate;
}

const UserFallbackIcon: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

// Shared responsive rules for the message bubble. On phones the avatar
// (Kaira on the left, user on the right) eats horizontal room in the flex
// row — we lift it out of flow and re-pin it as a small floating badge
// overlapping the bubble's top corner. Also tightens the bubble max-width
// and adds a hint of horizontal padding so cards don't kiss the screen
// edge. Desktop layout is unchanged.
// `!important` is required because the avatar divs set sizing/display
// inline, and we override `.msg.kaira` / `.msg.user` inline `maxWidth`.
const MessageBubbleResponsiveStyles: React.FC = () => (
  <style>{`
    @media (max-width: 767px) {
      .msg {
        position: relative;
        padding-top: 14px;
      }
      .msg.kaira { max-width: 92% !important; padding-left: 2px; }
      .msg.user  { padding-right: 2px; }
      .msg-avatar {
        position: absolute !important;
        top: 0 !important;
        width: 24px !important;
        height: 24px !important;
        box-sizing: border-box !important;
        z-index: 2;
        border: 2px solid #fff !important;
        box-shadow: 0 1px 4px rgba(11,18,32,0.18);
      }
      .msg.kaira .msg-avatar { left: 0; }
      .msg.user  .msg-avatar { right: 0; }
    }
  `}</style>
);

const UserAvatar: React.FC = () => {
  const avatarSrc = useUserAvatarSrc();
  const [errored, setErrored] = useState(false);
  const showImage = !!avatarSrc && !errored;
  return (
    <div
      aria-hidden
      className="msg-avatar"
      style={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        flexShrink: 0,
        overflow: "hidden",
        background: "#0f1a2e",
        color: "#f7e700",
        display: "grid",
        placeItems: "center",
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {showImage ? (
        <img
          src={avatarSrc!}
          alt="You"
          onError={() => setErrored(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <UserFallbackIcon />
      )}
    </div>
  );
};

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

// A widget is "button-only" when it renders nothing but a single Button —
// pure CTA prompts like "Confirm This Route" or "Build Itinerary". Layout
// nodes (Card/Form/Row/Col/Box/ListView/Spacer/Divider) and Labels are
// transparent; any other content node (Text/Title/Caption/Image/Icon/Input/
// Select/Textarea) disqualifies the widget.
const WIDGET_LAYOUT_TYPES = new Set([
  "Card",
  "Form",
  "ListView",
  "ListViewItem",
  "Row",
  "Col",
  "Box",
  "Spacer",
  "Divider",
  "Label",
]);

function inspectWidgetContent(node: unknown): { buttons: number; others: number } {
  if (!node || typeof node !== "object") return { buttons: 0, others: 0 };
  const n = node as { type?: string; iconStart?: string; children?: unknown[] };
  let buttons = 0;
  let others = 0;
  if (n.type === "Button") {
    if (n.iconStart !== "dots-horizontal") buttons += 1;
  } else if (n.type && !WIDGET_LAYOUT_TYPES.has(n.type)) {
    others += 1;
  }
  if (Array.isArray(n.children)) {
    for (const child of n.children) {
      const r = inspectWidgetContent(child);
      buttons += r.buttons;
      others += r.others;
    }
  }
  return { buttons, others };
}

export function isButtonOnlyWidget(widget: Record<string, unknown>): boolean {
  const { buttons, others } = inspectWidgetContent(widget);
  return buttons === 1 && others === 0;
}

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
  /** Re-send the previous user message. Provided only for network-error
   *  assistant bubbles so we can render a retry CTA in place of feedback. */
  onRetry?: () => void;
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
      // Preserve the source numbering across blank lines / indented sub-content.
      // Each gap would otherwise spawn a fresh <ol> that resets to 1, so we
      // capture the first item's number and pass it as `start` on the <ol>.
      const firstMatch = line.match(/^(\d+)\.\s/);
      const startNumber = firstMatch ? parseInt(firstMatch[1], 10) : 1;
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} start={startNumber}>
          {items.map((item, idx) => (
            <li key={idx}>{inlineFormat(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    if (/^\s*[-*_]{3,}\s*$/.test(line)) {
      nodes.push(
        <hr
          key={`hr-${i}`}
          style={{
            border: "none",
            borderTop: "1px dashed #d1d5db",
            margin: "10px 0",
          }}
        />,
      );
      i++;
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

    if (/^\s*>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      nodes.push(
        <blockquote
          key={`bq-${i}`}
          style={{
            borderLeft: "3px solid #d1d5db",
            paddingLeft: 12,
            margin: "8px 0",
            color: "#4b5563",
          }}
        >
          {quoteLines.map((q, idx) => (
            <React.Fragment key={idx}>
              {q.trim() === "" ? <br /> : inlineFormat(q)}
              {idx < quoteLines.length - 1 && q.trim() !== "" && <br />}
            </React.Fragment>
          ))}
        </blockquote>,
      );
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

// ─── ThinkingLoaderShell ──────────────────────────────────────────────────────
// Optional lead line above a navy gradient row containing a yellow spinner
// and the current step. Only one message is shown at a time — once a new
// event arrives, the previous step is dropped from the card. Completed
// steps don't render here; they move into the "Thought for Xs" collapsible
// in ProgressLoader / ThinkingBlock once the loader finishes.

const ThinkingLoaderShell: React.FC<{
  lead?: string;
  activeText: string;
}> = ({ lead, activeText }) => (
  <div
    style={{
      marginBottom: 12,
      width: "100%",
      maxWidth: "100%",
      boxSizing: "border-box",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}
  >
    {/* Optional lead */}
    {lead && (
      <div
        style={{
          fontWeight: 700,
          fontSize: 13.5,
          marginBottom: 8,
          color: "#0D1429",
          lineHeight: 1.4,
        }}
      >
        {lead}
      </div>
    )}

    {/* Navy gradient single-row loader */}
    {activeText && (
      <div
        style={{
          marginTop: lead ? 8 : 0,
          background: "linear-gradient(135deg,#0D1429 0%,#1A2238 100%)",
          color: "#fff",
          borderRadius: 12,
          padding: 12,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 80% 20%, rgba(244,232,39,0.18) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          key={activeText}
          style={{
            position: "relative",
            fontWeight: 700,
            fontSize: 12.5,
            display: "flex",
            alignItems: "center",
            gap: 7,
            lineHeight: 1.45,
            animation: "thinkRowIn 0.22s ease-out",
          }}
        >
          <span
            style={{
              width: 13,
              height: 13,
              border: "2px solid rgba(244,232,39,0.3)",
              borderTopColor: "#F4E827",
              borderRadius: "50%",
              animation: "thinkSpin 1s linear infinite",
              flexShrink: 0,
              display: "inline-block",
              boxSizing: "border-box",
            }}
          />
          <span style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
            {activeText}
          </span>
        </div>
      </div>
    )}

    <style>{`
      @keyframes thinkRowIn {
        from { opacity: 0; transform: translateY(4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes thinkSpin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

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

  // ── In-progress: lead + navy single-row loader showing only the current step.
  // Completed steps are exposed via the "Thought for Xs" collapsible below.
  if (!allDone) {
    const activeStep = steps[steps.length - 1];

    return (
      <ThinkingLoaderShell
        lead="Great — locking it in. Give me ~30 seconds."
        activeText={activeStep?.text ?? ""}
      />
    );
  }

  // ── Done: no card, collapsible toggle ──
  return (
    <div style={{ marginBottom: 12, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
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

  // ── Thinking state: lead + navy single-row loader showing only the current
  // task. Completed tasks are exposed via the "Thought for Xs" collapsible.
  if (isThinking) {
    const activeTask = tasks[tasks.length - 1];

    return (
      <ThinkingLoaderShell
        lead="Great — locking it in. Give me ~30 seconds."
        activeText={activeTask ? cleanContent(activeTask.content) : ""}
      />
    );
  }

  // ── Done state: no card, toggle list ───────────────────────────────────────
  const displaySeconds = finalSeconds.current || seconds;

  return (
    <div
      style={{
        marginBottom: 12,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
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

// ─── RetryButton ──────────────────────────────────────────────────────────────
// Shown in place of feedback thumbs when an assistant message failed to send
// because the user was offline. Re-sends the previous user message via the
// onRetry callback supplied by ChatKitPanel.

const RetryButton: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <button
    type="button"
    onClick={onRetry}
    onMouseEnter={(e) => (e.currentTarget.style.color = "#991b1b")}
    onMouseLeave={(e) => (e.currentTarget.style.color = "#dc2626")}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: 0,
      border: "none",
      background: "transparent",
      color: "#dc2626",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      // textDecoration: "underline",
      textUnderlineOffset: 3,
      transition: "color 0.15s ease",
    }}
  >
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
    Retry
  </button>
);

// ─── ErrorBubble ──────────────────────────────────────────────────────────────
// Inline error treatment for assistant messages whose send failed (network or
// generic). Distinct from regular text: red-tinted card, alert icon, and a
// subtle fade-in. The composer's own clear-on-resend logic removes this bubble
// when the user retries, so we don't need an explicit dismiss control here.

const ErrorBubble: React.FC<{
  variant: "network" | "generic";
  text: string;
  onRetry?: () => void;
}> = ({ variant, text, onRetry }) => {
  const isNetwork = variant === "network";
  const accent = "#dc2626";
  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid #fecaca",
        background: "#fef2f2",
        color: "#7f1d1d",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: 14,
        lineHeight: "20px",
        animation: "errFadeIn 0.18s ease-out",
        marginTop: 2,
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#fee2e2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {isNetwork ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 8.82a15 15 0 0 1 20 0" />
            <path d="M5 12.859a10 10 0 0 1 14 0" />
            <path d="M8.5 16.429a5 5 0 0 1 7 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
            <line x1="2" y1="2" x2="22" y2="22" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: accent, marginBottom: 2 }}>
          {isNetwork ? "Connection issue" : "Something went wrong"}
        </div>
        <div style={{ color: "#7f1d1d" }}>{text}</div>
        {isNetwork && onRetry && (
          <div style={{ marginTop: 6 }}>
            <RetryButton onRetry={onRetry} />
          </div>
        )}
      </div>
      <style>{`
        @keyframes errFadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ─── Chat typography (matches design-system.html · 04 · Typography) ──────────
// Applied to any markdown-rendered content inside a chat bubble. Sizes use
// clamp() so a paragraph that's tight on a 375px phone scales smoothly up to
// the design's 14.5/17/19/22px steps on desktop.
const ChatMdStyles: React.FC = () => (
  <style>{`
    .chat-md {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: clamp(13.5px, 3.6vw, 14.5px);
      line-height: 1.55;
      color: #1a2436;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .chat-md p { margin: 0 0 6px; }
    .chat-md p:last-child { margin-bottom: 0; }
    .chat-md ul, .chat-md ol { margin: 6px 0; padding-left: 18px; }
    .chat-md ul + p, .chat-md ol + p { margin-top: 6px; }
    .chat-md li { margin-bottom: 2px; }
    .chat-md li::marker { color: #8a93a6; }
    .chat-md h1 {
      font-size: clamp(17px, 4.6vw, 19px);
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.2;
      margin: 8px 0 6px;
      color: #0b1220;
    }
    .chat-md h2 {
      font-size: clamp(15.5px, 4vw, 17px);
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.2;
      margin: 8px 0 6px;
      color: #0b1220;
    }
    .chat-md h3 {
      font-size: clamp(14px, 3.7vw, 15.5px);
      font-weight: 700;
      letter-spacing: -0.015em;
      line-height: 1.3;
      margin: 6px 0 4px;
      color: #0b1220;
    }
    .chat-md h1:first-child,
    .chat-md h2:first-child,
    .chat-md h3:first-child { margin-top: 0; }
    .chat-md strong, .chat-md b { font-weight: 700; color: #0b1220; }
    .chat-md em {
      font-family: 'Instrument Serif', 'Inter', serif;
      font-style: italic;
      font-weight: 400;
      letter-spacing: -0.01em;
    }
    .chat-md code {
      font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
      font-size: clamp(11.5px, 3vw, 13px);
      background: #fafaf5;
      border: 1px solid #f4f3ec;
      padding: 1px 5px;
      border-radius: 4px;
      color: #1a2436;
    }
    .chat-md a {
      color: #0b1220;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .chat-md hr {
      border: none;
      border-top: 1px dashed #ececec;
      margin: 10px 0;
    }
    .chat-md blockquote {
      border-left: 3px solid #ececec;
      padding-left: 10px;
      margin: 8px 0;
      color: #445069;
      font-size: clamp(13px, 3.4vw, 14px);
    }
    /* User bubble inverts text colour, but inherits the same scale. */
    .chat-md.user { color: #fff; }
    .chat-md.user strong, .chat-md.user b { color: #fff; }
    .chat-md.user a { color: #f7e700; }
    .chat-md.user code {
      background: rgba(255,255,255,0.08);
      border-color: rgba(255,255,255,0.16);
      color: #fff;
    }
  `}</style>
);

// ─── MessageBubble ────────────────────────────────────────────────────────────

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onWidgetAction,
  entities = {},
  widgetDisabled = false,
  feedback = null,
  feedbackLoading = false,
  onFeedback,
  onRetry,
}) => {
  const rendered = useMemo(
    () => renderContent(message.content, entities ?? {}),
    [message.content, entities],
  );
  const isUser = message.role === "user";

  if (message.type === "widget" && message.widgetItem) {
    const buttonOnly = isButtonOnlyWidget(message.widgetItem.widget);

    // Pure CTA widgets (e.g. "Confirm This Route") render bare — no avatar,
    // no bubble surround. They're a UI prompt, not a Kaira utterance, so the
    // conversation visual shouldn't anchor them to her.
    if (buttonOnly) {
      return (
        <div>
          <WidgetRenderer
            widget={message.widgetItem.widget}
            onAction={onWidgetAction}
            disabled={widgetDisabled}
          />
        </div>
      );
    }

    return (
      <div
        className="msg kaira"
        style={{
          display: "flex",
          gap: 10,
          maxWidth: "98%",
          marginBottom: 14,
          animation: "msgInK 0.3s ease-out",
        }}
      >
        {/* Kaira avatar — same gradient ring + image as text replies, so
            content widget messages read as part of the same turn. Hidden on
            phones (see MessageBubbleResponsiveStyles) to give the widget
            card full width. */}
        <div
          aria-hidden
          className="msg-avatar"
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            flexShrink: 0,
            overflow: "hidden",
            background: "linear-gradient(180deg, #a8d2f5, #7ab8e8)",
          }}
        >
          <img
            src="/KairaInsta.png"
            alt="Kaira"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          {/* Content widgets sit on the Kaira bubble surface — inner cards
              (transport, activity, POI) stay white on top of this base. */}
          <div
            style={{
              background: "#fafaf5",
              borderRadius: 16,
              borderBottomLeftRadius: 5,
              padding: "11px 12px",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            <WidgetRenderer
              widget={message.widgetItem.widget}
              onAction={onWidgetAction}
              disabled={widgetDisabled}
            />
          </div>
          <div className="ml-1">
            {onFeedback && message.id && (
              <FeedbackButtons
                messageId={message.id}
                feedback={feedback}
                loading={feedbackLoading}
                onFeedback={onFeedback}
              />
            )}
          </div>
        </div>
        <MessageBubbleResponsiveStyles />
        <style>{`
          @keyframes msgInK {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  if (isUser) {
    const hasAttachments = (message.attachments?.length ?? 0) > 0;
    return (
      <div
        className="msg user"
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          gap: 10,
          maxWidth: "85%",
          marginLeft: "auto",
          marginBottom: 14,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          animation: "msgIn 0.3s ease-out",
        }}
      >
        <UserAvatar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, minWidth: 0 }}>
          {hasAttachments && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-end",
                gap: 6,
                maxWidth: "100%",
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
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
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
              className="chat-md user"
              style={{
                padding: "11px 15px",
                background: "#0f1a2e",
                borderRadius: 16,
                borderBottomRightRadius: 5,
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              {message.content}
            </div>
          )}
        </div>
        <ChatMdStyles />
        <MessageBubbleResponsiveStyles />
        <style>{`
          @keyframes msgIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
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

  // Plain text replies sit inside a soft Kaira-style bubble (mirrors
  // `.msg.kaira .msg-bubble` in chat-active-v2.html). Thinking/progress
  // blocks and error bubbles have their own card design and keep it.
  const showPlainBubble = hasContent && !message.isError;

  return (
    <div
      className="msg kaira"
      style={{
        display: "flex",
        gap: 10,
        maxWidth: "98%",
        marginBottom: 14,
        animation: "msgInK 0.3s ease-out",
      }}
    >
      <div
        aria-hidden
        className="msg-avatar"
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          flexShrink: 0,
          overflow: "hidden",
          background: "linear-gradient(180deg, #a8d2f5, #7ab8e8)",
        }}
      >
        <img
          src="/KairaInsta.png"
          alt="Kaira"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div
        className="chatWrapper"
        style={{
          color: "#1a2436",
          minWidth: 0,
          flex: 1,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
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
        {hasContent && message.isError ? (
          <ErrorBubble
            variant={message.errorVariant ?? "generic"}
            text={message.content}
            onRetry={onRetry}
          />
        ) : showPlainBubble ? (
          <div
            className="chat-md kaira"
            style={{
              padding: "11px 15px",
              background: "#fafaf5",
              borderRadius: 16,
              borderBottomLeftRadius: 5,
              willChange: "contents",
              transition: "opacity 0.1s ease",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {renderContent(message.content, entities ?? {})}
          </div>
        ) : null}

        {/* Fallback bubble dots */}
        {showDots && <ThinkingDots />}

        {/* Feedback (thumbs up / down) — only on completed bot text replies.
            Suppressed for network errors; the retry CTA inside ErrorBubble
            takes its place. */}
        {hasContent &&
          !streaming &&
          onFeedback &&
          message.id &&
          !(message.isError && message.errorVariant === "network") && (
            <FeedbackButtons
              messageId={message.id}
              feedback={feedback}
              loading={feedbackLoading}
              onFeedback={onFeedback}
            />
          )}
      </div>
      <ChatMdStyles />
      <MessageBubbleResponsiveStyles />
      <style>{`
        @keyframes msgInK {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
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
