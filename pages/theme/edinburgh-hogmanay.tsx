// pages/theme/edinburgh-hogmanay.tsx

import { useEffect } from "react";
import Head from "next/head";
import { connect } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";
import type { ThemeConfig } from "../../components/bot-components/types/themeConfig";
import edinburghHogmanayTravellerStories from "../../data/edinburghHogmanayTravellerStories";

const edinburghHogmanayThemeConfig: ThemeConfig = {
  welcome: {
    subtitle:
      "The greatest New Year celebration on earth. Four days. One city. Plan it properly.",
    promptChips: [
      {
        icon: "🎆",
        label: "Build me the full Hogmanay trip — all 4 days",
        prompt:
          "I want to attend all 4 days of Edinburgh Hogmanay — Dec 29 Torchlight Procession, Dec 30 Night Afore Concert, Dec 31 Street Party and midnight fireworks, Jan 1 First Footin. Build me the full day-by-day itinerary, tell me which tickets to book first and how far out, where to stay near Princes Street, and the total cost per person including flights from India.",
      },
      {
        icon: "🥂",
        label: "Hogmanay for two — NYE done properly",
        prompt:
          "I want to plan Hogmanay for a couple — the Torchlight Procession on Dec 29, a New Year's Eve dinner before the Street Party, the midnight fireworks from Edinburgh Castle, and January 1 wandering the First Footin trail together. Tell me which Old Town hotel is worth booking, what the Street Party tickets cost, and build me the full 4-day festival itinerary.",
      },
      {
        icon: "🧳",
        label: "Solo Hogmanay — is it worth it?",
        prompt:
          "I want to do Hogmanay solo and I want to know honestly whether Edinburgh on New Year works alone — the Street Party, the Torchlight Procession, and especially January 1 First Footin where every door in the city is open and free. Build me the solo 4-day itinerary, tell me the best accommodation for meeting people, and what the total cost looks like at mid-range.",
      },
      {
        icon: "🇬🇧",
        label: "Hogmanay plus a UK trip",
        prompt:
          "I want to build a UK trip around Hogmanay — fly in early, see Edinburgh properly before the festival starts, do all 4 festival days, then continue to London or the Scottish Highlands. Build me the 10-day itinerary with Hogmanay as the centrepiece, how to travel between UK cities, and the total cost from India.",
      },
    ],
  },
  rows: [
    {
      heading: "The Festival, Day by Day",
      icon: "🎉",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/Dec 29 --The Torchlight March.jpg ",
          label: "Dec 29 — The Torchlight March",
          tags: "Festival · Edinburgh",
          description: "15,000 torches. One city.",
          prompt:
            "I want to join the Hogmanay Torchlight Procession on Dec 29 as a torchbearer rather than just watch. Tell me how torchbearer tickets work, what the march through the Old Town feels like from inside, where to be beforehand, and how to build the full day around it.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/Dec 30 -- Night Afore Concert.png ",
          label: "Dec 30 — Night Afore Concert",
          tags: "Concert · Outdoor",
          description: "Castle behind the stage.",
          prompt:
            "I want to go to the Night Afore Concert at the Ross Bandstand on Dec 30 with Edinburgh Castle lit behind the stage. Tell me what the concert involves, how early to arrive for a good position, whether tickets are separate from the Street Party pass, and how to spend Dec 30 in Edinburgh before the evening starts.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/Dec 31 -- Street Party and Midnight Fireworks.jpg ",
          label: "Dec 31 — Street Party and Midnight Fireworks",
          tags: "New Year's Eve · Iconic",
          description: "45,000 people. One countdown.",
          prompt:
            "I want to be on Princes Street for the Dec 31 Street Party, the Concert in the Gardens, and the midnight fireworks from Edinburgh Castle. Tell me where to stand for the best view, what time to arrive, how Auld Lang Syne works with the crowd, and the best dinner plan before the party zone opens.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/Jan 1 -- First Footin Free Day.png ",
          label: "Jan 1 — First Footin Free Day",
          tags: "Culture · Solo-Friendly",
          description: "Wander the city. Everything is free.",
          prompt:
            "I want to spend January 1 on the First Footin trail — free performances in pubs, cafes, and landmark buildings across Edinburgh with no ticket needed. Tell me which venues participate, what the Scottish First Footin tradition actually means, and how to structure the day as a solo wander through the Old Town.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/Edinburgh -- Beyond the Festival.jpg ",
          label: "Edinburgh — Beyond the Festival",
          tags: "City · History",
          description: "Old Town worth 2 extra days.",
          prompt:
            "I want to arrive 2 days before Hogmanay and explore Edinburgh properly. Build me the pre-festival days: Edinburgh Castle at opening time, Arthur's Seat, the Royal Mile, the best whisky bar in the Old Town, and where to eat before the festival crowds arrive.",
        },
      ],
    },
    {
      heading: "Beyond Hogmanay: Scotland and the UK",
      icon: "🗺️",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/Scottish Highlands -- Drive After.jpg ",
          label: "Scottish Highlands — Drive After",
          tags: "Scotland · Road Trip",
          description: "Festival ends. Highlands begin.",
          prompt:
            "I want to drive the Scottish Highlands immediately after Hogmanay — leaving Edinburgh on January 2 with a rental car and heading north. Build me the 4-day Highland route: Loch Lomond, Glencoe in winter snow, Fort William, and the Isle of Skye. Tell me honestly what the Highlands are like in January — which roads are manageable, what the landscape looks like, and why winter Glencoe is worth the risk of cold weather.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/London Before Edinburgh.jpg ",
          label: "London Before Edinburgh",
          tags: "UK · City",
          description: "Fly into London. Train north.",
          prompt:
            "I want to fly into London, spend 3 days there, and then take the train to Edinburgh for Hogmanay. Build me the London-to-Edinburgh routing: which London train station, how long the journey takes, what 3 days in London looks like before a festival trip, and whether I should fly into Heathrow or Gatwick for the best connection north. Include total cost for the London add-on.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/St Andrews -- Golf and History.jpg ",
          label: "St Andrews — Golf and History",
          tags: "Scotland · Day Trip",
          description: "45 minutes from Edinburgh.",
          prompt:
            "I want to add a day trip to St Andrews from Edinburgh on one of my pre-festival days. Tell me what St Andrews offers beyond the golf course — the ruined cathedral, the castle on the cliff, the university that is the oldest in Scotland — and how to get there from Edinburgh by train. Is a full day needed or is this a half-day trip? Build it into my Dec 27 or 28 itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/Loch Lomond -- Half Day Away.jpg ",
          label: "Loch Lomond — Half Day Away",
          tags: "Scotland · Scenic",
          description: "1 hour from Edinburgh. Stunning.",
          prompt:
            "I want to do a day trip to Loch Lomond from Edinburgh before or after Hogmanay. Tell me how to get there without a car, what the loch actually looks like in late December or early January, and which village on the shore is worth stopping in. Is this worth a full day or is it a half-day that can be combined with something else on the way back to Edinburgh?",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/York or Manchester -- On the Way Home.jpg ",
          label: "York or Manchester — On the Way Home",
          tags: "England · City",
          description: "Stop before your flight south.",
          prompt:
            "I am flying home from London after Hogmanay and I want to stop somewhere in England on the way south from Edinburgh. Tell me whether York or Manchester makes more sense for a 1 to 2 night stopover — what each city offers in early January, how long the train takes from Edinburgh, and whether either one is worth the extra nights or whether I should go straight to London for the flight.",
        },
      ],
    },
    {
      heading: "Every Kind of Hogmanay Traveller",
      icon: "🎯",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/The Solo New Year.png ",
          label: "The Solo New Year",
          tags: "Solo · Adventure",
          description: "January 1. Wander. Free.",
          prompt:
            "Build me the solo Hogmanay itinerary for all 4 festival days — the Torchlight Procession as a torchbearer, the Street Party at midnight, and January 1 First Footin as the best solo travel day in Europe. Include the right accommodation for meeting people and total cost at mid-range.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/Hogmanay Honeymoon or Anniversary.png",
          label: "Hogmanay Honeymoon or Anniversary",
          tags: "Romantic · Couple",
          description: "Midnight fireworks. Together.",
          prompt:
            "Build me the romantic Hogmanay itinerary — Old Town hotel, New Year's Eve dinner before the Street Party, best position for the midnight fireworks, and January 1 First Footin at a slower pace. Tell me which hotel is worth booking and what the full trip costs.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/Hogmanay With a Group.png",
          label: "Hogmanay With a Group",
          tags: "Group · Celebration",
          description: "6 people. 4 days. One epic NYE.",
          prompt:
            "Build me the Hogmanay itinerary for a group of 6 — how to get everyone's Street Party tickets before they sell out, whether a self-catering apartment makes more sense than a hotel, and how to keep the group together on Princes Street at midnight when 45,000 people make phone signal unreliable.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/Hogmanay and Scotland.jpg ",
          label: "Hogmanay and Scotland",
          tags: "Scotland · Road Trip",
          description: "Festival first. Highlands after.",
          prompt:
            "Build me the 10-day Scotland itinerary with Hogmanay as the anchor — Edinburgh before and during the festival, then a 4-day drive through Loch Lomond, Glencoe, and Skye after January 1. Include car hire logistics from Edinburgh and total cost per person from India.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/Hogmanay on a Budget.png",
          label: "Hogmanay on a Budget",
          tags: "Budget · Smart",
          description: "Full festival. Lower spend.",
          prompt:
            "Build me the budget Hogmanay trip — cheapest flight routing from India, hostel or budget guesthouse near the Old Town, full festival ticket plan, and where Edinburgh is genuinely cheap during festival week. Give me the total per person at the lowest realistic level.",
        },
      ],
    },
    {
      heading: "Only in Edinburgh",
      icon: "🏰",
      cards: [
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/Edinburgh Castle at Dawn.jpg ",
          label: "Edinburgh Castle at Dawn",
          tags: "History · Edinburgh",
          description: "The castle before anyone arrives.",
          prompt:
            "I want to visit Edinburgh Castle properly on one of my pre-festival days. Tell me the opening time in late December, what is genuinely worth seeing inside — the Crown Jewels, the Stone of Destiny, the One O'Clock Gun at 1pm — and what understanding the castle's history adds to watching the New Year fireworks launch from its walls on Dec 31. Build the Castle visit into a full day in the Old Town.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/Scotch Whisky -- Learn It Here.jpg",
          label: "Scotch Whisky — Learn It Here",
          tags: "Food and Drink · City",
          description: "Before you ring in the new year.",
          prompt:
            "I want to spend one pre-festival evening going deep into Scottish whisky. Tell me which whisky bars on the Royal Mile and in the New Town are worth an hour with a serious bartender, what the difference between a Speyside, Islay, and Highland malt actually means when you are tasting it, and whether the Scotch Whisky Experience on the Castle Esplanade is worth a morning. Build the whisky evening into my Dec 27 or 28 itinerary.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/Arthur's Seat -- Climb It.jpg ",
          label: "Arthur's Seat — Climb It",
          tags: "Nature · Edinburgh",
          description: "Volcano. City below. 45 minutes.",
          prompt:
            "I want to climb Arthur's Seat — the ancient volcano in the middle of Edinburgh — on one of my pre-festival days. Tell me which route is easiest from the Old Town, how long the climb takes, what the view from the summit looks like with Edinburgh spread below and the Firth of Forth in the distance, and what time of day is best for the light in late December.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/Edinburgh Underground Vaults.png",
          label: "Edinburgh Underground Vaults",
          tags: "History · Hidden",
          description: "The city beneath the city.",
          prompt:
            "I want to visit the Edinburgh underground vaults — the hidden 18th century chambers beneath the South Bridge that were sealed and forgotten for 200 years. Tell me what a guided tour involves, how long it runs, which tour company gives the most historically serious version versus the ghost tour version, and how to fit this into a pre-festival afternoon in the Old Town.",
        },
        {
          image:
            "https://d31aoa0ehgvjdi.cloudfront.net/media/website/edinburgh-hogmanay-2026/Royal Mile -- Walk It Properly.jpg ",
          label: "Royal Mile — Walk It Properly",
          tags: "Culture · Old Town",
          description: "One street. 600 years of history.",
          prompt:
            "I want to walk the Royal Mile from Edinburgh Castle down to the Palace of Holyroodhouse properly — not as a tourist stroll but understanding what each building actually is. Tell me the key stops on the Mile, what John Knox's house is, what the Canongate Kirkyard contains, and whether Holyroodhouse is open to visitors in late December. Build the Royal Mile walk into a half-day on my first day in Edinburgh.",
        },
      ],
    },
  ],
  travellerStories: edinburghHogmanayTravellerStories,
};

const EdinburghHogmanayThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  return (
    <>
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
      </Head>
      <BotApp themeConfig={edinburghHogmanayThemeConfig} />
    </>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(EdinburghHogmanayThemePage);
