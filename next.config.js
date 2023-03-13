const withImages = require('next-images')
const moduleExports =  withImages({
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
      ]
    },
})
module.exports =  (moduleExports);