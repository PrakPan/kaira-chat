import * as Sentry from "@sentry/nextjs";
import { SENTRY_DSN, SENTRY_ENV } from "./services/constants";

Sentry.init({
  dsn: SENTRY_DSN,
  release: "thetarzanway-frontend@" + process.env.BUILD_NUMBER,
  environment: SENTRY_ENV,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

    environment: process.env.SENTRY_ENV,
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
