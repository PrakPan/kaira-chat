import React, { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import type { Message, ProgressStep, ThinkingTask } from "../../hooks/useChat";
import { WidgetRenderer } from "../WidgetRenderer";
import {
  getUserAvatarColor,
  getAvatarColorForName,
  getUserInitial,
} from "../../utils/avatarColor";

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
        /* Keep bubbles off the screen edges on phones. */
        padding-left: 12px;
        padding-right: 12px;
      }
      /* Bot bubble fills the row on mobile. The avatar is absolutely
         positioned (below), so it floats above the bubble's top-left
         corner without pushing the content. */
      .msg.kaira {
        max-width: 100% !important;
        width: 100%;
      }
      .msg.kaira > .chatWrapper,
      .msg.kaira > div:not(.msg-avatar) { flex: 1 1 auto; min-width: 0; }
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
      .msg.kaira .msg-avatar { left: 12px; }
      .msg.user  .msg-avatar { right: 12px; }
    }
  `}</style>
);

const UserAvatar: React.FC = () => {
  const avatarSrc = useUserAvatarSrc();
  const token = useSelector((state: any) => state?.auth?.token);
  const name = useSelector((state: any) => state?.auth?.name);
  // When an existing itinerary is open, the chat belongs to that itinerary's
  // customer — show their initial, not the viewer's avatar. A brand-new chat
  // has no itinerary customer_name, so we fall back to the logged-in user.
  const customerNameRaw = useSelector(
    (state: any) => state?.Itinerary?.customer_name,
  );
  // In the P1/draft stage no itinerary exists in redux yet, so the customer is
  // only known from the thread's get_by_id `customer_name` (chatState). Prefer
  // the itinerary's customer_name when present, otherwise fall back to the
  // thread's; if neither exists we use the current logged-in-user flow.
  const threadCustomerRaw = useSelector(
    (state: any) => state?.chatState?.customerName,
  );
  const resolvedCustomerRaw =
    (typeof customerNameRaw === "string" && customerNameRaw.trim()
      ? customerNameRaw
      : null) ??
    (typeof threadCustomerRaw === "string" && threadCustomerRaw.trim()
      ? threadCustomerRaw
      : null);
  const itineraryCustomer = resolvedCustomerRaw
    ? resolvedCustomerRaw.trim()
    : null;

  // The logged-in user's own name — redux first, then the copy localStorage
  // persists under "name". Used to detect when the open itinerary actually
  // belongs to the viewer themselves.
  const loggedInName = useMemo(() => {
    const fromRedux =
      typeof name === "string" && name.trim() ? name.trim() : null;
    if (fromRedux) return fromRedux;
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("name");
    return stored && stored.trim() ? stored.trim() : null;
  }, [name]);

  // If the itinerary's customer_name matches the logged-in user, it's their own
  // itinerary — show their own profile (photo/avatar) instead of a generic
  // customer letter avatar.
  const isOwnItinerary =
    !!itineraryCustomer &&
    !!loggedInName &&
    itineraryCustomer.toLowerCase() === loggedInName.toLowerCase();

  const viewingItinerary = !!itineraryCustomer && !isOwnItinerary;

  const [errored, setErrored] = useState(false);

  // Viewing an itinerary → always the customer's letter avatar (we don't have
  // their photo). New chat → the logged-in user's avatar (photo if available).
  const showImage = !viewingItinerary && !!avatarSrc && !errored;
  const showLetter = !showImage && (viewingItinerary || !!token);
  const letterName = viewingItinerary ? itineraryCustomer : name;

  const [color, setColor] = useState<string | null>(null);
  useEffect(() => {
    if (!showLetter) {
      setColor(null);
    } else if (viewingItinerary) {
      // Other person's color is derived from their name (never persisted, so it
      // doesn't clobber the logged-in user's own stored color).
      setColor(getAvatarColorForName(letterName));
    } else {
      setColor(getUserAvatarColor(letterName));
    }
  }, [showLetter, viewingItinerary, letterName]);

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
        background: color || "#0f1a2e",
        color: color ? "#fff" : "#f7e700",
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
      ) : showLetter ? (
        getUserInitial(letterName)
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
  /** Toggle feedback for this message; ChatKitPanel handles create/change/delete.
   *  An optional `message` and `label` are collected via popup when activating
   *  thumbs-down. */
  onFeedback?: (
    messageId: string,
    type: "up" | "down",
    message?: string,
    label?: FeedbackLabel,
  ) => void;
  /** Re-send the previous user message. Provided only for network-error
   *  assistant bubbles so we can render a retry CTA in place of feedback. */
  onRetry?: () => void;
}

// ─── Feedback icons (thumbs up / thumbs down) ─────────────────────────────────

// Outer silhouettes — used as a tinted backdrop under the outline path so the
// active state reads as "filled with a lighter shade of the current color".
const THUMBS_UP_SILHOUETTE =
  "M18.9775 6.43432C18.5867 5.98399 18.1038 5.62288 17.5613 5.37545C17.0189 5.12801 16.4296 5.00002 15.8333 5.00015H12.5092L12.7892 3.29932C12.8882 2.70037 12.7687 2.08576 12.4524 1.5676C12.1361 1.04944 11.644 0.662246 11.066 0.476645C10.488 0.291044 9.8625 0.319403 9.30365 0.556548C8.74479 0.793693 8.2898 1.22382 8.02167 1.76849L6.42667 5.00015H4.16667C3.062 5.00147 2.00296 5.44089 1.22185 6.222C0.440735 7.00312 0.00132321 8.06216 0 9.16682L0 13.3335C0.00132321 14.4381 0.440735 15.4972 1.22185 16.2783C2.00296 17.0594 3.062 17.4988 4.16667 17.5002H15.25C16.2529 17.496 17.221 17.1321 17.9782 16.4745C18.7354 15.8168 19.2313 14.9092 19.3758 13.9168L19.9633 9.75015C20.0461 9.1591 20.0009 8.55716 19.8308 7.98509C19.6607 7.41302 19.3697 6.88417 18.9775 6.43432Z";

const THUMBS_DOWN_SILHOUETTE =
  "M19.9592 10.25L19.3717 6.08333C19.2273 5.09161 18.7319 4.18459 17.9756 3.52706C17.2193 2.86952 16.2522 2.5051 15.25 2.5H4.16666C3.062 2.50132 2.00296 2.94073 1.22184 3.72185C0.440727 4.50296 0.00131559 5.562 -7.62939e-06 6.66667L-7.62939e-06 10.8333C0.00131559 11.938 0.440727 12.997 1.22184 13.7782C2.00296 14.5593 3.062 14.9987 4.16666 15H6.42666L8.02166 18.2317C8.2898 18.7763 8.74479 19.2065 9.30364 19.4436C9.86249 19.6807 10.488 19.7091 11.066 19.5235C11.644 19.3379 12.1361 18.9507 12.4524 18.4326C12.7687 17.9144 12.8882 17.2998 12.7892 16.7008L12.5092 15H15.8333C16.4298 15 17.0193 14.872 17.5621 14.6245C18.1048 14.3771 18.5881 14.016 18.9792 13.5657C19.3704 13.1154 19.6603 12.5863 19.8293 12.0143C19.9984 11.4423 20.0427 10.8406 19.9592 10.25Z";

const ThumbsUpIcon: React.FC<{ filled?: boolean }> = ({ filled = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    {filled && (
      <path d={THUMBS_UP_SILHOUETTE} fill="currentColor" fillOpacity={0.22} />
    )}
    <path
      d="M18.9775 6.43432C18.5867 5.98399 18.1038 5.62288 17.5613 5.37545C17.0189 5.12801 16.4296 5.00002 15.8333 5.00015H12.5092L12.7892 3.29932C12.8882 2.70037 12.7687 2.08576 12.4524 1.5676C12.1361 1.04944 11.644 0.662246 11.066 0.476645C10.488 0.291044 9.8625 0.319403 9.30365 0.556548C8.74479 0.793693 8.2898 1.22382 8.02167 1.76849L6.42667 5.00015H4.16667C3.062 5.00147 2.00296 5.44089 1.22185 6.222C0.440735 7.00312 0.00132321 8.06216 0 9.16682L0 13.3335C0.00132321 14.4381 0.440735 15.4972 1.22185 16.2783C2.00296 17.0594 3.062 17.4988 4.16667 17.5002H15.25C16.2529 17.496 17.221 17.1321 17.9782 16.4745C18.7354 15.8168 19.2313 14.9092 19.3758 13.9168L19.9633 9.75015C20.0461 9.1591 20.0009 8.55716 19.8308 7.98509C19.6607 7.41302 19.3697 6.88417 18.9775 6.43432ZM1.66667 13.3335V9.16682C1.66667 8.50378 1.93006 7.86789 2.3989 7.39905C2.86774 6.93021 3.50363 6.66682 4.16667 6.66682H5.83333V15.8335H4.16667C3.50363 15.8335 2.86774 15.5701 2.3989 15.1013C1.93006 14.6324 1.66667 13.9965 1.66667 13.3335ZM18.3092 9.51599L17.7208 13.6827C17.6348 14.2776 17.3381 14.822 16.8847 15.2167C16.4312 15.6114 15.8512 15.8303 15.25 15.8335H7.5V6.44515C7.57853 6.37673 7.64355 6.2942 7.69167 6.20182L9.51583 2.50599C9.58424 2.38259 9.68095 2.27719 9.79802 2.19845C9.91509 2.11971 10.0492 2.06987 10.1893 2.05303C10.3293 2.0362 10.4714 2.05284 10.6038 2.10159C10.7362 2.15035 10.8551 2.22982 10.9508 2.33348C11.0327 2.42869 11.0926 2.54079 11.1261 2.66179C11.1597 2.78279 11.1661 2.90971 11.145 3.03349L10.705 5.70015C10.6857 5.8193 10.6925 5.94123 10.7249 6.05749C10.7574 6.17375 10.8147 6.28158 10.8929 6.37351C10.9711 6.46544 11.0684 6.53928 11.178 6.58993C11.2875 6.64057 11.4068 6.6668 11.5275 6.66682H15.8333C16.1912 6.66677 16.5448 6.74354 16.8705 6.89194C17.1961 7.04034 17.486 7.25691 17.7207 7.52701C17.9555 7.79712 18.1294 8.11446 18.231 8.4576C18.3325 8.80073 18.3591 9.16166 18.3092 9.51599Z"
      fill="currentColor"
    />
  </svg>
);

const ThumbsDownIcon: React.FC<{ filled?: boolean }> = ({ filled = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    {filled && (
      <path d={THUMBS_DOWN_SILHOUETTE} fill="currentColor" fillOpacity={0.22} />
    )}
    <path
      d="M19.9592 10.25L19.3717 6.08333C19.2273 5.09161 18.7319 4.18459 17.9756 3.52706C17.2193 2.86952 16.2522 2.5051 15.25 2.5H4.16666C3.062 2.50132 2.00296 2.94073 1.22184 3.72185C0.440727 4.50296 0.00131559 5.562 -7.62939e-06 6.66667L-7.62939e-06 10.8333C0.00131559 11.938 0.440727 12.997 1.22184 13.7782C2.00296 14.5593 3.062 14.9987 4.16666 15H6.42666L8.02166 18.2317C8.2898 18.7763 8.74479 19.2065 9.30364 19.4436C9.86249 19.6807 10.488 19.7091 11.066 19.5235C11.644 19.3379 12.1361 18.9507 12.4524 18.4326C12.7687 17.9144 12.8882 17.2998 12.7892 16.7008L12.5092 15H15.8333C16.4298 15 17.0193 14.872 17.5621 14.6245C18.1048 14.3771 18.5881 14.016 18.9792 13.5657C19.3704 13.1154 19.6603 12.5863 19.8293 12.0143C19.9984 11.4423 20.0427 10.8406 19.9592 10.25ZM4.16666 4.16667H5.83333V13.3333H4.16666C3.50362 13.3333 2.86773 13.0699 2.39889 12.6011C1.93005 12.1323 1.66666 11.4964 1.66666 10.8333V6.66667C1.66666 6.00363 1.93005 5.36774 2.39889 4.8989C2.86773 4.43006 3.50362 4.16667 4.16666 4.16667ZM17.72 12.4733C17.4853 12.7433 17.1955 12.9598 16.87 13.1081C16.5445 13.2565 16.191 13.3333 15.8333 13.3333H11.5275C11.4066 13.3333 11.2872 13.3596 11.1775 13.4103C11.0678 13.4611 10.9704 13.5351 10.8922 13.6272C10.8139 13.7193 10.7567 13.8273 10.7243 13.9438C10.692 14.0603 10.6854 14.1824 10.705 14.3017L11.145 16.9683C11.1661 17.0921 11.1597 17.219 11.1261 17.34C11.0926 17.461 11.0327 17.5731 10.9508 17.6683C10.8548 17.7718 10.7356 17.851 10.603 17.8995C10.4705 17.9479 10.3283 17.9642 10.1882 17.9469C10.0481 17.9297 9.91405 17.8794 9.79716 17.8003C9.68028 17.7211 9.58386 17.6154 9.51583 17.4917L7.69166 13.7983C7.64354 13.706 7.57853 13.6234 7.49999 13.555V4.16667H15.25C15.8519 4.16887 16.4329 4.38727 16.8872 4.78208C17.3416 5.17689 17.6389 5.7218 17.725 6.3175L18.3133 10.4842C18.3627 10.8389 18.3352 11.2001 18.2329 11.5432C18.1305 11.8864 17.9556 12.2036 17.72 12.4733Z"
      fill="currentColor"
    />
  </svg>
);

// ─── Feedback message popup (thumbs-down) ─────────────────────────────────────
// Centered modal shown when the user marks a response as unhelpful. Collects:
//   • A required `label` chosen from FEEDBACK_LABELS (single-select dropdown).
//   • An optional free-text `message` — only revealed when the user picks
//     "Other", since the canned labels already cover the common cases.
// Submit closes immediately; FeedbackButtons reflects the in-flight API call.
const FEEDBACK_LABELS: Record<string, string> = {
  wrong_info: "Wrong information",
  missed_intent: "Didn't understand me",
  bad_tone: "Tone or clarity issue",
  hallucination: "Hallucinated response",
  bad_recommendation: "Bad recommendation",
  other: "Other",
};

export type FeedbackLabel = keyof typeof FEEDBACK_LABELS;

const FeedbackPopup: React.FC<{
  onSubmit: (label: FeedbackLabel, message: string) => void;
  onClose: () => void;
}> = ({ onSubmit, onClose }) => {
  const [label, setLabel] = useState<FeedbackLabel | "">("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  const handleSend = () => {
    if (sent) return;
    if (!label) return;
    setSent(true);
    onSubmit(label, message.trim());
  };

  const showOtherInput = label === "other";
  const canSubmit = !!label;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.55)",
        zIndex: 3500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        fontFamily: "'Inter', sans-serif",
        animation: "fbBackdropIn 0.15s ease-out",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-popup-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#ffffff",
          borderRadius: 16,
          boxShadow:
            "0 20px 50px rgba(15, 23, 42, 0.22), 0 4px 12px rgba(15, 23, 42, 0.08)",
          padding: "20px 20px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          boxSizing: "border-box",
          animation: "fbPopupIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              id="feedback-popup-title"
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#0d0d0d",
                marginBottom: 4,
                lineHeight: "22px",
              }}
            >
              Tell us more
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", lineHeight: "18px" }}>
              Pick the closest reason — it helps us improve faster than free
              text alone.
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: "#6b7280",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              flexShrink: 0,
              transition: "background 0.15s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            htmlFor="feedback-label-select"
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#374151",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            What went wrong?
          </label>
          <div style={{ position: "relative" }}>
            <select
              id="feedback-label-select"
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value as FeedbackLabel | "")}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#0d0d0d";
                e.currentTarget.style.background = "#ffffff";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.background = "#f8fafc";
              }}
              style={{
                width: "100%",
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                padding: "11px 38px 11px 14px",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                background: "#f8fafc",
                color: label ? "#0d0d0d" : "#9ca3af",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                lineHeight: "20px",
                outline: "none",
                boxSizing: "border-box",
                cursor: "pointer",
                transition: "border-color 0.15s ease, background 0.15s ease",
              }}
            >
              <option value="" disabled>
                Select a reason…
              </option>
              {Object.entries(FEEDBACK_LABELS).map(([value, text]) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        <textarea
          autoFocus={showOtherInput}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            showOtherInput
              ? "Tell us what went wrong"
              : "Add more details (optional)"
          }
          maxLength={1000}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#0d0d0d";
            e.currentTarget.style.background = "#ffffff";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#e5e7eb";
            e.currentTarget.style.background = "#f8fafc";
          }}
          style={{
            width: "100%",
            minHeight: 96,
            maxHeight: 220,
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#f8fafc",
            color: "#0d0d0d",
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            lineHeight: "20px",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.15s ease, background 0.15s ease",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={sent}
            onMouseEnter={(e) => {
              if (!sent) e.currentTarget.style.background = "#f3f4f6";
            }}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
            style={{
              padding: "9px 16px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              color: "#374151",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              cursor: sent ? "not-allowed" : "pointer",
              transition: "background 0.15s ease",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={sent || !canSubmit}
            onMouseEnter={(e) => {
              if (!sent && canSubmit) e.currentTarget.style.background = "#1f2937";
            }}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#0d0d0d")}
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              border: "none",
              background: "#0d0d0d",
              color: "#ffffff",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              cursor: sent || !canSubmit ? "not-allowed" : "pointer",
              opacity: sent || !canSubmit ? 0.5 : 1,
              transition: "background 0.15s ease, opacity 0.15s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {sent ? "Sending…" : "Send feedback"}
          </button>
        </div>

        <style>{`
          @keyframes fbBackdropIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes fbPopupIn {
            from { opacity: 0; transform: translateY(8px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @media (max-width: 480px) {
            div[role="dialog"][aria-labelledby="feedback-popup-title"] {
              border-radius: 14px !important;
              padding: 18px !important;
            }
          }
        `}</style>
      </div>
    </div>,
    document.body,
  );
};

const FeedbackButtons: React.FC<{
  messageId: string;
  feedback: { feedbackId: string; type: "up" | "down" } | null;
  loading: boolean;
  onFeedback: (
    messageId: string,
    type: "up" | "down",
    message?: string,
    label?: FeedbackLabel,
  ) => void;
}> = ({ messageId, feedback, loading, onFeedback }) => {
  const [popupOpen, setPopupOpen] = useState(false);
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
  const upActiveColor = "#16a34a";
  const downActiveColor = "#dc2626";
  const idleColor = "#9ca3af";
  const upActive = feedback?.type === "up";
  const downActive = feedback?.type === "down";

  const handleDownClick = () => {
    if (loading) return;
    // Toggling off an already-active thumbs-down is a clear/DELETE — no popup.
    if (downActive) {
      onFeedback(messageId, "down");
      return;
    }
    // Activating thumbs-down (from none or from up) — collect an optional note.
    setPopupOpen(true);
  };

  const handlePopupSubmit = (label: FeedbackLabel, msg: string) => {
    setPopupOpen(false);
    onFeedback(messageId, "down", msg, label);
  };

  return (
    <>
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
          style={{ ...baseStyle, color: upActive ? upActiveColor : idleColor }}
        >
          <ThumbsUpIcon filled={upActive} />
        </button>

        <button
          type="button"
          aria-label={downActive ? "Remove thumbs down" : "Thumbs down"}
          aria-pressed={downActive}
          disabled={loading}
          onClick={handleDownClick}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          style={{ ...baseStyle, color: downActive ? downActiveColor : idleColor }}
        >
          <ThumbsDownIcon filled={downActive} />
        </button>
      </div>

      {popupOpen && (
        <FeedbackPopup
          onSubmit={handlePopupSubmit}
          onClose={() => setPopupOpen(false)}
        />
      )}
    </>
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

// ─── Thinking step list ───────────────────────────────────────────────────────
// Renders workflow steps as a vertical checklist inside a soft-yellow card
// (matches the design mock). Completed steps get a green check + strikethrough;
// the active step (streaming, not yet done) gets a pulsing-dot yellow marker and
// bold text. Used both while thinking and inside the collapsed "Thought for Xs"
// dropdown (where every step reads as done and a trailing "Done" row is added).

type Step = { text: string; done: boolean };

const StepStatusIcon: React.FC<{ state: "done" | "current" }> = ({ state }) => {
  if (state === "current") {
    return (
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#F7E700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          flexShrink: 0,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 2.5,
              height: 2.5,
              borderRadius: "50%",
              background: "#0B1220",
              display: "inline-block",
              animation: "thinkPulse 1.4s infinite ease-in-out",
              animationDelay: `${[-0.32, -0.16, 0][i]}s`,
            }}
          />
        ))}
      </span>
    );
  }
  return (
    <span
      style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "#22A45D",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
};

const ThinkingStepsList: React.FC<{
  steps: Step[];
  streaming: boolean;
  appendDone?: boolean;
}> = ({ steps, streaming, appendDone }) => (
  <div
    style={{
      background: "#FEFBEA",
      border: "1px solid #F0E6B0",
      borderRadius: 14,
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}
  >
    {steps.map((step, i) => {
      const current = streaming && !step.done;
      return (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StepStatusIcon state={current ? "current" : "done"} />
          <span
            style={{
              fontSize: 13,
              lineHeight: 1.4,
              color: current ? "#0B1220" : "#8A93A6",
              fontWeight: current ? 700 : 500,
              textDecoration: current ? "none" : "line-through",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {step.text}
          </span>
        </div>
      );
    })}
    {appendDone && (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <StepStatusIcon state="done" />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0B1220" }}>
          Done
        </span>
      </div>
    )}
  </div>
);

const ThinkingActive: React.FC<{ lead?: string; steps: Step[] }> = ({
  lead,
  steps,
}) => (
  <div
    style={{
      marginBottom: 12,
      width: "100%",
      maxWidth: "100%",
      boxSizing: "border-box",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}
  >
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
    <ThinkingStepsList steps={steps} streaming />
    <style>{`
      @keyframes thinkPulse {
        0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; }
        40%           { transform: scale(1);   opacity: 1; }
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
    return (
      <ThinkingActive
        lead="Great — locking it in. Give me ~30 seconds."
        steps={steps}
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
        <ThinkingStepsList steps={steps} streaming={false} appendDone />
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
    return (
      <ThinkingActive
        lead="Great — locking it in. Give me ~30 seconds."
        steps={tasks.map((t) => ({
          text: cleanContent(t.content),
          done: t.done,
        }))}
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
        <ThinkingStepsList
          steps={tasks.map((t) => ({
            text: cleanContent(t.content),
            done: t.done,
          }))}
          streaming={false}
          appendDone
        />
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

  // When a turn ends without producing anything (e.g. server emits
  // prompt_login and closes the stream before any text/task/progress), the
  // assistant placeholder is left empty + not-streaming. Rendering it would
  // show a bare Kaira avatar with no bubble — and after the post-login replay
  // adds a fresh streaming placeholder, the user sees two stacked Kaira
  // avatars. Drop the empty husk.
  if (!hasProgress && !hasTasks && !hasContent && !streaming && !message.isError) {
    return null;
  }

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
        {
         showDots && 
        <ThinkingDots />}

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

// ─── Itinerary "steal / clone" CTA ────────────────────────────────────────────
// Shown at the bottom of the chat when a viewer is looking at SOMEONE ELSE'S
// itinerary. Two reactive states (driven by redux auth, so it flips instantly
// on login/logout with no page reload):
//   • Logged-out  → "Steal this itinerary" → opens the bot login modal.
//   • Logged-in   → "Create my version"    → clones via onCreateVersion (the
//                    parent calls the clone API then polls + shows skeletons).
// It renders nothing when there's no itinerary open or the viewer owns it.

const CtaIcon: React.FC<{ name: string; size?: number }> = ({ name, size = 15 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: { display: "block" },
    "aria-hidden": true,
  };
  switch (name) {
    case "copy":
      return (
        <svg {...common}>
          <rect x="9" y="9" width="11" height="11" rx="2.5" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      );
    case "edit": // customize → sliders
      return (
        <svg {...common}>
          <line x1="4" y1="8" x2="20" y2="8" />
          <line x1="4" y1="16" x2="20" y2="16" />
          <circle cx="9" cy="8" r="2.4" />
          <circle cx="15" cy="16" r="2.4" />
        </svg>
      );
    case "price": // tag
      return (
        <svg {...common}>
          <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 2.8 12V4a2 2 0 0 1 2-2h8a2 2 0 0 1 1.4.6l6.4 6.4a2 2 0 0 1 0 2.8Z" />
          <circle cx="7.5" cy="7.5" r="1.4" />
        </svg>
      );
    case "save": // bookmark
      return (
        <svg {...common}>
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.2L5 21V4a1 1 0 0 1 1-1Z" />
        </svg>
      );
    case "swap": // repeat / swap
      return (
        <svg {...common}>
          <path d="M17 2l4 4-4 4" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <path d="M7 22l-4-4 4-4" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      );
    default: // arrow
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
  }
};

interface ItineraryCloneCtaProps {
  /** Logged-out primary action — open the bot login modal. */
  onRequestLogin?: () => void;
  /** Logged-in primary action — clone the itinerary (parent polls + skeletons). */
  onCreateVersion?: () => void | Promise<void>;
}

export const ItineraryCloneCta: React.FC<ItineraryCloneCtaProps> = ({
  onRequestLogin,
  onCreateVersion,
}) => {
  // Reactive auth + itinerary — re-renders on login/logout with no reload.
  const token = useSelector((state: any) => state?.auth?.token);
  const authId = useSelector((state: any) => state?.auth?.id);
  const authName = useSelector((state: any) => state?.auth?.name);
  const itinerary = useSelector((state: any) => state?.Itinerary);

  const loggedIn = !!token;
  const ownerId = itinerary?.customer;
  // `customer_name` is the populated signal in both P1 (draft) and P2 — the bot
  // Itinerary object doesn't always carry `id`/`customer`, so key off the name.
  const ownerName =
    typeof itinerary?.customer_name === "string"
      ? itinerary.customer_name.trim()
      : "";
  const hasOwner = !!ownerName;
  // Hide on the viewer's OWN itinerary: match by customer id when present,
  // otherwise fall back to comparing the creator's name to the logged-in name.
  const isOwn =
    loggedIn &&
    ((ownerId != null && String(authId ?? "") === String(ownerId)) ||
      (!!authName &&
        !!ownerName &&
        authName.trim().toLowerCase() === ownerName.toLowerCase()));

  // Only when looking at another person's itinerary.
  if (!hasOwner || isOwn) return null;

  const handlePrimary = () => {
    if (!loggedIn) {
      onRequestLogin?.();
      return;
    }
    // Logged in → open the clone form popup (parent-managed: collects
    // start/end location, dates, pax, then calls get-my-itinerary).
    onCreateVersion?.();
  };

  const ownerFirst = ownerName ? ownerName.split(/\s+/)[0] : "";
  const sub = loggedIn
    ? "Clone the whole trip into your workspace — the original stays untouched, your copy is fully yours to remix and reprice."
    : "Log in and I'll drop an editable copy into your trips — yours to reshape, reprice and book.";
  const benefits: Array<[string, string]> = loggedIn
    ? [
        ["edit", "Customize every activity, day by day"],
        ["price", "Get live, bookable pricing"],
        ["save", "Auto-saved to your trips"],
      ]
    : [
        ["copy", "Copy the full plan in one tap"],
        ["swap", "Swap hotels, stays & activities"],
        ["price", "See live pricing for your dates"],
      ];
  const primaryLabel = loggedIn ? "Create My Version" : "Log In to Continue";
  const microItems = loggedIn
    ? ["Saved to My Trips", "Original stays untouched"]
    : ["Free to start", "No card needed", "30-second login"];

  // Headline — Inter (matches the rest of the chat), yellow "mark".
  const headline = loggedIn ? (
    <>
      Clone it. <span style={{ color: "#F5D70E" }}>Make it yours.</span>
    </>
  ) : (
    <>
      Make this trip <span style={{ color: "#F5D70E" }}>yours.</span>
    </>
  );

  // Wrapped in the same Kaira message layout as every other bot reply: avatar
  // on the left, content on the right, matching spacing/padding.
  const FONT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

  return (
    <div
      className="msg kaira"
      style={{
        display: "flex",
        gap: 10,
        maxWidth: "98%",
        marginBottom: 14,
        fontFamily: FONT,
        animation: "msgInK 0.3s ease-out",
      }}
    >
      {/* Kaira avatar — identical to other messages */}
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

      {/* Card */}
      <div
      style={{
        position: "relative",
        flex: 1,
        minWidth: 0,
        overflow: "hidden",
        borderRadius: 16,
        borderBottomLeftRadius: 5,
        border: "1px solid #2C3360",
        background:
          "radial-gradient(120% 140% at 100% 0%, #232a4f 0%, #181D38 55%)",
        color: "#fff",
        boxShadow: "0 26px 60px -34px rgba(8,11,28,0.85)",
        fontFamily: FONT,
      }}
    >
      {/* top-right yellow glow */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,215,14,0.32), transparent 62%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", padding: "16px 16px 16px" }}>
        {/* eyebrow */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontFamily: FONT,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#F5D70E",
            background: "rgba(245,215,14,0.10)",
            border: "1px solid rgba(245,215,14,0.28)",
            padding: "6px 11px",
            borderRadius: 999,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#F5D70E",
              boxShadow: "0 0 0 3px rgba(245,215,14,0.25)",
            }}
          />
          {loggedIn ? "Ready to clone · private copy" : "Shared · itinerary"}
        </div>

        {/* owner chip */}
        {ownerName && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
              padding: "8px 11px",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                background: getAvatarColorForName(ownerName),
              }}
            >
              {getUserInitial(ownerName)}
            </span>
            <span style={{ fontSize: 12.5, color: "#C7CCE6", lineHeight: 1.35 }}>
              {loggedIn ? (
                <>
                  Cloning from <b style={{ color: "#fff", fontWeight: 700 }}>{ownerName}'s</b> plan —
                  your copy stays private.
                </>
              ) : (
                <>
                  Crafted by <b style={{ color: "#fff", fontWeight: 700 }}>{ownerName}</b> — make it
                  yours in under a minute.
                </>
              )}
            </span>
          </div>
        )}

        {/* headline */}
        <h3
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 22,
            lineHeight: 1.18,
            letterSpacing: "-0.01em",
            color: "#fff",
            margin: "0 0 8px",
          }}
        >
          {headline}
        </h3>
        <p
          style={{
            fontSize: 13.5,
            lineHeight: 1.58,
            color: "#B9BFDB",
            margin: "0 0 18px",
          }}
        >
          {sub}
        </p>

        {/* benefits — bordered single-column list (v2) */}
        <div
          style={{
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
            marginBottom: 18,
          }}
        >
          {benefits.map(([icon, label], i) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "11px 13px",
                borderBottom:
                  i < benefits.length - 1
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(245,215,14,0.16)",
                  color: "#F5D70E",
                }}
              >
                <CtaIcon name={icon} size={14} />
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#E6E8F4",
                  lineHeight: 1.3,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* primary */}
        <button
          type="button"
          onClick={handlePrimary}
          style={{
            width: "100%",
            border: 0,
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 800,
            fontSize: 15.5,
            color: "#181D38",
            background: "#F5D70E",
            padding: "15px 16px",
            borderRadius: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            boxShadow: "0 14px 30px -12px rgba(245,215,14,0.6)",
            transition: "transform 0.15s ease, filter 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.filter = "saturate(1.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.filter = "none";
          }}
        >
          {primaryLabel}
          <CtaIcon name="arrow" size={16} />
        </button>

        {/* micro */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 13,
            fontFamily: FONT,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.01em",
            color: "#878FB4",
          }}
        >
          {microItems.map((m, i) => (
            <React.Fragment key={m}>
              {i > 0 && (
                <span
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: "#878FB4",
                  }}
                />
              )}
              {m}
            </React.Fragment>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes ctaRise {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes msgInK {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      </div>
      <MessageBubbleResponsiveStyles />
    </div>
  );
};

// ─── ThinkingDots ─────────────────────────────────────────────────────────────
// "Kaira is working" indicator shown while an assistant reply is streaming but
// no content/tasks have arrived yet. Modeled exactly on the Claude Code loader
// in the shared reference: a monospace `* Word…` in a clay/terracotta tone with
// a bright gleam shimmering through it (Claude's "thinking" sweep), followed by
// a muted-gray `(Ns · thinking more)`. Row is `minHeight: 30` and vertically
// centered so it lines up with the 30px Kaira avatar. Sizing uses clamp() so it
// scales from small phones up to desktop.
// Shown as "Word…" while Kaira thinks. Kept deliberately context-agnostic:
// each one reads sensibly for ANY query — a contact question as much as a trip
// plan — while still carrying a light travel/journey flavour. Avoid
// activity-specific verbs (e.g. "Booking stays") that look odd on a generic ask.
const THINKING_PHRASES = [
  "Reticulating",
  "Plotting",
  "Wandering",
  "Daydreaming",
  "Mapping",
  "Charting",
  "Navigating",
  "Exploring",
  "Scouting",
  "Routing",
  "Pathfinding",
  "Wayfinding",
  "Roaming",
  "Pondering",
  "Meandering",
  "Orienting",
  "Surveying",
  "Venturing",
  "Trailblazing",
  "Gathering ideas",
  "Connecting the dots",
  "Plotting a course",
  "Getting my bearings",
  "Consulting the map",
  "Checking the compass",
];

// Advances once per ThinkingDots mount. Each new reply ("next chat") shows the
// NEXT phrase, while any single thinking session keeps ONE fixed phrase for its
// whole lifetime — no rotating through the list mid-wait.
let thinkingPhraseCursor = 0;

export const ThinkingDots: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Pick a single phrase for this session, fixed for the component's life.
  // Each new ThinkingDots instance (the next chat reply) advances to the next
  // phrase, cycling back to the start after the last. The lazy initializer
  // runs once per mount, so the phrase never changes while we wait.
  const [phrase] = useState(() => {
    const p = THINKING_PHRASES[thinkingPhraseCursor % THINKING_PHRASES.length];
    thinkingPhraseCursor += 1;
    return p;
  });

  // Only nudge "thinking more" once the wait has actually gotten long
  // (>30s). Before that, just show the elapsed seconds.
  const showThinkingMore = seconds > 30;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "clamp(6px, 1.8vw, 8px)",
        minHeight: 30,
        fontFamily:
          "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
        fontSize: "clamp(12.5px, 3.5vw, 14px)",
        lineHeight: 1.4,
      }}
    >
      {/* Yellow pulsing-dot marker — matches the "current" step icon in the
          thinking steps list (StepStatusIcon, state="current"). */}
      <span
        aria-hidden
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#F7E700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          flexShrink: 0,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 2.5,
              height: 2.5,
              borderRadius: "50%",
              background: "#0B1220",
              display: "inline-block",
              animation: "thinkPulse 1.4s infinite ease-in-out",
              animationDelay: `${[-0.32, -0.16, 0][i]}s`,
            }}
          />
        ))}
      </span>

      {/* `Word…` — black with a subtle gleam shimmering through */}
      <span
        className="thinkShimmerText"
        style={{
          fontWeight: 500,
          whiteSpace: "nowrap",
          display: "inline-block",
          lineHeight: 1.4,
          // paddingBottom: 2,
        }}
      >
        {phrase}…
      </span>

      {/* `(Ns)` — muted gray; appends "· thinking more" only after 30s */}
      <span style={{ color: "#9B9B9B", fontWeight: 400, whiteSpace: "nowrap" }}>
        ({seconds}s{showThinkingMore ? " · thinking more" : ""})
      </span>

      <style>{`
        @keyframes thinkPulse {
          0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; }
          40%           { transform: scale(1);   opacity: 1; }
        }
        @keyframes thinkShimmerSweep {
          0%   { background-position: 0% 0; }
          100% { background-position: -200% 0; }
        }
        .thinkShimmerText {
          /* Black text with a soft gray gleam gliding through. The gradient
             tiles and the keyframe shifts exactly one tile width, so it loops
             seamlessly — no jump or pause. */
          background-image: linear-gradient(
            90deg,
            #0B0B0B 0%,
            #0B0B0B 35%,
            #8A8A8A 50%,
            #0B0B0B 65%,
            #0B0B0B 100%
          );
          background-size: 200% 100%;
          background-repeat: repeat;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: thinkShimmerSweep 2.6s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .thinkShimmerText {
            animation: none;
            color: #0B0B0B;
            -webkit-text-fill-color: #0B0B0B;
          }
        }
      `}</style>
    </div>
  );
};
