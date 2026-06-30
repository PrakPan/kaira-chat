import { useRouter } from "next/router";

/*
 * Section-ending CTA.
 * A small "END OF · SECTION" label, an editorial heading with an
 * italic-serif accent, and an outlined pill button with a circular arrow.
 * All instances route to the intake chat by default.
 */

const SectionCta = ({ label, heading, accent, ctaLabel, href = "/chat?intake=1", marginTop="0px" }) => {
  const router = useRouter();

  return (
    <section style={{ padding: "8px 0 0" }}>
      <div
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          marginTop: marginTop,
          textAlign: "center",
          padding: "0 28px 40px",
          borderBottom: "1px solid var(--ttw-line, #ececec)",
        }}
      >
        {/* <div
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ttw-ink-4, #8a93a6)",
            marginBottom: "14px",
          }}
        >
          {label}
        </div>

        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            margin: "0 0 24px 0",
            color: "var(--ttw-ink, #0b1220)",
          }}
        >
          {heading} {accent && <span className="ttwSerif">{accent}</span>}
        </h2> */}

        <button
          type="button"
          onClick={() => router.push(href)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 10px 10px 22px",
            background: "var(--ttw-bg, #ffffff)",
            color: "var(--ttw-ink, #0b1220)",
            border: "1px solid var(--ttw-line, #ececec)",
            borderRadius: "999px",
            fontFamily: "inherit",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {ctaLabel}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "var(--ttw-ink-rail, #0f1a2e)",
              color: "#fff",
            }}
          >
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
          </span>
        </button>
      </div>
    </section>
  );
};

export default SectionCta;
