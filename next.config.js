const { withSentryConfig } = require("@sentry/nextjs");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  distDir: process.env.BUILD_DIR || ".next",
  // output: "export",
  // trailingSlash: true,
  // skipTrailingSlashRedirect: true,

  images: {
  domains: [
    "d31aoa0ehgvjdi.cloudfront.net",
    "q-xx.bstatic.com",
    "i.travelapi.com",
    "imgak.mmtcdn.com",
    "res.cloudinary.com",
    "lh3.googleusercontent.com",
    "maps.googleapis.com",
    "mercury.tarzanway.com"
  ],
},

  experimental: {
    nextScriptWorkers: true,
    forceSwcTransforms: true,
    instrumentationHook: true,
  },

  // webpack: (config) => {
  //   config.plugins.push(
  //     new (require('copy-webpack-plugin'))({
  //       patterns: [
  //         {
  //           from: 'lib/analytics.js',
  //           to: 'static/jupiter-analytics.js',
  //         },
  //       ],
  //     })
  //   );
  //   return config;
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

// module.exports = withBundleAnalyzer(nextConfig);

module.exports = withSentryConfig(nextConfig, {
  org: "the-tarzan-way",
  project: "front-end",
  experimental:{
    workerThreads: true,
    cpus:3,
  },

  // An auth token is required for uploading source maps.
  authToken: process.env.SENTRY_AUTH_TOKEN,

  silent: false, // Can be used to suppress logs
  tunnelRoute: "/monitoring-tunnel",
});
