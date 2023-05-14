import React from 'react';

const Sitemap = () => {
  return null;
};

export const getServerSideProps = async ({ res }) => {
  const BASE_URL = 'https://thetarzanway.com';

    //Fetch city list 
    const cities = await fetch(`https://apis.tarzanway.com/search/all/?type=Location`)
    const citiesdata = await cities.json();
    
    let citypaths = citiesdata.map((object) => {
                return BASE_URL+"/travel-guide/city/"+object.cta
    })
    // let thingspaths = citiesdata.map((object) => {
    //   return BASE_URL+"/travel-guide/city/"+object.cta+"/things-to-do"
    // })

  let citypaths = citiesdata.map((object) => {
    return BASE_URL + '/travel-guide/city/' + object.cta;
  });
  let thingspaths = citiesdata.map((object) => {
    return BASE_URL + '/travel-guide/city/' + object.cta + '/things-to-do';
  });

  const experiences = await fetch(
    `https://apis.tarzanway.com/search/all/?type=Experience`
  );
  const experiencesdata = await experiences.json();
  let experiencepaths = experiencesdata.map((object) => {
    return BASE_URL + '/travel-experiences/' + object.cta;
  });

  // const staticPaths = fs
  // .readdirSync("pages")
  // .filter((staticPage) => {
  //   return ![
  //     "api",
  //     '._app.js.swp',
  //     "_app.js",
  //     "_document.js",
  //     "404.js",
  //     '500.js',
  //     'index.js',
  //     "sitemap.xml.js",
  //     "about-us.js",
  //     "contact.js",
  //     "testimonials.js",
  //     "itinerary",
  //     "dashboard",
  //     "preview-travel-experiences.js",
  //     "test.js"
  //   ].includes(staticPage);
  // })
  // .map((staticPagePath) => {
  //   return `${BASE_URL}/${staticPagePath}`;
  // });
  const StaticPaths = [
    BASE_URL,
    BASE_URL + '/travel-guide',
    BASE_URL + '/covid-19-safe-travel-india',
    BASE_URL + '/travel-experiences',
  ];
  const allPaths = [
    ...StaticPaths,
    ...citypaths,
    ...thingspaths,
    ...experiencepaths,
  ];


    ]
    // const allPaths = [
    //   ...StaticPaths,
    //   ...citypaths,
    //   ...thingspaths,
    //   ...experiencepaths,
    // ];
    const allPaths = [
      ...StaticPaths,
      ...citypaths,
      ...experiencepaths,
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPaths
        .map((url, index) => {
          return `
            <url ${index}>
              <loc>${url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>1.0</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
