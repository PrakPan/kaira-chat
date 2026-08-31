import React from "react";
import PulseLoader from "react-spinners/PulseLoader";

// The CTA row for the Settings / Clone-itinerary popups. Styled from the same
// palette the rest of those modals use (FormUI's #E6E1D2 borders, #5C5A55 muted
// ink, #0B1220 near-black) with the yellow primary the new theme uses for its
// one confirming action everywhere else — the route action bar's Update Route,
// the trip card's CTAs. The old navy #07213A fill and the global
// MediumIndigoOutlinedButton belonged to the previous theme and read as a
// different product sitting inside this modal.
//
// Written flat rather than through components/ui/button: that one forces
// bgColor:"black" and a white spinner while `loading`, which turns a yellow CTA
// into a black one mid-submit.
//
// Border and box-shadow are inline, not utilities: styles.css:787 redefines the
// global `.border` class with its own 1px rule *and* a drop shadow, so Tailwind's
// `border` would drag that shadow in — flat is the whole point here. Inline wins
// over both without depending on stylesheet order.
const FLAT = { boxShadow: "none" };

const Buttons = (props) => {
  const label = props?.updateLabel
    ? props.updateLabel
    : props?.isEdit
      ? "Update Itinerary"
      : "Continue";

  return (
    <div className="w-full flex flex-row items-center gap-[10px]">
      {/* Cancel keeps only the width its own word needs. Splitting the row in
          half is what pushed "Update Itinerary" onto two lines on a 375px
          screen — the primary is the longer label and gets the remainder. */}
      <button
        type="button"
        onClick={props.handleCancel}
        style={{ ...FLAT, border: "1px solid #E6E1D2" }}
        className="h-[44px] max-ph:h-[42px] shrink-0 rounded-[10px] bg-white px-[18px] max-ph:px-[16px] font-inter text-[14px] font-semibold text-[#5C5A55] transition-colors hover:bg-[#F7F5EF] hover:text-[#0B1220]"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={props.handleUpdate}
        disabled={props.isLoading}
        aria-busy={props.isLoading}
        style={FLAT}
        // Explicit colours rather than `disabled:` variants — the button is only
        // ever disabled while submitting, and that state stays yellow so the row
        // doesn't change colour under the traveller's finger.
        className={`flex h-[44px] max-ph:h-[42px] min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-[10px] bg-[#F7E700] px-4 font-inter text-[14px] font-bold text-[#0B1220] transition-colors hover:bg-[#FFEF3D] active:bg-[#E5D600] ${
          props.isLoading ? "cursor-wait" : ""
        }`}
      >
        {props.isLoading ? (
          <PulseLoader size={7} color="#0B1220" speedMultiplier={0.8} />
        ) : (
          label
        )}
      </button>
    </div>
  );
};

export default Buttons;
