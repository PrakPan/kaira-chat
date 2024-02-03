module.exports = {
  distDir: "temp",
  async redirects() {
    return [
      {
        source: "/sitemap",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/itinerary/preview/:id",
        destination: "/itinerary/:id",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d31aoa0ehgvjdi.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "q-xx.bstatic.com",
      },
      {
        protocol: "https",
        hostname: "i.travelapi.com",
      },
      {
        protocol: "https",
        hostname: "imgak.mmtcdn.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    nextScriptWorkers: true,
    http2: true, // Enable HTTP/2 support
    push: true, // Enable server push
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
