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
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
};
