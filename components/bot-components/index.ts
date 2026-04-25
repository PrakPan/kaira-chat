
export { default as ViewToggle } from './components/ViewToggle';
export { default as MapView } from './components/MapView';
export { default as ItineraryView } from './components/ItineraryView';

// Map Components
export { default as MapLegend } from './components/MapLegend';
export { default as LoadingOverlay } from './components/LoadingOverlay';

// Itinerary Components
export { default as ItineraryContent } from './components/ItineraryContent';
export { default as ItineraryShimmer } from './components/ItineraryShimmer';
export { default as EmptyItinerary } from './components/EmptyItinerary';
export { default as CitySection } from './components/CitySection';
export { default as HotelInfo } from './components/HotelInfo';
export { default as TransferSection } from './components/TransferSection';
export { default as TransferIcon } from './components/TransferIcon';

// Preserved Components
export { ChatKitPanel } from './components/ChatKitPanel';
export { default as DayByDay } from './components/DayByDay';

// New UI Components
export { default as Sidebar } from './components/Sidebar';
export { default as StartScreen } from './components/StartScreen';

// ============================================================================
// HOOKS
// ============================================================================

export { useUserLocation } from './hooks/useUserLocation';
export { useMapBounds } from './hooks/useMapBounds';

// ============================================================================
// TYPES
// ============================================================================

export type {
  // Location Types
  Location,
  UserLocation,
  MapState,
  
  // Itinerary Types
  City,
  SlabElement,
  DayByDay as DayByDayType,
  Route,
  ItineraryData,
  
  // Transfer Types
  TransferCity,
  TransferData,
  TransfersData,
  
  // UI Types
  ViewMode,
  BotMode,
  
  // Component Props
  MapViewProps,
  ItineraryViewProps,
  ViewToggleProps,
} from './types';

// ============================================================================
// CONSTANTS
// ============================================================================

export {
  STORAGE_KEYS,
  MAP_CONFIG,
  COLORS,
  API_ENDPOINTS,
  TRANSFER_MODES,
} from './constants';

// ============================================================================
// UTILITIES
// ============================================================================

export {
  safeJsonParse,
  formatDuration,
  formatLocationCount,
  getCachedUserLocation,
  cacheUserLocation,
  createBoundsFromLocations,
} from './utils/helper';