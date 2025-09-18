// const { default: axios } = require("axios");
const axios = require("axios");
const fs = require("fs");
const { baseApiUrl } = require("mapbox-gl");
const path = require("path");
require('dotenv').config();

console.log("Hi",process.env.YOUR_ENV_VAR,process.env.NEXT_PUBLIC_MERCURY_HOST);

const generateSitemap = async () => {
  const BASE_URL = process.env.NEXT_PUBLIC_MERCURY_HOST;
  const PROD_BASE_URL=  "https://thetarzanway.com";

  // Fetch continents list
  const continents = await axios.get(
    `${BASE_URL}/api/v1/website/pages/?page_type=Continent&fields=path`
  );
  const continentsData = continents.data.data.pages;
  let continentsPaths = continentsData
  .filter((object) => object.slug !== undefined)
  .map((object) => {
    return {
      title: "Continent Planner",
      link: PROD_BASE_URL + "/" + object.slug,
    };
  });

  // Fetch countries list
  const countries = await axios.get(
    `${BASE_URL}/api/v1/geos/country/?fields=path`
  );
  const countriesData = countries.data.data.countries;
  let countriesPaths = countriesData
  .filter((object) => object.path !== undefined && object.path.split("/").length === 2)
  .map((object) => {
    return { title: "Country Planner", link: PROD_BASE_URL + "/" + object.path };
  });

  // Fetch states list
  const states = await axios.get(
    `${BASE_URL}/api/v1/geos/state/?fields=path`
  );
  const statesData = states.data.data.states;

  let statesPaths = statesData
  .filter((object) => object.path !== undefined)
  .map((object) => {
    return {
      title: "State Planner",
      link: PROD_BASE_URL + "/" + object.path.replaceAll(" ", "_").toLowerCase(),
    };
  });

  // Fetch cities list
  const cities = await axios.get(
    `${BASE_URL}/api/v1/geos/city/?fields=path`
  );
  const citiesData = cities.data.data.cities;

  let cityPaths = citiesData
  .filter((object) => object.path !== undefined)
  .map((object) => {
    return { title: "City Planner", link: PROD_BASE_URL + "/" + object.path };
  });

  const subRegions=await axios.get(`${BASE_URL}/api/v1/website/pages/?page_type=Subregion&fields=path`)
  const subRegionsData=subRegions.data.data.pages
  let subRegionsPaths=subRegionsData.map((object)=>{
    return {title:"Subregion Planner",link:PROD_BASE_URL +"/"+object.path}
  })

  // Fetch trips list
  const response = await axios.get(
    "https://suppliers.tarzanway.com/sales/itinerary/indexed/"
  );
  const trips = response.data.map((trip) => {
    let group_type = trip?.group_type
      ? trip.group_type.replaceAll(" ", "_").toLowerCase()
      : "family";
    return {
      path: group_type + "/" + trip.slug,
    };
  });

  let tripsPaths = trips.map((trip) => {
    return {
      title: "Trip",
      link: PROD_BASE_URL + "/trips/" + trip.path,
    };
  });

  const StaticPaths = [
    { title: "Home Page", link: PROD_BASE_URL},
    {
      title: "COVID-19 Safe Travel India",
      link: PROD_BASE_URL + "/covid-19-safe-travel-india",
    },
    { title: "All Destinations", link: PROD_BASE_URL + "/destinations" },
    { title: "Corporates", link: PROD_BASE_URL + "/corporates" },
  ];

  const allPaths = [
    ...StaticPaths,
    ...continentsPaths,
    ...countriesPaths,
    ...statesPaths,
    ...cityPaths,
    ...subRegionsPaths,
    ...tripsPaths,
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPaths
        .map((el) => {
          return `
            <url>
              <loc>${el.link}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>1.0</priority>
            </url>
          `;
        })
        .join("")}
    </urlset>
  `;
  const PagesToIdJson = await axios.get(
    `${BASE_URL}/api/v1/geos/pages/all/`
  );
  fs.writeFileSync(
    path.join(process.cwd(),"data", "PagesToIdMapping.json"),
    JSON.stringify(PagesToIdJson.data, null, 2),
    "utf8"
  );

  fs.writeFileSync(
    path.join(process.cwd(), "public", "sitemap.xml"),
    sitemap,
    "utf8"
  );
  console.log("Sitemap generated successfully!");
};

generateSitemap().catch((error) => {
  console.error("Error generating sitemap:", error);
});
