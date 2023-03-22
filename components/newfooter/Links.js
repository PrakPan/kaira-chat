import urls from "../../services/urls";
const linksArr = [
  {
    heading: "Travel Destinations",
    data: [
      { title: "Andaman", link: urls.travel_planner.ANDAMAN },
      { title: "Himachal Pradesh", link: urls.travel_planner.HIMACHAL },
      { title: "Goa", link: urls.travel_planner.GOA },
      { title: "Jammu & Kashmir", link: urls.travel_planner.KASHMIR },
      { title: "Ladakh", link: urls.travel_planner.LADAKH },
    ],
  },
  {
    heading: "Travel Styles",
    data: [
      { title: "Personalise", link: urls.TAILORED_TRAVEL },
      { title: "Workcation", link: urls.travel_planner.WORKCATION },
      { title: "Volunteer", link: urls.travel_planner.VOLUNTEER },
      // { title: "Treks", link: urls.travel_planner.TREKS },
      { title: "Road Trips", link: urls.travel_planner.ROADTRIPS },
      { title: "Unique", link: urls.travel_planner.OFFBEAT },
    ],
  },
  {
    heading: "Company",
    data: [
      { title: "Blogs", link: ["http://blog.thetarzanway.com/"] },
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
      { title: "Sitemap", link: "" },
    ],
  },
];

export default linksArr;
