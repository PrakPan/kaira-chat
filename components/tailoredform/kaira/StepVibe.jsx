import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { contextChips } from "../../../services/leads/tailored";
import {
  setSpecialRequests,
  setVibePreferences,
} from "../../../store/actions/slideOneActions";
import { IconPlus, IconRefresh, IconX } from "./icons";

const MAX_NOTE = 2000;
const CHIPS_PER_DRAW = 6;

// Kaira returns chips in lower case ("local street food"). Capitalise the
// first letter for display only — the value stored and sent to /complete is
// exactly what the API gave us.
const asLabel = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/**
 * Step 4 — "What's the vibe?": Kaira's suggested preference chips for this
 * destination / date / group (POST /chatkit/context-chips), the user's picks,
 * and a free-text note.
 *
 * Picks are stored in slideFour.vibePreferences and sent to /complete as
 * `preferences`; the note stays `special_request`.
 */
const StepVibe = ({ destNames = [], destName, startDate, groupType, dateShort }) => {
  const dispatch = useDispatch();
  const selected = useSelector(
    (state) => state.tailoredInfoReducer.slideFour.vibePreferences,
  ) || [];
  const note = useSelector(
    (state) => state.tailoredInfoReducer.slideFour.specialRequests,
  ) || "";

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  // Everything we've already shown this session, so "more ideas" keeps
  // surfacing new chips instead of the same five.
  const seenRef = useRef(new Set());
  const seqRef = useRef(0);

  const draw = useCallback(async () => {
    const seq = ++seqRef.current;
    setLoading(true);
    setFailed(false);
    try {
      const body = {
        destination: destNames.length === 1 ? destNames[0] : destNames,
        max_chips: CHIPS_PER_DRAW,
      };
      if (startDate) body.start_date = startDate;
      if (groupType) body.group_type = groupType;
      const res = await contextChips.post("", body);
      if (seq !== seqRef.current) return;
      const chips = Array.isArray(res.data?.chips) ? res.data.chips : [];
      const fresh = chips.filter(
        (c) => typeof c === "string" && c.trim() && !selected.includes(c) && !seenRef.current.has(c),
      );
      // If the model only returns repeats, fall back to whatever it sent that
      // isn't already picked rather than showing an empty row.
      const next = (fresh.length ? fresh : chips.filter((c) => !selected.includes(c))).slice(
        0,
        CHIPS_PER_DRAW,
      );
      next.forEach((c) => seenRef.current.add(c));
      setSuggestions(next);
    } catch (e) {
      if (seq !== seqRef.current) return;
      setFailed(true);
    } finally {
      if (seq === seqRef.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destNames.join("|"), startDate, groupType]);

  useEffect(() => {
    draw();
  }, [draw]);

  const add = (label) => {
    dispatch(setVibePreferences([...selected, label]));
    setSuggestions((prev) => prev.filter((c) => c !== label));
  };
  const remove = (label) =>
    dispatch(setVibePreferences(selected.filter((c) => c !== label)));

  return (
    <div className="kform-step kform-step--vibe">
      <h1 className="kform-h1">
        What's the <span className="kform-serif">vibe</span>?
      </h1>
      <p className="kform-lead" style={{ marginBottom: 24 }}>
        These aren't a fixed menu. I read {destName || "your destination"} in your
        dates and picked what's actually worth it.
      </p>

      {selected.length > 0 && (
        <div className="kform-picks">
          <div className="kform-label">Your picks · {selected.length}</div>
          <div className="kform-chipset">
            {selected.map((s) => (
              <button key={s} type="button" className="kform-pick" onClick={() => remove(s)}>
                {asLabel(s)}
                <IconX size={12} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="kform-rule" style={{ padding: 0 }}>
          <div className="kform-label" style={{ minWidth: 0 }}>
            Suggested for {destName || "you"}
            {dateShort ? ` · ${dateShort}` : ""}
          </div>
          <div className="kform-rule-line kform-wide-only" />
          <button
            type="button"
            className={`kform-more${loading ? " is-loading" : ""}`}
            onClick={draw}
            disabled={loading}
          >
            <IconRefresh />
            More ideas
          </button>
        </div>
        <div className="kform-chipset">
          {loading && suggestions.length === 0
            ? [96, 128, 84, 140, 110, 92].map((w, i) => (
                <div key={i} className="kform-suggest-skel" style={{ width: w }} />
              ))
            : suggestions.map((g) => (
                <button key={g} type="button" className="kform-suggest" onClick={() => add(g)}>
                  <IconPlus size={12} />
                  {asLabel(g)}
                </button>
              ))}
          {!loading && suggestions.length === 0 && (
            <div className="kform-hint" style={{ marginTop: 0 }}>
              {failed
                ? "Couldn't reach Kaira for ideas just now. Tell me in the box below instead."
                : "You've picked everything I had. Tap More ideas for a fresh set."}
            </div>
          )}
        </div>
        <div className="kform-hint" style={{ marginTop: 0 }}>
          Fresh set every time. They change with your destinations and dates.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 26 }}>
        <div className="kform-rule" style={{ padding: 0 }}>
          <div className="kform-label">Anything else? I read it all</div>
          <div className="kform-foot-spacer" />
          <div className="kform-mono" style={{ whiteSpace: "nowrap" }}>
            {note.length} / {MAX_NOTE}
          </div>
        </div>
        <textarea
          className="kform-textarea"
          rows={4}
          value={note}
          maxLength={MAX_NOTE}
          placeholder="e.g. we're vegetarian, one of us hates crowds, I want one splurge dinner and the rest cheap and cheerful…"
          onChange={(e) => dispatch(setSpecialRequests(e.target.value.slice(0, MAX_NOTE)))}
        />
      </div>
    </div>
  );
};

export default StepVibe;
