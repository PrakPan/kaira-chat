import axios from "axios";
const Sitemap = () => {
  return null;
};

export const getServerSideProps = async ({ res }) => {
  const BASE_URL = "https://thetarzanway.com";

  // Fetch continents list :-
  const continents = await axios.get(
    "https://apis.tarzanway.com/page/list?page_type=Continents&fields=path"
  );
  const continentsData = continents.data;
  let continentsPaths = continentsData.map((object) => {
    return { title: "Continent Planner", link: BASE_URL + "/" + object.path };
  });

  // Fetch Countries list :-
  const countries = await axios.get(
    "https://apis.tarzanway.com/poi/country/all?fields=path"
  );
  const countriesData = countries.data;
  let countriesPaths = countriesData.map((object) => {
    return { title: "Country Planner", link: BASE_URL + "/" + object.path };
  });

  // Fetch States list :-
  const states = await axios.get(
    "https://apis.tarzanway.com/search/all/?type=State&fields=path"
  );
  const statesData = states.data;
  let statesPaths = statesData.map((object) => {
    return {
      title: "State Planner",
      link: BASE_URL + "/" + object.path,
    };
  });

  //Fetch city list
  const cities = await fetch(
    `https://apis.tarzanway.com/search/all/?type=Location&fields=path`
  );
  const citiesdata = await cities.json();

  let citypaths = citiesdata.map((object) => {
    return { title: "City Planner", link: BASE_URL + "/" + object.path };
  });
  const StaticPaths = [
    { title: "Home Page", link: BASE_URL },
    { title: "Travel Guide", link: BASE_URL + "/travel-guide" },
    {
      title: "COVID-19 Safe Travel India",
      link: BASE_URL + "/covid-19-safe-travel-india",
    },
    { title: "Travel Experiences", link: BASE_URL + "/travel-experiences}" },
  ];
  const allPaths = [
    ...StaticPaths,
    ...continentsPaths,
    ...countriesPaths,
    ...statesPaths,
    ...citypaths,
  ];
  {
    /* <title>${el.title}</title>; */
  }
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

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
