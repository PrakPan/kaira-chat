import React, { useState, useContext, createContext } from "react";
import { PiAirplaneTakeoff } from "react-icons/pi";
import { useSelector } from "react-redux";
import { currencySymbols } from "../../../data/currencySymbols";

// ─── Widget environment context ───────────────────────────────────────────────
// Carries ambient data (e.g. botMode) down to individual cards without
// threading a prop through every intermediate renderer.
interface WidgetEnv {
  botMode?: "p1" | "p2";
}
const WidgetEnvContext = createContext<WidgetEnv>({});
function useWidgetEnv() {
  return useContext(WidgetEnvContext);
}

// Shallow Redux selector for the Itinerary slice. Cards use this to enrich
// booking payloads (pax count, currency, cities) when the user hits
// "Add to Itinerary".
function useItineraryState(): any {
  try {
    return useSelector((s: any) => s?.Itinerary ?? null);
  } catch {
    return null;
  }
}

// Returns the display name of the itinerary_city whose id matches the given
// itineraryCityId. Used by RestaurantCard to render "1.8 km from Kyoto city
// center" etc. Returns "" when the city isn't in Redux (restored threads
// without an active itinerary, ambiguous ids, …) so callers can gracefully
// fall back to "from city center".
function useCityNameById(itineraryCityId?: string): string {
  const itinerary = useItineraryState();
  if (!itineraryCityId) return "";
  const cities: any[] | undefined = itinerary?.cities;
  const match = cities?.find((c) => c?.id === itineraryCityId);
  return (match?.city?.name as string) ?? (match?.name as string) ?? "";
}

// Build a generic booking payload from the Redux itinerary + a specific id.
// Backend owns "where does this go" — we just provide pax / occupancy and let
// the chat session's context pick the right city/date if missing.
function buildBookingPayload(itinerary: any, id: string) {
  const firstCity = itinerary?.cities?.[0];
  return {
    id,
    number_of_adults: itinerary?.number_of_adults ?? 2,
    number_of_children: itinerary?.number_of_children ?? 0,
    number_of_infants: itinerary?.number_of_infants ?? 0,
    children_ages: itinerary?.hotels_config?.room_configuration?.[0]?.childAges ?? [],
    currency: itinerary?.currency ?? "INR",
    room_configuration: itinerary?.hotels_config?.room_configuration ?? [
      { adults: itinerary?.number_of_adults ?? 2, children: 0, childAges: [] },
    ],
    itinerary_city_id: firstCity?.id,
    city_id: firstCity?.city?.id,
    check_in: firstCity?.start_date,
    check_out: firstCity?.end_date,
  };
}

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
  /**
   * When true, every CTA inside this widget (list cards, preview card, payment
   * button, generic <Button> nodes) is disabled. Used for historical widgets
   * restored from threads.get_by_id and for widgets whose CTA has already
   * been clicked.
   */
  disabled?: boolean;
}

// ─── Disabled-action context ──────────────────────────────────────────────────
// MessageBubble sets this to `true` for widgets whose CTAs should not be
// clickable — either because the user already clicked a flow-gating CTA
// (e.g. confirm-route, confirm-itinerary) or because the widget was restored
// from thread history (past interactions are frozen). Individual buttons
// read the flag and render as disabled.
const DisabledActionContext = createContext<boolean>(false);

// Actions that must stay clickable even when the widget is "disabled" — the
// user should always be able to re-open a detail drawer (activity / POI /
// restaurant / hotel / transfer), tap a list card, or retry payment.
const ALWAYS_ENABLED_ACTIONS = new Set<string>([
  "activity.view",
  "activity.detail",
  "open_activity_drawer",
  "place.view",
  "place.detail",
  "open_poi_drawer",
  "open_place_drawer",
  "poi.view",
  "poi.detail",
  "restaurant.view",
  "restaurant.detail",
  "open_restaurant_drawer",
  "hotel.view",
  "hotel.detail",
  "open_hotel_drawer",
  "transfer.view",
  "transfer.detail",
  "transfer.select",
  "open_transfer_drawer",
  "payment.start",
]);

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

// ─── Colorful tag palette (for POI / Hotel / Activity category tags) ──────────
// Picks a stable color for a given label so the same tag always gets the same
// color across re-renders.

const TAG_PALETTE: { bg: string; color: string; border: string }[] = [
  { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" }, // amber
  { bg: "#DBEAFE", color: "#1E40AF", border: "#BFDBFE" }, // blue
  { bg: "#D1FAE5", color: "#065F46", border: "#A7F3D0" }, // green
  { bg: "#FCE7F3", color: "#9D174D", border: "#FBCFE8" }, // pink
  { bg: "#EDE9FE", color: "#5B21B6", border: "#DDD6FE" }, // purple
  { bg: "#FFEDD5", color: "#9A3412", border: "#FED7AA" }, // orange
  { bg: "#CFFAFE", color: "#155E75", border: "#A5F3FC" }, // cyan
  { bg: "#FEE2E2", color: "#991B1B", border: "#FECACA" }, // red
  { bg: "#E0F2FE", color: "#075985", border: "#BAE6FD" }, // sky
  { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0" }, // emerald
];

function hashLabel(label: string): number {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// index: position within a card (0, 1, 2…). Combined with a per-card offset,
// this guarantees adjacent tags get DIFFERENT colors.
// offset: a per-card starting color (hash of something stable like title) so
// cards vary from each other but tags within a card are always distinct.
function ColorfulTag({
  label,
  index = 0,
  offset = 0,
}: {
  label: string;
  index?: number;
  offset?: number;
}) {
  const c = TAG_PALETTE[(offset + index) % TAG_PALETTE.length];
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: 9999,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

// Shared "Add to Itinerary" CTA — only rendered when we're in p2 stage.
// `onClick` fires the appropriate widget action (activity.add / hotel.add /
// poi.add) with an enriched payload. Stops propagation so clicking the
// button doesn't trigger the card's detail drawer.
function AddToItineraryButton({
  onClick,
}: {
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 9999,
        background: "#111",
        color: "#fff",
        border: "none",
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#1f2937";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#111";
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      Add to Itinerary
    </button>
  );
}

// Shared price-tag icon shown before a price value.
function PriceLabel() {
  return (
    <span
      aria-label="Price"
      style={{
        width: 24,
        height: 24,
        borderRadius: 9999,
        background: "#F0FDF4",
        border: "1px solid #BBF7D0",
        color: "#166534",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
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
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    </span>
  );
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

// Collect all descendant nodes of a given type (e.g., "Title", "Caption", "Text", "Image")
function findNodesByType(node: WidgetNode, type: string): WidgetNode[] {
  const results: WidgetNode[] = [];
  if (node.type === type) results.push(node);
  for (const child of (node.children ?? []) as WidgetNode[]) {
    results.push(...findNodesByType(child, type));
  }
  return results;
}

// A price text is a short, self-contained amount — either "₹129.46", "$200",
// "USD 16,238.88" or just "16238.88". Anything with currency context or a
// plain decimal number with very few words around it. Used to tell prices
// apart from descriptions / titles.
const PRICE_TEXT_RE = /^\s*(?:[₹$€£]|[A-Z]{3})?\s*[\d][\d,]*(?:\.\d+)?\s*$/;

// Reads the itinerary currency held on Cart (aligned with booking), falling
// back to the global currency slice. Returns the matching glyph so every card
// can show a uniform symbol regardless of what the server embedded in the
// widget's raw text.
function useItineraryCurrencySymbol(): string {
  const code = useSelector(
    (s: any) => s?.Cart?.currency ?? s?.currency?.currency ?? null,
  ) as string | null;
  if (code && (currencySymbols as Record<string, string>)[code]) {
    return (currencySymbols as Record<string, string>)[code];
  }
  return "₹";
}

// Formats a price string. Strips whatever currency prefix the server sent —
// symbol or 3-letter ISO code — and re-renders with the supplied symbol and
// locale-appropriate grouping. INR → Indian grouping (1,23,456); everything
// else → international grouping (123,456).
function formatPriceString(raw: string, symbol: string = "₹"): string {
  const match = raw.match(/(?:[₹$€£]|[A-Z]{3})?\s*([\d.,]+)/);
  if (!match) return raw;
  const numStr = match[1].replace(/,/g, "");
  const num = parseFloat(numStr);
  if (isNaN(num)) return raw;
  const rounded = Math.round(num);
  const locale = symbol === "₹" ? "en-IN" : "en-US";
  return `${symbol}${rounded.toLocaleString(locale)}`;
}

// Extract a unit label like "(Per Person)" / "(Per Night)" / "(1 - 2 Pax)"
function extractUnitLabel(texts: string[]): string {
  const unit = texts.find((t) => /^\s*\(.*\)\s*$/.test(t) && /(Per\s+\w+|Pax)/i.test(t));
  if (!unit) return "";
  return unit.replace(/^\s*\(|\)\s*$/g, "").trim();
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
      {/* Header: icon + name + badges (badges wrap to a new line on narrow screens) */}
      <div className="flex flex-wrap items-center gap-3 mb-[14px]">
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
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 18, fontWeight: 600,
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
        <div className="flex gap-[6px] flex-wrap justify-start sm:justify-end basis-full sm:basis-auto">
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
    // Activity items have a short price text (in any currency) and an image
    const hasPrice = texts.some((t) => PRICE_TEXT_RE.test(t));
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

  const symbol = useItineraryCurrencySymbol();
  const texts = extractAllTexts(node);
  const title = texts.find((t) => t.length > 20 && !PRICE_TEXT_RE.test(t) && !/[•·]/.test(t)) ?? "";
  const category = texts.find((t) => t.length > 2 && t.length < 30 && !PRICE_TEXT_RE.test(t) && !/[\d★]/.test(t) && t !== title) ?? "";
  const ratingText = texts.find((t) => /^\d\.\d+/.test(t)) ?? "";
  const rating = parseFloat(ratingText) || 0;
  const priceText = texts.find((t) => PRICE_TEXT_RE.test(t)) ?? "";
  const priceFormatted = priceText ? formatPriceString(priceText, symbol) : "";
  const unitLabel = extractUnitLabel(texts);
  const description = texts.find((t) => t.length > 50 && t !== title && !PRICE_TEXT_RE.test(t)) ?? "";
  const stars = Array.from({ length: 5 }, (_, i) =>
  i < Math.round(rating) ? (
    <svg
      key={i}
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="13"
      viewBox="0 0 14 13"
      fill="none"
    >
      <path
        d="M6.30562 1.04912C6.45928 0.737826 6.53611 0.582179 6.64041 0.53245C6.73115 0.489183 6.83658 0.489183 6.92732 0.53245C7.03162 0.582179 7.10845 0.737826 7.26211 1.04912L8.71989 4.00243C8.76526 4.09433 8.78794 4.14028 8.82109 4.17596C8.85044 4.20755 8.88563 4.23314 8.92473 4.25132C8.96889 4.27186 9.01959 4.27927 9.121 4.29409L12.3818 4.77071C12.7252 4.8209 12.8969 4.846 12.9764 4.92987C13.0455 5.00284 13.078 5.10311 13.0649 5.20276C13.0497 5.31729 12.9254 5.43836 12.6768 5.6805L10.3182 7.97785C10.2446 8.04947 10.2079 8.08528 10.1841 8.12788C10.1631 8.16561 10.1497 8.20705 10.1445 8.24991C10.1386 8.29832 10.1473 8.3489 10.1646 8.45007L10.7212 11.695C10.7799 12.0372 10.8092 12.2084 10.7541 12.3099C10.7061 12.3983 10.6208 12.4602 10.5219 12.4786C10.4083 12.4996 10.2546 12.4188 9.94726 12.2572L7.03211 10.7241C6.94128 10.6764 6.89586 10.6525 6.84802 10.6431C6.80565 10.6348 6.76208 10.6348 6.71972 10.6431C6.67187 10.6525 6.62645 10.6764 6.53562 10.7241L3.62047 12.2572C3.31313 12.4188 3.15946 12.4996 3.04584 12.4786C2.94698 12.4602 2.86167 12.3983 2.81368 12.3099C2.75852 12.2084 2.78787 12.0372 2.84657 11.695L3.40311 8.45007C3.42046 8.3489 3.42914 8.29832 3.42327 8.24991C3.41807 8.20705 3.4046 8.16561 3.38359 8.12788C3.35987 8.08528 3.32311 8.04947 3.24958 7.97785L0.890894 5.68049C0.642296 5.43836 0.517997 5.31729 0.502872 5.20276C0.489712 5.10311 0.522223 5.00284 0.591355 4.92987C0.670811 4.846 0.842502 4.8209 1.18588 4.77071L4.44673 4.29409C4.54814 4.27927 4.59884 4.27186 4.643 4.25132C4.6821 4.23314 4.7173 4.20755 4.74664 4.17596C4.77979 4.14028 4.80247 4.09433 4.84784 4.00243L6.30562 1.04912Z"
        fill="#F7E700"
        stroke="#C1A51B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : null
);
  const clickAction = node.onClickAction as { type: string; payload?: Record<string, unknown> } | undefined;

  // Split category into multiple tags (supports comma / slash / pipe / bullet separated)
  const categoryTags = category
    ? category.split(/\s*[,/|•·]\s*/).map((s) => s.trim()).filter(Boolean)
    : [];

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
        boxSizing: "border-box",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#111827";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e5e5";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Body: left column (title + rating + tags + divider + desc + price) + image */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 items-stretch">
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Title + rating on the same line */}
          {(title || rating > 0) && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {title && (
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    lineHeight: 1.3,
                    fontFamily: "'Inter', sans-serif",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {title}
                </div>
              )}
              {/* {rating > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  <StarFilledIcon size={13} />
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-secondary)",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {rating.toFixed(2)}
                  </span>
                </div>
              )} */}
            </div>
          )}

          {/* Colorful category tags — each distinct */}
          {categoryTags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {categoryTags.map((c, i) => (
                <ColorfulTag key={i} label={c} index={i} offset={hashLabel(title)} />
              ))}
            </div>
          )}

          {/* Divider */}
          {(title || categoryTags.length > 0) && (description || priceFormatted) && (
            <div style={{ height: "0.5px", background: "#e5e5e5" }} />
          )}

          {/* Description */}
          {description && (
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-secondary)",
                lineHeight: 1.55,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                margin: 0,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {description}
            </p>
          )}

          {/* Price */}
          {priceFormatted && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <PriceLabel />
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif" }}>
                  {priceFormatted}
                </span>
                {unitLabel && (
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "'Inter', sans-serif" }}>
                    / {unitLabel.toLowerCase()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {imgSrc && (
          <div className="w-full h-40 sm:w-[120px] sm:h-[120px] shrink-0 rounded-xl overflow-hidden self-center">
            <img src={imgSrc} alt={imgAlt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
      </div>
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

// ─── POI cards ─────────────────────────────────────────────────────────────────
// A ListView is a "POI list" when items carry a place.view onClickAction, or
// contain the POI-specific signature of discovery-colored badges + a map-pin
// icon with a numeric distance badge. No price, no "Per Night", no km-duration
// pattern — that keeps this distinct from hotel / transport / activity lists.

function findClickActionType(node: WidgetNode): string | undefined {
  const action = node.onClickAction as { type?: string } | undefined;
  if (action?.type) return action.type;
  for (const child of (node.children ?? []) as WidgetNode[]) {
    const t = findClickActionType(child);
    if (t) return t;
  }
  return undefined;
}

function isRestaurantListView(children: WidgetNode[]): boolean {
  return children.some((item) => {
    const actionType = findClickActionType(item);
    return actionType === "restaurant.view" || actionType === "restaurant.detail";
  });
}

function isPoiListView(children: WidgetNode[]): boolean {
  return children.some((item) => {
    const actionType = findClickActionType(item);
    if (actionType === "place.view" || actionType === "place.detail") return true;
    const raw = JSON.stringify(item);
    const hasDiscoveryBadge = /"color"\s*:\s*"discovery"/.test(raw);
    const hasMapPin = /"name"\s*:\s*"map-pin"/.test(raw);
    return hasDiscoveryBadge && hasMapPin;
  });
}

function MapPinIcon({ size = 14, color = "#6b7280" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function StarFilledIcon({ size = 14 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size * (13 / 14)} viewBox="0 0 14 13" fill="none">
      <path
        d="M6.30562 1.04912C6.45928 0.737826 6.53611 0.582179 6.64041 0.53245C6.73115 0.489183 6.83658 0.489183 6.92732 0.53245C7.03162 0.582179 7.10845 0.737826 7.26211 1.04912L8.71989 4.00243C8.76526 4.09433 8.78794 4.14028 8.82109 4.17596C8.85044 4.20755 8.88563 4.23314 8.92473 4.25132C8.96889 4.27186 9.01959 4.27927 9.121 4.29409L12.3818 4.77071C12.7252 4.8209 12.8969 4.846 12.9764 4.92987C13.0455 5.00284 13.078 5.10311 13.0649 5.20276C13.0497 5.31729 12.9254 5.43836 12.6768 5.6805L10.3182 7.97785C10.2446 8.04947 10.2079 8.08528 10.1841 8.12788C10.1631 8.16561 10.1497 8.20705 10.1445 8.24991C10.1386 8.29832 10.1473 8.3489 10.1646 8.45007L10.7212 11.695C10.7799 12.0372 10.8092 12.2084 10.7541 12.3099C10.7061 12.3983 10.6208 12.4602 10.5219 12.4786C10.4083 12.4996 10.2546 12.4188 9.94726 12.2572L7.03211 10.7241C6.94128 10.6764 6.89586 10.6525 6.84802 10.6431C6.80565 10.6348 6.76208 10.6348 6.71972 10.6431C6.67187 10.6525 6.62645 10.6764 6.53562 10.7241L3.62047 12.2572C3.31313 12.4188 3.15946 12.4996 3.04584 12.4786C2.94698 12.4602 2.86167 12.3983 2.81368 12.3099C2.75852 12.2084 2.78787 12.0372 2.84657 11.695L3.40311 8.45007C3.42046 8.3489 3.42914 8.29832 3.42327 8.24991C3.41807 8.20705 3.4046 8.16561 3.38359 8.12788C3.35987 8.08528 3.32311 8.04947 3.24958 7.97785L0.890894 5.68049C0.642296 5.43836 0.517997 5.31729 0.502872 5.20276C0.489712 5.10311 0.522223 5.00284 0.591355 4.92987C0.670811 4.846 0.842502 4.8209 1.18588 4.77071L4.44673 4.29409C4.54814 4.27927 4.59884 4.27186 4.643 4.25132C4.6821 4.23314 4.7173 4.20755 4.74664 4.17596C4.77979 4.14028 4.80247 4.09433 4.84784 4.00243L6.30562 1.04912Z"
        fill="#F7E700" stroke="#C1A51B" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function PoiCard({
  node,
  onAction,
}: {
  node: WidgetNode;
  onAction?: WidgetRendererProps["onAction"];
}) {
  const titleNodes = findNodesByType(node, "Title");
  const captionNodes = findNodesByType(node, "Caption");
  const textNodes = findNodesByType(node, "Text");
  const imageNodes = findNodesByType(node, "Image");
  const badgeNodes = findNodesByType(node, "Badge");

  const name = ((titleNodes[0]?.value as string) ?? "").trim();

  // Rating caption like "4 (263)" → rating + count
  const ratingCaption = captionNodes.find((c) => /^\s*\d/.test((c.value as string) ?? ""));
  const ratingRaw = ((ratingCaption?.value as string) ?? "").trim();
  const ratingMatch = ratingRaw.match(/^([\d.]+)\s*(?:\(([\d,]+)\))?/);
  const ratingValue = ratingMatch ? parseFloat(ratingMatch[1]) : 0;
  const ratingCount = ratingMatch?.[2] ?? "";

  // Discovery badges (category tags)
  const categoryBadges = badgeNodes.filter((b) => (b.color as string) === "discovery");

  // Distance badge (info color, numeric label like 1.1)
  const distanceBadge = badgeNodes.find((b) => {
    const label = b.label;
    const color = b.color as string | undefined;
    return color === "info" && (typeof label === "number" || /^[\d.]+$/.test(String(label ?? "")));
  });
  const distanceValue = distanceBadge ? String(distanceBadge.label) : "";

  // Description (long text node, not title, not price)
  const descriptionNode = textNodes.find((t) => {
    const v = ((t.value as string) ?? "").trim();
    return v.length > 30 && v !== name && !PRICE_TEXT_RE.test(v);
  });
  const description = ((descriptionNode?.value as string) ?? "").trim();

  const imgSrc = (imageNodes[0]?.src as string) ?? "";
  const imgAlt = (imageNodes[0]?.alt as string) ?? name;

  const clickAction = node.onClickAction as
    | { type: string; payload?: Record<string, unknown> }
    | undefined;

  const stars = ratingValue > 0
    ? Array.from({ length: 5 }, (_, i) =>
        i < Math.round(ratingValue) ? <StarFilledIcon key={i} /> : null,
      ).filter(Boolean)
    : [];

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
        transition: "border-color 0.15s, box-shadow 0.15s",
        boxSizing: "border-box",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#111827";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e5e5";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Body: left column (title + rating inline + badges + divider + desc + distance) + image */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 items-stretch">
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Title + rating on the same line */}
          {(name || ratingValue > 0) && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {name && (
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    lineHeight: 1.3,
                    fontFamily: "'Inter', sans-serif",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {name}
                </div>
              )}
              {/* {ratingValue > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  <StarFilledIcon size={13} />
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-secondary)",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {ratingValue}
                    {ratingCount ? ` (${ratingCount})` : ""}
                  </span>
                </div>
              )} */}
            </div>
          )}

          {/* Colorful category badges — each gets a distinct color */}
          {categoryBadges.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {categoryBadges.map((b, i) => (
                <ColorfulTag
                  key={i}
                  label={String(b.label ?? b.value ?? "")}
                  index={i}
                  offset={hashLabel(name)}
                />
              ))}
            </div>
          )}

          {/* Divider */}
          {(name || categoryBadges.length > 0) && (description || distanceValue) && (
            <div style={{ height: "0.5px", background: "#e5e5e5" }} />
          )}

          {/* Description */}
          {description && (
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-secondary)",
                lineHeight: 1.55,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                margin: 0,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {description}
            </p>
          )}

          {/* Distance row */}
          {distanceValue && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPinIcon size={14} color="#6b7280" />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#0369a1",
                  background: "#e0f2fe",
                  padding: "2px 8px",
                  borderRadius: 9999,
                  fontFamily: "'Inter', sans-serif",
                  border: "1px solid #BAE6FD",
                }}
              >
                {distanceValue} km
      
              </span>
            </div>
          )}
        </div>

        {imgSrc && (
          <div className="w-full h-40 sm:w-[120px] sm:h-[120px] shrink-0 rounded-xl overflow-hidden self-center">
            <img
              src={imgSrc}
              alt={imgAlt}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function PoiListView({
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
        <PoiCard key={(item.key as string) ?? idx} node={item} onAction={onAction} />
      ))}
    </div>
  );
}

// ─── Restaurant cards ──────────────────────────────────────────────────────────
// Visually similar to POI cards but drive the restaurant-mode POIDetailsDrawer.
// Detection is by onClickAction type (restaurant.view / restaurant.detail).

function RestaurantCard({
  node,
  onAction,
}: {
  node: WidgetNode;
  onAction?: WidgetRendererProps["onAction"];
}) {
  const titleNodes = findNodesByType(node, "Title");
  const captionNodes = findNodesByType(node, "Caption");
  const textNodes = findNodesByType(node, "Text");
  const imageNodes = findNodesByType(node, "Image");
  const badgeNodes = findNodesByType(node, "Badge");

  const name = ((titleNodes[0]?.value as string) ?? "").trim();

  const ratingCaption = captionNodes.find((c) => /^\s*\d/.test((c.value as string) ?? ""));
  const ratingRaw = ((ratingCaption?.value as string) ?? "").trim();
  const ratingMatch = ratingRaw.match(/^([\d.]+)\s*(?:\(([\d,]+)\))?/);
  const ratingValue = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

  const categoryBadges = badgeNodes.filter((b) => {
    const color = b.color as string | undefined;
    return color === "discovery" || color === "accent";
  });

  const distanceBadge = badgeNodes.find((b) => {
    const label = b.label;
    const color = b.color as string | undefined;
    return color === "info" && (typeof label === "number" || /^[\d.]+$/.test(String(label ?? "")));
  });
  const distanceValue = distanceBadge ? String(distanceBadge.label) : "";

  const descriptionNode = textNodes.find((t) => {
    const v = ((t.value as string) ?? "").trim();
    return v.length > 30 && v !== name && !PRICE_TEXT_RE.test(v);
  });
  const description = ((descriptionNode?.value as string) ?? "").trim();

  const imgSrc = (imageNodes[0]?.src as string) ?? "";
  const imgAlt = (imageNodes[0]?.alt as string) ?? name;

  const clickAction = node.onClickAction as
    | { type: string; payload?: Record<string, unknown> }
    | undefined;

  // The restaurant distance arrives as a raw number in a badge (e.g. 1.82).
  // We surface the itinerary city it belongs to so the badge reads as
  // "1.8 km from Kyoto city center" instead of a bare number.
  const clickPayload = clickAction?.payload ?? {};
  const itineraryCityId =
    ((clickPayload as any).itineraryCityId as string | undefined) ??
    ((clickPayload as any).itinerary_city_id as string | undefined);
  const cityName = useCityNameById(itineraryCityId);

  // Cuisine / restaurantType caption — short string, not rating / not address
  const cuisineCaption = captionNodes.find((c) => {
    const v = ((c.value as string) ?? "").trim();
    if (!v) return false;
    if (/^\d/.test(v)) return false;
    if (/★/.test(v)) return false;
    if (/^\(/.test(v)) return false;
    return v.length <= 30;
  });
  const cuisine = (cuisineCaption?.value as string) ?? "";

  const tags: string[] = [];
  if (cuisine) tags.push(cuisine);
  for (const b of categoryBadges) {
    const label = String(b.label ?? b.value ?? "");
    if (label && !tags.includes(label)) tags.push(label);
  }

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
        transition: "border-color 0.15s, box-shadow 0.15s",
        boxSizing: "border-box",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#111827";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e5e5";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div className="flex flex-col-reverse sm:flex-row gap-3 items-stretch">
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {(name || ratingValue > 0) && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {name && (
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    lineHeight: 1.3,
                    fontFamily: "'Inter', sans-serif",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {name}
                </div>
              )}
              {/* {ratingValue > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                  <StarFilledIcon size={13} />
                  <span
                    style={{
                      fontSize: 12,
                      color: "#374957",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {ratingValue.toFixed(1)}
                  </span>
                </div>
              )} */}
            </div>
          )}

          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {tags.map((t, i) => (
                <ColorfulTag key={i} label={t} index={i} offset={hashLabel(name)} />
              ))}
            </div>
          )}

          {(name || tags.length > 0) && (description || distanceValue) && (
            <div style={{ height: "0.5px", background: "#e5e5e5" }} />
          )}

          {description && (
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-secondary)",
                lineHeight: 1.55,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                margin: 0,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {description}
            </p>
          )}

          {distanceValue && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPinIcon size={14} color="#6b7280" />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#0369a1",
                  background: "#e0f2fe",
                  padding: "2px 8px",
                  borderRadius: 9999,
                  fontFamily: "'Inter', sans-serif",
                  border: "1px solid #BAE6FD",
                }}
              >
                {distanceValue} km
                {cityName ? ` from ${cityName} city center` : " from city center"}
              </span>
            </div>
          )}
        </div>

        {imgSrc && (
          <div className="w-full h-40 sm:w-[120px] sm:h-[120px] shrink-0 rounded-xl overflow-hidden self-center">
            <img
              src={imgSrc}
              alt={imgAlt}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function RestaurantListView({
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
        <RestaurantCard key={(item.key as string) ?? idx} node={item} onAction={onAction} />
      ))}
    </div>
  );
}

// ─── Hotel cards ───────────────────────────────────────────────────────────────
//
// A ListView is a "hotel list" when items contain a building icon, a "Per Night"
// unit caption, or an "N-Star Hotel" caption.

function isHotelListView(children: WidgetNode[]): boolean {
  return children.some((item) => {
    const raw = JSON.stringify(item);
    return (
      /"name"\s*:\s*"building"/.test(raw) ||
      /Per\s+Night/i.test(raw) ||
      /\d\s*-\s*Star\s+Hotel/i.test(raw)
    );
  });
}

function HotelCard({
  node,
  onAction,
}: {
  node: WidgetNode;
  onAction?: WidgetRendererProps["onAction"];
}) {
  const symbol = useItineraryCurrencySymbol();
  const titleNodes = findNodesByType(node, "Title");
  const captionNodes = findNodesByType(node, "Caption");
  const textNodes = findNodesByType(node, "Text");
  const imageNodes = findNodesByType(node, "Image");

  const name = (titleNodes[0]?.value as string) ?? "";

  const starsCaption = captionNodes.find((c) => /★/.test((c.value as string) ?? ""));
  const starsText = (starsCaption?.value as string) ?? "";

  const typeCaption = captionNodes.find((c) =>
    /\d\s*-\s*Star\s+Hotel/i.test((c.value as string) ?? "")
  );
  const hotelType = (typeCaption?.value as string) ?? "";

  const addressCaption = captionNodes.find((c) => {
    const v = ((c.value as string) ?? "").trim();
    if (!v) return false;
    if (v === starsText || v === hotelType) return false;
    if (/^\(/.test(v)) return false; // rating/unit captions
    if (/★/.test(v)) return false;
    return v.length > 10;
  });
  const address = (addressCaption?.value as string) ?? "";

  const descriptionNode = textNodes.find((t) => {
    const v = ((t.value as string) ?? "").trim();
    return v.length > 40 && !PRICE_TEXT_RE.test(v);
  });
  const description = (descriptionNode?.value as string) ?? "";

  const priceNode = textNodes.find((t) => PRICE_TEXT_RE.test((t.value as string) ?? ""));
  const priceRaw = (priceNode?.value as string) ?? "";
  const priceFormatted = priceRaw ? formatPriceString(priceRaw, symbol) : "";

  const allTextValues: string[] = [
    ...captionNodes.map((n) => (n.value as string) ?? ""),
    ...textNodes.map((n) => (n.value as string) ?? ""),
  ];
  const unitLabel = extractUnitLabel(allTextValues);

  const imgSrc = (imageNodes[0]?.src as string) ?? "";
  const imgAlt = (imageNodes[0]?.alt as string) ?? "";

  const clickAction = node.onClickAction as
    | { type: string; payload?: Record<string, unknown> }
    | undefined;

  const ratingCaption = captionNodes.find((c) => /\([\d.]+\)/.test((c.value as string) ?? ""));
  const ratingMatch = ((ratingCaption?.value as string) ?? "").match(/[\d.]+/);
  const rating = starsText ? starsText.trim().length : 0;

const starIcons = Array.from({ length: 5 }, (_, i) =>
  i < Math.round(rating) ? (
    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
      <path
        d="M6.30562 1.04912C6.45928 0.737826 6.53611 0.582179 6.64041 0.53245C6.73115 0.489183 6.83658 0.489183 6.92732 0.53245C7.03162 0.582179 7.10845 0.737826 7.26211 1.04912L8.71989 4.00243C8.76526 4.09433 8.78794 4.14028 8.82109 4.17596C8.85044 4.20755 8.88563 4.23314 8.92473 4.25132C8.96889 4.27186 9.01959 4.27927 9.121 4.29409L12.3818 4.77071C12.7252 4.8209 12.8969 4.846 12.9764 4.92987C13.0455 5.00284 13.078 5.10311 13.0649 5.20276C13.0497 5.31729 12.9254 5.43836 12.6768 5.6805L10.3182 7.97785C10.2446 8.04947 10.2079 8.08528 10.1841 8.12788C10.1631 8.16561 10.1497 8.20705 10.1445 8.24991C10.1386 8.29832 10.1473 8.3489 10.1646 8.45007L10.7212 11.695C10.7799 12.0372 10.8092 12.2084 10.7541 12.3099C10.7061 12.3983 10.6208 12.4602 10.5219 12.4786C10.4083 12.4996 10.2546 12.4188 9.94726 12.2572L7.03211 10.7241C6.94128 10.6764 6.89586 10.6525 6.84802 10.6431C6.80565 10.6348 6.76208 10.6348 6.71972 10.6431C6.67187 10.6525 6.62645 10.6764 6.53562 10.7241L3.62047 12.2572C3.31313 12.4188 3.15946 12.4996 3.04584 12.4786C2.94698 12.4602 2.86167 12.3983 2.81368 12.3099C2.75852 12.2084 2.78787 12.0372 2.84657 11.695L3.40311 8.45007C3.42046 8.3489 3.42914 8.29832 3.42327 8.24991C3.41807 8.20705 3.4046 8.16561 3.38359 8.12788C3.35987 8.08528 3.32311 8.04947 3.24958 7.97785L0.890894 5.68049C0.642296 5.43836 0.517997 5.31729 0.502872 5.20276C0.489712 5.10311 0.522223 5.00284 0.591355 4.92987C0.670811 4.846 0.842502 4.8209 1.18588 4.77071L4.44673 4.29409C4.54814 4.27927 4.59884 4.27186 4.643 4.25132C4.6821 4.23314 4.7173 4.20755 4.74664 4.17596C4.77979 4.14028 4.80247 4.09433 4.84784 4.00243L6.30562 1.04912Z"
        fill="#F7E700" stroke="#C1A51B" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  ) : (
   <></>
  )
);


  // Build a list of colorful tags for this hotel (hotel type + any extra tag-worthy captions)
  const hotelTags: string[] = [];
  if (hotelType) hotelTags.push(hotelType);
  // Optionally pull any additional short captions that aren't the address/stars/rating as tags
  for (const c of captionNodes) {
    const v = ((c.value as string) ?? "").trim();
    if (!v) continue;
    if (v === starsText || v === hotelType || v === address) continue;
    if (/★/.test(v)) continue;
    if (/^\(/.test(v)) continue; // unit / rating captions like "(Per Night)"
    if (v.length > 30) continue; // too long to be a tag
    if (hotelTags.includes(v)) continue;
    hotelTags.push(v);
  }

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
        boxSizing: "border-box",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#111827";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e5e5";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Body: left column (title + rating + tags + divider + desc + price) + image */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 items-stretch">
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Title + stars on the same line */}
          {(name || rating > 0) && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {name && (
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    lineHeight: 1.3,
                    fontFamily: "'Inter', sans-serif",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {name}
                </div>
              )}
              {/* {rating > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                  {starIcons}
                </div>
              )} */}
            </div>
          )}

          {/* Colorful tags row — each tag gets a distinct color */}
          {hotelTags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {hotelTags.map((t, i) => (
                <ColorfulTag key={i} label={t} index={i} offset={hashLabel(name)} />
              ))}
            </div>
          )}

          {/* Divider */}
          {(name || hotelTags.length > 0) && (address || description || priceFormatted) && (
            <div style={{ height: "0.5px", background: "#e5e5e5" }} />
          )}

          {/* Description */}
          {description && (
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-secondary)",
                lineHeight: 1.55,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                margin: 0,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {description}
            </p>
          )}

          {/* Address — below description, with a location icon */}
          {address && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
              <span style={{ flexShrink: 0, marginTop: 1 }}>
                <MapPinIcon size={14} color="#6b7280" />
              </span>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--color-text-secondary)",
                  margin: 0,
                  fontFamily: "'Inter', sans-serif",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {address}
              </p>
            </div>
          )}

          {/* Price */}
          {priceFormatted && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <PriceLabel />
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {priceFormatted}
                </span>
                {unitLabel && (
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-secondary)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    / {unitLabel.toLowerCase()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {imgSrc && (
          <div className="w-full h-40 sm:w-[120px] sm:h-[120px] shrink-0 rounded-xl overflow-hidden self-center">
            <img
              src={imgSrc}
              alt={imgAlt}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function HotelListView({
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
        <HotelCard key={(item.key as string) ?? idx} node={item} onAction={onAction} />
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
  const widgetDisabled = useContext(DisabledActionContext);
  const {
    label, iconStart, variant = "solid",
    color = "default", pill, onClickAction, submit,
  } = node;

  // "View Details" / activity / POI / restaurant / hotel / transfer / payment
  // CTAs stay clickable even after the widget is marked disabled. Only flow-
  // gating CTAs (route.lock, itinerary.lock, generic actions) get frozen.
  const actionType = (onClickAction as any)?.type as string | undefined;
  const isProtectedAction = actionType
    ? ALWAYS_ENABLED_ACTIONS.has(actionType)
    : false;
  const disabled = widgetDisabled && !isProtectedAction && !submit;

  const handleClick = () => {
    if (disabled) return;
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

  const disabledStyle = disabled
    ? { opacity: 0.55, cursor: "not-allowed" as const, filter: "grayscale(0.15)" }
    : {};

  // ── ··· reorder handle — hidden, space reclaimed ──
  if (iconStart === "dots-horizontal") {
    return null;
  }

  // ── notebook-pencil edit ──
  if (iconStart === "notebook-pencil") {
    return (
      <button onClick={handleClick} disabled={disabled} style={{
        width: 36, height: 36, borderRadius: 8,
        border: "none", background: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#374151", cursor: "pointer", outline: "none",
        ...disabledStyle,
      }}>
        <NotebookPencilIcon />
      </button>
    );
  }

  // ── check-circle submit ──
  if (iconStart === "check-circle" || submit) {
    return (
      <button onClick={handleClick} disabled={disabled} style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "10px 20px",
        borderRadius: pill ? "9999px" : 10,
        border: "none",
        background: "#111827",
        color: "#fff",
        fontSize: 14, fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        cursor: "pointer", outline: "none",
        ...disabledStyle,
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
        disabled={disabled}
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
          ...disabledStyle,
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
      disabled={disabled}
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
        ...disabledStyle,
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
  if (children.length < 1) return false;
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

  // Delegate to hotel card design when items contain hotel data (building icon / Per Night / N-Star Hotel)
  if (isHotelListView(children)) {
    return <HotelListView node={node} onAction={onAction} />;
  }

  // Restaurant cards — checked before POI so restaurant.view doesn't fall into
  // the POI branch when the card happens to carry a discovery badge + map-pin.
  if (isRestaurantListView(children)) {
    return <RestaurantListView node={node} onAction={onAction} />;
  }

  // Delegate to activity card design when items contain activity data (price + image)
  if (isActivityListView(children)) {
    return <ActivityListView node={node} onAction={onAction} />;
  }

  // Delegate to POI card design when items carry place.view actions (no price, map-pin + discovery badges)
  if (isPoiListView(children)) {
    return <PoiListView node={node} onAction={onAction} />;
  }

  // Delegate to transport card design when items contain transport data
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

// ─── Element preview card ─────────────────────────────────────────────────────
// Server sometimes emits a Card wrapping a single element (activity / hotel /
// POI / restaurant / transfer) with a "View & Add to Itinerary" button. The
// button's onClickAction.type is one of open_activity_drawer /
// open_hotel_drawer / open_poi_drawer / open_restaurant_drawer /
// open_transfer_drawer. We render it as a polished preview with an element-
// typed header, colored tag for the category, description, and a prominent
// full-width CTA — instead of the generic "just render the children" card.

const OPEN_DRAWER_ACTIONS = new Set([
  "open_activity_drawer",
  "open_hotel_drawer",
  "open_poi_drawer",
  "open_place_drawer",
  "open_restaurant_drawer",
  "open_transfer_drawer",
  // Newer detail/view variants emitted by the chat widgets for a single
  // activity / restaurant / place / hotel / transfer preview card.
  "activity.detail",
  "activity.view",
  "restaurant.detail",
  "restaurant.view",
  "place.detail",
  "place.view",
  "hotel.detail",
  "hotel.view",
  "transfer.detail",
  "transfer.view",
]);

function findOpenDrawerButton(node: WidgetNode): WidgetNode | null {
  if (
    node.type === "Button" &&
    typeof (node.onClickAction as any)?.type === "string" &&
    OPEN_DRAWER_ACTIONS.has((node.onClickAction as any).type)
  ) {
    return node;
  }
  for (const child of (node.children ?? []) as WidgetNode[]) {
    const hit = findOpenDrawerButton(child);
    if (hit) return hit;
  }
  return null;
}

function findPaymentButton(node: WidgetNode): WidgetNode | null {
  if (
    node.type === "Button" &&
    (node.onClickAction as any)?.type === "payment.start"
  ) {
    return node;
  }
  for (const child of (node.children ?? []) as WidgetNode[]) {
    const hit = findPaymentButton(child);
    if (hit) return hit;
  }
  return null;
}

// Crisp SVG glyphs keep the header consistent across browsers (emoji renders
// differently on macOS / Windows / Linux and often looks cartoony).
const ELEMENT_ICONS: Record<string, React.ReactNode> = {
  activity: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  hotel: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V8l9-5 9 5v13" />
      <path d="M9 21V12h6v9" />
    </svg>
  ),
  place: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  restaurant: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v8a3 3 0 0 0 3 3v7" />
      <path d="M6 3v8" />
      <path d="M9 3v8" />
      <path d="M15 21V3c-2.5 0-4 2.5-4 5s1.5 5 4 5" />
    </svg>
  ),
  transfer: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V15a1 1 0 0 0 1 1h2" />
      <circle cx="6.5" cy="16.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </svg>
  ),
};

const ELEMENT_HEADER_THEME: Record<
  string,
  { label: string; iconKey: keyof typeof ELEMENT_ICONS; bg: string; accent: string }
> = {
  open_activity_drawer: {
    label: "Activity",
    iconKey: "activity",
    bg: "#FEF3C7",
    accent: "#92400E",
  },
  open_hotel_drawer: {
    label: "Stay",
    iconKey: "hotel",
    bg: "#DBEAFE",
    accent: "#1E40AF",
  },
  open_poi_drawer: {
    label: "Place",
    iconKey: "place",
    bg: "#D1FAE5",
    accent: "#065F46",
  },
  open_place_drawer: {
    label: "Place",
    iconKey: "place",
    bg: "#D1FAE5",
    accent: "#065F46",
  },
  open_restaurant_drawer: {
    label: "Dining",
    iconKey: "restaurant",
    bg: "#FCE7F3",
    accent: "#9D174D",
  },
  open_transfer_drawer: {
    label: "Transfer",
    iconKey: "transfer",
    bg: "#EDE9FE",
    accent: "#5B21B6",
  },
  // Mirror the themes for the new *.detail / *.view action variants so
  // ElementPreviewCard can look them up without special-casing.
  "activity.detail":   { label: "Activity", iconKey: "activity", bg: "#FEF3C7", accent: "#92400E" },
  "activity.view":     { label: "Activity", iconKey: "activity", bg: "#FEF3C7", accent: "#92400E" },
  "hotel.detail":      { label: "Stay",     iconKey: "hotel",    bg: "#DBEAFE", accent: "#1E40AF" },
  "hotel.view":        { label: "Stay",     iconKey: "hotel",    bg: "#DBEAFE", accent: "#1E40AF" },
  "place.detail":      { label: "Place",    iconKey: "place",    bg: "#D1FAE5", accent: "#065F46" },
  "place.view":        { label: "Place",    iconKey: "place",    bg: "#D1FAE5", accent: "#065F46" },
  "restaurant.detail": { label: "Dining",   iconKey: "restaurant", bg: "#FCE7F3", accent: "#9D174D" },
  "restaurant.view":   { label: "Dining",   iconKey: "restaurant", bg: "#FCE7F3", accent: "#9D174D" },
  "transfer.detail":   { label: "Transfer", iconKey: "transfer", bg: "#EDE9FE", accent: "#5B21B6" },
  "transfer.view":     { label: "Transfer", iconKey: "transfer", bg: "#EDE9FE", accent: "#5B21B6" },
};

// Icon chip: circular badge (colored bg) + inline SVG + label. Used both in
// the header (no image) and as an overlay pill (image). Scales visually at
// two sizes — "md" for the standalone header, "sm" for the image overlay.
function ElementIconChip({
  theme,
  size = "md",
  floating = false,
}: {
  theme: { label: string; iconKey: keyof typeof ELEMENT_ICONS; bg: string; accent: string };
  size?: "sm" | "md";
  floating?: boolean;
}) {
  const isSm = size === "sm";
  return (
    <></>
    // <span
    //   style={{
    //     display: "inline-flex",
    //     alignItems: "center",
    //     gap: 6,
    //     padding: isSm ? "4px 10px 4px 4px" : "4px 12px 4px 4px",
    //     borderRadius: 9999,
    //     background: floating ? "rgba(255,255,255,0.96)" : "#ffffff",
    //     border: "1px solid rgba(17,24,39,0.08)",
    //     boxShadow: floating ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
    //     fontFamily: "'Inter', sans-serif",
    //     fontWeight: 600,
    //     fontSize: isSm ? 11 : 12,
    //     color: theme.accent,
    //     letterSpacing: 0.2,
    //   }}
    // >
    //   <span
    //     style={{
    //       width: isSm ? 20 : 22,
    //       height: isSm ? 20 : 22,
    //       borderRadius: "50%",
    //       background: theme.bg,
    //       color: theme.accent,
    //       display: "inline-flex",
    //       alignItems: "center",
    //       justifyContent: "center",
    //       flexShrink: 0,
    //     }}
    //   >
    //     {ELEMENT_ICONS[theme.iconKey]}
    //   </span>
    //   {theme.label}
    // </span>
  );
}

function ElementPreviewCard({
  node,
  button,
  onAction,
}: {
  node: WidgetNode;
  button: WidgetNode;
  onAction?: WidgetRendererProps["onAction"];
}) {
  const actionType = (button.onClickAction as any).type as string;
  const theme = ELEMENT_HEADER_THEME[actionType] ?? ELEMENT_HEADER_THEME.open_activity_drawer;

  const titleNodes = findNodesByType(node, "Title");
  const captionNodes = findNodesByType(node, "Caption");
  // Caption / Text values can come through as strings, arrays (tag lists for
  // POI cards), numbers or null — normalise to a trimmed string before we run
  // regex or string ops against them.
  const asText = (raw: unknown): string => {
    if (typeof raw === "string") return raw.trim();
    if (typeof raw === "number") return String(raw);
    if (Array.isArray(raw)) {
      return raw
        .map((v) => (typeof v === "string" ? v : typeof v === "number" ? String(v) : ""))
        .filter(Boolean)
        .join(" · ")
        .trim();
    }
    return "";
  };
  // Same thing but preserves array values as separate tag labels. POI Caption
  // nodes arrive as string[] (e.g. ["Cultural Deep-Dive", "Story-Rich",
  // "Shopping & Souvenirs"]) and we want to render each as its own pill.
  const asTags = (raw: unknown): string[] => {
    if (Array.isArray(raw)) {
      return raw
        .map((v) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : ""))
        .filter(Boolean);
    }
    const s = asText(raw);
    return s ? [s] : [];
  };

  const textNodes = findNodesByType(node, "Text").filter(
    (t) => !/^View\s*(&|and)\s*Add/i.test(asText(t.value)),
  );
  const imageNodes = findNodesByType(node, "Image");

  const payload = (button.onClickAction as any).payload ?? {};
  const title = asText(titleNodes[0]?.value) || asText(payload.title);
  // Prefer an explicit array from the Caption node (POI widgets send one).
  // Otherwise fall back to the string caption, or the payload's category /
  // restaurantType / tags fields. `tags` is an array of strings on place.*
  // payloads and should also be treated as separate pills.
  const tags = ((): string[] => {
    const captionTags = asTags(captionNodes[0]?.value);
    if (captionTags.length > 0) return captionTags;
    if (Array.isArray((payload as any).tags)) return asTags((payload as any).tags);
    const cat = asText(payload.category) || asText(payload.restaurantType);
    return cat ? [cat] : [];
  })();
  const description =
    textNodes
      .map((t) => asText(t.value))
      .find((v) => v.length > 0) || asText(payload.description);
  // Prefer an explicit <Image> node when the server renders one, but the
  // newer *.detail / *.view cards put the hero image on the button payload
  // instead — fall back to that so the preview still shows a thumbnail.
  const imgSrc = asText(imageNodes[0]?.src) || asText(payload.image);

  const buttonLabel = (button.label as string) ?? "View & Add to Itinerary";

  // "View Details" / "View & Add to Itinerary" CTAs stay clickable regardless
  // of the ambient DisabledActionContext — they only re-open a drawer.
  const handleClick = () => {
    onAction?.({ type: actionType, payload });
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e5e5",
        borderRadius: 16,
        padding: "14px 16px",
        width: "100%",
        marginTop: 10,
        marginBottom: 4,
        boxSizing: "border-box",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#111827";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e5e5";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div className="flex flex-col-reverse sm:flex-row gap-3 items-stretch">
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {title && (
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#111827",
                lineHeight: 1.3,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {title}
            </div>
          )}

          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {tags.map((tag, i) => (
                <ColorfulTag
                  key={`${tag}-${i}`}
                  label={tag}
                  index={i}
                  offset={hashLabel(title || tag)}
                />
              ))}
            </div>
          )}

          {(title || tags.length > 0) && description && (
            <div style={{ height: "0.5px", background: "#e5e5e5" }} />
          )}

          {description && (
            <p
              style={{
                fontSize: 13,
                color: "#4b5563",
                lineHeight: 1.55,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                margin: 0,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {description}
            </p>
          )}

          <button
            onClick={handleClick}
            style={{
              marginTop: 4,
              alignSelf: "flex-start",
              padding: "8px 14px",
              borderRadius: 8,
              background: "transparent",
              border: "1px solid #111827",
              color: "#111827",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#111827";
              (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#111827";
            }}
          >
            {buttonLabel}
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
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

        {imgSrc && (
          <div
            className="w-full h-40 sm:w-[120px] sm:h-[120px] shrink-0 rounded-xl overflow-hidden self-center"
            style={{ position: "relative" }}
          >
            <img
              src={imgSrc}
              alt={title || theme.label}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* keep the tiny floating chip hook — currently renders nothing */}
            <div style={{ position: "absolute", top: 6, left: 6 }}>
              <ElementIconChip theme={theme} size="sm" floating />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Payment preview card ────────────────────────────────────────────────────
// Server emits a Card containing a "Make Payment" button with
// onClickAction.type === "payment.start". Render it with a polished
// Total / Paid / Due summary and swap any USD/EUR/… prefixes for the symbol
// of the itinerary currency (state.Cart.currency → currencySymbols).

function parsePaymentRows(
  node: WidgetNode,
): Array<{ label: string; amount: string }> {
  const rows = findNodesByType(node, "Row");
  for (const row of rows) {
    const cols = ((row.children ?? []) as WidgetNode[]).filter(
      (c) => c.type === "Col",
    );
    if (cols.length < 2) continue;
    const items: Array<{ label: string; amount: string }> = [];
    for (const col of cols) {
      const kids = (col.children ?? []) as WidgetNode[];
      const captionValue = kids.find((c) => c.type === "Caption")?.value as
        | string
        | undefined;
      const textValue = kids.find((c) => c.type === "Text")?.value as
        | string
        | undefined;
      if (captionValue && textValue) {
        items.push({ label: captionValue, amount: textValue });
      }
    }
    if (items.length >= 2) return items;
  }
  return [];
}

// "USD 16,238.88" → { code: "USD", amount: "16,238.88" }.  Falls back to the
// raw value if the amount doesn't start with a 3-letter ISO code.
function splitCurrencyAmount(
  raw: string,
): { code: string | null; amount: string } {
  const m = raw.trim().match(/^([A-Z]{3})\s*([\d.,]+)$/);
  if (m) return { code: m[1], amount: m[2] };
  return { code: null, amount: raw.trim() };
}

function PaymentCard({
  node,
  button,
  onAction,
}: {
  node: WidgetNode;
  button: WidgetNode;
  onAction?: WidgetRendererProps["onAction"];
}) {
  // Use the shared helper so the payment card shows the same currency glyph
  // every other card uses (Cart.currency → currencySymbols).
  const symbol = useItineraryCurrencySymbol();

  const payload = (button.onClickAction as any).payload ?? {};
  const rows = parsePaymentRows(node);

  const titleNode = findNodesByType(node, "Title")[0];
  const title = ((titleNode?.value as string) ?? "Complete Your Booking").trim();
  const buttonLabel = (button.label as string) ?? "Make Payment";

  // Payment CTAs stay active regardless of the widget-disabled context — the
  // user should always be able to retry or open the drawer.
  const handlePay = () => {
    onAction?.({ type: "payment.start", payload });
  };

  // Pick an accent color per row label so "Balance Due" stands out.
  const accentFor = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("due") || l.includes("balance")) return "#B45309";
    if (l.includes("paid")) return "#047857";
    return "#111827";
  };

  return (
    <div
      style={{
        marginTop: 10,
        width: "100%",
        borderRadius: 18,
        border: "1px solid #FDE68A",
        background: "linear-gradient(135deg, #FFFDF5 0%, #FEF3C7 100%)",
        boxShadow: "0 6px 20px rgba(234, 179, 8, 0.10)",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div style={{ padding: "16px 18px 4px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 999,
              background: "#FDE68A",
              color: "#92400E",
              flexShrink: 0,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="6" width="18" height="13" rx="2" />
              <path d="M3 10h18" />
              <path d="M7 15h3" />
            </svg>
          </span>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.max(rows.length, 1)}, minmax(0, 1fr))`,
          gap: 12,
          padding: "6px 18px 14px",
        }}
      >
        {rows.map((r, i) => {
          const parsed = splitCurrencyAmount(r.amount);
          return (
            <div
              key={i}
              style={{
                background: "#ffffff",
                border: "1px solid rgba(17,24,39,0.06)",
                borderRadius: 12,
                padding: "10px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                {r.label}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: accentFor(r.label),
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <span style={{ marginRight: 2 }}>{symbol}</span>
                {parsed.amount}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "0 18px 16px" }}>
        <button
          onClick={handlePay}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "#111827",
            color: "#ffffff",
            border: "none",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#1F2937";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#111827";
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
          </svg>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function CardNode({ node, onAction }: { node: WidgetNode; onAction?: WidgetRendererProps["onAction"] }) {
  // Payment preview (Complete Your Booking) comes before the drawer check so
  // we never misroute a payment card into the element preview renderer.
  const paymentButton = findPaymentButton(node);
  if (paymentButton) {
    return <PaymentCard node={node} button={paymentButton} onAction={onAction} />;
  }

  // Detect the "element preview card" pattern and render with the polished
  // design above instead of the generic passthrough.
  const drawerButton = findOpenDrawerButton(node);
  if (drawerButton) {
    return <ElementPreviewCard node={node} button={drawerButton} onAction={onAction} />;
  }

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

export function WidgetRenderer({ widget, onAction, disabled = false }: WidgetRendererProps) {
  return (
    <DisabledActionContext.Provider value={disabled}>
      <div style={{ paddingBottom: 4 }} className="w-full">
        <NodeRenderer node={widget as WidgetNode} onAction={onAction} />
      </div>
    </DisabledActionContext.Provider>
  );
}