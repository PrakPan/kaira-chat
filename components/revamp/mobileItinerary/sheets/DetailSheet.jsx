import React from "react";
import Sheet from "../../common/components/Sheet";
import prompts from "../kairaPrompts";

// ─────────────────────────────────────────────────────────────────────────────
//  DetailSheet — one item, opened out.
//
//  Tapping a row in the day sheet used to fire a message at Kaira, which put a
//  question in the chat for something the app already knows. The design answers
//  it in place: what this is, how long it takes, whether anything is booked,
//  and what happens if you skip it. Kaira is still the only way to CHANGE it —
//  the footer button hands over — but reading costs nothing.
//
//  Two shapes, per the design:
//   • booked  → "IN YOUR PACKAGE" · tickets held · Change + Remove
//   • idea    → "IN YOUR PACKAGE" · nothing extra to pay · Remove only
// ─────────────────────────────────────────────────────────────────────────────

const KIND_LABEL = {
  booked: "BOOKED ACTIVITY",
  food: "RESTAURANT",
  activity: "ACTIVITY",
  poi: "PLACE",
};

function Fact({ k, v }) {
  if (!v) return null;
  return (
    <div className="flex items-center justify-between gap-[12px] border-b border-[#f1f2f4] pb-[9px]">
      <span className="flex-none font-mono text-[8.5px] tracking-[0.07em] text-[#8a93a6]">
        {k}
      </span>
      <span className="text-right text-[12px] font-[600] text-[#0b1220]">{v}</span>
    </div>
  );
}

export default function DetailSheet({
  open,
  onClose,
  leg,
  day,
  item,
  disabled,
  onAskKaira,
}) {
  if (!item || !leg) return null;

  const booked = item.kind === "booked";
  const kind = KIND_LABEL[item.kind] || "PLACE";

  const blurb = booked
    ? "Tickets held for your group. Your guide meets you at the hotel."
    : "A suggestion, not a booking — go if you feel like it.";

  const facts = [
    { k: "WHEN", v: item.timeOfDay ? item.timeOfDay.toUpperCase() : day?.dayLabel },
    { k: "TIME NEEDED", v: item.durationLabel ? item.durationLabel.toUpperCase() : null },
    { k: "CATEGORY", v: item.category || null },
    { k: "STATUS", v: booked ? "Tickets held" : "Suggestion" },
  ];

  return (
    <Sheet open={open} onClose={onClose} height="78dvh" zIndex={1610}>
      <div className="flex h-full flex-col">
        <div className="flex-none px-[14px]">
          <div className="flex items-start gap-[11px] border-b border-[#e6e8ec] pb-[11px]">
            <div
              className="h-[54px] w-[54px] flex-none rounded-[11px] bg-[#eef0f4] bg-cover bg-center"
              style={item.imageUrl ? { backgroundImage: `url("${item.imageUrl}")` } : undefined}
            />
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[8px] tracking-[0.08em] text-[#8a93a6]">
                {kind}
              </div>
              <div className="mt-[4px] text-[15px] font-[800] tracking-[-0.02em] text-[#0b1220]">
                {item.name}
              </div>
              {item.meta ? (
                <div className="mt-[5px] font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
                  {item.meta}
                </div>
              ) : null}
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
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-[14px] py-[12px]">
          <div className="flex flex-col gap-[11px]">
            <div className="text-[12.5px] leading-[1.5] text-[#445069]">{blurb}</div>
            {facts.map((f) => (
              <Fact key={f.k} k={f.k} v={f.v} />
            ))}
            <div
              style={{ border: "1px solid #dcdfe5", borderRadius: 11, boxShadow: "none" }}
              className="flex flex-col gap-[4px] p-[11px]"
            >
              <div className="font-mono text-[8px] tracking-[0.07em] text-[#8a93a6]">
                CANCELLATION
              </div>
              <div className="text-[12px] text-[#0b1220]">
                {booked
                  ? "Free to cancel up to 48 hours before, then a fee applies."
                  : "Nothing booked — skip it freely."}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-none border-t border-[#e6e8ec] px-[14px] pb-[14px] pt-[11px]">
          <div className="flex items-center gap-[8px]">
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[8px] tracking-[0.07em] text-[#8a93a6]">
                IN YOUR PACKAGE
              </div>
              <div className="mt-[3px] text-[12.5px] font-[700] text-[#0b1220]">
                {booked ? "Tickets held" : "Included · nothing extra to pay"}
              </div>
            </div>
            {booked ? (
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  onAskKaira?.(prompts.changeActivity(item.name, leg.city));
                  onClose?.();
                }}
                style={{
                  border: "none",
                  background: "#f7e700",
                  borderRadius: 10,
                  boxShadow: "0 8px 20px -10px rgba(247,231,0,0.5)",
                }}
                className="flex-none whitespace-nowrap px-[18px] py-[11px] text-[12.5px] font-[800] text-[#0b1220] disabled:opacity-40"
              >
                Change activity
              </button>
            ) : null}
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                onAskKaira?.(prompts.removeItem(item.name, leg.city));
                onClose?.();
              }}
              style={{
                border: "1px solid #dcdfe5",
                background: "#ffffff",
                borderRadius: 10,
                boxShadow: "none",
              }}
              className="flex-none whitespace-nowrap px-[14px] py-[10px] text-[12.5px] font-[600] text-[#6b7280] disabled:opacity-40"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
