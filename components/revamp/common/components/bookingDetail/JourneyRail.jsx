import React from "react";
import StatusPill from "./StatusPill";

/**
 * The spine every transfer booking-detail drawer is built on.
 *
 * One component renders all eight booking shapes because the rail doesn't care
 * what its nodes mean — a flight's nodes are airports, a sightseeing package's
 * are days, a multi-day taxi's are the services that share the car. That is the
 * whole point: the drawers used to need a branch per shape, which is why a
 * sightseeing booking rendered a route strip with one address and an empty
 * other half, and why a package needed an accordion.
 *
 * Node kinds:
 *  - place / day / service — sit ON the rail and get a dot. `title` is the
 *    heading, `subtitle` the line under it, `tag` an optional chip, and
 *    `time`/`date` fill the left gutter.
 *  - carrier — the block BETWEEN two dots: who operates this stretch and how
 *    long it takes.
 *  - wait — a layover or gap. Amber, because it is a caution, not a mode.
 *  - link — something that precedes the journey without being part of it (the
 *    flight an airport pickup is meeting). Rendered above the first dot, with
 *    no rail behind it.
 *
 * A node can also expand: give it `onToggle` and its heading becomes a control
 * that reveals `detail` in place. That is how a multi-service package opens a
 * service — on the rail, where it already sits, rather than in an accordion
 * card stacked beside it.
 *
 * The rail is drawn as a real element rather than a pseudo-element so the mode
 * accent can come in as an inline style.
 */
const DOT_KINDS = new Set(["place", "day", "service"]);

const DOT_CENTER = 9; // px from the row's top — 4px offset + half of a 10px dot

const TONES = {
  wait: { bg: "#fff3d1", fg: "#8a6100" },
  link: { bg: "#e6f0ff", fg: "#1d4e96" },
};

function Gutter({ show, isFirst, isLast, isDot, isMid, stopsAtDot, accent }) {
  return (
    <div className="relative">
      {show ? (
        <span
          className="absolute left-1/2 w-[2px] -translate-x-1/2"
          style={{
            background: accent.soft,
            top: isFirst ? DOT_CENTER : 0,
            // Stops at the dot on the last node, and on an open one — below an
            // open node the panel interrupts the rail, so a line carrying on
            // down would just run into the panel's own top rule.
            bottom:
              isLast || stopsAtDot ? `calc(100% - ${DOT_CENTER}px)` : 0,
          }}
        />
      ) : null}

      {isDot ? (
        isMid ? (
          <span
            className="relative block w-2 h-2 rounded-full mx-auto mt-[5px] bg-white border-2"
            style={{ borderColor: accent.soft }}
          />
        ) : isLast ? (
          <span
            className="relative block w-2.5 h-2.5 rounded-full mx-auto mt-1 bg-white border-[2.5px]"
            style={{ borderColor: accent.solid }}
          />
        ) : (
          <span
            className="relative block w-2.5 h-2.5 rounded-full mx-auto mt-1"
            style={{ background: accent.solid }}
          />
        )
      ) : null}
    </div>
  );
}

function Block({ node, accent }) {
  const tone = TONES[node.kind];

  return (
    <div
      className="inline-flex items-center gap-2 flex-wrap rounded-[10px] px-3 py-2.5 max-w-full"
      style={{ background: tone ? tone.bg : "#fafaf5" }}
    >
      {node.kind === "carrier" && accent.Icon ? (
        <accent.Icon size={15} color={accent.solid} aria-hidden="true" />
      ) : null}
      {node.icon ? <span className="flex items-center shrink-0">{node.icon}</span> : null}

      {/* A carrier name is a supplier string ("Toyota Mini Van or similar"), so
          it wraps inside the block rather than stretching it. */}
      {node.name ? (
        <span
          className="ttw-type-small font-600 leading-tight min-w-0 break-words"
          style={{ color: tone ? tone.fg : "#0b1220" }}
        >
          {node.name}
        </span>
      ) : null}

      {node.meta ? (
        <span
          className="font-mono text-[11px] leading-tight tabular-nums min-w-0 break-words"
          style={{ color: tone ? tone.fg : "#445069" }}
        >
          {node.meta}
        </span>
      ) : null}
    </div>
  );
}

function Heading({ node, isMid, stamp }) {
  const inner = (
    <>
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          {/* Compact rows have no time gutter, so the stamp becomes an eyebrow
              over the title rather than a column beside it. */}
          {stamp ? (
            <div className="font-mono text-[9.5px] font-500 uppercase tracking-[0.1em] text-[#8a93a6] mb-1">
              {stamp}
            </div>
          ) : null}
          {node.title ? (
            <h4
              // Titles are supplier strings — terminal names, hotel addresses —
              // and an unbroken one would otherwise widen the whole drawer.
              className={`mb-0 text-[#0b1220] font-600 tracking-[-0.015em] break-words ${
                isMid ? "text-[14px]" : "text-[15px]"
              }`}
            >
              {node.title}
            </h4>
          ) : null}
          {node.subtitle ? (
            <p className="ttw-type-small text-[#445069] mt-0.5 mb-0 break-words">
              {node.subtitle}
            </p>
          ) : null}
        </div>

        {node.status ? <StatusPill status={node.status} /> : null}

        {node.onToggle ? (
          <span
            className="shrink-0 flex items-center text-[#8a93a6] mt-0.5"
            aria-hidden="true"
            style={{ transform: node.open ? "rotate(180deg)" : "none" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        ) : null}
      </div>

      {node.tag ? (
        <span
          className="inline-block max-w-full break-words mt-[7px] font-mono text-[10.5px] rounded-[5px] px-2 py-0.5"
          style={
            node.tagTone === "warn"
              ? { background: "#fff3d1", color: "#8a6100" }
              : { background: "#f4f3ec", color: "#445069" }
          }
        >
          {node.tag}
        </span>
      ) : null}
    </>
  );

  if (!node.onToggle) return inner;

  return (
    <button
      type="button"
      onClick={node.onToggle}
      aria-expanded={!!node.open}
      className="block w-full text-left"
    >
      {inner}
    </button>
  );
}

/**
 * `compact` drops the time gutter and moves each stamp into its heading.
 *
 * It exists for one case: a combo's leg list, where every leg expands into a
 * rail of its own. Two rails with their own 68px time tracks put the inner one
 * a few pixels from the outer one — unreadable — and left a leg's name barely a
 * hundred pixels on a phone, so "Bus from Krabi to Phuket" broke over three
 * lines. Compact pulls the leg list in to a 14px rail, which both separates the
 * two rails and gives the name the width it needs.
 */
export default function JourneyRail({
  nodes,
  accent,
  compact = false,
  className = "",
}) {
  const items = (nodes || []).filter(Boolean);
  if (!items.length) return null;

  const isDot = items.map((node) => DOT_KINDS.has(node.kind));
  const firstDot = isDot.indexOf(true);
  const lastDot = isDot.lastIndexOf(true);

  const columns = compact ? "14px minmax(0,1fr)" : "68px 14px minmax(0,1fr)";

  return (
    <div className={`px-4 pt-4 ${className}`}>
      {items.map((node, index) => {
        const dot = isDot[index];
        const onRail = firstDot !== -1 && index >= firstDot && index <= lastDot;
        const isFirst = index === firstDot;
        const isLast = index === lastDot;
        const isMid = dot && !isFirst && !isLast;
        const isTail = index === items.length - 1;
        const isOpen = dot && !!node.onToggle && !!node.open;

        // A combo's legs each carry their own mode, so a node may override the
        // rail's accent to colour itself.
        const tone = node.accent || accent;

        return (
          <React.Fragment key={node.key || index}>
          <div
            className="grid gap-x-3"
            // 68px, not 58: a 12-hour stamp is eight mono characters wide
            // ("09:00 AM") and wrapped its meridiem onto a second line at the
            // narrower track.
            style={{ gridTemplateColumns: columns }}
          >
            {compact ? null : (
              <div className="text-right pt-px">
                {node.time ? (
                  <div className="font-mono text-[12.5px] font-500 text-[#0b1220] tabular-nums leading-tight whitespace-nowrap">
                    {node.time}
                  </div>
                ) : null}
                {node.date ? (
                  <div className="font-mono text-[9.5px] font-500 uppercase tracking-[0.1em] text-[#8a93a6] mt-0.5">
                    {node.date}
                  </div>
                ) : null}
              </div>
            )}

            <Gutter
              show={onRail}
              isFirst={isFirst}
              isLast={isLast}
              isDot={dot}
              isMid={isMid}
              stopsAtDot={isOpen}
              accent={tone}
            />

            <div
              className={`min-w-0 ${
                isOpen ? "pb-3" : isTail ? "pb-4" : dot ? "pb-6" : "pb-[18px]"
              }`}
            >
              {dot ? (
                <Heading
                  node={node}
                  isMid={isMid}
                  stamp={
                    compact
                      ? [node.date, node.time].filter(Boolean).join(" · ")
                      : null
                  }
                />
              ) : (
                <Block node={node} accent={tone} />
              )}
            </div>
          </div>

          {/* An expanded leg escapes the grid rather than sitting in its content
              column. Nested inside it, the embedded drawer body would start
              past the time track AND the rail — then add its own gutter and a
              second time track on top, which on a phone left barely 100px for a
              station name. Full-bleed (-mx-4 cancels this rail's own padding)
              means nested content gets exactly the same 16px gutter as a
              standalone drawer. The rail pauses for the panel and resumes at the
              next node, which is what an opened row should look like. */}
          {isOpen ? (
            <div className="-mx-4 mb-4 border-t border-[#efede6]">
              {node.detail}
            </div>
          ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}
