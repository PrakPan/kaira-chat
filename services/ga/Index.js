import { CONTENT_SERVER_HOST } from "../constants";

// Log specific events happening.
export const event = ({ action, params }) => {
  if (
    process.env.NODE_ENV === "production" &&
    !CONTENT_SERVER_HOST.includes("dev")
  ) {
    window.gtag("event", action, params);
  }
};

// Log the pageview with their URL
export const pageview = (url) => {
  if (
    process.env.NODE_ENV === "production" &&
    !CONTENT_SERVER_HOST.includes("dev")
  ) {
    window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALTICS_ID, {
      page_path: url,
    });
  }
};

export const callback_event = ({ action, callback }) => {
  if (
    process.env.NODE_ENV === "production" &&
    !CONTENT_SERVER_HOST.includes("dev")
  ) {
    window.gtag("event", action, {
      event_callback: callback,
    });
  }
};

export const logEvent = ({ action, params }) => {
  if (
    process.env.NODE_ENV === "production" &&
    !CONTENT_SERVER_HOST.includes("dev")
  ) {
    window.gtag("event", action, params);
  }
};
