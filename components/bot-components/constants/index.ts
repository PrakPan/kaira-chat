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