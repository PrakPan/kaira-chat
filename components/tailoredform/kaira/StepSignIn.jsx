// Step 5 — "Sign in", shown only to a logged-out traveller on a phone.
//
// This used to be a modal raised over the finished form. On a phone the form is
// itself a bottom sheet, so the sign-in card came up as a second sheet on top of
// the first: two stacked panels, two backdrops, two things listening for the
// keyboard, and a close button on each that dismissed a different amount of the
// flow. Making it a step instead means the reader is in one surface the whole
// way and Back behaves the way it does everywhere else. (Desktop keeps the
// popup — see the note by STEP_NAMES in ../Index.js.)
//
// It is a step like the others, not an exception to them: the Kaira header and
// the progress strip stay above it, and its action goes in the same footer bar
// that carries Continue everywhere else. That last part is what `submitSlot`
// does — the OTP card's "Send OTP" is portaled into the footer instead of
// sitting halfway up the panel, which is both where a reader looks for it and
// out of the way of the keyboard.
//
// The card itself is the app's real OTP card, `bare` (no avatar gutter, no
// border, no max-width) so it fills the step. Nothing about the auth flow
// changes — same thunks, same reCAPTCHA, same funnel events — only where two of
// its pieces are drawn.
//
// No `kform-h1` above it, unlike the other steps: the card opens with its own
// title, subtitle and list of what an account gets you, and a step heading over
// that is the same sentence said twice.

import OtpCard from "../../bot-components/components/IntakeForm/OtpCard";

const StepSignIn = ({ destName, onVerified, onSkip, itineraryId, submitSlot }) => (
  <div className="kform-step kform-step--signin">
    <div className="kform-signin">
      <OtpCard
        bare
        heading="Sign in to continue"
        title={
          destName ? `Sign In to get your ${destName} plan` : "Sign In to Continue"
        }
        submitLabel="Send OTP"
        itineraryId={itineraryId}
        onVerified={onVerified}
        onSkip={onSkip}
        submitSlot={submitSlot}
        submitClassName="kform-cta kform-cta--signin"
      />
    </div>
  </div>
);

export default StepSignIn;
