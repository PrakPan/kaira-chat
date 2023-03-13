// const withImages = require('next-images')
// const { withSentryConfig } = require('@sentry/nextjs');


// const sentryWebpackPluginOptions = {
//   // Additional config options for the Sentry Webpack plugin. Keep in mind that
//   // the following options are set automatically, and overriding them is not
//   // recommended:
//   //   release, url, org, project, authToken, configFile, stripPrefix,
//   //   urlPrefix, include, ignore

//   debug: true, // Suppresses all logs
//   silient: true,
//   // For all available options, see:
//   // https://github.com/getsentry/sentry-webpack-plugin#options.
// };


// const moduleExports =  withImages({
//   compiler: {
//     removeConsole: true,
//   },
//   async redirects() {
//       return [
//         {
//           source: '/sitemap',
//           destination: '/sitemap.xml',
//           permanent: true,
//         },
//         {
//           source: '/itinerary/preview/:id',
//           destination: '/itinerary/:id',
//           permanent: true,
//         },
//       ]
//     },
// })

// module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);



const withImages = require('next-images')
<<<<<<< HEAD
const moduleExports =  withImages({  async redirects() {
  return [
    {
      source: '/sitemap',
      destination: '/sitemap.xml',
      permanent: true,
=======
 

 


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
>>>>>>> 4db23b0667e46e616ddb7577713bc4c26030da57
    },
    {
      source: '/itinerary/preview/:id',
      destination: '/itinerary/:id',
      permanent: true,
    },
  ]
},
})
<<<<<<< HEAD
=======

>>>>>>> 4db23b0667e46e616ddb7577713bc4c26030da57
module.exports =  (moduleExports);