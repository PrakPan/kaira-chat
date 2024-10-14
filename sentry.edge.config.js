import * as Sentry from "@sentry/nextjs";
import { SENTRY_DSN } from "./services/constants"

Sentry.init({
    dsn: SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for tracing.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    environment: process.env.SENTRY_ENV,
});
