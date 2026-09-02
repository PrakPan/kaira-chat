// pages/theme/filmy-getaways.tsx
//
// Filmy Getaways — an editorial, cinematic theme landing (the "02 · Theme"
// mockup) built from the reusable CinematicThemeLanding component. Every card
// seeds its prompt into a fresh /chat session with Kaira. The page is wrapped
// in the shared site Layout so it keeps the standard header + footer.

import Head from "next/head";
import { connect } from "react-redux";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import * as authaction from "../../store/actions/auth";
import CinematicThemeLanding from "../../components/theme/cinematic/CinematicThemeLanding";
import {
  useSeedChat,
  useOpenThemeForm,
} from "../../components/theme/cinematic/useSeedChat";
import {
  promptIntakeMap,
  type ThemePromptIntent,
} from "../../components/theme/cinematic/themeIntake";
import { useThemeSelectionState } from "../../components/theme/cinematic/ThemeSelection";
import type { CinematicThemeConfig } from "../../components/theme/cinematic/types";
import { THEME_PALETTES } from "../../components/theme/cinematic/palettes";

// The themed mini-form + /chatkit slug for this page. The form behind it
// (themeForms/filmy-getaways.ts) carries the same eleven films as routes, keyed
// by the same skeletons the cards below send.
const THEME_SLUG = "filmy-getaways";

const CDN = "https://d31aoa0ehgvjdi.cloudfront.net";
const IMAGE_BASE = `${CDN}/media/website/filmy-getaways-2026`;

// Catalog photography for the sections that show a place rather than a film.
// Every id below is a real row in mercury (geos_city.image, geos_country.image,
// geos_restaurant.image), so these are the same covers the destination and
// restaurant pages serve — nothing here is stock or hand-picked off the web.
const ACT = "https://images.thetarzanway.com/media/activities";
const MEDIA = `${CDN}/media`;

// Experiences + the two standing sets.
const PHOTO = {
  hobbiton: `${ACT}/171328220985850071907043457031.jpg`,
  diagonAlley: `${ACT}/169089541980380082130432128906.jpg`,
  calderaDive: `${ACT}/169089234938154792785644531250.jpg`,
  parkGuell: `${ACT}/169089704304336476325988769531.jpg`,
  stockhornBungee: `${ACT}/177105443547533082962036132812.jpg`,
  lutschineRafting: `${ACT}/169709689914402055740356445312.jpeg`,
  ubudGates: `${ACT}/169089831035809040069580078125.jpg`,
};

// City hero, for the one destination tile that names an island rather than a
// country. (The route rail went back to the film stills, so the other city
// heroes this file briefly carried are gone with it.)
const CITY = {
  bali: `${MEDIA}/cities/175456211725436902046203613281.jpg`,
};


// Country heroes for the two country grids.
const COUNTRY = {
  switzerland: `${MEDIA}/countries/175930905875495767593383789062.jpg`,
  spain: `${MEDIA}/countries/175344481739372777938842773438.jpg`,
  india: `${MEDIA}/countries/168628452283270239830017089844.jpg`,
  france: `${MEDIA}/countries/176363325915420746803283691406.jpg`,
  italy: `${MEDIA}/countries/168441961093255019187927246094.jpg`,
  greece: `${MEDIA}/countries/168442255588076949119567871094.jpg`,
  unitedKingdom: `${MEDIA}/countries/168441945998108553886413574219.jpg`,
  newZealand: `${MEDIA}/countries/168500206870858645439147949219.jpg`,
  thailand: `${MEDIA}/countries/168442180095400023460388183594.jpg`,
  japan: `${MEDIA}/countries/175853838850662446022033691406.jpg`,
  iceland: `${MEDIA}/countries/168442051714989519119262695312.jpg`,
  vietnam: `${MEDIA}/countries/175871326394452381134033203125.png`,
  croatia: `${MEDIA}/countries/168442210268938946723937988281.jpg`,
  turkey: `${MEDIA}/countries/168628511349481129646301269531.jpg`,
};

// Restaurant covers. Names, ratings and review counts below are the catalog's
// own (geos_restaurant.rating / .user_ratings_total) rather than anything
// written for the page, so a card can't quietly drift from the listing.
const TABLE = {
  bodegaBiarritz: `${MEDIA}/restaurant/169081015204752612113952636719.jpeg`,
  cafeDeFlore: `${MEDIA}/restaurant/169083565314651775360107421875.jpeg`,
  boroughMarket: `${MEDIA}/restaurant/169089091589985609054565429688.jpeg`,
  waroengBernadette: `${MEDIA}/restaurant/176325968407457995414733886719.jpg`,
  karmaOia: `${MEDIA}/restaurant/169082354212794280052185058594.jpeg`,
  scalaLucerne: `${MEDIA}/restaurant/171680503933733654022216796875.jpeg`,
};

// Visa desk. Country pages live under /country/{slug}-visa-online — the
// fallback for a page that never opted into selection; here the visa cards save
// to the trip instead of linking out.
const VISA = "https://visa.thetarzanway.com/country";
const VISA_HOME = "https://visa.thetarzanway.com/";

// ── Prompts (authoritative, per the campaign brief) ────────────────────────
// Each film prompt states the nights and month its route brief skeleton is
// built for, so the sentence and the `intake` facts below can't disagree. The
// month follows the film's own season, not the theme's: Goa in November, the
// Greek islands in September, New Zealand in February — none of those windows
// overlap, and half of them genuinely shut off-season. Every one sits in the
// Sep–Mar booking window, so none of them resolves to a date already gone.
const PROMPTS = {
  // Bollywood
  ddlj:
    "We are 2 travellers going for 7 nights in September, and our travel dates are flexible. Create a romantic Switzerland itinerary inspired by the feeling of Dilwale Dulhania Le Jayenge. Prioritize scenic train journeys, charming alpine villages, breathtaking mountain landscapes, lakeside towns, cozy cafés, slow mornings, and unforgettable viewpoints. Keep the whole route on Swiss rail. The itinerary should feel relaxed, cinematic, and immersive rather than rushed, balancing iconic Swiss experiences with hidden gems.",
  znmd:
    "We are 2 travellers going for 10 nights in September, and our travel dates are flexible. Plan a Spain road trip inspired by Zindagi Na Milegi Dobara. Design the journey around friendship, freedom, adventure, and unforgettable experiences rather than simply covering cities. Prioritize scenic drives, coastal towns, authentic Spanish culture, lively nightlife, beautiful sunsets, local food experiences, and meaningful moments. Keep the coastal stretch self-driven — the drive is the film. Balance iconic highlights with offbeat recommendations to create a journey that feels spontaneous yet well-paced.",
  yjhd:
    "We are 2 travellers going for 8 nights in October, and our travel dates are flexible. Create a Yeh Jawaani Hai Deewani journey that runs from the Himalayas down to Rajasthan — the trek half first, the palace half second. Balance adventure, friendships, peaceful mountain moments, and cozy cafés up in the hills, then finish among lakes, courtyards and palace evenings. Include scenic drives, breathtaking viewpoints, optional treks, adventure activities, bonfire evenings, stargazing opportunities, and hidden cafés while keeping the pace relaxed and memorable.",
  dilChahtaHai:
    "We are 2 travellers going for 6 nights in November, and our travel dates are flexible. Build a Dil Chahta Hai trip that opens in Mumbai and runs down to Goa, splitting the beach time between the loud north and the quiet south. Focus on unforgettable moments with friends, beach sunsets, scenic drives, lively cafés, hidden beaches, water activities, local food, nightlife, and long, relaxed afternoons rather than simply covering tourist attractions. Blend iconic experiences with lesser-known gems to create the perfect mix of fun and downtime.",
  jabWeMet:
    "We are 2 travellers going for 7 nights in December, and our travel dates are flexible. Create a Jab We Met hill-town escape through Himachal, arriving the filmy way on the Kalka–Shimla toy train. Prioritize charming hill towns, scenic road journeys, cozy cafés, colorful local markets, peaceful viewpoints, authentic cultural experiences, and comfortable stays. Let the itinerary capture the joy of spontaneous travel and slow exploration instead of rushing between destinations.",
  tamasha:
    "We are 2 travellers going for 8 nights in September, and our travel dates are flexible. Design a Corsica escape inspired by Tamasha. Focus on scenic coastal drives, charming villages, beautiful beaches, local cafés, Mediterranean culture, hidden viewpoints, and slow travel experiences that encourage exploration and self-discovery. The island is car-only, so plan the moves as drives. Balance relaxation with unique local experiences to create a journey that feels both refreshing and meaningful.",
  // Hollywood
  midnightInParis:
    "We are 2 travellers going for 6 nights in September, and our travel dates are flexible. Create a Paris itinerary inspired by the timeless charm of Midnight in Paris. Prioritize atmospheric cafés, charming neighborhoods, bookstores, art museums, riverside walks, jazz bars, evening strolls, local bakeries, and authentic Parisian experiences. Keep it to Paris — anything outside the city should be a day trip, not a second base. Balance iconic landmarks with hidden gems to create a slow, romantic, and immersive journey.",
  eatPrayLove:
    "We are 2 travellers going for 12 nights in September, and our travel dates are flexible. Plan an Eat Pray Love journey across Italy and Bali, in that order — Italy first, then the Bali half. Design it around food, wellness, mindfulness, cultural immersion, beautiful nature, hidden cafés, temples, waterfalls, beach sunsets, yoga experiences, spa treatments, and slow travel. Prioritize meaningful local experiences over simply visiting popular tourist attractions.",
  mammaMia:
    "We are 2 travellers going for 8 nights in September, and our travel dates are flexible. Create a Greek island itinerary inspired by Mamma Mia!. Prioritize charming whitewashed villages, crystal-clear beaches, local tavernas, boat trips, coastal walks, hidden viewpoints, island hopping, and spectacular sunsets. Give the quieter chapel island the longest block. The journey should feel joyful, picturesque, and relaxed while blending iconic highlights with authentic island experiences.",
  harryPotter:
    "We are 2 travellers going for 8 nights in October, and our travel dates are flexible. Create a Scotland itinerary inspired by the magical landscapes associated with Harry Potter. Focus on historic castles, scenic rail journeys, misty Highlands, charming villages, dramatic landscapes, ancient streets, cozy pubs, and iconic viewpoints. Include the Glenfinnan steam train and flag how far ahead it needs booking. Capture a sense of wonder and adventure rather than simply visiting filming locations.",
  lordOfTheRings:
    "We are 2 travellers going for 10 nights in February, and our travel dates are flexible. Design a New Zealand adventure inspired by the epic landscapes of The Lord of the Rings. Prioritize breathtaking mountain scenery, pristine lakes, scenic drives, hiking opportunities, charming towns, and immersive nature experiences. Give the South Island the longest block. Create a journey that feels cinematic, adventurous, and balanced, with a mix of iconic sights and hidden natural gems.",
  // The "Stand on the actual set" row. The Warner Bros. sets are in Hertfordshire,
  // outside London — not Scotland — so this can't reuse the `harryPotter` prompt
  // above without the card promising a studio the route never reaches. It runs
  // London first, then north, and carries no skeleton for the same reason the
  // packages below don't: it isn't one of the eleven film routes the mini-form
  // knows.
  harryPotterUK:
    "We are 2 travellers going for 9 nights in October, and our travel dates are flexible. Create a Harry Potter journey through the UK that opens in London and finishes in the Scottish Highlands. Include the Warner Bros. Studio Tour London — the standing sets, Diagon Alley and the Great Hall — and flag how far ahead it needs booking. Then head north for the Glenfinnan viaduct and the Jacobite steam train, Edinburgh's old town, misty Highland landscapes and cosy pubs. Keep the London–Scotland leg on rail. Capture a sense of wonder and adventure rather than simply ticking off filming locations.",
  // Step into the scene
  romanticEscape:
    "We are 2 travellers going for 9 nights in October, and our travel dates are flexible. Create a romantic itinerary designed around meaningful experiences rather than packed sightseeing. Prioritize beautiful stays, scenic viewpoints, sunset experiences, charming cafés, intimate dining, leisurely walks, hidden gems, and memorable moments. Balance iconic attractions with peaceful experiences to create a slow, cinematic, and deeply romantic journey.",
  friendsWhoTravelFar:
    "We are 3 friends going for 8 nights in October, and our travel dates are flexible. Create a fun-filled group itinerary focused on shared experiences, adventure, scenic road journeys, lively cafés, nightlife, local food, unique activities, and unforgettable moments with friends. Prioritize flexibility, memorable experiences, and a balance of excitement and downtime over simply covering tourist attractions.",
  soloTrip:
    "I'm travelling solo for 7 nights in October, and my travel dates are flexible. Create a solo travel itinerary focused on self-discovery, flexibility, safety, and immersive local experiences. Prioritize walkable neighborhoods, cafés, cultural experiences, scenic viewpoints, peaceful moments, hidden gems, and opportunities to connect with the destination. Maintain a relaxed pace that encourages exploration while leaving room for spontaneity.",
  // Ask Kaira
  whichFilmLocation:
    "Which iconic film-inspired trip should we do first, travelling as a couple — DDLJ Switzerland, ZNMD Spain, Eat Pray Love Italy & Bali, or Mamma Mia Greece? Compare the experience, cost, and atmosphere, then build the ideal itinerary for the one you recommend.",
};

// What each prompt above states about the trip, sent as `intake` keys (month /
// nights / pax) rather than left for the backend to read out of the sentence.
// Keyed by prompt text via promptIntakeMap, so a card only carries its prompt
// and the facts follow. Each film sends you somewhere different, so the month
// follows the destination rather than the theme — February for a New Zealand
// summer, September for the Alps and the Aegean, November for Goa.
//
// The eleven films also carry `window` / `skeleton`: one route brief skeleton
// per film, the same keys the mini-form's routes send (themeForms/
// filmy-getaways.ts). A card and the form therefore route identically, and the
// backend never has to infer the film from the sentence. The `nights` on each
// one is that skeleton's own length — trimming it drops a city.
//
// The three "Step into the scene" trips are priced packages, not films, so they
// carry no skeleton; their nights match the nights printed on the card. The
// same goes for `harryPotterUK`, which is a second route through a film that
// already has one — see the note on the prompt itself.
//
// `whichFilmLocation` carries neither `nights` nor `month`: it asks Kaira to
// choose between four countries whose seasons don't overlap, so committing to
// either would answer the question for her.
const PROMPT_FACTS = promptIntakeMap(PROMPTS, {
  ddlj: {
    nights: 7,
    month: 9,
    who: "Couple",
    window: "switzerland_ddlj",
    skeleton: "switzerland_ddlj",
  },
  znmd: {
    nights: 10,
    month: 9,
    who: "Couple",
    window: "znmd_spain",
    skeleton: "znmd_spain",
  },
  yjhd: {
    nights: 8,
    month: 10,
    who: "Couple",
    window: "yjhd_india",
    skeleton: "yjhd_india",
  },
  dilChahtaHai: {
    nights: 6,
    month: 11,
    who: "Couple",
    window: "dch_goa",
    skeleton: "dch_goa",
  },
  jabWeMet: {
    nights: 7,
    month: 12,
    who: "Couple",
    window: "jabwemet_hills",
    skeleton: "jabwemet_hills",
  },
  tamasha: {
    nights: 8,
    month: 9,
    who: "Couple",
    window: "tamasha_corsica",
    skeleton: "tamasha_corsica",
  },
  midnightInParis: {
    nights: 6,
    month: 9,
    who: "Couple",
    window: "midnight_paris",
    skeleton: "midnight_paris",
  },
  eatPrayLove: {
    nights: 12,
    month: 9,
    who: "Couple",
    window: "eatpraylove_bali_italy",
    skeleton: "eatpraylove_bali_italy",
  },
  mammaMia: {
    nights: 8,
    month: 9,
    who: "Couple",
    window: "mammamia_greece",
    skeleton: "mammamia_greece",
  },
  harryPotter: {
    nights: 8,
    month: 10,
    who: "Couple",
    window: "harrypotter_scotland",
    skeleton: "harrypotter_scotland",
  },
  lordOfTheRings: {
    nights: 10,
    month: 2,
    who: "Couple",
    window: "lotr_newzealand",
    skeleton: "lotr_newzealand",
  },
  harryPotterUK: { nights: 9, month: 10, who: "Couple" },
  romanticEscape: { nights: 9, month: 10, who: "Couple" },
  friendsWhoTravelFar: { nights: 8, month: 10, who: "Friends", adults: 3 },
  soloTrip: { nights: 7, month: 10, who: "Just me" },
  whichFilmLocation: { who: "Couple" },
});

const filmyGetawaysConfig: CinematicThemeConfig = {
  // Cinema red — carries every CTA, the saved state and the docked bar.
  theme: THEME_PALETTES[THEME_SLUG],
  header: {
    title: "Filmy getaways",
    subtitle: "Theme · Bollywood + Hollywood",
  },
  hero: {
    eyebrow: "Some stories are too good to just watch.",
    heading: { lead: "Live Your", accent: "Favorite Movie" },
    // Kept on desktop only (the mobile mockup has no hero subtext).
    lede: "You've watched the scene enough times. Tell me the film and I'll build the trip around the places that made it — with the touristy bits trimmed out.",
    placeholder: "Try: the ZNMD Spain trip",
    prompt: PROMPTS.znmd,
    chips: [
      { label: "ZNMD Spain trip", prompt: PROMPTS.znmd },
      { label: "DDLJ Switzerland trip", prompt: PROMPTS.ddlj },
      { label: "Eat Pray Love Bali trip", prompt: PROMPTS.eatPrayLove },
    ],
    // Desktop-only Kaira polaroid collage — each polaroid opens its destination.
    images: [
      {
        image: `${IMAGE_BASE}/DDLJ2.png`,
        caption: "Switzerland, DDLJ",
        href: "/europe/switzerland",
      },
      {
        image: `${IMAGE_BASE}/ZNMD.png`,
        caption: "Spain, ZNMD",
        href: "/europe/spain",
      },
      {
        image: `${IMAGE_BASE}/MammaMia.png`,
        caption: "Greece, Mamma Mia",
        href: "/europe/greece",
      },
      {
        image: `${IMAGE_BASE}/EatPrayLove.png`,
        caption: "Bali, Eat Pray Love",
        href: "/asia/indonesia/bali",
      },
    ],
  },
  // A step up from the shared 1240 default, not the mockup's full 1440 — that
  // ran the rows out to the edge of a laptop screen with nothing framing them.
  maxWidth: "1320px",
  sections: [
    // ── Stand on the actual set ──
    // The mockup opens on this, and it opens the page here too: most film
    // locations are landscapes that were there before the crew was, and these
    // two are built sets kept and run as they were on shoot day. The ink panel
    // is the point — it stops the scroll before the poster rows begin.
    //
    // First section, so its first card is also the LCP image (see the preload
    // in CinematicThemeLanding).
    //
    // These two save rather than seed: a studio tour is a day inside a trip,
    // not a trip, so "+ Add activity" drops it in the tray and the docked bar
    // builds the route around it. Every other film row still says "Create plan".
    {
      type: "cards",
      tone: "dark",
      selectable: true,
      itemKind: "activity",
      addNoun: "activity",
      heading: {
        eyebrow: "New Zealand · United Kingdom",
        lead: "Stand on the",
        accent: "actual set",
      },
      intro:
        "Some film locations are landscapes. These two are sets kept and run exactly as they were on shoot day, verified and bookable now.",
      cards: [
        {
          image: PHOTO.hobbiton,
          name: "Hobbiton, the actual Shire",
          line: "Bag End, the Green Dragon Inn, every hobbit hole — still gardened.",
          tag: "New Zealand",
          item: {
            kind: "activity",
            label: "Hobbiton Movie Set day trip, New Zealand",
            short: "Hobbiton Movie Set",
          },
        },
        {
          image: PHOTO.diagonAlley,
          name: "Diagon Alley, still standing",
          line: "The Great Hall, the wands, the sets they actually shot on.",
          tag: "London",
          item: {
            kind: "activity",
            label: "Warner Bros. Studio Tour London — The Making of Harry Potter",
            short: "WB Studio Tour London",
          },
        },
      ],
    },
    // ── Pick a film ──
    // The one film row on the page. It used to be three — a Bollywood row and a
    // Hollywood row of stills, then this one of routes — all showing the same
    // eleven films. They are folded together here: each card keeps its still and
    // its line from the old rows, and gains the cities and nights its route
    // brief actually runs (themeForms/filmy-getaways.ts), so the card and the
    // plan behind it can't disagree about the shape of the trip.
    //
    // A film isn't a bookable element — each card is a whole trip request, so it
    // carries "Create plan" and seeds its prompt rather than "+ Add"-ing to the
    // tray. (A `selectable` card with no activityId toggles the saved list on
    // click and never fires its prompt — see PromptCard.)
    {
      type: "cards",
      rail: true,
      ctaLabel: "Create plan →",
      ctaTone: "dark",
      heading: { lead: "Pick a film" },
      cards: [
        {
          image: `${IMAGE_BASE}/DDLJ2.png`,
          name: "DDLJ, the Switzerland dream",
          line: "Trains, Alps, and romance. Lucerne → Wengen → Montreux.",
          tag: "Kaira's pick · 7 nights",
          prompt: PROMPTS.ddlj,
        },
        {
          image: `${IMAGE_BASE}/ZNMD.png`,
          name: "ZNMD, Spain awaits",
          line: "Spain. Friendship. No regrets. Barcelona → Costa Brava → Valencia → Seville.",
          tag: "10 nights",
          objectPosition: "center 30%",
          prompt: PROMPTS.znmd,
        },
        {
          image: `${IMAGE_BASE}/YJHD.png`,
          name: "Yeh Jawaani — mountains to palaces",
          line: "Mountains, desert, road-trip vibes. Manali → Delhi → Udaipur.",
          tag: "8 nights",
          prompt: PROMPTS.yjhd,
        },
        {
          image: `${IMAGE_BASE}/DilChahtaHai.png`,
          name: "Dil Chahta Hai, Goa forever",
          line: "Friends, feni, and the sea. Mumbai → North Goa → South Goa.",
          tag: "6 nights",
          prompt: PROMPTS.dilChahtaHai,
        },
        {
          image: `${IMAGE_BASE}/JabWeMet.png`,
          name: "Jab We Met, hill-town joy",
          line: "Spontaneous, slow, unforgettable. Shimla → Manali, in on the toy train.",
          tag: "7 nights",
          // Portrait still — frame the couple's faces (upper third).
          objectPosition: "center 40%",
          prompt: PROMPTS.jabWeMet,
        },
        {
          image: `${IMAGE_BASE}/Tamasha.png`,
          name: "Tamasha, Corsica calling",
          line: "Cliffs, sea, and silence. Ajaccio → Porto → Bonifacio.",
          tag: "8 nights",
          prompt: PROMPTS.tamasha,
        },
        {
          image: `${IMAGE_BASE}/MidNightInParis.png`,
          name: "Midnight in Paris",
          line: "When Paris stops performing. Six nights, one city.",
          tag: "6 nights",
          // Portrait still — frame the couple's faces (upper third).
          objectPosition: "center 25%",
          prompt: PROMPTS.midnightInParis,
        },
        {
          image: `${IMAGE_BASE}/EatPrayLove.png`,
          name: "Eat Pray Love, Bali & Italy",
          line: "Some trips change everything. Rome → Ubud → Seminyak.",
          tag: "12 nights",
          prompt: PROMPTS.eatPrayLove,
        },
        {
          image: `${IMAGE_BASE}/MammaMia.png`,
          name: "Mamma Mia — Greek islands",
          line: "Where life turns into music. Athens → Skopelos → Skiathos.",
          tag: "8 nights",
          prompt: PROMPTS.mammaMia,
        },
        {
          image: `${IMAGE_BASE}/HarryPotter.png`,
          name: "Harry Potter, Scotland magic",
          line: "Castles, mist, and wonder. Edinburgh → Fort William → Glasgow.",
          tag: "8 nights",
          // Portrait still — frame the subject's face (upper third).
          objectPosition: "center 25%",
          prompt: PROMPTS.harryPotter,
        },
        {
          image: `${IMAGE_BASE}/LordOfRings.png`,
          name: "Lord of the Rings, New Zealand",
          line: "Landscapes out of legend. Auckland → Wellington → Queenstown.",
          tag: "10 nights",
          prompt: PROMPTS.lordOfTheRings,
        },
      ],
    },
    // ── Experiences worth booking ──
    // The mockup's list, minus the two that already lead the page as standing
    // sets (Hobbiton and the studio tour). Each name, cover, rating and review
    // count is an `ancillaries_activity` row. They save rather than seed: an
    // experience is a day inside a trip, not a trip.
    {
      type: "cards",
      rail: true,
      selectable: true,
      itemKind: "activity",
      addNoun: "activity",
      heading: { lead: "Experiences worth", accent: "booking" },
      cards: [
        {
          image: PHOTO.calderaDive,
          name: "Diving the volcanic caldera",
          line: "Mamma Mia's cliffs, seen from underneath the water.",
          tag: "Santorini",
        },
        {
          image: PHOTO.parkGuell,
          name: "Park Güell, ticketed",
          line: "Gaudí's park — the Barcelona ZNMD keeps coming back to.",
          tag: "Barcelona",
        },
        {
          image: PHOTO.stockhornBungee,
          name: "Bungee at the Stockhorn",
          line: "DDLJ country, with the whole valley in the drop.",
          tag: "Interlaken",
        },
        {
          image: PHOTO.lutschineRafting,
          name: "Rafting the Lütschine",
          line: "The river that runs through every meadow shot in the film.",
          tag: "Interlaken",
        },
        {
          image: PHOTO.ubudGates,
          name: "Ubud in a day",
          line: "The rice terraces and temples that open the Bali half.",
          tag: "Bali",
        },
      ],
    },
    // ── Eat where they ate ──
    // Six tables, one per film, matching the mockup's count. Every one is a
    // real `geos_restaurant` row — cover, rating and review count come off the
    // listing rather than being written for the page. (The mockup named six
    // restaurants the catalog doesn't carry; these are their equivalents on the
    // routes the films actually run.)
    //
    // Only Borough Market is a literal filming location — the Leaky Cauldron's
    // doorway, in Prisoner of Azkaban. The rest are written as the film's world
    // rather than its set, because that is what they are.
    {
      type: "eats",
      rail: true,
      selectable: true,
      itemKind: "restaurant",
      addNoun: "table",
      heading: { lead: "Eat where", accent: "they ate" },
      cards: [
        {
          image: TABLE.scalaLucerne,
          name: "Scala — Art Deco Hotel Montana",
          city: "Lucerne",
          line: "The lake through the window, on DDLJ's opening leg.",
          rating: "4.8",
          reviews: "517",
        },
        {
          image: TABLE.bodegaBiarritz,
          name: "Bodega Biarritz 1881",
          city: "Barcelona",
          line: "Tapas standing at the bar — ZNMD's Barcelona, loud and late.",
          rating: "4.7",
          reviews: "4,156",
          item: { kind: "restaurant", label: "Bodega Biarritz 1881, Barcelona", short: "Bodega Biarritz", id: "c7a78d29-2440-480d-82fb-03b6818f5098" },
        },
        {
          image: TABLE.cafeDeFlore,
          name: "Café de Flore",
          city: "Paris",
          line: "The Left Bank café the whole film keeps circling back to.",
          rating: "4.0",
          reviews: "8,194",
          item: { kind: "restaurant", label: "Café de Flore, Paris", short: "Café de Flore", id: "360f50df-7bc4-4bdf-8ebb-311eff624290" },
        },
        {
          image: TABLE.boroughMarket,
          name: "Borough Market",
          city: "London",
          line: "The Leaky Cauldron's doorway is here. So is the best food in London.",
          rating: "4.6",
          reviews: "82,729",
          item: { kind: "restaurant", label: "Borough Market, London", short: "Borough Market", id: "bf1f6659-7574-4b70-b1cf-c7ac082090d5" },
        },
        {
          image: TABLE.waroengBernadette,
          name: "Waroeng Bernadette",
          city: "Ubud",
          line: "Balinese home cooking, in the lanes the Bali half wanders.",
          rating: "4.8",
          reviews: "3,093",
          item: { kind: "restaurant", label: "Waroeng Bernadette, Ubud", short: "Waroeng Bernadette", id: "7677bdc9-2890-48dc-a561-3d69f49f2417" },
        },
        {
          image: TABLE.karmaOia,
          name: "Karma",
          city: "Oia, Santorini",
          line: "Dinner in Oia as the caldera goes pink — the Greek-island evening.",
          rating: "4.6",
          reviews: "1,318",
          item: { kind: "restaurant", label: "Karma, Oia, Santorini", short: "Karma, Oia", id: "e78b5312-f113-4095-84ec-c3113557f7d7" },
        },
      ],
    },
    // ── Visa ──
    // Every fee, stay period and processing time below is the live figure from
    // mercury's `ancillaries_visa` table (tourist purpose, `discounted_price` —
    // what the traveller actually pays us). The earlier pass carried numbers
    // copied off the mockup; two of the three were wrong against the desk.
    //
    // Five of the eleven films sit inside Schengen, so one visa covers them and
    // the country you apply through is decided by nights, not by which film you
    // came for. The UK, New Zealand and Indonesia each need their own — listed
    // here so nobody plans a Harry Potter UK run on a Schengen sticker.
    {
      type: "visa",
      heading: {
        eyebrow: "Schengen · one visa, five countries",
        lead: "Your visa,",
        accent: "handled",
      },
      intro:
        "Apply through the country you'll spend the most nights in — one Schengen visa then covers Switzerland, Spain, France, Italy and Greece for the whole route. We prep the paperwork, check every document and submit for you.",
      cards: [
        {
          country: "Switzerland",
          cities: "Lucerne · Wengen · Montreux — DDLJ",
          fee: "₹5,400",
          href: `${VISA}/switzerland-visa-online`,
        },
        {
          country: "Spain",
          cities: "Barcelona · Costa Brava · Seville — ZNMD",
          fee: "₹3,900",
          href: `${VISA}/spain-visa-online`,
        },
        {
          country: "France",
          cities: "Paris and Corsica — Midnight in Paris, Tamasha",
          fee: "₹4,202",
          href: `${VISA}/france-visa-online`,
        },
        {
          country: "Greece",
          cities: "Athens · Skopelos · Skiathos — Mamma Mia",
          fee: "₹2,590",
          href: `${VISA}/greece-visa-online`,
        },
        {
          country: "Italy",
          cities: "Rome — the first half of Eat Pray Love",
          fee: "₹3,032",
          href: `${VISA}/italy-visa-online`,
        },
        {
          country: "United Kingdom",
          cities: "Harry Potter · 6-month visitor, not Schengen",
          fee: "₹21,500",
          href: `${VISA}/uk-visa-online`,
        },
        {
          country: "New Zealand",
          cities: "Lord of the Rings · multiple entry, 40 days to process",
          fee: "₹27,500",
          href: `${VISA}/newzealand-visa-online`,
        },
        {
          country: "Indonesia",
          cities: "Bali · e-visa, 30 days, issued in a day",
          fee: "₹3,600",
          href: `${VISA}/indonesia-visa-online`,
        },
      ],
      facts: [
        { label: "Processing", value: "20 days" },
        { label: "Stay", value: "Up to 30 days" },
        { label: "Entry", value: "Single" },
        { label: "Covers", value: "5 countries" },
      ],
      // The mockup's closing block under the country cards. The callback line
      // is there because the one thing a grid of countries can't answer is
      // which of them to apply through — that depends on where the nights fall,
      // and a person settles it faster than another form.
      note:
        "Processing, stay and entry above are the Schengen sticker's. The UK, New Zealand and Indonesia are separate applications on their own timelines — New Zealand's takes about 40 days, so start it before anything else.",
    },
    // ── When to actually go ──
    // The months here are the ones the prompts above are written for, so the
    // calendar and the trips a reader can start from this page agree.
    {
      type: "months",
      heading: {
        eyebrow: "Every film runs on its own season",
        lead: "When to",
        accent: "actually go",
      },
      rows: [
        {
          range: "Sep",
          name: "The Alps and the Aegean",
          line: "DDLJ Switzerland, ZNMD Spain, Mamma Mia Greece, Tamasha Corsica — warm sea, soft light, the trains still running.",
        },
        {
          range: "Oct",
          name: "Highlands and Himalayas",
          line: "Scotland at its mistiest for Harry Potter, and the YJHD trek half before the passes shut.",
        },
        {
          // Kept as one card so the row fills the four-column grid rather than
          // leaving a fifth stranded on its own line.
          range: "Nov – Dec",
          name: "India, coast then hills",
          line: "Dil Chahta Hai once the monsoon clears Goa, then Jab We Met weather up on the Kalka–Shimla toy train.",
        },
        {
          range: "Feb",
          name: "A New Zealand summer",
          line: "Middle-earth at its greenest — the South Island's warmest, longest days.",
        },
      ],
      note:
        "None of these windows overlap, and half of them genuinely shut off-season. Pick the film first and the month follows it, not the other way round.",
    },
    // ── Which blockbuster is yours? ──
    // The mockup's packaged-product card: cover on top, what the price covers
    // as chips, a ruled price line, ink CTA. `tone: "band"` lays the whole
    // section on the palette's soft wash, which is how the mockup separates the
    // priced plans from the free browsing above and below them.
    //
    // Desktop only. These are the one block that reads as a brochure rather
    // than a way in, and on a phone they push the film rail — what people
    // actually came for — a screen and a half further down.
    {
      type: "trips",
      desktopOnly: true,
      layout: "stacked",
      tone: "band",
      ctaLabel: "Book this plan →",
      heading: {
        eyebrow: "Priced · rail and flights included",
        lead: "Which blockbuster",
        accent: "is yours?",
      },
      cards: [
        {
          image: `${IMAGE_BASE}/TheRomanticEscape.jpeg`,
          tag: "Bollywood · romantic",
          name: "The romantic escape",
          line: "Europe made for two.",
          price: "₹3,85,000 / person",
          nights: "9 nights",
          includes: ["Flights", "Rail pass", "Stays"],
          prompt: PROMPTS.romanticEscape,
        },
        {
          image: `${IMAGE_BASE}/FriendsWhoTravelSoFar.jpeg`,
          tag: "Bollywood · group",
          name: "Friends who travel far",
          line: "Three friends. One wild route.",
          price: "₹2,95,000 / person",
          nights: "8 nights",
          includes: ["Flights", "Self-drive", "Stays"],
          prompt: PROMPTS.friendsWhoTravelFar,
        },
        {
          image: `${IMAGE_BASE}/SoloTrip.jpeg`,
          tag: "Hollywood · solo",
          name: "The solo reset trip",
          line: "Go alone. Come back new.",
          price: "₹2,40,000 / person",
          nights: "7 nights",
          includes: ["Flights", "2 cities", "Stays"],
          prompt: PROMPTS.soloTrip,
        },
      ],
    },
    // ── People who went ──
    // Real Google reviews, quoted as written — the same three Europe and Greece
    // trips carried on the homepage (components/revamp/home/GoogleReviewsSection),
    // which are the ones whose routes overlap this theme's films. Each card
    // opens that reviewer's own Google review.
    {
      type: "stories",
      heading: { eyebrow: "Loved on Google", lead: "People who", accent: "went" },
      badge: "★ 4.9",
      cards: [
        {
          rating: "5.0",
          type: "Couple",
          name: "Naveen Dadlani",
          when: "Europe · Google review",
          quote:
            "Amazing experience with their agility and trip planning — supported us throughout two weeks across 4 countries and 7 cities. A fab team that blends AI with real travel expertise.",
          route: "14N · 4 countries",
          href: "https://share.google/iy1b48ykCI0d7O8dU",
        },
        {
          rating: "5.0",
          type: "Couple",
          name: "Sumit Jain",
          when: "Europe · Google review",
          quote:
            "One of the best travel experiences — meticulously planned and executed to perfection. Hotels, internal transfers and airport transfers all handled, with support available even late at night.",
          route: "Multi-city · rail included",
          href: "https://share.google/z3sDM17ebOShAqw6Q",
        },
        {
          rating: "5.0",
          type: "Solo",
          name: "Neel",
          when: "Greece · Google review",
          quote:
            "A last-minute solo trip to Greece, curated in under 12 hours — flights, stays, transfers and experiences all matched to my preferences. Athens, Mykonos and Santorini, perfectly balanced.",
          route: "Solo · planned in 12h",
          href: "https://share.google/FwRwaWXW3a6NHTdvk",
        },
      ],
    },
    // ── Other themes ──
    {
      type: "gradient",
      heading: {
        eyebrow: "Other themes",
        lead: "More ways",
        accent: "to go",
      },
      columns: 6,
      cards: [
        {
          name: "Perfect proposals",
          meta: "9 trips",
          emoji: "💍",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 170%)",
          image: `${CDN}/media/page/174120792592848706245422363281/.png`,
          href: "/theme/perfect-proposal",
        },
        {
          name: "New Year & Christmas",
          meta: "Dec – Jan",
          emoji: "🎄",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 150%)",
          image:
            "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200",
          prompt:
            "Plan a New Year and Christmas holiday abroad with festive markets, lights, and celebrations. Recommend the best destinations for late December, and build a complete itinerary with stays and experiences.",
        },
        {
          name: "Edinburgh Hogmanay",
          meta: "29 Dec – 2 Jan",
          emoji: "🏴",
          gradient: "linear-gradient(150deg, #1a2436, #3d4f7a)",
          image:
            "https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=1200",
          href: "/theme/edinburgh-hogmanay",
        },
        {
          name: "Thailand bachelor",
          meta: "Groups of 6+",
          emoji: "🕺",
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          image: `${CDN}/media/website/thailand-theme-2026/ChiangMai.jpg`,
          href: "/theme/thailand-trip",
        },
        {
          name: "Northern lights",
          meta: "Nov – Mar",
          emoji: "🌌",
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          image: `${CDN}/media/page/177133062391213107109069824219.jpg`,
          href: "/theme/northern-lights",
        },
        {
          name: "Honeymoon isles",
          meta: "12 trips",
          emoji: "🫶",
          gradient: "linear-gradient(150deg, #16324f, #ffe5d1 200%)",
          image:
            "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200",
          href: "/theme/honeymoon-2026",
        },
      ],
    },
    // ── Other countries ──
    // Sits between the two so it pairs with "Other themes" into the mockup's
    // half-and-half row (adjacent gradients pair; the third renders full-width
    // — see pairedWithNext in CinematicThemeLanding). Deliberately the places
    // none of the eleven films go, which is what the heading promises.
    {
      type: "gradient",
      heading: {
        eyebrow: "Other countries",
        lead: "Or somewhere",
        accent: "else entirely",
      },
      columns: 6,
      cards: [
        {
          name: "Thailand",
          meta: "Islands · temples",
          emoji: "🏝️",
          gradient: "linear-gradient(150deg, #1f8a5a, #f0e9d6 200%)",
          image: COUNTRY.thailand,
          href: "/asia/thailand",
        },
        {
          name: "Japan",
          meta: "Blossom · powder",
          emoji: "⛩️",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 180%)",
          image: COUNTRY.japan,
          href: "/asia/japan",
        },
        {
          name: "Iceland",
          meta: "Aurora · ring road",
          emoji: "🌋",
          gradient: "linear-gradient(150deg, #0e1530, #445069)",
          image: COUNTRY.iceland,
          href: "/europe/iceland",
        },
        {
          name: "Croatia",
          meta: "Dubrovnik · Split",
          emoji: "⚔️",
          gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
          image: COUNTRY.croatia,
          href: "/europe/croatia",
        },
        {
          name: "Vietnam",
          meta: "Hanoi · Hoi An",
          emoji: "🛶",
          gradient: "linear-gradient(150deg, #1f8a5a, #16324f 170%)",
          image: COUNTRY.vietnam,
          href: "/asia/vietnam",
        },
        {
          name: "Turkey",
          meta: "Cappadocia · Istanbul",
          emoji: "🎈",
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          image: COUNTRY.turkey,
          href: "/europe/turkey",
        },
      ],
    },
    // ── Destinations ──
    // The eyebrow says "in this theme", so the tiles are now the countries the
    // eleven films actually run through — and the meta on each is that film's
    // route rather than an invented trip count.
    {
      type: "gradient",
      heading: {
        eyebrow: "Destinations in this theme",
        lead: "Where I",
        accent: "send people",
      },
      columns: 3,
      mobileGrid: true,
      cards: [
        {
          name: "Switzerland",
          meta: "Lucerne · Wengen · Montreux",
          emoji: "🏔️",
          gradient: "linear-gradient(150deg, #16324f, #3d4f7a)",
          image: COUNTRY.switzerland,
          href: "/europe/switzerland",
        },
        {
          name: "Spain",
          meta: "Barcelona · Costa Brava · Seville",
          emoji: "🍷",
          gradient: "linear-gradient(150deg, #b84034, #f0e9d6 190%)",
          image: COUNTRY.spain,
          href: "/europe/spain",
        },
        {
          name: "India",
          meta: "Manali · Goa · Shimla",
          emoji: "🚂",
          gradient: "linear-gradient(150deg, #b84034, #f7e700 220%)",
          image: COUNTRY.india,
          href: "/asia/india",
        },
        {
          name: "France",
          meta: "Paris · Corsica",
          emoji: "🥐",
          gradient: "linear-gradient(150deg, #3d2b52, #b84034 180%)",
          image: COUNTRY.france,
          href: "/europe/france",
        },
        {
          name: "Italy",
          meta: "Rome · Naples",
          emoji: "🍝",
          gradient: "linear-gradient(150deg, #1f8a5a, #f0e9d6 200%)",
          image: COUNTRY.italy,
          href: "/europe/italy",
        },
        {
          name: "Greece",
          meta: "Athens · Skopelos · Skiathos",
          emoji: "🏛️",
          gradient: "linear-gradient(150deg, #16324f, #ffe5d1 200%)",
          image: COUNTRY.greece,
          href: "/europe/greece",
        },
        {
          name: "United Kingdom",
          meta: "Edinburgh · Glenfinnan",
          emoji: "🏰",
          gradient: "linear-gradient(150deg, #1a2436, #445069)",
          image: COUNTRY.unitedKingdom,
          href: "/europe/united_kingdom",
        },
        {
          name: "New Zealand",
          meta: "Auckland · Wellington · Queenstown",
          emoji: "🗻",
          gradient: "linear-gradient(150deg, #0e1530, #1f8a5a 170%)",
          image: COUNTRY.newZealand,
          href: "/oceania/new_zealand",
        },
        {
          name: "Bali",
          meta: "Ubud · Seminyak",
          emoji: "🌴",
          gradient: "linear-gradient(150deg, #16324f, #1f8a5a 160%)",
          image: CITY.bali,
          href: "/asia/indonesia/bali",
        },
      ],
    },
    // ── How it works ──
    // The closing block. Everything above it is a way in; this is what happens
    // after one is tapped.
  ],
  askBar: {
    placeholder: "Which film location should I actually visit?",
    cta: "Ask Kaira",
    prompt: PROMPTS.whichFilmLocation,
    buildCta: "Build trip",
  },
};

const FilmyGetawaysThemePage = ({
  checkAuthState,
}: {
  checkAuthState: () => void;
}) => {
  const seedChat = useSeedChat();
  const selection = useThemeSelectionState();
  const openThemeForm = useOpenThemeForm();
  const handleSelectPrompt = (prompt: string, intent?: ThemePromptIntent) =>
    seedChat(prompt, {
      items: selection.items,
      slug: THEME_SLUG,
      intent,
      facts: PROMPT_FACTS[prompt],
    });
  const handleBuild = (note?: string) =>
    openThemeForm(THEME_SLUG, selection.items, note);

  useEffect(() => {
    checkAuthState();
  }, []);

  return (
    <Layout page="Theme Page" slug="filmy-getaways">
      <Head>
        <title>
          Filmy Getaways | Film-Inspired Trip Planner & Itinerary | The Tarzan
          Way
        </title>
        <meta
          name="description"
          content="Plan film-inspired getaways with The Tarzan Way's AI itinerary — ZNMD Spain, DDLJ Switzerland, Eat Pray Love Bali, Mamma Mia Greece, and more iconic Bollywood and Hollywood movie destinations for Indian travellers."
        />
        <meta
          property="og:title"
          content="Filmy Getaways | Film-Inspired Trip Planner & Itinerary | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Plan film-inspired getaways with The Tarzan Way's AI itinerary — ZNMD Spain, DDLJ Switzerland, Eat Pray Love Bali, Mamma Mia Greece, and more iconic Bollywood and Hollywood movie destinations for Indian travellers."
        />
        <link
          rel="canonical"
          href="https://thetarzanway.com/theme/filmy-getaways"
        />
        <meta
          property="og:url"
          content="https://thetarzanway.com/theme/filmy-getaways"
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
                  name: "Filmy Getaways — Film-Inspired Trip Planner",
                  description:
                    "Plan film-inspired getaways with The Tarzan Way's AI itinerary — ZNMD Spain, DDLJ Switzerland, Eat Pray Love Bali, Mamma Mia Greece, and more iconic Bollywood and Hollywood movie destinations for Indian travellers.",
                  url: "https://thetarzanway.com/theme/filmy-getaways",
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
                      name: "Filmy Getaways",
                      item: "https://thetarzanway.com/theme/filmy-getaways",
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </Head>
      <CinematicThemeLanding
        config={filmyGetawaysConfig}
        onSelectPrompt={handleSelectPrompt}
        selection={selection}
        onBuild={handleBuild}
      />
    </Layout>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(FilmyGetawaysThemePage);
