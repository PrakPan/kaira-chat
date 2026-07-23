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
      { title: "Personalise", link: "" },
      { title: "La Tomatina", link: urls.travel_planner.LATOMATINA },
      { title: "Summer Holidays", link: urls.travel_planner.SUMMER },
      { title: "Road Trips", link: urls.travel_planner.ROADTRIPS },
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
