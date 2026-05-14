import { useRouter } from "next/router";
import { KairaAvatar } from "./HeroSection";

/*
 * Final CTA — "So, where are we going?"
 * Optional props let the same component be reused in other landing pages.
 */

const CtaBoardingSection = ({
  title,
  body,
  ctaLabel = "Chat with Kaira",
  ctaHref = "/chat",
  trustLine = "Since 2018 · Based in India · Built for the world",
}) => {
  const router = useRouter();

  return (
    <section
      style={{
        padding: "80px 0 100px",
        background:
          "radial-gradient(ellipse 600px 300px at 50% 100%, var(--ttw-peach, #ffede0) 0%, transparent 70%), var(--ttw-bg-2, #fafaf5)",
      }}
    >
      <div
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          textAlign: "center",
          padding: "0 28px",
        }}
      >
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <KairaAvatar size="sm" minimal />
        </div>

        <h2
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.035em",
            margin: "0 0 16px 0",
            color: "var(--ttw-ink, #0b1220)",
          }}
        >
          {title || (
            <>
              So, where are <span className="ttwSerif">we going?</span>
            </>
          )}
        </h2>

        <p
          style={{
            fontSize: "17px",
            color: "var(--ttw-ink-3, #445069)",
            marginBottom: "32px",
            maxWidth: "500px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {body || "Start the conversation — no sign-up, no card, no commitment."}
        </p>

        <button
          type="button"
          className="ttwCtaPrimary"
          onClick={() => router.push(ctaHref)}
        >
          {ctaLabel}
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

        <div
          style={{
            marginTop: "22px",
            fontSize: "12.5px",
            color: "var(--ttw-ink-4, #8a93a6)",
          }}
        >
          {trustLine}
        </div>
      </div>
    </section>
  );
};

export default CtaBoardingSection;
