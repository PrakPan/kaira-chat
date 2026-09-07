import { useDispatch, useSelector } from "react-redux";
import {
  setAddFlights,
  setAddHotels,
  setAddInclusions,
  setGroupType,
  setNumberOfAdults,
  setNumberOfChildren,
  setNumberOfInfants,
  setRoomConfiguration,
  setSubmitSecondSlide,
} from "../../../store/actions/slideOneActions";
import Stepper from "./Stepper";
import {
  IconBed,
  IconHeart,
  IconHome,
  IconPlane,
  IconTicket,
  IconUser,
  IconUsers,
} from "./icons";

// Sensible starting counts per group; the Friends / Family panels let the
// user adjust them.
const GROUPS = [
  { key: "Solo", sub: "Just you", Icon: IconUser, adults: 1, children: 0, infants: 0 },
  { key: "Couple", sub: "Two of you", Icon: IconHeart, adults: 2, children: 0, infants: 0 },
  { key: "Friends", sub: "The group chat", Icon: IconUsers, adults: 4, children: 0, infants: 0 },
  { key: "Family", sub: "Kids or parents along", Icon: IconHome, adults: 2, children: 1, infants: 0 },
];

const MAX_PAX = 16;

export const travellerSummary = (s) => {
  const n = (s?.numberOfAdults || 0) + (s?.numberOfChildren || 0) + (s?.numberOfInfants || 0);
  return `${n} traveller${n === 1 ? "" : "s"}`;
};

/**
 * Step 3 — "Who's coming?": group type, traveller counts, and what Kaira
 * should handle (stays / flights / activities & transfers). All state is the
 * existing `slideThree` Redux slice.
 */
const StepGroup = ({ fromName, firstCity }) => {
  const dispatch = useDispatch();
  const s = useSelector((state) => state.tailoredInfoReducer.slideThree);
  const { groupType, numberOfAdults, numberOfChildren, numberOfInfants } = s;

  const pushRooms = (adults, children, infants) =>
    dispatch(
      setRoomConfiguration([
        {
          adults,
          children,
          infants,
          childAges: Array.from({ length: children }, () => 10),
        },
      ]),
    );

  const pickGroup = (g) => {
    dispatch(setGroupType(g.key));
    dispatch(setNumberOfAdults(g.adults));
    dispatch(setNumberOfChildren(g.children));
    dispatch(setNumberOfInfants(g.infants));
    pushRooms(g.adults, g.children, g.infants);
    dispatch(setSubmitSecondSlide(true));
  };

  const bump = (which, value) => {
    const next = {
      adults: numberOfAdults,
      children: numberOfChildren,
      infants: numberOfInfants,
      [which]: value,
    };
    if (which === "adults") dispatch(setNumberOfAdults(value));
    if (which === "children") dispatch(setNumberOfChildren(value));
    if (which === "infants") dispatch(setNumberOfInfants(value));
    pushRooms(next.adults, next.children, next.infants);
  };

  const showCounts = groupType === "Friends" || groupType === "Family";
  const hasKids = numberOfChildren + numberOfInfants > 0;

  const toggles = [
    {
      key: "stay",
      Icon: IconBed,
      title: "Stays",
      desc: hasKids
        ? "Hand-picked hotels, family rooms where the kids fit"
        : "Hand-picked hotels in every city, hold before you pay",
      on: !!s.addHotels,
      set: (v) => dispatch(setAddHotels(v)),
    },
    {
      key: "fly",
      Icon: IconPlane,
      title: "Flights",
      desc: `${fromName || "Home"} → ${firstCity || "your first stop"} return, plus the legs between cities`,
      on: !!s.addFlights,
      set: (v) => dispatch(setAddFlights(v)),
    },
    {
      key: "act",
      Icon: IconTicket,
      title: "Activities & transfers",
      desc: "Day-by-day plans, tickets, and every airport pickup",
      on: !!s.addInclusions,
      set: (v) => dispatch(setAddInclusions(v)),
    },
  ];

  return (
    <div className="kform-step kform-step--group">
      <h1 className="kform-h1">
        Who's <span className="kform-serif">coming</span>?
      </h1>
      <p className="kform-lead" style={{ marginBottom: 26 }}>
        And what should I take off your plate? I price everything
        transparently, component by component.
      </p>

      <div className="kform-rule" style={{ paddingBottom: 10 }}>
        <div className="kform-label">Group</div>
        <div className="kform-rule-line" />
        <div className="kform-rule-right">{travellerSummary(s)}</div>
      </div>

      <div className="kform-groups">
        {GROUPS.map((g) => (
          <button
            key={g.key}
            type="button"
            className={`kform-group${groupType === g.key ? " is-on" : ""}`}
            onClick={() => pickGroup(g)}
          >
            <g.Icon size={20} />
            <div>
              <div className="kform-group-name">{g.key}</div>
              <div className="kform-group-sub">{g.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {showCounts && (
        <div className="kform-counts">
          <div className="kform-count-row">
            <div className="kform-soft-body">
              <div className="kform-soft-title">Adults</div>
              <div className="kform-soft-sub">Ages 13 or above</div>
            </div>
            <Stepper mono value={numberOfAdults} min={1} max={MAX_PAX} onChange={(v) => bump("adults", v)} />
          </div>
          <div className="kform-count-row">
            <div className="kform-soft-body">
              <div className="kform-soft-title">Children</div>
              <div className="kform-soft-sub">Ages 2 to 12</div>
            </div>
            <Stepper mono value={numberOfChildren} min={0} max={MAX_PAX} onChange={(v) => bump("children", v)} />
          </div>
          <div className="kform-count-row">
            <div className="kform-soft-body">
              <div className="kform-soft-title">Infants</div>
              <div className="kform-soft-sub">Under 2, lap seats</div>
            </div>
            <Stepper mono value={numberOfInfants} min={0} max={MAX_PAX} onChange={(v) => bump("infants", v)} />
          </div>
          {numberOfInfants > 0 && (
            <div className="kform-count-note">
              Infants ride free on trains. I'll still flag lap-seat rules on flights.
            </div>
          )}
        </div>
      )}

      <div className="kform-label kform-section-label">I'll handle</div>
      <div className="kform-list-card">
        {toggles.map((t) => (
          <div className="kform-list-row" key={t.key}>
            <t.Icon size={18} />
            <div className="kform-soft-body">
              <div className="kform-soft-title">{t.title}</div>
              <div className="kform-soft-sub">{t.desc}</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={t.on}
              aria-label={t.title}
              className={`kform-toggle${t.on ? " is-on" : ""}`}
              onClick={() => t.set(!t.on)}
            >
              <span />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepGroup;
