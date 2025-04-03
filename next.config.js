const { withSentryConfig } = require("@sentry/nextjs");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  distDir: process.env.BUILD_DIR || ".next",
  output: "export",
  // trailingSlash: true,
  // skipTrailingSlashRedirect: true,

  images: {
    unoptimized: true,
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
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol:"https",
        hostname:"maps.googleapis.com"
      }
    ],
  },

  experimental: {
    nextScriptWorkers: true,
    forceSwcTransforms: true,
    instrumentationHook: true,
  },

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
