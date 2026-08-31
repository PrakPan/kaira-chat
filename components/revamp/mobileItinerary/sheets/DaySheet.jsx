import React, { useMemo, useRef, useState } from "react";
import Sheet from "../../common/components/Sheet";
import prompts from "../kairaPrompts";

// ─────────────────────────────────────────────────────────────────────────────
//  DaySheet — one day, opened out.
//
//  The day row in the itinerary is deliberately a summary ("2 paid activities ·
//  4 ideas · 1 meal"); this is where that resolves into the actual list. The
//  filter chips exist because a full day mixes three quite different things —
//  what you've paid for, places you might wander to, and where to eat — and on
//  a phone they otherwise read as one undifferentiated stack.
//
//  Header order is the design's and is load-bearing: the serif day number LEADS
//  the row, so a stack of open days is scannable by number down the left edge.
//  It is not Sheet's `headerRight` slot, which would put it beside the close
//  button on the far side.
//
//  Tapping an item opens the detail sheet — the app already knows how long it
//  takes and whether anything is booked, so asking Kaira for that would be
//  putting a question in the chat the trip can answer itself.
// ─────────────────────────────────────────────────────────────────────────────

const FILTERS = [
  { key: "all", label: "All", match: () => true },
  { key: "places", label: "Places", match: (i) => i.kind === "poi" },
  { key: "food", label: "Food", match: (i) => i.kind === "food" },
  { key: "booked", label: "Booked", match: (i) => i.kind === "booked" },
];

export default function DaySheet({
  open,
  onClose,
  leg,
  day,
  disabled,
  onAskKaira,
  onOpenItem,
}) {
  const [filter, setFilter] = useState("all");

  // Same reason as DetailSheet: the sheet slot empties the moment this closes
  // (or the moment an item opens the detail sheet in its place), and rendering
  // null on that tick blanks the panel mid-slide.
  const lastRef = useRef(null);
  if (day && leg) lastRef.current = { day, leg };
  const held = day && leg ? { day, leg } : lastRef.current;
  const d = held?.day || null;
  const l = held?.leg || null;

  const items = useMemo(() => {
    if (!d) return [];
    const f = FILTERS.find((x) => x.key === filter) || FILTERS[0];
    return d.items.filter(f.match);
  }, [d, filter]);

  if (!d || !l) return null;

  return (
    <Sheet open={open} onClose={onClose} height="82dvh" zIndex={1600}>
      <div className="flex h-full flex-col">
        {/* Header — day number first, per the design */}
        <div className="flex-none px-[14px]">
          <div className="flex items-start gap-[11px] pb-[11px]">
            <span className="ttw-type-serif flex-none text-[28px] leading-none text-[#0b1220]">
              {d.dayNumber}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[15.5px] font-[700] tracking-[-0.02em] text-[#0b1220]">
                {d.title || "Free day"}
              </div>
              <div className="mt-[5px] font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
                {d.dateMeta} · {d.items.length} ITEM
                {d.items.length === 1 ? "" : "S"}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                border: "1px solid #dcdfe5",
                background: "#ffffff",
                borderRadius: 999,
                boxShadow: "none",
                width: 24,
                height: 24,
                color: "#6b7280",
                fontSize: 12,
                lineHeight: 1,
                padding: 0,
              }}
              className="flex flex-none items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* The rule belongs UNDER the chips, not under the title row. */}
          <div
            className="flex gap-[6px] overflow-x-auto border-b border-[#e6e8ec] pb-[11px]"
            style={{ scrollbarWidth: "none" }}
          >
            {FILTERS.map((f) => {
              const active = f.key === filter;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  style={{
                    border: active ? "1px solid #0b1220" : "1px solid #dcdfe5",
                    background: active ? "#0b1220" : "#ffffff",
                    borderRadius: 999,
                    boxShadow: "none",
                  }}
                  className={`flex-none whitespace-nowrap px-[12px] py-[7px] text-[11.5px] ${
                    active ? "text-white" : "text-[#6b7280]"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body — the add button is the last row of the flow, not a pinned bar */}
        <div className="min-h-0 flex-1 overflow-y-auto px-[14px] pb-[18px] pt-[12px]">
          <div className="flex flex-col gap-[9px]">
            {items.length === 0 ? (
              <div
                style={{ border: "1px dashed #dcdfe5", borderRadius: 11, boxShadow: "none" }}
                className="p-[18px] text-center text-[12px] text-[#8a93a6]"
              >
                Nothing here yet.
              </div>
            ) : (
              items.map((item, idx) => (
                <button
                  key={item.id || `${item.name}-${idx}`}
                  type="button"
                  onClick={() => onOpenItem?.(item)}
                  style={{
                    border: "1px solid #e6e8ec",
                    background: "#ffffff",
                    borderRadius: 11,
                    boxShadow: "none",
                  }}
                  className="flex w-full items-center gap-[10px] p-[10px] text-left"
                >
                  <div
                    className="h-[46px] w-[46px] flex-none rounded-[9px] bg-[#eef0f4] bg-cover bg-center"
                    style={
                      item.imageUrl
                        ? { backgroundImage: `url("${item.imageUrl}")` }
                        : undefined
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12.5px] font-[700] text-[#0b1220]">
                      {item.name}
                    </div>
                    <div className="mt-[4px] truncate font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
                      {item.meta || (item.kind === "booked" ? "BOOKED" : "ON YOUR OWN")}
                    </div>
                  </div>
                  {item.kind === "booked" && (
                    <span
                      style={{ border: "1px solid #0b1220", borderRadius: 3, boxShadow: "none" }}
                      className="flex-none px-[6px] py-[3px] font-mono text-[8px] tracking-[0.07em] text-[#0b1220]"
                    >
                      BOOKED
                    </span>
                  )}
                  <span
                    className="flex-none text-[13px] leading-none text-[#b8becc]"
                    aria-hidden
                  >
                    ›
                  </span>
                </button>
              ))
            )}

            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                onAskKaira?.(
                  prompts.addToDay(l.city, d.dayLabel),
                  [d.dayLabel, l.city].filter(Boolean).join(" · "),
                );
                onClose?.();
              }}
              style={{
                border: "1.5px dashed #cfd3da",
                background: "#ffffff",
                borderRadius: 11,
                boxShadow: "none",
              }}
              className="w-full p-[12px] text-[12.5px] font-[600] text-[#6b7280] disabled:opacity-40"
            >
              + Ask Kaira to add something
            </button>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
