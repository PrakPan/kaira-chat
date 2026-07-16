// Storage Keys
export const STORAGE_KEYS = {
  USER_LOCATION: "userLocation",
} as const;

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_ZOOM: 12,
  USER_LOCATION_ZOOM: 13,
  BOUNDS_PADDING: {
    top: 80,
    right: 60,
    bottom: 80,
    left: 60,
  },
} as const;

// Color Palette
export const COLORS = {
  PRIMARY_BLUE: "#4285F4",
  MARKER_RED: "#EA4335",
  HOTEL_ACCENT: "#FD6D6C",
  CITY_HEADER_BG: "#FFF5EF",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  LOCATION: "https://ipapi.co/json/",
} as const;

// Transfer Modes
export const TRANSFER_MODES = {
  FLIGHT: "Flight",
  FERRY: "Ferry",
  TRAIN: "Train",
  BUS: "Bus",
} as const;
// Logo render heights. Both artboards (/logo/ttw-lockup.svg and ttw-mark.svg)
// reserve the same padding for the -4deg tilt, so an equal height gives an
// equal-sized tile — keep each surface on these values rather than a local
// magic number, or the mark changes size as the user moves between them.
export const LOGO_HEIGHT = {
  /** Desktop rail (components/Sidebar) — collapsed mark and expanded lockup. */
  DESKTOP: 38,
  /**
   * Every mobile header bar: BotApp's MobileHeader and ChatWelcomeScreen's
   * own bar on /chat. Shorter than desktop because the mobile bar is a single
   * compact row that also fits three actions on a ~360px viewport.
   */
  MOBILE: 32,
} as const;
