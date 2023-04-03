const moduleExports = {
  async redirects() {
    return [
      {
        source: '/sitemap',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/itinerary/preview/:id',
        destination: '/itinerary/:id',
        permanent: true,
      },
    ];
  },
};
module.exports = moduleExports;
