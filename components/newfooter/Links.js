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
    heading: "Travel Styles",
    data: [
      { title: "Personalise", link: "" },
      { title: "Workcation", link: urls.travel_planner.WORKCATION },
      { title: "Volunteer", link: urls.travel_planner.VOLUNTEER },
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
    ],
  },
];

export default linksArr;
