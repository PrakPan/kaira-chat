module.exports = {
  distDir: process.env.BUILD_DIR || ".next",
  output: "export",
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

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
    ],
  },

  experimental: {
    nextScriptWorkers: true,
    forceSwcTransforms: true,
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
