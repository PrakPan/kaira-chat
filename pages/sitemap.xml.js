import axios from "axios";
import axiospagelistinstance from "../services/pages/list";
import axioscountrydetailsinstance from "../services/pages/country";
import axiossearchallinstance from "../services/search/all";

const Sitemap = () => {
  return null;
};

// export const getStaticProps = async ({ res }) => {
//   const BASE_URL = "https://thetarzanway.com";

//   // Fetch continents list :-
//   const continents = await axiospagelistinstance(
//     "/?page_type=Continent&fields=path"
//   );
//   const continentsData = continents.data;
//   let continentsPaths = continentsData.map((object) => {
//     return { title: "Continent Planner", link: BASE_URL + "/" + object.path };
//   });

//   // Fetch Countries list :-
//   const countries = await axioscountrydetailsinstance("/all?fields=path");
//   const countriesData = countries.data;
//   let countriesPaths = countriesData.map((object) => {
//     return { title: "Country Planner", link: BASE_URL + "/" + object.path };
//   });

//   // Fetch States list :-
//   const states = await axiossearchallinstance(
//     "/?type=State&fields=path"
//   );
//   const statesData = states.data;
//   let statesPaths = statesData.map((object) => {
//     return {
//       title: "State Planner",
//       link: BASE_URL + "/" + object.path,
//     };
//   });

//   //Fetch city list
//   const cities = await axiossearchallinstance(
//     `/?type=Location&fields=path`
//   );
//   const citiesdata = await cities.json();

//   let citypaths = citiesdata.map((object) => {
//     return { title: "City Planner", link: BASE_URL + "/" + object.path };
//   });
//   const StaticPaths = [
//     { title: "Home Page", link: BASE_URL },
//     { title: "Travel Guide", link: BASE_URL + "/travel-guide" },
//     {
//       title: "COVID-19 Safe Travel India",
//       link: BASE_URL + "/covid-19-safe-travel-india",
//     },
//     { title: "Travel Experiences", link: BASE_URL + "/travel-experiences}" },
//   ];
//   const allPaths = [
//     ...StaticPaths,
//     ...continentsPaths,
//     ...countriesPaths,
//     ...statesPaths,
//     ...citypaths,
//   ];
//   {
//   }
//   const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
//     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//       ${allPaths
//         .map((el) => {
//           return `
//             <url>
//               <loc>${el.link}</loc>
//               <lastmod>${new Date().toISOString()}</lastmod>
//               <changefreq>monthly</changefreq>
//               <priority>1.0</priority>
//             </url>
//           `;
//         })
//         .join("")}
//     </urlset>
// `;

//   res.setHeader("Content-Type", "text/xml");
//   res.write(sitemap);
//   res.end();

//   return {
//     props: {},
//   };
// };

export default Sitemap;
