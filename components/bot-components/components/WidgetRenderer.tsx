import React, { useState, useContext, createContext } from "react";
import { PiAirplaneTakeoff } from "react-icons/pi";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WidgetNode {
  type: string;
  children?: WidgetNode[];
  key?: string;
  [key: string]: unknown;
}

interface WidgetRendererProps {
  widget: Record<string, unknown>;
  onAction?: (action: { type: string; payload?: Record<string, unknown> }) => void;
}

// ─── Form Context ─────────────────────────────────────────────────────────────

interface FormContextValue {
  values: Record<string, string>;
  setValue: (name: string, value: string) => void;
  submitAction: { type: string; payload?: Record<string, unknown> } | null;
  onAction?: WidgetRendererProps["onAction"];
}

const FormContext = createContext<FormContextValue | null>(null);

function useFormContext() {
  return useContext(FormContext);
}

// ─── Route Item Context ──────────────────────────────────────────────────────
// Passes index / isLast from ListViewNode → BoxNode so the numbered pin &
// connector line can render correctly.

interface RouteItemContextValue {
  index: number;
  isLast: boolean;
}

const RouteItemContext = createContext<RouteItemContextValue | null>(null);

// ─── Color map ────────────────────────────────────────────────────────────────

const BG_COLORS: Record<string, string> = {
  // existing...
  blue:       "#2563eb",
  green:      "#16a34a",
  red:        "#dc2626",
  yellow:     "#ca8a04",
  orange:     "#ea580c",
  purple:     "#7c3aed",
  pink:       "#db2777",
  cyan:       "#0891b2",
  gray:       "#9ca3af",
  "alpha-10": "rgba(0,0,0,0.08)",
  "alpha-20": "rgba(0,0,0,0.15)",
  primary:    "#FFD602",
  white:      "#ffffff",

  // Accent tokens — exact design system colors
  "accent.green-500":  "#22c55e",
  "accent.blue-500":   "#3b82f6",
  "accent.purple-500": "#a855f7",
  "accent.red-500":    "#ef4444",
  "accent.cyan-500":   "#06b6d4",
  "accent.orange-500": "#f97316",
  "accent.yellow-500": "#eab308",
  "accent.pink-500":   "#ec4899",
};

function resolveBg(bg: string | undefined): string {
  if (!bg) return "transparent";
  if (BG_COLORS[bg]) return BG_COLORS[bg];

  // Normalize: "Accent.GREEN-500" → "accent.green-500"
  const normalized = bg.toLowerCase();
  if (BG_COLORS[normalized]) return BG_COLORS[normalized];

  // Fallback: strip suffix/prefix for plain names like "blue-500" → "blue"
  const base = normalized.replace(/^accent\./, "").replace(/-\d+$/, "");
  return BG_COLORS[base] ?? bg;
}

function resolveGap(gap: number | undefined): number {
  return (gap ?? 0) * 4;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function DotsHorizontalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <circle cx="4"  cy="10" r="1.8" />
      <circle cx="10" cy="10" r="1.8" />
      <circle cx="16" cy="10" r="1.8" />
    </svg>
  );
}

function NotebookPencilIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 7h6M9 11h6M9 15h4" />
      <path d="M15 15l2-2 2 2-2 2-2-2z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

// ─── NEW: Transport Card Icons ────────────────────────────────────────────────

const TRANSPORT_ICONS: Record<string, React.ReactNode> = {
  flight: (
   <PiAirplaneTakeoff className="text-gray-600 flex-shrink-0" size={16} />
  ),
  taxi: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M15.3332 7.33333C15.51 7.33333 15.6796 7.2631 15.8046 7.13807C15.9296 7.01305 15.9998 6.84348 15.9998 6.66667C15.9998 6.48986 15.9296 6.32029 15.8046 6.19526C15.6796 6.07024 15.51 6 15.3332 6H14.3998L13.8865 4.346C13.6991 3.7364 13.3395 3.19393 12.851 2.78388C12.3626 2.37383 11.766 2.11366 11.1332 2.03467C10.8802 1.43277 10.4555 0.918761 9.91213 0.556883C9.36872 0.195005 8.73071 0.00130781 8.07784 0L7.92184 0C7.26896 0.00130781 6.63095 0.195005 6.08754 0.556883C5.54413 0.918761 5.11942 1.43277 4.8665 2.03467C4.23397 2.11385 3.63776 2.37403 3.14956 2.78394C2.66136 3.19385 2.30194 3.73604 2.1145 4.34533L1.59983 6H0.666501C0.48969 6 0.320121 6.07024 0.195097 6.19526C0.0700723 6.32029 -0.000165635 6.48986 -0.000165635 6.66667C-0.000165635 6.84348 0.0700723 7.01305 0.195097 7.13807C0.320121 7.2631 0.48969 7.33333 0.666501 7.33333H1.18717L0.710501 8.86667C0.438148 9.15788 0.235333 9.50704 0.117296 9.88789C-0.000740876 10.2687 -0.0309309 10.6714 0.0289944 11.0656C0.0889197 11.4598 0.237402 11.8353 0.463285 12.1639C0.689168 12.4924 0.986578 12.7655 1.33317 12.9627V14C1.33317 14.5304 1.54388 15.0391 1.91895 15.4142C2.29403 15.7893 2.80274 16 3.33317 16C3.8636 16 4.37231 15.7893 4.74738 15.4142C5.12245 15.0391 5.33317 14.5304 5.33317 14V13.3333H10.6665V14C10.6665 14.5304 10.8772 15.0391 11.2523 15.4142C11.6274 15.7893 12.1361 16 12.6665 16C13.1969 16 13.7056 15.7893 14.0807 15.4142C14.4558 15.0391 14.6665 14.5304 14.6665 14V12.9627C15.0129 12.7655 15.3101 12.4924 15.5358 12.164C15.7615 11.8355 15.9099 11.4602 15.9698 11.0662C16.0298 10.6722 15.9996 10.2697 15.8818 9.88898C15.7639 9.50827 15.5613 9.15921 15.2892 8.868L14.8125 7.33333H15.3332ZM7.92184 1.33333H8.07784C8.35816 1.3339 8.63521 1.39357 8.89092 1.50844C9.14662 1.62331 9.37523 1.79081 9.56184 2H6.43783C6.62435 1.79071 6.85295 1.62314 7.10867 1.50826C7.3644 1.39338 7.64149 1.33377 7.92184 1.33333ZM3.3885 4.74C3.51378 4.33175 3.76702 3.9746 4.11083 3.72131C4.45464 3.46801 4.8708 3.33199 5.29783 3.33333H10.7018C11.1291 3.33189 11.5454 3.46794 11.8894 3.72138C12.2333 3.97481 12.4866 4.33218 12.6118 4.74067L13.6332 8.03C13.5338 8.01427 13.4337 8.00425 13.3332 8H2.6665C2.56601 8.00425 2.46584 8.01427 2.3665 8.03L3.3885 4.74ZM3.99984 14C3.99984 14.1768 3.9296 14.3464 3.80457 14.4714C3.67955 14.5964 3.50998 14.6667 3.33317 14.6667C3.15636 14.6667 2.98679 14.5964 2.86176 14.4714C2.73674 14.3464 2.6665 14.1768 2.6665 14V13.3333H3.99984V14ZM13.3332 14C13.3332 14.1768 13.2629 14.3464 13.1379 14.4714C13.0129 14.5964 12.8433 14.6667 12.6665 14.6667C12.4897 14.6667 12.3201 14.5964 12.1951 14.4714C12.0701 14.3464 11.9998 14.1768 11.9998 14V13.3333H13.3332V14ZM13.3332 12H2.6665C2.31288 12 1.97374 11.8595 1.72369 11.6095C1.47364 11.3594 1.33317 11.0203 1.33317 10.6667C1.33317 10.313 1.47364 9.97391 1.72369 9.72386C1.97374 9.47381 2.31288 9.33333 2.6665 9.33333V10C2.6665 10.1768 2.73674 10.3464 2.86176 10.4714C2.98679 10.5964 3.15636 10.6667 3.33317 10.6667C3.50998 10.6667 3.67955 10.5964 3.80457 10.4714C3.9296 10.3464 3.99984 10.1768 3.99984 10V9.33333H11.9998V10C11.9998 10.1768 12.0701 10.3464 12.1951 10.4714C12.3201 10.5964 12.4897 10.6667 12.6665 10.6667C12.8433 10.6667 13.0129 10.5964 13.1379 10.4714C13.2629 10.3464 13.3332 10.1768 13.3332 10V9.33333C13.6868 9.33333 14.0259 9.47381 14.276 9.72386C14.526 9.97391 14.6665 10.313 14.6665 10.6667C14.6665 11.0203 14.526 11.3594 14.276 11.6095C14.0259 11.8595 13.6868 12 13.3332 12Z" fill="#07213A"/>
</svg>
  ),
  train: (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="none">
  <path d="M8.00246 3.33333C8.00246 3.51014 7.93222 3.67971 7.80719 3.80474C7.68217 3.92976 7.5126 4 7.33579 4H4.66912C4.49231 4 4.32274 3.92976 4.19772 3.80474C4.07269 3.67971 4.00246 3.51014 4.00246 3.33333C4.00246 3.15652 4.07269 2.98695 4.19772 2.86193C4.32274 2.7369 4.49231 2.66667 4.66912 2.66667H7.33579C7.5126 2.66667 7.68217 2.7369 7.80719 2.86193C7.93222 2.98695 8.00246 3.15652 8.00246 3.33333ZM12.0025 3.81333V10.7847C12.0022 11.6223 11.6866 12.4292 11.1185 13.0447L11.9518 15.0807C11.9849 15.1617 12.0018 15.2485 12.0014 15.3361C12.001 15.4237 11.9833 15.5103 11.9494 15.5911C11.9155 15.6719 11.866 15.7451 11.8038 15.8068C11.7416 15.8684 11.6679 15.9172 11.5868 15.9503C11.5057 15.9835 11.4189 16.0003 11.3313 15.9999C11.2438 15.9995 11.1571 15.9818 11.0764 15.9479C10.9956 15.9141 10.9223 15.8646 10.8607 15.8024C10.799 15.7402 10.7503 15.6664 10.7171 15.5853L10.0025 13.83C8.75037 14.4103 7.38214 14.6964 6.00246 14.6667C4.62279 14.6962 3.25462 14.41 2.00246 13.83L1.28712 15.5853C1.25481 15.6675 1.2065 15.7425 1.14498 15.8058C1.08345 15.8692 1.00996 15.9197 0.928752 15.9544C0.847547 15.9892 0.760253 16.0074 0.671939 16.0081C0.583626 16.0088 0.496054 15.9919 0.41431 15.9585C0.332565 15.9251 0.258278 15.8757 0.195763 15.8134C0.133248 15.751 0.0837507 15.6768 0.0501463 15.5951C0.0165419 15.5134 -0.000499713 15.4259 1.11547e-05 15.3376C0.000522023 15.2493 0.0185753 15.1619 0.0531222 15.0807L0.885789 13.0447C0.31787 12.4291 0.00251179 11.6222 0.00245558 10.7847V3.81333C0.00027218 3.10629 0.223778 2.41701 0.640446 1.84578C1.05711 1.27455 1.6452 0.851203 2.31912 0.637333C3.50705 0.237628 4.7493 0.0226791 6.00246 0C7.25569 0.0224934 8.498 0.237678 9.68579 0.638C10.3598 0.85156 10.948 1.27474 11.3647 1.84589C11.7814 2.41705 12.0048 3.10633 12.0025 3.81333V3.81333ZM10.6691 7.82467C9.63379 9.37667 8.03579 10.6667 6.00246 10.6667C3.96912 10.6667 2.37112 9.37667 1.33579 7.82467V10.7847C1.33263 11.1381 1.42452 11.4859 1.60185 11.7917C1.77918 12.0974 2.03543 12.3499 2.34379 12.5227C3.4759 13.0959 4.73417 13.3747 6.00246 13.3333C7.27055 13.3749 8.52865 13.0961 9.66046 12.5227C9.96898 12.35 10.2254 12.0976 10.4029 11.7918C10.5803 11.4861 10.6723 11.1382 10.6691 10.7847V7.82467ZM10.6691 4V3.81333C10.6706 3.38929 10.5367 2.97585 10.2869 2.63316C10.0372 2.29047 9.68458 2.03643 9.28046 1.908C8.22361 1.54993 7.11808 1.35612 6.00246 1.33333C4.8869 1.35628 3.78143 1.54985 2.72446 1.90733C2.32033 2.03598 1.96777 2.29017 1.71803 2.63295C1.46829 2.97573 1.33439 3.38923 1.33579 3.81333V4C1.33579 5.62867 3.09912 9.33333 6.00246 9.33333C8.90579 9.33333 10.6691 5.62867 10.6691 4ZM6.00246 11.3333C5.8706 11.3333 5.74171 11.3724 5.63208 11.4457C5.52244 11.5189 5.43699 11.6231 5.38654 11.7449C5.33608 11.8667 5.32288 12.0007 5.3486 12.1301C5.37432 12.2594 5.43782 12.3782 5.53105 12.4714C5.62429 12.5646 5.74307 12.6281 5.8724 12.6539C6.00172 12.6796 6.13576 12.6664 6.25758 12.6159C6.3794 12.5655 6.48351 12.48 6.55677 12.3704C6.63002 12.2607 6.66912 12.1319 6.66912 12C6.66912 11.8232 6.59888 11.6536 6.47386 11.5286C6.34884 11.4036 6.17927 11.3333 6.00246 11.3333Z" fill="#374957"/>
</svg>
  ),
  bus: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M3 9h18M8 4v5M16 4v5M7 17l-1 3M17 17l1 3" />
      <circle cx="8" cy="17" r="1.5" />
      <circle cx="16" cy="17" r="1.5" />
    </svg>
  ),
};

// ─── NEW: Badge color map for transport cards ─────────────────────────────────

const TRANSPORT_BADGE_STYLES: Record<string, React.CSSProperties> = {
  flight:  { background: "#e0f7fa", color: "#00838f" },
  taxi:    { background: "#e0f7fa", color: "#00838f" },
  train:   { background: "#ede7f6", color: "#5e35b1" },
  bus:     { background: "#fff3e0", color: "#e65100" },
  cheaper: { background: "#e8f5e9", color: "#2e7d32" },
  fastest: { background: "#e3f2fd", color: "#1565c0" },
  popular: { background: "#fce4ec", color: "#880e4f" },
  info:    { background: "#e0f7fa", color: "#00838f" },
};

function getTransportBadgeStyle(label: string, color?: string): React.CSSProperties {
  const key = label.toLowerCase();
  if (TRANSPORT_BADGE_STYLES[key]) return TRANSPORT_BADGE_STYLES[key];
  if (color === "info") return TRANSPORT_BADGE_STYLES.info;
  return { background: "#f3f4f6", color: "#374151" };
}

// ─── NEW: Helpers to detect and parse transport ListViewItems ─────────────────

function extractAllTexts(node: WidgetNode): string[] {
  const texts: string[] = [];
  if (node.value && typeof node.value === "string") texts.push(node.value);
  for (const child of (node.children ?? []) as WidgetNode[]) {
    texts.push(...extractAllTexts(child));
  }
  return texts;
}

function extractAllBadges(node: WidgetNode): WidgetNode[] {
  const badges: WidgetNode[] = [];
  if (node.type === "Badge") badges.push(node);
  for (const child of (node.children ?? []) as WidgetNode[]) {
    badges.push(...extractAllBadges(child));
  }
  return badges;
}

/**
 * A ListView is a "transport list" when at least one item has a Caption
 * matching the pattern "NNN km • Xh Ym"
 */
function isTransportListView(children: WidgetNode[]): boolean {
  return children.some((item) => {
    const texts = extractAllTexts(item);
    return texts.some((t) => /\d+\s*km\s*[•·]/.test(t));
  });
}

// ─── NEW: TransportCard – renders one ListViewItem as the new card design ─────

function TransportCard({
  node,
  onAction,
}: {
  node: WidgetNode;
  onAction?: WidgetRendererProps["onAction"];
}) {
  const texts  = extractAllTexts(node);
  const badges = extractAllBadges(node);

  // "501 km • 1h 5m"
  const metaText  = texts.find((t) => /\d+\s*km\s*[•·]/.test(t)) ?? "";
  const metaParts = metaText.split(/\s*[•·]\s*/);
  const distance  = metaParts[0]?.trim() ?? "";
  const duration  = metaParts[1]?.trim() ?? "";

  // "Flight • Apr 24, 2026"
  const typeAndDate = texts.find((t) => /[•·]/.test(t) && !/km/.test(t)) ?? "";
  const tdParts     = typeAndDate.split(/\s*[•·]\s*/);
  const typeRaw     = tdParts[0]?.trim() ?? "";
  const date        = tdParts[1]?.trim() ?? "";

  const typeKey = typeRaw.toLowerCase();
  const icon    = TRANSPORT_ICONS[typeKey] ?? TRANSPORT_ICONS.taxi;

  const clickAction = node.onClickAction as
    | { type: string; payload?: Record<string, unknown> }
    | undefined;

  const handleClick = () => {
    if (clickAction) onAction?.(clickAction);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: "#ffffff",
        border: "0.5px solid #e5e7eb",
        borderRadius: 16,
        padding: "16px 18px",
        cursor: clickAction ? "pointer" : "default",
        transition: "border-color 0.15s",
        boxSizing: "border-box",
        width: "100%",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#d1d5db"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb"; }}
      className="w-full md:max-w-[500px]"
    >
      {/* Header: icon + name + badges */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        {/* Icon circle */}
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "#fafafa",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, color: "#374151",
          border: "1px solid #f0f0f0",
        }}>
          {icon}
        </div>

        {/* Name + subtitle */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 18, fontWeight: 500,
            color: "#111827", fontFamily: "'Inter', sans-serif",
            lineHeight: 1.2, marginBottom: 2,
          }}>
            {typeRaw || "Transfer"}
          </div>
          <div style={{
            fontSize: 13, color: "#9ca3af",
            fontFamily: "'Inter', sans-serif",
          }}>
            Non Stop
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {badges.map((b, i) => {
            const label = (b.label ?? b.value ?? "") as string;
            const color = b.color as string | undefined;
            const style = getTransportBadgeStyle(label, color);
            return (
              <span key={i} style={{
                ...style,
                padding: "2px 10px",
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                whiteSpace: "nowrap",
                border: `1px solid ${color || "#e0e0e0"}`,
              }}>
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <hr style={{ border: "none", borderTop: "1px solid grey", margin: "0 0 14px" }} />

      {/* Meta grid: Distance / Time / Date */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 8,
      }}>
        {[
          { label: "Distance", value: distance },
          { label: "Time",     value: duration },
          { label: "Date",     value: date },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{
              fontSize: 13, color: "#111827",
              fontFamily: "'Inter', sans-serif", marginBottom: 2,
            }}>
              {label}
            </div>
            <div style={{
              fontSize: 13, color: "#9ca3af",
              fontFamily: "'Inter', sans-serif",
            }}>
              {value || "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NEW: TransportListView – renders transport items as stacked cards ─────────

function TransportListView({
  node,
  onAction,
}: {
  node: WidgetNode;
  onAction?: WidgetRendererProps["onAction"];
}) {
  const children = (node.children ?? []) as WidgetNode[];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
      {children.map((item, idx) => (
        <TransportCard key={(item.key as string) ?? idx} node={item} onAction={onAction} />
      ))}
    </div>
  );
}


function isActivityListView(children: WidgetNode[]): boolean {
  return children.some((item) => {
    const texts = extractAllTexts(item);
    // Activity items have a price text like "₹5740.0" or "$200" and an image
    const hasPrice = texts.some((t) => /[₹$€£]\s*[\d,]+/.test(t));
    const hasImage = JSON.stringify(item).includes('"Image"');
    return hasPrice && hasImage;
  });
}

function ActivityCard({ node, onAction }: { node: WidgetNode; onAction?: WidgetRendererProps["onAction"] }) {
  const raw = JSON.stringify(node);
  const imgMatch = raw.match(/"src"\s*:\s*"([^"]+)"/);
  const imgSrc = imgMatch?.[1] ?? "";
  const imgAltMatch = raw.match(/"alt"\s*:\s*"([^"]+)"/);
  const imgAlt = imgAltMatch?.[1] ?? "";

  const texts = extractAllTexts(node);
  const title = texts.find((t) => t.length > 20 && !/[₹$€£]/.test(t) && !/[•·]/.test(t)) ?? "";
  const category = texts.find((t) => t.length > 2 && t.length < 30 && !/[₹$€£\d★]/.test(t) && t !== title) ?? "";
  const ratingText = texts.find((t) => /^\d\.\d+/.test(t)) ?? "";
  const rating = parseFloat(ratingText) || 0;
  const priceText = texts.find((t) => /[₹$€£]\s*[\d,]+/.test(t)) ?? "";
  const priceClean = priceText.replace(/\.0$/, "");
  const description = texts.find((t) => t.length > 50 && t !== title && !/[₹$€£]/.test(t)) ?? "";
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating) ? "★" : "☆").join("");
  const clickAction = node.onClickAction as { type: string; payload?: Record<string, unknown> } | undefined;

  return (
    <div
      onClick={() => clickAction && onAction?.(clickAction)}
      style={{
        background: "#ffffff",
        border: "1px solid #e5e5e5",
        borderRadius: 16,
        padding: "14px 16px",
        cursor: clickAction ? "pointer" : "default",
        width: "100%",
        marginBottom: 12,
        // transition: "border-color 0.15s",
      }}
      // onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-border-secondary)"; }}
      // onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-border-tertiary)"; }}
    >
      {/* Header */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)", lineHeight: 1.3, marginBottom: 5, fontFamily: "'Inter', sans-serif" }}>
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {category && <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "'Inter', sans-serif" }}>{category}</span>}
          {category && <span style={{ fontSize: 12, color: "var(--color-border-secondary)" }}>|</span>}
          <span style={{ color: "#f59e0b", fontSize: 14, letterSpacing: 1 }}>{stars}</span>
          {rating > 0 && <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "'Inter', sans-serif" }}>{rating.toFixed(2)}</span>}
        </div>
      </div>

      {/* Horizontal divider */}
      <div style={{ height: "0.5px", background: "#e5e5e5", marginBottom: 10 }} />

      {/* Body: description + image */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
        <p style={{ flex: 1, fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden", margin: 0, fontFamily: "'Inter', sans-serif" }}>
          {description}
        </p>
        {imgSrc && (
          <div style={{ flexShrink: 0, width: 110, height: 90, borderRadius: 10, overflow: "hidden" }}>
            <img src={imgSrc} alt={imgAlt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
      </div>

      {/* Price */}
      {priceClean && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif" }}>{priceClean}</span>
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "'Inter', sans-serif" }}>/ person</span>
        </div>
      )}
    </div>
  );
}

function ActivityListView({
  node,
  onAction,
}: {
  node: WidgetNode;
  onAction?: WidgetRendererProps["onAction"];
}) {
  const children = (node.children ?? []) as WidgetNode[];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
      {children.map((item, idx) => (
        <ActivityCard key={(item.key as string) ?? idx} node={item} onAction={onAction} />
      ))}
    </div>
  );
}

// ─── Form node ────────────────────────────────────────────────────────────────

function FormNode({ node, onAction }: { node: WidgetNode; onAction?: WidgetRendererProps["onAction"] }) {
  const children = (node.children ?? []) as WidgetNode[];
  const submitAction = node.onSubmitAction as { type: string; payload?: Record<string, unknown> } | null ?? null;

  // Collect all default values from Input/Select/Textarea children recursively
  function collectDefaults(nodes: WidgetNode[]): Record<string, string> {
    const defaults: Record<string, string> = {};
    for (const n of nodes) {
      if ((n.type === "Input" || n.type === "Textarea") && n.name) {
        defaults[n.name as string] = (n.defaultValue as string) ?? "";
      }
      if (n.type === "Select" && n.name) {
        defaults[n.name as string] = "";
      }
      if (n.children) {
        Object.assign(defaults, collectDefaults(n.children as WidgetNode[]));
      }
    }
    return defaults;
  }

  const [values, setValues] = useState<Record<string, string>>(collectDefaults(children));

  const setValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <FormContext.Provider value={{ values, setValue, submitAction, onAction }}>
      <div style={{ width: "100%" }}>
        {children.map((child, i) => (
          <NodeRenderer key={i} node={child} onAction={onAction} />
        ))}
      </div>
    </FormContext.Provider>
  );
}

// ─── Input node ───────────────────────────────────────────────────────────────

function InputNode({ node }: { node: WidgetNode }) {
  const form = useFormContext();
  const name = node.name as string;
  const value = form?.values[name] ?? (node.defaultValue as string) ?? "";

  return (
    <input
      type={(node.inputType as string) ?? "text"}
      placeholder={node.placeholder as string}
      value={value}
      required={node.required as boolean}
      pattern={node.pattern as string | undefined}
      onChange={(e) => form?.setValue(name, e.target.value)}
      style={{
        width: "100%",
        padding: "8px 12px",
        borderRadius: 8,
        border: "1.5px solid #e5e7eb",
        fontSize: 13,
        fontFamily: "'Inter', sans-serif",
        color: "#111827",
        background: "#fff",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.15s",
      }}
      onFocus={(e) => { e.target.style.borderColor = "#f59e0b"; }}
      onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }}
    />
  );
}

// ─── Select node ─────────────────────────────────────────────────────────────

function SelectNode({ node }: { node: WidgetNode }) {
  const form = useFormContext();
  const name = node.name as string;
  const value = form?.values[name] ?? "";
  const options = (node.options ?? []) as { label: string; value: string }[];
  const clearable = node.clearable as boolean | undefined;

  return (
    <select
      value={value}
      onChange={(e) => form?.setValue(name, e.target.value)}
      style={{
        width: "100%",
        padding: "8px 12px",
        borderRadius: 8,
        border: "1.5px solid #e5e7eb",
        fontSize: 13,
        fontFamily: "'Inter', sans-serif",
        color: value ? "#111827" : "#9ca3af",
        background: "#fff",
        outline: "none",
        boxSizing: "border-box",
        appearance: "none",
        cursor: "pointer",
        transition: "border-color 0.15s",
      }}
      onFocus={(e) => { e.target.style.borderColor = "#f59e0b"; }}
      onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }}
    >
      {(clearable || !value) && (
        <option value="">{node.placeholder as string ?? "Select…"}</option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

// ─── Textarea node ────────────────────────────────────────────────────────────

function TextareaNode({ node }: { node: WidgetNode }) {
  const form = useFormContext();
  const name = node.name as string;
  const value = form?.values[name] ?? "";

  return (
    <textarea
      placeholder={node.placeholder as string}
      value={value}
      rows={(node.rows as number) ?? 3}
      onChange={(e) => form?.setValue(name, e.target.value)}
      style={{
        width: "100%",
        padding: "8px 12px",
        borderRadius: 8,
        border: "1.5px solid #e5e7eb",
        fontSize: 13,
        fontFamily: "'Inter', sans-serif",
        color: "#111827",
        background: "#fff",
        outline: "none",
        boxSizing: "border-box",
        resize: "vertical",
        transition: "border-color 0.15s",
      }}
      onFocus={(e) => { e.target.style.borderColor = "#f59e0b"; }}
      onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }}
    />
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────

function ButtonNode({
  node,
  onAction,
}: {
  node: WidgetNode;
  onAction?: WidgetRendererProps["onAction"];
}) {
  const form = useFormContext();
  const {
    label, iconStart, variant = "solid",
    color = "default", pill, onClickAction, submit,
  } = node;

  const handleClick = () => {
    // Form submit button — serialize form values as comma-separated string
    if (submit && form?.submitAction) {
      const csv = Object.entries(form.values)
        .map(([k, v]) => `${k}=${v}`)
        .join(", ");
      form.onAction?.({
        type: form.submitAction.type,
        payload: {
          ...form.submitAction.payload,
          formData: csv,
        },
      });
      return;
    }
    // Regular action button
    if (onClickAction) {
      onAction?.(onClickAction as { type: string; payload?: Record<string, unknown> });
    }
  };

  // ── ··· reorder handle — hidden, space reclaimed ──
  if (iconStart === "dots-horizontal") {
    return null;
  }

  // ── notebook-pencil edit ──
  if (iconStart === "notebook-pencil") {
    return (
      <button onClick={handleClick} style={{
        width: 36, height: 36, borderRadius: 8,
        border: "none", background: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#374151", cursor: "pointer", outline: "none",
      }}>
        <NotebookPencilIcon />
      </button>
    );
  }

  // ── check-circle submit ──
  if (iconStart === "check-circle" || submit) {
    return (
      <button onClick={handleClick} style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "10px 20px",
        borderRadius: pill ? "9999px" : 10,
        border: "none",
        background: "#111827",
        color: "#fff",
        fontSize: 14, fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        cursor: "pointer", outline: "none",
      }}>
        {iconStart === "check-circle" && <CheckCircleIcon />}
        {label as string}
      </button>
    );
  }

  // ── Danger outline ──
  if (color === "danger" && variant === "outline") {
    return <></>;
  }

  // ── Primary solid ──
  if (color === "primary") {
    return (
      <button
        onClick={handleClick}
        style={{
          padding: "12px 20px",
          borderRadius: "8px",
          borderWidth: "2px",
          border: variant === "outline" ? "2px solid #111" : "none",
          background: variant === "solid" ? "#f7e700" : "transparent",
          backgroundColor: variant === "solid" ? "#f7e700" : "transparent",
          color: "#111",
          fontSize: "0.85rem",
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          cursor: "pointer",
          outline: "none",
        }}
      >
        {label as string}
      </button>
    );
  }

  // ── Generic fallback ──
  return (
    <button
      onClick={handleClick}
      style={{
        padding: "12px 20px",
        borderRadius: "8px",
        borderWidth: "2px",
        border: variant === "outline" ? "2px solid #111" : "none",
        background: variant === "solid" ? "#f7e700" : "transparent",
        backgroundColor: variant === "solid" ? "#f7e700" : "transparent",
        color: "#111",
        fontSize: "0.85rem",
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        cursor: "pointer",
        outline: "none",
      }}
    >
      {label as string}
    </button>
  );
}


function BoxNode({ node, onAction }: { node: WidgetNode; onAction?: WidgetRendererProps["onAction"] }) {
  const { size, width, height, background, radius, children, align, justify } = node;
  const routeCtx = useContext(RouteItemContext);

  // Detect route pin dot: small circle (size <= 10) with full radius and accent/colored bg
  const isRoutePinDot =
    radius === "full" &&
    size != null && (size as number) <= 10 &&
    background != null;

  if (isRoutePinDot && routeCtx) {
    const dotColor = resolveBg(background as string | undefined);
    return (
      <div style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: dotColor,
        flexShrink: 0,
      }} />
    );
  }

  // Detect vertical connector line: narrow box (width <= 3) with height, used between pins
  const isConnectorLine =
    width != null && (width as number) <= 3 &&
    height != null &&
    background != null &&
    !children;

  if (isConnectorLine) {
    // Hide connector for the last route item
    if (routeCtx?.isLast) return null;

    return (
      <div style={{
        width: 10,
        display: "flex",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <div style={{
          width: 0,
          height: typeof height === "string" ? height : `${height as number}px`,
          borderLeft: "2px dashed #d1d5db",
        }} />
      </div>
    );
  }

  const pxWidth  = width != null ? `${width as number}px` : size != null ? `${size as number}px` : undefined;
  const pxHeight = height != null
    ? (typeof height === "string" ? height : `${height as number}px`)
    : size != null ? `${size as number}px` : undefined;

  const borderRadius =
    radius === "full" ? "9999px" : radius === "sm" ? "4px" :
    radius === "md"   ? "8px"   : radius === "lg"  ? "14px" : "6px";

  const hasChildren = Array.isArray(children) && (children as WidgetNode[]).length > 0;

  return (
    <div style={{
      width: pxWidth, height: pxHeight, minWidth: pxWidth,
      background: resolveBg(background as string | undefined),
      borderRadius, flexShrink: 0,
      display: "flex",
      alignItems: ALIGN_MAP[align as string] ?? "center",
      justifyContent: JUSTIFY_MAP[justify as string] ?? "center",
    }}>
      {hasChildren && (children as WidgetNode[]).map((child, i) => (
        <NodeRenderer key={i} node={child} onAction={onAction} />
      ))}
    </div>
  );
}

// ─── Text nodes ───────────────────────────────────────────────────────────────

function TextNode({ node }: { node: WidgetNode }) {
  const { value, size = "md", weight = "normal", type } = node;
  const routeCtx = useContext(RouteItemContext);
  const fsMap: Record<string, number> = { xs: 11, sm: 13, md: 14, lg: 16, xl: 19 };
  const fwMap: Record<string, number> = { normal: 400, medium: 500, semibold: 600, bold: 700 };
  const textEl = (
    <span style={{
      fontSize: fsMap[size as string] ?? 14,
      fontWeight: fwMap[weight as string] ?? 400,
      color: type === "Caption" ? "#9ca3af" : "#111827",
      fontFamily: "'Inter', sans-serif",
      lineHeight: 1.4,
    }}>
      {value as string}
    </span>
  );

  // In route context, wrap text so it aligns vertically with the 10px dot
  if (routeCtx) {
    return (
      <div style={{
        height: 10,
        display: "flex",
        alignItems: "center",
      }}>
        {textEl}
      </div>
    );
  }

  return textEl;
}

function LabelNode({ node }: { node: WidgetNode }) {
  return (
    <label
      htmlFor={node.fieldName as string | undefined}
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: "#6b7280",
        fontFamily: "'Inter', sans-serif",
        display: "block",
      }}
    >
      {node.value as string}
    </label>
  );
}

// ─── Spacer ───────────────────────────────────────────────────────────────────

function SpacerNode() {
  return <div style={{ flex: 1 }} />;
}

// ─── Row ──────────────────────────────────────────────────────────────────────

const ALIGN_MAP: Record<string, string> = {
  start: "flex-start", center: "center", end: "flex-end", stretch: "stretch",
};
const JUSTIFY_MAP: Record<string, string> = {
  start: "flex-start", center: "center", end: "flex-end",
  between: "space-between", around: "space-around",
};

function isDotsHorizontalNode(n: WidgetNode): boolean {
  return (n.type === "Button" && n.iconStart === "dots-horizontal") ||
         (n.type === "Icon" && n.name === "dots-horizontal");
}

function RowNode({ node, onAction }: { node: WidgetNode; onAction?: WidgetRendererProps["onAction"] }) {
  const { children = [], gap, align, justify } = node;
  const filtered = (children as WidgetNode[]).filter((c) => !isDotsHorizontalNode(c));
  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      gap: resolveGap(gap as number | undefined),
      alignItems: ALIGN_MAP[align as string] ?? "center",
      justifyContent: JUSTIFY_MAP[justify as string] ?? "flex-start",
      width: "auto",
    }}>
      {filtered.map((child, i) => (
        <NodeRenderer key={i} node={child} onAction={onAction} />
      ))}
    </div>
  );
}

// ─── Col ──────────────────────────────────────────────────────────────────────

function ColNode({ node, onAction }: { node: WidgetNode; onAction?: WidgetRendererProps["onAction"] }) {
  const { children = [], gap, align, width } = node;


  return (
    <div style={{
      display: "flex", flexDirection: "column",
      gap: gap != null ? `${gap as number}px` : 0,       // raw px
      alignItems: ALIGN_MAP[align as string] ?? "flex-start",
      width: width != null ? `${width as number}px` : "auto", // raw px
      flexShrink: 0,
    }}>
      {(children as WidgetNode[]).map((child, i) => (
        <NodeRenderer key={i} node={child} onAction={onAction} />
      ))}
    </div>
  );
}

function IconNode({ node }: { node: WidgetNode }) {
  // dots-horizontal icon removed — space reclaimed by route items
  if (node.name === "dots-horizontal") return null;
  return null;
}

function ListViewItemNode({ node, onAction }: { node: WidgetNode; onAction?: WidgetRendererProps["onAction"] }) {
  const routeCtx = useContext(RouteItemContext);
  const children = (node.children ?? []) as WidgetNode[];
  const filtered = children.filter((c) => !isDotsHorizontalNode(c));

  if (isActivityListView(children)) {
    return <ActivityListView node={node} onAction={onAction} />;
  }

  // Transport cards (distance + duration items)
  if (isTransportListView(children)) {
    return <TransportListView node={node} onAction={onAction} />;
  }


  return (
    <div style={{
      display: "flex", flexDirection: "row",
      alignItems: routeCtx ? "flex-start" : "center",
      gap: node.gap != null ? `${(node.gap as number) * 4}px` : "8px",
      padding: "2px 0",
    }}>
      {filtered.map((child, i) => (
        <NodeRenderer key={i} node={child} onAction={onAction} />
      ))}
    </div>
  );
}

// Detect if a ListView contains route items (ListViewItems with a Col holding
// a small full-radius Box = pin dot pattern)
function isRouteListView(children: WidgetNode[]): boolean {
  if (children.length < 2) return false;
  return children.some((item) => {
    const kids = (item.children ?? []) as WidgetNode[];
    return kids.some(
      (k) =>
        k.type === "Col" &&
        Array.isArray(k.children) &&
        (k.children as WidgetNode[]).some(
          (c) => c.type === "Box" && c.radius === "full" && c.size != null && (c.size as number) <= 10
        )
    );
  });
}

// ─── ListView – routes to TransportListView when applicable ──────────────────

function ListViewNode({ node, onAction }: { node: WidgetNode; onAction?: WidgetRendererProps["onAction"] }) {
  const children = (node.children ?? []) as WidgetNode[];

  // NEW: delegate to transport card design when items contain transport data
  if (isTransportListView(children)) {
    return <TransportListView node={node} onAction={onAction} />;
  }

  const isRoute = isRouteListView(children);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      {children.map((item, idx) => {
        const content = (
          <ListViewItemNode key={(item.key as string) ?? idx} node={item} onAction={onAction} />
        );

        if (isRoute) {
          return (
            <RouteItemContext.Provider
              key={(item.key as string) ?? idx}
              value={{ index: idx, isLast: idx === children.length - 1 }}
            >
              {content}
            </RouteItemContext.Provider>
          );
        }

        return content;
      })}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function CardNode({ node, onAction }: { node: WidgetNode; onAction?: WidgetRendererProps["onAction"] }) {
  const children = (node.children ?? []) as WidgetNode[];
  const size = node.size as string | undefined;
  const customPadding = node.padding as number | undefined;
  const padding = customPadding
    ? customPadding * 4
    : size === "sm" ? 12 : size === "lg" ? 20 : 16;

  return (
    <div style={{
      padding,
      width: "100%",
      marginTop: 10,
      // background: "#fafafa",
      // borderRadius: 14,
      // border: "1px solid #f0f0f0",
      boxSizing: "border-box",
    }}>
      {children.map((child, i) => (
        <NodeRenderer key={i} node={child} onAction={onAction} />
      ))}
    </div>
  );
}

// ─── Node dispatcher ─────────────────────────────────────────────────────────

function NodeRenderer({
  node, onAction,
}: {
  node: WidgetNode;
  onAction?: WidgetRendererProps["onAction"];
}) {
  switch (node.type) {
    case "Card":         return <CardNode node={node} onAction={onAction} />;
    case "Form":         return <FormNode node={node} onAction={onAction} />;
    case "ListView":     return <ListViewNode node={node} onAction={onAction} />;
    case "ListViewItem": return <ListViewItemNode node={node} onAction={onAction} isLast />;
    case "Row":          return <RowNode node={node} onAction={onAction} />;
    case "Col":          return <ColNode node={node} onAction={onAction} />;
    case "Box":          return <BoxNode node={node} />;
    case "Button":       return <ButtonNode node={node} onAction={onAction} />;
    case "Input":        return <InputNode node={node} />;
    case "Select":       return <SelectNode node={node} />;
    case "Textarea":     return <TextareaNode node={node} />;
    case "Label":        return <LabelNode node={node} />;
    case "Text":
    case "Title":
    case "Caption":      return <TextNode node={node} />;
    case "Spacer":       return <SpacerNode />;
    case "Divider":
      return <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "4px 0" }} />;
    case "Icon": return <IconNode node={node} />;
    default:
      return (
        <pre style={{
          fontSize: 10, color: "#9ca3af", background: "#f9fafb",
          borderRadius: 6, padding: 6, overflow: "auto",
        }}>
          {JSON.stringify(node, null, 2)}
        </pre>
      );
  }
}

// ─── Public export ────────────────────────────────────────────────────────────

export function WidgetRenderer({ widget, onAction }: WidgetRendererProps) {
  return (
    <div style={{ paddingBottom: 4 }} className="w-full">
      <NodeRenderer node={widget as WidgetNode} onAction={onAction} />
    </div>
  );
}