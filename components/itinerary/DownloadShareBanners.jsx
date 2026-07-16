import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { MERCURY_HOST } from "../../services/constants";

/**
 * DownloadShareBanners
 * --------------------
 * A pair of end-of-itinerary banners rendered below the day-by-day list:
 *   • Download — exports the itinerary as a PDF from the mercury admin endpoint.
 *   • Share    — copy link / WhatsApp / Instagram.
 *
 * Two layouts are shipped and toggled purely by CSS media query (a scoped
 * <style> block below), NOT by the JS `media()` hook — that hook is client-only
 * and would flash / hydrate-mismatch on a structural switch:
 *   • mobile  (< 768px) → design variant "2a · Clean stacked"    (.dsb-mobile)
 *   • desktop (≥ 768px) → design variant "1a · Clean pair"       (.dsb-desktop)
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

  const id = Array.isArray(itineraryId) ? itineraryId[0] : itineraryId;
  const host = (MERCURY_HOST || "").replace(/\/$/, "");
  const pdfUrl =
    id && host ? `${host}/admin/itinerary/itinerary/export-pdf/${id}/` : null;

  const handleDownload = () => {
    if (!pdfUrl) return;
    setDownloading(true);
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => setDownloading(false), 1600);
  };

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
  const downloadBtn = (padding, fontSize, gap, marginTop) => ({
    marginTop,
    alignSelf: "flex-start",
    display: "inline-flex",
    alignItems: "center",
    gap,
    background: C.yellow,
    color: C.ink,
    border: "none",
    borderRadius: 999,
    boxShadow: SHADOW_YELLOW,
    padding,
    fontFamily: FONT_SANS,
    fontWeight: 700,
    fontSize,
    cursor: "pointer",
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
          .dsb-desktop { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
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

      {/* ===== DESKTOP · 1a Clean pair (matches the itinerary cards) ===== */}
      <div className="dsb-desktop">
        {/* Download */}
        <div className="dsb-card" style={{ ...cardBase(24), display: "flex", gap: 18 }}>
          <div style={iconBox(52, C.yellowSoft, C.yellow700)}>
            <IconFile size={22} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
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
            <button
              type="button"
              className="dsb-cta"
              onClick={handleDownload}
              disabled={!pdfUrl}
              style={{ ...downloadBtn("11px 20px", 13.5, 9, 10), opacity: pdfUrl ? 1 : 0.6 }}
            >
              <IconDownload size={17} />
              <span>{downloadLabel}</span>
            </button>
          </div>
        </div>

        {/* Share */}
        <div className="dsb-card" style={{ ...cardBase(24), display: "flex", gap: 18 }}>
          <div style={iconBox(52, C.blueSoft, C.blueInk)}>
            <IconShare size={22} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
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
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  className="dsb-chip"
                  onClick={chip.onClick}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: C.paper,
                    border: `1px solid ${C.line}`,
                    borderRadius: 999,
                    padding: "9px 15px",
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
                  <span style={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: 13, color: C.ink }}>
                    {chip.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadShareBanners;
