// Step 5 — "Sign in", shown only to a logged-out traveller.
//
// This used to be a modal raised over the finished form. On a phone the form is
// itself a bottom sheet, so the sign-in card came up as a second sheet on top of
// the first: two stacked panels, two backdrops, two things listening for the
// keyboard, and a close button on each that dismissed a different amount of the
// flow. Making it a step instead means the reader is in one surface the whole
// way, the progress strip tells them how much is left, and Back behaves the way
// it does on every other step.
//
// The card is the app's real OTP card, `bare` (no avatar gutter, no border, no
// max-width) so it fills this step rather than floating inside it. Nothing about
// the auth flow changes — same thunks, same reCAPTCHA, same skip link — only
// where it is drawn.
//
// No `kform-h1` above it, unlike every other step: the card opens with its own
// title, subtitle and list of what an account gets you. A step heading over that
// is the same sentence said twice.

import OtpCard from "../../bot-components/components/IntakeForm/OtpCard";

const StepSignIn = ({ destName, onVerified, onSkip, itineraryId }) => (
  <div className="kform-step">
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
      />
    </div>
  </div>
);

export default StepSignIn;
