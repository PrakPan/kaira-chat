// Log specific events happening.
export const event = ({ action, params }) => {
  window.gtag("event", action, params);
};

// Log the pageview with their URL
export const pageview = (url) => {
  window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALTICS_ID, {
    page_path: url,
  });
};

export const callback_event = ({ action, callback }) => {
  window.gtag("event", action, {
    event_callback: callback,
  });
};



export const logEvent = ({ action, params }) => {
  window.gtag("event", action, params);
};
