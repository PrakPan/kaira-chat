import React from "react";

// The "I'll handle" add-on list shared by the in-chat intake form and the
// themed mini-form: flights, visa assistance, eSIM / data. Same list card and
// switch as the tailored form's StepGroup (`.kform-list-card` / `.kform-toggle`
// in styles/kaira-form.css), inlined here because those classes only resolve
// their `--kf-*` tokens inside a `.kform` root.

export interface AddOns {
  flights: boolean;
  visa: boolean;
  esim: boolean;
}

export const DEFAULT_ADD_ONS: AddOns = { flights: true, visa: false, esim: false };

/** The add-ons as separate root-level request fields — the same keys the
 *  pricing-form prefill uses. Visa / eSIM are left out for a domestic trip,
 *  where the form never asked. */
export function addOnsRequestFields(
  addOns: AddOns,
  international: boolean,
): Record<string, boolean> {
  return international
    ? { add_flights: addOns.flights, add_visa: addOns.visa, add_esim: addOns.esim }
    : { add_flights: addOns.flights };
}

/** One readable line per add-on for the composed chat message. */
export function addOnsLines(addOns: AddOns, international: boolean): string[] {
  const yesNo = (v: boolean) => (v ? "Yes" : "No");
  const lines = [`• Add flights: ${yesNo(addOns.flights)}`];
  if (international) {
    lines.push(`• Add visa assistance: ${yesNo(addOns.visa)}`);
    lines.push(`• Add eSIM / data: ${yesNo(addOns.esim)}`);
  }
  return lines;
}

const INK = "#0b1220";
const INK_4 = "#8a93a6";
const INK_6 = "#dfe2ea";
const LINE = "#ececec";

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const IconPlane = () => (
  <svg {...iconProps}>
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
);

const IconPassport = () => (
  <svg {...iconProps}>
    <path d="M4 3h13a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4z" />
    <circle cx="11" cy="9" r="2.5" />
    <path d="M8 15h6" />
  </svg>
);

const IconSignal = () => (
  <svg {...iconProps}>
    <path d="M5 12.55a11 11 0 0 1 14 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);

interface AddOnTogglesProps {
  value: AddOns;
  onChange: (next: AddOns) => void;
  /** Visa and eSIM only apply abroad. */
  international: boolean;
  /** Where the flights start and land, for the flights row copy. */
  fromName?: string;
  toName?: string;
  /** Overrides the flights row copy — for forms with no destination to name. */
  flightsDesc?: string;
  /** Switch colour when on — ink by default, the theme accent on theme forms. */
  accent?: string;
  disabled?: boolean;
}

const AddOnToggles: React.FC<AddOnTogglesProps> = ({
  value,
  onChange,
  international,
  fromName,
  toName,
  flightsDesc,
  accent = INK,
  disabled = false,
}) => {
  const rows = [
    {
      key: "flights" as const,
      Icon: IconPlane,
      title: "Flights",
      tint: "#e0edff",
      color: "#1d4ed8",
      desc:
        flightsDesc ??
        `${fromName || "Home"} → ${toName || "your first stop"} return, plus the legs between cities`,
    },
    ...(international
      ? [
          {
            key: "visa" as const,
            Icon: IconPassport,
            title: "Visa assistance",
            tint: "#f3e8ff",
            color: "#7c3aed",
            desc: "Guidance and paperwork support before you fly",
          },
          {
            key: "esim" as const,
            Icon: IconSignal,
            title: "eSIM / data",
            tint: "#dcfce7",
            color: "#15803d",
            desc: "Stay connected the moment you land",
          },
        ]
      : []),
  ];

  return (
    <div
      style={{
        border: `1px solid ${LINE}`,
        borderRadius: 18,
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      {rows.map((r, i) => {
        const on = value[r.key];
        return (
          <div
            key={r.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              borderTop: i > 0 ? `1px solid ${LINE}` : "none",
            }}
          >
            {/* Coloured icon tile — same tints as the pricing form's rows. */}
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: r.tint,
                color: r.color,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
              }}
            >
              <r.Icon />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: INK }}>{r.title}</div>
              <div style={{ fontSize: 12.5, color: INK_4, marginTop: 1, lineHeight: 1.4 }}>
                {r.desc}
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={on}
              aria-label={r.title}
              disabled={disabled}
              onClick={() => onChange({ ...value, [r.key]: !on })}
              style={{
                width: 44,
                height: 26,
                borderRadius: 999,
                border: 0,
                cursor: disabled ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                padding: 4,
                transition: "background 0.15s",
                background: on ? accent : INK_6,
                justifyContent: on ? "flex-end" : "flex-start",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: "#ffffff",
                  pointerEvents: "none",
                  boxShadow: "0 1px 2px rgba(11, 18, 32, 0.25)",
                }}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AddOnToggles;
