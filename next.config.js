<<<<<<< HEAD
const withImages = require('next-images')
const { withSentryConfig } = require('@sentry/nextjs');


const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  debug: true, // Suppresses all logs
  silient: true,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const moduleExports =  withImages({
  compiler: {
    removeConsole: true,
  },
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

module.exports = withSentryConfig(withBundleAnalyzer(moduleExports, sentryWebpackPluginOptions));
=======
module.exports = {
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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd31aoa0ehgvjdi.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'q-xx.bstatic.com',
      },
    ],
  },
  // images: {
  //   disableStaticImages: true,
  // },
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
};
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
