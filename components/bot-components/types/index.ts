// Location and Map Types
export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating?: number;
  type?: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  city: string;
  regionName: string;
  country: string;
}

export interface MapState {
  lat: number;
  lng: number;
  zoom: number;
}

// Itinerary Types
export interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  duration: number;
  accent: string;
  preferences?: string;
}

export interface SlabElement {
  id: string;
  type: string;
  time: string;
  name: string;
  rating: number;
}

export interface DayByDay {
  date: string;
  slab_elements: SlabElement[];
}

export interface Route {
  city: City;
  start_date: string;
  end_date: string;
  arrival_transfers: string[];
  departure_transfers: string[];
  day_by_day: DayByDay[];
  hotels: string;
}

export interface ItineraryData {
  name: string;
  routes: Route[];
}

// Transfer Types
export interface TransferCity {
  id: string;
  name: string;
}

export interface TransferData {
  from_city: TransferCity;
  to_city: TransferCity;
  transfer_mode: "Flight" | "Ferry" | "Train" | "Bus";
}

export interface TransfersData {
  route: TransferData[];
}

// UI Types
export type ViewMode = "map" | "itinerary" | "routes" | "bookings";
export type BotMode = "p1" | "p2";

// Component Props Types
export interface MapViewProps {
  mapState: MapState;
  locations: Location[] | null;
  userLocation: UserLocation | null;
  currentRoute: Location[] | null;
  isLoadingLocation: boolean;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
   isRoutePreparing?: boolean;
}

export interface ItineraryViewProps {
  itineraryData: ItineraryData | null;
  transfers: TransfersData | null;
  showShimmer: boolean;
}

export interface ViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}