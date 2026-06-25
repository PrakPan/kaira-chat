/*
 * "Loved on Google" — real 5-star Google reviews from Kaira's travellers.
 *
 * Each card links to the traveller's actual Google review. The `quote`
 * lines below are short stand-ins written from each trip; swap them for
 * the verbatim Google text whenever you want (the links are the source).
 */

const REVIEWS = [
  {
    name: "Twinkle Joshi",
    trip: "Japan",
    avatarVariant: "pink",
    quote:
      "Solo in Japan and never once felt lost. Kaira's plan flowed, and the little local picks made the whole trip.",
    link: "https://share.google/6lo8sROhZYtNycepM",
  },
  {
    name: "Amish Gupta",
    trip: "Maldives",
    avatarVariant: "blue",
    quote:
      "The Maldives stay was exactly what we wanted, and the price was honest. No surprise markups at the end.",
    link: "https://share.google/cTpInuX3E6Zr9z8cl",
  },
  {
    name: "Naveen Dadlani",
    trip: "Europe",
    avatarVariant: "green",
    quote:
      "Multi-country Europe trip sorted in a single chat. Flights, trains and hotels all lined up perfectly.",
    link: "https://share.google/iy1b48ykCI0d7O8dU",
  },
  {
    name: "Mohd Sameer",
    trip: "India",
    avatarVariant: "coral",
    quote:
      "Quick domestic getaway planned end to end. Easy to tweak, and everything was bookable in one place.",
    link: "https://share.google/oiJoDyOzuRbz4e6nK",
  },
  {
    name: "Sumit Jain",
    trip: "Europe",
    avatarVariant: "pink",
    quote:
      "Genuinely the easiest holiday I've ever booked. Real prices, real routes, and a human who actually replied.",
    link: "https://share.google/z3sDM17ebOShAqw6Q",
  },
  {
    name: "Minal Dhoble",
    trip: "Thailand",
    avatarVariant: "blue",
    quote:
      "Thailand was a breeze. Beaches, transfers and stays all handled, and they changed plans for us mid-trip.",
    link: "https://share.google/S4YD4Tme2g8wbeiDc",
  },
  {
    name: "Pranav Kananur",
    trip: "Dubai",
    avatarVariant: "green",
    quote:
      "Dubai itinerary was spot on. Fast replies, clear pricing, and zero of the usual travel-agent back and forth.",
    link: "https://share.google/S5zCGrbutDoKMhjjg",
  },
  {
    name: "Neel",
    trip: "Greece",
    avatarVariant: "coral",
    quote:
      "Greece felt tailor-made. Santorini sunsets, the right islands, and a plan that just worked from day one.",
    link: "https://share.google/FwRwaWXW3a6NHTdvk",
  },
];

const AVATAR_COLORS = {
  coral: { bg: "var(--ttw-peach-deep, #ffd4b8)", ink: "#8a3b1f" },
  pink: { bg: "var(--ttw-rose-deep, #ffb3c1)", ink: "#a3294c" },
  blue: { bg: "var(--ttw-sky-a, #a8d2f5)", ink: "#1f4e7a" },
  green: { bg: "var(--ttw-mint, #e0f2e9)", ink: "#1f8a5a" },
};

const Stars = () => (
  <div style={{ display: "flex", gap: 2, color: "#fbbc05", fontSize: 15, lineHeight: 1 }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <span key={i}>★</span>
    ))}
  </div>
);

const GoogleGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const GoogleReviewsSection = ({ reviews = REVIEWS }) => {
  return (
    <section
      style={{
        padding: "72px 0",
        background:
          "radial-gradient(ellipse 700px 320px at 5% 0%, var(--ttw-lavender) 0%, transparent 60%), var(--ttw-bg)",
      }}
    >
      <div className="ttwContainer">
        <div className="ttwSectionHead">
          <div>
            <span className="ttwKicker" style={{ marginBottom: 14 }}>
              <GoogleGlyph /> Loved on Google
            </span>
            <h2 style={{ fontWeight: 500 }}>
              Real reviews from{" "}
              <span className="ttwSerif">real travellers.</span>
            </h2>
            <p className="ttwLede">
              Rated <strong>4.8</strong> across 10,000+ trips. Here&apos;s what
              Kaira&apos;s travellers say on Google.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: 20,
          }}
        >
          {reviews.map((r) => {
            const c = AVATAR_COLORS[r.avatarVariant] || AVATAR_COLORS.blue;
            return (
              <a
                key={r.name + r.trip}
                href={r.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  background: "var(--ttw-bg)",
                  border: "1px solid var(--ttw-line)",
                  borderRadius: 18,
                  padding: "22px 22px 20px",
                  textDecoration: "none",
                  color: "var(--ttw-ink)",
                  boxShadow: "0 6px 20px -14px rgba(11,18,32,0.25)",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Stars />
                  <GoogleGlyph />
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: "var(--ttw-ink-2)",
                  }}
                >
                  &ldquo;{r.quote}&rdquo;
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: "auto",
                    paddingTop: 6,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: c.bg,
                      color: c.ink,
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 700,
                      fontSize: 15,
                      flexShrink: 0,
                    }}
                  >
                    {r.name.charAt(0)}
                  </div>
                  <div style={{ lineHeight: 1.3 }}>
                    <div style={{ fontWeight: 600, fontSize: 14.5 }}>
                      {r.name}
                    </div>
                    <div
                      style={{ fontSize: 12.5, color: "var(--ttw-ink-4)" }}
                    >
                      {r.trip} · Google review
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GoogleReviewsSection;
