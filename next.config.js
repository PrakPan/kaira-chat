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
    // Route every <Image> through our Serverless Image Handler so our own media
    // is resized/re-encoded at the edge (external hosts & local assets pass
    // through untouched). Replaces `unoptimized: true` — same pixels, far fewer
    // bytes. Compatible with `output: "export"` because the loader runs client-
    // side and returns a ready-to-use URL.
    loader: "custom",
    loaderFile: "./image-loader.js",
    // domains:[''],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d31aoa0ehgvjdi.cloudfront.net",
      },
      {
        protocol: "http",
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
      },
    ],
  },

  experimental: {
    nextScriptWorkers: true,
    forceSwcTransforms: true,
    instrumentationHook: true,
    // Tree-shake barrel imports so a `import { X } from "@mui/material"` pulls
    // only X, not the whole library. These packages dominated the ~571 KB
    // shared chunk (489 KB of it unused). Officially supported in Next 13.5+;
    // transparent (same imports) and only affects build-time bundling.
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "@mui/lab",
      "@mui/x-date-pickers",
      "react-icons",
      "date-fns",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/free-regular-svg-icons",
      "@fortawesome/free-brands-svg-icons",
    ],
  },

  // webpack: (config) => {
  //   config.plugins.push(
  //     new (require('copy-webpack-plugin'))({
  //       patterns: [
  //         {
  //           from: 'lib/analytics.js',
  //           to: 'static/dev.jupiter-analytics.js',
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

// Bundle analyzer is a no-op unless ANALYZE=true, so it is safe to always wrap.
// Run `ANALYZE=true npm run build` to inspect chunk composition (e.g. the 571 KB
// shared vendor chunk) and confirm optimizePackageImports' effect.
module.exports = withSentryConfig(withBundleAnalyzer(nextConfig), {
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