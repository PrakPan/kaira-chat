export const event = ({ action, params }) => {
  window.gtag("event", action, params);
};

export const callback_event = ({ action, callback }) => {
  window.gtag("event", action, {
    event_callback: callback,
  });
};

export const logEvent = ({ action, params }) => {
  window.gtag("event", action, params);
};
