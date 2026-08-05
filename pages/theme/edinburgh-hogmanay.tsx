// pages/theme/edinburgh-hogmanay.tsx
//
// Edinburgh Hogmanay — the editorial, cinematic theme landing (the "Edinburgh
// Hogmanay" mockup) built from the reusable CinematicThemeLanding component.
// Reuses the existing edinburgh-hogmanay-2026 CloudFront imagery. Every image
// is auto-optimised at the edge via the component's SkeletonImage
// (optimizedMediaUrl). Cards seed a fresh /chat prompt with Kaira, except the
// "Which new year is yours?" trips, which open their existing itineraries.

import Head from "next/head";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import * as authaction from "../../store/actions/auth";
import CinematicThemeLanding from "../../components/theme/cinematic/CinematicThemeLanding";
import { useSeedChat } from "../../components/theme/cinematic/useSeedChat";
import ActivityDetailsDrawer from "../../components/drawers/activityDetails/ActivityDetailsDrawer";
import type { CinematicThemeConfig } from "../../components/theme/cinematic/types";

const IMG =
  "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026";

// Current on-site imagery (reused as-is; the edge optimiser handles resizing).
const PIC = {
  torchlight: `${IMG}/Dec 29 --The Torchlight March.jpg`,
  concert: `${IMG}/Dec 30 -- Night Afore Concert.png`,
  streetParty: `${IMG}/Dec 31 -- Street Party and Midnight Fireworks.jpg`,
  firstFootin: `${IMG}/Jan 1 -- First Footin Free Day.png`,
  beyond: `${IMG}/Edinburgh -- Beyond the Festival.jpg`,
  highlands: `${IMG}/Scottish Highlands -- Drive After.jpg`,
  london: `${IMG}/London Before Edinburgh.jpg`,
  lochLomond: `${IMG}/Loch Lomond -- Half Day Away.jpg`,
  castleDawn: `${IMG}/Edinburgh Castle at Dawn.jpg`,
  whisky: `${IMG}/Scotch Whisky -- Learn It Here.jpg`,
  arthursSeat: `${IMG}/Arthur's Seat -- Climb It.jpg`,
  royalMile: `${IMG}/Royal Mile -- Walk It Properly.jpg`,
};

// TODO(images): the "Which ticket you actually need" cards should show the real
// activity photos from the site. Awaiting the four public image URLs — using the
// closest existing Edinburgh assets as stand-ins until then.
const TICKET_IMG = {
  spectacle: PIC.streetParty,
  harryPotter: PIC.castleDawn,
  concert: PIC.concert,
  ceilidh: PIC.beyond,
};

const CHAT = "https://thetarzanway.com/chat";

// Catalog activity ids for the "Which ticket you actually need" cards (from the
// Mercury BE links). Concert & Ceilidh point at the Spectacle activity until
// their own catalog entries are added on the site.
const ACTIVITY = {
  spectacle: "26a51d8d-1629-476a-b7f1-cb4155f3d229",
  harryPotter: "05f6127d-96d9-42f5-bc17-d9ae6e7c8ced",
  concert: "26a51d8d-1629-476a-b7f1-cb4155f3d229",
  ceilidh: "26a51d8d-1629-476a-b7f1-cb4155f3d229",
};

// ── Prompts ─────────────────────────────────────────────────────────────────
const PROMPTS = {
  // Hero chips (verbatim from the campaign brief)
  scottishTraditions:
    "We are 2 travellers, and our travel dates are flexible. We want to experience Hogmanay the traditional Scottish way. Prioritize the Torchlight Procession, ceilidh dancing, Auld Lang Syne celebrations, first-footing traditions, local pubs, whisky experiences, authentic Scottish food, historic streets, and cultural experiences alongside Edinburgh's New Year festivities.",
  edinburghLondon:
    "We are 2 travellers, and our travel dates are flexible. We want to celebrate New Year's in Edinburgh during Hogmanay and continue our trip to London. Include the best of Edinburgh's festive celebrations before exploring London's iconic landmarks, Christmas lights (if available), markets, museums, West End, cafés, and classic sightseeing at a comfortable pace.",
  ultimate:
    "We are 2 travellers, and our travel dates are flexible. We want the complete Hogmanay experience in Edinburgh. Prioritize the Torchlight Procession, official Street Party, Edinburgh Castle fireworks, Scottish traditions, festive markets, local food, historic pubs, and the city's best winter experiences. Build an itinerary that lets us experience every major Hogmanay highlight while balancing sightseeing and free time.",
  castlesWhisky:
    "We are 2 travellers, and our travel dates are flexible. We want to experience Scotland's historic castles, whisky culture, and Hogmanay celebrations in one trip. Include Edinburgh Castle, local whisky tastings, historic towns, scenic viewpoints, traditional pubs, and iconic Scottish experiences.",
  // Programme — "Four days, hour by hour" (verbatim)
  progLondon:
    "We are 2 travellers, and our travel dates are flexible. We want to celebrate Hogmanay in Edinburgh before continuing to London. Include Edinburgh's New Year celebrations, iconic landmarks, scenic train travel, London's famous attractions, cozy winter cafés, markets, museums, and enough free time to enjoy both cities at a relaxed pace.",
  progTorchlight:
    "We are 2 travellers, and our travel dates are flexible. We want to experience Edinburgh's famous Torchlight Procession during Hogmanay. Build our itinerary around the procession, historic Old Town, festive markets, cozy pubs, Scottish traditions, and enough free time to soak in the city's magical winter atmosphere.",
  progStreetParty:
    "We are 2 travellers, and our travel dates are flexible. We want the ultimate Edinburgh Hogmanay celebration. Prioritize the official Street Party, Edinburgh Castle fireworks, live music stages, midnight celebrations, Auld Lang Syne, and the city's best festive experiences while balancing sightseeing before and after New Year's Eve.",
  progLoonyDook:
    "We are 2 travellers, and our travel dates are flexible. We want to experience the fun side of Hogmanay, including the famous Loony Dook. Combine Edinburgh's New Year celebrations with quirky local traditions, scenic winter walks, cozy cafés, and authentic Scottish experiences for a memorable trip.",
  // Daylight
  arthursSeat:
    "I want to climb Arthur's Seat at sunrise on one of my Hogmanay days — the ancient volcano in the middle of Edinburgh. Tell me the easiest route from the Old Town, how long it takes, what the view over the city and the Firth of Forth looks like in early winter, and the best time for the light.",
  edinburghCastle:
    "I want to visit Edinburgh Castle properly on a pre-festival day. Tell me the opening time in late December, what's genuinely worth seeing inside — the Crown Jewels, the Stone of Destiny, the One O'Clock Gun — and how it deepens watching the New Year fireworks launch from its walls. Build it into a full Old Town day.",
  lochNessGlencoe:
    "I want a day trip from Edinburgh into the Highlands around Hogmanay — Loch Ness and Glencoe in winter. Tell me honestly what the drive is like in early January, what the landscape looks like under snow, whether I need a car or can join a tour, and how long the day runs.",
  speyside:
    "I want to spend a day on a Speyside whisky run from Edinburgh — the distilleries worth visiting, what the difference between a Speyside, Islay and Highland malt actually tastes like, and whether it's better as a guided tour or self-drive. Build it into my trip around the festival.",
  // Ask-bar comparison
  askBar:
    "Which Edinburgh Hogmanay plan should I do — all four festival nights, New Year in the Highlands, a calmer Hogmanay without the street party, or Edinburgh plus London? Compare the atmosphere, cost, and effort, then build the full itinerary for the one you recommend.",
};

const edinburghHogmanayConfig: CinematicThemeConfig = {
  header: {
    title: "Edinburgh Hogmanay",
    subtitle: "Theme · 29 Dec – 2 Jan",
  },
  hero: {
    eyebrow: "THREE NIGHTS · 75,000 PEOPLE · ONE CASTLE",
    heading: { lead: "The world's", accent: "loudest new year" },
    lede:
      "Edinburgh throws the planet's biggest New Year — the Torchlight Procession, the Street Party, fireworks off the Castle, and a whole city singing Auld Lang Syne. Tell me your dates and I'll lock the tickets and rooms in the right order.",
    placeholder: "Try: Hogmanay for four friends, five nights",
    prompt: PROMPTS.ultimate,
    chips: [
      { label: "Scottish traditions", prompt: PROMPTS.scottishTraditions },
      { label: "Edinburgh + London", prompt: PROMPTS.edinburghLondon },
      { label: "Ultimate Hogmanay", prompt: PROMPTS.ultimate },
      { label: "Castles & whisky", prompt: PROMPTS.castlesWhisky },
    ],
    // Desktop-only Kaira polaroid collage.
    images: [
      { image: PIC.torchlight, caption: "Dec 29, Torchlight" },
      { image: PIC.streetParty, caption: "Dec 31, The Bells" },
      { image: PIC.castleDawn, caption: "Edinburgh Castle" },
      { image: PIC.firstFootin, caption: "Jan 1, First Footin" },
    ],
  },
  sections: [
    // ── Programme — "Four days, hour by hour" (seed prompts) ──
    {
      type: "cards",
      heading: { lead: "Four days,", accent: "hour by hour" },
      cards: [
        {
          image: PIC.torchlight,
          name: "The Torchlight Procession",
          line: "20,000 torches through the Old Town.",
          tag: "Dec 29",
          prompt: PROMPTS.progTorchlight,
        },
        {
          image: PIC.streetParty,
          name: "Street Party & The Bells",
          line: "Princes Street, fireworks, midnight.",
          tag: "Dec 31",
          prompt: PROMPTS.progStreetParty,
        },
        {
          image: PIC.firstFootin,
          name: "The Loony Dook",
          line: "The quirky side of a Scottish new year.",
          tag: "Jan 1",
          prompt: PROMPTS.progLoonyDook,
        },
        {
          image: PIC.london,
          name: "London + Edinburgh",
          line: "Two cities, one festive trip.",
          tag: "Two cities",
          prompt: PROMPTS.progLondon,
        },
      ],
    },
    // ── Tickets — "Which ticket you actually need" ──
    // Each card opens the read-only activity details drawer via its catalog id
    // (from the Mercury BE links). Concert & Ceilidh reuse the Spectacle id
    // until their own activities are published on the site.
    {
      type: "cards",
      heading: { lead: "Which ticket you", accent: "actually need" },
      cards: [
        {
          image: TICKET_IMG.spectacle,
          name: "Hogmanay New Year Spectacle",
          line: "The official Street Party + Castle fireworks.",
          tag: "Kaira's pick",
          activityId: ACTIVITY.spectacle,
        },
        {
          image: TICKET_IMG.harryPotter,
          name: "Harry Potter & Castle Tour",
          line: "The Potter trail plus Edinburgh Castle.",
          tag: "Day tour",
          activityId: ACTIVITY.harryPotter,
        },
        {
          image: TICKET_IMG.concert,
          name: "Concert in the Gardens",
          line: "Live music under the Castle on the bells.",
          tag: "Dec 31",
          activityId: ACTIVITY.concert,
        },
        {
          image: TICKET_IMG.ceilidh,
          name: "Ceilidh under the Castle",
          line: "Proper Scottish dancing into the new year.",
          tag: "Dec 31",
          activityId: ACTIVITY.ceilidh,
        },
      ],
    },
    // ── The bit that's actually Scottish (dark) ──
    {
      type: "checklist",
      heading: { lead: "The bit that's actually", accent: "Scottish" },
      rows: [
        {
          emoji: "🔥",
          name: "Torchlight Procession",
          meta: "Dec 29 · 20,000 torches",
          prompt: PROMPTS.progTorchlight,
        },
        {
          emoji: "🕺",
          name: "Ceilidh dancing",
          meta: "Old-school Scottish dancing",
          prompt: PROMPTS.scottishTraditions,
        },
        {
          emoji: "🎶",
          name: "Auld Lang Syne",
          meta: "The midnight anthem, by Burns",
          prompt: PROMPTS.scottishTraditions,
        },
        {
          emoji: "🥶",
          name: "The Loony Dook",
          meta: "Jan 1 · into the Firth of Forth",
          prompt: PROMPTS.progLoonyDook,
        },
      ],
    },
    // ── Trips — "Which new year is yours?" (open existing itineraries) ──
    {
      type: "trips",
      heading: {
        lead: "Which new year is",
        accent: "yours?",
        note: "Tap a plan to open the full itinerary",
      },
      cards: [
        {
          image: PIC.streetParty,
          tag: "The full festival",
          name: "Hogmanay, all four nights",
          line: "Torchlight to First Footin — the complete run.",
          nights: "Dec 29 – Jan 1",
          href: `${CHAT}/a376fdc1-6fba-4e9d-a6f6-07d96f9f74d5`,
        },
        {
          image: PIC.highlands,
          tag: "Highlands",
          name: "New Year's the Highland way",
          line: "The Bells in the city, then north into the snow.",
          nights: "NYE + Highland drive",
          href: `${CHAT}/a57add01-f613-4c99-a24b-aa2528ddc2ea`,
        },
        {
          image: PIC.beyond,
          tag: "Calmer",
          name: "The calmer Hogmanay",
          line: "All the magic, minus the 75,000-strong crowd.",
          nights: "No street party",
          href: `${CHAT}/796881b5-9dc0-4860-820c-52d26c0d6782`,
        },
        {
          image: PIC.london,
          tag: "Two cities",
          name: "Edinburgh + London",
          line: "New Year up north, then south by train.",
          nights: "Two cities",
          prompt: PROMPTS.edinburghLondon,
        },
      ],
    },
    // ── Daylight — "What to do with the daylight" (seed prompts) ──
    {
      type: "cards",
      heading: { lead: "What to do with", accent: "the daylight" },
      cards: [
        {
          image: PIC.arthursSeat,
          name: "Arthur's Seat at sunrise",
          line: "The volcano over the city. 45 minutes up.",
          tag: "Sunrise",
          prompt: PROMPTS.arthursSeat,
        },
        {
          image: PIC.castleDawn,
          name: "Edinburgh Castle",
          line: "The Crown Jewels, before the crowds.",
          tag: "Half day",
          prompt: PROMPTS.edinburghCastle,
        },
        {
          image: PIC.highlands,
          name: "Loch Ness & Glencoe",
          line: "The Highlands under winter snow.",
          tag: "Day trip",
          prompt: PROMPTS.lochNessGlencoe,
        },
        {
          image: PIC.whisky,
          name: "Speyside whisky run",
          line: "The distilleries worth the drive.",
          tag: "Day trip",
          prompt: PROMPTS.speyside,
        },
      ],
    },
    // ── Booking timeline — "When to book what" ──
    {
      type: "months",
      heading: {
        eyebrow: "Everything is a queue · here's the order",
        lead: "When to",
        accent: "book what",
      },
      rows: [
        {
          range: "By now",
          name: "Street Party tickets",
          line: "The Bells sells out first — lock these before anything else.",
        },
        {
          range: "Sep–Oct",
          name: "Old Town rooms",
          line: "A bed inside the cordon books out months ahead.",
        },
        {
          range: "Oct",
          name: "Torchlight tickets",
          line: "The Dec 29 procession is cheaper, but still caps out.",
        },
        {
          range: "6–8 wks",
          name: "Flights from India",
          line: "Late-December fares climb fast; book by early November.",
        },
      ],
      note:
        "Rooms and tickets move together. A bed inside the cordon with no Street Party ticket is a wasted trip; the reverse means a 2am walk to Leith. I hold both or neither.",
    },
    // ── Read this first (light, compact) ──
    {
      type: "list",
      compact: true,
      heading: {
        eyebrow: "The four things people get wrong",
        lead: "Read this",
        accent: "first",
      },
      rows: [
        {
          emoji: "❄️",
          gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
          name: "It's cold, wet and windy",
          line: "Layers, waterproofs, real shoes. The energy makes up for it.",
        },
        {
          emoji: "🎇",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 170%)",
          name: "The Bells isn't the whole thing",
          line: "Four days of events — midnight is just one of them.",
        },
        {
          emoji: "⏳",
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          name: "Everything is a queue",
          line: "Tickets, rooms and flights sell in a set order. Book early.",
        },
        {
          emoji: "🌅",
          gradient: "linear-gradient(150deg, #1a2436, #445069)",
          name: "Jan 1 the city is quiet",
          line: "First-footing and a slow recovery — plan a gentle day.",
        },
      ],
    },
    // ── Stories ──
    {
      type: "stories",
      heading: { eyebrow: "Came back · rated it", lead: "People who", accent: "went" },
      cards: [
        {
          rating: "5.0",
          type: "Couple · 5N",
          name: "“Midnight under the Castle — nothing comes close.”",
          route: "Street Party + Highlands",
          prompt: PROMPTS.progStreetParty,
        },
        {
          rating: "4.9",
          type: "Group of 6",
          name: "“Sorted our tickets and rooms before they vanished.”",
          route: "All four nights",
          prompt: PROMPTS.ultimate,
        },
        {
          rating: "4.8",
          type: "Couple · 8N",
          name: "“Edinburgh then London — two cities, one trip.”",
          route: "Edinburgh → London",
          prompt: PROMPTS.edinburghLondon,
        },
      ],
    },
    // ── Other themes ──
    {
      type: "gradient",
      heading: {
        eyebrow: "Other themes",
        lead: "New year elsewhere?",
        accent: "Try these",
      },
      columns: 4,
      cards: [
        {
          name: "Christmas markets",
          meta: "Nov – Jan",
          emoji: "🎄",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 150%)",
          href: "/theme/christmas-markets",
        },
        {
          name: "Lapland with Santa",
          meta: "Dec",
          emoji: "🦌",
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          href: "/theme/lapland",
        },
        {
          name: "Northern lights",
          meta: "Nov – Mar",
          emoji: "🌌",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          href: "/theme/northern-lights",
        },
        {
          name: "Filmy getaways",
          meta: "Year-round",
          emoji: "🎬",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 180%)",
          href: "/theme/filmy-getaways",
        },
      ],
    },
    // ── Destinations ──
    {
      type: "gradient",
      heading: { eyebrow: "Destinations", lead: "Where I", accent: "send people" },
      columns: 6,
      mobileGrid: true,
      cards: [
        {
          name: "Edinburgh",
          meta: "The festival",
          emoji: "🏰",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          prompt: PROMPTS.ultimate,
        },
        {
          name: "Scottish Highlands",
          meta: "Glencoe · Skye",
          emoji: "🏔️",
          gradient: "linear-gradient(150deg, #16324f, #445069)",
          prompt: PROMPTS.lochNessGlencoe,
        },
        {
          name: "London",
          meta: "Add-on",
          emoji: "🎡",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 180%)",
          prompt: PROMPTS.edinburghLondon,
        },
        {
          name: "Speyside",
          meta: "Whisky country",
          emoji: "🥃",
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          prompt: PROMPTS.speyside,
        },
      ],
      footerCta: { label: "View all destinations", href: "/europe" },
    },
    // ── How it works (dark) ──
    {
      type: "steps",
      heading: {
        eyebrow: "No markups · pay only for what you book",
        lead: "Sketch it. I'll",
        accent: "finish it.",
      },
      steps: [
        { n: "1", title: "Tell me your dates", sub: "and who's coming." },
        { n: "2", title: "I lock tickets + rooms", sub: "in the right order." },
        { n: "3", title: "You book", sub: "only what you love." },
      ],
      cta: { label: "Start planning", prompt: PROMPTS.ultimate },
      note: "10,000+ trips · rated 4.9 across all of them",
    },
  ],
  askBar: {
    placeholder: "Ask me about Hogmanay…",
    cta: "Ask Kaira",
    prompt: PROMPTS.askBar,
  },
};

// A sensible default start date for the read-only activity drawer — ~60 days
// out, in DD/MM/YYYY (the format the detail endpoint expects). The drawer only
// shows details/indicative pricing here; the visitor picks real dates in chat.
const defaultActivityDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
};

const EdinburghHogmanayThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  const seedChat = useSeedChat();
  // Read-only activity details drawer (opened from the "Which ticket you
  // actually need" cards).
  const [activityDrawer, setActivityDrawer] = useState<{
    show: boolean;
    activityId?: string;
    source?: string;
    date?: string;
  }>({ show: false });

  const openActivity = (activityId: string, source?: string) =>
    setActivityDrawer({
      show: true,
      activityId,
      source,
      date: defaultActivityDate(),
    });
  const closeActivity = () =>
    setActivityDrawer((prev) => ({ ...prev, show: false }));

  useEffect(() => {
    checkAuthState();
  }, []);

  return (
    <Layout page="Theme Page" slug="edinburgh-hogmanay">
      <Head>
        <title>
          Edinburgh Hogmanay 2026/27 | Trip Planner & Itinerary | The Tarzan Way
        </title>
        <meta
          name="description"
          content="Plan your Edinburgh Hogmanay 2026/27 trip with The Tarzan Way's AI itinerary. Torchlight Procession, Street Party, midnight fireworks, and January 1 First Footin — plus the Highlands, London, and Scotland for Indian travellers."
        />
        <meta
          property="og:title"
          content="Edinburgh Hogmanay 2026/27 | Trip Planner & Itinerary | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Plan your Edinburgh Hogmanay 2026/27 trip with The Tarzan Way's AI itinerary. Torchlight Procession, Street Party, midnight fireworks, and January 1 First Footin — plus the Highlands, London, and Scotland for Indian travellers."
        />
        <link
          rel="canonical"
          href="https://thetarzanway.com/theme/edinburgh-hogmanay"
        />
        <meta
          property="og:url"
          content="https://thetarzanway.com/theme/edinburgh-hogmanay"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://thetarzanway.com/og-image.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "TouristTrip",
                  name: "Edinburgh Hogmanay 2026/27 — Trip Planner",
                  description:
                    "Plan your Edinburgh Hogmanay 2026/27 trip with The Tarzan Way's AI itinerary. Torchlight Procession, Street Party, midnight fireworks, and January 1 First Footin — plus the Highlands, London, and Scotland for Indian travellers.",
                  url: "https://thetarzanway.com/theme/edinburgh-hogmanay",
                  image: "https://thetarzanway.com/og-image.png",
                  provider: {
                    "@type": "TravelAgency",
                    name: "The Tarzan Way",
                    url: "https://thetarzanway.com",
                  },
                },
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: "https://thetarzanway.com",
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: "Edinburgh Hogmanay",
                      item: "https://thetarzanway.com/theme/edinburgh-hogmanay",
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </Head>
      <CinematicThemeLanding
        config={edinburghHogmanayConfig}
        onSelectPrompt={seedChat}
        onSelectActivity={openActivity}
      />
      {/* Read-only activity details — no Add/Remove CTA on this marketing page */}
      <ActivityDetailsDrawer
        show={activityDrawer.show}
        activityId={activityDrawer.activityId}
        source={activityDrawer.source}
        date={activityDrawer.date}
        hideCta
        handleCloseDrawer={closeActivity}
        setShowDrawer={closeActivity}
      />
    </Layout>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(EdinburghHogmanayThemePage);
