import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { optimizedMediaUrl } from "../../lib/mediaImage";
import {
  ChatKitPanel,
  COMPLETION_STARTED_EFFECTS,
  type ChatSendFn,
} from "./components/ChatKitPanel";
import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import { getUserAvatarColor, getUserInitial } from "./utils/avatarColor";
import { formatCompactTime, groupThreads } from "./utils/threadGroups";
import { loadGoogleMaps } from "./utils/loadGoogleMaps";
import { LOGO_HEIGHT } from "./constants";
import {
  HistoryIcon as KairaHistoryIcon,
  LogoutIcon as KairaLogoutIcon,
  MapIcon as KairaMapIcon,
  PlusIcon as KairaPlusIcon,
  SuitcaseIcon as KairaSuitcaseIcon,
  UserIcon as KairaUserIcon,
} from "./components/kairaIcons";
import { useTripsCount } from "./hooks/useTripsCount";
import StartScreen, { type TravellerStory } from "./components/StartScreen";
import IntakeLeftPanel from "./components/IntakeLeftPanel";
import type { ThemeConfig } from "./types/themeConfig";
import ChatWelcomeScreen from "./components/ChatWelcomeScreen";
import BrandLockup from "../brand/BrandLockup";
import ItineraryShimmer from "./components/ItineraryShimmer";
import { useUserLocation } from "./hooks/useUserLocation";
import { useMapBounds } from "./hooks/useMapBounds";
import { getPlatform, type ThemeSelectedItem } from "./hooks/useChat";
import {
  getThemeForm,
  type ThemeForm,
} from "../theme/cinematic/themeForms";
import { getThemePagePath } from "../theme/cinematic/palettes";
import ItineraryContainer from "../../containers/itinerary/ItineraryContainer";
import ItineraryLegend from "../itinerary/itineraryCity/ItineraryLegend";
import type {
  Location,
  ItineraryData,
  TransfersData,
  MapState,
  ViewMode,
  BotMode,
} from "./types";
import { useDispatch } from "react-redux";
import setItineraryIdAction from "../../store/actions/itineraryId";
import setItineraryStatus from "../../store/actions/itineraryStatus";
import { resetIntakeForm, updateIntakeForm } from "../../store/actions/intakeForm";
import setItineraryDaybyDay from "../../store/actions/itineraryDaybyDay";
import setItinerary from "../../store/actions/itinerary";
import setBreif from "../../store/actions/breif";
import { setGalleryImages } from "../../store/actions/galleryImages";
import { setTransfersBookings } from "../../store/actions/transferBookingsStore";
import { setStays } from "../../store/actions/StayBookings";
// ChatBot removed — only ChatKitPanel is used now
import ConfirmationModal from "./components/ConfirmationModal";
import { useSelector } from "react-redux";
import setCart from "../../store/actions/Cart";
import { openNotification } from "../../store/actions/notification";
import { setUnreadMessages, setThreadCustomerName } from "../../store/actions/chatState";
import axios from "axios";
import { MERCURY_HOST, CHATKIT_API_URL } from "../../services/constants";
import SmallGallery from "../../containers/newitinerary/overview/SmallGallery";
import NewSummaryContainers from "../../containers/itinerary/NewSummaryContainers";
import Image from "next/image";
import { useRouter } from "next/router";
import ModalWithBackdrop from "../ui/ModalWithBackdrop";
import BottomModal from "../ui/LowerModal";
import Settings from "../settings/Index";
import { SocialShareDesktop } from "../../containers/itinerary/booking1/SocialShare";
import NotificationPopup from "../ui/NotificationPopup";
import BotLoginModal from "./components/BotLoginModal";
import { createPortal } from "react-dom";
import { currencySymbols } from "../../data/currencySymbols";
import { formatCurrencyValue } from "../../services/formatCurrencyValue";
import { useAnalytics } from "../../hooks/useAnalytics";
import {
  FUNNELS,
  reportFunnelStage,
  getChatFunnelScope,
} from "../../services/analyticsFunnel";
import Login from "../modals/Login";
import { replaceUrl, pushUrlDetached } from "../../helper/historyUrl";
import { FiCalendar } from "react-icons/fi";
import { tr } from "date-fns/locale";
import {
  takePendingFiles,
  takePendingSeed,
  takePendingSeedMeta,
} from "../../services/heroChatHandoff";

type MobilePanel = "map" | "chat" | "itinerary";
type LeftPanelMode = "default" | "itinerary-loading" | "itinerary-ready";

// The noun follows the trip's group_type ("Family" → "families"), so the line
// reads as social proof from people like the traveller. Irregular plurals are
// listed; anything else takes a trailing "s".
const GROUP_TYPE_PLURALS: Record<string, string> = {
  family: "families",
  couple: "couples",
  solo: "solo travellers",
  friends: "friends",
  group: "groups",
};

const groupTypePlural = (groupType?: string | null): string => {
  const key = groupType?.trim().toLowerCase();
  if (!key) return "travellers";
  return GROUP_TYPE_PLURALS[key] ?? `${key}s`;
};

// How many other trips on this route share the traveller's group_type, read off
// the detail payload's `similar_route_stats.group_type_stats` ({ Couple: 13,
// Family: 17, … }) and matched to `group_type` case-insensitively. Returns null
// whenever there is nothing worth claiming — drafts and the bot flow carry no
// stats at all, and a count of 1 is left out because the copy is plural and
// "1 couples" would need singular/verb agreement the line doesn't have.
const routeSocialProofCount = (
  stats: any,
  groupType?: string | null,
): number | null => {
  const key = groupType?.trim().toLowerCase();
  const byGroupType = stats?.group_type_stats;
  if (!key || !byGroupType) return null;
  const match = Object.entries(byGroupType).find(
    ([name]) => name.trim().toLowerCase() === key,
  );
  const count = match?.[1];
  return typeof count === "number" && count > 1 ? count : null;
};

// Returns a fragment, not a row: the mobile card shares its flex row with the
// settings/share icons, while desktop gives it a row of its own. `wrap` lets the
// caller drop the single-line ellipsis so the line wraps to its full text — used
// on the narrow mobile card, where truncating would clip "…have chosen".
const KairaSocialProof = ({
  count,
  groupType,
  wrap = false,
}: {
  count: number;
  groupType?: string | null;
  wrap?: boolean;
}) => (
  <>
    <span className="shrink-0 w-[30px] h-[30px] rounded-full overflow-hidden bg-gradient-to-b from-[#a8d2f5] to-[#7ab8e8]">
      <img
        src="/KairaInsta.png"
        alt="Kaira"
        className="w-full h-full object-cover"
      />
    </span>
    <span
      className={`min-w-0 ${
        wrap ? "" : "truncate"
      } text-[13px] max-ph:text-[12px] font-inter text-[#4b5159]`}
    >
      <span className="font-semibold text-[#0B1220]">
        {count} {groupTypePlural(groupType)}
      </span>{" "}
      have chosen this route
    </span>
  </>
);

// Hairline long arrow separating route stops in the header card. Matches the
// carousel cards' `.arrow` (a 1px rule with a small chevron head).
const RouteArrow = () => (
  <svg
    width="22"
    height="8"
    viewBox="0 0 22 8"
    fill="none"
    aria-hidden
    className="shrink-0"
  >
    <path
      d="M0 4h20M17 1l3.2 3-3.2 3"
      stroke="#c3c7cc"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// The Map / Bookings / Route views have no tab strip to return through, so each
// carries this. It's a rounded pill; positioning is left to BackToItineraryBar,
// which pins it centered, just above the cart bar, on every one of those views.
const BackToItinerary = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="pointer-events-auto flex items-center gap-[6px] rounded-full bg-[#07213A] shadow-[0_2px_10px_rgba(11,18,32,0.12)] pl-[11px] pr-[15px] py-[8px] text-[12.5px] font-inter font-semibold text-white hover:bg-[#0d2b47]"
  >
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
    Back to itinerary
  </button>
);

// Pins the pill `fixed`, horizontally centered, a hair above the cart bar.
// `barStyle` (the panel-aligned left/width the cart bar itself uses) keeps it
// inside the left pane on desktop; without it — on mobile — it spans the screen
// and centers there. `bottom` is the measured cart-bar height plus a small gap.
const BackToItineraryBar = ({
  onClick,
  bottom,
  barStyle,
}: {
  onClick: () => void;
  bottom: number;
  barStyle?: React.CSSProperties;
}) => (
  <div
    className="fixed z-30 flex justify-center pointer-events-none"
    style={{
      left: barStyle?.left ?? 0,
      width: barStyle?.width,
      right: barStyle ? "auto" : 0,
      bottom,
    }}
  >
    <BackToItinerary onClick={onClick} />
  </div>
);

function transformDraftToItinerary(draft: any) {
  const routes = draft?.routes ?? [];
  const cities = routes.map((route: any, index: number) => {
    const cityName = route.city?.name ?? "unknown";
    // One id per LEG, not per city. A trip can visit the same place twice
    // (Sapporo → Niseko → Sapporo) and the draft payload only carries the GEO
    // city id, which repeats — the canonical API's per-leg `itinerary_city_id`
    // doesn't exist yet at this stage. Everything downstream keys off this id:
    // the React key in DaybyDay, the per-city hotel filter, and the transfer
    // map below. Sharing one id made both Sapporo cards match both Sapporo
    // stays, so each listed the other's hotel alongside its own.
    //
    // `city.id` just below keeps the plain geo id for anything that needs to
    // know *which city* this is rather than *which stay*.
    const cityId = route.city?.id
      ? `${route.city.id}-${index}`
      : `draft-city-${route.city?.name}-${index}`;
    return {
      id: cityId,
      city: {
        id: route.city?.id || null,
        name: cityName,
        latitude: null,
        longitude: null,
        gmaps_place_id: null,
        image: [],
        car_free_city: false,
      },
      start_date: null,
      end_date: null,
      duration: route.city?.duration ?? 0,
      day_by_day: (route.day_by_day ?? []).map((day: any) => ({
        day: day.day,
        date: day.date ?? null,
        day_summary: day.day_summary ?? "",
        slab_id: null,
        slab_elements: (day.slab_elements ?? []).map(
          (el: any, idx: number) => ({
            id: el.id ?? null,
            icon: el.icon ?? null,
            tags: el.tags ?? [],
            agent_tags: el.agent_tags ?? [],
            one_liner: el.one_liner ?? el.short_description ?? null,
            time: el.time ?? "",
            index: idx,
            rating: el.rating ?? null,
            heading: el.name ?? el.heading ?? "",
            end_time: el.end_time ?? "",
            start_time: el.start_time ?? "",
            element_type: el.type ?? el.element_type ?? "poi",
            user_ratings_total: el.user_ratings_total ?? 0,
            latitude: el.latitude ?? null,
            longitude: el.longitude ?? null,
          }),
        ),
      })),
      // `route.hotels` is normally a single object, but normalise so an array
      // works too. Reading `.name` straight off an array yields undefined,
      // which the draftStays builder below reads as "no hotel" and turns into a
      // placeholder — so a city with two hotels rendered with NO hotel row at
      // all rather than two. The `-${hIdx}` on the fallback id matters as well:
      // two unnamed hotels in one city would otherwise share a key in
      // ItineraryCity's multiHotelStays.map.
      hotels: (Array.isArray(route.hotels)
        ? route.hotels
        : route.hotels
          ? [route.hotels]
          : []
      ).map((hotel: any, hIdx: number) => ({
        id: hotel?.id || `draft-hotel-${cityId}-${hIdx}`,
        name: hotel?.name,
        star_category: null,
        images: [],
        rating: hotel?.star_category ?? null,
        itinerary_city_id: cityId,
      })),
      activities: [],
      transfers: { sightseeing: [], airport: [] },
    };
  });

  // Map the bot's `{ name, gmaps_place_id }` endpoint shape to the
  // `{ city_name, gmaps_place_id, latitude, longitude }` shape DaybyDay.jsx
  // expects when reading `itinerary.start_city` / `itinerary.end_city`.
  const toEndpointCity = (raw: any) => {
    if (!raw) return null;
    return {
      city_name: raw.name ?? raw.city_name ?? "",
      gmaps_place_id: raw.gmaps_place_id ?? raw.place_id ?? null,
      place_id: raw.gmaps_place_id ?? raw.place_id ?? null,
      latitude: raw.latitude ?? null,
      longitude: raw.longitude ?? null,
    };
  };

  return {
    name: draft?.name ?? "Your Itinerary",
    start_date: draft?.start_date ?? null,
    end_date: draft?.end_date ?? null,
    travel_date: draft?.travel_date ?? null,
    group_type: draft?.group_type ?? null,
    number_of_adults: draft?.number_of_adults ?? draft?.no_of_adults ?? null,
    number_of_children:
      draft?.number_of_children ?? draft?.no_of_children ?? null,
    number_of_infants:
      draft?.number_of_infants ?? draft?.no_of_infants ?? null,
    cities,
    start_city: toEndpointCity(draft?.start_city),
    end_city: toEndpointCity(draft?.end_city),
    version: "v2",
    celery: {
      ITINERARY: "SUCCESS",
      HOTELS: "PENDING",
      TRANSFERS: "PENDING",
      PRICING: "PENDING",
      display_text: null,
      notes: [],
    },
    status: "Draft",
  };
}

export default function BotApp({
  sessionId,
  fromTailored = false,
  themeConfig,
}: {
  sessionId?: string;
  fromTailored?: boolean;
  themeConfig?: ThemeConfig;
}) {
  // ── Fresh P1 redirect detection (synchronous) ────────────────────────────
  // ChatKitPanel's `trip.redirect_to_p1` action stashes the seed prompt in
  // localStorage under `pending_initial_prompt_{sessionId}` and opens
  // /chat/{sessionId} in a new tab. We detect that *before* any state
  // initialiser so the left panel can default to the map and we can skip
  // restore — the new session has no thread/itinerary yet and the existing
  // sessionId-based defaults would otherwise show a stale "itinerary" view
  // from the prior session's Redux slice.
  const isFreshP1RedirectRef = useRef<boolean>(
    (() => {
      if (typeof window === "undefined") return false;
      if (!sessionId) return false;
      try {
        return !!localStorage.getItem(`pending_initial_prompt_${sessionId}`);
      } catch {
        return false;
      }
    })(),
  );
  const isFreshP1Redirect = isFreshP1RedirectRef.current;

  const [mapState, setMapState] = useState<MapState>({
    lat: 20,
    lng: 78,
    zoom: 4,
  });
  const mapRef = useRef<google.maps.Map | null>(null);
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);
  const [initialPromptRequiresLogin, setInitialPromptRequiresLogin] =
    useState(false);
  // Theme-page hand-off drained from heroChatHandoff alongside the seed — the
  // items the reader saved and the theme slug. Forwarded to ChatKitPanel so the
  // first /chatkit request carries them.
  const [themeItems, setThemeItems] = useState<ThemeSelectedItem[] | undefined>(
    undefined,
  );
  const [themeSlug, setThemeSlug] = useState<string | undefined>(undefined);
  // Free text the reader typed into a theme page's docked ask-bar before
  // hitting "Build trip" — handed to the themed mini-form so its submission
  // carries it (see ThemeIntakeForm's `note`).
  const [themeNote, setThemeNote] = useState<string | undefined>(undefined);
  // Structured `intake` payload built by the theme page when it fired the seed
  // (see components/theme/cinematic/themeIntake.ts) — slug, source, the
  // reader's words or the canned prompt, and the saved items. Forwarded to
  // ChatKitPanel so the seeded first /chatkit request uses the same request
  // shape as the themed mini-form's submission instead of bare free text.
  const [themeIntake, setThemeIntake] = useState<
    Record<string, unknown> | undefined
  >(undefined);
  // Themed theme-page mini-form (date windows + pax). When a theme page's
  // "Build this itinerary" routes to /chat?themeForm=<slug>, we resolve the
  // config and flag ChatKitPanel to inject the 2-section form (no auto-send).
  const [themeForm, setThemeForm] = useState<ThemeForm | null>(null);
  const [startThemedForm, setStartThemedForm] = useState(false);
  const [initialAttachmentIds, setInitialAttachmentIds] = useState<
    string[] | undefined
  >(undefined);
  // Hero handoff: seed prompt and/or selected files arriving from the
  // homepage chat input. Files are queued to ChatKitPanel for upload via
  // `initialFiles`. The seed pre-fills the composer (`initialInputText`)
  // when files are present so the user can review before sending; when
  // there are no files, it's auto-sent through the regular
  // `handlePromptSelect` path.
  const [initialFiles, setInitialFiles] = useState<File[] | undefined>(
    undefined,
  );
  const [initialInputText, setInitialInputText] = useState<string | null>(null);
  const hasConsumedHeroHandoffRef = useRef(false);
  const [activeTravellerStory, setActiveTravellerStory] =
    useState<TravellerStory | null>(null);
  // Widened past `(msg: string)`: a theme-page prompt has to reach the panel's
  // sendMessage with its `intake` opts (see executePromptSelect), so the ref
  // carries the panel's full signature rather than just the text.
  const sendMessageRef = useRef<ChatSendFn | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const [locations, setLocations] = useState<Location[] | null>(null);
  const [currentRoute, setCurrentRoute] = useState<Location[] | null>(null);
  const { userLocation, isLoadingLocation } = useUserLocation(setMapState);

  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(
    null,
  );
  const [transfers, setTransfers] = useState<TransfersData | null>(null);
  const [showItineraryShimmer, setShowItineraryShimmer] = useState(false);

  // On refresh (sessionId present), default desktop to the itinerary tab so
  // P1 / P2 reloads land on the itinerary panel — not the map. Fresh sessions
  // (no sessionId) and fresh P1 redirects (sessionId present but no thread
  // yet) start on map so the user doesn't see the prior session's itinerary
  // bleed through.
  const [viewMode, setViewMode] = useState<ViewMode>(
    sessionId && !isFreshP1Redirect ? "itinerary" : "map",
  );
  const [botMode, setBotMode] = useState<BotMode>("p1");
  // Mirror of botMode that updates synchronously. loadThread runs right after
  // restoreItineraryDirectly within the same tick (thread select / restore),
  // so it can't see the latest botMode from state — reading this ref instead
  // avoids a stale value (e.g. switching a P2 thread → a P1 chat thread would
  // otherwise paint the empty itinerary panel instead of the map).
  const botModeRef = useRef<BotMode>("p1");
  const applyBotMode = useCallback((mode: BotMode) => {
    botModeRef.current = mode;
    setBotMode(mode);
  }, []);
  const [itineraryId, setItineraryId] = useState("");
  const [chatKey, setChatKey] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // ── Init showStartScreen/isChatActive to prevent flicker on load ──
  // Both derive only from the `sessionId`/`themeConfig` props (identical on the
  // server and client, so no hydration mismatch). On a fresh, non-theme /chat
  // open there is no inspiration surface — the empty state is the in-chat
  // intake form — so we hide StartScreen and reveal the chat panel from the
  // very first paint. The router-ready effects then inject the intake form
  // (or handle a ?seed / ?intake handoff). Only theme pages keep the
  // StartScreen + ChatWelcomeScreen inspiration surfaces on a fresh open.
  const [showStartScreen, setShowStartScreen] = useState(
    !sessionId && !!themeConfig,
  );
  const [isChatActive, setIsChatActive] = useState(!!sessionId || !themeConfig);
  // When reloading with a sessionId, mark hasBotResponded true so the left panel is visible
  // while we restore the thread data. It will be properly set by the restore flow.
  const [hasBotResponded, setHasBotResponded] = useState(!!sessionId);
  const [isLeftPanelRevealing, setIsLeftPanelRevealing] = useState(false);
  // True once the backend `form_fields` effect has started the in-chat intake
  // flow — flips the left panel to the destination hero image.
  const [intakeActive, setIntakeActive] = useState(false);
  // True when the user lands from a "Plan with Kaira" CTA (`?intake=1`): show
  // the default hero banner on the left and inject an empty intake form on the
  // right, without waiting for a backend message.
  const [startEmptyIntake, setStartEmptyIntake] = useState(false);
  // True when the chat was opened via a hero prompt seed (`?seed=...`). Like the
  // `?intake=1` landing it shows the IntakeLeftPanel default hero on the left
  // immediately — but WITHOUT injecting an empty intake form on the right, since
  // the seeded message + the backend's own form_fields drive the conversation.
  // The hero then swaps to the destination image once the intake picks a place.
  const [seedActive, setSeedActive] = useState(false);
  // The destination chosen inside the in-chat intake form. The left hero panel
  // only takes over once a place is picked; until then we keep the StartScreen
  // (inspiration) visible instead of a default hero image.
  const intakeDestination = useSelector(
    (s: any) => s.IntakeForm?.destination,
  );

  const [leftPanelMode, setLeftPanelMode] = useState<LeftPanelMode>("default");
  const [completingItineraryId, setCompletingItineraryId] = useState<
    string | null
  >(null);
  const [loaderDisplayText, setLoaderDisplayText] = useState<string | null>(
    null,
  );
  const [isRoutePreparing, setIsRoutePreparing] = useState(false);

  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(
    sessionId && !isFreshP1Redirect ? "itinerary" : "chat",
  );
  const [activeItineraryId, setActiveItineraryId] = useState<string | null>(
    null,
  );
  const [itineraryPollingEnabled, setItineraryPollingEnabled] = useState(false);
  // Bumped on `refresh_itinerary` to force ItineraryContainer to re-run its
  // status-poll + canonical fetch when `id` hasn't changed.
  const [itineraryRefetchCounter, setItineraryRefetchCounter] = useState(0);
  const initialPromptRef = useRef<string | null>(null);
  // Set by restoreLatestThread when fromTailored lands on /chat/{id} with no
  // existing chatkit thread and the itinerary is still building. The
  // itinerary_status useEffect fires the seed prompt once polling reaches
  // SUCCESS so thread.create / chatkit/p2 isn't called against an
  // unfinished itinerary.
  const pendingTailoredSeedRef = useRef(false);
  const [showChatBot, setShowChatBot] = useState(false);

  // ── Frozen ChatBot itinerary ID — set once, never changes after first assignment ──
  const [chatBotItineraryId, setChatBotItineraryId] = useState<string | null>(
    null,
  );

  const [restoredThread, setRestoredThread] = useState<any>(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const currentItineraryRef = useRef<any>(null);
  const [skeletonCities, setSkeletonCities] = useState<any[]>([]);
  const skeletonCitiesRef = useRef<any[]>([]);
  const chatSendMessageRef = useRef<ChatSendFn | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isItineraryCompleting, setIsItineraryCompleting] = useState(false);
  // Jupiter analytics — Partytown forwards calls to a worker so the main
  // thread isn't blocked. Used to fire chat lifecycle + cart events from the
  // BottomCTABar, which sits outside ChatKitPanel.
  //
  // These go through services/analyticsFunnel with the *same* scope
  // ChatKitPanel uses (both read it off the /chat/<id> URL), so a milestone
  // reported here is deduped against the same milestone reported there, and
  // reaching one back-fills the earlier steps. Reporting cart-viewed straight
  // from this bar — with no dedup and no earlier stages — is why the dashboard
  // showed more cart views than price-received events.
  const { trackChatFunnelStage } = useAnalytics();
  const trackChatStageRef = useRef(trackChatFunnelStage);
  trackChatStageRef.current = trackChatFunnelStage;
  const reportChatStage = useCallback(
    (stage: string, itineraryId: string, ddAgent: string) => {
      reportFunnelStage(FUNNELS.chat, stage, {
        scopeId: getChatFunnelScope(),
        persist: true,
        emit: (eventName: string, extra: Record<string, unknown>) =>
          trackChatStageRef.current?.(eventName, itineraryId, ddAgent, [], extra),
      });
    },
    [],
  );
  // true only when itinerary was created in this session (not restored on reload)
  const itineraryCreatedInSessionRef = useRef(false);
  const cart = useSelector((state: any) => state.Cart);
  const pricingStatus = useSelector(
    (state: any) => state.ItineraryStatus?.pricing_status,
  );
  const finalizedStatus = useSelector(
    (state: any) => state.ItineraryStatus?.finalized_status,
  );
  // Same rationale as botModeRef below: callbacks captured by the in-flight
  // restore chain (restoreLatestThread → loadThread → handleItineraryReceived)
  // keep the finalizedStatus from the render that started the restore, so the
  // "SUCCESS" that restoreItineraryDirectly dispatches mid-flight is invisible
  // to them. Read the ref, not the selector value, from those callbacks.
  const finalizedStatusRef = useRef<string | undefined>(undefined);
  finalizedStatusRef.current = finalizedStatus;
  const itineraryStatus = useSelector(
    (state: any) => state.ItineraryStatus?.itinerary_status,
  );
  const currency = useSelector((state: any) => state.currency);
  const [isMobile, setIsMobile] = useState(false);
  // `isMobile` starts false (SSR has no viewport) and only resolves to the real
  // value after the breakpoint effect measures the window on mount. Handoffs
  // that pick a ChatKitPanel instance by `isMobile` (the hero seed consumer
  // below) must wait for this so they don't act against the desktop panel and
  // then have it torn down when `isMobile` flips — see the seed effect.
  const [viewportMeasured, setViewportMeasured] = useState(false);
  // Mobile effect popup — shown for 10s when focus_route / itinerary effects fire
  const [mobileEffectPopup, setMobileEffectPopup] = useState<{
    type: "map" | "itinerary";
    label: string;
  } | null>(null);
  const mobileEffectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  // Only show the "View Map" popup once (first focus_route)
  const hasShownMapPopupRef = useRef(false);
  // Only show the "View Itinerary" popup once (first P2 transition)
  const hasShownItineraryPopupRef = useRef(false);

  // Payment drawer — persists via ?drawer=payment in URL
  const [showPaymentDrawer, setShowPaymentDrawer] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        new URLSearchParams(window.location.search).get("drawer") === "payment"
      );
    }
    return false;
  });
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentDrawerKey, setPaymentDrawerKey] = useState(0);

  const fetchPaymentData = useCallback(
    async (itinId: string) => {
      if (!itinId) return;
      setPaymentLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(
          `${MERCURY_HOST}/api/v1/itinerary/${itinId}/cart/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setPaymentData(res.data);
        dispatch(setCart(res.data));
      } catch (e) {
        console.error("Failed to fetch payment data", e);
        dispatch(setCart({ error: true }));
      } finally {
        setPaymentLoading(false);
      }
    },
    [dispatch],
  );

  // Ref so MobileLayout can expose its tab-switch fn; used by openPaymentDrawer on mobile
  const mobileTabSwitchRef = useRef<((tab: string) => void) | null>(null);
  const handleRegisterMobileTabSwitch = useCallback(
    (fn: ((tab: string) => void) | null) => {
      mobileTabSwitchRef.current = fn;
    },
    [],
  );

  // Sync ?drawer=payment in URL when drawer opens / closes
  // On mobile, View Cart switches to itinerary tab instead of opening the sheet
  const openPaymentDrawer = React.useCallback(() => {
    if (
      activeItineraryId &&
      activeItineraryId !== "skeleton" &&
      activeItineraryId !== "draft"
    ) {
      fetchPaymentData(activeItineraryId);
    }
    setPaymentDrawerKey((k) => k + 1);
    setShowPaymentDrawer(true);
    const url = new URL(window.location.href);
    url.searchParams.set("drawer", "payment");
    pushUrlDetached(url.toString());
  }, [activeItineraryId, fetchPaymentData]);
  const closePaymentDrawer = React.useCallback(() => {
    setShowPaymentDrawer(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("drawer");
    pushUrlDetached(url.toString());
  }, []);

  // When drawer is open (e.g. after refresh with ?drawer=payment) and the itinerary ID
  // becomes available, fetch the payment data automatically.
  useEffect(() => {
    if (
      showPaymentDrawer &&
      activeItineraryId &&
      activeItineraryId !== "skeleton" &&
      activeItineraryId !== "draft"
    ) {
      fetchPaymentData(activeItineraryId);
    }
  }, [showPaymentDrawer, activeItineraryId, fetchPaymentData]);

  const itineraryRedux = useSelector((state: any) => state.Itinerary);
  const galleryImages = useSelector((state: any) => state.galleryImages);
  const itineraryReduxName = itineraryRedux?.name;
  const socialProofCount = routeSocialProofCount(
    itineraryRedux?.similar_route_stats,
    itineraryRedux?.group_type,
  );

  const attachUserToItinerary = useCallback(async () => {
    if (itineraryRedux?.customer_name) return;
    const itinId = activeItineraryId;
    if (!itinId || itinId === "skeleton" || itinId === "draft") return;
    try {
      const response = await axios.get(
        `${MERCURY_HOST}/api/v1/itinerary/${itinId}/attach-user/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        setItineraryRefetchCounter((c) => c + 1);
      }
    } catch (error) {
      console.error("Error attaching user to itinerary:", error);
    }
  }, [itineraryRedux?.customer_name, activeItineraryId]);
  // Mirror the Redux itinerary status into a ref so handleItineraryRefresh
  // (a stable useCallback) can read the latest canonical status — e.g.
  // "Finalized" from the status API — without re-creating the callback.
  // currentItineraryRef.current is fed from bot draft events and always
  // carries status:"Draft", so it cannot preserve a finalized status on its
  // own during a refresh_itinerary.
  const itineraryStatusRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    itineraryStatusRef.current = itineraryRedux?.status;
  }, [itineraryRedux?.status]);
  const isV1 =
    useSelector((state: any) => state.ItineraryStatus?.version) === "v1";
  const statusDisplayText = useSelector(
    (state: any) => state.ItineraryStatus?.display_text,
  );
  const statusNotes = useSelector((state: any) => state.ItineraryStatus?.notes);

  // ── Single source of truth for "itinerary is complete" (gates the Bookings
  // CTA on the cart bar) ───────────────────────────────────────────────────
  // Previously each call site recomputed this from `state.Itinerary.status`,
  // which is set LATE — only after ItineraryContainer finishes polling and
  // fetches the canonical itinerary. On first arrival at P2 that field is
  // still "Draft"/undefined, so Route + Bookings entry points (and the gallery-backed
  // views) were missing until a manual refresh. The ItineraryStatus slice's
  // `finalized_status`/`itinerary_status` are set EARLY (synchronously from
  // the status endpoint in restoreItineraryDirectly), so prefer those and
  // fall back to the Itinerary.status heuristic for older code paths.
  // "This thread has a real itinerary behind it" — a saved id, not one of the
  // two placeholders the panel uses while one is still being built. Weaker than
  // `itineraryIsComplete` below, which additionally waits for a SUCCESS status:
  // this only asks whether there is something at /itinerary/{id} to open.
  const hasItinerary =
    !!activeItineraryId &&
    activeItineraryId !== "skeleton" &&
    activeItineraryId !== "draft";

  const itineraryIsComplete =
    hasItinerary &&
    (finalizedStatus === "SUCCESS" ||
      itineraryStatus === "SUCCESS" ||
      (!!(
        itineraryRedux &&
        (itineraryRedux.name || itineraryRedux.cities?.length)
      ) &&
        itineraryRedux?.status !== "Draft" &&
        itineraryRedux?.status !== undefined &&
        itineraryRedux?.status !== null &&
        itineraryRedux?.status !== "undefined"));

  const [showShare, setShowShare] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSettingsLoginPrompt, setShowSettingsLoginPrompt] = useState(false);
  // Mobile: the compact trip strip collapses the traveller/date/social meta
  // behind a chevron. Desktop always shows the full header.
  const [tripMetaOpen, setTripMetaOpen] = useState(false);
  // Expanding the card grows it by ~120px, and that layout shift (plus any
  // momentum still settling from the fling that got the user here) fires a
  // downward scroll event, which would collapse the card again immediately.
  const suppressMetaCollapseUntilRef = React.useRef(0);

  // Once the itinerary pane is scrolled off the top, the trip card sheds
  // everything but its three identifying lines — name, travellers/dates, route.
  // Same on desktop (where the card is a pinned header strip) and mobile (where
  // it is `sticky top-0` inside the pane).
  const [headerCondensed, setHeaderCondensed] = useState(false);

  // Stable identities so they don't defeat MobileLayout's React.memo.
  // `scrolledAway` drives the condensed card; the meta block only collapses on
  // a *downward* scroll, so scrolling back up doesn't fight a chevron tap.
  const handleItineraryScrolled = useCallback(
    (scrolledAway: boolean, isDown: boolean) => {
      setHeaderCondensed(scrolledAway);
      if (!isDown) return;
      if (Date.now() < suppressMetaCollapseUntilRef.current) return;
      setTripMetaOpen(false);
    },
    [],
  );

  // The bottom CTA bar is `fixed` (a transformed ancestor would trap it, and
  // #chatContainer would scroll it away if it were absolute), so it can't
  // inherit the left panel's box. Measure the panel and hand the bar its exact
  // left/width — that's what makes its right edge meet the chat divider even as
  // the sidebar collapses and the panel animates to a new width.
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const [leftPanelBox, setLeftPanelBox] = useState<{
    left: number;
    width: number;
  } | null>(null);
  useEffect(() => {
    if (isMobile) {
      setLeftPanelBox(null);
      return undefined;
    }
    const el = leftPanelRef.current;
    if (!el) return undefined;
    const measure = () => {
      const { left, width } = el.getBoundingClientRect();
      setLeftPanelBox({ left, width });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isMobile]);
  const ctaBarStyle = React.useMemo<React.CSSProperties | undefined>(
    () =>
      isMobile || !leftPanelBox
        ? undefined
        : { left: leftPanelBox.left, width: leftPanelBox.width, right: "auto" },
    [isMobile, leftPanelBox],
  );

  // Desktop scroller for the itinerary body. On mobile the pane that actually
  // scrolls lives in MobileLayout, which reports through onItineraryScrolled.
  const desktopItineraryScrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (isMobile) return undefined;
    const el = desktopItineraryScrollRef.current;
    if (!el) return undefined;

    const CONDENSE_BELOW_PX = 8; // anything past a hairline counts as scrolled
    const onScroll = () => setHeaderCondensed(el.scrollTop > CONDENSE_BELOW_PX);
    onScroll(); // a re-mounted pane can already be scrolled

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isMobile, activeItineraryId, viewMode]);

  const handleTripMetaToggle = useCallback(() => {
    setTripMetaOpen((open) => {
      if (open) return false;
      // Opening: the card expands in place, wherever the pane is scrolled to.
      suppressMetaCollapseUntilRef.current = Date.now() + 700;
      return true;
    });
  }, []);
  // The expanded-header DATES value overflows the tight two-column meta on some
  // phones. Measure the full-year width against the space left after the
  // Travellers column and only fall back to a 2-digit year when it won't fit.
  const [datesShort, setDatesShort] = useState(false);
  const metaGroupRef = useRef<HTMLDivElement | null>(null);
  const travellersColRef = useRef<HTMLDivElement | null>(null);
  const datesMeasureRef = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const compute = () => {
      const group = metaGroupRef.current;
      const measure = datesMeasureRef.current;
      if (!group || !measure || measure.offsetWidth === 0) return;
      const travW = travellersColRef.current?.offsetWidth || 0;
      const available = group.clientWidth - travW - 12; // 12px = column gap
      setDatesShort(measure.offsetWidth > available - 2);
    };
    compute();
    const raf = requestAnimationFrame(compute);
    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", compute);
    };
  }, [itineraryRedux?.start_date, itineraryRedux?.end_date, tripMetaOpen]);
  const [showApiLoginPrompt, setShowApiLoginPrompt] = useState(false);
  // Login gate for the start-screen / welcome surfaces (prompt cards, theme
  // prompts, traveller stories). Holds the action to replay after login.
  const [showPromptLoginPrompt, setShowPromptLoginPrompt] = useState(false);
  const pendingPromptActionRef = useRef<(() => void) | null>(null);
  const [isHotelsPresent, setIsHotelsPresent] = useState(false);

  const authToken = useSelector((state: any) => state.auth?.token);
  const isLoggedIn = !!(
    authToken ?? (typeof window !== "undefined" ? getAuthToken() : null)
  );

  // Open the login modal whenever any axios call returns a 401. The
  // interceptor only flips the prompt state — the original error still
  // propagates so existing .catch handlers behave unchanged. Raw fetch
  // callers (e.g. PdfDownloadCard) dispatch the same `api:unauthorized`
  // event so they can trigger the modal too.
  useEffect(() => {
    const id = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          setShowApiLoginPrompt(true);
        }
        return Promise.reject(error);
      },
    );
    const onUnauthorized = () => setShowApiLoginPrompt(true);
    const onOpenSettings = () => setShowSettings(true);
    if (typeof window !== "undefined") {
      window.addEventListener("api:unauthorized", onUnauthorized);
      window.addEventListener("open-itinerary-settings", onOpenSettings);
    }
    return () => {
      axios.interceptors.response.eject(id);
      if (typeof window !== "undefined") {
        window.removeEventListener("api:unauthorized", onUnauthorized);
        window.removeEventListener("open-itinerary-settings", onOpenSettings);
      }
    };
  }, []);


  // ── Refs for restore guards ──────────────────────────────────────────────
  const hasRestoredRef = useRef(false);
  const userSelectedThreadRef = useRef(false);
  const chatBotInjectedMessageRef = useRef<string | null>(null);
  const isLoadingThreadRef = useRef(false);
  // True while replaying a thread's effects on refresh/thread-select. Stops
  // map-effect replays in handleRouteReceived/handleLocationReceived from
  // flipping viewMode to "map" — on a finalized P2 refresh that would land
  // the user on the map (desktop) or a display:none'd itinerary panel (mobile,
  // where the tab is "itinerary" but the inner panel still gates on viewMode).
  const isRestoringRef = useRef(false);

  const [activeChatSessionId, setActiveChatSessionId] = useState<
    string | undefined
  >(sessionId ?? undefined);

  // ── Mobile breakpoint — single source of truth so only ONE ItineraryContainer
  //    is ever rendered in the DOM at a time ─────────────────────────────────

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    setViewportMeasured(true);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Watch finalized_status to clear itinerary-completing loader ───────────
  useEffect(() => {
    if (finalizedStatus === "SUCCESS" && isItineraryCompleting) {
      setIsItineraryCompleting(false);
    }
  }, [finalizedStatus, isItineraryCompleting]);

  // ── Fire the deferred tailored summary prompt once polling resolves ───────
  // For fromTailored landings, restoreLatestThread sets
  // pendingTailoredSeedRef while the itinerary is still building so we don't
  // call thread.create / chatkit/p2 against an unfinished trip. Send the
  // prompt as soon as itinerary_status flips to SUCCESS.
  useEffect(() => {
    if (!pendingTailoredSeedRef.current) return;
    if (itineraryStatus !== "SUCCESS") return;
    pendingTailoredSeedRef.current = false;
    const loggedIn = !!getAuthToken();
    setInitialPrompt("Hey Kaira! provide summary of my itinerary");
    setInitialPromptRequiresLogin(!loggedIn);
    setIsChatActive(true);
  }, [itineraryStatus]);

  // ── On the first time we land in P2 (finalized) state, default the desktop
  //    viewMode to itinerary. The chatkit restore flow can leave viewMode on
  //    "map" because ChatKitPanel's restoredThread useEffect replays
  //    map_effects via onRouteReceived after BotApp's post-status
  //    setViewMode("itinerary") has run. Fires once per mount so a user who
  //    later toggles to map isn't yanked back. ─────────────────────────────
  const hasDefaultedP2ViewModeRef = useRef(false);
  useEffect(() => {
    if (
      !hasDefaultedP2ViewModeRef.current &&
      finalizedStatus === "SUCCESS" &&
      activeItineraryId &&
      activeItineraryId !== "skeleton" &&
      activeItineraryId !== "draft"
    ) {
      hasDefaultedP2ViewModeRef.current = true;
      setViewMode("itinerary");
    }
  }, [finalizedStatus, activeItineraryId]);

  const handleSendMessageReady = useCallback(
    (sendFn: (msg: string) => void) => {
      chatSendMessageRef.current = sendFn;
    },
    [],
  );

  // ── Helpers ──────────────────────────────────────────────────────────────

  // chatkit_session_* keys live in sessionStorage (set by handleSessionCreated
  // in ChatKitPanel and the restore paths below). Previously this helper
  // pointed at localStorage so the cleanup never ran — letting sessionStorage
  // accumulate one entry per visited /chat/<id> until the quota tripped.
  const clearStaleChatSessions = () => {
    try {
      const keysToRemove = Object.keys(sessionStorage).filter((k) =>
        k.startsWith("chatkit_session_"),
      );
      if (keysToRemove.length > 3) {
        keysToRemove.slice(0, keysToRemove.length - 3).forEach((k) => {
          sessionStorage.removeItem(k);
        });
      }
    } catch (e) {
      console.warn("Error clearing chat sessions:", e);
    }
  };

  // Quota-aware setter for chatkit_session_* — on QuotaExceededError, drop
  // every existing chatkit_session_* entry and retry once. Failures are
  // swallowed: the cached session id is an optimization, never load-bearing.
  const safeSetSessionItem = (key: string, value: string) => {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      try {
        Object.keys(sessionStorage)
          .filter((k) => k.startsWith("chatkit_session_"))
          .forEach((k) => sessionStorage.removeItem(k));
        sessionStorage.setItem(key, value);
      } catch (err) {
        console.warn("sessionStorage write failed:", err);
      }
    }
  };

  const setChatBotIdOnce = useCallback((id: string) => {
    setChatBotItineraryId((prev) => prev ?? id);
  }, []);

  // ── restoreItineraryDirectly — used for old itineraries with no chatkit threads ──
  const restoreItineraryDirectly = useCallback(
    async (itineraryId: string): Promise<string | null> => {
      if (!itineraryId || itineraryId === "undefined") return null;
      try {
        const { axiosGetItineraryStatus } =
          await import("../../services/itinerary/daybyday/preview");
        const statusRes = await axiosGetItineraryStatus.get(
          `/${itineraryId}/status/`,
        );
        const status = statusRes.data?.celery;
        const stage = statusRes.data?.stage;
        if (!status) return null;

        // Stage P1 — no itinerary yet (or still in chat-only stage). Don't
        // dispatch celery statuses or enable itinerary polling; otherwise
        // ItineraryContainer mounts, polls, sees a FAILURE/PENDING status
        // and either redirects to /thank-you or shows a stale loader.
        // The chatkit thread alone drives the P1 UI.
        if (stage === "P1" && !fromTailored) {
          applyBotMode("p1");
          setShowChatBot(true);
          setShowStartScreen(false);
          setHasBotResponded(true);
          setIsChatActive(true);
          return stage ?? "P1";
        }

        dispatch(
          setItineraryStatus("itinerary_status", status.ITINERARY || "PENDING"),
        );
        dispatch(
          setItineraryStatus("hotels_status", status.HOTELS || "PENDING"),
        );
        dispatch(
          setItineraryStatus("transfers_status", status.TRANSFERS || "PENDING"),
        );
        dispatch(
          setItineraryStatus("pricing_status", status.PRICING || "PENDING"),
        );
        dispatch(
          setItineraryStatus("display_text", status.display_text || null),
        );
        dispatch(setItineraryStatus("notes", status.notes || []));
        dispatch(
          setItineraryStatus("version", statusRes.data?.version || null),
        );

        const allDone = ["ITINERARY", "HOTELS", "TRANSFERS", "PRICING"].every(
          (k) => status[k] === "SUCCESS" || status[k] === "FAILURE",
        );
        if (stage === "P2") {
          dispatch(
            setItineraryStatus(
              "finalized_status",
              allDone ? "SUCCESS" : "PENDING",
            ),
          );
          applyBotMode("p2");
          setItineraryId(itineraryId);
          if (!allDone) {
            setIsItineraryCompleting(true);
            itineraryCreatedInSessionRef.current = true;
            if (!status.display_text) {
              setLoaderDisplayText("Building your itinerary…");
            }
          }
        } else if (fromTailored) {
          // Itinerary was just created via the tailored form. Force p2 so the
          // user lands on the building-status loader + summary chat path even
          // though celery is still PENDING. Also set the same in-session
          // completion flags the bot's own creation flow sets so the
          // "completing" UI stays visible until polling reaches SUCCESS, and
          // the post-completion `inject.context` summary fires automatically.
          applyBotMode("p2");
          setItineraryId(itineraryId);
          setIsItineraryCompleting(true);
          itineraryCreatedInSessionRef.current = true;
          if (!status.display_text) {
            setLoaderDisplayText("Building your itinerary…");
          }
        }

        dispatch(setCart({}));
        dispatch(setItineraryIdAction(itineraryId));

        setActiveItineraryId(itineraryId);
        setItineraryPollingEnabled(true);
        setShowChatBot(true);
        setChatBotIdOnce(itineraryId);
        setShowStartScreen(false);
        setHasBotResponded(true);
        setIsChatActive(true);
        setViewMode("itinerary");
        setMobilePanel(allDone || fromTailored ? "itinerary" : "map");
        // Refresh UX: when the restored session's status API returns stage
        // P2, land on the itinerary tab on mobile. Only fires from the
        // restore path — live-stream display_itinerary effects must NOT
        // yank the tab.
        if (stage === "P2") {
          mobileTabSwitchRef.current?.("itinerary");
        }
        // fromTailored forces a P2 experience even while celery is still
        // building, so report "P2" to callers (loadThread keys its
        // itinerary-tab default off this).
        return stage === "P2" || fromTailored ? "P2" : (stage ?? null);
      } catch (err) {
        console.error("Failed to restore itinerary directly:", err);
        setShowStartScreen(true);
        setHasBotResponded(false);
        setIsChatActive(false);
        return null;
      }
    },
    [dispatch, setChatBotIdOnce, fromTailored],
  );

  const countCartItems = useMemo<number>(() => {
    if (!cart?.summary) return 0;
    // `Object.values` on an untyped slice yields unknown[], so reduce's result
    // widens to unknown without the explicit type argument.
    return Object.values(cart.summary).reduce<number>(
      (sum, item: any) => sum + (item?.count ?? 0),
      0,
    );
  }, [cart?.summary]);

  useMapBounds(currentRoute, mapRef);

  // ── Skeleton itinerary builder (shared) ──────────────────────────────────
  const buildSkeletonItinerary = useCallback(() => {
    const citiesToUse =
      skeletonCitiesRef.current.length > 0
        ? skeletonCitiesRef.current
        : [{ name: "Loading…", duration: 3 }];
    return {
      name: "Building your itinerary…",
      start_date: null,
      end_date: null,
      cities: citiesToUse.map((c: any, i: number) => ({
        id: `skeleton-city-${i}`,
        city: {
          id: null,
          name: c.name,
          latitude: null,
          longitude: null,
          gmaps_place_id: null,
          image: [],
          car_free_city: false,
        },
        start_date: null,
        end_date: null,
        duration: c.duration,
        day_by_day: Array.from({ length: c.duration }, (_, d) => ({
          day: d + 1,
          date: null,
          day_summary: "",
          slab_id: null,
          slab_elements: [],
        })),
        hotels: [],
        activities: [],
        transfers: { sightseeing: [], airport: [] },
      })),
      version: "v2",
      celery: {
        ITINERARY: "PENDING",
        HOTELS: "PENDING",
        TRANSFERS: "SUCCESS",
        PRICING: "PENDING",
        display_text: null,
        notes: [],
      },
      status: "Draft",
    };
  }, []);

  // ── fromTailored mount: seed skeleton from tailored-form route data ──────
  // The /chat page lands before the status API responds, so without this the
  // user sees a blank itinerary panel during that window. The tailored form
  // (components/tailoredform/Index.js) stashes basic_route in sessionStorage
  // under `tailored_skeleton_<itineraryId>` right before redirecting; we read
  // it here, build a skeleton, and flip BotApp into the same "completing" UI
  // state the in-session creation flow uses. Polling replaces the skeleton
  // with the canonical itinerary. Gated on fromTailored only.
  const hasHydratedFromTailoredRef = useRef(false);
  useEffect(() => {
    if (!fromTailored || hasHydratedFromTailoredRef.current) return;
    if (!sessionId || typeof window === "undefined") return;

    let basicRoute: any[] = [];
    let startCityRaw: any = null;
    let endCityRaw: any = null;
    const storageKey = `tailored_skeleton_${sessionId}`;
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        basicRoute = Array.isArray(parsed?.basic_route)
          ? parsed.basic_route
          : [];
        startCityRaw = parsed?.start_city ?? null;
        endCityRaw = parsed?.end_city ?? null;
      }
    } catch {}

    hasHydratedFromTailoredRef.current = true;

    // Wipe stale itinerary slices left in Redux by the previous /chat/{id}
    // session — without this, the header keeps painting the prior trip's
    // name / dates / gallery until polling reaches itinerary_status=SUCCESS.
    // Reset itinerary_status too, otherwise the prior trip's "SUCCESS" hides
    // the showTailoredSkeleton shimmer until restoreItineraryDirectly catches
    // up. Run regardless of whether the sessionStorage skeleton is present
    // (manual ?source=tailored visits or evicted storage shouldn't leave
    // stale data on screen either).
    dispatch(setGalleryImages([]));
    dispatch(setItineraryStatus("itinerary_status", "PENDING"));
    dispatch(setItineraryStatus("hotels_status", "PENDING"));
    dispatch(setItineraryStatus("transfers_status", "PENDING"));
    dispatch(setItineraryStatus("pricing_status", "PENDING"));
    dispatch(setItineraryStatus("finalized_status", "PENDING"));

    if (basicRoute.length === 0) {
      dispatch(
        setItinerary({ name: "Building your itinerary…", status: "Draft" }),
      );
      dispatch(setItineraryDaybyDay(null));
      dispatch(setBreif(null));
      return;
    }

    const cities = basicRoute.map((loc: any) => ({
      name: loc.name ?? "Loading…",
      duration: loc.duration ?? loc.nights ?? 1,
    }));
    skeletonCitiesRef.current = cities;
    setSkeletonCities(cities);

    // Match the endpoint shape DaybyDay.jsx expects when reading
    // itinerary.start_city / itinerary.end_city — same mapper used by
    // transformDraftToItinerary above.
    const toEndpointCity = (raw: any) => {
      if (!raw) return null;
      return {
        city_name: raw.name ?? raw.city_name ?? "",
        gmaps_place_id: raw.gmaps_place_id ?? raw.place_id ?? null,
        place_id: raw.gmaps_place_id ?? raw.place_id ?? null,
        latitude: raw.latitude ?? null,
        longitude: raw.longitude ?? null,
      };
    };

    const skeleton = {
      ...buildSkeletonItinerary(),
      start_city: toEndpointCity(startCityRaw),
      end_city: toEndpointCity(endCityRaw),
    };
    dispatch(setItinerary(skeleton));
    dispatch(setItineraryDaybyDay(skeleton));
    dispatch(setBreif(skeleton));

    setIsItineraryCompleting(true);
    itineraryCreatedInSessionRef.current = true;
    setLoaderDisplayText("Crafting your day by day itinerary…");
    setShowStartScreen(false);
    setHasBotResponded(true);
    setIsChatActive(true);
    setViewMode("itinerary");
    setMobilePanel("itinerary");

    try {
      sessionStorage.removeItem(storageKey);
    } catch {}
  }, [fromTailored, sessionId, buildSkeletonItinerary, dispatch]);

  const handleItineraryCompletionStart = useCallback(
    (_id?: string) => {
      setIsItineraryCompleting(true);
      itineraryCreatedInSessionRef.current = true;
      dispatch(setCart({}));
      dispatch(setStays([]));
      dispatch(setTransfersBookings(null));
      currentItineraryRef.current = null;

      if (skeletonCitiesRef.current.length > 0) {
        const skeleton = buildSkeletonItinerary();
        dispatch(setItinerary(skeleton));
        dispatch(setItineraryDaybyDay(skeleton));
        dispatch(setBreif(skeleton));
      }
      dispatch(setItineraryStatus("itinerary_status", "PENDING"));
      dispatch(setItineraryStatus("transfers_status", "PENDING"));
      dispatch(setItineraryStatus("pricing_status", "PENDING"));
      dispatch(setItineraryStatus("hotels_status", "PENDING"));
      dispatch(setItineraryStatus("finalized_status", "PENDING"));
      setShowItineraryShimmer(false);
      setActiveItineraryId("skeleton");
      setShowStartScreen(false);
      setHasBotResponded(true);
      setMobilePanel("map");
      setViewMode("itinerary");

      // Mirror tailored-form Google Ads conversion + GTM event for chat-only
      // leads. Tailored users already fire these before navigating to /chat,
      // so guard with !fromTailored to avoid double-counting.
      if (!fromTailored && typeof window !== "undefined") {
        const conversionId =
          _id && _id !== "pending" ? _id : itineraryId || activeChatSessionId;
        const currencyCode = currency?.currency || "INR";

        // Only count the Google Ads conversion for new users. `is_new_user` is
        // persisted at signup (store/actions/auth.js) because the redux flag is
        // cleared by AUTH_SUCCESS before we reach itinerary completion. Consume
        // the flag so it fires once per new user, never for returning users.
        let isNewUser = false;
        try {
          isNewUser = localStorage.getItem("is_new_user") === "true";
        } catch {}

        if (isNewUser && typeof (window as any).gtag === "function") {
          try {
            (window as any).gtag("event", "conversion", {
              send_to: "AW-738037519/IF5rCMyxhL8ZEI-e9t8C",
              transaction_id: conversionId,
              value: 1.0,
              currency: currencyCode,
            });
          } catch (error) {
            console.error("✗ Error firing Google Ads conversion:", error);
          }
          // Consume the flag once the conversion has been fired so it never
          // fires again for this (now returning) user.
          try {
            localStorage.removeItem("is_new_user");
          } catch {}
        }

        if (Array.isArray((window as any).dataLayer)) {
          try {
            (window as any).dataLayer.push({
              event: "itinerary_completed",
              itinerary_id: conversionId,
              platform: getPlatform(),
              currency: currencyCode,
              source: "chat",
              timestamp: new Date().toISOString(),
            });
          } catch (error) {
            console.error("✗ Error pushing to dataLayer:", error);
          }
        }
      }
    },
    [
      dispatch,
      buildSkeletonItinerary,
      fromTailored,
      itineraryId,
      activeChatSessionId,
      currency,
    ],
  );

  const handleItineraryCompletionDone = useCallback(
    (id: string, summary?: string) => {
      if (!id || id === "undefined") return;
      try {
        setShowItineraryShimmer(false);
        dispatch(setCart({}));
        dispatch(setItineraryIdAction(id));
        dispatch(setItineraryStatus("itinerary_status", "PENDING"));
        dispatch(setItineraryStatus("transfers_status", "PENDING"));
        dispatch(setItineraryStatus("pricing_status", "PENDING"));
        dispatch(setItineraryStatus("hotels_status", "PENDING"));
        dispatch(setItineraryStatus("finalized_status", "PENDING"));
        setActiveItineraryId(id);
        setItineraryPollingEnabled(true);
        setShowChatBot(true);
        setChatBotIdOnce(id);
        setHasBotResponded(true);
        setShowStartScreen(false);
        setViewMode("itinerary");
        // Switch to p2 mode so subsequent messages use /chatkit/p2
        applyBotMode("p2");
        setItineraryId(id);
        if (summary) chatBotInjectedMessageRef.current = summary;
      } catch (e) {
        console.error("handleItineraryCompletionDone error:", e);
      }
    },
    [dispatch, setChatBotIdOnce],
  );

  const handleItineraryRefresh = useCallback(
    (id: string) => {
      // Fired when backend sends `refresh_itinerary` (e.g. after a chat edit to
      // start/end city or cities). Replace cities with a day-by-day skeleton
      // that preserves the current city count + duration so the user sees a
      // structured loading state (not just two bare pins) while the canonical
      // data is re-fetched.
      dispatch(setCart({}));
      dispatch(setStays([]));
      dispatch(setTransfersBookings(null));
      dispatch(setItineraryStatus("itinerary_status", "PENDING"));
      dispatch(setItineraryStatus("hotels_status", "PENDING"));
      dispatch(setItineraryStatus("transfers_status", "PENDING"));
      dispatch(setItineraryStatus("pricing_status", "PENDING"));
      dispatch(setItineraryStatus("finalized_status", "PENDING"));
      // Lock the chat composer until ItineraryContainer's poll observes
      // every status resolve again (it dispatches is_polling=false then).
      dispatch(setItineraryStatus("is_polling", true));

      const current = currentItineraryRef.current;
      const placeholderCities = (current?.cities ?? []).map(
        (c: any, i: number) => ({
          id: `skeleton-city-${i}`,
          city: {
            id: null,
            name: c?.city?.name ?? "Loading…",
            latitude: null,
            longitude: null,
            gmaps_place_id: null,
            image: [],
            car_free_city: false,
          },
          start_date: null,
          end_date: null,
          duration: c?.duration ?? 1,
          day_by_day: Array.from({ length: c?.duration ?? 1 }, (_, d) => ({
            day: d + 1,
            date: null,
            day_summary: "",
            slab_id: null,
            slab_elements: [],
          })),
          hotels: [],
          activities: [],
          transfers: { sightseeing: [], airport: [] },
        }),
      );
      // Fallback so users still see at least one skeleton block if we have no
      // prior city shape to base the placeholder on.
      if (placeholderCities.length === 0) {
        placeholderCities.push({
          id: "skeleton-city-0",
          city: {
            id: null,
            name: "Loading…",
            latitude: null,
            longitude: null,
            gmaps_place_id: null,
            image: [],
            car_free_city: false,
          },
          start_date: null,
          end_date: null,
          duration: null,
          day_by_day: [1, 2, 3].map((d) => ({
            day: d,
            date: null,
            day_summary: "",
            slab_id: null,
            slab_elements: [],
          })),
          hotels: [],
          activities: [],
          transfers: { sightseeing: [], airport: [] },
        } as any);
      }

      const skeletonState = {
        ...(current ?? {}),
        name: current?.name ?? "Refreshing itinerary…",
        cities: placeholderCities,
        // Preserve start/end city strings so the first/last pin labels stay
        // visible through the refresh instead of flickering to blank.
        start_city: current?.start_city ?? null,
        end_city: current?.end_city ?? null,
        // Preserve the current top-level status (e.g. "Finalized") so that the
        // Bookings CTA doesn't briefly disappear during a
        // mid-P2 refresh. Prefer Redux (which reflects the status endpoint's
        // authoritative value) over currentItineraryRef, which is fed from
        // bot draft events that always carry status:"Draft".
        status: itineraryStatusRef.current ?? current?.status ?? "Draft",
      };
      dispatch(setItinerary(skeletonState));
      dispatch(setItineraryDaybyDay(skeletonState));
      dispatch(setBreif(skeletonState));
      currentItineraryRef.current = skeletonState;
      // Keep skeletonCitiesRef in sync so any trailing shimmer_day_by_day
      // effect rebuilds from the same placeholder shape, not stale waypoints.
      skeletonCitiesRef.current = placeholderCities.map((c: any) => ({
        name: c.city?.name,
        duration: c.duration,
      }));

      // Bump counter so ItineraryContainer re-runs its status-poll + canonical
      // fetch. Required because the id is usually unchanged across a refresh,
      // and the existing [props.id, props.skipPolling] effect wouldn't fire.
      setItineraryRefetchCounter((c) => c + 1);

      if (id && id !== "undefined") {
        dispatch(setItineraryIdAction(id));
        setActiveItineraryId(id);
        setItineraryId(id);
        setItineraryPollingEnabled(true);
      }
    },
    [dispatch],
  );

  const revealLeftPanel = useCallback(() => {
    // Real trip content is arriving — retire the intake hero so the map /
    // itinerary panels underneath become visible.
    setIntakeActive(false);
    if (!hasBotResponded) {
      setIsLeftPanelRevealing(true);
      requestAnimationFrame(() => {
        setTimeout(() => {
          setShowStartScreen(false);
          setHasBotResponded(true);
          setIsLeftPanelRevealing(false);
        }, 350);
      });
    }
  }, [hasBotResponded]);

  // Trigger a 10-second mobile-chat popup — "View Map" on first focus_route,
  // "View Itinerary" on first P2 transition. Each fires once per session.
  const triggerMobileEffectPopup = useCallback(
    (type: "map" | "itinerary") => {
      if (!isMobile) return;
      if (type === "map") {
        if (hasShownMapPopupRef.current) return;
        hasShownMapPopupRef.current = true;
        setMobileEffectPopup({ type: "map", label: "View Map" });
      } else {
        if (hasShownItineraryPopupRef.current) return;
        hasShownItineraryPopupRef.current = true;
        setMobileEffectPopup({ type: "itinerary", label: "View Itinerary" });
      }
      if (mobileEffectTimerRef.current)
        clearTimeout(mobileEffectTimerRef.current);
      mobileEffectTimerRef.current = setTimeout(
        () => setMobileEffectPopup(null),
        10000,
      );
    },
    [isMobile],
  );

  // Fire the "View Itinerary" mobile pill the moment we hit the same
  // P2-finalized condition that ChatKitPanel uses to inject its hidden
  // post-completion context message ("Provide short overview of the trip").
  // The trigger fn already guards against re-fires per session.
  useEffect(() => {
    if (
      finalizedStatus === "SUCCESS" &&
      botMode === "p2" &&
      itineraryCreatedInSessionRef.current
    ) {
      triggerMobileEffectPopup("itinerary");
    }
  }, [finalizedStatus, botMode, triggerMobileEffectPopup]);

  const handleLoadRouteOnMap = useCallback(() => {
    // load_route_on_map is the bot's signal that map data is ready, but we
    // no longer auto-snap the view to the map — the user stays on whichever
    // panel they were already looking at. The route data still updates
    // underneath via handleRouteReceived, so the map renders correctly when
    // the user opens it manually.
    if (
      botMode === "p1" &&
      !isItineraryCompleting &&
      !itineraryCreatedInSessionRef.current
    ) {
      setIsRoutePreparing(true);
    }
    revealLeftPanel();
  }, [revealLeftPanel, botMode, isItineraryCompleting]);

  const handleRouteReceived = useCallback(
    (routeData: { data: Location[] }) => {
      setIsRoutePreparing(false);
      revealLeftPanel();
      if (
        routeData.data &&
        Array.isArray(routeData.data) &&
        routeData.data.length > 0
      ) {
        // No longer auto-snap the view to the map on focus_route (P1 used to
        // pull the user onto the map mid-route-creation). The route data still
        // populates the underlying map and skeleton cities below; the user
        // can open the map manually whenever they want to see it.
        const cities = routeData.data.map((loc: any) => ({
          name: loc.name,
          duration: loc.duration ?? 1,
        }));
        setSkeletonCities(cities);
        skeletonCitiesRef.current = cities;
      }
      if (routeData.data && Array.isArray(routeData.data)) {
        setCurrentRoute(routeData.data);
        setLocations((prev) => {
          const newLocations = [...(prev || [])];
          routeData.data.forEach((location) => {
            const exists = newLocations.some((loc) => loc.id === location.id);
            if (!exists) newLocations.push(location);
          });
          return newLocations;
        });
      }
      // Mobile: surface the "Back to Map" pill above the chat input when a
      // route widget arrives live. Skip during thread restoration so historic
      // focus_route replays don't fire the popup on every reload.
      if (!isRestoringRef.current) {
        triggerMobileEffectPopup("map");
      }
    },
    [revealLeftPanel, triggerMobileEffectPopup],
  );

  const sessionIdFromUrl = useMemo(() => {
    if (typeof window === "undefined") return null;
    const match = window.location.pathname.match(/\/chat\/([a-f0-9-]{36})/);
    return match ? match[1] : null;
  }, []);

  const handleItineraryReceived = useCallback(
    (data: any) => {
      revealLeftPanel();

      // Once the trip has reached P2 (finalized), draft-shaped events
      // (shimmer_day_by_day / display_itinerary / display_transfers) must NOT
      // re-dispatch setItinerary — transformDraftToItinerary always carries
      // status:"Draft" and would clobber the canonical "Finalized" status the
      // post-refresh poll just resolved, hiding Routes/Bookings tabs and
      // flipping the itinerary panel back to P1 styling. The canonical fetch
      // in ItineraryContainer is the source of truth for P2 data.
      //
      // Read botModeRef, NOT the botMode state. The restore chain
      // (mount effect → restoreLatestThread → loadThread → this callback) is a
      // single fire-and-forget async run that holds the callback identities
      // from the render it started on — where botMode is still "p1". The
      // applyBotMode("p2") that restoreItineraryDirectly performs mid-flight
      // re-renders and builds a *new* handleItineraryReceived, but the running
      // chain keeps calling the old one, so a state read here is permanently
      // stale for the whole restore and this guard never fires. That let
      // loadThread's replay stamp a status:"Draft" itinerary + activeItineraryId
      // "draft" over a live P2 trip (and disable polling, so nothing corrected
      // it). Same fix already applied to the viewMode branches in loadThread.
      if (botModeRef.current === "p2") return;

      if (data?.shimmer) {
        dispatch(setItineraryStatus("itinerary_status", "PENDING"));
        dispatch(setItineraryStatus("transfers_status", "SUCCESS"));
        setViewMode("itinerary");
        setMobilePanel("map");
        setShowStartScreen(false);
        setHasBotResponded(true);

        // Only paint the skeleton over genuinely empty state. Once a real
        // display_itinerary has populated Redux (cities with UUID ids), a
        // follow-up shimmer must NOT re-dispatch skeleton — skeletonCitiesRef
        // is seeded from cumulative focus_route effects and would clobber the
        // real 2-city payload with stale waypoint rows.
        const existingCities = currentItineraryRef.current?.cities ?? [];
        const hasRealCities =
          existingCities.length > 0 &&
          !String(existingCities[0]?.id ?? "").startsWith("skeleton-city-");

        if (!hasRealCities) {
          const skeleton = buildSkeletonItinerary();
          // Stamp start/end city so the P1 day-by-day rail shows the trip
          // origin/return labels straight away, even before the canonical
          // display_itinerary effect lands. Falls back to the user's IP
          // location when the shimmer payload doesn't carry an endpoint —
          // mirrors the same fallback that handleItineraryReceived applies
          // for non-shimmer drafts below.
          const buildShimmerEndpoint = (raw: any) => {
            const name = raw?.name ?? raw?.city ?? raw?.city_name;
            const placeId = raw?.gmaps_place_id ?? raw?.place_id;
            if (name || placeId) {
              return {
                city_name: String(name ?? ""),
                gmaps_place_id: placeId ?? null,
                place_id: placeId ?? null,
                latitude: raw?.latitude ?? null,
                longitude: raw?.longitude ?? null,
              };
            }
            if (userLocation) {
              return {
                city_name: userLocation.city ?? "Your location",
                gmaps_place_id: null,
                place_id: null,
                latitude: userLocation.lat,
                longitude: userLocation.lng,
              };
            }
            return null;
          };
          (skeleton as any).start_city = buildShimmerEndpoint(data?.start_city);
          (skeleton as any).end_city = buildShimmerEndpoint(data?.end_city);
          dispatch(setItinerary(skeleton));
          dispatch(setItineraryDaybyDay(skeleton));
          dispatch(setBreif(skeleton));
        }

        if (activeItineraryId !== "skeleton" && activeItineraryId !== "draft") {
          setActiveItineraryId("skeleton");
          setItineraryPollingEnabled(false);
        }
        return;
      }

      if (
        (data?.transfers || data?.start_transfer || data?.end_transfer) &&
        !data?.itinerary &&
        !data?.routes
      ) {
        const intercity: Record<string, any> = {};
        // Leg ids in route order. This used to be a name → id map, which a
        // return trip breaks: "Sapporo" appears twice and collapses to a single
        // entry, so both Sapporo legs produced the same transfer key. Transfers
        // arrive in route order, so position is the reliable pairing.
        const cityIds: string[] = (
          currentItineraryRef.current?.cities ?? []
        ).map((c: any) => String(c.id));
        const bookingTypeFromLeg = (leg: string) => {
          const l = leg.toLowerCase();
          if (l.includes("flight")) return "Flight";
          if (l.includes("train")) return "Train";
          if (l.includes("ferry") || l.includes("boat")) return "Ferry";
          if (l.includes("bus")) return "Bus";
          return "Taxi";
        };
        // DaybyDay reads transfer cards via the intercity map. The first/last
        // (home → first city, last city → home) tiles look up by
        // `<gmaps_place_id>:<first_city_id>` and `<last_city_id>:<gmaps_place_id>`,
        // which is exactly what the server emits as
        // start_transfer/end_transfer.from/to_itinerary_city_id.
        const upsertTransfer = (key: string, t: any, idKey: string | number) => {
          const leg = t.legs?.[0] ?? "";
          intercity[key] = {
            id: `draft-transfer-${idKey}`,
            name: t.legs?.join(" + ") ?? `${t.from_city} to ${t.to_city}`,
            booking_type: bookingTypeFromLeg(leg),
            transfer_type: "intercity",
            from_city: t.from_city,
            to_city: t.to_city,
            legs: t.legs,
            duration: t.edges?.[0]?.duration,
            is_draft: true,
          };
        };
        // Transfer i joins city i → city i+1, which is exactly the key DaybyDay
        // builds (`city.id + ":" + nextCity.id`).
        (data.transfers ?? []).forEach((t: any, idx: number) => {
          const fromId = cityIds[idx] ?? `draft-city-${t.from_city}`;
          const toId = cityIds[idx + 1] ?? `draft-city-${t.to_city}`;
          upsertTransfer(`${fromId}:${toId}`, t, idx);
        });
        // Home → first city and last city → home. The city side has to be the
        // leg id (what DaybyDay looks up as `cities[0].id` / `cities[last].id`),
        // not the server's geo `to_city_id` / `from_city_id`; the home side
        // stays the gmaps place id the server sends.
        const st = data.start_transfer;
        if (st?.from_itinerary_city_id && cityIds[0]) {
          upsertTransfer(
            `${st.from_itinerary_city_id}:${cityIds[0]}`,
            st,
            "start",
          );
        }
        const et = data.end_transfer;
        const lastCityId = cityIds[cityIds.length - 1];
        if (et?.to_itinerary_city_id && lastCityId) {
          upsertTransfer(
            `${lastCityId}:${et.to_itinerary_city_id}`,
            et,
            "end",
          );
        }
        dispatch(
          setTransfersBookings({ intercity, airport: {}, intracity: {} }),
        );
        dispatch(setItineraryStatus("transfers_status", "SUCCESS"));
        return;
      }

      setShowItineraryShimmer(false);

      const draft = data?.itinerary ?? data;
      const transformed = transformDraftToItinerary(draft);
      // pax + travel-date can arrive either on the itinerary object or at the
      // effect-data root (sibling to `.itinerary`). transformDraftToItinerary
      // only sees the nested object, so backfill from the root here — keeps the
      // P1 header (Traveller Type / Date of Travelling) populated on reload too.
      const meta: any = data ?? {};
      transformed.start_date = transformed.start_date ?? meta.start_date ?? null;
      transformed.end_date = transformed.end_date ?? meta.end_date ?? null;
      transformed.travel_date =
        transformed.travel_date ?? meta.travel_date ?? null;
      transformed.group_type = transformed.group_type ?? meta.group_type ?? null;
      transformed.number_of_adults =
        transformed.number_of_adults ??
        meta.number_of_adults ??
        meta.no_of_adults ??
        null;
      transformed.number_of_children =
        transformed.number_of_children ??
        meta.number_of_children ??
        meta.no_of_children ??
        null;
      transformed.number_of_infants =
        transformed.number_of_infants ??
        meta.number_of_infants ??
        meta.no_of_infants ??
        null;
      // Fill in missing start/end city from the user's current location so the
      // P1 panel always shows a name + pin, matching the "use default user
      // location when not present" contract established in ChatKitPanel.
      if (!transformed.start_city?.city_name && userLocation) {
        transformed.start_city = {
          city_name: userLocation.city ?? "Your location",
          gmaps_place_id: null,
          place_id: null,
          latitude: userLocation.lat,
          longitude: userLocation.lng,
        };
      }
      if (!transformed.end_city?.city_name && userLocation) {
        transformed.end_city = {
          city_name: userLocation.city ?? "Your location",
          gmaps_place_id: null,
          place_id: null,
          latitude: userLocation.lat,
          longitude: userLocation.lng,
        };
      }
      currentItineraryRef.current = transformed;

      const draftStays: any[] = [];
      for (const city of transformed.cities ?? []) {
        const hotels = city.hotels ?? [];
        if (hotels.length === 0 || !hotels[0]?.name) {
          draftStays.push({
            itinerary_city_id: city.id,
            city_name: city.city?.name,
            city_id: city.city?.id,
            city_gmaps_place_id: city.city?.gmaps_place_id ?? null,
            trace_city_id: city.id,
            duration: city.duration,
            check_in: null,
            check_out: null,
          });
        } else {
          for (const hotel of hotels) {
            draftStays.push({
              ...hotel,
              itinerary_city_id: city.id,
              city_name: city.city?.name,
              city_id: city.city?.id,
              city_gmaps_place_id: city.city?.gmaps_place_id ?? null,
              lat: hotel.latitude ?? null,
              long: hotel.longitude ?? null,
              rating: hotel.rating ?? null,
              star_category: hotel.star_category ?? null,
            });
          }
        }
      }
      dispatch(setStays(draftStays));
      dispatch(setItinerary(transformed));
      dispatch(setItineraryDaybyDay(transformed));
      dispatch(setBreif(transformed));
      dispatch(setItineraryStatus("itinerary_status", "SUCCESS"));

      const hasHotels = transformed.cities?.some(
        (c: any) => c.hotels?.length > 0 && c.hotels[0]?.name,
      );
      dispatch(
        setItineraryStatus("hotels_status", hasHotels ? "SUCCESS" : "PENDING"),
      );
      dispatch(setItineraryStatus("transfers_status", "PENDING"));
      dispatch(setItineraryStatus("pricing_status", "PENDING"));
      dispatch(setItineraryStatus("finalized_status", "PENDING"));

      // botMode === "p2" was checked at the top of this callback and caused an
      // early return, so it can't be true here. finalizedStatus is read from
      // the ref for the same stale-closure reason as that guard — the selector
      // value would still say "PENDING" during a restore that has already
      // resolved the trip as finalized, and downgrade it to "draft" below.
      const isAlreadyCompleted =
        finalizedStatusRef.current === "SUCCESS" ||
        itineraryCreatedInSessionRef.current;

      if (!isAlreadyCompleted) {
        setActiveItineraryId("draft");
        setItineraryPollingEnabled(false);
      }
      setViewMode("itinerary");
      setMobilePanel("map");
    },
    // botMode / finalizedStatus are deliberately NOT deps — both are read from
    // refs above precisely because this callback outlives the render that
    // captured it (see the botModeRef guard at the top). Keeping them here
    // would also churn this callback's identity, which cascades into
    // loadThread → restoreLatestThread → the mount/popstate effects and into
    // ChatKitPanel's restoredThread effect, where a re-run mid-stream is the
    // documented hazard it guards against with appliedRestoredThreadRef.
    [
      revealLeftPanel,
      dispatch,
      buildSkeletonItinerary,
      activeItineraryId,
      userLocation,
    ],
  );

  // Patch just the Traveller Type (pax) and/or Date of Travelling on the
  // current trip in response to the `update_pax` / `update_travel_date` client
  // effects. Merges onto the existing itinerary so the P1 header refreshes
  // without rebuilding the whole route.
  const handleTripMetaUpdate = useCallback(
    (meta: {
      number_of_adults?: number;
      number_of_children?: number;
      number_of_infants?: number;
      travel_date?: string;
    }) => {
      const base = currentItineraryRef.current ?? {};
      const next: any = { ...base };
      if (meta.number_of_adults !== undefined)
        next.number_of_adults = meta.number_of_adults;
      if (meta.number_of_children !== undefined)
        next.number_of_children = meta.number_of_children;
      if (meta.number_of_infants !== undefined)
        next.number_of_infants = meta.number_of_infants;
      if (meta.travel_date !== undefined) next.travel_date = meta.travel_date;
      currentItineraryRef.current = next;
      dispatch(setItinerary(next));
      dispatch(setItineraryDaybyDay(next));
      dispatch(setBreif(next));
    },
    [dispatch],
  );

  const handleLocationReceived = useCallback(
    (locationData: { data: Location[] }) => {
      revealLeftPanel();
      if (locationData.data && Array.isArray(locationData.data)) {
        // Clear any existing polyline/route before rendering new POI pins so
        // leftover polylines from a prior transfer/route query don't persist.
        setCurrentRoute(null);
        setLocations(locationData.data);
        // No auto-focus on focus_on_map / display_pois effects — the pins
        // update underneath but the user's current panel is preserved (P1
        // used to yank into the map view; that's no longer the behaviour).
      }
    },
    [revealLeftPanel],
  );

  // Start / end trip endpoint pins (derived from shimmer_day_by_day,
  // display_itinerary, display_transfers effects in ChatKitPanel). Kept in a
  // separate slice from `locations` so they survive focus_on_map clears.
  // Rendered only in P1 — P2 uses its own itinerary visualization and would
  // duplicate these pins otherwise.
  const [endpointPins, setEndpointPins] = useState<Location[]>([]);
  // Cache of gmaps_place_id → LatLng so we don't re-geocode the same city
  // twice in a session (shimmer + display_itinerary + display_transfers all
  // repeat the same endpoints).
  const geocodeCacheRef = useRef<Record<string, { lat: number; lng: number }>>(
    {},
  );

  const geocodePlaceId = useCallback(
    async (placeId: string): Promise<{ lat: number; lng: number } | null> => {
      if (!placeId) return null;
      if (geocodeCacheRef.current[placeId])
        return geocodeCacheRef.current[placeId];
      if (typeof window === "undefined") return null;
      // Ensure the on-demand Maps SDK is loaded before geocoding.
      await loadGoogleMaps();
      if (!window.google?.maps?.Geocoder) return null;
      try {
        const geocoder = new window.google.maps.Geocoder();
        const result = await geocoder.geocode({ placeId });
        const loc = result.results?.[0]?.geometry?.location;
        if (!loc) return null;
        const coords = { lat: loc.lat(), lng: loc.lng() };
        geocodeCacheRef.current[placeId] = coords;
        return coords;
      } catch (err) {
        console.warn("[BotApp] geocode failed for", placeId, err);
        return null;
      }
    },
    [],
  );

  const handleRouteEndpointsReceived = useCallback(
    async ({
      start_city,
      end_city,
    }: {
      start_city: { name: string; gmaps_place_id: string } | null;
      end_city: { name: string; gmaps_place_id: string } | null;
    }) => {
      const resolve = async (
        raw: { name: string; gmaps_place_id: string } | null,
        kind: "start_city" | "end_city",
      ): Promise<Location | null> => {
        if (!raw) return null;
        let coords = await geocodePlaceId(raw.gmaps_place_id);
        // Fallback: if geocoding failed or no place id was provided, drop back
        // to the user's IP-resolved location so the user always sees a pin.
        if (!coords && userLocation) {
          coords = { lat: userLocation.lat, lng: userLocation.lng };
        }
        if (!coords) return null;
        return {
          id: `endpoint-${kind}`,
          name: raw.name || (kind === "start_city" ? "Start" : "End"),
          lat: coords.lat,
          lng: coords.lng,
          type: kind,
        } as Location;
      };

      const [startPin, endPin] = await Promise.all([
        resolve(start_city, "start_city"),
        resolve(end_city, "end_city"),
      ]);

      setEndpointPins([startPin, endPin].filter((p): p is Location => !!p));
    },
    [geocodePlaceId, userLocation],
  );

  const handleNewQuery = useCallback(() => {
    setLocations([]);
    setCurrentRoute(null);
    // A new query clears route-related endpoint pins too; they'll be
    // re-emitted by the next shimmer/display_itinerary/display_transfers.
    setEndpointPins([]);
  }, []);

  // Drop any P1 endpoint pins when the itinerary finalizes into P2. The P2
  // stage has its own full itinerary rendering and start/end pin handling;
  // letting these linger causes duplicate pins on the P2 map.
  useEffect(() => {
    if (botMode === "p2") setEndpointPins([]);
  }, [botMode]);

  const handleClearMap = useCallback((data?: Record<string, unknown>) => {
    setLocations([]);
    setCurrentRoute(null);
    setEndpointPins([]);
    // If the effect includes a new location to pan to, display it
    if (
      data?.data &&
      Array.isArray(data.data) &&
      (data.data as any[]).length > 0
    ) {
      setLocations(data.data as Location[]);
    }
  }, []);

  const loadThread = useCallback(
    async (
      threadId: string,
      sessionIdOverride?: string,
      knownStage?: string | null,
    ) => {
      if (isLoadingThreadRef.current) return;
      isLoadingThreadRef.current = true;
      // Stays true through ChatKitPanel's restoredThread useEffect, which
      // replays map_effects via onRouteReceived/onLocationReceived — without
      // this guard those calls flip viewMode back to "map" after the
      // pre-emptive/post-status setViewMode("itinerary") below.
      isRestoringRef.current = true;
      try {
        const res = await fetch(CHATKIT_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "threads.get_by_id",
            params: { thread_id: threadId },
            platform: getPlatform(),
          }),
        });
        const data = await res.json();

        // Resolve the session_id that OWNS this thread. A session_id must map to
        // exactly one thread_id, and ChatKitPanel's remount re-keys sessionIdRef
        // from activeChatSessionId — so activeChatSessionId must always reflect
        // THIS thread's session, never the previously-open one. Order of trust:
        //   1. sessionIdOverride — the id the caller already knew (the sidebar
        //      row's session_id, or the URL sid on refresh). Authoritative.
        //   2. get_by_id response — a best-effort hook; the backend currently
        //      returns no session_id on threads.get_by_id, so this is normally
        //      empty. Kept in case that changes.
        //   3. current URL sid — final fallback so we NEVER leave
        //      activeChatSessionId pointing at a different (stale) session, which
        //      would send the previous session_id with this thread_id.
        const urlSessionId =
          typeof window !== "undefined"
            ? window.location.pathname.match(/\/chat\/([a-f0-9-]{36})/)?.[1]
            : undefined;
        const derivedSessionId =
          data.session_id ?? data.filter_session_id ?? data.metadata?.session_id;
        const threadSessionId =
          sessionIdOverride ?? derivedSessionId ?? urlSessionId;

        if (
          process.env.NODE_ENV !== "production" &&
          !sessionIdOverride &&
          !derivedSessionId
        ) {
          console.warn(
            `[loadThread] no session_id from caller or backend for thread ${threadId}; ` +
              `fell back to URL "${urlSessionId ?? ""}". Pass sessionIdOverride to keep ` +
              `session_id ↔ thread_id pinned.`,
          );
        }

        if (threadSessionId) {
          const target = `/chat/${threadSessionId}`;
          // Only claim the URL if we're still on a /chat surface — this fetch is
          // async and the user may have navigated away (browser back) meanwhile.
          if (
            window.location.pathname !== target &&
            window.location.pathname.startsWith("/chat")
          ) {
            pushUrlDetached(target);
          }
          safeSetSessionItem(`chatkit_session_${target}`, threadSessionId);
          setActiveChatSessionId(threadSessionId);
        }

        // ── Resolve the stage BEFORE setRestoredThread commits ──────────────
        // That commit is what fires ChatKitPanel's restored-thread effect, and
        // that effect decides off botMode whether to replay the draft-shaped
        // display_itinerary. Both existing callers settle botMode first —
        // restoreLatestThread runs restoreItineraryDirectly on stage P2, and
        // handleThreadSelect does the same whenever the thread row carried a
        // session_id — so they pass a resolved `knownStage` (a string, or null
        // for "resolved to nothing").
        //
        // `undefined` means the caller could NOT resolve it: the row carried
        // neither session_id nor filter_session_id, so handleThreadSelect
        // skipped restoreItineraryDirectly entirely. Only in that case is the
        // session id first known here, derived from the get_by_id response —
        // so run the same restore the caller would have run, before the commit.
        // Left unresolved, botMode would still be "p1" at commit time and a P2
        // trip would get painted as a draft by that replay.
        let resolvedStage: string | null = knownStage ?? null;
        if (knownStage === undefined && threadSessionId) {
          try {
            resolvedStage = await restoreItineraryDirectly(threadSessionId);
          } catch (err) {
            console.warn(
              "[loadThread] late restoreItineraryDirectly failed, continuing unresolved:",
              err,
            );
            resolvedStage = null;
          }
        }

        setRestoredThread(data);
        // Thread-level customer_name (P1/draft stage has no itinerary in redux
        // yet) feeds the chat avatar's customer-initial fallback. Only overwrite
        // when get_by_id actually carries a name — otherwise keep whatever was
        // seeded from the thread-list row in handleThreadSelect.
        if (typeof data?.customer_name === "string" && data.customer_name.trim()) {
          dispatch(setThreadCustomerName(data.customer_name.trim()));
        }
        setActiveThreadId(threadId);
        setIsChatActive(true);

        // If the thread has any chat items (messages), reveal the chat panel
        const hasItems = (data.items?.data ?? []).length > 0;
        if (hasItems) {
          setHasBotResponded(true);
          setShowStartScreen(false);
        }

        (data.map_effects ?? []).forEach((effect: any) => {
          if (effect.name === "focus_route" && effect.data) {
            handleRouteReceived({ data: effect.data });
            setHasBotResponded(true);
            setShowStartScreen(false);
          } else if (
            (effect.name === "focus_on_map" ||
              effect.name === "display_pois_on_map" ||
              effect.name === "show_attraction_on_map") &&
            effect.data
          ) {
            handleLocationReceived({ data: effect.data });
            setHasBotResponded(true);
            setShowStartScreen(false);
          } else if (effect.name === "clear_map") {
            handleClearMap(effect.data);
          }
        });

        const itineraryEffects: any[] = data.itinerary_effects ?? [];
        let completedIdFromEffects: string | null = null;
        let startedIdFromEffects: string | null = null;

        // First pass — extract IDs only. We need to know the itinerary's live
        // status before deciding whether to replay draft-shaped effects, since
        // replaying stale display_itinerary on a finalized trip stamps pre-edit
        // start/end cities onto Redux (phantom P1 pins that flicker until the
        // canonical fetch arrives).
        for (const effect of itineraryEffects) {
          // Both spellings — threads stored before the backend rename replay
          // the old name here (see COMPLETION_STARTED_EFFECTS).
          if (COMPLETION_STARTED_EFFECTS.includes(effect.name)) {
            startedIdFromEffects =
              (effect.data?.itinerary_id as string) ?? null;
          } else if (effect.name === "itinerary_completion_process_completed") {
            completedIdFromEffects =
              (effect.data?.itinerary_id as string) ?? null;
          }
        }

        const hasCompletedEffectInLoop = !!completedIdFromEffects;
        const hasDisplayItinerary = itineraryEffects.some(
          (e) => e.name === "display_itinerary",
        );
        const effectItineraryId =
          completedIdFromEffects ?? startedIdFromEffects;
        const restoredItineraryId =
          effectItineraryId ??
          (hasDisplayItinerary ? (threadSessionId ?? sessionId) : null);

        let isTripFinalized = hasCompletedEffectInLoop;
        let statusCheckFailed = false;
        let stageIsP1 = false;

        // Pre-emptively land on the itinerary view whenever the thread has a
        // restored itinerary. The map_effects replay above can call
        // setViewMode("map") and the status check below is async, so without
        // this the user briefly sees the map on every reload (especially P2)
        // before the post-await setViewMode("itinerary") at the bottom of this
        // block fires. For finalized trips also default the mobile panel to
        // itinerary; non-finalized restores keep the existing mobile=map default
        // until the status check resolves below.
        if (restoredItineraryId) {
          setViewMode("itinerary");
          if (hasCompletedEffectInLoop) setMobilePanel("itinerary");
          // Refresh UX: a display_itinerary or completion effect in the
          // restored thread means the user already has an itinerary —
          // land on the itinerary tab on mobile. Only fires from the
          // restore path (loadThread); live-stream display_itinerary
          // effects do NOT switch tabs.
          if (hasDisplayItinerary || hasCompletedEffectInLoop) {
            mobileTabSwitchRef.current?.("itinerary");
          }
        } else if (resolvedStage === "P2") {
          // Stage P2 per the status API, but this thread carries no
          // display_itinerary / completion effect to restore from (so
          // restoredItineraryId is null). An itinerary still exists —
          // restoreItineraryDirectly has already hydrated the canonical
          // trip + enabled polling. Keep the desktop on the itinerary tab;
          // falling through to the map/chat branches below would strand the
          // user on the map on every refresh.
          setViewMode("itinerary");
        } else if ((data.map_effects ?? []).length > 0) {
          // P1 chat-only thread (no itinerary yet) but has route/POI data —
          // sessionId-default of "itinerary" hides the map behind an empty
          // itinerary panel, so flip to "map" so the route pins are visible.
          if(botModeRef.current == "p1"){
            setViewMode("map");
            setMobilePanel("map");
          }
        } else if (hasItems) {
          // Chat-only thread with no itinerary and no map_effects (e.g. just
          // destination suggestions). The sessionId-default of "itinerary"
          // would paint an empty itinerary panel on desktop — flip to "map"
          // so the user sees the map alongside the chat. Mobile defaults to
          // the chat tab in this case. Read botModeRef (not botMode state),
          // which is fresh after restoreItineraryDirectly ran this same tick —
          // a stale "p2" here is what wrongly painted the empty itinerary panel
          // when switching from a P2 thread to a P1 chat thread.
          if(data?.items?.data?.[0]?.content?.[0]?.text == "Hey Kaira! provide summary of my itinerary"){
             setViewMode("itinerary");
          }
          else if(botModeRef.current == "p2"){
            setViewMode("itinerary");
          }
          else setViewMode("map");
          setMobilePanel("chat");
        }

        // Mobile: a restored thread with no itinerary must land on the chat
        // tab. MobileLayout now defaults activeTab to "itinerary" on a sessionId
        // refresh (to avoid the chat→itinerary flash for real itineraries), so
        // chat-only threads need an explicit switch back or they'd strand on a
        // blank itinerary tab (itinerary content is gated behind an itinerary id).
        //
        // Skip this when the status API reports P2: an itinerary exists even
        // though the thread carries no display_itinerary effect, and
        // restoreItineraryDirectly has already switched to the itinerary tab.
        // handleTabClick("chat") also runs setViewMode("map"), so firing it
        // here would clobber the itinerary view and strand a P2 refresh on the
        // map (the very bug this avoids).
        if (!restoredItineraryId && resolvedStage !== "P2") {
          mobileTabSwitchRef.current?.("chat");
        }

        if (restoredItineraryId) {
          // Check status immediately to determine the actual state. The
          // response's `stage` key ("P1" | "P2") drives which path we take —
          // P1 skips itinerary status dispatches entirely; P2 hydrates them
          // so ItineraryContainer can render the canonical trip.
          try {
            const { axiosGetItineraryStatus } =
              await import("../../services/itinerary/daybyday/preview");
            const statusRes = await axiosGetItineraryStatus.get(
              `/${restoredItineraryId}/status/`,
            );
            const status = statusRes.data?.celery;
            // `resolvedStage === "P2"` is sticky. The stage was already
            // resolved from /{sid}/status/ — by the caller, or by the late
            // restore above — and when it said P2 that ALSO
            // ran restoreItineraryDirectly: canonical trip hydrated, botMode
            // flipped to p2, polling on. session_id and itinerary_id are the
            // same identifier (the clone flow re-keys the session to the new
            // itinerary id), so this second call hits the same record: a
            // disagreement is replica lag or an absent `stage` key, never a
            // genuinely-P1 trip. Without the pin, that flake fell into the
            // `else` below and half-undid the hydration — botMode back to p1,
            // activeItineraryId "draft", polling off — stranding a live P2 trip
            // on the P1 UI with nothing left to correct it. It also stops this
            // call from undoing the fromTailored path, where
            // restoreItineraryDirectly deliberately reports "P2" while the
            // backend still says P1 during the celery build.
            const stage =
              resolvedStage === "P2"
                ? "P2"
                : (statusRes.data?.stage ?? resolvedStage);
            if (status) {
              if (stage === "P2") {
                dispatch(
                  setItineraryStatus(
                    "itinerary_status",
                    status.ITINERARY || "PENDING",
                  ),
                );
                dispatch(
                  setItineraryStatus(
                    "hotels_status",
                    status.HOTELS || "PENDING",
                  ),
                );
                dispatch(
                  setItineraryStatus(
                    "transfers_status",
                    status.TRANSFERS || "PENDING",
                  ),
                );
                dispatch(
                  setItineraryStatus(
                    "pricing_status",
                    status.PRICING || "PENDING",
                  ),
                );
                dispatch(
                  setItineraryStatus(
                    "display_text",
                    status.display_text || null,
                  ),
                );
                dispatch(setItineraryStatus("notes", status.notes || []));

                const allDone = [
                  "ITINERARY",
                  "HOTELS",
                  "TRANSFERS",
                  "PRICING",
                ].every(
                  (k) => status[k] === "SUCCESS" || status[k] === "FAILURE",
                );

                if (allDone) {
                  dispatch(setItineraryStatus("finalized_status", "SUCCESS"));
                  applyBotMode("p2");
                  setItineraryId(restoredItineraryId);
                  isTripFinalized = true;
                } else {
                  dispatch(setItineraryStatus("finalized_status", "PENDING"));
                  applyBotMode("p2");
                  setItineraryId(restoredItineraryId);
                  setIsItineraryCompleting(true);
                }
              } else {
                // Stage P1 (or missing, with no P2 already established by the
                // caller — see the sticky resolution above) — chatkit-only
                // path. No itinerary dispatches; the thread's effects already
                // drive P1 visuals. Skip enabling itinerary polling below —
                // ItineraryContainer would otherwise poll and redirect to
                // /thank-you on FAILURE.
                stageIsP1 = true;
                applyBotMode("p1");
                setItineraryId("");
              }
            }
          } catch (e) {
            // Status API failed — bounce to /thank-you rather than rendering
            // a half-restored session.
            console.warn(
              "[loadThread] status check failed, redirecting to /thank-you:",
              e,
            );
            statusCheckFailed = true;
            try {
              await router.replace("/thank-you");
            } catch {
              if (typeof window !== "undefined") {
                window.location.href = "/thank-you";
              }
            }
            return;
          }
        }

        // Second pass — replay effects. Skip draft-shaped itinerary/transfers
        // effects when the trip is already finalized; ItineraryContainer will
        // fetch canonical P2 data shortly.
        for (const effect of itineraryEffects) {
          if (effect.name === "display_itinerary" && !isTripFinalized) {
            handleItineraryReceived(effect.data);
          } else if (effect.name === "display_transfers" && !isTripFinalized) {
            handleItineraryReceived({
              transfers: effect.data.transfers,
              start_transfer: effect.data.start_transfer,
              end_transfer: effect.data.end_transfer,
            });
          }
        }

        if (restoredItineraryId) {
          setShowItineraryShimmer(false);
          // Intentionally NOT wiping the cart here. On initial reload,
          // restoreItineraryDirectly has already cleared it and
          // ItineraryContainer's polling may race ahead and call
          // getPaymentInfo — wiping again would clobber that fetch and
          // leave the CTA stuck on "Calculating price…" until the user
          // reopens the cart. On thread switch, ItineraryContainer
          // remounts and its mount effect dispatches pricing_status =
          // PENDING, so the stale cart isn't visible during the gap.
          if (statusCheckFailed || stageIsP1) {
            // Either status API failed, or trip is still in P1 (chat-only)
            // stage — treat as draft so CTA shows and ItineraryContainer
            // doesn't mount/poll. Don't override activeItineraryId if
            // display_itinerary already set it to "draft".
            if (!hasDisplayItinerary) {
              setActiveItineraryId("draft");
            }
            setItineraryPollingEnabled(false);
          } else {
            // Status API succeeded — use the real ID
            dispatch(setItineraryIdAction(restoredItineraryId));
            setActiveItineraryId(restoredItineraryId);
            setItineraryPollingEnabled(true);
          }
          setShowChatBot(true);
          setChatBotIdOnce(restoredItineraryId);
          setShowStartScreen(false);
          setHasBotResponded(true);
          setViewMode("itinerary");
          setMobilePanel(isTripFinalized ? "itinerary" : "map");
        }

        // No itinerary effects at all — this is an old itinerary
        // Fall back to direct status API load.
        const hasAnyItineraryEffect = itineraryEffects.some((e) =>
          [
            "display_itinerary",
            ...COMPLETION_STARTED_EFFECTS,
            "itinerary_completion_process_completed",
          ].includes(e.name),
        );

        const fallbackSessionId = threadSessionId ?? sessionId;

        if (
          !restoredItineraryId &&
          !hasAnyItineraryEffect &&
          !hasItems &&
          fallbackSessionId
        ) {
          await restoreItineraryDirectly(fallbackSessionId);
        }
      } catch (err) {
        console.error("Failed to load thread:", err);
      } finally {
        isLoadingThreadRef.current = false;
        // Defer clearing so ChatKitPanel's restoredThread useEffect (which
        // fires after restoredThread state commits) still sees the guard.
        setTimeout(() => {
          isRestoringRef.current = false;
        }, 0);
      }
    },
    [
      handleRouteReceived,
      handleLocationReceived,
      handleItineraryReceived,
      dispatch,
      restoreItineraryDirectly,
      setChatBotIdOnce,
      sessionId,
      router,
    ],
  );

  const restoreLatestThread = useCallback(
    async (sid: string) => {
      // ── Refresh restore: status API drives the path ──────────────────────
      // Status response now includes a `stage` key ("P1" | "P2") that decides
      // which APIs to fire:
      //
      //   1. Status API (source of truth — failure is fatal).
      //      ├─ stage P2 → restoreItineraryDirectly(sid) hydrates the
      //      │            canonical itinerary + Redux statuses, then chatkit
      //      │            threads.list / get_by_id pulls in messages.
      //      ├─ stage P1 → skip itinerary APIs entirely; only chatkit
      //      │            threads.list / get_by_id (botMode stays on p1).
      //      └─ fail     → /thank-you. No chatkit fallback.

      // ── Step 1: status API ───────────────────────────────────────────────
      // The status response carries a `stage` key ("P1" | "P2") that drives
      // which restore path we take. Status API failure is fatal — bounce to
      // /thank-you rather than falling back to chatkit alone.
      let statusOk = false;
      let stage: string | null = null;
      let allDone = false;
      try {
        const { axiosGetItineraryStatus } =
          await import("../../services/itinerary/daybyday/preview");
        const statusRes = await axiosGetItineraryStatus.get(`/${sid}/status/`);
        const celery = statusRes?.data?.celery;
        stage = statusRes?.data?.stage ?? null;
        statusOk = !!celery;
        if (celery) {
          allDone = ["ITINERARY", "HOTELS", "TRANSFERS", "PRICING"].every(
            (k) => celery[k] === "SUCCESS" || celery[k] === "FAILURE",
          );
        }
      } catch (e) {
        console.warn("[restoreLatestThread] status check failed:", e);
        statusOk = false;
      }

      if (!statusOk) {
        console.warn(
          "[restoreLatestThread] status API failed — redirecting to /thank-you",
        );
        try {
          await router.replace("/thank-you");
        } catch {
          if (typeof window !== "undefined") {
            window.location.href = "/thank-you";
          }
        }
        return;
      }

      // ── Step 2: P2 — itinerary APIs first, then chatkit get_by_id ────────
      if (stage === "P2") {
        await restoreItineraryDirectly(sid);
      } else {
        // Stage P1 — chatkit only. Mark the chat as active and ensure botMode
        // stays on p1 so ChatKitPanel routes through the /chatkit p1 endpoint.
        applyBotMode("p1");
        setShowChatBot(true);
        setShowStartScreen(false);
        setIsChatActive(true);
      }

      // ── Step 3: chatkit threads.list → loadThread (threads.get_by_id) ────
      try {
        const listRes = await fetch(CHATKIT_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "threads.list",
            params: { limit: 9999, order: "desc" },
            filter_session_id: sid,
            platform: getPlatform(),
          }),
        });
        const listData = await listRes.json();
        const threads = listData.data ?? [];
        if (threads.length > 0) {
          // Seed the chat avatar's customer from the list row before loadThread
          // (get_by_id may omit customer_name); loadThread re-confirms it.
          const rowName = threads[0]?.customer_name;
          if (typeof rowName === "string" && rowName.trim()) {
            dispatch(setThreadCustomerName(rowName.trim()));
          }
          // Pin the owning session_id explicitly. threads.list was filtered by
          // `sid`, so this thread belongs to it; passing it (preferring the row's
          // own session_id) stops loadThread from having to guess — get_by_id
          // returns no session_id, so without this the pairing would fall back to
          // the URL and silently drift if the URL ever lags the restore.
          await loadThread(threads[0].id, threads[0].session_id ?? sid, stage);
        } else if (stage === "P2" && allDone) {
          // P2 trip confirmed but no chat thread yet — seed a summary prompt
          // so the user lands with context. botMode is already "p2" via
          // restoreItineraryDirectly, so ChatKitPanel routes through /chatkit/p2.
          // If the user is not logged in, defer the prompt: ChatKitPanel will
          // queue it as the post-login message and surface a login/signup CTA
          // instead of auto-sending an unauthenticated summary request.
          const loggedIn = !!getAuthToken();
          console.log(
            `[restoreLatestThread] stage P2 + empty chatkit — seeding summary prompt (loggedIn=${loggedIn})`,
          );
          setInitialPrompt("Hey Kaira! provide summary of my itinerary");
          setInitialPromptRequiresLogin(!loggedIn);
          setIsChatActive(true);
        } else if (stage === "P2" && fromTailored) {
          // Tailored flow lands here while celery is still building. Don't fire
          // thread.create yet — the summary prompt would hit /chatkit/p2 before
          // the itinerary exists server-side. Mark the seed as pending; the
          // itinerary_status useEffect below sends it once polling reaches
          // SUCCESS.
          pendingTailoredSeedRef.current = true;
          console.log(
            "[restoreLatestThread] stage P2 + fromTailored + still building — deferring summary prompt until itinerary_status=SUCCESS",
          );
        } else {
          console.log(
            `[restoreLatestThread] stage ${stage ?? "unknown"} + empty chatkit — chat skipped`,
          );
        }
      } catch (err) {
        console.warn("[restoreLatestThread] chatkit fetch failed:", err);
      }
    },
    [restoreItineraryDirectly, loadThread, router, fromTailored],
  );

  // ── Consume a pending seed prompt left by trip.redirect_to_p1 ───────────
  // When a chat widget kicks the user into a fresh /chat/{sessionId} (e.g.
  // "Start Planning New Trip"), the seed context is stashed in localStorage
  // under `pending_initial_prompt_{sessionId}`. Pick it up here, mark the
  // chat active, and short-circuit restoreLatestThread — the session is
  // brand-new, so the status API would 404 and bounce the user to /thank-you.
  useEffect(() => {
    if (!sessionId) return;
    if (typeof window === "undefined") return;
    let pending: string | null = null;
    try {
      pending = localStorage.getItem(`pending_initial_prompt_${sessionId}`);
    } catch {
      pending = null;
    }
    if (!pending) return;
    try {
      localStorage.removeItem(`pending_initial_prompt_${sessionId}`);
    } catch {
      /* noop */
    }
    hasRestoredRef.current = true;
    applyBotMode("p1");
    setShowStartScreen(false);
    setIsChatActive(true);
    setHasBotResponded(true);
    setInitialPrompt(pending);
    setInitialPromptRequiresLogin(false);
    setActiveChatSessionId(sessionId);

    // Wipe local + Redux state left behind by the prior session. The
    // BotApp instance itself is fresh (key={sessionId} in /chat/[id].tsx),
    // but Redux slices persist across remounts — without these clears the
    // left panel renders the previous itinerary's cities / cart / transfers
    // until the new thread starts producing effects.
    setLocations([]);
    setCurrentRoute(null);
    setItineraryData(null);
    setTransfers(null);
    setSkeletonCities([]);
    skeletonCitiesRef.current = [];
    setActiveItineraryId(null);
    setItineraryPollingEnabled(false);
    setShowItineraryShimmer(false);
    setIsItineraryCompleting(false);
    setCompletingItineraryId(null);
    setLoaderDisplayText(null);
    setLeftPanelMode("default");
    setSeedActive(false);
    setItineraryId("");
    currentItineraryRef.current = null;

    dispatch(setItinerary({}));
    dispatch(setCart({}));
    dispatch(setStays([]));
    dispatch(setTransfersBookings(null));
    dispatch(setItineraryStatus("itinerary_status", "PENDING"));
    dispatch(setItineraryStatus("transfers_status", "PENDING"));
    dispatch(setItineraryStatus("pricing_status", "PENDING"));
    dispatch(setItineraryStatus("hotels_status", "PENDING"));
    dispatch(setItineraryStatus("finalized_status", "PENDING"));
  }, [sessionId, dispatch]);

  // ── Only restore on initial mount ────────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return;
    if (hasRestoredRef.current) return;
    if (userSelectedThreadRef.current) return;
    hasRestoredRef.current = true;
    if (window.location.pathname.match(/\/chat\/([a-f0-9-]{36})/)) {
      restoreLatestThread(sessionId);
    }
  }, [sessionId, restoreLatestThread]);

  // ── Browser back/forward between chat sessions ────────────────────────────
  // The /chat/[id] page no longer keys BotApp on router.query.id (that key
  // flipped on the first drawer CTA after a session switch — when Next finally
  // reconciled the pushState URL — remounting BotApp and refetching). Session
  // switches (thread-select, itinerary creation) already reload the panel in
  // place. That leaves browser back/forward, which used to rely on the remount;
  // we reload the previous session in place here instead.
  const activeChatSessionIdRef = useRef(activeChatSessionId);
  activeChatSessionIdRef.current = activeChatSessionId;
  // Always call the latest handleNewChat from the popstate handler below without
  // re-subscribing the listener (handleNewChat is redefined each render).
  const handleNewChatRef = useRef<() => void>(() => {});
  useEffect(() => {
    const onPopState = () => {
      const match = window.location.pathname.match(/\/chat\/([a-f0-9-]{36})/);
      const urlSession = match?.[1];

      // Backed out to the bare /chat surface (over a pushed /chat/{id}): reset
      // to a fresh chat so the previous session's content doesn't linger. /chat
      // must always show fresh /chat content. Ignore popstate that isn't on the
      // bare chat surface (drawer-query pops, or pops on other pages).
      if (!urlSession) {
        const path = window.location.pathname;
        const onBareChat = path === "/chat" || path === "/chat/";
        if (onBareChat && activeChatSessionIdRef.current) {
          handleNewChatRef.current();
          setActiveChatSessionId(undefined);
        }
        return;
      }

      // Only react to landing on a *different* chat session. Same-session
      // popstate (e.g. backing out of a ?drawer= query) is owned by the router
      // / drawers and must not trigger a reload.
      if (urlSession === activeChatSessionIdRef.current) return;

      // Reset the previous session's panel state in place (mirrors the
      // handleThreadSelect reset) so the restored session doesn't paint over
      // stale cities / cart / transfers.
      userSelectedThreadRef.current = false;
      isLoadingThreadRef.current = false;
      // Keep the initial-restore effect above from double-firing for this id.
      hasRestoredRef.current = true;
      setRestoredThread(null);
      dispatch(setThreadCustomerName(null));
      setLocations([]);
      setCurrentRoute(null);
      setSkeletonCities([]);
      skeletonCitiesRef.current = [];
      setActiveItineraryId(null);
      setItineraryPollingEnabled(false);
      setShowItineraryShimmer(false);
      setIsItineraryCompleting(false);
      itineraryCreatedInSessionRef.current = false;
      // applyBotMode, not setBotMode — this was the one site in the file that
      // moved the state without the ref, leaving botModeRef stuck on "p2" after
      // a back/forward into a P1 session. Everything that reads botModeRef
      // (loadThread's view branches, handleItineraryReceived's P2 guard) would
      // then treat the P1 session as P2 and suppress its own panel.
      applyBotMode("p1");
      setItineraryId("");
      setViewMode("map");
      setHasBotResponded(false);
      setShowStartScreen(false);
      setIsChatActive(true);
      currentItineraryRef.current = null;
      setShowPaymentDrawer(false);

      dispatch(setItinerary({}));
      dispatch(setCart({}));
      dispatch(setStays([]));
      dispatch(setTransfersBookings(null));
      dispatch(setItineraryStatus("itinerary_status", "PENDING"));
      dispatch(setItineraryStatus("transfers_status", "PENDING"));
      dispatch(setItineraryStatus("hotels_status", "PENDING"));
      dispatch(setItineraryStatus("pricing_status", "PENDING"));
      dispatch(setItineraryStatus("finalized_status", "PENDING"));

      setActiveChatSessionId(urlSession);
      setChatKey((prev) => prev + 1);
      restoreLatestThread(urlSession);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [restoreLatestThread, dispatch, applyBotMode]);

  const handleThreadSelect = useCallback(
    async (
      threadId: string,
      knownSessionId?: string,
      knownCustomerName?: string,
    ) => {
      // Reset load guard so the new thread can load
      isLoadingThreadRef.current = false;
      clearStaleChatSessions();
      userSelectedThreadRef.current = true;

      // If we already know the session_id from the thread list, update the URL
      // and activeChatSessionId immediately — before the async loadThread call —
      // so ChatKitPanel remounts with the correct session ID straight away.
      if (knownSessionId) {
        const target = `/chat/${knownSessionId}`;
        if (window.location.pathname !== target) {
          pushUrlDetached(target);
        }
        safeSetSessionItem(`chatkit_session_${target}`, knownSessionId);
        setActiveChatSessionId(knownSessionId);
      }

      setRestoredThread(null);
      // Seed the customer from the thread-list row immediately so the chat
      // avatar shows the customer's initial (not the viewer's) right away —
      // in P1/draft there's no itinerary in redux and threads.get_by_id may
      // not carry customer_name. loadThread re-confirms it below.
      dispatch(
        setThreadCustomerName(
          typeof knownCustomerName === "string" && knownCustomerName.trim()
            ? knownCustomerName.trim()
            : null,
        ),
      );
      setLocations([]);
      setCurrentRoute(null);
      setSkeletonCities([]);
      skeletonCitiesRef.current = [];
      setActiveItineraryId(null);
      setItineraryPollingEnabled(false);
      setShowItineraryShimmer(false);
      setIsItineraryCompleting(false);
      itineraryCreatedInSessionRef.current = false;
      applyBotMode("p1");
      setItineraryId("");
      setViewMode("map");
      setHasBotResponded(false);
      setShowStartScreen(false);
      setIsChatActive(true);
      setSeedActive(false);
      currentItineraryRef.current = null;
      // Close payment drawer from previous itinerary
      setShowPaymentDrawer(false);
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("drawer");
      replaceUrl(cleanUrl.toString());

      dispatch(setItinerary({}));
      dispatch(setCart({}));
      dispatch(setStays([]));
      dispatch(setTransfersBookings(null));
      dispatch(setItineraryStatus("itinerary_status", "PENDING"));
      dispatch(setItineraryStatus("transfers_status", "PENDING"));
      dispatch(setItineraryStatus("hotels_status", "PENDING"));
      dispatch(setItineraryStatus("pricing_status", "PENDING"));
      dispatch(setItineraryStatus("finalized_status", "PENDING"));

      // Mirror the page-reload flow (restoreLatestThread): hit the status API
      // first via restoreItineraryDirectly so Redux statuses + activeItineraryId
      // land before chatkit responds. That kicks off ItineraryContainer's
      // canonical itinerary fetch immediately, instead of waiting for
      // loadThread → threads.get_by_id → status check serially. Skipped when
      // the thread row didn't carry a session_id; loadThread will derive it
      // from the get_by_id response and run this same restore itself.
      //
      // Stays `undefined` when that skip happens — loadThread treats undefined
      // as "stage unresolved, resolve it yourself before committing the thread"
      // and null as "resolved to nothing". Do NOT initialise this to null: that
      // would tell loadThread the stage was already settled and leave botMode
      // on "p1" while ChatKitPanel replayed a P2 trip's draft effects.
      let stageFromRestore: string | null | undefined;
      if (knownSessionId) {
        try {
          stageFromRestore = await restoreItineraryDirectly(knownSessionId);
        } catch (err) {
          console.warn(
            "[handleThreadSelect] restoreItineraryDirectly failed, letting loadThread resolve the stage:",
            err,
          );
          stageFromRestore = undefined;
        }
      }

      // Then load thread for chat history. loadThread re-runs the status
      // check internally when its effects carry an itinerary id — same
      // redundant ordering restoreLatestThread relies on, kept for parity.
      await loadThread(threadId, knownSessionId, stageFromRestore);
      setChatKey((prev) => prev + 1);
    },
    [loadThread, dispatch, restoreItineraryDirectly],
  );

  // Activate a fresh, empty in-chat intake form. Shared by the `?intake=1`
  // "Plan with Kaira" landing, the bare direct-/chat default, and the New
  // Chat action on non-theme pages. Optionally seeds the destination step.
  const activateEmptyIntake = useCallback(
    (destName?: string) => {
      dispatch(resetIntakeForm());
      if (destName) {
        const dest = { name: destName };
        dispatch(
          updateIntakeForm({
            destination: dest,
            destinations: [dest],
            query: destName,
            stepsCompleted: [true, false, false, false],
          }),
        );
      }
      setStartEmptyIntake(true);
      setIntakeActive(true);
      setShowStartScreen(false);
      setIsChatActive(true);
    },
    [dispatch],
  );

  // Mobile chat header's close button. Once the thread has produced an
  // itinerary that's the thing to close INTO — the reader came here to build a
  // trip, and the trip now exists at its own URL. That wins over the theme page
  // even for a thread that started on one, because going back to the marketing
  // page would throw away what they just made. Failing that, a thread that
  // started on a theme page goes straight back to that page; a plain /chat
  // session falls back to the previous history entry (and the homepage when
  // /chat was opened cold).
  const handleCloseChat = () => {
    if (hasItinerary) {
      router.push(`/itinerary/${activeItineraryId}`);
      return;
    }
    const themePath = getThemePagePath(themeSlug);
    if (themePath) {
      router.push(themePath);
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  const handleNewChat = () => {
    clearStaleChatSessions();
    initialPromptRef.current = null;
    userSelectedThreadRef.current = false;
    hasRestoredRef.current = false;
    setIsItineraryCompleting(false);
    itineraryCreatedInSessionRef.current = false;
    setInitialPrompt(null);
    setInitialPromptRequiresLogin(false);
    setLocations([]);
    setCurrentRoute(null);
    setItineraryData(null);
    setTransfers(null);
    setViewMode("map");
    setShowStartScreen(true);
    setHasBotResponded(false);
    setIsChatActive(false);
    setMobilePanel("chat");
    setLeftPanelMode("default");
    setIntakeActive(false);
    // Reset startEmptyIntake too: chatKey bumps below remount ChatKitPanel,
    // and a lingering startEmptyIntake=true would re-run its intake-injection
    // effect (onIntakeFormStart → setIntakeActive(true)) and pop the
    // IntakeLeftPanel hero back up on the fresh chat.
    setStartEmptyIntake(false);
    // Same for the themed mini-form arrival (/chat?themeForm=<slug> from a
    // theme page's "Build this itinerary"). Its injection effect is guarded by
    // a ref that resets with the chatKey remount below, so leaving the flag on
    // would re-inject the theme greeting + form card into the fresh chat. Drop
    // the saved items/slug with it so the new chat doesn't forward the previous
    // theme's selection to /chatkit.
    setStartThemedForm(false);
    setThemeForm(null);
    setThemeItems(undefined);
    setThemeNote(undefined);
    setThemeSlug(undefined);
    setSeedActive(false);
    dispatch(resetIntakeForm());
    setCompletingItineraryId(null);
    setLoaderDisplayText(null);
    setActiveItineraryId(null);
    setItineraryPollingEnabled(false);
    setShowChatBot(false);
    // Do NOT reset chatBotItineraryId here — ChatBot must not remount on new chat
    setRestoredThread(null);
    dispatch(setThreadCustomerName(null));
    setActiveThreadId(null);
    applyBotMode("p1");
    setItineraryId("");
    setSkeletonCities([]);
    skeletonCitiesRef.current = [];
    currentItineraryRef.current = null;
    setShowPaymentDrawer(false);
    const cleanUrl2 = new URL(window.location.href);
    cleanUrl2.searchParams.delete("drawer");
    replaceUrl(cleanUrl2.toString());

    dispatch(setItinerary({}));
    dispatch(setCart({}));
    dispatch(setStays([]));
    dispatch(setTransfersBookings(null));
    dispatch(setItineraryStatus("itinerary_status", "PENDING"));
    dispatch(setItineraryStatus("transfers_status", "PENDING"));
    dispatch(setItineraryStatus("pricing_status", "PENDING"));
    dispatch(setItineraryStatus("hotels_status", "PENDING"));
    dispatch(setItineraryStatus("finalized_status", "PENDING"));

    setChatKey((prev) => prev + 1);
    const currentPath = window.location.pathname;
    const targetPath = currentPath.startsWith("/theme/")
      ? currentPath
      : "/chat";
    if (currentPath !== targetPath) {
      setActiveChatSessionId(undefined);
      pushUrlDetached(targetPath);
    }

    // Non-theme /chat: the fresh surface defaults to the in-chat intake form
    // rather than the inspiration StartScreen. Theme pages keep their themed
    // StartScreen/ChatWelcomeScreen inspiration surface. Runs after the resets
    // above (which set startEmptyIntake=false / showStartScreen=true) so it
    // overrides them; the chatKey bump remounts ChatKitPanel, whose
    // startEmptyIntake effect then injects the empty form.
    if (!themeConfig) {
      activateEmptyIntake();
    }
  };
  // Keep the popstate handler's ref pointing at the latest handleNewChat.
  handleNewChatRef.current = handleNewChat;

  const executePromptSelect = (
    prompt: string,
    attachmentIds?: string[],
    // A prompt seeded from a theme page carries that page's structured `intake`
    // (see theme/cinematic/themeIntake.ts). It has to ride BOTH branches below:
    // the live-panel branch bypasses `initialPrompt` entirely, so passing it
    // only as a prop would silently drop the payload whenever the chat was
    // already mounted — which is exactly what happened before.
    intakePayload?: Record<string, unknown>,
  ) => {
    // chatSendMessageRef is set by both desktop and mobile ChatKitPanel onSendReady
    const sendFn = sendMessageRef.current ?? chatSendMessageRef.current;
    if (isChatActive && sendFn) {
      sendFn(
        prompt,
        undefined,
        undefined,
        intakePayload ? { formSubmitted: true, intakePayload } : undefined,
      );
    } else {
      setInitialPrompt(prompt);
      setInitialAttachmentIds(attachmentIds);
      setIsChatActive(true);
    }
  };

  // ── Consume the hero/external chat handoff ────────────────────────────────
  // The homepage chat input routes here with `?seed=...` in the URL and
  // optionally a list of File objects parked in the in-memory handoff
  // buffer (services/heroChatHandoff.js). Drains both once on first
  // route-ready render so they're not re-applied on subsequent navigations.
  useEffect(() => {
    if (hasConsumedHeroHandoffRef.current) return;
    if (!router.isReady) return;
    // Wait until the viewport has been measured before consuming the handoff.
    // On a client-side navigation from the hero, `router.isReady` is already
    // true on first render while `isMobile` is still its SSR default (false),
    // so acting now would send the seed through the desktop ChatKitPanel — which
    // is then unmounted when `isMobile` flips to true, leaving the freshly
    // mounted mobile panel blank until a refresh. Gating on `viewportMeasured`
    // guarantees the correct panel is mounted before the seed is sent.
    if (!viewportMeasured) return;
    hasConsumedHeroHandoffRef.current = true;

    const queryParam = router.query.seed;
    const querySeed = Array.isArray(queryParam) ? queryParam[0] : queryParam;
    const handoffSeed = takePendingSeed();
    const seed = (querySeed || handoffSeed || "").toString().trim();
    const files = takePendingFiles();
    // Theme-page context (saved items + slug) rides alongside the seed. Drain it
    // here so ChatKitPanel forwards it on the first /chatkit request. Set before
    // handlePromptSelect below so the props are current when the panel sends.
    const seedMeta = takePendingSeedMeta();
    if (seedMeta) {
      if (Array.isArray(seedMeta.items) && seedMeta.items.length > 0) {
        setThemeItems(seedMeta.items);
      }
      if (seedMeta.slug) setThemeSlug(seedMeta.slug);
      if (seedMeta.note) setThemeNote(seedMeta.note);
      // Present only on the seed path (a card/hero/ask-bar prompt). The "Build
      // trip" route carries none — its intake is composed by the mini-form on
      // submit instead.
      if (seedMeta.intake) setThemeIntake(seedMeta.intake);
    }

    // "Build this itinerary" from a theme page routes here with `?themeForm=<slug>`.
    // Open the themed 2-section mini-form instead of auto-sending — nothing hits
    // /chatkit until the reader submits it. Takes priority over the seed/empty
    // paths below. Gate STRICTLY on the query param: a normal prompt-card seed
    // also stashes a slug in seedMeta (so items+slug reach the request), and must
    // NOT be mistaken for a build request.
    const themeFormParam = router.query.themeForm;
    const themeFormSlug = Array.isArray(themeFormParam)
      ? themeFormParam[0]
      : themeFormParam;
    const resolvedThemeForm = themeFormSlug
      ? getThemeForm(themeFormSlug)
      : null;
    if (resolvedThemeForm) {
      setThemeForm(resolvedThemeForm);
      setStartThemedForm(true);
      setShowStartScreen(false);
      setIsChatActive(true);
      setSeedActive(true);
      // Feed the left hero panel the theme's image + copy (no destination is
      // picked in the themed flow, so IntakeLeftPanel would otherwise show the
      // default hero).
      dispatch(updateIntakeForm({ themeHero: resolvedThemeForm.hero ?? null }));
      // Drop ?themeForm from the URL so a refresh doesn't re-open the form.
      if (querySeed == null && typeof window !== "undefined") {
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete("themeForm");
          replaceUrl(url.toString());
        } catch {
          /* noop */
        }
      }
      return;
    }

    if (!seed && (!files || files.length === 0)) {
      // No hero handoff. On a bare, direct /chat open — no theme inspiration
      // surface, no restored session, no tailored landing, and no ?intake flag
      // (handled by its own effect below) — default the empty state to the
      // in-chat intake form instead of the StartScreen/ChatWelcomeScreen
      // inspiration surfaces. Those surfaces now only show on theme pages.
      if (!themeConfig && !sessionId && !fromTailored && !router.query.intake) {
        activateEmptyIntake();
      }
      return;
    }

    // Reveal the IntakeLeftPanel default hero on the left straight away (desktop)
    // so a seeded chat doesn't sit against a blank panel while the first reply is
    // still in flight. The hero swaps to the destination image once intake picks
    // a place.
    setSeedActive(true);

    if (files && files.length > 0) {
      // Pre-fill composer + upload files; let the user click send so the
      // first message includes any newly-uploaded attachment IDs.
      setShowStartScreen(false);
      setIsChatActive(true);
      setInitialInputText(seed);
      setInitialFiles(files);
    } else if (seed) {
      // Plain seed (no files): existing prompt-auto-send flow already
      // funnels through `handlePromptSelect`, which sets `initialPrompt`
      // and flips `isChatActive`. ChatKitPanel's `initialPrompt` effect
      // sends it as the first message after location is ready.
      //
      // The theme page's `intake` is handed over directly rather than read back
      // off `themeIntake` state — the setState above hasn't landed yet, and the
      // live-panel branch inside executePromptSelect sends synchronously.
      handlePromptSelect(seed, undefined, seedMeta?.intake ?? undefined);
    }

    // Drop the seed from the URL once consumed so a refresh doesn't replay it.
    if (querySeed && typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("seed");
        replaceUrl(url.toString());
      } catch {
        /* noop */
      }
    }
    // We deliberately want this to run only once. The ref guards re-runs.
    // `viewportMeasured` is a dep so the effect fires once the viewport is
    // measured, even when `router.isReady` was already true on first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, viewportMeasured]);

  // ── "Plan with Kaira" CTA landing (`?intake=1`) ───────────────────────────
  // All Plan-with-Kaira CTAs route here via openTailoredModal. Start a fresh,
  // empty in-chat intake form: reveal the chat panel, show the default hero
  // banner on the left (IntakeLeftPanel with no destination), and flag
  // ChatKitPanel to inject the empty form. The query param is dropped after
  // consumption so a refresh doesn't re-trigger it.
  const hasConsumedIntakeFlagRef = useRef(false);
  useEffect(() => {
    if (hasConsumedIntakeFlagRef.current) return;
    if (!router.isReady) return;
    const flag = router.query.intake;
    const wantsIntake = Array.isArray(flag) ? flag[0] : flag;
    if (!wantsIntake) return;
    hasConsumedIntakeFlagRef.current = true;

    // Optional `?destination=<name>` from the hero "Start planning" CTA seeds
    // the intake form's destination step so it lands pre-filled (e.g. "Greece"
    // from the theme page, or the destination page's own place).
    const destParam = router.query.destination;
    const destName = (
      Array.isArray(destParam) ? destParam[0] : destParam || ""
    ).trim();

    activateEmptyIntake(destName || undefined);

    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("intake");
        url.searchParams.delete("destination");
        replaceUrl(url.toString());
      } catch {
        /* noop */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const handlePromptSelect = (
    prompt: string,
    attachmentIds?: string[],
    intakePayload?: Record<string, unknown>,
  ) => {
    // The first prompt is allowed through without an upfront login modal so the
    // in-chat intake form can render immediately; authentication is collected
    // later via the inline OTP card when the user submits the form (or via the
    // backend `prompt_login` effect if it gates a specific action).
    executePromptSelect(prompt, attachmentIds, intakePayload);
  };

  // Open the traveller-story detail view inside ChatKitPanel without pushing a
  // message to the bot. CTAs on that detail view will call handlePromptSelect
  // which routes through the /chatkit p1 API.
  const handleTravellerStorySelect = useCallback(
    (story: TravellerStory) => {
      if (!isLoggedIn) {
        pendingPromptActionRef.current = () => {
          setActiveTravellerStory(story);
          setIsChatActive(true);
        };
        setShowPromptLoginPrompt(true);
        return;
      }
      setActiveTravellerStory(story);
      setIsChatActive(true);
    },
    [isLoggedIn],
  );

  const handleSendMessage = useCallback((message: string) => {
    if (sendMessageRef.current) sendMessageRef.current(message);
  }, []);

  const handleSendReady = useCallback((sendFn: (msg: string) => void) => {
    sendMessageRef.current = sendFn;
  }, []);

  const handleToggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  // Merge endpoint pins into locations just for the map. Endpoint pins are
  // kept separate from `locations` (which get cleared by focus_on_map/POI
  // flows) so the trip origin/departure stay visible across interactions.
  // Scoped to P1 only — once the itinerary is finalized (P2), the regular
  // itinerary visualization takes over and these would duplicate the
  // start/end pins. De-duped by lat/lng so the same coordinate never renders
  // twice — P2 could otherwise show a second start_city pin if `locations`
  // still holds a numbered route stop at the same coordinate as the itinerary
  // start. When two pins share a coordinate, the endpoint-typed one wins so
  // the start/end icon is preserved.
  const mapLocations = useMemo<Location[] | null>(() => {
    const base = locations ?? [];
    const extras = botMode === "p1" ? endpointPins : [];
    if (base.length === 0 && extras.length === 0) return locations;

    const byKey = new Map<string, Location>();
    const pinPriority = (l: Location) =>
      (l as any)?.type === "start_city" || (l as any)?.type === "end_city"
        ? 1
        : 0;
    const consider = (pin: Location) => {
      const key = `${pin.lat},${pin.lng}`;
      const existing = byKey.get(key);
      if (!existing || pinPriority(pin) > pinPriority(existing))
        byKey.set(key, pin);
    };
    base.forEach(consider);
    extras.forEach(consider);
    return Array.from(byKey.values());
  }, [locations, endpointPins, botMode]);

  // "View itinerary" widget CTA → reveal the itinerary panel (desktop swaps
  // viewMode, mobile switches the bottom tab), then scroll to Day 1 and flash
  // it so the user sees where their itinerary begins. The panel may need a tick
  // to mount after the view switch, so we retry finding Day 1 briefly. Removing
  // + re-adding the class (with a forced reflow) restarts the flash on repeat
  // clicks.
  const handleViewItinerary = React.useCallback(() => {
    if (isMobile) mobileTabSwitchRef.current?.("itinerary");
    else setViewMode("itinerary");

    let attempts = 0;
    const flashDay1 = () => {
      const el = document.getElementById("bot-itinerary-day-1");
      if (!el) {
        if (attempts++ < 25) window.setTimeout(flashDay1, 120);
        return;
      }
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.remove("ttw-day-flash");
      // Force reflow so the animation replays when Day 1 is already on screen.
      void el.offsetWidth;
      el.classList.add("ttw-day-flash");
      window.setTimeout(() => el.classList.remove("ttw-day-flash"), 3100);
    };
    window.setTimeout(flashDay1, 120);
  }, [isMobile]);

  const sharedChatKitProps = {
    onLocationReceived: handleLocationReceived,
    onNewQuery: handleNewQuery,
    onClearMap: handleClearMap,
    onRouteReceived: handleRouteReceived,
    onItineraryReceived: handleItineraryReceived,
    onTripMetaUpdate: handleTripMetaUpdate,
    onRouteEndpointsReceived: handleRouteEndpointsReceived,
    onItineraryCompletionStart: handleItineraryCompletionStart,
    onItineraryCompletionDone: handleItineraryCompletionDone,
    onItineraryRefresh: handleItineraryRefresh,
    botMode,
    sessionId: activeChatSessionId,
    onSessionChange: setActiveChatSessionId,
    itineraryId,
    onBotModeChange: applyBotMode,
    onItineraryIdChange: setItineraryId,
    onSendReady: handleSendReady,
    onLoadRouteOnMap: handleLoadRouteOnMap,
    restoredThread,
    initialAttachmentIds,
    isItineraryCompleting: isItineraryCompleting,
    itineraryCompleted:
      finalizedStatus === "SUCCESS" &&
      botMode === "p2" &&
      itineraryCreatedInSessionRef.current,
    // Route "Make Payment" CTAs from in-chat widgets to the existing
    // payment drawer instead of the generic widget-action fallback.
    onPaymentStart: openPaymentDrawer,
    travellerStory: activeTravellerStory,
    onTravellerStoryDismiss: () => setActiveTravellerStory(null),
    onLoginSuccess: attachUserToItinerary,
    loginMandatory: router.query.login === "false" ? false : undefined,
    themeItems,
    themeSlug,
    themeNote,
    themeIntake,
    themeForm,
    startThemedForm,
    onViewItinerary: handleViewItinerary,
    onIntakeFormStart: () => setIntakeActive(true),
    initialFiles,
    initialInputText,
  };

  const handleConfirmItinerary = (details: any) => {
    const message = `Yes, I confirm the itinerary! Here are my details:
Start Date: ${details.startDate}
Pax: ${details.adults} Adults, ${details.children} Children, ${details.infants} Infants
Start Location: ${details.startLocation}`;
    chatSendMessageRef.current?.(message);
    setShowConfirmModal(false);
  };

  const [isHovered, setIsHovered] = useState(false);
  const popupStyle = {
    display: isHovered ? "block" : "none",
    backgroundColor: "#2b2b2a",
    border: "1px solid #e5e7eb",
    borderRadius: "0.45rem",
    padding: "5px 10px",
    marginBottom: "5px",
  };

  const handleInitialPromptConsumed = useCallback(() => {
    setInitialPrompt(null);
    setInitialPromptRequiresLogin(false);
    setInitialAttachmentIds(undefined);
  }, []);

  const isDraft = useMemo(
    () =>
      activeItineraryId === "draft" ||
      activeItineraryId === "skeleton" ||
      (!activeItineraryId && viewMode === "itinerary"),
    [activeItineraryId, viewMode],
  );

  // Collect up to 3 unique images across all cities' day_by_day slab elements.
  // Shown in the header in Draft (p1) stage in place of the Settings icon.
  const draftCityImages = useMemo(() => {
    const imgs: { image: string }[] = [];
    const seen = new Set<string>();
    const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
    const resolve = (icon: any): string | null => {
      if (Array.isArray(icon)) icon = icon[0];
      if (!icon || typeof icon !== "string") return null;
      return icon.startsWith("http") ? icon : imgUrlEndPoint + icon;
    };
    for (const city of itineraryRedux?.cities || []) {
      for (const day of city?.day_by_day || []) {
        for (const el of day?.slab_elements || []) {
          const candidate = el?.icon || el?.restaurants?.[0]?.icon;
          const url = resolve(candidate);
          if (url && !seen.has(url)) {
            seen.add(url);
            imgs.push({ image: url });
          }
          if (imgs.length >= 3) break;
        }
        if (imgs.length >= 3) break;
      }
      if (imgs.length >= 3) break;
    }
    return imgs;
  }, [itineraryRedux?.cities]);

  const handleItineraryContainerSendMessage = useCallback((msg: string) => {
    chatSendMessageRef.current?.(msg);
    if (isMobile) mobileTabSwitchRef.current?.("chat");
  }, [isMobile]);

  const activeTab = useMemo(() => {
    if (viewMode === "bookings") return "Bookings";
    if (viewMode === "routes") return "Route";
    return "Itinerary";
  }, [viewMode]);

  // Route strip shown at the foot of the header card: each stay city with its
  // night count. start_city / end_city are deliberately excluded — they are
  // departure/return points, not stays, and carry no nights.
  const routeStops = useMemo(() => {
    const stops: { key: string; name: string; nights: number }[] = [];
    (itineraryRedux?.cities || []).forEach((c: any, i: number) => {
      const name = c?.city?.name;
      if (name) {
        stops.push({
          key: `${c?.id ?? name}-${i}`,
          name,
          nights: c?.duration ?? 0,
        });
      }
    });
    return stops;
  }, [itineraryRedux?.cities]);

  // ── View switching — there is no tab strip ───────────────────────────────
  // Map / Bookings / Route are each reached from a CTA on the surface that owns
  // them (the header card's route strip, the cart bar's booking count) and each
  // view carries its own way back to the itinerary. Mobile has to go through
  // MobileLayout's activeTab as well as viewMode, hence the mobileTabSwitchRef.

  // In Draft the route isn't editable through the Route view yet, so the edit
  // goes through chat — same as the traveller/date pencils.
  const handleChangeRoute = useCallback(() => {
    if (isDraft) {
      handleItineraryContainerSendMessage("change my route");
      return;
    }
    if (isMobile) mobileTabSwitchRef.current?.("routes");
    else setViewMode("routes");
  }, [isDraft, isMobile, handleItineraryContainerSendMessage]);

  // The stops for the flex layout the strip uses everywhere except the desktop
  // card at the top: arrow + stop as separate flex items, the row's `gap` spaces
  // them. (The floated desktop-top layout builds its own inline version below,
  // where the stops have to flow as inline text to wrap around the button.)
  const routeStopEls = routeStops.map((stop, i) => (
    <React.Fragment key={stop.key}>
      {i > 0 && <RouteArrow />}
      {/* Instrument Serif has only a 400 weight (no wght axis on the
          _document.js font link), so contrast comes from the near-black ink +
          size rather than font-weight — a faux bold would smear this italic. */}
      <span className="font-serif italic text-[17px] max-ph:text-[15px] leading-[1.25] text-[#171A1F] whitespace-nowrap">
        {stop.name}
        {stop.nights > 0 && <> ({stop.nights}N)</>}
      </span>
    </React.Fragment>
  ));
  // Editing the route hangs off the route strip because it acts on the same data
  // the strip shows. Seeing it on the map does not — that CTA sits at the head of
  // the day-by-day, above the starting city, where the journey it plots begins.
  const changeRouteButton = (
    <button
      type="button"
      aria-label="Change route"
      onClick={handleChangeRoute}
      className="shrink-0 flex items-center gap-[6px] max-ph:gap-[5px] text-[12px] max-ph:text-[11px] font-inter font-semibold text-white bg-[#122A43] hover:bg-[#1c3b5c] active:bg-[#0d1f31] transition-colors rounded-full pl-[10px] pr-[13px] max-ph:pl-[8px] max-ph:pr-[11px] py-[6px] max-ph:py-[5px] whitespace-nowrap"
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="6" cy="19" r="3" />
        <circle cx="18" cy="5" r="3" />
        <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      </svg>
      {/* "Route" is dropped on the collapsed mobile card, where the pill
          competes with the stop list for width; the expanded card has room, so
          it reads the full "Change Route" there (and desktop). */}
      Change<span className={tripMetaOpen ? "" : "max-ph:hidden"}> Route</span>
    </button>
  );

  // True once the itinerary has cities the map can actually plot — the fallback
  // route (and with it the numbered pins, the dashed polyline and the day-by-day
  // decks) is built from these, so it's what makes clearing the POI pins safe.
  const hasMappableItinerary = useMemo(
    () =>
      (itineraryRedux?.cities ?? []).some((c: any) => {
        const city = c?.city ?? c;
        return city?.latitude != null && city?.longitude != null;
      }),
    [itineraryRedux?.cities],
  );

  const handleViewMap = useCallback(() => {
    // "View route on map" promises the trip, so drop any POI pins left behind by
    // an earlier focus_on_map / display_pois_on_map — including the replay of one
    // on reload. Those pins suppress the map's Redux fallback route entirely
    // (Map.tsx builds it only when `locations` is empty), which is what leaves
    // the map showing bare category markers with no route and no city cards.
    // Guarded on an itinerary we can actually plot, so we never clear the map
    // with nothing to fall back to. Skipped entirely when a live focus_route is
    // on screen: that route already draws its pins and decks, and its cities are
    // *merged into* `locations` (handleRouteReceived), so clearing them there
    // would strip the markers off the polyline.
    const hasLiveRoute = !!currentRoute?.length;
    if (activeItineraryId && hasMappableItinerary && !hasLiveRoute) {
      setLocations([]);
    }
    if (isMobile) mobileTabSwitchRef.current?.("map");
    else setViewMode("map");
  }, [isMobile, activeItineraryId, hasMappableItinerary, currentRoute]);

  const handleViewBookings = useCallback(() => {
    if (isMobile) mobileTabSwitchRef.current?.("bookings");
    else setViewMode("bookings");
  }, [isMobile]);

  const handleBackToItinerary = useCallback(() => {
    if (isMobile) mobileTabSwitchRef.current?.("itinerary");
    else setViewMode("itinerary");
  }, [isMobile]);

  // RouteEditSection fires this the moment an Update Route save is accepted and
  // status polling begins. The route the traveller is looking at is about to be
  // replaced, and the recompute is narrated by the itinerary's own status
  // loader in the bottom bar — so send them to the surface being rebuilt rather
  // than leaving them on a stale list behind a blocking spinner.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onRouteUpdateStarted = () => handleBackToItinerary();
    window.addEventListener("route-update-started", onRouteUpdateStarted);
    return () =>
      window.removeEventListener("route-update-started", onRouteUpdateStarted);
  }, [handleBackToItinerary]);

  // How tall the stack of fixed bottom bars is, so the "Back to itinerary" pill
  // can sit just above the topmost of them and never cover an actionable
  // control. Two kinds of bars live down there: the cart bar (always) and the
  // Route view's "Update Route" bar (only while the route has unsaved edits).
  // Both are `fixed` but at different `bottom` offsets, so height alone isn't
  // enough — measure each bar's top edge as a distance up from the viewport
  // bottom and take the largest. Several copies of the cart bar exist at once
  // (desktop map vs panel; on mobile the map tab's is only opacity:0, not
  // unmounted) and some are display:none'd to a 0 rect — those are skipped.
  const [bottomStackHeight, setBottomStackHeight] = useState(0);
  useEffect(() => {
    const SELECTOR = "[data-bottom-cta-bar],[data-route-action-bar]";
    const measure = () => {
      const vh = window.innerHeight;
      let top = 0;
      document.querySelectorAll(SELECTOR).forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.height === 0) return; // hidden / display:none copy
        const fromBottom = vh - rect.top;
        if (fromBottom > top) top = fromBottom;
      });
      setBottomStackHeight(top);
    };
    measure();
    const ro = new ResizeObserver(measure);
    document.querySelectorAll(SELECTOR).forEach((el) => ro.observe(el));
    window.addEventListener("resize", measure);
    // The Update Route bar mounts/unmounts from deep inside RouteEditSection on
    // an edit — a state change BotApp can't see — so it fires this event and we
    // re-measure (and re-query, picking up the freshly-mounted bar).
    window.addEventListener("route-action-bar-change", measure);
    // Price / status resolves asynchronously and re-flows the cart bar to two
    // lines; a late re-measure catches that even when no dep below has changed.
    const t = setTimeout(measure, 400);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("route-action-bar-change", measure);
      clearTimeout(t);
    };
  }, [
    viewMode,
    isMobile,
    cart,
    pricingStatus,
    loaderDisplayText,
    activeItineraryId,
    countCartItems,
    isDraft,
  ]);

  // null for skeleton/draft so ItineraryContainer skips polling
  const itineraryContainerId = useMemo(() => {
    if (activeItineraryId === "skeleton" || activeItineraryId === "draft")
      return null;
    return activeItineraryId;
  }, [activeItineraryId]);

  // ── Tailored-form skeleton gate ──────────────────────────────────────────
  // When the user lands on /chat/{id}?source=tailored, the itinerary panel's
  // body would otherwise be blank (header + cart loader visible, body empty)
  // until polling reaches itinerary_status="SUCCESS". Render a skeleton in the
  // body during that window. ItineraryContainer stays mounted underneath so
  // its polling effects keep running.
  const showTailoredSkeleton =
    fromTailored && itineraryStatus !== "SUCCESS";

  // ── THE KEY FIX: single ItineraryContainer instance ──────────────────────
  // Rendered once here, shown in desktop OR mobile via isMobile guard in JSX.
  // This prevents every useEffect / setTimeout / API call from firing twice.
  const itineraryContainerNode = activeItineraryId ? (
    <ItineraryContainer
      key={itineraryContainerId ?? "draft"} // stable — only changes on real ID transition
      id={itineraryContainerId}
      mercuryItinerary
      fromChat={true}
      skipPolling={
        activeItineraryId === "skeleton" ? true : !itineraryPollingEnabled
      }
      refetchCounter={itineraryRefetchCounter}
      onSendMessage={handleItineraryContainerSendMessage}
      onViewMap={handleViewMap}
      activeTab={activeTab}
    />
  ) : null;

  // Compact mobile header sub-line ("dates · pax") shown under the title in the
  // collapsed trip strip (mirrors the design's .trip-row .t-sub).
  const _tripDates =
    itineraryRedux?.start_date && itineraryRedux?.end_date
      ? `${new Date(itineraryRedux.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} – ${new Date(itineraryRedux.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
      : itineraryRedux?.travel_date || "";
  // Same dates with a 2-digit year — used on mobile where the two-column meta
  // is too tight for the full "2026" and the dates would otherwise overflow.
  const _tripDatesShort =
    itineraryRedux?.start_date && itineraryRedux?.end_date
      ? `${new Date(itineraryRedux.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })} – ${new Date(itineraryRedux.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}`
      : itineraryRedux?.travel_date || "";
  const _tripPax = [
    itineraryRedux?.number_of_adults
      ? `${itineraryRedux.number_of_adults} adult${itineraryRedux.number_of_adults > 1 ? "s" : ""}`
      : "",
    itineraryRedux?.number_of_children > 0
      ? `${itineraryRedux.number_of_children} child${itineraryRedux.number_of_children > 1 ? "ren" : ""}`
      : "",
    itineraryRedux?.number_of_infants > 0
      ? `${itineraryRedux.number_of_infants} infant${itineraryRedux.number_of_infants > 1 ? "s" : ""}`
      : "",
  ]
    .filter(Boolean)
    .join(", ");
  const tripCompactSub = [_tripDates, _tripPax].filter(Boolean).join(" · ");

  // ── Shared itinerary panel content (header strip + container + CTA) ──────
  // On mobile, MobileLayout's activeTab already gates visibility (the panel
  // sits inside an absolute-positioned container that toggles opacity per
  // tab). Adding a `display:none` here based on viewMode caused a blank
  // itinerary tab on P2 refresh: activeTab landed on "itinerary" but
  // viewMode was still "map" because of timing in the chatkit restore flow.
  // Everything the cart bar needs except `barStyle` / `viewMode`, which vary by
  // where it is mounted. Hoisted because the bar now appears in three places —
  // the desktop itinerary panel, the desktop map view, and MobileLayout — and
  // they must stay in lockstep.
  const ctaBarProps = {
    activeItineraryId,
    showItineraryShimmer,
    isDraft,
    cart,
    pricingStatus,
    loaderDisplayText: statusDisplayText || loaderDisplayText,
    currency,
    countCartItems,
    isHovered,
    setIsHovered,
    popupStyle,
    onConfirm: () => {
      reportChatStage(
        "chat_itinerary_confirmed",
        activeItineraryId || "",
        "P1",
      );
      chatSendMessageRef.current?.("Yes, I confirm the Itinerary");
      if (isMobile) mobileTabSwitchRef.current?.("chat");
    },
    onViewCart: () => {
      if (!authToken) {
        setShowApiLoginPrompt(true);
        return;
      }
      reportChatStage("chat_cart_viewed", activeItineraryId || "", "P2");
      openPaymentDrawer();
    },
    onViewBookings: itineraryIsComplete ? handleViewBookings : undefined,
    notes: statusNotes,
    onGetInTouch: () => {
      if (!activeItineraryId) return;
      const token = localStorage.getItem("access_token");
      axios
        .get(
          `${MERCURY_HOST}/api/v1/itinerary/${activeItineraryId}/get_in_touch/`,
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then(() =>
          dispatch(
            openNotification({
              type: "success",
              heading: "Request received",
              text: "Our team will get in touch with you shortly!",
            }),
          ),
        )
        .catch(() =>
          dispatch(
            openNotification({
              type: "error",
              heading: "Something went wrong",
              text: "Please try again.",
            }),
          ),
        );
    },
    onRetryCart: () => {
      if (!activeItineraryId) return;
      dispatch(setCart({}));
      fetchPaymentData(activeItineraryId);
    },
  };

  // Desktop keeps the gate so viewMode can swap map ↔ itinerary.
  const itineraryPanel = (
    <div
      style={{
        display: isMobile
          ? "flex"
          : viewMode === "itinerary" ||
              viewMode === "bookings" ||
              viewMode === "routes"
            ? "flex"
            : "none",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        overflow: isMobile ? "visible" : "hidden",
      }}
    >
      {/* Header strip — full-width bar on desktop, compact rounded card on mobile
          (design's .trip strip).
          On mobile the card sticks to the top of the itinerary scroll pane. The
          sticky element is this wrapper (not the card) so its white background
          fills the card's mx/mt gutters — otherwise the timeline would show
          through them while scrolling underneath. */}
      <div className="max-ph:sticky max-ph:top-0 max-ph:z-30 max-ph:bg-white">
      {/* Arbitrary px values, not px-3/py-3: bootstrap's `.px-3`/`.py-3` are
          `1rem !important` and land after Tailwind, so they silently overrode
          every padding this card asked for (`md:px-[22px]`, `max-ph:px-[12px]`,
          `max-ph:pt-[7px]`, `max-ph:pb-[10px]`) — every width really rendered at
          bootstrap's 16px. Desktop is pinned to that same 16px (changing it
          isn't what was asked); mobile gets an even 10px box, matching the cart
          bar's gutter. One element serves both the expanded and collapsed card
          — `tripMetaOpen` only hides inner content — so this covers both. */}
      <div
        // Mobile: tapping anywhere on the card (not just the chevron) toggles
        // the collapsible trip meta. Interactive children — the settings/share/
        // change buttons, the legend chips, the chevron itself — are all
        // `<button>`s, so a tap that lands inside one is left to that control
        // and doesn't also toggle the card (closest() guard). Desktop no-ops:
        // it has no compact/expanded split, so `isMobile`/`tripCompactSub` bail.
        onClick={(e) => {
          if (!isMobile || !tripCompactSub) return;
          if (
            (e.target as HTMLElement).closest(
              "button, a, input, label, select, textarea",
            )
          )
            return;
          handleTripMetaToggle();
        }}
        className="bg-white flex flex-col p-[16px] border-b border-slate-100 max-ph:border max-ph:border-[#ECECEC] max-ph:rounded-[14px] max-ph:mx-3 max-ph:mt-[10px] max-ph:p-[10px]"
      >
        {/* Route and Bookings render inside this same panel (MenuV2 swaps its
            body on activeTab). The way out of them — like the Map view's — is a
            single centered pill pinned just above the cart bar (BackToItineraryBar
            below), so it's not duplicated in this header. */}
        {/* `relative` (all breakpoints) so the settings/share/chevron cluster
            can be absolutely pinned to the top-right instead of sitting in a
            flow column. As a column it reserved its width down the whole card
            height, which is what left the heading, meta and route strip unable
            to use the right side of the card. Out of flow, the content column
            below spans the full width and the icons just float over its top
            right corner. */}
        <div className="flex justify-between items-start gap-3 max-ph:gap-2 relative">
          <div className="flex flex-col flex-1 min-w-0">
            {/* Compact title + sub are max-width-capped on mobile so they
                truncate before the absolutely-positioned icons. (Padding can't
                reserve truncation space — text overflows into it — so a
                max-width is used.) The expanded detail below is full width. */}
            {/* Compact title + sub. On mobile they collapse away when the card
                is expanded (the expanded detail below carries the full name);
                the grid-rows 1fr↔0fr trick animates that as a smooth height +
                opacity fade instead of the old `max-ph:hidden` snap. Desktop
                stays open (base 1fr — only `max-ph:` collapses), since the 24px
                title here is the header itself. */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${tripMetaOpen ? "grid-rows-[1fr] opacity-100 max-ph:grid-rows-[0fr] max-ph:opacity-0" : "grid-rows-[1fr] opacity-100"}`}
            >
              <div className="overflow-hidden min-h-0">
                {/* md:pr reserves the top-right corner for the now-absolute
                    settings/share icons, so a long name wraps to more lines on
                    the left while the icons stay pinned top-right (they no
                    longer hold open a column). Mobile clears its chevron with
                    the max-width + truncate instead. */}
                <p className="font-inter font-bold md:font-extrabold text-[13.5px] md:text-[24px] leading-[1.2] md:leading-[1.15] tracking-[-0.2px] md:tracking-[-0.5px] m-0 md:pr-[100px] max-ph:truncate max-ph:max-w-[85%]">
                  {itineraryReduxName || currentItineraryRef?.current?.name || ""}
                </p>
                {/* Mobile-only compact sub: dates · pax (design .trip-row .t-sub) */}
                {tripCompactSub && (
                  <div className="md:hidden text-[11.5px] text-[#6B7280] mt-[1px] truncate max-ph:max-w-[85%]">
                    {tripCompactSub}
                  </div>
                )}
              </div>
            </div>

        {(itineraryRedux?.group_type ||
          itineraryRedux?.number_of_adults ||
          itineraryRedux?.travel_date ||
          (itineraryRedux?.start_date && itineraryRedux?.end_date)) && (
          // max-ph:mt-0 when expanded: the compact title this margin was
          // separating us from is itself hidden in expanded mode, so the margin
          // would just stack on the card's 10px top padding and make the top gap
          // read as double the bottom one.
          <div
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${tripMetaOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[1fr] opacity-100 max-ph:grid-rows-[0fr] max-ph:opacity-0"}`}
          >
            <div className="overflow-hidden min-h-0">
          <div className="flex flex-col gap-1.5 mt-[11px] max-ph:mt-0">
            {/* Mobile expanded: full (untruncated) itinerary name — design's
                .trip-detail .ttl. Hidden on desktop (already shown at 24px). */}
            <p className="md:hidden font-inter font-extrabold text-[18px] leading-[1.2] tracking-[-0.4px] m-0 mb-[3px] text-[#171A1F] max-ph:max-w-[85%]">
              {itineraryReduxName || currentItineraryRef?.current?.name || ""}
            </p>
            {/* Outer row — column on mobile (so the gallery slides below the
                meta), single row on desktop (gallery sits to the right of
                traveller/date, matching the original design). */}
            <div className="flex items-start gap-2 md:gap-[22px] max-ph:gap-[13px] max-ph:flex-col max-ph:items-stretch md:items-center">
              <div ref={metaGroupRef} className="flex items-center gap-[22px] flex-nowrap md:flex-wrap max-ph:items-start max-ph:gap-[12px]">
                {(itineraryRedux?.group_type ||
                  itineraryRedux?.number_of_adults) && (
                  <div ref={travellersColRef} className="flex items-center gap-2 max-ph:flex-col max-ph:items-start max-ph:gap-[3px]">
                    {/* No "Travellers" label — the value ("Couple · 2 adults")
                        reads for itself on both mobile and desktop. */}
                    <span className="text-[13px] max-ph:text-[12px] font-inter text-[#3b4149] whitespace-nowrap">
                      {itineraryRedux.group_type
                        ? `${itineraryRedux.group_type}${
                            itineraryRedux.number_of_adults
                              ? ` · ${itineraryRedux.number_of_adults} adult${itineraryRedux.number_of_adults > 1 ? "s" : ""}`
                              : ""
                          }`
                        : itineraryRedux.number_of_adults
                          ? `${itineraryRedux.number_of_adults} adult${itineraryRedux.number_of_adults > 1 ? "s" : ""}`
                          : ""}
                      {itineraryRedux.number_of_children > 0
                        ? `, ${itineraryRedux.number_of_children} child${itineraryRedux.number_of_children > 1 ? "ren" : ""}`
                        : ""}
                      {itineraryRedux.number_of_infants > 0
                        ? `, ${itineraryRedux.number_of_infants} infant${itineraryRedux.number_of_infants > 1 ? "s" : ""}`
                        : ""}
                    </span>
                    {isDraft && (
                      <button
                        type="button"
                        aria-label="Change traveller count"
                        className="flex items-center justify-center hover:opacity-70"
                        onClick={() =>
                          handleItineraryContainerSendMessage(
                            "change traveller count",
                          )
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                            fill="#ACACAC"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
                {(itineraryRedux?.travel_date ||
                  (itineraryRedux?.start_date &&
                    itineraryRedux?.end_date)) && (
                  <div className="flex items-center gap-2 shrink-0 max-ph:flex-col max-ph:items-start max-ph:gap-[3px]">
                    {/* No "Dates" label — the date range value stands on its
                        own on both mobile and desktop. */}
                    <span className="text-[13px] max-ph:text-[12px] font-inter text-[#3b4149] whitespace-nowrap">
                      {itineraryRedux.start_date && itineraryRedux.end_date ? (
                        <>
                          {/* Mobile: full year when it fits, else the measured
                              2-digit fallback. Desktop always full. */}
                          <span className="md:hidden">
                            {datesShort ? _tripDatesShort : _tripDates}
                          </span>
                          <span className="max-ph:hidden">{_tripDates}</span>
                          {/* Hidden full-year probe used to measure overflow. */}
                          <span
                            ref={datesMeasureRef}
                            aria-hidden
                            className="md:hidden absolute invisible pointer-events-none whitespace-nowrap"
                          >
                            {_tripDates}
                          </span>
                        </>
                      ) : (
                        itineraryRedux.travel_date
                      )}
                    </span>
                    {isDraft && (
                      <button
                        type="button"
                        aria-label="Change travelling date"
                        className="flex items-center justify-center hover:opacity-70"
                        onClick={() =>
                          handleItineraryContainerSendMessage(
                            "change my travelling date",
                          )
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                            fill="#ACACAC"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
              {!isMobile && itineraryRedux?.images?.length > 0 && (
                <SmallGallery
                  compact
                  maxShow={Math.min(3, galleryImages.images.length)}
                  images={galleryImages.images}
                  closeLabel="Back to Itinerary"
                />
              )}
            </div>

            {/* Desktop: social proof gets its own row between the meta line and
                the route strip. On mobile it shares a row with the icons below.
                Collapsed once the pane is scrolled off the top (headerCondensed)
                so the condensed card keeps only name, travellers/dates and
                route. Animated via the same grid-rows height + fade the legend
                below uses (matching duration-200 ease-out) so the two collapse
                in sync and the card's height eases instead of snapping. */}
            {socialProofCount !== null && (
              <div
                className={`max-ph:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${headerCondensed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}
              >
                <div className="overflow-hidden min-h-0">
                  <div className="flex items-center gap-[9px] mt-[2px]">
                    <KairaSocialProof
                      count={socialProofCount}
                      groupType={itineraryRedux?.group_type}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mobile: Kaira social proof (left) + settings/share (right) on one
                row at the bottom of the expanded detail. Hidden on desktop,
                where the icons sit top-right. The trip-image gallery is
                deliberately not shown here — the social proof earns the space
                better on a narrow card. */}
            <div className="md:hidden flex items-start gap-[9px] mt-[9px]">
              {socialProofCount !== null && (
                <KairaSocialProof
                  count={socialProofCount}
                  groupType={itineraryRedux?.group_type}
                  wrap
                />
              )}
              <div className="flex items-center gap-[8px] ml-auto">
                {!isDraft && (
                  <button
                    aria-label="Settings"
                    className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-gray-100 hover:bg-gray-200"
                    onClick={() => {
                      if (!authToken) {
                        setShowSettingsLoginPrompt(true);
                        return;
                      }
                      axios
                        .get(
                          `${MERCURY_HOST}/api/v1/itinerary/${activeItineraryId}/bookings/hotels/?fields=no_of_hotels`,
                        )
                        .then((res) =>
                          setIsHotelsPresent(res.data.no_of_hotels > 0),
                        )
                        .catch(() => setIsHotelsPresent(false))
                        .finally(() => setShowSettings(true));
                    }}
                  >
                    <Image src="/settings.svg" height={18} width={18} alt="Settings" />
                  </button>
                )}
                <button
                  aria-label="Share"
                  className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-gray-100 hover:bg-gray-200"
                  onClick={() => setShowShare(true)}
                >
                  <Image src="/share.svg" height={18} width={18} alt="Share" />
                </button>
              </div>
            </div>
          </div>
            </div>
          </div>
        )}

        {/* Route strip — sits outside the collapsible meta block so it stays
            visible in the collapsed mobile card. Typography (Instrument Serif
            italic + hairline arrow) mirrors the route line on the itinerary
            carousel cards — see PackageCard.jsx.
            Two layouts:
            • Desktop card at the top (`!isMobile && !headerCondensed`) — the
              stops and the Change Route button share one wrapping flow, so the
              route uses the full width and the button trails the last stop,
              sitting right where the route text ends (not pinned to the far
              right). A short route keeps it on line one just after the final
              stop; a long route lets it follow the last stop onto a later line.
            • Everywhere else — the condensed desktop strip and the mobile card —
              the stops sit in their own row that scrolls sideways when it can't
              wrap, with the button pinned beside it (mobile keeps its
              collapsed-scroll / expanded-wrap behaviour unchanged). */}
        {routeStops.length > 0 &&
          (!isMobile && !headerCondensed ? (
            // Desktop card at the top: two columns. The stops wrap in the left
            // column; the Change Route button gets its own column and stays on
            // the first line (items-start pins it to the top), so it never drops
            // to a second line. The stops column is content-sized (no flex-1),
            // so on a short route the button trails right after the text, and it
            // shrinks to wrap (min-w-0 + flex-wrap) on a long route while the
            // button holds its first-line spot.
            <div className="mt-[11px] flex items-start gap-[14px]">
              <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[8px] min-w-0">
                {routeStopEls}
              </div>
              {changeRouteButton}
            </div>
          ) : (
            <div
              className={`flex items-center gap-[14px] max-ph:gap-[10px] mt-[11px] max-ph:mt-[9px] ${tripMetaOpen ? "max-ph:items-start" : ""}`}
            >
              {/* Collapsed mobile / condensed desktop: single line that scrolls
                  sideways. Expanded mobile: the stops wrap to as many lines as
                  the full route needs (`max-ph:flex-wrap`). */}
              <div
                className={`flex items-center gap-[10px] max-ph:gap-[8px] min-w-0 overflow-x-auto ${tripMetaOpen ? "max-ph:flex-wrap" : ""}`}
                style={{ scrollbarWidth: "none" }}
              >
                {routeStopEls}
              </div>
              {changeRouteButton}
            </div>
          ))}

        {/* Kaira Protected / label legend. Hidden once the pane is scrolled off
            the top (headerCondensed) so only the trip's identifying lines stay
            pinned — on mobile and desktop alike. Collapsed via an animated
            grid-rows height (the same trick the meta block above uses) instead
            of an instant unmount: the card is `sticky top-0` on mobile, so
            snapping a row out mid-scroll would jump the content below it.
            overflow-hidden is applied only while collapsed, so the expanded
            legend's "what the labels mean" dropdown (absolute, opens downward)
            is never clipped. */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${headerCondensed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}
        >
          <div className={headerCondensed ? "overflow-hidden min-h-0" : "min-h-0"}>
            <ItineraryLegend />
          </div>
        </div>
          </div>

          <div className="flex gap-3 max-ph:gap-[6px] items-center absolute top-0 right-0">
            {!isDraft && (
              <button
                className="max-ph:hidden flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
                onClick={() => {
                  if (!authToken) {
                    setShowSettingsLoginPrompt(true);
                    return;
                  }
                  axios
                    .get(
                      `${MERCURY_HOST}/api/v1/itinerary/${activeItineraryId}/bookings/hotels/?fields=no_of_hotels`,
                    )
                    .then((res) =>
                      setIsHotelsPresent(res.data.no_of_hotels > 0),
                    )
                    .catch(() => setIsHotelsPresent(false))
                    .finally(() => setShowSettings(true));
                }}
              >
                <Image
                  src="/settings.svg"
                  height={22}
                  width={22}
                  alt="Settings"
                />
              </button>
            )}
            {isDraft && draftCityImages.length > 0 && !isMobile && (
              <SmallGallery
                maxShow={Math.min(3, draftCityImages.length)}
                images={draftCityImages}
                isDraft={true}
              />
            )}
            <button
              className="max-ph:hidden flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
              onClick={() => setShowShare(true)}
            >
              <Image src="/share.svg" height={22} width={22} alt="Share" />
            </button>
            {/* Mobile: toggle the collapsed trip meta (design .trip chevron) */}
            {tripCompactSub && (
              <button
                type="button"
                aria-label="Toggle trip details"
                aria-expanded={tripMetaOpen}
                onClick={handleTripMetaToggle}
                className="md:hidden flex items-center justify-center w-9 h-9 max-ph:w-[28px] max-ph:h-[28px] shrink-0"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`transition-transform max-ph:w-4 max-ph:h-4 ${tripMetaOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="m6 9 6 6 6-6"
                    stroke="#8a9099"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeItineraryId ? (
          <div className="flex flex-col h-full overflow-hidden">
            <div
              ref={desktopItineraryScrollRef}
              className="flex-1 overflow-y-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {showTailoredSkeleton && (
                <ItineraryShimmer cities={skeletonCities} />
              )}
              <div
                style={
                  showTailoredSkeleton ? { display: "none" } : undefined
                }
              >
                {itineraryContainerNode}
              </div>
            </div>
            {/* Desktop only. On mobile these fixed bars are rendered by
                MobileLayout as siblings of its scroll pane — nesting a
                position:fixed bar inside that pane (which carries
                -webkit-overflow-scrolling:touch) makes iOS position it against
                the *scrolled content* rather than the viewport, so the bar
                scrolls off-screen and the cart bar disappears on phones. */}
            {!isMobile && (
              <>
                <BottomCTABar
                  {...ctaBarProps}
                  barStyle={ctaBarStyle}
                  viewMode={viewMode}
                />
                {/* Only Route / Bookings have somewhere to go back to — the
                    plain itinerary view is the destination itself. */}
                {(viewMode === "routes" || viewMode === "bookings") && (
                  <BackToItineraryBar
                    onClick={handleBackToItinerary}
                    bottom={bottomStackHeight + 12}
                    barStyle={ctaBarStyle}
                  />
                )}
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );

  // v1 itineraries — render only the itinerary component, no chatbot/sidebar/toggle
  if (isV1) {
    return <ItineraryContainer id={activeItineraryId} />;
  }

  return (
    <main
      className="flex flex-col h-dvh md:h-screen overflow-hidden bg-slate-100 dark:bg-slate-950"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Desktop layout ── */}
      <div className="max-ph:hidden md:flex flex-1 overflow-hidden min-h-0">
        <Sidebar
          onNewChat={handleNewChat}
          onToggle={handleToggleSidebar}
          isCollapsed={sidebarCollapsed}
          onThreadSelect={handleThreadSelect}
          activeThreadId={activeThreadId}
          isComplete={
            activeItineraryId !== "skeleton" &&
            activeItineraryId !== "draft" &&
            !!activeItineraryId
          }
          onLoginSuccess={attachUserToItinerary}
        />

        {/* LEFT PANEL */}
        <div
          ref={leftPanelRef}
          className="flex flex-col overflow-hidden transition-all duration-500 ease-in-out relative bg-white"
          style={{ width: "50%", minWidth: 0 }}
        >
          <div
            className={`absolute inset-0 z-10 overflow-y-auto transition-opacity duration-500 ease-in-out pointer-events-${
 (showStartScreen ||
   (intakeActive && !intakeDestination && !startEmptyIntake)) &&
 leftPanelMode === "default"
 ? "auto"
 : "none"
 }`}
            style={{
              opacity:
                (showStartScreen ||
                  (intakeActive && !intakeDestination && !startEmptyIntake)) &&
                leftPanelMode === "default"
                  ? 1
                  : 0,
            }}
          >
            <StartScreen
              onPromptSelect={handlePromptSelect}
              onTravellerStorySelect={handleTravellerStorySelect}
              themeConfig={themeConfig}
            />
          </div>

          {/* INTAKE HERO — shown over StartScreen/map only once a destination
              is chosen; its image swaps with the chosen destination. Before a
              pick we keep the StartScreen above. inset-0 keeps the hero within
              the left pane. */}
         {botMode != "p2" ? <div
            className={`absolute inset-0 z-20 transition-opacity duration-500 ease-in-out ${
 !hasBotResponded &&
 (seedActive || (intakeActive && (intakeDestination || startEmptyIntake)))
 ? "pointer-events-auto"
 : "pointer-events-none"
 }`}
            style={{
              opacity:
                !hasBotResponded &&
                (seedActive ||
                  (intakeActive && (intakeDestination || startEmptyIntake)))
                  ? 1
                  : 0,
            }}
          >
            {!hasBotResponded &&
              (seedActive ||
                (intakeActive && (intakeDestination || startEmptyIntake))) &&
              botMode != "p2" && <IntakeLeftPanel />}
          </div> : null}

          <style dangerouslySetInnerHTML={{ __html: `#chatContainer::-webkit-scrollbar { display: none; }` }} />
          <div
            id="chatContainer"
            className="flex flex-col h-full bg-white border-slate-200 transition-opacity duration-500 ease-in-out"
            style={{
              opacity: hasBotResponded && leftPanelMode === "default" ? 1 : 0,
              pointerEvents: leftPanelMode === "default" ? "auto" : "none",
              overflowY: "scroll",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* MAP view — reached from the header card's Map pill. The back pill
                (pinned above the cart bar below) is the only way out, so it only
                appears once there is an itinerary to go back to (before that, the
                map is the default view and nothing sits behind it). */}
            <div
              className="relative"
              style={{
                display: viewMode === "map" ? "flex" : "none",
                flex: 1,
                minHeight: 0,
              }}
            >
              {/* Only the layout in use mounts a map. Both layout trees are
                  rendered (the other is merely CSS-hidden), and a MapView builds
                  its own google.maps.Map and claims `mapRef` — so mounting both
                  on a phone left two maps fighting over the ref, with the hidden
                  0x0 one able to win it. */}
              {!isMobile && (
                <MapView
                  mapState={mapState}
                  locations={mapLocations}
                  userLocation={userLocation}
                  currentRoute={currentRoute}
                  isLoadingLocation={isLoadingLocation}
                  mapRef={mapRef}
                  isRoutePreparing={isRoutePreparing}
                  isVisible={viewMode === "map"}
                  chromeBottom={bottomStackHeight}
                />
              )}
              {/* The cart bar lives inside itineraryPanel, which is display:none
                  on the map — so the map lost it. Mobile already carries its own
                  copy on the map tab; this is the desktop equivalent. Pinned to
                  "itinerary" for the same reason mobile's is: the bar's own
                  viewMode gates its CTAs, and "map" is not one of them. */}
              {!isMobile && !!activeItineraryId && (
                <BottomCTABar
                  {...ctaBarProps}
                  barStyle={ctaBarStyle}
                  viewMode="itinerary"
                />
              )}
              {!isMobile && !!activeItineraryId && (
                <BackToItineraryBar
                  onClick={handleBackToItinerary}
                  bottom={bottomStackHeight + 12}
                  barStyle={ctaBarStyle}
                />
              )}
            </div>

            {/* ITINERARY / BOOKINGS / ROUTES — desktop only renders when !isMobile */}
            {!isMobile && itineraryPanel}
          </div>
        </div>

        {/* RIGHT PANEL — always ChatKitPanel */}
        <div
          className="flex flex-col overflow-hidden min-h-0 h-full relative bg-white"
          style={{ width: "50%", minWidth: 0 }}
        >
          <div
            className={`absolute inset-0 z-10 bg-white ease-in-out ${
 isChatActive
 ? "opacity-0 pointer-events-none translate-y-2"
 : "opacity-100 pointer-events-auto translate-y-0"
 }`}
          >
            <ChatWelcomeScreen
              onSubmit={handlePromptSelect}
              onChatStart={() => setIsChatActive(true)}
              themeConfig={themeConfig}
            />
          </div>
          <div
            className={`flex-1 overflow-hidden min-h-0 ease-in-out ${
 isChatActive
 ? "opacity-100 translate-y-0"
 : "opacity-0 translate-y-2 pointer-events-none"
 }`}
          >
            {!isMobile && (
              <ChatKitPanel
                key={chatKey}
                {...sharedChatKitProps}
                initialPrompt={initialPrompt}
                initialPromptRequiresLogin={initialPromptRequiresLogin}
                onInitialPromptConsumed={handleInitialPromptConsumed}
                onSendReady={handleSendMessageReady}
                startEmptyIntake={startEmptyIntake}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile layout — full-screen views + top tab bar ── */}
      <div className="flex md:hidden flex-col flex-1 overflow-hidden min-h-0">
        <MobileLayout
          showStartScreen={showStartScreen}
          hasBotResponded={hasBotResponded}
          isChatActive={isChatActive}
          hasItineraryActivity={!!activeItineraryId}
          isComplete={itineraryIsComplete}
          showChatBot={showChatBot}
          chatBotItineraryId={chatBotItineraryId}
          chatBotInjectedMessage={chatBotInjectedMessageRef.current}
          viewMode={viewMode}
          setViewMode={setViewMode}
          mobilePanel={mobilePanel}
          setMobilePanel={setMobilePanel}
          onNewChat={handleNewChat}
          onThreadSelect={handleThreadSelect}
          activeThreadId={activeThreadId}
          onRegisterTabSwitch={handleRegisterMobileTabSwitch}
          onItineraryScrolled={handleItineraryScrolled}
          mapContent={
            // Mounted only on mobile — see the desktop MapView above.
            isMobile ? (
              <MapView
                mapState={mapState}
                locations={mapLocations}
                userLocation={userLocation}
                currentRoute={currentRoute}
                isLoadingLocation={isLoadingLocation}
                mapRef={mapRef}
                isRoutePreparing={isRoutePreparing}
                // Mobile visibility follows the tab, not viewMode: handleTabClick
                // sets viewMode to "map" for the chat tab as well, so viewMode
                // alone can't tell whether the map pane is on screen.
                isVisible={mobilePanel === "map"}
                chromeBottom={bottomStackHeight}
              />
            ) : null
          }
          chatContent={
            // Always use ChatKitPanel — render both welcome + ChatKitPanel; CSS hides/shows
            <div className="relative h-full w-full">
              <div
                className="absolute inset-0 transition-opacity duration-200"
                style={{
                  opacity: isChatActive ? 0 : 1,
                  pointerEvents: isChatActive ? "none" : "auto",
                  zIndex: isChatActive ? 0 : 1,
                }}
              >
                <ChatWelcomeScreen
                  onSubmit={handlePromptSelect}
                  onChatStart={() => setIsChatActive(true)}
                  themeConfig={themeConfig}
                  mobileMenu={
                    <MobileHeaderMenu
                      onNewChat={handleNewChat}
                      onThreadSelect={handleThreadSelect}
                      activeThreadId={activeThreadId}
                      isComplete={hasItinerary}
                      onLoginSuccess={attachUserToItinerary}
                      onClose={handleCloseChat}
                    />
                  }
                />
              </div>
              <div
                className="absolute inset-0 transition-opacity duration-200"
                style={{
                  opacity: isChatActive ? 1 : 0,
                  pointerEvents: isChatActive ? "auto" : "none",
                  zIndex: isChatActive ? 1 : 0,
                }}
              >
                {isMobile && (
                  <ChatKitPanel
                    key={`${chatKey}`}
                    {...sharedChatKitProps}
                    initialPrompt={initialPrompt}
                    initialPromptRequiresLogin={initialPromptRequiresLogin}
                    onInitialPromptConsumed={handleInitialPromptConsumed}
                    onSendReady={handleSendMessageReady}
                    startEmptyIntake={startEmptyIntake}
                    isPanelVisible={mobilePanel === "chat"}
                    mobileMenu={
                      <MobileHeaderMenu
                        onNewChat={handleNewChat}
                        onThreadSelect={handleThreadSelect}
                        activeThreadId={activeThreadId}
                        isComplete={hasItinerary}
                        onLoginSuccess={attachUserToItinerary}
                        onClose={handleCloseChat}
                      />
                    }
                  />
                )}
              </div>
            </div>
          }
          itineraryContent={isMobile ? itineraryPanel : null}
          mobileEffectPopup={mobileEffectPopup}
          onDismissMobileEffectPopup={() => setMobileEffectPopup(null)}
          bottomCTABarProps={{ ...ctaBarProps, viewMode }}
          onSettingsClick={() => {
            if (!authToken) {
              setShowSettingsLoginPrompt(true);
              return;
            }
            if (!activeItineraryId) return;
            axios
              .get(
                `${MERCURY_HOST}/api/v1/itinerary/${activeItineraryId}/bookings/hotels/?fields=no_of_hotels`,
              )
              .then((res) => setIsHotelsPresent(res.data.no_of_hotels > 0))
              .catch(() => setIsHotelsPresent(false))
              .finally(() => setShowSettings(true));
          }}
          onLoginSuccess={attachUserToItinerary}
        />
      </div>

      <ConfirmationModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        itineraryName="Your Itinerary"
        onConfirm={handleConfirmItinerary}
        isLoading={showItineraryShimmer}
        onMobileChatSwitch={() => mobileTabSwitchRef.current?.("chat")}
      />

      {showShare && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[1999] backdrop-blur-[1px]"
            onClick={() => setShowShare(false)}
          />
          <SocialShareDesktop
            social_title={itineraryRedux?.social_title}
            social_description={itineraryRedux?.social_description}
            itineraryName={itineraryReduxName}
            itineraryImage={itineraryRedux?.images?.[0]}
            share={showShare}
            setShare={setShowShare}
          />
        </>
      )}

      {showSettings && (() => {
        const settingsHandleApply = async (req: any) => {
          const response = await axios.post(
            `${MERCURY_HOST}/api/v1/itinerary/${activeItineraryId}/itinerary-edit/`,
            req,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            },
          );
          // Re-poll status + canonical fetch instead of trusting the edit response,
          // which lacks day-by-day, hotels, transfers, pricing and would clobber
          // status:"Finalized" (hiding Routes/Bookings tabs).
          if (activeItineraryId) handleItineraryRefresh(activeItineraryId);
          return response;
        };
        return isMobile ? (
          <BottomModal
            show={true}
            onHide={() => setShowSettings(false)}
            closeIcon={false}
            width="100%"
            height="max-content"
            paddingX="0px"
            paddingY="0px"
            borderRadius="20px"
          >
            <Settings
              setShowSettings={setShowSettings}
              isHotelsPresent={isHotelsPresent}
              handleApply={settingsHandleApply}
              maxAdults={true}
              maxRooms={true}
            />
          </BottomModal>
        ) : (
          <ModalWithBackdrop show={true} onHide={() => setShowSettings(false)} closeIcon={false}>
            <Settings
              setShowSettings={setShowSettings}
              isHotelsPresent={isHotelsPresent}
              handleApply={settingsHandleApply}
              maxAdults={true}
              maxRooms={true}
            />
          </ModalWithBackdrop>
        );
      })()}

      

      {showSettingsLoginPrompt && !authToken && (
        
        <BotLoginModal
          show={showSettingsLoginPrompt}
          onhide={() => setShowSettingsLoginPrompt(false)}
          zIndex={3300}
          message="Please login to continue"
          onSuccess={async () => {
            setShowSettingsLoginPrompt(false);
            await attachUserToItinerary();
          }}
        />
      )}


      {showApiLoginPrompt && (
        <BotLoginModal
          show={showApiLoginPrompt}
          onhide={() => setShowApiLoginPrompt(false)}
          zIndex={3300}
          message="Please login to continue"
          onSuccess={async () => {
            setShowApiLoginPrompt(false);
          }}
        />
      )}

      {showPromptLoginPrompt && !isLoggedIn && (
        <BotLoginModal
          show={showPromptLoginPrompt}
          onhide={() => setShowPromptLoginPrompt(false)}
          zIndex={3300}
          message="Please login to continue"
          onSuccess={async () => {
            setShowPromptLoginPrompt(false);
            const action = pendingPromptActionRef.current;
            pendingPromptActionRef.current = null;
            action?.();
          }}
        />
      )}

      {/* Toaster notifications — portal to modal-portal div */}
      <NotificationPopup />

      {/* ── Payment — mounts NewSummaryContainers which portals its own full-screen Drawer ── */}

      {showPaymentDrawer && activeItineraryId && itineraryRedux && (
        <div
          key={paymentDrawerKey}
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            overflow: "hidden",
          }}
        >
          <NewSummaryContainers
            payment={paymentData}
            plan={itineraryRedux}
            id={activeItineraryId}
            itinerary={itineraryRedux}
            mercuryItinerary={true}
            loadpricing={false}
            setLoadPricing={() => {}}
            getPaymentHandler={() =>
              activeItineraryId && fetchPaymentData(activeItineraryId)
            }
            setShowLoginModal={() => {}}
            setShowFooterBannerMobile={() => {}}
            // Reprice path inside NewBookingSlide calls resetRef + fetchData to
            // restart polling. Without these wired, polling stays stopped and
            // the cart shows stale statuses. Bumping the refetchCounter routes
            // through ItineraryContainer's reset-and-restart effect.
            resetRef={() => setItineraryRefetchCounter((c) => c + 1)}
            fetchData={() => setItineraryRefetchCounter((c) => c + 1)}
            itineraryName={itineraryReduxName}
            itineraryImage={itineraryRedux?.images?.[0]}
            social_title={itineraryRedux?.social_title}
            social_description={itineraryRedux?.social_description}
            openPaymentDrawer={true}
          />
        </div>
      )}
    </main>
  );
}

// ── BottomCTABar — memoized, outside BotApp ──────────────────────────────────
interface BottomCTABarProps {
  viewMode: ViewMode;
  activeItineraryId: string | null;
  showItineraryShimmer: boolean;
  isDraft: boolean;
  cart: any;
  pricingStatus: string;
  loaderDisplayText: string | null;
  currency: any;
  countCartItems: number;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
  popupStyle: React.CSSProperties;
  onConfirm: () => void;
  onViewCart: () => void;
  onGetInTouch?: () => void;
  onRetryCart?: () => void;
  // The Bookings view's only entry point. Left undefined until the itinerary is
  // complete — that is the same gate the Bookings tab used to carry — and the
  // chip is then hidden entirely, so an incomplete itinerary shows no dead CTA.
  onViewBookings?: () => void;
  notes?: any[];
  // Desktop only: the measured left/width of the itinerary panel, so the fixed
  // bar spans it exactly and its right edge meets the chat divider. A
  // percentage can't express this — the panel is 50% of what's left after the
  // (collapsible) sidebar. Undefined on mobile, where `w-full` is correct.
  barStyle?: React.CSSProperties;
}

/**
 * ItineraryStepsLoader
 * Stepped progress card shown in the bottom CTA bar space (where the cart
 * details normally sit) while the itinerary is being updated and pricing is
 * still pending. Accumulates step lines from the rolling `displayText`,
 * marks every prior step as done (green check) and the latest as active
 * (spinner). Full text wraps — never truncated.
 *
 * State resets automatically per update cycle: BottomCTABar unmounts this
 * (and renders the cart row) once pricing returns SUCCESS, so it remounts
 * fresh on the next update.
 */
const ItineraryStepsLoader = ({
  displayText,
  barStyle,
}: {
  displayText: string | null;
  barStyle?: React.CSSProperties;
}) => {
  const [steps, setSteps] = React.useState<string[]>([]);
  const seenRef = React.useRef<Set<string>>(new Set());

  // Fold the rolling display_text value in as its own step line.
  React.useEffect(() => {
    const txt = typeof displayText === "string" ? displayText.trim() : "";
    if (!txt || seenRef.current.has(txt)) return;
    seenRef.current.add(txt);
    setSteps((prev) => [...prev, txt]);
  }, [displayText]);

  if (steps.length === 0) return null;

  const lastIdx = steps.length - 1;

  return (
    <div data-bottom-cta-bar style={barStyle} className="z-20 fixed w-full md:w-[48%] bottom-0 flex-shrink-0 bg-[#fffaf5] border-t border-slate-100 shadow-[0_-4px_16px_rgba(11,18,32,0.06)] px-4 pt-3.5 pb-4">
      <div>
        <div className="flex items-center gap-3">
          {/* Spinning ring with hourglass glyph — same chrome as the original loader */}
          <div className="relative flex-shrink-0 w-10 h-10">
            <span className="absolute inset-0 rounded-full border-[3px] border-[#07213A]/20" />
            <span className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#07213A] animate-spin" />
            <span className="absolute inset-[7px] rounded-full bg-white flex items-center justify-center animate-spin">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path
                  d="M7 3h10M7 21h10M8 3v3.2a4 4 0 001.5 3.1L12 11l2.5-1.7A4 4 0 0016 6.2V3M8 21v-3.2a4 4 0 011.5-3.1L12 13l2.5 1.7a4 4 0 011.5 3.1V21"
                  stroke="#07213A"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold text-[#07213A] leading-snug">
              Updating your itinerary
            </div>
            <div className="text-xs text-[#07213A]/60 mt-0.5">
              This might take a few seconds…
            </div>
          </div>
        </div>

        {/* Step lines — each completed step gets a check, the latest stays active */}
        <ul
          className="mt-3 flex flex-col gap-1.5 max-h-[32vh] overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {steps.map((step, i) => {
            const active = i === lastIdx;
            return (
              <li key={`${i}-${step}`} className="flex items-start gap-2.5">
                <span className="flex-shrink-0 mt-[2px] w-[16px] h-[16px] flex items-center justify-center">
                  {active ? (
                    <span className="ttw-steps-bubble" aria-hidden="true">
                      <span className="ttw-steps-bubble-ring" />
                      <span className="ttw-steps-bubble-dot" />
                    </span>
                  ) : (
                    <span className="w-[16px] h-[16px] rounded-full bg-[#07213A] flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f7e700"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-[9px] h-[9px]"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </span>
                <span
                  className={`text-[13px] leading-snug ${
                    active ? "text-[#07213A] font-medium" : "text-[#07213A]/60"
                  }`}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Indeterminate progress bar — same as the original loader */}
        <div className="mt-3 h-1.5 w-full bg-[#f4f3ec] rounded-full overflow-hidden">
          <div className="ttw-steps-loader-bar h-full w-2/5 rounded-full bg-[#f7e700]" />
        </div>
      </div>
    </div>
  );
};

const BottomCTABar = React.memo(
  ({
    viewMode,
    activeItineraryId,
    showItineraryShimmer,
    isDraft,
    cart,
    pricingStatus,
    loaderDisplayText,
    currency,
    countCartItems,
    isHovered,
    setIsHovered,
    popupStyle,
    onConfirm,
    onViewCart,
    onGetInTouch,
    onRetryCart,
    onViewBookings,
    notes,
    barStyle,
  }: BottomCTABarProps) => {
    if (
      !["itinerary", "bookings"].includes(viewMode) ||
      (!activeItineraryId && !showItineraryShimmer)
    )
      return null;

    if (isDraft) {
      return (
        <div data-bottom-cta-bar style={barStyle} className="z-20 fixed w-full md:w-[47.5%] bottom-0 flex-shrink-0 bg-white border-t border-slate-100 px-4 py-3 flex items-center justify-center">
          <button
            onClick={onConfirm}
            className="flex items-center justify-center h-[40px] px-5 gap-2 rounded-[8px] bg-[#F7E700] ttw-type-body font-inter !font-bold"
          >
            Confirm Itinerary & View Prices →
          </button>
        </div>
      );
    }

    const hasFreshPricing = pricingStatus === "SUCCESS";
    const isPricingFailedWithEmptyNotes =
      pricingStatus === "FAILURE" && (!notes || notes.length === 0);

    if (isPricingFailedWithEmptyNotes) {
      return (
        <div data-bottom-cta-bar style={barStyle} className="z-20 fixed w-full md:w-[48%] bottom-0 flex-shrink-0 bg-white border-t border-slate-100 px-4 py-3 flex items-center justify-between">
          <p className="text-red-600 ttw-type-body">
            Get in touch to finalize the pricing!
          </p>
          <button
            onClick={onGetInTouch}
            className="flex items-center gap-2 h-[44px] px-4 rounded-[8px] bg-[#F7E700] ttw-type-body font-inter font-semibold"
          >
            Get in touch!
          </button>
        </div>
      );
    }

    if (!hasFreshPricing) {
      // Only show the pricing loader when there's a rolling display_text to
      // surface as a step. Notes are intentionally not rendered as steps.
      if (!loaderDisplayText) return null;
      // Stepped progress card rendered in the bottom bar space (same place
      // the cart row sits), replacing the old centered overlay.
      return (
        <ItineraryStepsLoader
          displayText={loaderDisplayText}
          barStyle={barStyle}
        />
      );
    }

    const perPerson = cart?.pay_only_for_one || cart?.show_per_person_cost;
    const rawCost = perPerson
      ? cart?.per_person_discounted_cost
      : cart?.discounted_cost;
    const cost = Number.isFinite(rawCost) ? rawCost : null;
    const currencySymbol = currencySymbols[currency?.currency] || "₹";

    const couponBadge = (
      <span className="flex items-center gap-1 text-[#16A34A] font-mono text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M13 5v2" />
          <path d="M13 11v2" />
          <path d="M13 17v2" />
        </svg>
        Coupon discounts available
      </span>
    );

    // The price is what it is because of these bookings, so the count doubles as
    // the door into the Bookings view — it sits directly under the total it
    // explains. Hidden while the Bookings view is already open.
    const bookingsChip =
      onViewBookings && countCartItems > 0 && viewMode !== "bookings" ? (
        <button
          type="button"
          onClick={onViewBookings}
          className="flex items-center text-[11px] md:text-[12px] text-[#6E757A] hover:text-[#122A43] transition-colors whitespace-nowrap"
        >
          {/* No flex `gap` here — it would space the chevron off the count as
              widely as it spaces the words. The label carries its own space. */}
          Inclusive of&nbsp;
          <span className="font-semibold text-[#122A43] underline underline-offset-2">
            {countCartItems} booking{countCartItems > 1 ? "s" : ""}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="-ml-[1px]"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      ) : null;

    // px-[24px], not px-4: bootstrap.min.css is imported after Tailwind and its
    // `.px-4` is `1.5rem !important`, so a Tailwind `px-*` override at the same
    // specificity silently loses. Arbitrary values don't collide. 24px is what
    // the bar has always rendered at — keep desktop as-is.
    return (
      <div data-bottom-cta-bar style={barStyle} className="z-20 fixed w-full md:w-[48%] bottom-0 flex-shrink-0 bg-[#fffaf5] border-t border-slate-100 px-[24px] max-ph:px-[10px] py-2 flex flex-col gap-1">
        <div className="flex items-center justify-between">
        <div className="flex flex-col">
          {cost !== null ? (
            <>
              <span className="font-mono text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8A9099]">
                {perPerson
                  ? "Per Person"
                  : cart?.is_estimated_price && cost > 0
                    ? "Estimated Price"
                    : "Total Cost"}
              </span>
              {/* The bookings count sits in the foot line below, on every
                  breakpoint — see the foot line at the bottom of the bar. */}
              <span className="font-sans text-[16px] md:text-[21px] font-bold leading-tight text-[#111827] whitespace-nowrap">
                {currencySymbol}
                {formatCurrencyValue(Math.round(cost), currency?.currency)}/-
              </span>
            </>
          ) : cart?.error ? (
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#6E757A]">
                Couldn&apos;t load price.
              </span>
              {/* <button
                onClick={onRetryCart}
                className="text-[13px] font-inter font-semibold text-[#AD5BE7] underline"
              >
                Retry
              </button> */}
            </div>
          ) : (
            <span className="ttw-type-small text-[#6E757A] italic">
              Calculating price…
            </span>
          )}
        </div>
        <div className="flex gap-2 md:gap-3 items-center shrink-0">
          <div
            style={popupStyle}
            className="z-50 absolute -top-11 ttw-type-body text-center flex flex-col gap-2 bg-white"
          >
            <div className="text-nowrap font-normal text-black ttw-type-body">
              No Hidden Charges,
              <br />
              Includes taxes
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="30"
            viewBox="0 0 23 30"
            fill="none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <path
              d="M11.3333 29.75L1.13333 22.1C0.779167 21.8403 0.501736 21.5097 0.301042 21.1083C0.100347 20.7069 0 20.2819 0 19.8333V2.83333C0 2.05417 0.277431 1.38715 0.832292 0.832292C1.38715 0.277431 2.05417 0 2.83333 0H19.8333C20.6125 0 21.2795 0.277431 21.8344 0.832292C22.3892 1.38715 22.6667 2.05417 22.6667 2.83333V19.8333C22.6667 20.2819 22.5663 20.7069 22.3656 21.1083C22.1649 21.5097 21.8875 21.8403 21.5333 22.1L11.3333 29.75ZM11.3333 26.2083L19.8333 19.8333V2.83333H2.83333V19.8333L11.3333 26.2083ZM9.84583 18.4167L17.85 10.4125L15.8667 8.35833L9.84583 14.3792L6.87083 11.4042L4.81667 13.3875L9.84583 18.4167ZM11.3333 2.83333H2.83333H19.8333H11.3333Z"
              fill="#AD5BE7"
            />
          </svg>
          {cart?.error ? (
            <button
              onClick={onGetInTouch}
              className="flex items-center gap-2 h-[42px] md:h-[44px] px-4 rounded-[8px] bg-[#F7E700] text-[14px] md:text-[15px] font-inter font-bold text-black whitespace-nowrap shrink-0"
            >
              Get in touch!
            </button>
          ) : (
            <button
              onClick={onViewCart}
              className="flex items-center gap-2 h-[42px] md:h-[44px] px-4 rounded-[8px] bg-[#F7E700] text-[14px] md:text-[15px] font-inter font-bold text-black whitespace-nowrap shrink-0"
            >
              View Cart
              {countCartItems > 0 && (
                <span className="bg-[#111827] text-white text-[12px] font-bold rounded-full min-w-[24px] h-[22px] px-1.5 flex items-center justify-center">
                  {countCartItems}
                </span>
              )}
            </button>
          )}
        </div>
        </div>
        {/* Foot line: the bookings count under the price it explains, and the
            coupon hint under the CTA it applies to. justify-end (not
            justify-between) so the coupon badge stays put when there is no
            bookings chip to push it right. */}
        {(cost !== null || bookingsChip) && (
          <div className="flex items-center justify-end gap-3">
            {bookingsChip && <span className="mr-auto">{bookingsChip}</span>}
            {cost !== null && couponBadge}
          </div>
        )}
      </div>
    );
  },
);
BottomCTABar.displayName = "BottomCTABar";

// ── MobileLayout — full-screen views with top tab bar + mobile header ─────────
type MobileTab = "chat" | "map" | "routes" | "itinerary" | "bookings";

const CHATKIT_API_URL_MOBILE = CHATKIT_API_URL;

function getAuthToken(): string | null {
  // localStorage is browser-only; guard so render-time calls don't crash
  // SSR/static-export (this is called in render bodies via `reduxToken ?? getAuthToken()`).
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("token") ??
    localStorage.getItem("authToken") ??
    localStorage.getItem("access_token") ??
    null
  );
}

// ── MobileHeaderMenu ─────────────────────────────────────────────────────────
// Right-side icons (history, new chat, profile) + their drawer/login modal.
// Used both inside MobileHeader and embedded in ChatKitPanel's mobile top bar
// — so the chat tab can drop the full header for vertical space while still
// exposing the same actions next to "Chat with Kaira".
export const MobileHeaderMenu = React.memo(
  ({
    onNewChat,
    onThreadSelect,
    activeThreadId,
    isComplete,
    onLoginSuccess,
    onClose,
  }: {
    onNewChat: () => void;
    onThreadSelect: (id: string, sessionId?: string, customerName?: string) => void;
    activeThreadId: string | null;
    isComplete?: boolean;
    onLoginSuccess?: () => void | Promise<void>;
    // Mobile-only close: returns the reader to the theme page the chat was
    // opened from. When set it takes the place of the new-chat and profile
    // buttons, which is the whole point — one exit, not three actions.
    onClose?: () => void;
  }) => {
    const userId = (useSelector as any)((s: any) => s.auth?.id);
    const token = (useSelector as any)((s: any) => s.auth?.token);
    const name = (useSelector as any)((s: any) => s.auth?.name);
    const image = (useSelector as any)((s: any) => s.auth?.image);
    const dispatch = useDispatch();

    const [historyOpen, setHistoryOpen] = React.useState(false);
    const [threads, setThreads] = React.useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = React.useState(false);
    const [profileOpen, setProfileOpen] = React.useState(false);
    const tripsCount = useTripsCount();
    const [showLogin, setShowLogin] = React.useState(false);
    const profileRef = React.useRef<HTMLDivElement>(null);
    const reduxToken = useSelector((state: any) => state.auth.token);
    const [localImg, setLocalImg] = useState<string | null>(
      typeof window !== "undefined" ? localStorage.getItem("user_image") : null,
    );

    const authToken = reduxToken ?? getAuthToken();
    const isLoggedIn = !!authToken;

    // Close profile dropdown on outside click
    React.useEffect(() => {
      const h = (e: MouseEvent) => {
        if (
          profileRef.current &&
          !profileRef.current.contains(e.target as Node)
        )
          setProfileOpen(false);
      };
      document.addEventListener("mousedown", h);
      return () => document.removeEventListener("mousedown", h);
    }, []);

    // Close login modal when token arrives
    React.useEffect(() => {
      if (token && showLogin) setShowLogin(false);
    }, [token]);

    // After your existing useEffects in SidebarProfile, add:

    React.useEffect(() => {
      if (token) {
        // On login, re-read localStorage in case it was just set
        const stored =
          typeof window !== "undefined"
            ? localStorage.getItem("user_image")
            : null;
        setLocalImg(stored);
      } else {
        // On logout, clear immediately
        setLocalImg(null);
        // Drop the previous session's threads + close the drawer so no stale
        // history survives a logout.
        setThreads([]);
        setHistoryOpen(false);
      }
    }, [token]);

    const fetchThreads = async () => {
      if (!userId) return;
      setHistoryLoading(true);
      try {
        const res = await fetch(CHATKIT_API_URL_MOBILE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "threads.list",
            params: { limit: 9999, order: "desc" },
            filter_user_id: String(userId),
            platform: getPlatform(),
            //  filter_bot: isComplete ? "P2" : "P1"
          }),
        });
        const data = await res.json();
        setThreads(data.data ?? []);
      } catch {
        /* ignore */
      } finally {
        setHistoryLoading(false);
      }
    };

    const handleHistoryClick = () => {
      fetchThreads();
      setHistoryOpen(true);
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_image");
      localStorage.removeItem("is_new_user");
      try {
        dispatch({ type: "AUTH_LOGOUT" });
      } catch {
        /* ignore */
      }
      setProfileOpen(false);
    };

    const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
    // Same default avatar the desktop sidebar falls back to. Shown when the
    // user is logged out instead of the "T"/initials placeholder.
    const defaultProfileImg =
      imgUrlEndPoint + "media/icons/navigation/profile-user.png";

    const avatarSrc = token
      ? image && image !== "null" && image !== null
        ? imgUrlEndPoint + image
        : localImg && localImg !== "null"
          ? imgUrlEndPoint + localImg
          : null
      : defaultProfileImg;

    // Logged in with no picture → colored letter avatar (matches desktop).
    const showColorAvatar = !!token && !avatarSrc;
    const [avatarColor, setAvatarColor] = useState<string | null>(null);
    useEffect(() => {
      setAvatarColor(showColorAvatar ? getUserAvatarColor(name) : null);
    }, [showColorAvatar, name]);
    const initials = name
      ? name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((w: string) => w[0]?.toUpperCase() ?? "")
          .join("")
      : "T";

    return (
      <>
        {/* Chat history slide-in drawer — portaled to <body> so the fixed
          positioning isn't trapped by ancestor containing-blocks (e.g.
          ChatKitPanel's top bar uses `backdrop-blur-sm`, which makes
          `position: fixed` resolve against the bar instead of the viewport
          and leaves the drawer pinned to a tiny header strip on mobile). */}
        {typeof document !== "undefined" &&
          createPortal(
            <>
              {historyOpen && (
                <div
                  className="fixed inset-0 z-[350] bg-black/20"
                  onClick={() => setHistoryOpen(false)}
                />
              )}
              <div
                className="kaira-scope kaira-drawer fixed top-0 left-0 h-full z-[400] shadow-2xl transition-transform duration-300 ease-in-out"
                style={{
                  width: "85vw",
                  maxWidth: 320,
                  transform: historyOpen
                    ? "translateX(0)"
                    : "translateX(-110%)",
                }}
              >
                <div className="kaira-drawer-head">
                  <span className="kaira-drawer-title">
                    <KairaHistoryIcon size={14} />
                    <span className="kaira-mono">Recent chats</span>
                  </span>
                  <button
                    onClick={() => setHistoryOpen(false)}
                    className="kaira-icon-btn is-sm"
                    aria-label="Close recent chats"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="kaira-hist-scroll">
                  {historyLoading ? (
                    <div className="flex flex-col gap-1.5 pt-3 px-1">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="h-9 rounded-[10px] animate-pulse"
                          style={{
                            background: "var(--k-paper-2)",
                            opacity: 1 - i * 0.12,
                          }}
                        />
                      ))}
                    </div>
                  ) : threads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center gap-1.5 px-3 py-10">
                      <p style={{ fontSize: 13.5, fontWeight: 600 }}>
                        No chats yet
                      </p>
                      <p style={{ fontSize: 12.5, color: "var(--k-ink-4)" }}>
                        Start a new chat to see history here
                      </p>
                    </div>
                  ) : (
                    // Same Today/Yesterday/… buckets as the desktop rail.
                    groupThreads(threads).map((group) => (
                      <div key={group.label} className="mb-1.5">
                        <div className="kaira-mono kaira-hist-group-label">
                          {group.label}
                        </div>
                        {group.threads.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              onThreadSelect(
                                t.id,
                                t.session_id ?? t.filter_session_id,
                                t.customer_name,
                              );
                              setHistoryOpen(false);
                            }}
                            className={`kaira-hist-item${activeThreadId === t.id ? " is-active" : ""}`}
                            title={t.title || "Untitled"}
                          >
                            <span className="kaira-hist-title">
                              {t.title || "Untitled"}
                            </span>
                            {t.itinerary_created && (
                              <span
                                className="kaira-hist-marker"
                                title="Itinerary created"
                              >
                                <KairaMapIcon />
                              </span>
                            )}
                            <span className="kaira-hist-time kaira-mono tabular-nums">
                              {formatCompactTime(t.created_at)}
                            </span>
                          </button>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>,
            document.body,
          )}

        {/* Right icons */}
        <div className="kaira-scope flex items-center gap-1">
          {/* Recent chats — hidden logged out, matching the desktop rail: no
              history means an empty drawer isn't worth a header button. */}
          {isLoggedIn && (
            <button
              onClick={handleHistoryClick}
              className="kaira-icon-btn is-sm is-filled"
              aria-label="Recent chats"
            >
              <KairaHistoryIcon size={18} />
            </button>
          )}

          {/* New chat + profile are dropped from the mobile header whenever the
              close button is present (`onClose`): the header only has room for
              one action, and getting back out is the one readers reach for.
              Both stay on the desktop rail, and the markup stays here rather
              than being deleted so restoring them is a one-line change. */}

          {/* New chat — solid ink circle, matching the desktop collapsed rail. */}
          {!onClose && (
          <button
            onClick={onNewChat}
            className="kaira-newchat-icon-btn is-sm"
            aria-label="New chat"
          >
            <KairaPlusIcon size={18} />
          </button>
          )}

          {/* Profile avatar */}
          {!onClose && (
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="kaira-avatar"
              style={avatarColor ? { background: avatarColor } : undefined}
              aria-label="Profile"
            >
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={optimizedMediaUrl(avatarSrc, { width: 96 })}
                  alt={name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : showColorAvatar ? (
                getUserInitial(name)
              ) : (
                initials
              )}
            </button>
            {profileOpen && (
              <div
                className="kaira-scope kaira-menu absolute right-0 top-11 z-[9999]"
                style={{ minWidth: 190 }}
              >
                {!token ? (
                  <button
                    className="kaira-menu-item"
                    onClick={() => {
                      setProfileOpen(false);
                      setShowLogin(true);
                    }}
                  >
                    <KairaUserIcon className="kaira-menu-icon" />
                    Login / Signup
                  </button>
                ) : (
                  <>
                    <a href="/dashboard" className="kaira-menu-item">
                      <span className="kaira-trips-tile">
                        <KairaSuitcaseIcon />
                      </span>
                      My trips
                      {tripsCount !== null && (
                        <span className="kaira-count">{tripsCount}</span>
                      )}
                    </a>
                    <button
                      className="kaira-menu-item is-logout"
                      onClick={handleLogout}
                    >
                      <span className="kaira-logout-tile">
                        <KairaLogoutIcon size={15} />
                      </span>
                      Log out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          )}

          {/* Close — black circle out to whatever this chat produced: the
              itinerary if there is one, else the theme page it started on.
              See handleCloseChat. */}
          {onClose && (
            <button
              onClick={onClose}
              className="kaira-close-btn"
              aria-label="Close chat"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {showLogin && !isLoggedIn && (
          <BotLoginModal
            show={showLogin}
            onhide={() => setShowLogin(false)}
            zIndex={3300}
            message="Please login to continue"
            onSuccess={async () => {
              await onLoginSuccess?.();
            }}
          />
        )}
      </>
    );
  },
);
MobileHeaderMenu.displayName = "MobileHeaderMenu";

// ── MobileHeader ──────────────────────────────────────────────────────────────
// Logo + MobileHeaderMenu. Used outside the chat tab; the chat tab embeds
// MobileHeaderMenu directly inside ChatKitPanel's "Chat with Kaira" bar.

const MobileHeader = React.memo(
  ({
    onNewChat,
    onThreadSelect,
    activeThreadId,
    isComplete,
    onLoginSuccess,
  }: {
    onNewChat: () => void;
    onThreadSelect: (id: string, sessionId?: string, customerName?: string) => void;
    activeThreadId: string | null;
    isComplete?: boolean;
    onLoginSuccess?: () => void | Promise<void>;
  }) => (
    <div className="kaira-scope kaira-mheader z-10">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        <BrandLockup size={LOGO_HEIGHT.MOBILE} variant="light" />
      </div>
      <MobileHeaderMenu
        onNewChat={onNewChat}
        onThreadSelect={onThreadSelect}
        activeThreadId={activeThreadId}
        isComplete={isComplete}
        onLoginSuccess={onLoginSuccess}
      />
    </div>
  ),
);
MobileHeader.displayName = "MobileHeader";

interface MobileLayoutProps {
  showStartScreen: boolean;
  hasBotResponded: boolean;
  isChatActive: boolean;
  hasItineraryActivity: boolean;
  isComplete: boolean;
  showChatBot: boolean;
  chatBotItineraryId: string | null;
  chatBotInjectedMessage: string | null;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  mobilePanel: MobilePanel;
  setMobilePanel: (p: MobilePanel) => void;
  onNewChat: () => void;
  onThreadSelect: (id: string, sessionId?: string, customerName?: string) => void;
  activeThreadId: string | null;
  onRegisterTabSwitch: (fn: ((tab: string) => void) | null) => void;
  mapContent: React.ReactNode;
  chatContent: React.ReactNode;
  itineraryContent: React.ReactNode;
  mobileEffectPopup?: { type: "map" | "itinerary"; label: string } | null;
  onDismissMobileEffectPopup?: () => void;
  bottomCTABarProps?: BottomCTABarProps;
  onSettingsClick?: () => void;
  onLoginSuccess?: () => void | Promise<void>;
  /** Collapse the expanded trip-details card when the itinerary pane scrolls. */
  onItineraryScrolled?: (scrolledAway: boolean, isDown: boolean) => void;
}

const MobileLayout = React.memo(
  ({
    showStartScreen,
    hasBotResponded,
    isChatActive,
    hasItineraryActivity,
    isComplete,
    showChatBot,
    chatBotItineraryId,
    chatBotInjectedMessage,
    viewMode,
    setViewMode,
    mobilePanel,
    setMobilePanel,
    onNewChat,
    onThreadSelect,
    activeThreadId,
    onRegisterTabSwitch,
    mapContent,
    chatContent,
    itineraryContent,
    mobileEffectPopup,
    onDismissMobileEffectPopup,
    bottomCTABarProps,
    onSettingsClick,
    onLoginSuccess,
    onItineraryScrolled,
  }: MobileLayoutProps) => {
    // On a sessionId refresh, BotApp seeds `mobilePanel` to "itinerary" (same
    // signal desktop uses for its viewMode default). Honour it here so an
    // itinerary reload lands directly on the itinerary tab instead of flashing
    // the chat tab first while the async thread restore resolves. Chat-only
    // threads (no itinerary) are switched back to chat by the restore flow.
    const [activeTab, setActiveTab] = React.useState<MobileTab>(
      mobilePanel === "itinerary" || hasItineraryActivity ? "itinerary" : "chat",
    );
    const hasUnread = (useSelector as any)(
      (s: any) => !!s.chatState?.unreadMessages,
    );
    const dispatchLayout = useDispatch();
    const [showChatBanner, setShowChatBanner] = React.useState(true);

    // Track whether the user has opened the chat drawer at least once. The
    // floating Kaira banner only shows on non-chat tabs, so once this flips true
    // the user has been in the chat and left it — invite them to "Continue
    // chatting with Kaira" rather than the first-time "Chat with Kaira".
    const [hasOpenedChat, setHasOpenedChat] = React.useState(false);
    const prevActiveTabRef = React.useRef(activeTab);
    React.useEffect(() => {
      if (activeTab === "chat") {
        setHasOpenedChat(true);
      } else if (prevActiveTabRef.current === "chat") {
        // Just returned from the chat drawer — opening chat hid the banner
        // (setShowChatBanner(false) on the icon click), so re-surface it here
        // to immediately invite the user to continue chatting.
        setShowChatBanner(true);
      }
      prevActiveTabRef.current = activeTab;
    }, [activeTab]);
    const kairaBannerText = hasOpenedChat
      ? "Continue chatting with Kaira"
      : "Chat with Kaira";

    // Sync mobilePanel (legacy) so BotApp state stays consistent. The map tab
    // reports itself as "map" rather than collapsing into "itinerary": it is the
    // only signal BotApp has for whether the mobile map pane is actually on
    // screen. viewMode can't answer that — handleTabClick sets it to "map" for
    // the CHAT tab too.
    React.useEffect(() => {
      setMobilePanel(
        activeTab === "chat" ? "chat" : activeTab === "map" ? "map" : "itinerary",
      );
    }, [activeTab, setMobilePanel]);

    // Clear unread flag when user switches to chat tab
    React.useEffect(() => {
      if (activeTab === "chat" && hasUnread) {
        dispatchLayout(setUnreadMessages(false));
      }
    }, [activeTab, hasUnread, dispatchLayout]);

    const handleTabClick = (tab: MobileTab) => {
      setActiveTab(tab);
      if (tab === "itinerary") setViewMode("itinerary");
      else if (tab === "routes") setViewMode("routes");
      else if (tab === "bookings") setViewMode("bookings");
      else if (tab === "map") setViewMode("map");
      else if (tab === "chat") setViewMode("map");
    };

    // Register handleTabClick with BotApp so openPaymentDrawer can switch tabs on mobile
    React.useEffect(() => {
      onRegisterTabSwitch(handleTabClick as (tab: string) => void);
      return () => onRegisterTabSwitch(null as any); // clear on unmount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onRegisterTabSwitch]);

    // Reset to chat tab when new chat is started (isChatActive goes false → true false again)
    const prevIsChatActiveRef = React.useRef(isChatActive);
    React.useEffect(() => {
      if (prevIsChatActiveRef.current && !isChatActive) {
        setActiveTab("chat");
      }
      prevIsChatActiveRef.current = isChatActive;
    }, [isChatActive]);

    // When itinerary activity starts on mobile, keep the user on the chat tab
    // rather than yanking them into the itinerary view. The "View Itinerary"
    // pill above the composer and the bar below the header let them switch
    // manually.
    const prevHasActivityRef = React.useRef(hasItineraryActivity);
    React.useEffect(() => {
      // Activity dropped (e.g. switched from a P2 thread to a P1 thread that
      // hasn't built an itinerary yet). The itinerary/routes/bookings tabs
      // disappear from the top bar AND their content div is gated by
      // `hasItineraryActivity`, so leaving activeTab on one of them paints a
      // blank screen — fall back to chat.
      if (
        prevHasActivityRef.current &&
        !hasItineraryActivity &&
        ["itinerary", "routes", "bookings"].includes(activeTab)
      ) {
        setActiveTab("chat");
      }
      prevHasActivityRef.current = hasItineraryActivity;
    }, [hasItineraryActivity, activeTab, setViewMode]);

    // There is no tab strip. Map / Bookings / Route are each reached from a CTA
    // on the itinerary (the header card's Map + Change Route pills, the cart
    // bar's booking count) and each carries its own way back — see
    // BackToItinerary. Every MobileTab is still a valid target and
    // handleTabClick still switches to all of them; only the strip is gone.
    //
    // The chat tab is the exception: nothing on it belongs to the itinerary, so
    // it keeps one persistent entry point back into the trip. (The
    // mobileEffectPopup pill also does this, but only once and only for 10s.)

    // ── Mobile header: an absolute bar pinned to the top of the layout ────
    // It never moves or reflows on scroll — the panes below are offset down by
    // its measured height so nothing hides behind it. (It used to be a flex
    // child that collapsed via an animated negative margin-top on scroll, but
    // that reflowed the pane every frame and read as a scroll glitch.)
    //
    // NOTE: window/document never scrolls on this page — <main> is
    // `h-dvh overflow-hidden`, so a window scroll listener would never fire.
    // The real scroller is the itinerary/routes/bookings pane below, and the
    // two thresholds here only drive the trip card's condense/meta-collapse.
    const SCROLL_JITTER_PX = 6; // ignore sub-pixel / momentum noise
    const SHOW_ABOVE_PX = 48; // condense the trip card past this scroll depth
    // Two stops for the navbar rather than one: it hides once scrolled past
    // NAV_HIDE_PX and only returns within NAV_SHOW_PX of the top. The gap
    // between them (hysteresis) stops momentum/rubber-band jitter at a single
    // boundary from flipping it on and off — that flicker was the "glitch".
    const NAV_SHOW_PX = 4;
    const NAV_HIDE_PX = 40;

    const scrollPaneRef = React.useRef<HTMLDivElement | null>(null);
    const headerRef = React.useRef<HTMLDivElement | null>(null);
    const lastScrollRef = React.useRef(0);
    const [headerHeight, setHeaderHeight] = React.useState(0);
    // The navbar shows only at the top of the pane and slides up out of view
    // once scrolled — driven by the pane's scroll position, applied via a GPU
    // transform (see the header markup below).
    const [navHidden, setNavHidden] = React.useState(false);

    const headerVisible = activeTab !== "chat";

    // Held in a ref so the scroll listener below never re-registers on it.
    const onItineraryScrolledRef = React.useRef(onItineraryScrolled);
    onItineraryScrolledRef.current = onItineraryScrolled;

    // Measure the absolute navbar so the panes below can be offset by its real
    // height (padding + border + the 36px icon buttons ≈ 61px — measured, not
    // hard-coded). useLayoutEffect so the offset is set before paint and the
    // itinerary never flashes underneath the navbar on mount.
    React.useLayoutEffect(() => {
      const el = headerRef.current;
      if (!el) {
        setHeaderHeight(0);
        return undefined;
      }
      const measure = () => setHeaderHeight(el.offsetHeight);
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, [headerVisible]);

    React.useEffect(() => {
      const el = scrollPaneRef.current;
      if (!el) return;
      lastScrollRef.current = el.scrollTop;

      // Coalesce every burst of scroll events into a single update per animation
      // frame. Calling setState synchronously inside the scroll event forces a
      // layout flush on every tick mid-scroll — that thrash is what makes the
      // pane stutter on mobile. One rAF-batched pass per frame keeps it smooth.
      let rafId = 0;
      const update = () => {
        rafId = 0;
        const y = el.scrollTop;
        const delta = y - lastScrollRef.current;

        // iOS rubber-banding drives scrollTop negative / past the end; the
        // jitter guard keeps that momentum noise from toggling the condensed
        // trip card. Skipped inside the reveal band so a slow drift to rest a
        // few px down still registers.
        if (Math.abs(delta) < SCROLL_JITTER_PX && y > SHOW_ABOVE_PX) return;
        lastScrollRef.current = y;

        // The navbar is visible only at the top and slides away once scrolled.
        // Hysteresis: hide past NAV_HIDE_PX, show only back within NAV_SHOW_PX;
        // in the dead band between them leave it as-is so boundary jitter can't
        // flicker it. Direction-agnostic — it returns on scrolling back to top.
        if (y <= NAV_SHOW_PX) setNavHidden(false);
        else if (y > NAV_HIDE_PX) setNavHidden(true);

        // Away from the top the trip-details card condenses to its identifying
        // lines; a downward scroll additionally collapses the expanded meta.
        onItineraryScrolledRef.current?.(y > SHOW_ABOVE_PX, delta > 0);
      };

      const onScroll = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(update);
      };

      el.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        el.removeEventListener("scroll", onScroll);
        if (rafId) cancelAnimationFrame(rafId);
      };
    }, [hasItineraryActivity]);

    // Re-baseline the scroll delta on tab change so the first scroll of the new
    // pane isn't misread as a large jump, and show the navbar again (a new tab
    // starts at the top).
    React.useEffect(() => {
      lastScrollRef.current = scrollPaneRef.current?.scrollTop ?? 0;
      setNavHidden(false);
    }, [activeTab]);

    // Only one bar owns the bottom of the screen. Opening the Route tab's
    // editor puts its own "Update Route" bar there for the whole session, and
    // the cart bar stands down until the edit is saved or abandoned. Stacking
    // can't arbitrate this on its own — the route bar is portalled to <body>
    // and would simply cover the cart bar, leaving two bars' worth of chrome
    // stacked at the foot. RouteEditSection owns the flag (whether its editor
    // is open is state nothing up here can see) and publishes it to the store.
    // No activeTab reset needed — the gate below already requires the Route
    // tab, and the flag stays truthful while the user is elsewhere.
    const routeBarShown = (useSelector as any)(
      (s: any) => !!s.ItineraryStatus?.route_bar_active,
    );
    const showCartBar = !(activeTab === "routes" && routeBarShown);

    // The scroll pane ends where the fixed CTA bar begins. Measure the bar
    // rather than assume a height — it swaps between a one-line confirm button,
    // the steps loader and the two-line cart row, each a different height, and
    // a stale guess leaves a dead white strip between the pane and the bar.
    const [ctaBarHeight, setCtaBarHeight] = React.useState(0);
    React.useEffect(() => {
      // Measure whichever bar is down there — the cart bar or the Route tab's.
      // Both can be in the DOM at once (the Route tab stays mounted behind the
      // itinerary tab, just display:none'd), so take the tallest that actually
      // renders; a hidden copy measures 0.
      const els = Array.from(
        document.querySelectorAll(
          "[data-bottom-cta-bar],[data-route-action-bar]",
        ),
      ) as HTMLElement[];
      if (!els.length) {
        setCtaBarHeight(0);
        return undefined;
      }
      const measure = () =>
        setCtaBarHeight(
          els.reduce(
            (h, el) => Math.max(h, el.getBoundingClientRect().height),
            0,
          ),
        );
      measure();
      const ro = new ResizeObserver(measure);
      els.forEach((el) => ro.observe(el));
      return () => ro.disconnect();
      // bottomCTABarProps carries cart/pricingStatus, so it changes whenever the
      // bar swaps variants and this re-queries the (newly mounted) element.
    }, [bottomCTABarProps, hasItineraryActivity, activeTab, routeBarShown]);

    return (
      <div className="flex flex-col h-full overflow-hidden relative">
        {/* ── Mobile header — hidden on chat tab; ChatKitPanel renders its
           own top bar with the menu on the right of "Chat with Kaira". ── */}
        {headerVisible && (
          <div
            ref={headerRef}
            // Absolute — not sticky, not a collapsing flex child. Pinned to the
            // top and shown only near the top of the pane; on scroll it slides
            // straight up out of view via a GPU transform. (The old approach
            // animated margin-top, reflowing the pane every frame — that was the
            // scroll glitch.) A scrolling spacer of the same height sits at the
            // top of the pane below, so the content still starts under the navbar
            // at rest and nothing moves when it slides away.
            className="absolute top-0 inset-x-0 z-40 bg-white transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none"
            style={{
              transform: navHidden ? "translateY(-100%)" : "translateY(0)",
              opacity: navHidden ? 0 : 1,
              pointerEvents: navHidden ? "none" : "auto",
              willChange: "transform, opacity",
            }}
            aria-hidden={navHidden}
          >
            <MobileHeader
              onNewChat={onNewChat}
              onThreadSelect={onThreadSelect}
              activeThreadId={activeThreadId}
              isComplete={isComplete}
              onLoginSuccess={onLoginSuccess}
            />
          </div>
        )}

        {/* ── Chat tab: the one persistent way back into the trip ── */}
        {hasItineraryActivity && activeTab === "chat" && (
          <button
            type="button"
            onClick={() => handleTabClick("itinerary")}
            className="flex-shrink-0 bg-white border-b border-gray-100 flex items-center justify-center gap-2 px-3 py-[9px] text-[12.5px] font-inter font-semibold text-[#122A43] active:bg-[#F4F6F8]"
          >
            <FiCalendar size={14} />
            View Itinerary
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        )}

        {/* ── Content area — full remaining height ── */}
        <div className="flex-1 min-h-0 overflow-hidden relative bg-white">
          {/* CHAT view */}
          <div
            className="absolute inset-0"
            style={{
              opacity: activeTab === "chat" ? 1 : 0,
              pointerEvents: activeTab === "chat" ? "auto" : "none",
              zIndex: activeTab === "chat" ? 2 : 1,
            }}
          >
            {chatContent}
          </div>

          {/* MAP view */}
          <div
            className="absolute inset-x-0 bottom-0 flex flex-col"
            style={{
              top: headerHeight, // sit below the absolute navbar
              opacity: activeTab === "map" ? 1 : 0,
              pointerEvents: activeTab === "map" ? "auto" : "none",
              zIndex: activeTab === "map" ? 2 : 1,
            }}
          >
            <div className="relative flex-1 min-h-0 flex flex-col">
              {mapContent}
            </div>
            {/* View Cart bar on map tab */}
            {bottomCTABarProps && hasItineraryActivity && (
              <BottomCTABar {...bottomCTABarProps} viewMode="itinerary" />
            )}
            {/* Way back out of the map — centered, just above the cart bar. */}
            {hasItineraryActivity && (
              <BackToItineraryBar
                onClick={() => handleTabClick("itinerary")}
                bottom={ctaBarHeight + 12}
              />
            )}
          </div>

          {/* ITINERARY / ROUTES / BOOKINGS view */}
          {hasItineraryActivity && (
            <div
              ref={scrollPaneRef}
              // The cart bar (rendered as a sibling below this pane) is
              // `fixed bottom-0`, so it takes no flow space and would cover the
              // last card at max scroll. End the pane above it rather than
              // padding the pane by its height: padding is scrollable, so it
              // forced a scrollbar even when the content fit. Shrinking the pane
              // cannot.
              className="absolute inset-x-0 top-0 overflow-y-auto bg-white"
              style={{
                // Full height (the spacer below reserves the navbar's row inside
                // the scroll flow); end where the fixed CTA bar begins.
                bottom: ctaBarHeight,
                // Momentum scrolling; keep the scroll from chaining into the
                // surface behind it; and hard-clip horizontal overflow so a
                // too-wide child can't turn this vertical pane into a two-axis
                // scroller (that sideways drift was the "horizontal scroll" and
                // the diagonal glitch). willChange hints its own compositor layer.
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
                overflowX: "hidden",
                willChange: "scroll-position",
                opacity: ["itinerary", "routes", "bookings"].includes(activeTab)
                  ? 1
                  : 0,
                pointerEvents: ["itinerary", "routes", "bookings"].includes(
                  activeTab,
                )
                  ? "auto"
                  : "none",
                zIndex: ["itinerary", "routes", "bookings"].includes(activeTab)
                  ? 2
                  : 1,
              }}
            >
              {/* Scrolling spacer the height of the absolute navbar. The navbar
                  overlays this at rest; it scrolls away with the content so the
                  navbar can slide up without leaving a gap or shifting anything.
                  The sticky trip card sits after it and pins to the very top
                  once the spacer scrolls past. */}
              {headerVisible && (
                <div style={{ height: headerHeight }} aria-hidden />
              )}
              {itineraryContent}
            </div>
          )}

          {/* Cart bar (+ back-to-itinerary pill) for the itinerary / routes /
              bookings tabs. Rendered here as a SIBLING of the scroll pane, never
              inside it: on iOS a position:fixed element nested in a
              -webkit-overflow-scrolling:touch scroller is positioned against the
              scrolled content instead of the viewport, so it scrolls off-screen
              and vanishes — which is exactly why the bar was missing on phones.
              The map tab keeps its own copy outside the pane for the same reason.
              The pane reserves `ctaBarHeight` at its foot so this never covers the
              last card. */}
          {bottomCTABarProps &&
            hasItineraryActivity &&
            ["itinerary", "routes", "bookings"].includes(activeTab) && (
              <>
                {showCartBar && (
                  <BottomCTABar {...bottomCTABarProps} viewMode="itinerary" />
                )}
                {["routes", "bookings"].includes(activeTab) && (
                  <BackToItineraryBar
                    onClick={() => handleTabClick("itinerary")}
                    bottom={ctaBarHeight + 12}
                  />
                )}
              </>
            )}
        </div>

        {/* ── Floating Kaira icon + chat banner — on itinerary/routes/bookings views ── */}
        {hasItineraryActivity &&
          ["itinerary", "routes", "bookings"].includes(activeTab) && (
            <div
              className="fixed z-[100] flex flex-col items-end gap-2"
              style={{ bottom: 80, right: 16 }}
            >
              {/* Chat Banner */}
              {showChatBanner && (
                <div className="relative bg-[#F7E700] text-black px-[19px] py-2 rounded-[12px] shadow-lg max-w-[290px] animate-slideIn">
                  <button
                    onClick={() => setShowChatBanner(false)}
                    className="absolute top-2 right-2 text-black hover:text-gray-700"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                  <p className="ttw-type-body pr-1 mb-0">
                    {kairaBannerText}
                  </p>
                  {/* Speech bubble arrow */}
                  <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-[#F7E700]" />
                </div>
              )}
              <div className="relative">
                <button
                  onClick={() => {
                    handleTabClick("chat");
                    setShowChatBanner(false);
                  }}
                  className="relative w-16 h-16 rounded-full shadow-2xl overflow-hidden border-2 border-white focus:outline-none active:scale-95 transition-transform"
                  aria-label="Chat with Kaira"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/KairaInsta.png"
                    alt="Kaira"
                    className="w-full h-full object-cover"
                  />
                </button>
                {/* Red notification dot */}
                <span
                  className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white"
                  style={{ zIndex: 1 }}
                />
              </div>
            </div>
          )}

        {/* ── Mobile chat pill — "View Map" on first focus_route, "View Itinerary"
             on first P2 finalized transition. Shown for 10s above the input. ── */}
        {
        mobileEffectPopup && activeTab === "chat" && 
        (
          <div
            className="fixed z-[300] left-0 right-0 flex justify-center px-4"
            style={{ bottom: 150 }}
          >
            <button
              onClick={() => {
                handleTabClick(
                  mobileEffectPopup?.type === "itinerary" ? "itinerary" : "map",
                );
                onDismissMobileEffectPopup?.();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#07213A] text-white ttw-type-small font-semibold shadow-2xl active:scale-95 transition-transform"
              style={{ whiteSpace: "nowrap" }}
            >
              {mobileEffectPopup?.type === "itinerary" ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="8" y1="13" x2="16" y2="13" />
                  <line x1="8" y1="17" x2="16" y2="17" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                </svg>
              )}
              {mobileEffectPopup?.label}
            </button>
          </div>
        )}

        {/* ── Floating Kaira icon + chat banner on map tab ── */}
        {hasItineraryActivity && activeTab === "map" && (
          <div
            className="fixed z-[100] flex flex-col items-end gap-2"
            style={{ bottom: 70, right: 16 }}
          >
            {/* Chat Banner */}
            {showChatBanner && (
              <div className="relative bg-[#F7E700] text-black px-[19px] py-2 rounded-[12px] shadow-lg max-w-[290px] animate-slideIn">
                <button
                  onClick={() => setShowChatBanner(false)}
                  className="absolute top-2 right-2 text-black hover:text-gray-700"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <p className="ttw-type-body pr-3 mb-0">
                  {kairaBannerText}
                </p>
                <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-[#F7E700]" />
              </div>
            )}
            <div className="relative">
              <button
                onClick={() => {
                  handleTabClick("chat");
                  setShowChatBanner(false);
                }}
                className="relative w-16 h-16 rounded-full shadow-2xl overflow-hidden border-2 border-white focus:outline-none active:scale-95 transition-transform"
                aria-label="Chat with Kaira"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/KairaInsta.png"
                  alt="Kaira"
                  className="w-full h-full object-cover"
                />
              </button>
              {/* Red notification dot */}
              <span
                className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white"
                style={{ zIndex: 1 }}
              />
            </div>
          </div>
        )}

        {/* ── "Back to Chat" pill on map tab — shown when no floating Kaira
           icon is present (i.e. no itinerary activity yet) so users still
           have an obvious way back to the chat. ── */}
        {!hasItineraryActivity && activeTab === "map" && (
          <button
            onClick={() => handleTabClick("chat")}
            className="fixed z-[100] flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#07213A] text-white ttw-type-small font-semibold shadow-2xl active:scale-95 transition-transform"
            style={{ bottom: 24, right: 16, whiteSpace: "nowrap" }}
            aria-label="Back to chat"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            View Chat
          </button>
        )}
      </div>
    );
  },
);
MobileLayout.displayName = "MobileLayout";
