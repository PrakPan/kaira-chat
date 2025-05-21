// const { default: axios } = require("axios");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { MERCURY_HOST } = require("../services/constants");

const generateSitemap = async () => {
  const BASE_URL = "https://thetarzanway.com";

  // Fetch continents list
  const continents = await axios.get(
    "https://apis.tarzanway.com/page/list?page_type=Continent&fields=path"
  );
  const continentsData = continents.data;
  let continentsPaths = continentsData.map((object) => {
    return {
      title: "Continent Planner",
      link: BASE_URL + "/" + object.path,
    };
  });

  // Fetch countries list
  const countries = await axios.get(
    "https://apis.tarzanway.com/poi/country/all?fields=path"
  );
  const countriesData = countries.data;
  let countriesPaths = countriesData.map((object) => {
    return { title: "Country Planner", link: BASE_URL + "/" + object.path };
  });

  // Fetch states list
  const states = await axios.get(
    "https://apis.tarzanway.com/search/all/?type=State&fields=path"
  );
  const statesData = states.data;

  let statesPaths = statesData.map((object) => {
    return {
      title: "State Planner",
      link: BASE_URL + "/" + object.path.replaceAll(" ", "_").toLowerCase(),
    };
  });

  // Fetch cities list
  const cities = await axios.get(
    "https://apis.tarzanway.com/search/all/?type=Location&fields=path"
  );
  const citiesData = cities.data;

  let cityPaths = citiesData.map((object) => {
    return { title: "City Planner", link: BASE_URL + "/" + object.path };
  });

  // Fetch trips list
  const response = await axios.get(
    "https://suppliers.tarzanway.com/sales/itinerary/indexed/"
  );
  const trips = response.data.map((trip) => {
    let group_type = trip?.group_type
      ? trip.group_type.replaceAll(" ", "_").toLowerCase()
      : "group";
    return {
      path: group_type + "/" + trip.slug,
    };
  });

  let tripsPaths = trips.map((trip) => {
    return {
      title: "Trip",
      link: BASE_URL + "/trips/" + trip.path,
    };
  });

  const StaticPaths = [
    { title: "Home Page", link: BASE_URL },
    {
      title: "COVID-19 Safe Travel India",
      link: BASE_URL + "/covid-19-safe-travel-india",
    },
    { title: "All Destinations", link: BASE_URL + "/destinations" },
    { title: "Corporates", link: BASE_URL + "/corporates" },
  ];

  const allPaths = [
    ...StaticPaths,
    ...continentsPaths,
    ...countriesPaths,
    ...statesPaths,
    ...cityPaths,
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
    `https://dev.mercury.tarzanway.com/api/v1/geos/pages/all/`
  );
  fs.writeFileSync(
    path.join(process.cwd(), "public", "PagesToIdMapping.json"),
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
