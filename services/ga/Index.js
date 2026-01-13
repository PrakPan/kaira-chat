import { CONTENT_SERVER_HOST } from "../constants";

const isProduction = process.env.NODE_ENV === "production" && !CONTENT_SERVER_HOST.includes("dev");

// Log specific events happening.
export const event = ({ action, params }) => {
  if (isProduction && window.dataLayer) {
    window.dataLayer.push({
      event: action,
      ...params
    });
  }
};

// Log the pageview with their URL
export const pageview = (url) => {
  if (isProduction && window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_path: url
    });
  }
};

export const callback_event = ({ action, callback }) => {
  if (isProduction && window.dataLayer) {
    window.dataLayer.push({
      event: action,
      eventCallback: callback
    });
  }
};

export const logEvent = ({ action, params }) => {
  if (isProduction && window.dataLayer) {
    window.dataLayer.push({
      event: action,
      ...params
    });
  }
};
