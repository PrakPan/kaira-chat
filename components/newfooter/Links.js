import urls from "../../services/urls";

const linksArr = [
  {
    heading: "Travel Destinations",
    data: [
      { title: "Europe", link: "/europe" },
      { title: "Asia", link: "/asia" },
      { title: "North America", link: "/north_america" },
      { title: "South America", link: "/south_america" },
      { title: "Australia & New Zealand", link: "/oceania" },
      { title: "Africa", link: "/africa" },
      { title: "Caribbean", link: "/caribbean" },
    ],
  },
  {
    heading: "Top Destinations",
    data: [
      { title: "India", link: "/asia/india" },
      { title: "Thailand", link: "/asia/thailand" },
      { title: "Indonesia", link: "/asia/indonesia" },
      { title: "Japan", link: "/asia/japan" },
      { title: "Vietnam", link: "/asia/vietnam" },
      { title: "Singapore", link: "/asia/singapore" },
      { title: "Dubai (UAE)", link: "/asia/united_arab_emirates" },
      { title: "Italy", link: "/europe/italy" },
      { title: "France", link: "/europe/france" },
      { title: "Spain", link: "/europe/spain" },
    ],
  },
  {
    heading: "Travel Styles",
    data: [
      // The only site-wide link into /trips. Without it the whole section —
      // 1,865 pages — is orphaned: nothing on the site links to it, so a
      // crawler's only route in is the sitemap, and Google had not discovered
      // a single one of those URLs. /trips itself links out to all 194
      // destination hubs, so one entry point here is enough to reach them.
      { title: "Trip Packages", link: "/trips" },
      // { title: "Personalise", link: "" },

      // Every theme landing built on CinematicThemeLanding, in the order the
      // year runs rather than alphabetically, so the list reads as a calendar.
      // These pages had no site-wide inbound link either — each one's only
      // route in was the sitemap and whatever "Other themes" grid happened to
      // point at it, and several were reachable from nothing at all.
      //
      // Each label is the page's own `header.title`, so the footer and the page
      // agree — the exception is the Australia & New Zealand theme, qualified
      // here because "Travel Destinations" above already has a link with that
      // exact name pointing at the /oceania continent hub.
      { title: "Honeymoon", link: "/theme/honeymoon" },
      { title: "Filmy getaways", link: "/theme/filmy-getaways" },
      // { title: "Greece islands", link: "/theme/greece-islands-done-right" },
      // { title: "Offbeat Thailand + Bali", link: "/theme/thailand-bali-offbeat" },
      {
        title: "Thailand bachelor & bachelorette",
        link: "/theme/thailand-bachelor",
      },
      { title: "Hokkaido powder & Sapporo", link: "/theme/hokkaido-powder" },
      { title: "Northern lights", link: "/theme/northern-lights" },
      // { title: "Lapland", link: "/theme/lapland" },
      { title: "Christmas markets & NYE", link: "/theme/christmas-markets" },
      // { title: "Edinburgh Hogmanay", link: "/theme/edinburgh-hogmanay" },
      { title: "Australia & NZ summer", link: "/theme/australia-newzealand" },

      // { title: "La Tomatina", link: urls.travel_planner.LATOMATINA },
      { title: "Europe under 1 Lakh", link: urls.travel_planner.EUROPE_1_LAKH },
    ],
  },
  {
    heading: "Company",
    data: [
      { title: "Blogs", link: ["https://blog.thetarzanway.com/"] },
      { title: "For Corporates", link: urls.CORPORATES },
      { title: "Testimonials", link: urls.TESTIMONIALS },
      { title: "About Us", link: urls.ABOUT_US },
      { title: "Contact Us", link: urls.CONTACT },
    ],
  },
  {
    heading: "Terms & Policies",
    data: [
      { title: "Terms of Service", link: urls.TERMS_CONDITIONS },
      { title: "Privacy Policy", link: urls.PRIVACY_POLICY },
      { title: "COVID-19 Safety", link: urls.COVID_19_SAFE_TRAVEL_INDIA },
      { title: "Subscribe", link: "" },
    ],
  },
];

export default linksArr;
