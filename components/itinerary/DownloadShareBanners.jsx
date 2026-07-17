import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FaWhatsapp } from "react-icons/fa";
import BotLoginModal from "../bot-components/components/BotLoginModal";
import { MERCURY_HOST } from "../../services/constants";

/**
 * DownloadShareBanners
 * --------------------
 * A pair of end-of-itinerary banners rendered below the day-by-day list:
 *   • Download — exports the itinerary as a PDF from the mercury API endpoint.
 *   • Share    — copy link / WhatsApp / Instagram.
 *
 * Two layouts are shipped and toggled purely by CSS media query (a scoped
 * <style> block below), NOT by the JS `media()` hook — that hook is client-only
 * and would flash / hydrate-mismatch on a structural switch:
 *   • mobile  (< 768px) → design variant "2a · Clean stacked"    (.dsb-mobile)
 *   • desktop (≥ 768px) → full-width rows, action pinned right   (.dsb-desktop)
 *
 * Styling is deliberately inline with literal hex values (kaira design tokens)
 * to sidestep the bootstrap.min.css-loads-after-Tailwind collisions documented
 * in DaybyDay.jsx (.border / .px-3 / .rounded carry `!important`). Fonts come
 * from the kaira stack already loaded globally in pages/_document.js.
 */

// Kaira design tokens (resolved from the design system's colors_and_type.css)
const C = {
  ink: "#0b1220",
  ink3: "#445069",
  ink4: "#8a93a6",
  white: "#ffffff",
  line: "#ececec",
  paper: "#fafaf5",
  yellow: "#f7e700",
  yellowSoft: "#fff8b3",
  yellow700: "#d4b900",
  blueInk: "#3d4f7a",
  blueSoft: "#eef2fb",
  waFg: "#25d366",
  waBg: "#e7f7ee",
  igFg: "#e1306c",
  igBg: "#fdeef4",
};
const SHADOW_YELLOW = "0 8px 20px -10px rgba(247,231,0,0.3)";
const FONT_SANS = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_SERIF = "'Instrument Serif', 'Times New Roman', serif";
const FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";

// ---- Icons (stroke-based, mirror the kaira banner design) ----
const svgProps = (size) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});

const IconFile = ({ size = 22 }) => (
  <svg {...svgProps(size)}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <line x1="9" y1="15" x2="15" y2="15" />
    <line x1="9" y1="18" x2="13" y2="18" />
  </svg>
);
const IconDownload = ({ size = 17 }) => (
  <svg {...svgProps(size)}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IconShare = ({ size = 22 }) => (
  <svg {...svgProps(size)}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const IconLink = ({ size = 18 }) => (
  <svg {...svgProps(size)}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
// The real WhatsApp brand mark — the design's generic outlined bubble doesn't
// read as WhatsApp. Filled glyph, so it takes the chip's `color` via
// currentColor rather than the stroke treatment the other icons use.
const IconWhatsapp = ({ size = 18 }) => <FaWhatsapp size={size} aria-hidden />;
const IconInsta = ({ size = 18 }) => (
  <svg {...svgProps(size)}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// Strip the query string so the shared/canonical link is the bare itinerary URL.
const getShareUrl = () => {
  if (typeof window === "undefined") return "";
  try {
    const u = new URL(window.location.href);
    u.search = "";
    return u.toString();
  } catch {
    return window.location.href;
  }
};

const copyText = async (text) => {
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for older browsers / insecure contexts (mirrors SocialShare.js)
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(ta);
  }
};

const DownloadShareBanners = ({ itineraryId, itineraryName }) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  // Set when a download was blocked by the login gate, so the token-watch effect
  // below knows to resume it once the user is through the modal.
  const pendingDownload = useRef(false);
  const reduxToken = useSelector((state) => state.auth.token);
  // The /trips/[type]/[slug] route has no `id` query param — the page stashes the
  // real itinerary id in redux instead, so fall back to it like the drawers do.
  const reduxItineraryId = useSelector((state) => state.ItineraryId);

  const propId = Array.isArray(itineraryId) ? itineraryId[0] : itineraryId;
  const id = propId || reduxItineraryId;
  const host = (MERCURY_HOST || "").replace(/\/$/, "");
  const pdfUrl = id && host ? `${host}/api/v1/itinerary/${id}/export-pdf/` : null;

  // Read at call time rather than render time: localStorage is unavailable
  // during SSR, and login writes `access_token` before redux settles.
  const getAuthToken = () =>
    reduxToken ||
    (typeof window !== "undefined" ? localStorage.getItem("access_token") : null);

  // The endpoint is protected, so this can't be a plain window.open — the PDF is
  // fetched with the bearer token and handed to the browser as a blob.
  const runDownload = async (token) => {
    if (!pdfUrl || !token) return;
    setDownloading(true);
    try {
      const res = await fetch(pdfUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        // Token expired/rejected — re-open the gate and retry after login.
        pendingDownload.current = true;
        setShowLogin(true);
        return;
      }
      if (!res.ok) throw new Error(`PDF export failed: ${res.status}`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `${itineraryName || "itinerary"}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch (err) {
      console.error("Could not download the itinerary PDF:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownload = () => {
    if (downloading) return;
    // Auth gate first: a logged-out click opens the modal rather than firing a
    // request that would only come back 401.
    const token = getAuthToken();
    if (!token) {
      pendingDownload.current = true;
      setShowLogin(true);
      return;
    }
    runDownload(token);
  };

  // Resume a gated download once login lands. Clearing the ref before firing
  // keeps this safe to call from both the modal's onSuccess and the token watch
  // below, whichever wins — the second call is a no-op.
  const resumePendingDownload = () => {
    if (!pendingDownload.current) return;
    const token = getAuthToken();
    if (!token) return;
    pendingDownload.current = false;
    setShowLogin(false);
    runDownload(token);
  };

  // The token watch covers login paths that don't run onSuccess (e.g. social).
  useEffect(() => {
    resumePendingDownload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxToken]);

  const handleCopy = async () => {
    try {
      await copyText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      console.error("Could not copy link:", err);
    }
  };

  const handleWhatsapp = () => {
    const url = getShareUrl();
    const text = `${itineraryName ? itineraryName + "\n" : ""}${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleInstagram = async () => {
    // Instagram has no web share intent — copy the link so it can be pasted
    // into a DM / story (matches SocialShareDesktop's Instagram behaviour).
    try {
      await copyText(getShareUrl());
      alert("Link copied! You can now paste it in Instagram.");
    } catch (err) {
      console.error("Could not copy link:", err);
    }
  };

  const downloadLabel = downloading ? "Preparing PDF…" : "Download PDF";

  const chips = [
    {
      key: "copy",
      label: copied ? "Copied!" : "Copy link",
      fg: C.blueInk,
      bg: C.blueSoft,
      icon: <IconLink />,
      onClick: handleCopy,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      fg: C.waFg,
      bg: C.waBg,
      icon: <IconWhatsapp />,
      onClick: handleWhatsapp,
    },
    {
      key: "instagram",
      label: "Instagram",
      fg: C.igFg,
      bg: C.igBg,
      icon: <IconInsta />,
      onClick: handleInstagram,
    },
  ];

  const eyebrow = (size) => ({
    fontFamily: FONT_MONO,
    fontSize: size,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: C.ink4,
  });
  const serifSpan = (size) => ({
    fontFamily: FONT_SERIF,
    fontStyle: "italic",
    fontWeight: 400,
    letterSpacing: "-0.01em",
    ...(size ? { fontSize: size } : {}),
  });
  const cardBase = (padding) => ({
    background: C.white,
    border: `1px solid ${C.line}`,
    borderRadius: 18,
    padding,
  });
  // Look only — the desktop row takes its sizing from .dsb-cta-lg so the
  // container query can shrink it; the mobile card passes explicit sizes.
  const downloadBtnBase = {
    display: "inline-flex",
    alignItems: "center",
    background: C.yellow,
    color: C.ink,
    border: "none",
    borderRadius: 999,
    boxShadow: SHADOW_YELLOW,
    fontFamily: FONT_SANS,
    fontWeight: 700,
    cursor: "pointer",
  };
  const downloadBtn = (padding, fontSize, gap, marginTop) => ({
    ...downloadBtnBase,
    marginTop,
    alignSelf: "flex-start",
    gap,
    padding,
    fontSize,
  });
  const iconBox = (size, bg, color) => ({
    flexShrink: 0,
    width: size,
    height: size,
    borderRadius: 14,
    background: bg,
    color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  return (
    <div style={{ marginTop: 12 }}>
      <style>{`
        .dsb-mobile { display: flex; flex-direction: column; gap: 14px; }
        .dsb-desktop { display: none; }
        @media (min-width: 768px) {
          .dsb-mobile { display: none; }
          /* Sized against the card's own width, not the viewport's: the itinerary
             column is narrow while a side panel is open, so @media can't see it. */
          .dsb-desktop { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; container-type: inline-size; }
        }
        /* Desktop rows: icon + copy hold the first line and the action sits at
           the right end; only once the copy would drop below ~260px — i.e. the
           buttons have closed right up on the text — does the action wrap to its
           own line. The buttons within an action always stay on one line,
           shrinking via the container queries instead. */
        .dsb-row { display: flex; align-items: center; flex-wrap: wrap; gap: 18px; }
        .dsb-row-body { flex: 1 1 260px; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
        /* nowrap: the three chips always stay on one line and shrink instead. */
        .dsb-row-action { flex: 0 1 auto; min-width: 0; max-width: 100%; display: flex; flex-wrap: nowrap; gap: 8px; }
        /* Chip / CTA sizing lives here rather than inline so the container
           queries below can actually override it (inline styles would win). */
        .dsb-chip-lg { flex: 0 1 auto; min-width: 0; display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; padding: 9px 15px; }
        .dsb-chip-lg .dsb-chip-icon { flex: none; display: inline-flex; padding: 6px; border-radius: 999px; }
        .dsb-chip-lg .dsb-chip-icon svg { width: 18px; height: 18px; }
        .dsb-chip-lg .dsb-chip-label { font-weight: 600; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dsb-cta-lg { padding: 11px 20px; gap: 9px; font-size: 13.5px; }
        @container (max-width: 940px) {
          .dsb-chip-lg { gap: 7px; padding: 8px 12px; }
          .dsb-chip-lg .dsb-chip-icon { padding: 5px; }
          .dsb-chip-lg .dsb-chip-icon svg { width: 17px; height: 17px; }
          .dsb-chip-lg .dsb-chip-label { font-size: 12.5px; }
          .dsb-cta-lg { padding: 10px 17px; gap: 8px; font-size: 13px; }
        }
        @container (max-width: 760px) {
          .dsb-chip-lg { gap: 6px; padding: 7px 10px; }
          .dsb-chip-lg .dsb-chip-icon { padding: 4px; }
          .dsb-chip-lg .dsb-chip-icon svg { width: 16px; height: 16px; }
          .dsb-chip-lg .dsb-chip-label { font-size: 12px; }
          .dsb-cta-lg { padding: 9px 15px; gap: 7px; font-size: 12.5px; }
        }
        @container (max-width: 560px) {
          .dsb-chip-lg { gap: 5px; padding: 6px 9px; }
          .dsb-chip-lg .dsb-chip-icon { padding: 3px; }
          .dsb-chip-lg .dsb-chip-icon svg { width: 15px; height: 15px; }
          .dsb-chip-lg .dsb-chip-label { font-size: 11.5px; }
          .dsb-cta-lg { padding: 8px 13px; gap: 6px; font-size: 12px; }
        }
        @container (max-width: 430px) {
          .dsb-chip-lg { gap: 4px; padding: 5px 8px; }
          .dsb-chip-lg .dsb-chip-icon svg { width: 14px; height: 14px; }
          .dsb-chip-lg .dsb-chip-label { font-size: 11px; }
          .dsb-cta-lg { padding: 8px 12px; font-size: 11.5px; }
        }
        .dsb-card { transition: transform .25s cubic-bezier(.2,.7,.3,1), box-shadow .25s cubic-bezier(.2,.7,.3,1); }
        .dsb-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px -10px rgba(11,18,32,.15); }
        .dsb-cta { transition: transform .15s cubic-bezier(.2,.7,.3,1), box-shadow .15s cubic-bezier(.2,.7,.3,1); }
        .dsb-cta:hover { transform: translateY(-1px); }
        .dsb-chip { transition: transform .15s cubic-bezier(.2,.7,.3,1), background .15s cubic-bezier(.2,.7,.3,1); }
        .dsb-chip:hover { transform: translateY(-1px); background: #f4f3ec; }
        @media (prefers-reduced-motion: reduce) {
          .dsb-card, .dsb-cta, .dsb-chip { transition: none; }
          .dsb-card:hover, .dsb-cta:hover, .dsb-chip:hover { transform: none; }
        }
      `}</style>

      {/* ===== MOBILE · 2a Clean stacked ===== */}
      <div className="dsb-mobile">
        {/* Download */}
        <div className="dsb-card" style={{ ...cardBase(18), display: "flex", gap: 14 }}>
          <div style={iconBox(44, C.yellowSoft, C.yellow700)}>
            <IconFile size={22} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
            <div style={eyebrow(9)}>Keep a copy</div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontWeight: 800,
                fontSize: 17,
                letterSpacing: "-0.015em",
                color: C.ink,
                lineHeight: 1.15,
              }}
            >
              Download the <span style={serifSpan(18)}>itinerary.</span>
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 12.5, lineHeight: 1.45, color: C.ink3 }}>
              Day-by-day plan and bookings, as a PDF.
            </div>
            <button
              type="button"
              className="dsb-cta"
              onClick={handleDownload}
              disabled={!pdfUrl}
              style={{ ...downloadBtn("10px 18px", 13, 8, 8), opacity: pdfUrl ? 1 : 0.6 }}
            >
              <IconDownload size={17} />
              <span>{downloadLabel}</span>
            </button>
          </div>
        </div>

        {/* Share */}
        <div
          className="dsb-card"
          style={{ ...cardBase(18), display: "flex", flexDirection: "column", gap: 12 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={iconBox(44, C.blueSoft, C.blueInk)}>
              <IconShare size={22} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={eyebrow(9)}>Send it along</div>
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 800,
                  fontSize: 17,
                  letterSpacing: "-0.015em",
                  color: C.ink,
                  lineHeight: 1.15,
                }}
              >
                Share the <span style={serifSpan(18)}>trip.</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                className="dsb-chip"
                onClick={chip.onClick}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  background: C.paper,
                  border: `1px solid ${C.line}`,
                  borderRadius: 10,
                  padding: "12px 6px",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    color: chip.fg,
                    background: chip.bg,
                    display: "inline-flex",
                    padding: 6,
                    borderRadius: 999,
                  }}
                >
                  {chip.icon}
                </span>
                <span
                  style={{
                    fontFamily: FONT_SANS,
                    fontWeight: 600,
                    fontSize: 11.5,
                    color: C.ink,
                    whiteSpace: "nowrap",
                  }}
                >
                  {chip.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== DESKTOP · full-width rows, action pinned right ===== */}
      <div className="dsb-desktop">
        {/* Download */}
        <div className="dsb-card dsb-row" style={cardBase(24)}>
          <div style={iconBox(52, C.yellowSoft, C.yellow700)}>
            <IconFile size={22} />
          </div>
          <div className="dsb-row-body">
            <div style={eyebrow(10)}>Keep a copy</div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontWeight: 800,
                fontSize: 20,
                letterSpacing: "-0.015em",
                color: C.ink,
                lineHeight: 1.15,
              }}
            >
              Download the <span style={serifSpan()}>itinerary.</span>
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 13.5, lineHeight: 1.5, color: C.ink3 }}>
              Full day-by-day plan and bookings as a PDF.
            </div>
          </div>
          <button
            type="button"
            className="dsb-cta dsb-cta-lg"
            onClick={handleDownload}
            disabled={!pdfUrl}
            style={{
              ...downloadBtnBase,
              alignSelf: "center",
              flex: "0 0 auto",
              whiteSpace: "nowrap",
              opacity: pdfUrl ? 1 : 0.6,
            }}
          >
            <IconDownload size={17} />
            <span>{downloadLabel}</span>
          </button>
        </div>

        {/* Share */}
        <div className="dsb-card dsb-row" style={cardBase(24)}>
          <div style={iconBox(52, C.blueSoft, C.blueInk)}>
            <IconShare size={22} />
          </div>
          <div className="dsb-row-body">
            <div style={eyebrow(10)}>Send it along</div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontWeight: 800,
                fontSize: 20,
                letterSpacing: "-0.015em",
                color: C.ink,
                lineHeight: 1.15,
              }}
            >
              Share the <span style={serifSpan()}>trip.</span>
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 13.5, lineHeight: 1.5, color: C.ink3 }}>
              Send it to whoever&apos;s coming with you.
            </div>
          </div>
          <div className="dsb-row-action">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                className="dsb-chip dsb-chip-lg"
                onClick={chip.onClick}
                style={{
                  background: C.paper,
                  border: `1px solid ${C.line}`,
                  cursor: "pointer",
                }}
              >
                <span className="dsb-chip-icon" style={{ color: chip.fg, background: chip.bg }}>
                  {chip.icon}
                </span>
                <span className="dsb-chip-label" style={{ fontFamily: FONT_SANS, color: C.ink }}>
                  {chip.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Same modal + zIndex the itinerary page already uses in MenuV2. */}
      <div className="z-[1650]">
        <BotLoginModal
          show={showLogin && !reduxToken}
          zIndex={"3300"}
          itinary_id={id}
          message="Log in to download your itinerary"
          onhide={() => {
            // Only a real dismissal should cancel the queued download — if a token
            // has landed, this is the post-login close and the resume must survive.
            if (!getAuthToken()) pendingDownload.current = false;
            setShowLogin(false);
          }}
          onSuccess={resumePendingDownload}
        />
      </div>

    </div>
  );
};

export default DownloadShareBanners;
