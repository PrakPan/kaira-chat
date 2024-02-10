export const CONTENT_SERVER_HOST = process.env.NEXT_PUBLIC_CONTENT_SERVER_HOST;

export const MIS_SERVER_HOST = process.env.NEXT_PUBLIC_MIS_SERVER_HOST;

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const ITINERARY_STATUSES = {
  itinerarary_under_preparation: "ITINERARY_UNDER_PREPARATION",

  itinerary_not_created: "ITINERARY_NOT_CREATED",

  itinerary_finalized: "ITINERARY_FINALIZED",

  itinerary_prepared: "ITINERARY_PREPARED",

  itinerary_unclaimed: "ITINERARY_UNCLAIMED",
};

export const ITINERARY_VERSION = {
  version_1: "v1",

  version_2: "v2",
};

export const GOOGLE_ANALTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALTICS_ID;

export const SENTRY_ENABLE = false;

export const TRAVELER_ITINERARIES = [
  "GN5JvXoBlZvI8TSUNDJE",

  "budve3wBWOGtAGF-0nXM",

  "-QIHUn0Bvi6XoFjhDVrO",

  "MucdpHwBWOGtAGF-_f2c",

  "rOLMAnwBWOGtAGF-JU43",

  "--BR_HoBlZvI8TSUql8l",

  "3uB5m3sBWOGtAGF-uXDI",

  "zTd8ZX8BHJjZ2cHLyZW2",

  "f65b8d06-f497-4313-9f06-42933ebb009d",

  "04fa8a36-64a8-4f61-a4db-4759df73c4c8",

  "cb24dd9e-2529-4717-9f1f-ee80930aacce",

  "bdb09db1-3c34-4a69-a3e0-98cfbda0c49e",
];

export const EXPERIENCE_FILTERS = [
  "Isolated",
  "Romantic",
  "Heritage",
  "Spiritual",
  "Art and Culture",
  "Shopping",
  "Adventure and Outdoors",
  "Nature and Retreat",
  "Nightlife and Events",
  "Science and Knowledge",
];

export const EXPERIENCE_FILTERS_BOX = [
  {
    display: "Nature and Spiritual",

    actual: ["Nature and Retreat", "Isolated", "Spiritual"],
  },

  {
    display: "Adventure",

    actual: ["Adventure and Outdoors"],
  },

  {
    display: "Heritage & Art",

    actual: ["Heritage", "Art and Culture"],
  },

  {
    display: "Nightlife & Shopping",

    actual: ["Nightlife and Events", "Shopping"],
  },

  {
    display: "Hidden gems",

    actual: ["Hidden Gem"],
  },

  {
    display: "Romantic",

    actual: ["Romantic"],
  },
];

export const ITINERARY_ELEMENT_TYPES = {
  newcity: "newcity",

  transfer: "transfer",

  activity: "activity",
};

export const HOTJAR_HJID = process.env.NEXT_PUBLIC_HOTJAR_HJID;

export const HOTJAR_HJSV = process.env.NEXT_PUBLIC_HOTJAR_HJSV;
