import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { optimizedMediaUrl } from "../../../lib/mediaImage";
import { useRouter } from "next/router";
import axios from "axios";
import { useChat, generateSessionId, getPlatform, type UserLocationData, type MessageAttachment, type ThemeSelectedItem, Message } from "../hooks/useChat";
import { MessageBubble, isButtonOnlyWidget, ItineraryCloneCta } from "./MessageBubble";
import { MessageInputBox } from "./MessageInputBox";
import { CHATKIT_API_DOMAIN_KEY as CHATKIT_DOMAIN_KEY } from "../lib/chatkitConfig";
import type { Location, BotMode } from "../types";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import LogInModal from "../../userauth/LogInModal";
import { createPortal } from "react-dom";
import ActivityDetailsDrawer from "../../drawers/activityDetails/ActivityDetailsDrawer";
import TransferEditDrawer from "../../drawers/routeTransfer/TransferEditDrawer";
import AccommodationDetailDrawer from "../../modals/AccommodationDetailDrawer";
import POIDetailsDrawer from "../../drawers/poiDetails/POIDetailsDrawer";
import VisaSearchDrawer from "../../drawers/visaDetails/VisaSearchDrawer";
import EsimPackagesDrawer from "../../drawers/esimDetails/EsimPackagesDrawer";
import CloneItinerary from "../../CloneItinerary/Index";
import ModalWithBackdrop from "../../ui/ModalWithBackdrop";
import BottomModal from "../../ui/LowerModal";
import useMediaQuery from "../../../hooks/useMedia";
import { MERCURY_HOST, CHATKIT_HOST, CHATKIT_API_URL } from "../../../services/constants";
import { openNotification } from "../../../store/actions/notification";
import setItinerary, {
  deletePoiFromItinerary,
  deleteActivityFromItinerary,
  deleteRestaurantFromItinerary,
  deleteHotelFromItinerary,
} from "../../../store/actions/itinerary";
import { updateStays } from "../../../store/actions/StayBookings";
import { updateTransferBookings } from "../../../store/actions/transferBookingsStore";
import { removeAncillaryBooking } from "../../../store/actions/ancillaryBookings";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";
import { axiosGetPaymentInfo } from "../../../services/itinerary/payment";
import setCart from "../../../store/actions/Cart";
import { setCurrency } from "../../../store/actions/currencyActions";
import setItineraryStatus from "../../../store/actions/itineraryStatus";
import { useAnalytics } from "../../../hooks/useAnalytics";
import {
  FUNNELS,
  reportFunnelStage,
  getChatFunnelScope,
  bindChatFunnelScope,
} from "../../../services/analyticsFunnel";
import BotLoginModal from "./BotLoginModal";
import { updateIntakeForm } from "../../../store/actions/intakeForm";
import { updatePricingForm } from "../../../store/actions/pricingForm";
import IntakeFormCard from "./IntakeForm";
import ThemeIntakeForm from "./ThemeIntakeForm/ThemeIntakeForm";
import { WidgetThemeProvider } from "./WidgetRenderer";
import type {
  ThemeForm,
  ThemeFormSubmission,
} from "../../theme/cinematic/themeForms/types";
import type { IntakeFormState } from "./IntakeForm/types";
import PricingFormCard from "./PricingForm";
import OtpCard from "./IntakeForm/OtpCard";
import { parseFormFields, parseShowIntakeForm, parseIntakeFormWidgetId, isIntakeFormWidgetId, composePartialIntakeContext } from "./IntakeForm/intakePrompt";
import { TOTAL_STEPS } from "./IntakeForm/constants";
import { parseShowPricingForm, parsePricingFormWidgetId, parsePricingCardCopy, isPricingFormWidgetId } from "./PricingForm/pricingPrompt";
import ReleaseItineraryCta from "./ReleaseItineraryCta";
import { isStaffEmail } from "../../../utils/staffUser";

const PAGINATION_SCROLL_THRESHOLD = 80;
const CHATKIT = CHATKIT_HOST;

export interface AttachmentFile {
  /** Temporary local ID (before server responds) or server-assigned ID */
  id: string;
  name: string;
  size: number;
  mimeType: string;
  /** uploading → uploaded → error */
  status: "uploading" | "uploaded" | "error";
  file: File;
}

const LoginButton = styled.button`
  width: 136px;
  height: 44px;
  background: #f7e700;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  color: #111;
  font-family: "Inter", sans-serif;
  font-weight: 600;
`;

// The Kaira mock's chip: a hairline white pill in ink text, sitting directly
// above the composer pill it feeds. This used to be a phone-only override on a
// squarer grey Montserrat chip; desktop now gets the same pill, so the quick
// replies read as one control across breakpoints instead of two designs.
const SingleChips = styled.button`
  border-radius: 999px;
  padding: 8px 13px;
  border: 1px solid #dcdfe5;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 500;
  font-size: 11.5px;
  background: #fff;
  color: #0b1220;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Pointer devices only — a phone has no hover state to give, and tying this
     to a width breakpoint is what split the two designs in the first place. */
  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: #fafaf5;
      border-color: #c9ced8;
    }
  }
`;

// Placeholder chip rendered in the quick-reply row while the
// `quick_reply_shimmer` client effect is active (server is preparing the next
// batch of suggestions). Matches SingleChips dimensions so the row doesn't
// jump when real replies land.
const QuickReplyShimmerChip: React.FC<{ width: string }> = ({ width }) => (
  <div
    aria-hidden="true"
    style={{
      width,
      height: 33,
      borderRadius: 999,
      border: "1px solid #f3f4f6",
      background:
        "linear-gradient(90deg, #f9fafb 0%, #f3f4f6 50%, #f9fafb 100%)",
      backgroundSize: "200% 100%",
      animation: "quickReplyShimmer 1.4s ease-in-out infinite",
      flexShrink: 0,
    }}
  >
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes quickReplyShimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    ` }} />
  </div>
);

interface QuickReply {
  label: string;
  value?: string;
}

export interface CityEndpoint {
  name: string;
  gmaps_place_id: string;
}

export interface RouteEndpoints {
  start_city: CityEndpoint | null;
  end_city: CityEndpoint | null;
}

/** Effect names meaning "the completion process has been announced".
 *
 *  The backend renamed `start_itinerary_completion_process` to
 *  `itinerary_completion_process_started`, so both are accepted: the live
 *  stream can carry either during the deploy, and — more importantly —
 *  threads already stored carry the OLD name in their persisted
 *  `itinerary_effects`, which loadThread replays on every restore. Dropping
 *  the old name would break restore for every existing thread. */
export const COMPLETION_STARTED_EFFECTS = [
  "itinerary_completion_process_started",
  "start_itinerary_completion_process",
] as const;

/** The panel's own sendMessage, as handed to the host via `onSendReady`. The
 *  host needs the whole signature, not just the text: a prompt seeded from a
 *  theme page rides along as `intakePayload` (+ `formSubmitted`) so it reaches
 *  /chatkit in the themed mini-form's request shape. */
export type ChatSendFn = (
  text: string,
  attachmentIds?: string[],
  attachmentMeta?: MessageAttachment[],
  opts?: { formSubmitted?: boolean; intakePayload?: Record<string, unknown> },
) => void;

interface ChatKitPanelProps {
  onLocationReceived: (locationData: { data: Location[] }) => void;
  onRouteReceived: (routeData: { data: Location[] }) => void;
  onNewQuery: () => void;
  onClearMap?: (data?: Record<string, unknown>) => void;
  onItineraryReceived: (itineraryData: unknown) => void;
  /** Fired when shimmer_day_by_day / display_itinerary / display_transfers
   *  deliver start/end city info. Falls back to the user's current location
   *  when the effect omits either endpoint. */
  onRouteEndpointsReceived?: (endpoints: RouteEndpoints) => void;
  botMode?: BotMode;
  itineraryId?: string;
  onBotModeChange?: (mode: BotMode) => void;
  onItineraryIdChange?: (id: string) => void;
  initialPrompt?: string | null;
  /** When true and the user is not logged in, the initialPrompt is queued as
   *  the post-login message and a login/signup CTA is shown instead of being
   *  auto-sent. Used by BotApp's restore flow so unauthenticated reloads of a
   *  finished P2 trip don't fire a "Hey Kaira!" summary request. */
  initialPromptRequiresLogin?: boolean;
  initialAttachmentIds?: string[];
  /** Files handed off from the homepage hero chat input. On mount, fed into
   *  `handleFilesSelected` so they upload through the regular attachment
   *  flow and appear in the composer's attachment row. */
  initialFiles?: File[];
  /** Pre-fills the composer text (NOT auto-sent). Used in tandem with
   *  `initialFiles` so the user can review the hero seed + uploaded
   *  attachment before sending the first message. */
  initialInputText?: string | null;
  onSendReady?: (sendFn: ChatSendFn) => void;
  onItineraryCompletionStart?: (itineraryId: string) => void;
onItineraryCompletionDone?: (itineraryId: string, summary?: string) => void;
onItineraryRefresh?: (itineraryId: string) => void;
onLoadRouteOnMap?: () => void;
restoredThread?: any;
onInitialPromptConsumed?: () => void;
sessionId?: string;
/** Fired when the chat session id changes in place (e.g. after a clone re-keys
 *  the session to the cloned itinerary_id). Lets the parent keep
 *  activeChatSessionId in sync with the URL so browser back/forward detects the
 *  session change instead of treating it as the same session. */
onSessionChange?: (sessionId: string) => void;
isItineraryCompleting?: boolean;
itineraryCompleted?: boolean;
/** Fired when a Make Payment CTA is clicked inside a chat widget. */
onPaymentStart?: () => void;
/** Static traveller-story intro rendered inside the chat. When present, the
 *  detail card is shown above real messages and its CTAs send the
 *  corresponding prompt through the /chatkit p1 API. Not posted to the bot. */
travellerStory?: TravellerStoryIntro | null;
onTravellerStoryDismiss?: () => void;
/** Mobile-only: rendered to the right of "Chat with Kaira" in the top bar.
 *  Lets BotApp inject MobileHeaderMenu so the chat tab can drop the global
 *  MobileHeader without losing the history/new-chat/profile actions. */
mobileMenu?: React.ReactNode;
/** Mobile-only: false when the chat tab is hidden behind another tab
 *  (e.g. user switched to map/itinerary). When this transitions back to true
 *  while a stream produced new content under the hood, snap scroll to bottom
 *  so the message rendered during the hidden interval is visible without a
 *  page refresh. Defaults to true (desktop / always-visible callers). */
isPanelVisible?: boolean;
onLoginSuccess?: () => void | Promise<void>;
/** Themed-page flag forwarded as `login_mandatory` on the very first
 *  /chatkit request (threads.create). When undefined, the field is omitted
 *  from the body. Subsequent messages never include it. */
loginMandatory?: boolean;
/** Theme-page hand-off (see heroChatHandoff): the items the reader saved on a
 *  /theme landing and the theme slug. Forwarded as `items` / `slug` on the very
 *  first /chatkit request only; omitted when empty. */
themeItems?: ThemeSelectedItem[];
themeSlug?: string;
// Free text typed into the theme page's ask-bar before "Build trip".
themeNote?: string;
/** Structured `intake` payload composed by the theme page when it seeded this
 *  chat — slug, which surface fired it, the reader's words or the canned prompt
 *  behind the card, and the saved items (see theme/cinematic/themeIntake.ts).
 *  Sent as `intake` on the seeded first /chatkit request, so a hero / ask-bar /
 *  card send uses the same request shape as the themed mini-form's submission.
 *  Absent on the "Build trip" route, where the form composes its own. */
themeIntake?: Record<string, unknown>;
/** Themed theme-page mini-form config (date windows + pax presets). When set
 *  together with `startThemedForm`, a themed 2-section form card is injected
 *  into the chat on mount instead of the 4-step intake. Nothing fires to
 *  /chatkit until the reader submits it. */
themeForm?: ThemeForm | null;
startThemedForm?: boolean;
/** Mobile-only: invoked when the user taps the "View Itinerary" CTA rendered
 *  below the composer in P2 mode (or once a display_itinerary effect has fired
 *  in this thread). Used by BotApp to switch the mobile tab to the itinerary
 *  view. */
onViewItinerary?: () => void;
/** Patches just the Traveller Type (pax) and/or Date of Travelling on the
 *  current trip. Fired by the `update_pax` / `update_travel_date` client
 *  effects so the P1 header reflects edits without rebuilding the itinerary. */
onTripMetaUpdate?: (meta: {
  number_of_adults?: number;
  number_of_children?: number;
  number_of_infants?: number;
  travel_date?: string;
}) => void;
/** Fired when the backend `form_fields` effect arrives on the first prompt.
 *  Lets BotApp flip the left panel to the intake hero image panel. */
onIntakeFormStart?: () => void;
/** When true, inject an empty in-chat intake form on mount (no backend
 *  `form_fields` effect needed). Set when the user lands on /chat from a
 *  "Plan with Kaira" CTA (`?intake=1`). */
startEmptyIntake?: boolean;
}

export interface TravellerStoryIntro {
  id: number;
  name: string;
  tripName: string;
  duration: string;
  groupType: string;
  destinations: string[];
  image: string;
  images?: string[];
  shortDescription: string;
  viewItineraryLink: string;
  rating: number;
  prompt: string;
}

function useUserLocationData() {
  const [userLocationData, setUserLocationData] =
    useState<UserLocationData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const cached = localStorage.getItem("userLocationData");
        if (cached) {
          setUserLocationData(JSON.parse(cached));
          setIsLoadingLocation(false);
          return;
        }
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const { ip } = await ipRes.json();
        const locRes = await fetch(
          `${MERCURY_HOST}/api/v1/geos/search/user_location/?ip=${ip}`,
        );
        const data: UserLocationData = await locRes.json();
        localStorage.setItem("userLocationData", JSON.stringify(data));
        setUserLocationData(data);
      } catch {
        setUserLocationData({
          text: "Unknown Location",
          place_id: "",
          types: [],
          lat: 0,
          long: 0,
          country: "",
          continent: "",
          source: "fallback",
        });
      } finally {
        setIsLoadingLocation(false);
      }
    };
    fetch_();
  }, []);

  return { userLocationData, isLoadingLocation };
}

function getAuthToken(): string | null {
  // localStorage is browser-only; guard so render-time calls don't crash
  // SSR/static-export (this is called in the render body via `reduxToken ?? getAuthToken()`).
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("token") ??
    localStorage.getItem("authToken") ??
    localStorage.getItem("access_token") ??
    null
  );
}

const Spinner = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className="animate-spin"
    style={{ color: "#6b7280" }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      strokeDasharray="60"
      strokeDashoffset="20"
    />
  </svg>
);

const WelcomeState = () => (
  <div className="flex flex-col items-center justify-center h-full px-6 pb-20 select-none">
    <div
      className="w-28 h-28 rounded-full mb-7 flex items-center justify-center shadow-md"
      style={{
        background: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)",
      }}
    >
      <span className="text-5xl" role="img" aria-label="travel">
        🌍
      </span>
    </div>
    <h2
      className="ttw-type-h3 font-semibold text-gray-900 mb-2 tracking-tight"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      Planning a trip today?
    </h2>
    <p className="ttw-type-small text-gray-400 text-center max-w-xs leading-relaxed">
      I'm Kaira — your AI travel companion. Ask me anything about destinations,
      itineraries, routes, or local tips.
    </p>
  </div>
);

// ── Right-panel chat aesthetic (mirrors chat-active-v2.html) ─────────────────
// Scoped class names so they don't collide with global styles. Applied to the
// header, message bubbles, and composer wrap inside ChatKitPanel.
const ChatPanelStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    .kp-root,
    .kp-root *,
    .kp-root *::before,
    .kp-root *::after {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .kp-root .kp-serif,
    .kp-serif {
      font-family: 'Instrument Serif', serif !important;
      font-style: italic;
      font-weight: 400;
      letter-spacing: -0.01em;
    }
    .kp-header {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 20px;
      border-bottom: 1px solid #ececec;
      background: #fff;
      flex-shrink: 0;
    }
    /* Phone: the bar collapses out of the column as the reader scrolls down
       (see headerHidden), handing its ~62px to the thread. max-height rather
       than display:none so it animates and so the natural height still wins
       when open. */
    @media (max-width: 768px) {
      .kp-header {
        overflow: hidden;
        max-height: 140px;
        transition: max-height 0.24s cubic-bezier(.2,.7,.3,1),
                    padding 0.24s cubic-bezier(.2,.7,.3,1),
                    opacity 0.16s ease;
      }
      .kp-header.is-hidden {
        max-height: 0;
        padding-top: 0;
        padding-bottom: 0;
        opacity: 0;
        border-bottom-color: transparent;
      }
    }
    .kp-header-ava {
      position: relative;
      width: 38px; height: 38px;
      border-radius: 50%;
      background: linear-gradient(180deg, #a8d2f5, #7ab8e8);
      overflow: hidden;
      border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(11,18,32,0.12);
      flex-shrink: 0;
    }
    .kp-header-ava img { width: 100%; height: 100%; object-fit: cover; }
    .kp-header-ava .kp-dot {
      position: absolute;
      bottom: 1px; right: 1px;
      width: 11px; height: 11px;
      background: #4ade80;
      border: 2px solid #fff;
      border-radius: 50%;
      animation: kpBlink 2s infinite;
    }
    @keyframes kpBlink { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
    .kp-header-info { flex: 1; min-width: 0; }
    .kp-header-name {
      font-size: 14px; font-weight: 700; color: #0b1220; line-height: 1.2;
    }
    .kp-header-status {
      font-size: 11px; color: #1f8a5a; font-weight: 600;
      display: flex; align-items: center; gap: 5px; margin-top: 1px;
    }
    .kp-header-status.thinking { color: #e85a4f; }
    .kp-header-status.thinking::before {
      content: ''; width: 5px; height: 5px;
      background: #e85a4f; border-radius: 50%;
      animation: kpStageDot 1.2s infinite;
    }
    @keyframes kpStageDot {
      0%,100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.7); }
    }
    /* The composer floats rather than sitting in a ruled tray: no top border,
       and the separation from the thread comes entirely from the pill's own
       drop shadow (see MessageInputBox .kp-row). Padding is a touch roomier
       than the ruled version so the shadow has somewhere to fall. */
    .kp-composer-wrap {
  padding: 10px 10px 10px;
  background: #fff;
}
@media (max-width: 768px) {
  .kp-composer-wrap {
    padding: 10px 12px 12px;
  }
}
    /* ── Itinerary progress card (chat) ─────────────────────────────────── */
    .sn-card {
      margin: 8px 0 14px;
      animation: snIn 0.4s cubic-bezier(0.2,0.7,0.3,1);
    }
    /* The scroll container only carries 4px of side padding on mobile, and the
       card — unlike a message bubble — has no avatar gutter to inset it, so it
       would otherwise sit flush against the edge. */
    @media (max-width: 768px) {
      .sn-card { margin: 8px 8px 14px; }
    }
    @keyframes snIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .sn-title {
      font-size: 17px; font-weight: 700; color: #0f1a2e;
      letter-spacing: -0.01em; line-height: 1.2; margin: 0 0 14px;
    }
    .sn-title em {
      font-family: 'Instrument Serif', Georgia, serif;
      font-style: italic; font-weight: 400; letter-spacing: 0.01em;
    }
    .sn-steps { list-style: none; display: flex; flex-direction: column; gap: 10px; padding: 0; margin: 0; }
    .sn-row {
      display: flex; align-items: center; gap: 13px;
      padding: 15px 18px;
      background: #FBF8EF;
      border: 1px solid rgba(15,26,46,0.07);
      border-radius: 16px 5px 16px 5px;
      opacity: 0; transform: translateY(6px);
      animation: snRowIn 0.5s cubic-bezier(0.3,0.7,0.3,1) forwards;
    }
    @keyframes snRowIn { to { opacity: 1; transform: translateY(0); } }
    .sn-ic {
      flex: none; width: 22px; height: 22px; border-radius: 50%;
      display: grid; place-items: center;
    }
    .sn-ic-done { background: #0f1a2e; color: #f7e700; }
    .sn-ic-done svg { display: block; width: 12px; height: 12px; }
    /* Live step — ink ring with a yellow halo breathing outwards. */
    .sn-ic-live {
      box-shadow: inset 0 0 0 2px #0f1a2e, 0 0 0 0 rgba(247,231,0,0.85);
      animation: snLivePulse 1.6s ease-in-out infinite;
    }
    .sn-ic-live::after {
      content: '';
      width: 7px; height: 7px; border-radius: 50%; background: #0f1a2e;
    }
    @keyframes snLivePulse {
      0%,100% { box-shadow: inset 0 0 0 2px #0f1a2e, 0 0 0 0 rgba(247,231,0,0.8); }
      50% { box-shadow: inset 0 0 0 2px #0f1a2e, 0 0 0 7px rgba(247,231,0,0); }
    }
    .sn-txt { font-size: 14.5px; font-weight: 600; line-height: 1.3; color: #0f1a2e; }
    .sn-row-done .sn-txt { color: rgba(15,26,46,0.55); }
    /* Placeholder row — polling started but no step line has arrived yet. */
    .sn-skel {
      height: 10px; width: 60%; border-radius: 999px;
      background: linear-gradient(90deg, rgba(15,26,46,0.08), rgba(15,26,46,0.16), rgba(15,26,46,0.08));
      background-size: 200% 100%;
      animation: snSkel 1.3s ease-in-out infinite;
    }
    @keyframes snSkel {
      from { background-position: 200% 0; }
      to { background-position: -200% 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .sn-row { animation: none; opacity: 1; transform: none; }
      .sn-ic-live { animation: none; }
    }
  ` }} />
);

/**
 * StatusNotesCard
 * Renders the progress signals coming from the /status/ poll inside the chat
 * as a stepped list: every step the server has already moved past shows an
 * ink check, the newest one pulses, and the list stays pinned once the build
 * settles.
 *
 * Steps come from `displayText` only — the rolling status string ("Crafting
 * your day by day itinerary", …). The `notes` array is *not* rendered: its
 * lines are server bookkeeping, and the BottomCTA loader in BotApp leaves them
 * out for the same reason. It is still consumed as a signal — an empty `notes`
 * snapshot means the server has no further steps coming, so the pulse stops.
 */
interface StatusNotesCardProps {
  /** Completion signal only — never rendered. See the note above. */
  notes: any[] | undefined;
  displayText?: string | null | undefined;
  isPolling: boolean;
  cycleKey: string;
  /** Identifier for the most recent user message. When this changes the
   *  card resets and disappears — the user has moved on to a new turn. */
  resetKey?: string | null;
  /** Card heading, split so the trailing word renders in the serif italic
   *  accent the rest of the bot UI uses. Defaults to the edit/update copy;
   *  creation passes build-specific copy. */
  title?: string;
  titleAccent?: string;
}
const StatusNotesCard: React.FC<StatusNotesCardProps> = ({
  notes,
  displayText,
  isPolling,
  cycleKey,
  resetKey,
  title = "Kaira is working on your",
  titleAccent = "changes",
}) => {
  const [steps, setSteps] = useState<string[]>([]);
  const [loaderActive, setLoaderActive] = useState<boolean>(true);
  // Set when the user kicks off a new turn — suppresses the card until the
  // next polling cycle (or fresh data) revives it.
  const [dismissed, setDismissed] = useState<boolean>(false);
  const prevNotesKeyRef = useRef<string>("");
  // Every line shown this cycle, so a display_text value that repeats across
  // polls doesn't add a duplicate row.
  const seenLinesRef = useRef<Set<string>>(new Set());
  const cycleRef = useRef<string>(cycleKey);

  // New polling cycle → reset everything (and revive the card if it was
  // dismissed by a prior user turn).
  useEffect(() => {
    if (cycleRef.current === cycleKey) return;
    cycleRef.current = cycleKey;
    setSteps([]);
    setLoaderActive(true);
    setDismissed(false);
    prevNotesKeyRef.current = "";
    seenLinesRef.current = new Set();
  }, [cycleKey]);

  // New user message → dismiss the card. The user has moved on, so any
  // previously-pinned status should disappear and not bleed into the new
  // turn. Stays dismissed until the next polling cycle bumps `cycleKey`.
  const prevResetKeyRef = useRef<string | null | undefined>(resetKey);
  useEffect(() => {
    if (prevResetKeyRef.current === resetKey) return;
    prevResetKeyRef.current = resetKey;
    setSteps([]);
    setLoaderActive(false);
    setDismissed(true);
    prevNotesKeyRef.current = "";
    seenLinesRef.current = new Set();
  }, [resetKey]);

  // An empty `notes` snapshot is the server saying "no more steps" — stop the
  // pulse and freeze the list. The lines themselves are never rendered.
  useEffect(() => {
    const count = Array.isArray(notes) ? notes.length : 0;
    const key = String(count);
    if (key === prevNotesKeyRef.current) return;
    prevNotesKeyRef.current = key;
    if (count === 0) {
      setLoaderActive(false);
      return;
    }
    setLoaderActive(true);
  }, [notes]);

  // Each new display_text value becomes the next step row; the one before it
  // flips to done.
  useEffect(() => {
    const txt = typeof displayText === "string" ? displayText.trim() : "";
    if (!txt || seenLinesRef.current.has(txt)) return;
    seenLinesRef.current.add(txt);
    setSteps((prev) => [...prev, txt]);
    setLoaderActive(true);
  }, [displayText]);

  // Polling ended without an empty-notes signal → still stop the pulse.
  useEffect(() => {
    if (!isPolling) setLoaderActive(false);
  }, [isPolling]);

  // `cycleKey === "init"` means the parent component hasn't observed a
  // polling false→true transition yet (i.e. no update was triggered in
  // this session). Stay invisible — guards against the card popping up in
  // unrelated chats or after a page refresh just because Redux's
  // `is_polling` flag is still set from a prior session.
  if (cycleKey === "init") return null;
  if (dismissed) return null;
  if (steps.length === 0 && !isPolling) return null;

  // The newest step is the live one while the build is still running; once it
  // settles every row reads as done.
  const lastIdx = steps.length - 1;

  return (
    <div className="sn-card">
      <p className="sn-title">
        {title} <em>{titleAccent}</em>
      </p>
      <ul className="sn-steps">
        {steps.map((step, i) => {
          const live = loaderActive && i === lastIdx;
          return (
            <li
              className={`sn-row${live ? "" : " sn-row-done"}`}
              key={`${i}-${step}`}
              style={{ animationDelay: `${Math.min(i, 4) * 0.1}s` }}
            >
              <span className={`sn-ic ${live ? "sn-ic-live" : "sn-ic-done"}`}>
                {live ? null : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M5 12.5l4 4 10-10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="sn-txt">{step}</span>
            </li>
          );
        })}
        {/* First poll hasn't produced a step line yet — hold the row shape. */}
        {steps.length === 0 && loaderActive && (
          <li className="sn-row" aria-label="Loading next step">
            <span className="sn-ic sn-ic-live" />
            <span className="sn-skel" />
          </li>
        )}
      </ul>
    </div>
  );
};

export function ChatKitPanel({
  onLocationReceived,
  onNewQuery,
  onClearMap,
  onRouteReceived,
  onItineraryReceived,
  onRouteEndpointsReceived,
  botMode = "p1",
  itineraryId = "",
  onBotModeChange,
  onItineraryIdChange,
  initialPrompt = null,
  initialPromptRequiresLogin = false,
  initialAttachmentIds,
  initialFiles,
  initialInputText,
  onSendReady,
  onItineraryCompletionStart,
onItineraryCompletionDone,
onItineraryRefresh,
  onLoadRouteOnMap,
restoredThread,
onInitialPromptConsumed,
sessionId: propSessionId,
onSessionChange,
isItineraryCompleting = false,
itineraryCompleted = false,
onPaymentStart,
travellerStory = null,
onTravellerStoryDismiss,
mobileMenu,
isPanelVisible = true,
onLoginSuccess,
loginMandatory,
themeItems,
themeSlug,
themeNote,
themeIntake,
themeForm,
startThemedForm = false,
onViewItinerary,
onTripMetaUpdate,
onIntakeFormStart,
startEmptyIntake = false,
}: ChatKitPanelProps) {
  // ── State ────────────────────────────────────────────────────────────────
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("high");
  const [localItineraryId, setLocalItineraryId] = useState(itineraryId);
  const [showControls, setShowControls] = useState(false);
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  // True while the server has signalled (via `quick_reply_shimmer`) that quick
  // replies are being computed but haven't arrived yet — renders skeleton chips
  // in place of the real ones until `load_quick_replies` lands.
  const [quickReplyShimmer, setQuickReplyShimmer] = useState(false);
  const [quickReplyLoading, setQuickReplyLoading] = useState(false);
  // Mirror the full quick-reply phase — the shimmer skeleton *and* the loaded
  // chips — in a ref so the stable sendMessage wrapper can tell, at call time,
  // whether a send needs to interrupt the quick-reply tail of an otherwise-
  // finished stream. The answer text is already rendered throughout this window
  // (only the quick replies keep the SSE open), so a new send must abort that
  // tail rather than be dropped by the hook's in-flight guard. Covering the
  // loaded-chips case too fixes sends that were silently dropped when the user
  // typed a fresh query after the chips had already arrived.
  const inQuickReplyPhaseRef = useRef(false);
  inQuickReplyPhaseRef.current = quickReplyShimmer || quickReplies.length > 0;
  // Guards the in-chat intake form so the `form_fields` effect injects the card
  // only once per session even if the effect re-emits across stream chunks.
  const intakeFormInjectedRef = useRef(false);
  // Themed theme-page mini-form: keep the config in a ref so the render/submit
  // callbacks read the latest without re-subscribing, and a one-shot inject guard.
  const themeFormRef = useRef<ThemeForm | null>(themeForm ?? null);
  themeFormRef.current = themeForm ?? null;
  const themedFormInjectedRef = useRef(false);
  // The theme page's `intake` payload for the seeded first message. Held in a
  // ref so the initialPrompt effect reads the current value without listing it
  // as a dependency (the effect is one-shot and guarded by hasProcessedInitial).
  const themeIntakeRef = useRef<Record<string, unknown> | undefined>(themeIntake);
  themeIntakeRef.current = themeIntake;
  // Same one-shot guard for the in-chat pricing form card.
  const pricingFormInjectedRef = useRef(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [postLoginLoading, setPostLoginLoading] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  // True once any display_itinerary effect has fired in this thread (live
  // stream or replayed from restoredThread.itinerary_effects). Drives the
  // mobile "View Itinerary" CTA below the composer alongside botMode === "p2".
  const [hasDisplayItinerary, setHasDisplayItinerary] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);


    // ── Auth ─────────────────────────────────────────────────────────────────
  const reduxToken = useSelector((state: any) => state.auth.token);
  const reduxUserId = useSelector((state: any) => state.auth.id);
  const reduxEmail = useSelector((state: any) => state.auth.email);
  const reduxUserName = useSelector((state: any) => state.auth.name);
  const itinerary = useSelector((state: any) => state.Itinerary);
  const callPaymentInfo = useSelector((state: any) => state.CallPaymentInfo);
  // Lock the composer whenever an update/edit action (Update Dates,
  // Route Edit, refresh_itinerary, Reprice) is mid-poll. Cleared once
  // every itinerary status resolves to SUCCESS or FAILURE.
  const isItineraryPolling = useSelector(
    (state: any) => !!state.ItineraryStatus?.is_polling,
  );
  // Streamed progress signals from the /status/ poll. Two parallel fields:
  //   - `notes`: server bookkeeping lines. Not rendered anywhere — an empty
  //     snapshot is only read as "no more steps coming".
  //   - `display_text`: a single rolling status string ("Crafting day by day…").
  //     This is what StatusNotesCard turns into step rows, same as the
  //     BottomCTA loader in BotApp.
  const statusNotes = useSelector(
    (state: any) => state.ItineraryStatus?.notes as any[] | undefined,
  );
  const statusDisplayText = useSelector(
    (state: any) => state.ItineraryStatus?.display_text as string | null | undefined,
  );
  // Bump whenever polling transitions false → true so StatusNotesCard resets
  // to a fresh batch list per update cycle (Update Dates, Route Edit, …).
  //
  // Important: only observe transitions that happen *after* the component
  // mounts. ItineraryStatus lives in global Redux, so on a fresh mount —
  // e.g. user navigates into a different chat, or refreshes the page mid-
  // poll — `is_polling` may already be true from a prior session. Without
  // this guard the card would re-appear in every chat that didn't actually
  // trigger an update. `prevPollingRef` starts as `null` so the first
  // effect run only captures state without firing a cycle bump.
  const [pollingCycleKey, setPollingCycleKey] = useState<string>("init");
  const prevPollingRef = useRef<boolean | null>(null);
  useEffect(() => {
    if (prevPollingRef.current === null) {
      prevPollingRef.current = isItineraryPolling;
      return;
    }
    if (isItineraryPolling && !prevPollingRef.current) {
      setPollingCycleKey(`cycle-${Date.now()}`);
    }
    prevPollingRef.current = isItineraryPolling;
  }, [isItineraryPolling]);
  // The in-chat intake form renders as a card in the thread. It NEVER blocks the
  // message box or quick replies, whatever its source (client-injected landing
  // form or backend-streamed intake widget): the user can always fill the form
  // OR just start typing. Proceeding with chat retires the form + greeting
  // bubbles (see sendMessage).
  const intakeFormActive = useSelector((s: any) => !!s.IntakeForm?.active);
  const intakeFormCompleted = useSelector((s: any) => !!s.IntakeForm?.completed);
  // Full slice, mirrored into a ref — used to snapshot the currently-shown
  // intake card when a newer intake-form widget arrives (see
  // handleIntakeFormWidget) so the old card freezes instead of re-tracking the
  // live slice the new card takes over.
  const intakeFormSlice = useSelector((s: any) => s.IntakeForm);
  // A destination already seeded into the intake slice (e.g. the hero "Start
  // planning" CTA's `?destination=` param) — used to open the empty intake form
  // straight on the "When" step instead of the already-answered destination step.
  const intakePrefillDestinationName = useSelector(
    (s: any) => s.IntakeForm?.destination?.name || "",
  );
  const isComposerLocked =
    isItineraryCompleting ||
    isItineraryPolling;
  const authToken = reduxToken ?? getAuthToken();
  const isLoggedIn = !!authToken;

  // ── Itinerary ownership gate ──────────────────────────────────────────────
  // A logged-in user who opens SOMEONE ELSE's itinerary must not be able to
  // chat or fire quick replies. Staff (email ending in @tarzanway.com) bypass
  // this and can chat on any itinerary. Ownership mirrors ItineraryCloneCta:
  // match by customer id, with a customer_name fallback for bot payloads that
  // omit `customer`.
  //
  // P1 / draft stage has no itinerary in Redux yet, so the owner is only known
  // from the thread get_by_id payload (`restoredThread.user_id` /
  // `customer_name`). We fall back to those thread-level fields. When the thread
  // detail carries NO `user_id` (anonymous / unowned thread) there is no owner
  // to enforce, so we never block.
  const threadOwnerId =
    restoredThread?.user_id != null && restoredThread.user_id !== ""
      ? String(restoredThread.user_id)
      : null;
  const threadOwnerName =
    typeof restoredThread?.customer_name === "string"
      ? restoredThread.customer_name.trim()
      : "";
  const ownerId = itinerary?.customer ?? threadOwnerId;
  const ownerName =
    typeof itinerary?.customer_name === "string" && itinerary.customer_name.trim()
      ? itinerary.customer_name.trim()
      : threadOwnerName;
  const hasOwner = ownerId != null || !!ownerName;
  const isItineraryOwner =
    isLoggedIn &&
    ((ownerId != null && String(reduxUserId ?? "") === String(ownerId)) ||
      (!!reduxUserName &&
        !!ownerName &&
        reduxUserName.trim().toLowerCase() === ownerName.toLowerCase()));
  const isStaffUser = isStaffEmail(reduxEmail);

  // True when a logged-in, non-staff user is viewing another person's
  // itinerary — block the composer and quick replies in that case.
  const isForeignItinerary =
    isLoggedIn && hasOwner && !isItineraryOwner && !isStaffUser;

  // Widget messages whose CTAs should render disabled. Populated when a user
  // clicks a CTA (to prevent double-submission while the server processes the
  // action) and when thread history loads (past interactions are frozen).
  const [disabledWidgetIds, setDisabledWidgetIds] = useState<Set<string>>(
    () => new Set(),
  );
  const markWidgetDisabled = useCallback((id: string) => {
    if (!id) return;
    setDisabledWidgetIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // ── Per-message thumbs-up / thumbs-down feedback ─────────────────────────
  // Keyed by assistant message id. Null = no feedback yet. The feedbackId is
  // returned by POST /feedback and is required for subsequent change/delete.
  const [feedbackByMessageId, setFeedbackByMessageId] = useState<
    Record<string, { feedbackId: string; type: "up" | "down" }>
  >({});
  // Per-message loading flag so we can disable both icons while a request is
  // in flight (prevents racing POST → PATCH → DELETE clicks).
  const [feedbackLoadingIds, setFeedbackLoadingIds] = useState<Set<string>>(
    () => new Set(),
  );

  const dispatch = useDispatch();
  const router = useRouter();
  const isDesktopViewport = useMediaQuery("(min-width:767px)");

  // ── "Create my version" (clone) — logged-in CTA on another user's itinerary ──
  // The CTA opens a popup (CloneItinerary form) that collects start/end
  // location, dates and pax, then calls get-my-itinerary. On success we keep the
  // user in-page and hand the new id to the SAME build pipeline the bot uses
  // (skeleton → /{id}/status/ polling → load) via onItineraryCompletionStart/Done.
  const [showCloneModal, setShowCloneModal] = useState(false);
  // Clone CTA visibility gate. The CTA is only meaningful on another user's
  // *finalized* (P2) itinerary — it stays hidden in P1 / Draft stages. In P2 it
  // is shown once per page load: the moment the viewer initiates a new chat turn
  // it is suppressed for the rest of the session, so it doesn't re-appear below
  // every subsequent message. A page refresh resets this back to false.
  const [cloneCtaSuppressed, setCloneCtaSuppressed] = useState(false);
  // handleCloneSuccess is defined after useChat (it depends on clearMessages /
  // threadIdRef / sessionIdRef) — see below.

  // Shared helper for drawer CTAs opened from chat widgets. The chat flow
  // used to round-trip through sendWidgetAction("*.add", …); we now call the
  // real booking API directly so the itinerary updates without depending on
  // the p2 chatkit handler. Success / failure is surfaced via the standard
  // notification store.
  const postBookingAction = useCallback(
    async (
      path: string,
      body: Record<string, unknown>,
      successText: string,
    ): Promise<any | null> => {
      if (!localItineraryId) return null;
      if (!authToken) {
        setShowLoginModal(true);
        return null;
      }
      try {
        const res = await axios.post(
          `${MERCURY_HOST}/api/v1/itinerary/${localItineraryId}/${path}`,
          body,
          { headers: { Authorization: `Bearer ${authToken}` } },
        );
        dispatch(
          openNotification({
            type: "success",
            text: successText,
            heading: "Success!",
          }),
        );
        return res?.data ?? null;
      } catch (err: any) {
        console.error("[Chat drawer booking] error:", err);
        const msg =
          err?.response?.data?.errors?.[0]?.message?.[0] ||
          err?.message ||
          "Something went wrong. Please try again.";
        dispatch(
          openNotification({
            type: "error",
            text: msg,
            heading: "Error!",
          }),
        );
        return null;
      }
    },
    [localItineraryId, authToken, dispatch],
  );

  // Mirrors getPaymentInfo() in ItineraryContainer.jsx — fetches /cart/ for
  // the current itinerary and pushes the result into Redux (cart + currency +
  // pricing_status). Passed to TransferEditDrawer so the drawer can refresh
  // the cart after a booking completes, matching the /itinerary page flow.
  const getPaymentInfo = useCallback(async () => {
    if (!localItineraryId) return;
    const token = localStorage.getItem("access_token");
    try {
      const res = await axiosGetPaymentInfo.get(`${localItineraryId}/cart/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      dispatch(setCart(data));
      dispatch(setCurrency(data?.currency));
      dispatch(setItineraryStatus("pricing_status", "SUCCESS"));
    } catch (error) {
      console.log("ERROR[PaymentInfo][Itinerary]", error);
      dispatch(setCart({ error: true }));
    }
  }, [localItineraryId, dispatch]);

  // Mirrors updatedActivityBooking() in ActivityDetailsDrawer.jsx: after the
  // /bookings/activity/ POST returns, splice the new booking into the city's
  // activities list and the matching day_by_day slab so the itinerary view
  // refreshes without waiting for a full refetch.
  const applyActivityBookingToItinerary = useCallback(
    (bookingData: any, itineraryCityId: string | undefined) => {
      if (!bookingData || !itineraryCityId || !itinerary?.cities) return;

      const formatTime = (time24?: string) => {
        if (!time24) return null;
        const [hours, minutes] = time24.split(":");
        const hour = parseInt(hours, 10);
        if (isNaN(hour)) return null;
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${hour12}:${minutes}`;
      };

      const bookingDate = bookingData?.check_in?.split(" ")?.[0] ?? null;

      const newCities = itinerary.cities.map((city: any) => {
        if (city?.id !== itineraryCityId) return city;
        const updatedActivities = [...(city?.activities || []), bookingData];

        const slabElement = {
          activity: bookingData?.activity?.id,
          booking: {
            id: bookingData?.id,
            pax:
              (bookingData?.number_of_adults || 0) +
              (bookingData?.number_of_children || 0) +
              (bookingData?.number_of_infants || 0),
            duration: bookingData?.duration,
          },
          element_type: "activity",
          heading:
            bookingData?.activity_data?.display_name ||
            bookingData?.activity?.name,
          icon: bookingData?.image,
          poi: null,
          tags: bookingData?.activity_data?.tags || [],
          rating: bookingData?.activity?.rating,
          user_ratings_total: bookingData?.activity?.user_ratings_total,
          start_time:
            formatTime(bookingData?.check_in?.split(" ")?.[1]) || null,
          end_time:
            formatTime(bookingData?.check_out?.split(" ")?.[1]) || null,
        };

        const updatedDayByDay = city?.day_by_day?.map((day: any) => {
          if (day?.date === bookingDate) {
            return {
              ...day,
              slab_elements: [...(day?.slab_elements || []), slabElement],
            };
          }
          return day;
        });

        return {
          ...city,
          activities: updatedActivities,
          day_by_day: updatedDayByDay,
        };
      });

      dispatch(setItinerary({ ...itinerary, cities: newCities }));
      dispatch(SetCallPaymentInfo(!callPaymentInfo));
    },
    [itinerary, callPaymentInfo, dispatch],
  );

  // POI / restaurant booking: mirrors NewPoiDetailsDrawer's local-state
  // patch — append the response slab element into the matched day_by_day
  // bucket. Prefers a date match when available; falls back to the
  // day_by_day index passed in the request body.
  const applySlabToItinerary = useCallback(
    (
      slabData: any,
      itineraryCityId: string | undefined,
      dateISO: string | undefined,
      dayByDayIndex: number = 0,
    ) => {
      if (!slabData || !itineraryCityId || !itinerary?.cities) return;

      const newCities = itinerary.cities.map((city: any) => {
        if (city?.id !== itineraryCityId) return city;
        const dayByDay = [...(city?.day_by_day || [])];
        let targetIndex = dateISO
          ? dayByDay.findIndex((d) => d?.date === dateISO)
          : -1;
        if (targetIndex < 0) targetIndex = dayByDayIndex;
        if (dayByDay[targetIndex]) {
          dayByDay[targetIndex] = {
            ...dayByDay[targetIndex],
            slab_elements: [
              ...(dayByDay[targetIndex]?.slab_elements || []),
              slabData,
            ],
          };
        }
        return { ...city, day_by_day: dayByDay };
      });

      dispatch(setItinerary({ ...itinerary, cities: newCities }));
      dispatch(SetCallPaymentInfo(!callPaymentInfo));
    },
    [itinerary, callPaymentInfo, dispatch],
  );

  // Hotel add / change: the chat backend may return either a full updated
  // itinerary or just the new booking. If `cities` (or `itinerary.cities`)
  // is present treat it as a replacement; otherwise rely on the
  // CallPaymentInfo toggle to refresh price-aware surfaces.
  const applyHotelMutationToItinerary = useCallback(
    (responseData: any) => {
      if (responseData?.cities && Array.isArray(responseData.cities)) {
        dispatch(setItinerary(responseData));
      } else if (responseData?.itinerary?.cities) {
        dispatch(setItinerary(responseData.itinerary));
      }
      dispatch(SetCallPaymentInfo(!callPaymentInfo));
    },
    [callPaymentInfo, dispatch],
  );

  // Fetch the full itinerary detail and push it into Redux. Called after
  // a successful POI / activity / restaurant add so derived state (the
  // day-by-day buckets, city duration, pricing surfaces) reflects what
  // the backend now has — the optimistic local patches in
  // applySlabToItinerary / applyActivityBookingToItinerary are best-effort.
  const fetchAndApplyItineraryDetail = useCallback(async () => {
    if (!localItineraryId) return;
    try {
      const res = await axios.get(
        `${MERCURY_HOST}/api/v1/itinerary/${localItineraryId}/`,
        authToken
          ? { headers: { Authorization: `Bearer ${authToken}` } }
          : undefined,
      );
      if (res?.data && res.data?.version !== "v1") {
        dispatch(setItinerary(res.data));
      }
    } catch (err) {
      console.error("[fetchAndApplyItineraryDetail] error:", err);
    }
  }, [localItineraryId, authToken, dispatch]);

  // ── Detail Drawer State ─────────────────────────────────────────────────
  const [activityDrawer, setActivityDrawer] = useState<{
    show: boolean;
    activityId?: string;
    date?: string;
    itinerary_city_id?: string;
    source?: string;
  }>({ show: false });

  const [transferDrawer, setTransferDrawer] = useState<{
    show: boolean;
    origin?: any;
    destination?: any;
    check_in?: string;
    routeId?: string;
    booking_type?: string;
    origin_itinerary_city_id?: string;
    destination_itinerary_city_id?: string;
    originCityId?: string;
    destinationCityId?: string;
    city?: string;
    dcity?: string;
    initialMode?: string;
    initialEdgeId?: string;
    isMercury?: boolean;
  }>({ show: false });

  // Selected-transfer working copy the TransferEditDrawer mutates as the user
  // picks a suggestion (edge/iata/mode). Required prop — the drawer calls
  // setSelectedBooking() on select, so omitting it crashes on the first click.
  // Mirrors the state /itinerary threads down into TransferEditDrawer.
  const [selectedBooking, setSelectedBooking] = useState<any>({
    id: null,
    name: null,
  });

  // Lookup map built from display_transfers effects so transfer.select
  // widget actions (which carry only an edge id) can be expanded into the
  // full context TransferEditDrawer needs to skip its mode-selection step.
  const transferEdgeMapRef = useRef<
    Record<
      string,
      {
        mode: string;
        from_city?: string;
        to_city?: string;
        from_city_id?: string;
        to_city_id?: string;
        from_itinerary_city_id?: string;
        to_itinerary_city_id?: string;
        check_in?: string;
      }
    >
  >({});

  // Walk a widget tree and index any transfer.* click action by its id, so
  // TransferEditDrawer can skip its mode-selection step when the user clicks.
  // Handles three shapes:
  //   • transfer.select — legacy, payload carries only { id }; mode inferred
  //     from the nearest Badge.label in the enclosing card.
  //   • transfer.view   — multi-segment payload with segments[]; use the
  //     first segment's mode and capture origin/destination cities.
  //   • transfer.detail — same segment shape as transfer.view.
  const indexEdgesFromWidget = useCallback((widget: any) => {
    if (!widget || typeof widget !== "object") return;
    const visit = (node: any, inheritedMode?: string) => {
      if (!node || typeof node !== "object") return;
      const kids = Array.isArray(node.children) ? node.children : [];
      let scopeMode = inheritedMode;
      for (const c of kids) {
        if (c?.type === "Badge" && typeof c.label === "string") {
          scopeMode = c.label;
        }
      }
      const actionType = node.onClickAction?.type as string | undefined;
      const payload = node.onClickAction?.payload ?? {};
      if (actionType === "transfer.select") {
        const id = payload?.id;
        if (id && !transferEdgeMapRef.current[id]) {
          transferEdgeMapRef.current[id] = { mode: scopeMode || "" };
        } else if (
          id &&
          scopeMode &&
          !transferEdgeMapRef.current[id]?.mode
        ) {
          transferEdgeMapRef.current[id] = {
            ...transferEdgeMapRef.current[id],
            mode: scopeMode,
          };
        }
      } else if (
        actionType === "transfer.view" ||
        actionType === "transfer.detail"
      ) {
        const segments: any[] = Array.isArray(payload.segments)
          ? payload.segments
          : [];
        const firstMode = segments[0]?.mode as string | undefined;
        const dateRaw = (payload.transfer_date ??
          payload.date ??
          payload.startDate) as string | undefined;
        const checkIn = dateRaw ? String(dateRaw).slice(0, 10) : undefined;
        // Index every segment id and the payload id itself.
        const ids = [
          payload.id,
          payload.bookingId,
          payload.booking_id,
          ...segments.map((s) => s?.id ?? s?.transfer_id),
        ].filter(Boolean);
        for (const id of ids) {
          transferEdgeMapRef.current[id as string] = {
            ...transferEdgeMapRef.current[id as string],
            mode: firstMode ?? scopeMode ?? "",
            from_city: payload.from_city as string | undefined,
            to_city: payload.to_city as string | undefined,
            from_city_id: (payload.origin_city_id ??
              payload.originCityId) as string | undefined,
            to_city_id: (payload.destination_city_id ??
              payload.destinationCityId) as string | undefined,
            from_itinerary_city_id: (payload.origin_itinerary_city_id ??
              payload.originItineraryCityId) as string | undefined,
            to_itinerary_city_id: (payload.destination_itinerary_city_id ??
              payload.destinationItineraryCityId) as string | undefined,
            check_in: checkIn,
          };
        }
      }
      for (const c of kids) visit(c, scopeMode);
    };
    visit(widget);
  }, []);

  const indexTransfersForLookup = useCallback((raw: any) => {
    if (!raw) return;
    // Normalise: accept an array of transfers, a { transfers: [...] } wrapper,
    // or a single transfer object with edges[].
    const list: any[] = Array.isArray(raw)
      ? [...raw]
      : Array.isArray(raw?.transfers)
        ? [...raw.transfers]
        : Array.isArray(raw?.data?.transfers)
          ? [...raw.data.transfers]
          : Array.isArray(raw?.edges)
            ? [raw]
            : [];

    // The combo start/end transfers (home → first city, last city → home) are
    // emitted as `start_transfer` / `end_transfer` siblings — not inside the
    // `transfers` array — and each carries its own multi-leg `edges[]`. Index
    // those too, otherwise a transfer.select click on a start/end combo leg in
    // P2 can't resolve its edge context and the drawer falls back to the
    // mode-selection step.
    const st = raw?.start_transfer ?? raw?.data?.start_transfer;
    const et = raw?.end_transfer ?? raw?.data?.end_transfer;
    if (Array.isArray(st?.edges)) list.push(st);
    if (Array.isArray(et?.edges)) list.push(et);

    for (const t of list) {
      const edges = t?.edges ?? [];
      for (const e of edges) {
        if (!e?.id) continue;
        transferEdgeMapRef.current[e.id] = {
          mode: e.mode,
          from_city: t.from_city,
          to_city: t.to_city,
          from_city_id: t.from_city_id,
          to_city_id: t.to_city_id,
          from_itinerary_city_id: t.from_itinerary_city_id,
          to_itinerary_city_id: t.to_itinerary_city_id,
          check_in: e.start_datetime
            ? String(e.start_datetime).slice(0, 10)
            : undefined,
        };
      }
    }
  }, []);

  // Hotel detail drawer (opened from "hotel.view" / "hotel.detail" widget actions).
  // The server can emit either:
  //   • hotel.view    : { id, itineraryCityId, dbCityId, startDate, endDate, bookingId }
  //   • hotel.detail  : { hotelId, itineraryCityId, dbCityId, startDate, endDate, ... }
  // These drive AccommodationDetailDrawer and, in p2 stage, the Add/Change CTA.
  const [hotelDrawer, setHotelDrawer] = useState<{
    show: boolean;
    accommodationId?: string;
    itinerary_city_id?: string;
    dbCityId?: string;
    check_in?: string;
    check_out?: string;
    bookingId?: string;
    cityName?: string;
    source?: string;
    occupancies?: Array<{ num_adults: number; child_ages: number[] }>;
    traceId?: string;
    travclan_hotel_id?: string;
    currency?: string;  
  }>({ show: false });

  // POI / Restaurant detail drawer — opened by place.view / place.detail /
  // restaurant.view / restaurant.detail widget actions. POIDetailsDrawer
  // fetches data based on activityData.type ("poi" | "restaurant").
  const [poiDrawer, setPoiDrawer] = useState<{
    show: boolean;
    id?: string;
    name?: string;
    kind?: "poi" | "restaurant";
    itinerary_city_id?: string;
    date?: string;
  }>({ show: false });

  // Sightseeing (intra-city taxi) drawer — opened by sightseeing.open and
  // pickup_drop.open widget actions. Reuses TransferEditDrawer in multicity
  // mode so the user can browse the same suggestions that the city header's
  // "Add Taxi" CTA surfaces in /itinerary. `initialTab` chooses which of the
  // drawer's internal tabs (sightseeing / airport) to open on mount.
  const [sightseeingDrawer, setSightseeingDrawer] = useState<{
    show: boolean;
    itinerary_city_id?: string;
    cityId?: string;
    cityName?: string;
    cityData?: any;
    startDate?: string;
    endDate?: string;
    initialTab?: "sightseeing" | "airport" | "multicity";
  }>({ show: false });


  // TransferEditDrawer closes itself by calling its internal `actualClose`
  // (a Next router.push that strips the drawer/itinerary_city_id query
  // params) — it never invokes the `handleClose` prop we pass in. Without
  // this listener, our `sightseeingDrawer.show` stays `true` after the
  // close, so a second `sightseeing.open` click only repushes the URL
  // and the inner Drawer's `useEffect([props.show])` doesn't re-fire.
  useEffect(() => {
    if (!sightseeingDrawer.show) return;
    const syncFromUrl = (url: string) => {
      const target = new URL(url, window.location.origin);
      if (target.searchParams.get("drawer") !== "addCityTaxi") {
        setSightseeingDrawer({ show: false });
      }
    };
    router.events.on("routeChangeComplete", syncFromUrl);
    return () => {
      router.events.off("routeChangeComplete", syncFromUrl);
    };
  }, [router, sightseeingDrawer.show]);

  // Transfer edit drawer: URL-driven open/close (the reader for the transfer
  // card CTA). The transfer.* / open_transfer_drawer handler only pushes
  // `?drawer=editTransfer&bookingId=&oItineraryCity=&dItineraryCity=&doj=
  // &initialMode=&initialEdgeId=` so the open drawer is deep-linkable and
  // survives refresh/share — mirroring the /itinerary transfer URL. Without
  // this effect nothing sets `transferDrawer.show`, so the URL updates in the
  // address bar but the drawer never opens. We hydrate the drawer's full
  // context from the query params, reconstructing city/mode metadata from
  // `transferEdgeMapRef` (populated by display_transfers effects) the way the
  // pre-URL handler did, and clear it when the param goes away (the drawer's
  // own actualClose strips `drawer` from the URL on close).
  useEffect(() => {
    const q = router.query;
    // Only react to chat-originated opens (drawerSource === "chat"). The
    // /itinerary VerticalLayout opens its OWN TransferEditDrawer on
    // `drawer=editTransfer` (e.g. its "Add Transfer" CTA) without this marker;
    // reacting to those would stack a second, duplicate drawer.
    if (q.drawer !== "editTransfer" || q.drawerSource !== "chat") {
      setTransferDrawer((prev) => (prev.show ? { show: false } : prev));
      return;
    }
    const edgeId = (q.initialEdgeId as string) || undefined;
    const indexed = edgeId ? transferEdgeMapRef.current[edgeId] : undefined;
    const bookingId = (q.bookingId as string) || undefined;
    const oItineraryCity = (q.oItineraryCity as string) || undefined;
    const dItineraryCity = (q.dItineraryCity as string) || undefined;
    // Hydrate the search context from the URL first (survives refresh / deep-
    // link / share), falling back to the in-memory transferEdgeMapRef only to
    // fill gaps for same-session clicks. Without the URL fallbacks the date and
    // origin/destination stay blank whenever the ref is empty.
    const doj = (q.doj as string) || indexed?.check_in || undefined;
    const oCityId = (q.oCityId as string) || indexed?.from_city_id || undefined;
    const dCityId = (q.dCityId as string) || indexed?.to_city_id || undefined;
    const oCity = (q.oCity as string) || indexed?.from_city || undefined;
    const dCity = (q.dCity as string) || indexed?.to_city || undefined;
    const initialMode = (q.initialMode as string) || indexed?.mode || undefined;

    setTransferDrawer({
      show: true,
      routeId: bookingId,
      check_in: doj,
      booking_type: "oneway",
      initialMode,
      initialEdgeId: edgeId,
      isMercury: true,
      origin: oCityId,
      destination: dCityId,
      originCityId: oCityId,
      destinationCityId: dCityId,
      origin_itinerary_city_id:
        oItineraryCity ?? indexed?.from_itinerary_city_id,
      destination_itinerary_city_id:
        dItineraryCity ?? indexed?.to_itinerary_city_id,
      city: oCity,
      dcity: dCity,
    });
  }, [
    router.query.drawer,
    router.query.drawerSource,
    router.query.bookingId,
    router.query.oItineraryCity,
    router.query.dItineraryCity,
    router.query.doj,
    router.query.oCityId,
    router.query.dCityId,
    router.query.oCity,
    router.query.dCity,
    router.query.initialMode,
    router.query.initialEdgeId,
  ]);

  // Visa / eSIM ancillary drawers — opened by visa.open / esim.open widget
  // actions. Both drawers self-fetch their own catalogue data so we only
  // need to track open state here.
  const [visaDrawer, setVisaDrawer] = useState<{ show: boolean }>({ show: false });
  const [esimDrawer, setEsimDrawer] = useState<{ show: boolean }>({ show: false });

  // ── Pagination state ─────────────────────────────────────────────────────
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const hasMoreRef = useRef(false);
  const beforeCursorRef = useRef<string | null>(null);
  const isFetchingMoreRef = useRef(false);
  const appliedRestoredThreadRef = useRef<unknown>(null);
  // Mirrors the thread-detail `form_filled` flag for the current restore. When
  // the form was already submitted (true) we skip rendering the intake card on
  // reload; when false we restore it (with prefill) so the user can still fill
  // it. Read by parseThreadItems (incl. pagination) so the gate is consistent.
  const restoredFormFilledRef = useRef(false);
  // Same idea for the pricing form, mirroring `confirm_pricing_form_submitted`.
  // When the user has already submitted pricing (true) the card stays hidden on
  // reload; when false we restore the interactive card (with prefill) so they
  // can still submit it. Read by parseThreadItems so the gate is consistent.
  const restoredPricingSubmittedRef = useRef(false);

  // Tracks whether the user is pinned to the bottom of the message list. The
  // auto-scroll effect only fires when this is true, so the transcript won't
  // yank away from a user who's scrolled up to read earlier messages.
  const isAtBottomRef = useRef(true);
  // Phone-only: the top bar collapses while the reader scrolls down the thread
  // and slides back in on an upward scroll or at the top of the list. The
  // collapse itself is CSS and media-scoped, so this flag is inert on desktop.
  const [headerHidden, setHeaderHidden] = useState(false);
  // True between a thread restore and the moment we've actually parked the
  // scroll container at the bottom. Widgets/images in restored threads finish
  // laying out asynchronously, so a single smooth scroll lands mid-thread —
  // we re-snap on a few ticks until the content has settled.
  const initialScrollPendingRef = useRef(false);
  // True on the /chat?intake=1 landing between injecting the greeting + empty
  // intake form and the first stream. Suppresses the initial auto-scroll so the
  // view stays at Kaira's greeting instead of snapping to the bottom of the
  // form. Cleared as soon as a stream begins (user submitted / sent a message).
  const suppressIntakeAutoScrollRef = useRef(false);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  // Wraps every message + custom card. Observed for size changes so async-
  // growing content (login/OTP card, the stepped status loader, images,
  // widgets) re-pins the view to the bottom — see the ResizeObserver effect.
  const messagesContentRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitial = useRef(false);
  const hasUpdatedUrl = useRef(false);
  const postLoginFiredRef = useRef(false);
  const loginFlowArmedRef = useRef(false);
  // Set once the user chooses "Skip login". After opting out we suppress any
  // further inline `prompt_login` cards for the rest of the session — otherwise
  // the resume (or any later action) re-triggers the backend's save-our-work
  // prompt and the card loops straight back, blocking the chat. A genuine login
  // is still reachable via the BotLoginModal (composer `requireAuth` / CTAs).
  const loginOptedOutRef = useRef(false);
  // Always-current mirror of `isLoggedIn` so handleEffect can read fresh auth
  // state without depending on its (memoized) closure — used to ignore a stale
  // `prompt_login` that arrives after the user has already signed in.
  const isLoggedInRef = useRef(false);
  type PendingAction =
    | { kind: "message"; text: string }
    | { kind: "widget"; type: string; payload: Record<string, unknown> };
  const pendingPostLoginAction = useRef<PendingAction | null>(null);
  // Set when a logged-out viewer opens an existing thread and we inject the
  // inline login card during restore (no user prompt/action to replay). On
  // login success the post-login effect resumes the thread via
  // `resume_after_login` instead of re-injecting anything.
  const pendingRestoreResumeRef = useRef(false);
  const hasInjectedContextRef = useRef(false);
  const inputRef = useRef(input);
useEffect(() => { inputRef.current = input; }, [input]);
const prevAuthTokenRef = useRef<string | null>(null);
const lastSentMessageRef = useRef<string>("");
const lastSentActionRef = useRef<PendingAction | null>(null);
// Fresh mirror of "the just-logged-in user may resume THIS chat" — true when
// it's their own/anonymous chat OR they're staff (i.e. NOT a foreign
// itinerary). Read inside the post-login effect so we resume silently via the
// `resume_after_login` action instead of re-injecting the previous prompt.
const canResumeAfterLoginRef = useRef(false);

  /**
   * Frontend-generated UUID for this chat session.
   * Created once when the component mounts (useRef keeps it stable across
   * re-renders without triggering additional renders).
   * Sent as session_id in every API request.
   * Also used as the URL segment: /chat/{sessionId}
   */
const sessionIdRef = useRef<string>((() => {
    if (propSessionId) return propSessionId;
    // 2. Fall back to URL (browser only; window is undefined during SSR/export)
    if (typeof window !== "undefined") {
      const match = window.location.pathname.match(/\/chat\/([a-f0-9-]{36})/);
      if (match) return match[1];
    }
    // 3. Generate new (only for fresh /chat)
    return generateSessionId();
  })());

  const isFirstMessageRef = useRef(true);

  /**
   * Stable ref to sendWidgetAction — lets handleEffect call it without
   * being defined before useChat (which would break hook ordering).
   */
  const sendWidgetActionRef = useRef<
    ((type: string, payload: Record<string, unknown>) => void) | null
  >(null);

  /**
   * Stable indirection for handleEffect — passed to useChat as onEffect so
   * we can define handleEffect *after* useChat without a circular dependency.
   */
  const handleEffectRef = useRef<
    ((effect: { name: string; data: Record<string, unknown> }) => void) | null
  >(null);

  // ── Jupiter analytics — Partytown-forwarded, runs in a worker thread so
  //    these calls don't block the main thread. Refs let us call them inside
  //    other useCallbacks without changing their deps.
  const {
    trackChatFunnelStage,
    trackChatMessageSent,
    trackHotelCardClicked,
    trackActivityCardClicked,
    trackTransferCardClicked,
    trackPoiCardClicked,
  } = useAnalytics();
  const analyticsRef = useRef({
    trackChatFunnelStage,
    trackChatMessageSent,
    trackHotelCardClicked,
    trackActivityCardClicked,
    trackTransferCardClicked,
    trackPoiCardClicked,
  });
  useEffect(() => {
    analyticsRef.current = {
      trackChatFunnelStage,
      trackChatMessageSent,
      trackHotelCardClicked,
      trackActivityCardClicked,
      trackTransferCardClicked,
      trackPoiCardClicked,
    };
  }, [
    trackChatFunnelStage,
    trackChatMessageSent,
    trackHotelCardClicked,
    trackActivityCardClicked,
    trackTransferCardClicked,
    trackPoiCardClicked,
  ]);
  // Snapshot user prompts (text content of all user messages in the current
  // thread) — chat lifecycle events include this in `properties.user_prompts`.
  const messagesRef = useRef<Message[]>([]);
  // Mirror the intake-form state so the stable sendMessage callback can tell,
  // at call time, whether an unfilled (non-blocking) intake card is on screen
  // that should be retired when the user types their own message instead.
  const intakeFormActiveRef = useRef(false);
  const intakeFormCompletedRef = useRef(false);
  const intakeFormSliceRef = useRef<any>(null);
  // Source of the currently-shown intake card. `false` = client-injected
  // landing form (/chat?intake=1) — the user may bypass it by typing, which
  // retires it. `true` = backend-streamed form (shimmer / form_fields / widget /
  // restore) — it is a deliberate part of the conversation and must NOT be
  // hidden when the user sends a follow-up message. This does NOT lock the
  // composer either way (the intake form never blocks input / quick replies).
  const intakeFormFromBackendRef = useRef(false);
  // The partial intake context the backend already knows about — seeded to a
  // backend-streamed form's prefill and advanced each time we forward the user's
  // edits. Lets us send ONLY newly-changed selections alongside a typed message
  // while a backend widget stays on screen, instead of re-asserting the same
  // prefill on every follow-up. `null` = nothing synced yet.
  const lastIntakeContextRef = useRef<string | null>(null);
  const getUserPrompts = useCallback((): string[] => {
    return (messagesRef.current || [])
      .filter((m: any) => m?.role === "user")
      .map((m: any) => (typeof m?.content === "string" ? m.content : ""))
      .filter(Boolean);
  }, []);
  const botModeRef = useRef<BotMode>(botMode);
  useEffect(() => { botModeRef.current = botMode; }, [botMode]);
  const ddAgent = () => (botModeRef.current === "p2" ? "P2" : "P1");

  // Chat conversion-funnel reporting. Each milestone is reachable from several
  // paths (a server effect, the restored-thread widget scan, a button in
  // BotApp), so services/analyticsFunnel owns the dedup — keyed on the chat
  // session and persisted in sessionStorage, because a refresh resumes the same
  // thread and a per-mount ref would let the whole funnel fire again.
  //
  // It also back-fills earlier stages. `chat_itinerary_generated` in particular
  // only has a live trigger (the `display_itinerary` effect), which is never
  // replayed on a restored thread and never arrives at all on the P2/tailored
  // path — so it used to report *fewer* generations than confirmations, which
  // is impossible. Reaching a later milestone proves the itinerary existed.
  const localItineraryIdRef = useRef<string | undefined>(localItineraryId);
  useEffect(() => {
    localItineraryIdRef.current = localItineraryId;
  }, [localItineraryId]);

  const reportChatStage = useCallback(
    (stage: string, itineraryIdOverride?: string) => {
      reportFunnelStage(FUNNELS.chat, stage, {
        scopeId: getChatFunnelScope(),
        persist: true,
        emit: (eventName: string, extra: Record<string, unknown>) =>
          analyticsRef.current.trackChatFunnelStage?.(
            eventName,
            itineraryIdOverride || localItineraryIdRef.current || "",
            ddAgent(),
            getUserPrompts(),
            extra,
          ),
      });
    },
    [getUserPrompts],
  );

  // ── Location ─────────────────────────────────────────────────────────────
  const { userLocationData, isLoadingLocation } = useUserLocationData();
  const locationReady = !isLoadingLocation;
  const [entities, setEntities] = useState<Record<string, { name: string; type: string }>>({});


  // ── Session created ───────────────────────────────────────────────────────
  // Called by useChat after the first API response confirms the thread.
  // We use our own UUID (not the API thread_id) for the URL.
const handleSessionCreated = useCallback((ourSessionId: string) => {
  if (hasUpdatedUrl.current) return;

  // Don't overwrite if URL already has a valid session ID
  const alreadyInUrl = window.location.pathname.match(/\/chat\/([a-f0-9-]{36})/);
  if (alreadyInUrl) {
    hasUpdatedUrl.current = true;
    bindChatFunnelScope(alreadyInUrl[1]);
    return;
  }

  // The first response resolves asynchronously. If the user pressed browser
  // back (or otherwise navigated off the /chat surface) while it was in flight,
  // do NOT push /chat/{id} — that would hijack whatever page they're now on.
  // Only claim the URL when we're still on the bare /chat surface.
  const path = window.location.pathname;
  if (path !== "/chat" && path !== "/chat/") {
    return;
  }

  hasUpdatedUrl.current = true;
  const target = `/chat/${ourSessionId}`;
  window.history.pushState({}, "", target);
  // The funnel scope is derived from this URL segment, which didn't exist when
  // chat_itinerary_started fired. Rebind so the rest of the funnel is recorded
  // against the same run instead of looking un-started and re-firing.
  bindChatFunnelScope(ourSessionId);
  // sessionStorage can hit its quota when chatkit_session_* entries pile up.
  // The cached value is an optimization for restore — if writing fails, drop
  // every chatkit_session_* entry and retry once before giving up silently.
  const key = `chatkit_session_${target}`;
  try {
    sessionStorage.setItem(key, ourSessionId);
  } catch {
    try {
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith("chatkit_session_"))
        .forEach((k) => sessionStorage.removeItem(k));
      sessionStorage.setItem(key, ourSessionId);
    } catch (err) {
      console.warn("sessionStorage write failed:", err);
    }
  }
}, []);

  // ── useChat ───────────────────────────────────────────────────────────────
  const apiUrl =
    botMode === "p2"
      ? `${CHATKIT_API_URL}/p2`
      : CHATKIT_API_URL;

  // Stable onEffect wrapper — must be a named useCallback, never inline inside
  // the useChat({}) call, otherwise React mis-counts hook calls across renders.
  const stableOnEffect = useCallback(
    (effect: { name: string; data: Record<string, unknown> }) => {
      handleEffectRef.current?.(effect);
    },
    [], // empty deps: this wrapper never changes; handleEffectRef.current does
  );

  // Stable onWidget wrapper — same hook-order rationale as stableOnEffect.
  // useChat routes intake-form widgets (id `intake-form:{...}`) here so we can
  // seed the Redux slice and inject the interactive IntakeForm card.
  const handleIntakeWidgetRef = useRef<
    ((item: { id: string; widget: Record<string, unknown> }) => void) | null
  >(null);
  const handlePricingWidgetRef = useRef<
    ((item: { id: string; widget: Record<string, unknown> }) => void) | null
  >(null);
  const stableOnWidget = useCallback(
    (item: { id: string; widget: Record<string, unknown> }) => {
      // Route by the widget id prefix — pricing vs intake forms are both handled
      // by the host but seed different Redux slices.
      if (isPricingFormWidgetId(item.widget?.id)) {
        handlePricingWidgetRef.current?.(item);
        return;
      }
      handleIntakeWidgetRef.current?.(item);
    },
    [],
  );

const { messages, isStreaming, error, sendMessage: rawSendMessage,
  sendWidgetAction: rawSendWidgetAction, clearMessages, cancelStream, setMessages, threadIdRef } = useChat({
    apiUrl,
    domainKey: CHATKIT_DOMAIN_KEY,
    model: selectedModel,
    userLocation: userLocationData,
    locationReady,
    botMode,
    itineraryId: localItineraryId,
    onEffect: stableOnEffect,
    onWidget: stableOnWidget,
    authToken: authToken ?? undefined,
    userId: reduxUserId ?? undefined,
    // The stable frontend UUID — never changes for the lifetime of this component
    sessionId: sessionIdRef.current,
    onSessionCreated: handleSessionCreated,
    loginMandatory,
    themeItems,
    themeSlug,
  });

  // ── Context chips for the intake notes step ────────────────────────────────
  // Once the traveller reaches the final ("notes") step of the intake form with
  // the three prior steps (destination, when, who) filled, fetch context-aware
  // suggestion chips from `/chatkit/context-chips`, built from what they picked.
  // Works for restored threads (thread_id present) AND fresh new-chat /
  // `?intake=1&destination=…` sessions (thread_id null — the destination / date
  // / group drive the request). A shimmer loader shows on the notes step while
  // in flight; on any failure we clear the loader and leave `noteHints` empty so
  // the step keeps its static NOTE_HINTS fallback.
  //
  // We key the fetch on a signature of the three inputs (destination | start
  // date | group). It fires once per unique combination, so navigating back to
  // the last step WITHOUT changing any earlier answer does NOT re-call the API —
  // only an actual edit to destination / dates / group re-fetches.
  const intakeStep = intakeFormSlice?.step ?? 0;
  // ALL selected destinations, comma-joined — a multi-select or an added /
  // changed place is reflected in full (and, via the signature below, re-fetches
  // chips). Falls back to the single primary destination.
  const intakeDestinationName = (
    intakeFormSlice?.destinations?.length
      ? intakeFormSlice.destinations.map((d: any) => d?.name)
      : intakeFormSlice?.destination?.name
        ? [intakeFormSlice.destination.name]
        : []
  )
    .map((n: unknown) => (typeof n === "string" ? n.trim() : ""))
    .filter(Boolean)
    .join(", ");
  const intakeStartDate = intakeFormSlice?.startDate || null;
  const intakeWho = intakeFormSlice?.who || "";
  const contextChipsSignatureRef = useRef<string | null>(null);
  useEffect(() => {
    if (!intakeFormActive) {
      contextChipsSignatureRef.current = null;
      return;
    }
    // Only ask for chips on the last (notes) step.
    const onLastStep = intakeStep === TOTAL_STEPS - 1;
    if (!onLastStep) return;
    // The three compulsory steps must be filled before we ask for chips.
    if (!intakeDestinationName || !intakeWho) return;
    // Skip if we already fetched for this exact set of answers.
    const signature = `${intakeDestinationName}|${intakeStartDate || ""}|${intakeWho}`;
    if (contextChipsSignatureRef.current === signature) return;
    contextChipsSignatureRef.current = signature;

    // Slice keeps dates as ISO (YYYY-MM-DD); the API expects DD-MM-YYYY.
    const toDDMMYYYY = (iso: string | null): string => {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || "").trim());
      return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
    };

    const controller = new AbortController();
    dispatch(updateIntakeForm({ noteHintsLoading: true }));
    (async () => {
      try {
        const res = await fetch(`${CHATKIT_API_URL}/context-chips`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({
            thread_id: threadIdRef.current || null,
            destination: intakeDestinationName,
            start_date: toDDMMYYYY(intakeStartDate),
            group_type: intakeWho,
            max_chips: 6,
          }),
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        const chips = Array.isArray(data?.chips)
          ? data.chips.filter(
              (c: unknown): c is string =>
                typeof c === "string" && c.trim().length > 0,
            )
          : [];
        if (chips.length) dispatch(updateIntakeForm({ noteHints: chips }));
      } catch {
        // Network/parse error or abort — keep the static NOTE_HINTS fallback.
      } finally {
        dispatch(updateIntakeForm({ noteHintsLoading: false }));
      }
    })();

    return () => controller.abort();
  }, [
    intakeFormActive,
    intakeStep,
    intakeDestinationName,
    intakeStartDate,
    intakeWho,
    authToken,
    dispatch,
    threadIdRef,
  ]);

  // Logged-out user viewing an existing thread (restored via threads.get_by_id)
  // sees the inline sign-in card as the last message. In that state the
  // composer is blocked and clicking it must NOT open the BotLoginModal popup —
  // the user signs in through the inline card instead.
  const loginBlocked =
    !isLoggedIn && messages.some((m) => m.type === "login_card");

  // A `prompt_login` sign-in card is on screen. Whenever it is, the message box
  // and quick replies must be blocked so the user answers via the card first —
  // this holds regardless of the client-side login flag (the backend asked for
  // sign-in). `loginBlocked` above additionally drives the logged-out placeholder
  // / requireAuth behaviour; this flag only gates interactivity.
  const promptLoginBlocked = messages.some((m) => m.type === "login_card");

  // ── Empty intake form on /chat?intake=1 (Plan with Kaira CTAs) ─────────────
  // When the user lands here from a "Plan with Kaira" CTA we inject a fresh,
  // empty intake form (plus Kaira's greeting) without waiting for the backend
  // `form_fields` effect. Mirrors the injection in the form_fields handler.
  useEffect(() => {
    if (!startEmptyIntake) return;
    if (intakeFormInjectedRef.current) return;
    intakeFormInjectedRef.current = true;
    // Client landing form — retired if the user types past it (see sendMessage).
    intakeFormFromBackendRef.current = false;
    // Don't auto-scroll to the bottom of the freshly-injected form — keep
    // Kaira's greeting in view on the /chat?intake=1 landing.
    suppressIntakeAutoScrollRef.current = true;
    // When the destination is already prefilled (from the hero CTA's
    // `?destination=`), skip the answered destination step and land on "When".
    const startStep = intakePrefillDestinationName ? 1 : 0;
    dispatch(
      updateIntakeForm({ active: true, completed: false, step: startStep }),
    );
    setMessages((prev) => [
      ...prev,
      {
        id: `intake-greeting-${sessionIdRef.current}`,
        role: "assistant",
        content:
          "Hi, I'm Kaira, your travel friend. Let's build something good — a few quick taps and I'll get to work.",
        timestamp: new Date(),
      },
      {
        id: `intake-form-${sessionIdRef.current}`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        type: "intake_form",
      },
    ]);
    onIntakeFormStart?.();
    // Run once on mount when the flag is set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startEmptyIntake]);

  // ── Themed theme-page mini-form on /chat?themeForm=<slug> ─────────────────
  // A theme page's "Build this itinerary" routes here with the theme slug. We
  // inject Kaira's opener (the theme's tagline) + the themed 2-section form
  // card. Nothing is sent to /chatkit until the reader submits the form. Mirrors
  // the empty-intake injection above but uses its own one-shot guard so the two
  // never collide.
  useEffect(() => {
    if (!startThemedForm) return;
    if (themedFormInjectedRef.current) return;
    const form = themeFormRef.current;
    if (!form) return;
    themedFormInjectedRef.current = true;
    suppressIntakeAutoScrollRef.current = true;
    // Kaira's opener (the theme tagline) rides as a normal assistant bubble so
    // it gets her avatar + styling like every other message; the form card
    // follows it.
    setMessages((prev) => [
      ...prev,
      {
        id: `theme-greeting-${sessionIdRef.current}`,
        role: "assistant",
        content: form.tagline,
        timestamp: new Date(),
      },
      {
        id: `theme-form-${sessionIdRef.current}`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        type: "theme_form",
      },
    ]);
    onIntakeFormStart?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startThemedForm]);

  // Quick replies stream in on the tail of the response, after the answer is
  // fully rendered but while the SSE connection is still open (so `isStreaming`
  // is still true). Treat that whole window — the shimmer skeleton *and* the
  // loaded chips — as "not streaming" for the composer so the user can keep
  // typing and sending throughout the quick-reply phase, not just while the
  // shimmer shows.
  const inQuickReplyPhase = quickReplyShimmer || quickReplies.length > 0;
  const isStreamingResponse = isStreaming && !inQuickReplyPhase;

  // Wrap sendWidgetAction so we can replay the same action after a post-login
  // retry (e.g. inject.context that triggered prompt_login while logged out).
  //
  // A server-bound widget CTA (e.g. "Confirm & Get Price") starts a fresh
  // streamed response just like a text send, so it must clear the previous
  // turn's quick replies up front — same as sendMessage. Otherwise the
  // lingering chips keep `inQuickReplyPhase` true, which keeps
  // `isStreamingResponse` false and leaves the composer unlocked ("Ask me
  // anything" + Send) while the widget action is actively streaming, letting
  // the user fire a message into an in-flight turn. Clearing them here means
  // the composer correctly shows "Kaira is working…" + Stop for the whole
  // widget-triggered stream, and only unlocks again once the new turn's own
  // quick-reply tail arrives.
  const sendWidgetAction = useCallback(
    (
      type: string,
      payload: Record<string, unknown>,
      // Extra top-level request fields (siblings of `params`), passed straight
      // through to useChat — used for `login_opted_out` on skip-login.
      rootFields?: Record<string, unknown>,
    ) => {
      lastSentActionRef.current = { kind: "widget", type, payload };
      setQuickReplies([]);
      setQuickReplyShimmer(false);
      return rawSendWidgetAction(type, payload, rootFields);
    },
    [rawSendWidgetAction],
  );

  // Keep sendWidgetActionRef current after every render
  sendWidgetActionRef.current = sendWidgetAction;
  // Mirror messages into a ref so analytics calls can pull user_prompts
  // without subscribing to the messages array directly.
  messagesRef.current = messages;
  // Mirror intake-form state for the stable sendMessage callback.
  intakeFormActiveRef.current = intakeFormActive;
  intakeFormCompletedRef.current = intakeFormCompleted;
  intakeFormSliceRef.current = intakeFormSlice;
  // Keep the fresh-auth mirror current for handleEffect's prompt_login guard.
  isLoggedInRef.current = isLoggedIn;
  // Mirror the ownership gate so the post-login effect can decide whether to
  // resume this chat silently (own/anonymous chat or staff) vs. re-inject.
  canResumeAfterLoginRef.current = !isForeignItinerary;

  // Keep the synced-context baseline from going stale. The moment the intake
  // form is no longer live — reset on a new chat (`resetIntakeForm` flips
  // `active` off), submitted (`completed`), or bypassed — drop the baseline so a
  // later backend widget starts clean and never diffs its edits against a
  // previous conversation's selections. A backend widget re-seeds the baseline
  // in the same tick it sets `active: true`, so this never clears a live one.
  useEffect(() => {
    if (!intakeFormActive || intakeFormCompleted) {
      lastIntakeContextRef.current = null;
    }
  }, [intakeFormActive, intakeFormCompleted]);

  // ── "Create my version" (clone) success ──────────────────────────────────
  // Defined after useChat because it depends on clearMessages (and reads
  // threadIdRef / sessionIdRef). On success we keep the user in-page and hand
  // the new id to the SAME build pipeline the bot uses (skeleton → /{id}/status/
  // polling → load) via onItineraryCompletionStart/Done.
  const handleCloneSuccess = useCallback(
    (newId: string) => {
      if (!newId) return;
      setShowCloneModal(false);
      // The clone spins up a brand-new chat for the cloned itinerary. Start a
      // fresh thread: clearMessages() nulls threadIdRef (so the next send is a
      // *first* message that creates a new thread, instead of appending to the
      // source itinerary's restored thread) and resets sessionCreatedFiredRef.
      // Without this, the post-clone message lands on the source thread and a
      // refresh of /chat/{newId} finds no thread for the new session_id —
      // spawning a stray "new thread" instead of restoring the clone's chat.
      clearMessages();
      // Re-arm the P2 "context" trigger for the clone. hasInjectedContextRef is
      // a session-lived fire-once guard — if the overview already fired earlier
      // this session (the user's own build, or a prior completion) it stays true
      // and blocks the effect at the `itineraryCompleted` site below. Reset it
      // so the cloned itinerary fires its own P2 context once finalized_status
      // flips to SUCCESS on the new thread. (That effect detects the cleared
      // thread and seeds a first message — see the inject.context effect — since
      // sendWidgetAction can only append to an existing thread.)
      hasInjectedContextRef.current = false;
      // A cloned chat is a fresh conversation — clear any prior "skip login"
      // opt-out so the clone can surface its own sign-in prompt.
      loginOptedOutRef.current = false;
      // Re-key the session to the new itinerary_id so every subsequent request
      // (chat sends, status polling) is scoped to the clone. sessionIdRef is
      // mount-fixed, so set it directly; the re-render triggered by
      // setShowCloneModal flows the new value into useChat.
      sessionIdRef.current = newId;
      // Keep the parent's activeChatSessionId in sync so browser back/forward
      // correctly detects this as a *different* session. Without it the popstate
      // guard compares against a stale id and skips the reload, leaving the URL
      // and the rendered itinerary out of sync.
      onSessionChange?.(newId);
      // Reflect the cloned itinerary in the URL so a refresh/share points at the
      // new itinerary_id (mirrors the default clone redirect to /chat/{id}).
      const target = `/chat/${newId}`;
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== target
      ) {
        window.history.pushState({}, "", target);
      }
      onItineraryCompletionStart?.("pending");
      onItineraryCompletionDone?.(newId);
    },
    [
      onItineraryCompletionStart,
      onItineraryCompletionDone,
      onSessionChange,
      clearMessages,
    ],
  );

  // ── Feedback (thumbs up / down) handler ──────────────────────────────────
  // Three-state toggle per assistant message:
  //   no feedback        + click X     →  POST   /feedback           (create)
  //   feedback type !== X + click X    →  POST   /feedback/{id}      (change)
  //   feedback type === X + click X    →  DELETE /feedback/{id}      (clear)
  const handleFeedback = useCallback(
    async (
      messageId: string,
      type: "up" | "down",
      message?: string,
      label?: string,
    ) => {
      if (!messageId) return;
      if (!authToken) {
        setShowLoginModal(true);
        return;
      }
      if (feedbackLoadingIds.has(messageId)) return;

      const threadId = threadIdRef.current;
      if (!threadId) {
        // Without a thread id the create call has no anchor — bail silently.
        return;
      }

      const headers = { Authorization: `Bearer ${authToken}` };
      const setLoading = (on: boolean) =>
        setFeedbackLoadingIds((prev) => {
          const next = new Set(prev);
          if (on) next.add(messageId);
          else next.delete(messageId);
          return next;
        });

      const trimmedMessage = message?.trim();
      const current = feedbackByMessageId[messageId];
      setLoading(true);
      try {
        if (!current) {
          const body = {
            session_id: sessionIdRef.current,
            thread_id: threadId,
            message_id: messageId,
            type,
            platform: getPlatform(),
            ...(trimmedMessage ? { message: trimmedMessage } : {}),
            ...(label ? { label } : {}),
            ...(reduxUserId != null ? { author: parseInt(reduxUserId) } : {}),
          };
          const res = await axios.post(
            `${CHATKIT}/feedback`,
            body,
            { headers },
          );
          const newId = (res.data?.id ?? res.data?.feedback_id) as string | undefined;
          if (newId) {
            setFeedbackByMessageId((prev) => ({
              ...prev,
              [messageId]: { feedbackId: String(newId), type },
            }));
          }
        } else if (current.type === type) {
          await axios.delete(
            `${CHATKIT}/feedback/${current.feedbackId}`,
            { headers },
          );
          setFeedbackByMessageId((prev) => {
            const next = { ...prev };
            delete next[messageId];
            return next;
          });
        } else {
          await axios.post(
            `${CHATKIT}/feedback/${current.feedbackId}`,
            {
              type,
              platform: getPlatform(),
              ...(trimmedMessage ? { message: trimmedMessage } : {}),
              ...(label ? { label } : {}),
            },
            { headers },
          );
          setFeedbackByMessageId((prev) => ({
            ...prev,
            [messageId]: { ...current, type },
          }));
        }
      } catch (err) {
        console.error("[Feedback] failed:", err);
        dispatch(
          openNotification({
            type: "error",
            heading: "Couldn't save feedback",
            text: "Please try again in a moment.",
          }),
        );
      } finally {
        setLoading(false);
      }
    },
    [authToken, feedbackByMessageId, feedbackLoadingIds, reduxUserId, threadIdRef, dispatch],
  );

  // Remember the most recently emitted start/end so we only fire the endpoint
  // callback when it actually changes (back-to-back effects in one turn often
  // repeat the same endpoints).
  const lastEndpointsRef = useRef<string>("");

  // Resolve an endpoint from an effect payload, falling back to the user's
  // current location when the server omits name/place id. Returns null only if
  // both the effect and the user location are empty (ChatKitPanel has no
  // sensible default beyond that).
  const resolveEndpoint = useCallback(
    (raw: any): CityEndpoint | null => {
      const name = raw?.name ?? raw?.city ?? raw?.city_name;
      const placeId = raw?.gmaps_place_id ?? raw?.place_id;
      if (name || placeId) {
        return {
          name: String(name ?? ""),
          gmaps_place_id: String(placeId ?? ""),
        };
      }
      if (userLocationData?.place_id || userLocationData?.text) {
        return {
          name: userLocationData.text ?? "",
          gmaps_place_id: userLocationData.place_id ?? "",
        };
      }
      return null;
    },
    [userLocationData],
  );

  // Extract start_city / end_city from any supported effect payload and
  // forward to the parent. Shapes handled:
  //   • shimmer_day_by_day / display_itinerary: { start_city, end_city } at the
  //     effect data root (or nested under .itinerary for display_itinerary).
  //   • display_transfers: uses start_transfer.from_city / end_transfer.to_city.
  const emitEndpointsFromEffect = useCallback(
    (effectName: string, data: Record<string, unknown>) => {
      if (!onRouteEndpointsReceived) return;
      let startRaw: any = null;
      let endRaw: any = null;

      if (effectName === "display_transfers") {
        const st = (data as any)?.start_transfer;
        const et = (data as any)?.end_transfer;
        if (st) startRaw = { name: st.from_city, gmaps_place_id: st.from_itinerary_city_id };
        if (et) endRaw = { name: et.to_city, gmaps_place_id: et.to_itinerary_city_id };
      } else {
        const root: any =
          effectName === "display_itinerary"
            ? ((data as any)?.itinerary ?? data)
            : data;
        startRaw = root?.start_city ?? null;
        endRaw = root?.end_city ?? null;
      }

      const start = resolveEndpoint(startRaw);
      const end = resolveEndpoint(endRaw);

      // Skip no-op re-emits so the map doesn't re-geocode on every chunk.
      const signature = JSON.stringify({ start, end });
      if (signature === lastEndpointsRef.current) return;
      lastEndpointsRef.current = signature;

      onRouteEndpointsReceived({ start_city: start, end_city: end });
    },
    [onRouteEndpointsReceived, resolveEndpoint],
  );

  // ── handleEffect (defined after useChat — safe, no hook-order issue) ──────
  const handleEffect = useCallback(
    ({ name, data }: { name: string; data: Record<string, unknown> }) => {
      console.log("[Effect triggered]", name, data);
      switch (name) {
        case "clear_map": {
          onClearMap?.(data);
          break;
        }
        case "focus_on_map": {
          onNewQuery();
          if (data.data) onLocationReceived(data as { data: Location[] });
          break;
        }
        case "focus_route": {
          if (data.data) onRouteReceived(data as { data: Location[] });
          break;
        }
        case "intake_form_shimmer": {
          // Server is about to compute the intake-form prefill — show a skeleton
          // loader in the card's place until `form_fields` (or the intake-form
          // widget) lands. Inject the card once so the skeleton has somewhere to
          // render; the loading flag flips it to the shimmer view.
          const loading = data.loading !== false; // default true
          // Backend-streamed form — persists across follow-up messages.
          intakeFormFromBackendRef.current = true;
          dispatch(updateIntakeForm({ active: true, completed: false, loading }));
          if (loading && !intakeFormInjectedRef.current) {
            intakeFormInjectedRef.current = true;
            setMessages((prev) =>
              prev.some((m) => m.type === "intake_form")
                ? prev
                : [
                    ...prev,
                    {
                      id: `intake-form-${sessionIdRef.current}`,
                      role: "assistant",
                      content: "",
                      timestamp: new Date(),
                      type: "intake_form",
                    },
                  ],
            );
            onIntakeFormStart?.();
          }
          break;
        }
        case "form_fields": {
          // Backend prefill for the multi-step intake form. Seed the Redux
          // slice, inject the form card into the thread once, and let BotApp
          // flip the left panel to the intake hero image. Clears any pending
          // shimmer set by `intake_form_shimmer`.
          // Backend-streamed form — persists across follow-up messages.
          intakeFormFromBackendRef.current = true;
          const formFieldsPrefill = parseFormFields(data as any);
          dispatch(
            updateIntakeForm({
              active: true,
              completed: false,
              loading: false,
              step: 0,
              ...formFieldsPrefill,
            }),
          );
          // The backend already knows the values it just prefilled — baseline
          // the synced context to them so only the user's own subsequent edits
          // ride along with a later typed message.
          lastIntakeContextRef.current =
            composePartialIntakeContext({
              ...intakeFormSliceRef.current,
              ...formFieldsPrefill,
            }) || null;
          if (!intakeFormInjectedRef.current) {
            intakeFormInjectedRef.current = true;
            setMessages((prev) => [
              ...prev,
              {
                id: `intake-form-${sessionIdRef.current}`,
                role: "assistant",
                content: "",
                timestamp: new Date(),
                type: "intake_form",
              },
            ]);
            onIntakeFormStart?.();
          }
          break;
        }
        // NOTE: `show_intake_form` is no longer a client effect — the backend
        // now streams the intake form as a widget (`intake-form:{...}`),
        // handled by handleIntakeFormWidget via useChat's onWidget.
        case "pricing_form_shimmer": {
          // Server is about to compute the pricing-form prefill — show a
          // skeleton loader in the card's place until the pricing-form widget
          // lands. Inject the card once so the skeleton has somewhere to render;
          // the loading flag flips it to the shimmer view. Unlike the intake
          // form this does NOT lock the composer.
          const loading = data.loading !== false; // default true
          dispatch(updatePricingForm({ active: true, completed: false, loading }));
          if (loading && !pricingFormInjectedRef.current) {
            pricingFormInjectedRef.current = true;
            setMessages((prev) =>
              prev.some((m) => m.type === "pricing_form")
                ? prev
                : [
                    ...prev,
                    {
                      id: `pricing-form-${sessionIdRef.current}`,
                      role: "assistant",
                      content: "",
                      timestamp: new Date(),
                      type: "pricing_form",
                    },
                  ],
            );
          }
          break;
        }
        case "display_itinerary": {
          emitEndpointsFromEffect(name, data);
          // Pass the full effect payload (not just `.itinerary`) so pax +
          // travel-date carried at the effect-data root reach Redux. The
          // handler unwraps `.itinerary` for the city/route shape itself.
          onItineraryReceived(data);
          setHasDisplayItinerary(true);
          reportChatStage(
            "chat_itinerary_generated",
            localItineraryId || ((data.itinerary as any)?.id as string) || "",
          );
          break;
        }
        case "display_transfers": {
          emitEndpointsFromEffect(name, data);
          indexTransfersForLookup(data);
          onItineraryReceived(data);
          // The server emits display_transfers once route options are
          // finalized for the chosen itinerary — treat that as the route
          // being confirmed for analytics purposes.
          reportChatStage("chat_route_confirmed");
  break;
        }
        case "route.lock":
        case "route.edit":
        case "route.remove":
        case "route.reorder.start":
        case "itinerary.lock": {
          if (name === "route.lock") {
            reportChatStage("chat_route_confirmed");
          } else if (name === "itinerary.lock") {
            reportChatStage("chat_itinerary_confirmed");
          }
          sendWidgetActionRef.current?.(name, data);
          break;
        }
        case "load_itinerary": {
          if (data.redirect_url && typeof data.redirect_url === "string") {
            window.location.href = data.redirect_url;
          }
          break;
        }
case "prompt_login": {
  // The user already chose "Skip login" this session — honour that and don't
  // re-inject the card (the backend replays this prompt on the opted-out
  // resume). Without this the card loops straight back and blocks the chat.
  if (loginOptedOutRef.current) break;
  // Mid-chat login: remember what to replay, then drop an inline login card
  // into the thread (instead of the modal). The token-watch effect re-fires
  // `pendingPostLoginAction` automatically once auth succeeds.
  pendingPostLoginAction.current =
    lastSentActionRef.current ??
    (lastSentMessageRef.current
      ? { kind: "message", text: lastSentMessageRef.current }
      : null);
  loginFlowArmedRef.current = true;
  // Optional lead-in line from the bot — rendered as a normal Kaira bubble
  // above the login card. Omitted entirely when the effect carries no message.
  const loginMessage =
    typeof data.message === "string" ? data.message.trim() : "";
  setMessages((prev) => {
    if (prev.some((m) => m.type === "login_card")) return prev;
    const base = Date.now();
    const additions: typeof prev = [];
    if (loginMessage) {
      additions.push({
        id: `login-msg-${sessionIdRef.current}-${base}`,
        role: "assistant",
        content: loginMessage,
        timestamp: new Date(),
        type: "text",
      });
    }
    additions.push({
      id: `login-card-${sessionIdRef.current}-${base}`,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      type: "login_card",
    });
    return [...prev, ...additions];
  });
  break;
}
        case "display_pois_on_map":
        case "show_attraction_on_map": {
          onNewQuery();
          if (data.data) onLocationReceived(data as { data: Location[] });
          break;
        }
        case "itinerary_entities": {
  const raw = (data.entities ?? {}) as Record<string, { name: string; type: string }>;
  setEntities(prev => ({ ...prev, ...raw }));
  break;
}
case "load_route_on_map": {
  onLoadRouteOnMap?.();
  break;
}
case "itinerary_completion_process_completed": {
  // THE polling trigger. The backend emits this once the completion chain is
  // actually registered, so `/status/` has real task states to report by the
  // time we ask. onItineraryCompletionDone sets the real itinerary id and turns
  // polling on (see BotApp's handleItineraryCompletionDone).
  //
  // `summary` is optional — the current payload is { itinerary_id, session_id }
  // — and falls back to the session id, which the backend sends alongside and
  // which matches the itinerary id on this route.
  const completedId =
    (data.itinerary_id as string) || (data.session_id as string) || "";
  const summary = (data.summary as string) ?? "";
  if (completedId) {
    onItineraryCompletionDone?.(completedId, summary);
  }
  // Pricing/cart for the trip is finalized at this point — fire
  // chat_price_received once the P2 completion process resolves.
  reportChatStage("chat_price_received", completedId || localItineraryId || "");
  break;
}

case "refresh_itinerary": {
  // Always fire so BotApp can clear stale cities/start_city/end_city and
  // avoid the stacked-ghost-pins problem on mid-chat edits. Polling only
  // starts if we have a real id to poll against.
  const refreshId = (data.itinerary_id as string) || localItineraryId || "";
  onItineraryRefresh?.(refreshId);
  break;
}

// Renamed by the backend; the old name is kept so the panel works either side
// of the deploy (see COMPLETION_STARTED_EFFECTS).
case "start_itinerary_completion_process":
case "itinerary_completion_process_started": {
  const startId = data.itinerary_id as string;
  // UI only: skeleton itinerary + PENDING statuses + the completing shimmer.
  // It deliberately does NOT start status polling.
  //
  // This effect only announces that completion is ABOUT to run, and the backend
  // emits it at different points depending on the turn — mid-stream on a
  // route-confirm (before the pricing step has even run) and at the end on a
  // pricing-form submit. Polling on it meant the first `/status/` call could
  // land before the celery chain was registered, come back FAILURE on every
  // task, and bounce the reader to /thank-you with a finished itinerary on
  // screen. `itinerary_completion_process_completed` is the effect that means
  // the chain is actually queued, so that is what starts polling now.
  onItineraryCompletionStart?.(startId ?? "pending");
  // Server kicks off completion only after the user has confirmed their
  // itinerary, so this is a reliable trigger for chat_itinerary_confirmed
  // even when the explicit `itinerary.lock` effect doesn't arrive.
  reportChatStage("chat_itinerary_confirmed", startId || localItineraryId || "");
  break;
}
case "shimmer_day_by_day": {
  emitEndpointsFromEffect(name, data);
  // Forward start/end city to BotApp so the skeleton itinerary in Redux
  // carries them too — otherwise VerticalLayout has nothing to label the
  // P1 start pin with until display_itinerary lands.
  onItineraryReceived({
    shimmer: true,
    start_city: data?.start_city ?? null,
    end_city: data?.end_city ?? null,
  });
  break;
}
        case "delete_poi_from_itinerary": {
          const payload = (data.data ?? {}) as Record<string, unknown>;
          dispatch(deletePoiFromItinerary(payload));
          const text = typeof data.message === "string" ? data.message : "POI removed from your itinerary.";
          dispatch(openNotification({ type: "success", heading: "Success!", text }));
          break;
        }
        case "delete_activity_from_itinerary": {
          const payload = (data.data ?? {}) as Record<string, unknown>;
          const bookingId = payload?.booking_id as string | undefined;
          dispatch(deleteActivityFromItinerary(payload));
          // Refresh the pricing surface when a booked activity is removed so
          // the cart total doesn't show stale pricing (mirrors hotel/transfer).
          if (bookingId) dispatch(SetCallPaymentInfo(!callPaymentInfo));
          const text = typeof data.message === "string" ? data.message : "Activity removed from your itinerary.";
          dispatch(openNotification({ type: "success", heading: "Success!", text }));
          break;
        }
        case "delete_restaurant_from_itinerary": {
          const payload = (data.data ?? {}) as Record<string, unknown>;
          dispatch(deleteRestaurantFromItinerary(payload));
          const text = typeof data.message === "string" ? data.message : "Restaurant removed from your itinerary.";
          dispatch(openNotification({ type: "success", heading: "Success!", text }));
          break;
        }
        case "delete_hotel_from_itinerary": {
          const payload = (data.data ?? {}) as Record<string, unknown>;
          const bookingId = payload?.booking_id as string | undefined;
          // Patch Itinerary cities[].hotels and Stays so the UI removes the
          // hotel without waiting on a refetch. Toggle CallPaymentInfo so the
          // pricing surface refreshes alongside.
          dispatch(deleteHotelFromItinerary(payload));
          if (bookingId) dispatch(updateStays(bookingId));
          dispatch(SetCallPaymentInfo(!callPaymentInfo));
          const text = typeof data.message === "string" ? data.message : "Hotel removed from your itinerary.";
          dispatch(openNotification({ type: "success", heading: "Success!", text }));
          break;
        }
        case "delete_transfer_from_itinerary": {
          const payload = (data.data ?? {}) as Record<string, unknown>;
          const bookingId = payload?.booking_id as string | undefined;
          if (bookingId) dispatch(updateTransferBookings(bookingId));
          dispatch(SetCallPaymentInfo(!callPaymentInfo));
          const text = typeof data.message === "string" ? data.message : "Transfer removed from your itinerary.";
          dispatch(openNotification({ type: "success", heading: "Success!", text }));
          break;
        }
        case "delete_esim_from_itinerary":
        case "delete_visa_from_itinerary": {
          const payload = (data.data ?? {}) as Record<string, unknown>;
          const bookingId = payload?.booking_id as string | undefined;
          const kind = name === "delete_esim_from_itinerary" ? "eSIM" : "Visa";
          if (bookingId) dispatch(removeAncillaryBooking(bookingId));
          dispatch(SetCallPaymentInfo(!callPaymentInfo));
          const text = typeof data.message === "string" ? data.message : `${kind} removed from your itinerary.`;
          dispatch(openNotification({ type: "success", heading: "Success!", text }));
          break;
        }
        case "quick_reply_shimmer": {
          // Server is about to compute quick replies — show skeleton chips in
          // their place until `load_quick_replies` arrives.
          setQuickReplies([]);
          setQuickReplyShimmer(true);
          break;
        }
        case "load_quick_replies": {
          const raw =
            (data.replies as any[]) ??
            (data.quick_replies as any[]) ??
            (data.data as any[]) ??
            [];
          const parsed: QuickReply[] = Array.isArray(raw)
            ? raw.map((r: any) =>
                typeof r === "string"
                  ? { label: r }
                  : {
                      label: r.label ?? r.text ?? String(r),
                      value: r.value ?? r.text ?? r.label,
                    },
              )
            : [];
          setQuickReplyShimmer(false);
          setQuickReplies(parsed);
          break;
        }
        case "update_pax": {
          // Patch just the Traveller Type on the current trip. Server keys are
          // no_of_*; forward only the values that are actually present so a
          // partial update doesn't blank out the others.
          const meta: {
            number_of_adults?: number;
            number_of_children?: number;
            number_of_infants?: number;
          } = {};
          if (typeof data.no_of_adults === "number")
            meta.number_of_adults = data.no_of_adults;
          if (typeof data.no_of_children === "number")
            meta.number_of_children = data.no_of_children;
          if (typeof data.no_of_infants === "number")
            meta.number_of_infants = data.no_of_infants;
          onTripMetaUpdate?.(meta);
          break;
        }
        case "update_travel_date": {
          // Patch just the Date of Travelling on the current trip.
          if (typeof data.travel_date === "string") {
            onTripMetaUpdate?.({ travel_date: data.travel_date });
          }
          break;
        }
        default:
          console.warn("[Effect] unhandled:", name);
      }
    },
    [onLocationReceived, onNewQuery, onClearMap, onRouteReceived, onItineraryReceived, onTripMetaUpdate, input, indexTransfersForLookup, emitEndpointsFromEffect, dispatch, callPaymentInfo, setMessages, onIntakeFormStart],
  );

  // Wire handleEffect into the ref so the stable onEffect wrapper picks it up
  handleEffectRef.current = handleEffect;

  // ── Streamed intake-form widget ───────────────────────────────────────────
  // Replaces the old `show_intake_form` client effect. The backend now streams
  // the form as a widget item whose id encodes the prefill JSON
  // (`intake-form:{...}`). Parse it, seed the Redux slice with prefilled fields
  // + per-section completion markers, inject the interactive form card once,
  // and flip the left panel to the intake hero image.
  const handleIntakeFormWidget = useCallback(
    (item: { id: string; widget: Record<string, unknown> }) => {
      // The prefill is encoded in the widget's own id ("intake-form:{...}"),
      // not the outer message id.
      const prefill = parseIntakeFormWidgetId(item.widget?.id);
      if (!prefill) return;
      // The intake form never blocks the message box or quick replies — the
      // user can fill the card or just keep typing. It IS backend-streamed, so
      // it persists across follow-up messages (never retired by typing).
      intakeFormFromBackendRef.current = true;

      const liveState = intakeFormSliceRef.current;
      const hasCard = intakeFormInjectedRef.current;
      // Freeze + append ONLY when the on-screen card is a COMPLETED form (it
      // renders as a locked summary we must not disturb). A loading shimmer or
      // an in-progress card is the placeholder for THIS very widget — reuse it
      // in place (fill it via the dispatch below) so the shimmer→widget handoff
      // never creates a second, stacked card.
      const freezeOld = hasCard && !!liveState?.completed;

      if (freezeOld) {
        const snapshot = liveState;
        setMessages((prev) => {
          const frozen = prev.map((m) =>
            m.type === "intake_form" && m.intakeSnapshot === undefined
              ? { ...m, intakeSnapshot: snapshot }
              : m,
          );
          return [
            ...frozen,
            {
              id: `intake-form-${sessionIdRef.current}-${Date.now()}`,
              role: "assistant",
              content: "",
              timestamp: new Date(),
              type: "intake_form",
            },
          ];
        });
      }

      const widgetPrefill = parseShowIntakeForm(prefill);
      dispatch(
        updateIntakeForm({
          active: true,
          completed: false,
          loading: false,
          ...widgetPrefill,
        }),
      );
      // The backend already knows this prefill — baseline the synced context to
      // it so only the user's own later edits ride along with a typed message.
      lastIntakeContextRef.current =
        composePartialIntakeContext({
          ...intakeFormSliceRef.current,
          ...widgetPrefill,
        }) || null;

      if (!hasCard) {
        intakeFormInjectedRef.current = true;
        setMessages((prev) =>
          prev.some((m) => m.type === "intake_form")
            ? prev
            : [
                ...prev,
                {
                  id: `intake-form-${sessionIdRef.current}`,
                  role: "assistant",
                  content: "",
                  timestamp: new Date(),
                  type: "intake_form",
                },
              ],
        );
        onIntakeFormStart?.();
      }
    },
    [dispatch, setMessages, onIntakeFormStart],
  );
  handleIntakeWidgetRef.current = handleIntakeFormWidget;

  // ── Streamed pricing-form widget ──────────────────────────────────────────
  // The backend streams the "confirm a few final details before pricing" card
  // as a widget item whose id encodes the prefill JSON (`pricing-form:{...}`).
  // Parse it, seed the Redux slice with prefilled toggles + completion markers,
  // and inject the interactive pricing card once. Unlike the intake form this
  // does NOT lock the composer (`active` here is informational only).
  const handlePricingFormWidget = useCallback(
    (item: { id: string; widget: Record<string, unknown> }) => {
      const prefill = parsePricingFormWidgetId(item.widget?.id);
      if (!prefill) return;
      dispatch(
        updatePricingForm({
          active: true,
          completed: false,
          loading: false,
          ...parsePricingCardCopy(item.widget),
          ...parseShowPricingForm(prefill),
        }),
      );
      if (!pricingFormInjectedRef.current) {
        pricingFormInjectedRef.current = true;
        setMessages((prev) =>
          prev.some((m) => m.type === "pricing_form")
            ? prev
            : [
                ...prev,
                {
                  id: `pricing-form-${sessionIdRef.current}`,
                  role: "assistant",
                  content: "",
                  timestamp: new Date(),
                  type: "pricing_form",
                },
              ],
        );
      }
    },
    [dispatch, setMessages],
  );
  handlePricingWidgetRef.current = handlePricingFormWidget;

  // ── Wrap sendMessage to clear quick replies ───────────────────────────────
const sendMessage = useCallback(
  (
    text: string,
    attachmentIds?: string[],
    attachmentMeta?: MessageAttachment[],
    opts?: { formSubmitted?: boolean; intakePayload?: Record<string, unknown> },
  ) => {
    setQuickReplies([]);
    setQuickReplyShimmer(false);
    lastSentMessageRef.current = text;
    lastSentActionRef.current = { kind: "message", text };

    // Fields the user already picked in an unsubmitted intake form (e.g.
    // destination) that should ride along with this typed message — set in the
    // bypass branch below and forwarded to the backend as hidden context.
    let intakeContextPrefix: string | undefined;

    // If the user types their own message while an unfilled intake form is on
    // screen (i.e. this send isn't the form's own submission), carry whatever
    // they've already selected in the form (destination, a chosen month/dates,
    // travellers, notes) along as hidden context — so Kaira still gets e.g.
    // "Destination: Japan" alongside the "Dec-Jan" they typed, without needing
    // to submit the form. Empty when nothing meaningful is selected.
    if (
      !opts?.formSubmitted &&
      intakeFormActiveRef.current &&
      !intakeFormCompletedRef.current
    ) {
      const partialContext =
        composePartialIntakeContext(intakeFormSliceRef.current) || undefined;

      if (!intakeFormFromBackendRef.current) {
        // CLIENT landing form (/chat?intake=1): the user has chosen to bypass
        // it — forward the selected context, then retire the intake greeting +
        // form card and deactivate the slice so the conversation flows as a
        // normal chat.
        intakeContextPrefix = partialContext;
        setMessages((prev) =>
          prev.filter(
            (m) =>
              m.type !== "intake_form" &&
              !String(m.id ?? "").startsWith("intake-greeting-"),
          ),
        );
        dispatch(updateIntakeForm({ active: false, completed: false }));
        // Release the fire-once injection guard. Without this the backend's
        // reply to this bypass message (which streams a fresh intake-form
        // widget, e.g. prefilled with "europe") would be silently dropped by
        // handleIntakeFormWidget's `!intakeFormInjectedRef.current` check, so
        // the card only reappears on refresh (when the ref resets).
        intakeFormInjectedRef.current = false;
      } else if (partialContext && partialContext !== lastIntakeContextRef.current) {
        // BACKEND-streamed widget: it's a deliberate part of the conversation
        // and stays put across follow-up messages (never retired). But if the
        // user edited its fields since the backend last synced them, ride those
        // updated selections along as hidden context so Kaira sees the change
        // without the user submitting the form — mirroring the client bypass
        // path. Guarded on a diff against the last-synced context so an
        // unchanged form doesn't re-assert its prefill on every message.
        intakeContextPrefix = partialContext;
      }

      // Remember what the backend now knows so subsequent messages only forward
      // genuinely-new edits.
      if (intakeContextPrefix) lastIntakeContextRef.current = intakeContextPrefix;
    }

    // User-initiated send: snap the view to the latest message even if they
    // had scrolled up earlier in the session.
    isAtBottomRef.current = true;

    if (isFirstMessageRef.current) {
      isFirstMessageRef.current = false;
      // Fire chat_itinerary_started on the very first user message of the
      // session — this marks the moment the user kicks off itinerary creation
      // through the chat flow. The ref alone only dedups within a mount; the
      // funnel guard is what stops a refresh-then-send from starting the same
      // chat a second time.
      reportChatStage("chat_itinerary_started");
    }

    // Every send, not just the first. The legacy P2 chat has logged this all
    // along; the Kaira chat only reported funnel milestones, so its single most
    // common user action was invisible.
    analyticsRef.current.trackChatMessageSent?.(
      localItineraryIdRef.current || "",
      text,
    );
    // If we're anywhere in the quick-reply tail — shimmer loading OR chips
    // already shown — the answer itself is done and only the quick replies keep
    // the SSE open. Interrupt that tail so the new message aborts it and starts
    // fresh instead of being dropped by the hook's `isStreaming && !interrupt`
    // guard (which previously swallowed sends made after the chips had loaded).
    rawSendMessage(text, attachmentIds, attachmentMeta, {
      interrupt: inQuickReplyPhaseRef.current,
      formSubmitted: opts?.formSubmitted,
      contextPrefix: intakeContextPrefix,
      intakePayload: opts?.intakePayload,
    });
  },
  [rawSendMessage],
);

// ── Intake form completion ───────────────────────────────────────────────────
// Always send the composed message straight to Kaira. If the user isn't logged
// in and the action needs auth, the backend emits `prompt_login`, which injects
// the inline sign-in card (login_card) and replays the message after verify —
// so we never inject an OTP card from the client here.
const handleIntakeComplete = useCallback(
  (composed: string) => {
    sendMessage(composed, undefined, undefined, { formSubmitted: true });
  },
  [sendMessage],
);

// ── Themed mini-form completion ──────────────────────────────────────────────
// Send the readable summary as the user message AND the structured payload
// (slug/window/skeleton/month/dates/pax/items) as `intake` on the request body,
// so the backend routes off the structured data. First fire to /chatkit for this
// flow. The composed text stays fully readable on its own — the backend may read
// either — but `intake` is what the routing is meant to key off.
const handleThemedFormSubmit = useCallback(
  (submission: ThemeFormSubmission, composed: string) => {
    sendMessage(composed, undefined, undefined, {
      formSubmitted: true,
      intakePayload: submission as unknown as Record<string, unknown>,
    });
  },
  [sendMessage],
);


// ── Pricing form completion ──────────────────────────────────────────────────
// Same contract as the intake form: send the composed final-details message
// straight to Kaira with the form_submitted flag.
const handlePricingComplete = useCallback(
  (composed: string) => {
    sendMessage(composed, undefined, undefined, { formSubmitted: true });
  },
  [sendMessage],
);

// Inline `prompt_login` card verified — just retire the card. The token-watch
// effect re-fires `pendingPostLoginAction` (the message/widget action that
// triggered the login) once the auth token lands, mirroring BotLoginModal.
const handleLoginCardVerified = useCallback(() => {
  setMessages((prev) => prev.filter((m) => m.type !== "login_card"));
  // Ensure a user who logs in via the inline card (e.g. after itinerary
  // completion) gets attached to the itinerary — BotLoginModal does this via
  // onSuccess, but the inline card path never went through it.
  void onLoginSuccess?.();
}, [setMessages, onLoginSuccess]);

// Inline login card skipped — the user deliberately opts out of signing in.
// Retire the card and resume the conversation as a logged-out (opted-out) user
// so the backend continues the thread instead of waiting on auth. Mirrors the
// post-login resume path (same gate) but flags the skip via `login_opted_out`.
const handleLoginCardSkip = useCallback(() => {
  setMessages((prev) => prev.filter((m) => m.type !== "login_card"));
  // Remember the opt-out so a re-emitted `prompt_login` (the backend replays the
  // route-built prompt on resume) doesn't loop the card back into the thread.
  loginOptedOutRef.current = true;
  // Clear any armed post-login replay — there's no login coming, so nothing
  // should re-fire later if the user does sign in for something else.
  loginFlowArmedRef.current = false;
  pendingPostLoginAction.current = null;
  pendingRestoreResumeRef.current = false;
  // Resume silently — same guard the token-watch effect uses. Only append to an
  // existing thread we're allowed to resume (own/anonymous chat, not a foreign
  // itinerary); resume can only append, never create a thread. When there's no
  // resumable thread we simply retire the card and let the user carry on.
  if (canResumeAfterLoginRef.current && threadIdRef.current) {
    // `login_opted_out` goes at the ROOT of the request body (3rd arg), not in
    // the action payload — the backend reads the skip flag top-level.
    sendWidgetAction("resume_after_login", {}, { login_opted_out: true });
  }
}, [setMessages, sendWidgetAction, threadIdRef]);

  // ── Side-effects ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!error) setErrorDismissed(false);
  }, [error]);

  // Auto-dismiss the error toast as soon as the network comes back online.
  // The in-bubble error stays put (history is preserved) but the floating
  // toast is meaningless once connectivity returns.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onOnline = () => setErrorDismissed(true);
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);

  // User-driven scroll detach. Fast text_delta-driven re-renders run the
  // auto-scroll effect below before the `scroll` event the user just
  // triggered has had a chance to update isAtBottomRef — that race is what
  // makes the view snap back to the bottom while the user is trying to read
  // earlier messages. Listen for the user's actual gesture (wheel scrolling
  // up, or finger drag downward on touchscreens) and detach pinning
  // synchronously, before the browser even processes the scroll.
  useEffect(() => {
    const c = messagesScrollRef.current;
    if (!c) return;
    // Same gesture stream drives the phone header's auto-hide: reading forward
    // collapses it for the extra rows, reading back brings it in. Deliberately
    // hung off the user's gesture rather than the `scroll` event, so the
    // auto-scroll that follows every streamed token doesn't hide the header
    // (and with it the "typing…" status) on its own.
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) isAtBottomRef.current = false;
      if (e.deltaY > 4) setHeaderHidden(true);
      else if (e.deltaY < -4) setHeaderHidden(false);
    };
    let touchStartY = 0;
    let lastTouchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
      lastTouchY = touchStartY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? 0;
      // Finger dragging downward → content scrolls up → user is reading above.
      if (y - touchStartY > 5) isAtBottomRef.current = false;
      // Per-move delta (not the whole-gesture one above) so a long drag can
      // flip the header back mid-swipe.
      if (lastTouchY - y > 4) setHeaderHidden(true);
      else if (y - lastTouchY > 4) setHeaderHidden(false);
      lastTouchY = y;
    };
    c.addEventListener("wheel", onWheel, { passive: true });
    c.addEventListener("touchstart", onTouchStart, { passive: true });
    c.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      c.removeEventListener("wheel", onWheel);
      c.removeEventListener("touchstart", onTouchStart);
      c.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  useEffect(() => {
    // Don't auto-scroll to bottom when older messages are being prepended
    if (isFetchingMoreRef.current) return;
    // /chat?intake=1 landing: keep the view on Kaira's greeting rather than
    // snapping to the bottom of the injected intake form. Once a stream starts
    // (the user submitted the form / sent a message) resume normal auto-scroll.
    if (suppressIntakeAutoScrollRef.current) {
      if (!isStreaming) return;
      suppressIntakeAutoScrollRef.current = false;
    }
    // Respect the user's scroll position: if they've scrolled up to read
    // earlier messages, don't yank the view back down while streaming.
    if (!isAtBottomRef.current) return;
    // While a thread restore is still settling (widgets/images laying out)
    // OR a stream is actively producing text_deltas, snap instantly to the
    // absolute bottom — smooth scrollIntoView fires once and gets overtaken
    // by content that grows after, leaving intermediate streamed text
    // hidden below the viewport until the user manually scrolls.
    if (initialScrollPendingRef.current || isStreaming) {
      const c = messagesScrollRef.current;
      if (c) c.scrollTop = c.scrollHeight;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Custom in-thread cards grow *after* they mount: the stepped status loader
  // (StatusNotesCard) accumulates step lines, the inline login/OTP card and
  // intake/pricing forms lay out asynchronously, images/widgets settle late.
  // None of that flows through the `messages`-keyed effect above, so a single
  // scroll lands mid-card and the user has to nudge down to see the rest.
  // Watch the content wrapper's size and re-pin to the bottom on any growth —
  // but only while the user is already parked at the bottom (isAtBottomRef),
  // so a manual scroll-up to read earlier messages is never yanked back down.
  useEffect(() => {
    const content = messagesContentRef.current;
    const scroller = messagesScrollRef.current;
    if (!content || !scroller || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      // Prepending older messages / intake landing manage their own scroll.
      if (isFetchingMoreRef.current || suppressIntakeAutoScrollRef.current) return;
      if (!isAtBottomRef.current) return;
      scroller.scrollTop = scroller.scrollHeight;
    });
    ro.observe(content);
    return () => ro.disconnect();
  }, []);

  // Mobile: when the chat tab is hidden behind another tab, scrollIntoView
  // calls fired by the auto-scroll effect above don't reliably move the
  // scroll container — text_deltas streamed in the background grow the
  // assistant bubble off-screen, and on iOS Safari the hidden parent can
  // also leave the scrollHeight stale. When the panel becomes visible again,
  // re-route the auto-scroll through an instant snap (scrollTop = scrollHeight)
  // for a beat so any in-flight streaming, image loads, or widget layouts
  // park us at the bottom — without the user needing to refresh.
  const wasVisibleRef = useRef(isPanelVisible);
  useEffect(() => {
    if (wasVisibleRef.current === isPanelVisible) return;
    const becameVisible = !wasVisibleRef.current && isPanelVisible;
    wasVisibleRef.current = isPanelVisible;
    if (!becameVisible) return;
    if (!isAtBottomRef.current) return;

    const snapToBottom = () => {
      const c = messagesScrollRef.current;
      if (c) c.scrollTop = c.scrollHeight;
    };
    // Drive the auto-scroll effect down the "instant snap" branch so the
    // smooth scrollIntoView (which doesn't catch up to rapidly-growing
    // streaming content) is bypassed while content settles.
    initialScrollPendingRef.current = true;
    requestAnimationFrame(() => {
      snapToBottom();
      requestAnimationFrame(snapToBottom);
    });
    const timers = [50, 150, 300, 600, 1000].map((ms) =>
      setTimeout(() => {
        snapToBottom();
        if (ms === 1000) initialScrollPendingRef.current = false;
      }, ms),
    );
    return () => {
      timers.forEach(clearTimeout);
      initialScrollPendingRef.current = false;
    };
  }, [isPanelVisible]);

  // Index transfer.select edge ids → mode from live widget messages, so the
  // TransferEditDrawer can skip its mode-selection step when the user clicks.
  useEffect(() => {
    for (const m of messages) {
      if ((m as any)?.type === "widget") {
        indexEdgesFromWidget((m as any)?.widgetItem?.widget);
      }
    }
  }, [messages, indexEdgesFromWidget]);

  // Widget-pattern fallbacks for chat lifecycle events. The server-emitted
  // effects (display_transfers / itinerary_completion_process_completed)
  // don't replay when a thread is restored from history — but the widgets
  // they generated are still in `messages`. Scan for known signatures so the
  // events fire reliably across both fresh streams and restored threads.
  useEffect(() => {
    if (!messages?.length) return;

    // Recursively check whether any descendant action.type matches a target.
    const hasActionType = (node: any, targets: Set<string>): boolean => {
      if (!node || typeof node !== "object") return false;
      const actionType = node.onClickAction?.type as string | undefined;
      if (actionType && targets.has(actionType)) return true;
      const kids = Array.isArray(node.children) ? node.children : [];
      for (const c of kids) if (hasActionType(c, targets)) return true;
      return false;
    };

    const paymentTargets = new Set(["payment.start"]);
    const routeTargets = new Set([
      "route.lock",
      "route.confirm",
      "lock.route",
    ]);
    const itineraryLockTargets = new Set([
      "itinerary.lock",
      "itinerary.confirm",
    ]);
    // Evidence that a day-by-day itinerary was actually rendered. These
    // actions only exist inside itinerary content, so seeing any of them in a
    // restored thread proves `chat_itinerary_generated` happened — the effect
    // that normally reports it (`display_itinerary`) is never replayed on
    // restore, which is why that step used to under-count the ones after it.
    const itineraryTargets = new Set([
      "itinerary.view",
      "itinerary.edit",
      "activity.view",
      "activity.detail",
      "open_activity_drawer",
      "hotel.view",
      "hotel.detail",
      "open_hotel_drawer",
      "transfer.view",
      "transfer.select",
      "transfer.detail",
      "open_transfer_drawer",
    ]);

    let sawPayment = false;
    let sawRoute = false;
    let sawItinerary = false;
    let sawItineraryLock = false;
    for (const m of messages as any[]) {
      if (m?.type !== "widget") continue;
      const w = m?.widgetItem?.widget;
      if (!sawPayment && hasActionType(w, paymentTargets)) sawPayment = true;
      if (!sawRoute && hasActionType(w, routeTargets)) sawRoute = true;
      if (!sawItinerary && hasActionType(w, itineraryTargets))
        sawItinerary = true;
      if (!sawItineraryLock && hasActionType(w, itineraryLockTargets))
        sawItineraryLock = true;
      if (sawPayment && sawRoute && sawItinerary && sawItineraryLock) break;
    }
    // The live path sets this when `display_itinerary` lands; include it so a
    // fresh stream is covered even if its widgets use a shape the scan misses.
    if (hasDisplayItinerary) sawItinerary = true;

    // Order matters: report the earliest stage first so back-fill has the
    // least work to do and each stage carries its own trigger.
    if (sawRoute) {
      reportChatStage("chat_route_confirmed");
    }
    if (sawItinerary || sawItineraryLock || sawPayment) {
      // Any of these widgets can only exist once the itinerary was generated.
      reportChatStage("chat_itinerary_generated");
    }
    if (sawItineraryLock || sawPayment) {
      // A "Make Payment" widget only shows up after the itinerary is locked,
      // so payment widgets imply confirmation too.
      reportChatStage("chat_itinerary_confirmed");
    }
    if (sawPayment) {
      reportChatStage("chat_price_received");
    }
  }, [messages, hasDisplayItinerary, reportChatStage]);

useEffect(() => {
  if (initialPrompt && !hasProcessedInitial.current && locationReady) {
    // Suppress the auto inject.context only for the exact auto-seeded
    // post-completion summary prompt (set by restoreLatestThread on P2
    // restore / fromTailored). A broader keyword match here also caught
    // user-typed prompts containing "itinerary", which silenced the
    // post-completion summary on the bot-create path.
    if (initialPrompt === "Hey Kaira! provide summary of my itinerary") {
      hasInjectedContextRef.current = true;
    }
    // Defer prompts that require login: queue as the post-login message and
    // show the existing login/signup CTA. The authToken-change effect below
    // will fire the queued message once the user authenticates.
    if (initialPromptRequiresLogin && !isLoggedIn) {
      hasProcessedInitial.current = true;
      pendingPostLoginAction.current = { kind: "message", text: initialPrompt };
      loginFlowArmedRef.current = true;
      setShowLoginPrompt(true);
      onInitialPromptConsumed?.();
      return;
    }
    hasProcessedInitial.current = true;
    // A prompt seeded from a theme page carries that page's structured `intake`
    // (slug, source, whatever the prompt states about month/nights/pax, the
    // saved items), so hero / ask-bar / card sends land on /chatkit in the same
    // request shape as the themed mini-form's submission — `form_submitted` at
    // the root and the context under `intake`. Undefined for every other seed —
    // the homepage hero, a restored thread — which sends exactly as before.
    sendMessage(
      initialPrompt,
      initialAttachmentIds,
      undefined,
      themeIntakeRef.current
        ? { formSubmitted: true, intakePayload: themeIntakeRef.current }
        : undefined,
    );
    onInitialPromptConsumed?.();
  }
}, [initialPrompt, initialPromptRequiresLogin, isLoggedIn, initialAttachmentIds, locationReady, sendMessage, onInitialPromptConsumed]);

  useEffect(() => {
    onSendReady?.(sendMessage);
  }, [onSendReady, sendMessage]);

  // ── Inject context when itinerary is fully completed ──────────────────────
  useEffect(() => {
    if (itineraryCompleted && !hasInjectedContextRef.current && !isStreaming) {
      hasInjectedContextRef.current = true;
      if(isLoggedIn) {
        if (threadIdRef.current) {
          // Live build: a chat thread already exists — append the overview as a
          // hidden context action on that thread.
          sendWidgetAction("inject.context", { message: "Provide short overview of the trip" });
        } else {
          // Fresh clone: clearMessages() nulled threadIdRef, and sendWidgetAction
          // bails on a null thread_id (it can only append, never create). Seed
          // the overview as a first message so useChat creates the clone's new
          // thread and the P2 context fires against the right thread_id.
          sendMessage("Hey Kaira! provide summary of my itinerary");
        }
      }
    }
  }, [itineraryCompleted, isStreaming, sendWidgetAction, sendMessage]);

useEffect(() => {
  const tokenJustArrived =
    !!authToken && !prevAuthTokenRef.current;
  prevAuthTokenRef.current = authToken ?? null;

  if (!tokenJustArrived) return;                    // only fire on login transition
  if (postLoginFiredRef.current) return;

  const action = pendingPostLoginAction.current;
  const restoreResume = pendingRestoreResumeRef.current;
  // Nothing to do unless we captured a prompt/action to replay OR a logged-out
  // restore armed a silent resume (the injected login card case).
  if (!action && !restoreResume) return;

  postLoginFiredRef.current = true;
  pendingPostLoginAction.current = null;
  pendingRestoreResumeRef.current = false;

  setShowLoginModal(false);
  setShowLoginPrompt(false);
  setPostLoginLoading(false);
  setInput("");

  // One tick defer — lets useChat re-render with new authToken (and Redux user
  // info) before sending.
  setTimeout(() => {
    // Preferred path: resume the conversation silently. Rather than re-sending
    // the user's previous prompt (which shows a duplicate user bubble), fire a
    // `resume_after_login` custom action with an empty payload — the backend
    // picks the thread back up on its own. Requires an existing thread (the
    // action can only append, never create); gated to the current user's own /
    // anonymous chat or a staff user. On a foreign itinerary, or before any
    // thread exists (e.g. a login-gated initial prompt that must still create
    // the thread), we fall back to the legacy replay so nothing regresses.
    if (canResumeAfterLoginRef.current && threadIdRef.current) {
      sendWidgetAction("resume_after_login", {});
      return;
    }
    // Legacy replay only applies when we captured a prompt/action (the restore
    // login-card path has none — a foreign viewer simply gets nothing replayed).
    if (!action) return;
    if (action.kind === "widget") {
      sendWidgetAction(action.type, action.payload);
    } else {
      sendMessage(action.text);
    }
  }, 100);
}, [authToken, sendMessage, sendWidgetAction]);

// ── Reset on logout ───────────────────────────────────────────────────────
useEffect(() => {
  if (!isLoggedIn) {
    postLoginFiredRef.current = false;
    prevAuthTokenRef.current = null;
    setPostLoginLoading(false);
  }
}, [isLoggedIn]);

  useEffect(() => {
    setLocalItineraryId(itineraryId);
  }, [itineraryId]);

  // Convert raw thread items (from threads.get_by_id payloads) into Message[]
  const parseThreadItems = useCallback((items: any[]): Message[] => {
    const out: Message[] = [];
    // A reasoning `workflow` item precedes the assistant_message it produced.
    // The per-step thoughts aren't persisted, but its `summary.duration` is —
    // stash it here and attach it to the next assistant_message so we can show
    // the collapsed "Thought for {duration}s" label above that reply on reload.
    let pendingReasoningDuration: number | null = null;
    for (const item of items ?? []) {
      if (item.type === "user_message") {
        // A fresh user turn — any dangling reasoning duration belongs to the
        // previous turn and had no visible reply to attach to; drop it.
        pendingReasoningDuration = null;
        const text = item.content?.find((c: any) => c.type === "input_text")?.text ?? "";

        // Extract attachments — server may return them as a sibling array of
        // {id, name, mime_type, url, ...} objects, as plain id strings, or as
        // input_image / input_file content parts. Handle all shapes.
        const attachmentObjs: MessageAttachment[] = [];
        if (Array.isArray(item.attachments)) {
          for (const a of item.attachments) {
            if (typeof a === "string") {
              attachmentObjs.push({ id: a });
            } else if (a && typeof a === "object") {
              attachmentObjs.push({
                id: a.id,
                name: a.name,
                mimeType: a.mime_type ?? a.mimeType,
                previewUrl: a.url ?? a.preview_url ?? a.download_url,
              });
            }
          }
        }
        if (Array.isArray(item.content)) {
          for (const c of item.content) {
            if (c?.type === "input_image" || c?.type === "input_file") {
              attachmentObjs.push({
                id: c.attachment_id ?? c.id ?? "",
                name: c.name,
                mimeType: c.mime_type ?? c.mimeType,
                previewUrl: c.url ?? c.image_url,
              });
            }
          }
        }

        // Per-message sender identity (threads.get_by_id now returns these on
        // each user_message). Carried onto the Message so the avatar can prefer
        // the message's own customer_name on reload, and so a staff viewer's own
        // messages resolve to their photo. See UserAvatar in MessageBubble.
        const senderUserId =
          item.user_id != null && item.user_id !== "" ? item.user_id : undefined;
        const messageCustomerName =
          typeof item.customer_name === "string" && item.customer_name.trim()
            ? item.customer_name.trim()
            : undefined;

        if (text || attachmentObjs.length > 0) out.push({
          id: item.id, role: "user", content: text,
          timestamp: new Date(item.created_at),
          ...(senderUserId != null ? { senderUserId } : {}),
          ...(messageCustomerName ? { customerName: messageCustomerName } : {}),
          ...(attachmentObjs.length > 0 ? { attachments: attachmentObjs } : {}),
        });
      } else if (item.type === "assistant_message") {
        const text = item.content?.find((c: any) => c.type === "output_text")?.text ?? "";
        if (text) {
          out.push({
            id: item.id, role: "assistant", content: text,
            timestamp: new Date(item.created_at), isStreaming: false,
            ...(pendingReasoningDuration != null
              ? { reasoningDuration: pendingReasoningDuration }
              : {}),
          });
          pendingReasoningDuration = null;
        }
      } else if (item.type === "workflow") {
        // Reasoning workflow — carry its duration to the next assistant reply.
        const dur = item.workflow?.summary?.duration;
        if (
          item.workflow?.type === "reasoning" &&
          typeof dur === "number" &&
          dur > 0
        ) {
          pendingReasoningDuration = dur;
        }
      } else if (item.type === "widget") {
        // Intake-form widgets restore as the interactive IntakeForm card, not
        // the raw widget placeholder — but only when the form hasn't been
        // submitted yet (`form_filled === false`). Once filled, the card is
        // dropped from the transcript entirely. Redux seeding is handled in the
        // restore effect below.
        if (isIntakeFormWidgetId(item.widget?.id)) {
          if (!restoredFormFilledRef.current) {
            out.push({
              id: item.id, role: "assistant", content: "",
              timestamp: new Date(item.created_at),
              type: "intake_form",
            });
          }
        } else if (isPricingFormWidgetId(item.widget?.id)) {
          // Pricing form is the final-confirmation step. Restore the interactive
          // card only while it hasn't been submitted yet
          // (`confirm_pricing_form_submitted === false`); once submitted it's
          // dropped from the transcript. Redux seeding is handled in the restore
          // effect below.
          if (!restoredPricingSubmittedRef.current) {
            out.push({
              id: item.id, role: "assistant", content: "",
              timestamp: new Date(item.created_at),
              type: "pricing_form",
            });
          }
        } else {
          indexEdgesFromWidget(item.widget);
          out.push({
            id: item.id, role: "assistant", content: "",
            timestamp: new Date(item.created_at),
            type: "widget", widgetItem: { id: item.id, widget: item.widget },
          });
        }
      }
    }
    return out;
  }, []);

  useEffect(() => {
  if (!restoredThread || !setMessages) return;
  // Guard: only apply each restoredThread payload ONCE. The effect's callback
  // deps (onRouteReceived/onItineraryReceived/etc.) change identity when their
  // parent state mutates (e.g. shimmer_day_by_day flips viewMode/activeItineraryId),
  // which would otherwise re-run the body mid-stream and call setMessages(restored)
  // on top of a placeholder + streaming text — wiping the in-flight message.
  if (appliedRestoredThreadRef.current === restoredThread) return;
  // Also skip if a stream is active — restoring the previous transcript on top
  // of the live placeholder is never what we want.
  if (isStreaming) return;
  appliedRestoredThreadRef.current = restoredThread;

  // A thread the user chose to continue without login carries a root-level
  // `login_opted_out: true`. Mirror it into the ref (resetting to false for
  // threads without it) so this restore — and any re-emitted `prompt_login` on
  // it — suppresses the inline card and leaves the composer/quick replies
  // unblocked. Absent/false key → current flow (card shown, composer gated).
  loginOptedOutRef.current = restoredThread.login_opted_out === true;

  // Set before parseThreadItems runs — it (and pagination) reads this to decide
  // whether the intake-form card is restored into the transcript.
  restoredFormFilledRef.current = restoredThread.form_filled === true;
  // Same gate for the pricing form — restore the card only when pricing hasn't
  // been submitted yet.
  restoredPricingSubmittedRef.current =
    restoredThread.confirm_pricing_form_submitted === true;

  const restored = parseThreadItems(restoredThread.items?.data ?? []);

    const itineraryEffects: any[] = restoredThread.itinerary_effects ?? [];
    const mapEffects: any[] = restoredThread.map_effects ?? [];

  // ── Restore the in-chat intake form ───────────────────────────────────────
  // When the thread carries an intake-form widget that hasn't been submitted
  // (`form_filled === false`), parseThreadItems restores the card and we re-seed
  // the Redux slice from the widget's encoded prefill so it shows the prefilled
  // values. When `form_filled === true` the user already submitted, so we drop
  // the card entirely and deactivate the slice (clearing any stale active state
  // carried over from a prior thread, which would otherwise lock the composer).
  const intakeWidgetItem = (restoredThread.items?.data ?? []).find(
    (it: any) => it?.type === "widget" && isIntakeFormWidgetId(it?.widget?.id),
  );
  if (intakeWidgetItem && !restoredFormFilledRef.current) {
    const prefill = parseIntakeFormWidgetId(intakeWidgetItem.widget?.id);
    if (prefill) {
      // Restored backend form — persists across follow-up messages.
      intakeFormFromBackendRef.current = true;
      const restoredPrefill = parseShowIntakeForm(prefill);
      dispatch(
        updateIntakeForm({
          active: true,
          completed: false,
          loading: false,
          ...restoredPrefill,
        }),
      );
      // The backend already knows this restored prefill — baseline the synced
      // context to it so only the user's own later edits ride along with a
      // typed message.
      lastIntakeContextRef.current =
        composePartialIntakeContext({
          ...intakeFormSliceRef.current,
          ...restoredPrefill,
        }) || null;
      // Already injected from history — block the live widget/effect path
      // from adding a second card in this session.
      intakeFormInjectedRef.current = true;
      onIntakeFormStart?.();
    }
  } else {
    // No unfilled intake form to show for this thread — either it carries no
    // intake widget at all, or the form was already submitted
    // (`form_filled === true`). Deactivate the slice so any stale `active`
    // state carried over from a previously-restored thread is cleared. The
    // reducer only merges (never resets on thread change), so without this a
    // prior thread's `active: true` would leave a stale intake card marked
    // active after switching threads. (Case 2 fix.)
    intakeFormFromBackendRef.current = false;
    dispatch(updateIntakeForm({ active: false, completed: false }));
  }

  // ── Restore the in-chat pricing form ──────────────────────────────────────
  // When the thread carries a pricing-form widget that hasn't been submitted
  // (`confirm_pricing_form_submitted === false`), parseThreadItems restores the
  // card and we re-seed the Redux slice from the widget's encoded prefill so it
  // shows the prefilled toggles/city. When submitted (or absent) we deactivate
  // the slice so a stale `active` from a prior thread doesn't linger, and reset
  // the one-shot injection guard so a fresh pricing-form widget can inject its
  // card in this restored session.
  const pricingWidgetItem = (restoredThread.items?.data ?? []).find(
    (it: any) => it?.type === "widget" && isPricingFormWidgetId(it?.widget?.id),
  );
  if (pricingWidgetItem && !restoredPricingSubmittedRef.current) {
    const prefill = parsePricingFormWidgetId(pricingWidgetItem.widget?.id);
    if (prefill) {
      dispatch(
        updatePricingForm({
          active: true,
          completed: false,
          loading: false,
          ...parsePricingCardCopy(pricingWidgetItem.widget),
          ...parseShowPricingForm(prefill),
        }),
      );
      // Already injected from history — block the live widget/effect path from
      // adding a second card in this session.
      pricingFormInjectedRef.current = true;
    } else {
      dispatch(updatePricingForm({ active: false, completed: false, loading: false }));
      pricingFormInjectedRef.current = false;
    }
  } else {
    dispatch(updatePricingForm({ active: false, completed: false, loading: false }));
    pricingFormInjectedRef.current = false;
  }

  for (const effect of itineraryEffects) {
    if (effect.name === "itinerary_entities" && effect.data?.entities) {
      setEntities(prev => ({ ...prev, ...effect.data.entities }));
    }
  }

  // ── Replay map effects so city pins + POI pins render on thread reload ──
  for (const effect of mapEffects) {
    if (!effect?.data) continue;
    switch (effect.name) {
      case "focus_route": {
        // Route can be either { data: [...] } or a raw array — normalise
        const routeData = Array.isArray(effect.data)
          ? { data: effect.data }
          : effect.data;
        onRouteReceived(routeData as { data: Location[] });
        break;
      }
      case "display_pois_on_map":
      case "show_attraction_on_map":
      case "focus_on_map": {
        const poiData = Array.isArray(effect.data)
          ? { data: effect.data }
          : effect.data;
        onLocationReceived(poiData as { data: Location[] });
        break;
      }
      default:
        break;
    }
  }

  // ── Replay itinerary + transfers so the right panel re-populates on reload ─
  // Also replay endpoint pins from the latest endpoint-bearing effect, so the
  // map re-hydrates origin/departure pins on thread reload.
  //
  // If the thread already emitted an `itinerary_completion_process_completed`
  // effect (i.e. the trip has reached P2), skip replaying the draft-shaped
  // display_itinerary / display_transfers. These transform into a
  // status="Draft" itinerary and clobber the real P2 data that the
  // ItineraryContainer fetches for the finalized trip — which is what made
  // P1 start-city pins resurface on P2 reloads.
  const threadIsCompleted = itineraryEffects.some(
    (e: any) => e?.name === "itinerary_completion_process_completed" && e?.data?.itinerary_id,
  );

  let latestEndpointEffect: { name: string; data: Record<string, unknown> } | null = null;
  let restoredHasDisplayItinerary = false;
  for (const effect of itineraryEffects) {
    if (effect.name === "display_itinerary" && effect.data?.itinerary) {
      // Pass full effect.data so root-level pax + travel-date survive the
      // reload replay (handler unwraps `.itinerary` for the route shape).
      if (!threadIsCompleted) onItineraryReceived(effect.data);
      latestEndpointEffect = effect;
      restoredHasDisplayItinerary = true;
    } else if (effect.name === "display_transfers" && effect.data) {
      indexTransfersForLookup(effect.data);
      if (!threadIsCompleted) onItineraryReceived(effect.data);
      latestEndpointEffect = effect;
    } else if (effect.name === "shimmer_day_by_day" && effect.data) {
      latestEndpointEffect = effect;
    }
  }
  // Endpoint pins are only meaningful in P1; the P2 itinerary renders its
  // own start/end city pins via the normal itinerary path.
  if (latestEndpointEffect && !threadIsCompleted) {
    emitEndpointsFromEffect(latestEndpointEffect.name, latestEndpointEffect.data);
  }

  if (restoredHasDisplayItinerary) setHasDisplayItinerary(true);

  // ── Re-inject the inline sign-in card on a logged-out restore ─────────────
  // When the LAST client effect this thread emitted is `prompt_login` (the
  // backend's "sign in to save our work" gate), the viewer is logged out, and
  // they haven't already skipped it (`login_opted_out`), replay the gate on
  // reload: drop the effect's lead-in message bubble + the inline login card as
  // the final messages, mirroring the live `prompt_login` handler so a refresh
  // mid-gate looks identical to the moment the effect first arrived. Arm the
  // silent post-login resume — there's no user prompt/action to replay here, so
  // on login success the token-watch effect resumes the thread via
  // `resume_after_login` instead of re-sending anything.
  const lastEffect = itineraryEffects[itineraryEffects.length - 1];
  if (
    !isLoggedIn &&
    !loginOptedOutRef.current &&
    lastEffect?.name === "prompt_login"
  ) {
    const base = Date.now();
    const threadKey = restoredThread.id ?? sessionIdRef.current;
    const loginMessage =
      typeof lastEffect.data?.message === "string"
        ? lastEffect.data.message.trim()
        : "";
    if (loginMessage) {
      restored.push({
        id: `login-msg-${threadKey}-${base}`,
        role: "assistant",
        content: loginMessage,
        timestamp: new Date(),
        type: "text",
      });
    }
    restored.push({
      id: `login-card-${threadKey}-${base}`,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      type: "login_card",
    });
    loginFlowArmedRef.current = true;
    pendingRestoreResumeRef.current = true;
  }

  if (restored.length > 0) {
    // Restore the transcript exactly as it was. Aside from the logged-out
    // `prompt_login` re-injection handled just above, no inline sign-in card is
    // added on refresh: in P1 (chat-only stage) a logged-out viewer may keep
    // chatting anonymously, so the composer stays open and the backend re-emits
    // `prompt_login` if/when an action genuinely needs an account.
    setMessages(restored);
    // Land at the bottom of the restored transcript. Widgets and images lay
    // out asynchronously, so the scrollable height keeps growing for a beat
    // after setMessages — a single rAF snap leaves the user mid-thread.
    // Keep snapping for ~1s; the auto-scroll effect also honours this flag
    // so it uses instant scroll instead of smooth animation in the meantime.
    initialScrollPendingRef.current = true;
    isAtBottomRef.current = true;
    const snapToBottom = () => {
      const c = messagesScrollRef.current;
      if (!c) return;
      c.scrollTop = c.scrollHeight;
    };
    requestAnimationFrame(() => {
      snapToBottom();
      requestAnimationFrame(snapToBottom);
    });
    const timers = [50, 150, 300, 600, 1000].map((ms) =>
      setTimeout(() => {
        snapToBottom();
        if (ms === 1000) initialScrollPendingRef.current = false;
      }, ms),
    );
    // Best-effort cleanup if the effect re-runs (e.g. switching to another
    // restored thread); harmless if timers already fired.
    void timers;
  }

  // Freeze CTAs on every widget restored from history — those interactions
  // belong to a past session and shouldn't be re-clickable.
  const restoredWidgetIds = restored
    .filter((m) => (m as any).type === "widget")
    .map((m) => m.id)
    .filter((id): id is string => typeof id === "string" && id.length > 0);
  if (restoredWidgetIds.length > 0) {
    setDisabledWidgetIds((prev) => {
      const next = new Set(prev);
      for (const id of restoredWidgetIds) next.add(id);
      return next;
    });
  }

  // Restore thread_id so subsequent messages work
  if (restoredThread.id) threadIdRef.current = restoredThread.id;

  // Capture pagination cursor + has_more from items envelope
  hasMoreRef.current = !!restoredThread.items?.has_more;
  // Use the API-supplied `before` cursor if present, else fall back to oldest msg id
  beforeCursorRef.current =
    (restoredThread.items?.before as string | null) ??
    (restored.length > 0 ? restored[0].id : null);

  // Restore quick replies — use the LAST load_quick_replies effect so the
  // most recent set of suggestions is shown (effects are appended in order).
  const qrEffects = (restoredThread.itinerary_effects ?? []).filter(
    (e: any) => e.name === "load_quick_replies"
  );
  const qrEffect = qrEffects.length > 0 ? qrEffects[qrEffects.length - 1] : null;
  if (qrEffect?.data?.quick_replies) {
    setQuickReplies(qrEffect.data.quick_replies.map((r: string) => ({ label: r })));
  }
}, [restoredThread, isStreaming, parseThreadItems, onRouteReceived, onLocationReceived, onItineraryReceived, indexTransfersForLookup, emitEndpointsFromEffect, dispatch, onIntakeFormStart]);

  // ── Pagination: fetch older messages ──────────────────────────────────────
  const fetchOlderMessages = useCallback(async () => {
    if (isFetchingMoreRef.current) return;
    if (!hasMoreRef.current) return;
    const threadId = threadIdRef.current;
    if (!threadId) return;
    const beforeId = beforeCursorRef.current;
    if (!beforeId) return;

    isFetchingMoreRef.current = true;
    setIsLoadingMore(true);

    // Preserve scroll position so the visible window doesn't jump
    const container = messagesScrollRef.current;
    const prevScrollHeight = container?.scrollHeight ?? 0;
    const prevScrollTop = container?.scrollTop ?? 0;

    try {
      const res = await fetch(CHATKIT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          type: "threads.get_by_id",
          params: { thread_id: threadId, before: beforeId },
          platform: getPlatform(),
        }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();

      const olderItems = data.items?.data ?? [];
      const older = parseThreadItems(olderItems);

      hasMoreRef.current = !!data.items?.has_more;
      beforeCursorRef.current =
        (data.items?.before as string | null) ??
        (older.length > 0 ? older[0].id : null);

      if (older.length > 0) {
        setMessages((prev) => [...older, ...prev]);

        // After DOM updates, restore scroll offset relative to new content height
        requestAnimationFrame(() => {
          const c = messagesScrollRef.current;
          if (!c) return;
          const newScrollHeight = c.scrollHeight;
          c.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
        });
      }
    } catch (err) {
      console.error("[fetchOlderMessages]", err);
    } finally {
      isFetchingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [authToken, parseThreadItems, setMessages]);

  // Detect scroll near top → load more. Also track whether the user is at
  // the bottom so the auto-scroll effect can respect their position.
  const handleMessagesScroll = useCallback(() => {
    const c = messagesScrollRef.current;
    if (!c) return;
    const distanceFromBottom = c.scrollHeight - c.scrollTop - c.clientHeight;
    isAtBottomRef.current = distanceFromBottom < 80;
    // Back at the top of the thread (or nothing to scroll) → the header is
    // always shown, whichever way the last gesture went.
    if (c.scrollTop <= 8 || c.scrollHeight - c.clientHeight < 120) {
      setHeaderHidden(false);
    }
    if (c.scrollTop <= PAGINATION_SCROLL_THRESHOLD) {
      fetchOlderMessages();
    }
  }, [fetchOlderMessages]);

  // ── Handlers ──────────────────────────────────────────────────────────────
const handleShowLogin = useCallback(() => {
  const currentInput = inputRef.current.trim();
  // Preserve an existing queued action (e.g. an initialPrompt already
  // stashed by the restore flow) if the user opens the modal without
  // typing anything new — otherwise we'd clobber it and the post-login
  // send would be a no-op.
  if (currentInput) {
    pendingPostLoginAction.current = { kind: "message", text: currentInput };
  } else if (lastSentActionRef.current) {
    pendingPostLoginAction.current = lastSentActionRef.current;
  } else if (lastSentMessageRef.current) {
    pendingPostLoginAction.current = { kind: "message", text: lastSentMessageRef.current };
  }
  loginFlowArmedRef.current = true;
  setShowLoginModal(true);
}, []);

  // ── Attachment handlers ─────────────────────────────────────────────────
  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const entry: AttachmentFile = {
          id: tempId,
          name: file.name,
          size: file.size,
          mimeType: file.type || "application/octet-stream",
          status: "uploading",
          file,
        };
        setAttachments((prev) => [...prev, entry]);

        try {
          // Step 1: Create attachment record
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          };
          const createBody: Record<string, unknown> = {
            type: "attachments.create",
            params: {
              name: file.name,
              size: file.size,
              mime_type: file.type || "application/octet-stream",
            },
            model: selectedModel,
            user_location: userLocationData,
            platform:
              typeof window !== "undefined" && window.innerWidth < 768
                ? "mobile"
                : "desktop",
            session_id: sessionIdRef.current,
            ...(authToken ? { access_token: authToken } : {}),
            ...(reduxUserId != null ? { user_id: reduxUserId } : {}),
          };

          const createRes = await fetch(CHATKIT_API_URL, {
            method: "POST",
            headers,
            body: JSON.stringify(createBody),
          });
          if (!createRes.ok) throw new Error(`Create failed: ${createRes.status}`);
          const createData = await createRes.json();
          console.log("[Attachment create response]", createData);
          const serverId: string = createData.id;
          const uploadUrl: string = createData.upload_descriptor?.url;

          if (!uploadUrl) throw new Error("No upload URL returned");

          // Step 2: Upload file
          const formData = new FormData();
          formData.append("file", file);
          const uploadRes = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
          });
          if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);

          // Replace temp entry with server ID and mark uploaded
          setAttachments((prev) =>
            prev.map((a) =>
              a.id === tempId ? { ...a, id: serverId, status: "uploaded" as const } : a,
            ),
          );
        } catch (err) {
          console.error("[Attachment upload error]", err);
          setAttachments((prev) =>
            prev.map((a) =>
              a.id === tempId ? { ...a, status: "error" as const } : a,
            ),
          );
        }
      }
    },
    [authToken, selectedModel, userLocationData, reduxUserId],
  );

  // ── Hero handoff consumers ─────────────────────────────────────────────
  // `initialFiles` come from BotApp via the homepage hero. Push them
  // through the regular upload pipeline once on mount; the upload status
  // chips in MessageInputBox show progress to the user.
  const hasConsumedInitialFilesRef = useRef(false);
  useEffect(() => {
    if (hasConsumedInitialFilesRef.current) return;
    if (!initialFiles || initialFiles.length === 0) return;
    hasConsumedInitialFilesRef.current = true;
    handleFilesSelected(initialFiles);
  }, [initialFiles, handleFilesSelected]);

  // `initialInputText` pre-fills the composer (NOT auto-sent). The user
  // reviews seed + uploaded attachments and clicks send. Only runs once
  // and only when the composer is empty to avoid clobbering user input.
  const hasConsumedInitialInputRef = useRef(false);
  useEffect(() => {
    if (hasConsumedInitialInputRef.current) return;
    if (!initialInputText) return;
    hasConsumedInitialInputRef.current = true;
    setInput((prev) => (prev && prev.trim() ? prev : initialInputText));
  }, [initialInputText]);

  const handleRemoveAttachment = useCallback(
    async (id: string) => {
      const target = attachments.find((a) => a.id === id);
      // Always remove from local state immediately for snappy UX
      setAttachments((prev) => prev.filter((a) => a.id !== id));

      // Skip server delete for entries that never got a server-assigned id
      if (!target || target.status !== "uploaded" || id.startsWith("temp-")) return;

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        };
        const body: Record<string, unknown> = {
          type: "attachments.delete",
          params: { attachment_id: id },
          model: selectedModel,
          user_location: userLocationData,
          platform:
            typeof window !== "undefined" && window.innerWidth < 768
              ? "mobile"
              : "desktop",
          ...(localItineraryId ? { itinerary_id: localItineraryId } : {}),
          session_id: sessionIdRef.current,
          ...(authToken ? { access_token: authToken } : {}),
          ...(reduxUserId != null ? { user_id: reduxUserId } : {}),
        };
        const res = await fetch(CHATKIT_API_URL, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      } catch (err) {
        console.error("[Attachment delete error]", err);
      }
    },
    [attachments, authToken, selectedModel, userLocationData, localItineraryId, reduxUserId],
  );

  const handleSubmit = useCallback(() => {
    setShowLoginPrompt(false);
    const hasText = !!input.trim();
    const uploadedAttachments = attachments.filter((a) => a.status === "uploaded");
    // Block sending while itinerary creation is in progress
    if (isItineraryCompleting) return;
    if ((!hasText && uploadedAttachments.length === 0) || isStreamingResponse) return;
    setErrorDismissed(true);
    const attachmentIds = uploadedAttachments.map((a) => a.id);
    // Build attachment metadata with persistent object URLs for inline preview
    // in the just-sent user message bubble
    const attachmentMeta: MessageAttachment[] = uploadedAttachments.map((a) => ({
      id: a.id,
      name: a.name,
      mimeType: a.mimeType,
      previewUrl: a.mimeType.startsWith("image/")
        ? URL.createObjectURL(a.file)
        : undefined,
    }));
    // A genuine new chat turn → suppress the clone CTA for the rest of this
    // page session (it only shows once per refresh).
    setCloneCtaSuppressed(true);
    sendMessage(
      input.trim(),
      attachmentIds.length > 0 ? attachmentIds : undefined,
      attachmentMeta.length > 0 ? attachmentMeta : undefined,
    );
    setInput("");
    setAttachments([]);
  }, [input, isStreamingResponse, sendMessage, attachments, isItineraryCompleting]);

  const handleQuickReply = useCallback(
    (reply: QuickReply) => {
      if (isStreaming) return;
      // Block quick replies while itinerary creation is in progress
      if (isItineraryCompleting) return;
      // Block when viewing someone else's itinerary (non-staff)
      if (isForeignItinerary) return;
      // Gate logged-out users behind login — only in P2. In P1 (chat-only
      // stage) logged-out users may chat anonymously; the backend prompts for
      // login itself (prompt_login) once it actually needs an account.
      if (!isLoggedIn && botMode === "p2") {
        setShowLoginModal(true);
        return;
      }
      // A genuine new chat turn → suppress the clone CTA for the rest of this
      // page session (it only shows once per refresh).
      setCloneCtaSuppressed(true);
      sendMessage(reply.value ?? reply.label);
      // Clear any half-typed message so it can't be sent on the streaming tail
      // of the turn this quick reply just kicked off.
      setInput("");
    },
    [isStreaming, sendMessage, isItineraryCompleting, isLoggedIn, isForeignItinerary, botMode],
  );

  const showError = !!error && !errorDismissed;

  // Identifier for the newest user message — used by StatusNotesCard to
  // reset itself whenever the user kicks off a new turn.
  const lastUserMessageId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") return messages[i].id ?? null;
    }
    return null;
  }, [messages]);

  // While streaming, the assistant either has visible content/progress/tasks
  // already (→ "typing…") or is still just showing the dots placeholder
  // (→ "thinking…"). Pre-stream, before any assistant message exists, we
  // also treat it as thinking.
  const isStreamingDotsOnly = useMemo(() => {
    if (!isStreaming) return false;
    let lastAssistant: Message | null = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") {
        lastAssistant = messages[i];
        break;
      }
    }
    if (!lastAssistant) return true;
    const hasContent = !!lastAssistant.content;
    const hasProgress = (lastAssistant.progressSteps?.length ?? 0) > 0;
    const hasTasks = (lastAssistant.thinkingTasks?.length ?? 0) > 0;
    return !hasContent && !hasProgress && !hasTasks;
  }, [isStreaming, messages]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    // Hands the theme slug to every widget in the thread, so a route card's
    // primary CTA can paint in the theme page's accent (see useWidgetAccent).
    <WidgetThemeProvider value={themeSlug}>
    <div
      className={`kp-root flex flex-col h-full min-h-0 bg-white max-h-[100dvh] border-[0.5px] border-l-[#e5e5e5] overflow-x-hidden`}
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <ChatPanelStyles />
      {/* ── Top bar — mirrors chat-active-v2.html .chat-header ──────────── */}
      <div className={`kp-header${headerHidden ? " is-hidden" : ""}`}>
        <div className="kp-header-ava">
          <img src="/KairaInsta.png" alt="Kaira" />
          <span className="kp-dot" />
        </div>
        <div className="kp-header-info">
          <div className="kp-header-name">
            Kaira
            <span className="font-normal hidden md:inline text-[#445069]"> · Your AI Trip Planner</span>
          </div>
          <div
            className={`kp-header-status ${
 isStreaming || isItineraryCompleting || isItineraryPolling ? "thinking" : ""
 }`}
          >
            <span>
              {isItineraryPolling
                ? "updating itinerary…"
                : isItineraryCompleting
                ? "building itinerary…"
                : isStreaming
                ? isStreamingDotsOnly
                  ? "thinking…"
                  : "typing…"
                : isLoadingLocation
                ? "locating…"
                : "online · ~2s reply"}
            </span>
          </div>
        </div>
        {/* Staff-only: release the itinerary to the customer. Sits at the right
            corner of Kaira's header — `.kp-header-info` is flex:1, so a trailing
            child lands there without extra layout. Desktop only: `!isMobile`
            keeps it off phones entirely (no mount, no GET), where this row is
            already carrying the menu. */}
        {isStaffUser && !isMobile && (
          <ReleaseItineraryCta
            itineraryId={localItineraryId}
            className="max-ph:hidden"
          />
        )}
        {mobileMenu && <div className="md:hidden flex-shrink-0">{mobileMenu}</div>}
        {/* <button
          onClick={() => setShowControls((v) => !v)}
          className="ttw-type-small text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          Settings
        </button> */}
      </div>

      {/* ── Settings panel ────────────────────────────────────────────────── */}
      {showControls && (
        <div className="flex-shrink-0 flex flex-wrap items-center gap-x-6 gap-y-2 px-[0.25rem] md:!px-4 py-2.5 bg-gray-50 border-b border-gray-100 ttw-type-small">
          <label className="flex items-center gap-2 text-gray-600">
            Planner
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-400 ttw-type-small"
            >
              <option value="high">Deep Planner</option>
              <option value="medium">Quick Planner</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-gray-600">
            Bot
            <select
              value={botMode}
              onChange={(e) => onBotModeChange?.(e.target.value as BotMode)}
              className="border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-400 ttw-type-small"
            >
              <option value="p1">Kaira P1</option>
              <option value="p2">Kaira P2</option>
            </select>
          </label>
          {botMode === "p2" && (
            <label className="flex items-center gap-2 text-gray-600">
              Itinerary ID
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={localItineraryId}
                  onChange={(e) => setLocalItineraryId(e.target.value)}
                  placeholder="Enter ID"
                  className="border border-gray-200 rounded-lg px-2 py-1 w-36 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-400 ttw-type-small"
                />
                <button
                  onClick={() => onItineraryIdChange?.(localItineraryId)}
                  className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-lg transition-colors font-medium ttw-type-small"
                >
                  Load
                </button>
              </div>
            </label>
          )}
        </div>
      )}

      {/* ── Messages ──────────────────────────────────────────────────────── */}
      <div
        ref={messagesScrollRef}
        onScroll={handleMessagesScroll}
        className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden px-[0.25rem] md:!px-4 py-4 scroll-smooth"
      >

          <div ref={messagesContentRef} className="mx-auto">
            {isLoadingMore && (
              <div className="flex items-center justify-center py-3">
                <Spinner size={16} />
                <span className="ml-2 ttw-type-small text-gray-400">Loading older messages…</span>
              </div>
            )}
            {travellerStory && messages.length === 0 && (
              <TravellerStoryIntroCard
                story={travellerStory}
                disabled={isStreaming || isItineraryCompleting}
                onBookExact={() => {
                  sendMessage(travellerStory.prompt);
                  onTravellerStoryDismiss?.();
                }}
              />
            )}
         
            {messages.map((msg, idx) => {
              // ── Custom in-thread cards (intake form + inline OTP) ──────────
              if (msg.type === "intake_form") {
                return (
                  <IntakeFormCard
                    key={msg.id}
                    onComplete={handleIntakeComplete}
                    snapshot={
                      (msg.intakeSnapshot as IntakeFormState | undefined) ?? null
                    }
                  />
                );
              }
              if (msg.type === "theme_form" && themeFormRef.current) {
                // Match the regular intake card's container: indent it into the
                // message column on desktop (not stuck to the left gutter) and
                // cap the width; full-width on mobile.
                return (
                  <div
                    key={msg.id}
                    className="ml-10 mb-4 w-[calc(100%-40px)] max-ph:ml-0 max-ph:w-auto"
                    style={{ maxWidth: 480, paddingTop: 4, paddingBottom: 8 }}
                  >
                    <ThemeIntakeForm
                      form={themeFormRef.current}
                      items={themeItems}
                      note={themeNote}
                      onSubmit={handleThemedFormSubmit}
                    />
                  </div>
                );
              }
              if (msg.type === "pricing_form") {
                return (
                  <PricingFormCard
                    key={msg.id}
                    onComplete={handlePricingComplete}
                  />
                );
              }
              if (msg.type === "login_card") {
                return (
                  <OtpCard
                    key={msg.id}
                    itineraryId={localItineraryId}
                    onVerified={handleLoginCardVerified}
                    onSkip={handleLoginCardSkip}
                    heading="Sign in to continue"
                    submitLabel="Send OTP"
                  />
                );
              }

              // For network-failed assistant bubbles, hand MessageBubble a
              // retry callback that re-sends the immediately preceding user
              // message (content + attachments) — useChat strips the failed
              // pair before the new send so we don't double up.
              const prevMsg = idx > 0 ? messages[idx - 1] : undefined;
              const onRetry =
                msg.role === "assistant" &&
                msg.isError &&
                msg.errorVariant === "network" &&
                prevMsg?.role === "user"
                  ? () => {
                      const atts = prevMsg.attachments ?? [];
                      sendMessage(
                        prevMsg.content,
                        atts.length ? atts.map((a) => a.id) : undefined,
                        atts.length ? atts : undefined,
                      );
                    }
                  : undefined;

              // A single bot turn streams as one text message + N widget
              // messages back-to-back. Show feedback on the LAST feedback-
              // eligible message in the run so the turn gets a single thumbs
              // row at the bottom. Button-only widgets (e.g. "Confirm This
              // Route") suppress their own feedback in MessageBubble, so
              // skip past them when locating the eligible tail — otherwise
              // the whole turn ends up with no feedback at all.
              // Consecutive button-only widgets (e.g. "View full itinerary" +
              // "Confirm Itinerary…") should share one line rather than stack.
              // Flag this bubble when it has a button-only widget neighbour so
              // MessageBubble renders it inline-flow.
              const isBtnOnlyWidgetMsg = (m: (typeof messages)[number] | undefined) =>
                !!m &&
                m.type === "widget" &&
                !!m.widgetItem &&
                isButtonOnlyWidget(m.widgetItem.widget);
              const inlineGroup =
                isBtnOnlyWidgetMsg(msg) &&
                (isBtnOnlyWidgetMsg(messages[idx - 1]) ||
                  isBtnOnlyWidgetMsg(messages[idx + 1]));

              let hideFeedback = false;
              if (msg.role === "assistant") {
                for (let j = idx + 1; j < messages.length; j++) {
                  const later = messages[j];
                  if (later.role !== "assistant") break;
                  const eligible =
                    later.type === "widget"
                      ? later.widgetItem
                        ? !isButtonOnlyWidget(later.widgetItem.widget)
                        : false
                      : true;
                  if (eligible) {
                    hideFeedback = true;
                    break;
                  }
                }
              }

              return (
              <MessageBubble
                // Keyed on clientKey, not id: `id` is renamed mid-stream to the
                // server's real message id, and keying on it remounts the bubble
                // — it vanishes and replays its entry animation mid-turn.
                key={msg.clientKey ?? msg.id}
                message={msg}
                entities={entities}
                widgetDisabled={
                  msg.type === "widget" && disabledWidgetIds.has(msg.id)
                }
                feedback={feedbackByMessageId[msg.id] ?? null}
                feedbackLoading={feedbackLoadingIds.has(msg.id)}
                onFeedback={hideFeedback ? undefined : handleFeedback}
                onRetry={onRetry}
                inlineGroup={inlineGroup}
                onWidgetAction={(action) => {
                  // Freeze this widget's CTAs the moment the user clicks one,
                  // regardless of which drawer or server call it triggers. The
                  // server response may take time and we don't want a double
                  // submission.
                  if (msg.type === "widget") markWidgetDisabled(msg.id);

                  // ── Plan New Trip → fresh P1 session ──────────────────
                  // Generate a new sessionId, stash the seed prompt for the
                  // new session in localStorage (sessionStorage isn't shared
                  // across tabs), then open /chat/[id] in a new tab. BotApp's
                  // mount effect picks the prompt up and sends it as the
                  // first user message.
                  if (action.type === "trip.redirect_to_p1") {
                    const ctx = (action.payload?.context ??
                      action.payload?.prompt ??
                      "") as string;
                    const newSessionId = generateSessionId();
                    if (ctx) {
                      try {
                        localStorage.setItem(
                          `pending_initial_prompt_${newSessionId}`,
                          ctx,
                        );
                      } catch (err) {
                        console.warn(
                          "[trip.redirect_to_p1] localStorage set failed:",
                          err,
                        );
                      }
                    }
                    window.open(
                      `/chat/${newSessionId}`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                    return;
                  }

                  // ── Payment ───────────────────────────────────────────
                  // Clicking "Make Payment" inside a widget opens the
                  // existing payment drawer rather than round-tripping via
                  // sendWidgetAction — the drawer owns the payment flow.
                  if (action.type === "payment.start") {
                    reportChatStage("chat_cart_viewed");
                    onPaymentStart?.();
                    return;
                  }

                  const payload = action.payload ?? {};

                  // ── Prompt to chat ────────────────────────────────────
                  // A widget CTA (e.g. the route card's "Confirm Route" /
                  // "Modify") that should feed its intent into the chat as a
                  // normal user turn rather than a server widget action.
                  if (action.type === "chat.prompt") {
                    const text = (payload.text ?? payload.prompt ?? "") as string;
                    if (text.trim()) {
                      setCloneCtaSuppressed(true);
                      sendMessage(text.trim());
                    }
                    return;
                  }

                  // ── Activity ──────────────────────────────────────────
                  // activity.view / activity.detail / open_activity_drawer
                  // all route to ActivityDetailsDrawer. Field names differ
                  // by variant — .view uses {id,itineraryCityId,startDate};
                  // .detail and open_activity_drawer use {activityId,
                  // itineraryCityId,startDate}. Accept either.
                  if (
                    action.type === "activity.view" ||
                    action.type === "activity.detail" ||
                    action.type === "open_activity_drawer"
                  ) {
                    const activityId = (payload.activityId ??
                      payload.activity_id ??
                      payload.id) as string;
                    const itineraryCityId = (payload.itineraryCityId ??
                      payload.itinerary_city_id ??
                      payload.city_id) as string | undefined;
                    const date = (payload.startDate ??
                      payload.start_date ??
                      payload.date) as string | undefined;
                    setActivityDrawer({
                      show: true,
                      activityId,
                      date,
                      itinerary_city_id: itineraryCityId,
                      source: (payload.source ?? payload.provider) as
                        | string
                        | undefined,
                    });
                    analyticsRef.current.trackActivityCardClicked?.(
                      localItineraryId || "",
                      activityId,
                      "chat",
                    );
                    return;
                  }

                  // ── Place / POI ──────────────────────────────────────
                  // place.view / place.detail open POIDetailsDrawer in "poi"
                  // mode. Legacy widgets may send an activity_id — fall back
                  // to ActivityDetailsDrawer only if explicit activity context
                  // is present (preserves the older "place.view carrying
                  // activity payload" behavior).
                  if (
                    action.type === "place.view" ||
                    action.type === "place.detail" ||
                    action.type === "open_poi_drawer" ||
                    action.type === "open_place_drawer"
                  ) {
                    const hasActivityContext =
                      payload.activity_id != null ||
                      payload.activityId != null;

                    if (hasActivityContext) {
                      const activityId = (payload.activityId ??
                        payload.activity_id ??
                        payload.id) as string;
                      setActivityDrawer({
                        show: true,
                        activityId,
                        date: (payload.startDate ??
                          payload.date) as string | undefined,
                        itinerary_city_id: (payload.itineraryCityId ??
                          payload.itinerary_city_id ??
                          payload.city_id) as string | undefined,
                        source: (payload.source ?? payload.provider) as
                          | string
                          | undefined,
                      });
                      analyticsRef.current.trackActivityCardClicked?.(
                        localItineraryId || "",
                        activityId,
                        "chat",
                      );
                    } else {
                      const poiId = (payload.poiId ??
                        payload.poi_id ??
                        payload.id) as string;
                      setPoiDrawer({
                        show: true,
                        kind: "poi",
                        id: poiId,
                        name: payload.title as string | undefined,
                        itinerary_city_id: (payload.itineraryCityId ??
                          payload.itinerary_city_id) as string | undefined,
                        date: (payload.startDate ??
                          payload.date) as string | undefined,
                      });
                      analyticsRef.current.trackPoiCardClicked?.(
                        localItineraryId || "",
                        poiId,
                        "chat",
                      );
                    }
                    return;
                  }

                  // ── Restaurant ────────────────────────────────────────
                  // restaurant.view / restaurant.detail share POIDetailsDrawer
                  // but in "restaurant" mode (fetches /geos/restaurant/:id/).
                  if (
                    action.type === "restaurant.view" ||
                    action.type === "restaurant.detail" ||
                    action.type === "open_restaurant_drawer"
                  ) {
                    const restaurantId = (payload.restaurantId ??
                      payload.restaurant_id ??
                      payload.id) as string;
                    setPoiDrawer({
                      show: true,
                      kind: "restaurant",
                      id: restaurantId,
                      name: payload.title as string | undefined,
                      itinerary_city_id: (payload.itineraryCityId ??
                        payload.itinerary_city_id) as string | undefined,
                      date: (payload.startDate ??
                        payload.date) as string | undefined,
                    });
                    analyticsRef.current.trackPoiCardClicked?.(
                      localItineraryId || "",
                      restaurantId,
                      "chat",
                    );
                    return;
                  }

                  // ── Transfer ──────────────────────────────────────────
                  // transfer.select is the legacy single-edge payload.
                  // transfer.view / transfer.detail are the richer multi-
                  // segment payloads. All three open TransferEditDrawer.
                  // We pass initialMode + initialEdgeId so the drawer skips
                  // its mode-selection step (currentStep=0) and opens the
                  // matching modal directly: Flight → ComboFlight, Taxi →
                  // ComboTaxi, anything else (Train/Bus/Ferry) → OtherTransfer.
                  // Multi-leg routes auto-advance through legs from step 1.
                  if (
                    action.type === "transfer.select" ||
                    action.type === "transfer.view" ||
                    action.type === "transfer.detail" ||
                    action.type === "open_transfer_drawer"
                  ) {
                    const segments: any[] = Array.isArray(payload.segments)
                      ? payload.segments
                      : [];
                    const firstSegment = segments[0];
                    const edgeId = (payload.id ??
                      payload.edge_id ??
                      firstSegment?.id ??
                      firstSegment?.transfer_id) as string | undefined;
                    const initialMode = (payload.mode ??
                      firstSegment?.mode) as string | undefined;
                    const indexed = edgeId
                      ? transferEdgeMapRef.current[edgeId]
                      : undefined;
                    const bookingId =
                      (payload.bookingId ??
                        payload.booking_id ??
                        payload.route_id ??
                        payload.id ??
                        edgeId) as string | undefined;
                    const oItineraryCity =
                      (payload.originItineraryCityId ??
                        payload.origin_itinerary_city_id ??
                        indexed?.from_itinerary_city_id) as string | undefined;
                    const dItineraryCity =
                      (payload.destinationItineraryCityId ??
                        payload.destination_itinerary_city_id ??
                        indexed?.to_itinerary_city_id) as string | undefined;
                    const doj =
                      (payload.date ??
                        payload.check_in ??
                        payload.transfer_date ??
                        indexed?.check_in) as string | undefined;
                    // The search inside the drawer (mercury fetchTransferMode)
                    // keys off origin/destination db-city ids and shows the
                    // city names + date. Push these into the URL too so the
                    // reader effect can rebuild the full context on refresh /
                    // deep-link / share (when transferEdgeMapRef is empty) and
                    // for legacy transfer.select payloads (indexed = { mode }
                    // only). Without them the drawer opens but the search runs
                    // with undefined cities and a blank date.
                    const oCityId =
                      (payload.originCityId ??
                        payload.origin_city_id ??
                        firstSegment?.origin_city_id ??
                        indexed?.from_city_id) as string | undefined;
                    const dCityId =
                      (payload.destinationCityId ??
                        payload.destination_city_id ??
                        firstSegment?.destination_city_id ??
                        indexed?.to_city_id) as string | undefined;
                    const oCity =
                      (payload.from_city ??
                        payload.origin_city ??
                        indexed?.from_city) as string | undefined;
                    const dCity =
                      (payload.to_city ??
                        payload.destination_city ??
                        indexed?.to_city) as string | undefined;

                    router.push(
                      {
                        pathname: "/chat/[id]",
                        query: {
                          ...router.query,
                          id: sessionIdRef.current,
                          drawer: "editTransfer",
                          // Marks this open as chat-originated so only the
                          // ChatKitPanel reader effect reacts. The /itinerary
                          // VerticalLayout renders its own TransferEditDrawer on
                          // `drawer=editTransfer` too, so without this marker its
                          // "Add Transfer" CTA and this effect would both fire
                          // and stack two drawers.
                          drawerSource: "chat",
                          drawerType: "",
                          bookingId: bookingId ?? "",
                          oItineraryCity: oItineraryCity ?? "",
                          dItineraryCity: dItineraryCity ?? "",
                          doj: doj ?? "",
                          oCityId: oCityId ?? "",
                          dCityId: dCityId ?? "",
                          oCity: oCity ?? "",
                          dCity: dCity ?? "",
                          initialMode: initialMode ?? indexed?.mode ?? "",
                          initialEdgeId: edgeId ?? "",
                        },
                      },
                      undefined,
                      { scroll: false },
                    );
                    analyticsRef.current.trackTransferCardClicked?.(
                      localItineraryId || "",
                      edgeId ?? bookingId ?? "",
                      "chat",
                      indexed?.from_city ?? (payload.from_city as string | undefined) ?? null,
                      indexed?.to_city ?? (payload.to_city as string | undefined) ?? null,
                    );
                    return;
                  }

                  // ── Hotel ─────────────────────────────────────────────
                  // hotel.view is the list-card payload ({id,itineraryCityId,
                  // dbCityId,startDate,endDate,bookingId}); hotel.detail is
                  // the detail-card payload ({hotelId, ...}). Both open
                  // AccommodationDetailDrawer.
                  if (
                    action.type === "hotel.view" ||
                    action.type === "hotel.detail" ||
                    action.type === "open_hotel_drawer"
                  ) {
                    const hotelAccommodationId = (payload.hotelId ??
                      payload.accommodation_id ??
                      payload.hotel_id ??
                      payload.id) as string;
                    analyticsRef.current.trackHotelCardClicked?.(
                      localItineraryId || "",
                      hotelAccommodationId,
                      "chat",
                    );
                    setHotelDrawer({
                      show: true,
                      accommodationId: hotelAccommodationId,
                      itinerary_city_id: (payload.itineraryCityId ??
                        payload.itinerary_city_id ??
                        payload.city_id) as string | undefined,
                      dbCityId: (payload.dbCityId ??
                        payload.db_city_id) as string | undefined,
                      check_in: (payload.startDate ??
                        payload.check_in ??
                        payload.date) as string | undefined,
                      check_out: (payload.endDate ??
                        payload.check_out) as string | undefined,
                      bookingId: (payload.bookingId ??
                        payload.booking_id) as string | undefined,
                      cityName: (payload.cityName ??
                        payload.city_name ??
                        payload.city) as string | undefined,
                      source:
                        ((payload.source ?? payload.provider) as string) ??
                        "Travclan",
                      travclan_hotel_id: (payload.travclan_hotel_id ?? payload.travclanHotelId ??
                        payload.hotel_id) as string | undefined,
                      currency: payload.currency as string | undefined,
                      occupancies: (payload.occupancies ??
                        payload.occupancy) as
                        | Array<{ num_adults: number; child_ages: number[] }>
                        | undefined,
                      traceId: (payload.traceId ??
                        payload.trace_id) as string | undefined,
                    });
                    return;
                  }

                  // ── Sightseeing / Add City Taxi ──────────────────────
                  // sightseeing.open opens the multicity TransferEditDrawer
                  // for an itinerary city — same drawer the city header's
                  // "Add Taxi" CTA opens on /itinerary. We resolve the city
                  // payload from Redux so the drawer has the geo metadata
                  // it needs to fetch suggestions, then mirror the URL the
                  // itinerary page uses (?drawer=addCityTaxi&itinerary_city_id=...)
                  // so refresh / share preserves the open drawer.
                  if (
                    action.type === "sightseeing.open" ||
                    action.type === "pickup_drop.open"
                  ) {
                    const itineraryCityId = (payload.itineraryCityId ??
                      payload.itinerary_city_id ??
                      payload.city_id) as string | undefined;
                    const matchedCity = itinerary?.cities?.find(
                      (c: any) => String(c?.id) === String(itineraryCityId),
                    );
                    if (!matchedCity) {
                      sendWidgetAction(action.type, payload);
                      return;
                    }
                    const initialTab: "sightseeing" | "airport" =
                      action.type === "pickup_drop.open"
                        ? "airport"
                        : "sightseeing";
                    setSightseeingDrawer({
                      show: true,
                      itinerary_city_id: itineraryCityId,
                      cityId: matchedCity?.city?.id,
                      cityName: matchedCity?.city?.name,
                      cityData: matchedCity,
                      startDate: (payload.startDate ??
                        payload.start_date ??
                        matchedCity?.start_date) as string | undefined,
                      endDate: (payload.endDate ??
                        payload.end_date ??
                        matchedCity?.end_date) as string | undefined,
                      initialTab,
                    });
                    const url = new URL(window.location.href);
                    url.searchParams.set("drawer", "addCityTaxi");
                    if (itineraryCityId) {
                      url.searchParams.set("itinerary_city_id", itineraryCityId);
                    }
                    url.searchParams.set("taxiTab", initialTab);
                    window.history.pushState({}, "", url.toString());
                    return;
                  }

                  // ── Visa ──────────────────────────────────────────────
                  // visa.open opens VisaSearchDrawer (the same drawer the
                  // booking slide's "Add Visa" CTA opens). Drawer fetches
                  // its own catalogue so the click payload doesn't need
                  // to carry visa data.
                  if (action.type === "visa.open") {
                    setVisaDrawer({ show: true });
                    return;
                  }

                  // ── eSIM ──────────────────────────────────────────────
                  // esim.open opens EsimPackagesDrawer (the same drawer the
                  // booking slide's "Add eSIM" CTA opens).
                  if (action.type === "esim.open") {
                    setEsimDrawer({ show: true });
                    return;
                  }

                  // ── View itinerary ────────────────────────────────────
                  // "View itinerary" widget CTA reveals the itinerary panel
                  // and scrolls/flashes Day 1 (mobile also switches to the
                  // itinerary tab). Handled locally — no server round-trip.
                  if (action.type === "itinerary.view") {
                    onViewItinerary?.();
                    return;
                  }

                  sendWidgetAction(action.type, payload);
                }}
              />
              );
            })}

            {/* Steal / clone CTA — pinned below the last message when the viewer
                is looking at someone else's itinerary. Renders nothing for the
                owner or in a brand-new chat. Reactive to login/logout.
                Only shown on a finalized (P2) itinerary — hidden while the trip
                is still in P1 or Draft — and only once per page load: once the
                viewer starts a new chat turn it stays hidden until refresh. */}
            {messages.length > 0 &&
              !isStreaming &&
              botMode === "p2" &&
              itinerary?.status !== "Draft" &&
              !cloneCtaSuppressed && (
              <ItineraryCloneCta
                onRequestLogin={() => setShowLoginModal(true)}
                onCreateVersion={() => setShowCloneModal(true)}
              />
            )}

            {/* {showError && (
              <div className="mt-2 px-2.5 py-2.5 ttw-type-small text-red-600 flex items-center gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
                <button
                  onClick={() => setErrorDismissed(true)}
                  // className="ml-auto text-red-400 hover:text-red-600"
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              </div>
            )} */}

            {showLoginPrompt && !isLoggedIn && (
              <div className="mt-[12px] p-2">
                 <div
          style={{
            maxWidth: "100%",
            // background: "#f8fafc",
            color: "#000000",
            padding: "12px 0px",
            borderRadius: 12,
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            lineHeight: "24px",
            fontWeight: 400,
          }}
        >
                  I see you’re not logged in. Please login to continue chatting and unlock the best experience!
                </div>
                <LoginButton onClick={handleShowLogin}>Login/Signup</LoginButton>
              </div>
            )}

            {postLoginLoading && (
              <div className="mt-4 flex items-center gap-2 ttw-type-body text-gray-400">
                <Spinner size={14} />
                <span>Sending your message…</span>
              </div>
            )}

            {/* Itinerary creation progress (tailored form → /chat/[id], or the
                bot's own completion flow). Mirrors the edit-time status card:
                streams the same `display_text` from the /status/ poll as a
                stepped in-chat card instead of a bare spinner. Gated on
                `isItineraryCompleting` (creation), which is fresh per session —
                no stale-flag mount guard needed, so it also shows on a refresh
                mid-build. */}
            <StatusNotesCard
              notes={statusNotes}
              displayText={statusDisplayText}
              isPolling={isItineraryCompleting}
              cycleKey={isItineraryCompleting ? "create-cycle" : "init"}
              resetKey={null}
              title="Kaira is building your"
              titleAccent="itinerary"
            />

            {/* Itinerary update progress (Update Dates / Route Edit / Reprice /
                refresh_itinerary). Same stepped card, fed by the streaming
                `display_text` from the /status/ poll. */}
            <StatusNotesCard
              notes={statusNotes}
              displayText={statusDisplayText}
              isPolling={isItineraryPolling}
              cycleKey={pollingCycleKey}
              resetKey={lastUserMessageId}
            />

            <div ref={messagesEndRef} />
          </div>
      </div>

      {/* ── Quick reply skeleton ──────────────────────────────────────────── */}
      {/* Shown while the server is computing quick replies (quick_reply_shimmer)
          and the real chips haven't arrived yet. */}
      {quickReplyShimmer &&
        quickReplies.length === 0 &&
        !isComposerLocked && (
          <div className="flex-shrink-0 px-3 md:!px-6 pt-2 pb-0 md:pb-1">
            <div className="mx-auto">
              <div
                className="flex gap-[6px] md:gap-2 overflow-hidden md:pb-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {Array.from({ length: 10 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 rounded-full"
                    style={{
                      width: 96,
                      height: 33,
                      background:
                        "linear-gradient(90deg, #ECEDEF 0%, #F6F7F8 50%, #ECEDEF 100%)",
                      backgroundSize: "200% 100%",
                      animation: "qrShimmer 1.4s ease-in-out infinite",
                      animationDelay: `${idx * 90}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `@keyframes qrShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }` }} />
          </div>
        )}

      {/* ── Quick reply chips ─────────────────────────────────────────────── */}
      {/* Hidden while itinerary creation is in progress — no quick replies/CTAs allowed */}
      {(quickReplies.length > 0 || quickReplyLoading) && !isComposerLocked && !isForeignItinerary && !loginBlocked && !promptLoginBlocked && (
        <div className="flex-shrink-0 px-3 md:!px-6 pt-2 pb-0 md:pb-1">
          <div className="mx-auto">
            <div
              className="flex gap-[6px] md:gap-2 overflow-x-auto md:pb-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {quickReplyLoading
                ? ["28%", "24%", "30%", "26%"].map((w, idx) => (
                    <QuickReplyShimmerChip key={`qr-shimmer-${idx}`} width={w} />
                  ))
                : quickReplies.map((reply, idx) => (
                    <SingleChips
                      key={idx}
                      onClick={() => handleQuickReply(reply)}
                      disabled={isStreaming || isComposerLocked || promptLoginBlocked}
                    >
                      {reply.label}
                    </SingleChips>
                  ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Composer ─────────────────────────────────────────────────────── */}
      {/* While the in-chat intake form is open on phone, drop the disabled
          composer entirely — the form's own sticky Continue button is the only
          bottom action. Same for the inline sign-in card (login_card / OtpCard):
          on phones the composer is only blocked, so hide it and let the card be
          the sole bottom action. Desktop keeps the (disabled) composer visible. */}
      <div
        className={`kp-composer-wrap flex-shrink-0 relative${
          loginBlocked || promptLoginBlocked ? " max-ph:hidden" : ""
        }`}
      >
        <div className="mx-auto">
          <MessageInputBox
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            onStop={cancelStream}
            isStreaming={isStreamingResponse}
            disabled={isComposerLocked || loginBlocked || promptLoginBlocked}
            placeholder={
              loginBlocked || promptLoginBlocked
                ? "Login to continue"
                : isForeignItinerary
                ? botMode === "p2"
                  ? "Clone this itinerary to start chatting"
                  : "Start a new chat to send messages"
                : isItineraryCompleting
                ? "Planning your trip…"
                : isItineraryPolling
                ? "Updating your itinerary…"
                : intakeFormActive
                ? "Just tell me anything you're planning…"
                : "Ask me anything"
            }
            // Stays mounted while the composer is locked: MessageInputBox
            // renders the "+" inert in that state, so the pill keeps its full
            // shape instead of collapsing to a lone placeholder.
            showAttach
            onFilesSelected={handleFilesSelected}
            attachments={attachments}
            onRemoveAttachment={handleRemoveAttachment}
            // In the logged-out thread-detail flow the inline sign-in card is
            // shown, so the composer is just blocked — no BotLoginModal popup.
            // In P1 (chat-only stage) logged-out users may chat anonymously —
            // don't gate the composer; only require auth in P2. The backend
            // still emits prompt_login when it genuinely needs an account.
            requireAuth={
              loginBlocked || promptLoginBlocked
                ? false
                : (!isLoggedIn && botMode === "p2") || isForeignItinerary
            }
            onAuthRequired={() => {
              if (!isLoggedIn && botMode === "p2") {
                setShowLoginModal(true);
              } else if (isForeignItinerary && botMode === "p2") {
                // Foreign-itinerary block in P2: the user is logged in but
                // viewing someone else's (built) itinerary, so a login modal
                // makes no sense. Prompt them to craft their own editable copy.
                // In P1 there is no itinerary to clone yet — stay blocked.
                setShowCloneModal(true);
              }
            }}
          />
        </div>
        {/* Overlay blocks all typing/interaction while itinerary creation
            or an update/edit poll is in progress. */}
        {isComposerLocked && (
          <div
            className="absolute inset-0 cursor-not-allowed"
            style={{ background: "rgba(255,255,255,0.55)", zIndex: 5 }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* ── View Itinerary CTA — mobile only ──────────────────────────────
          Mirrors the "Get Inspired" CTA on the welcome screen. Visible once
          the bot has produced a draft (display_itinerary fired) or the
          thread has reached P2, so users can jump from chat to the
          itinerary tab without hunting for the top tab strip. */}
      {(botMode === "p2" || hasDisplayItinerary) && onViewItinerary && (
        <button
          type="button"
          onClick={onViewItinerary}
          className="md:hidden flex-shrink-0 w-full flex items-center justify-center gap-1 py-2 ttw-type-body font-medium"
          style={{ background: "#f7e700", color: "#000000" }}
        >
          <span>View Itinerary</span>
          <span aria-hidden>→</span>
        </button>
      )}

      {/* ── Clone form popup (logged-in "Create My Version") ──────────────────
          Desktop → centered modal, mobile → bottom sheet. Reuses the
          CloneItinerary form (start/end location, dates, pax, inclusions) and,
          on success, keeps the user in-page (skeleton + status poll). */}
      {showCloneModal &&
        typeof document !== "undefined" &&
        createPortal(
          isDesktopViewport ? (
            <ModalWithBackdrop
              show={showCloneModal}
              onHide={() => setShowCloneModal(false)}
              closeIcon={false}
              width="560px"
              borderRadius="20px"
              backdropStyle={{ zIndex: 3300 }}
            >
              <CloneItinerary
                sourceItineraryId={localItineraryId}
                showEndLocation
                onSuccess={handleCloneSuccess}
                onCancel={() => setShowCloneModal(false)}
              />
            </ModalWithBackdrop>
          ) : (
            <BottomModal
              show={showCloneModal}
              onHide={() => setShowCloneModal(false)}
              closeIcon={false}
              height="auto"
              borderRadius="20px 20px 0 0"
              isMobile
              backdropStyle={{ zIndex: 3300 }}
            >
              <CloneItinerary
                sourceItineraryId={localItineraryId}
                showEndLocation
                onSuccess={handleCloneSuccess}
                onCancel={() => setShowCloneModal(false)}
              />
            </BottomModal>
          ),
          document.body,
        )}

      {/* ── Login modal portal ────────────────────────────────────────────── */}
      {showLoginModal &&
        !isLoggedIn &&
        createPortal(
          <>
            <div
              onClick={() => setShowLoginModal(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 3299,
              }}
            />
            <div
              onClick={(e) => e.stopPropagation()}
              // style={
              //   isMobile
              //     ? {
              //         position: "fixed",
              //         left: 0,
              //         right: 0,
              //         bottom: 0,
              //         background: "#fff",
              //         borderTopLeftRadius: 16,
              //         borderTopRightRadius: 16,
              //         width: "100%",
              //         maxHeight: "90vh",
              //         overflowY: "auto",
              //         zIndex: 3300,
              //         boxShadow: "0 -8px 30px rgba(0,0,0,0.25)",
              //       }
              //     : {
              //         position: "fixed",
              //         top: "50%",
              //         left: "50%",
              //         transform: "translate(-50%, -50%)",
              //         background: "#fff",
              //         borderRadius: 16,
              //         width: "min(480px, 95vw)",
              //         maxHeight: "90vh",
              //         overflowY: "auto",
              //         zIndex: 3300,
              //         boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              //       }
              // }
            >
              <BotLoginModal
                show={showLoginModal}
                onhide={() => setShowLoginModal(false)}
                zIndex={"3300"}
                message="Please login to continue"
                onSuccess={async () => {
                  await onLoginSuccess?.();
                }}
              />
            </div>
          </>,
          document.body,
        )}

      {/* ── Activity Detail Drawer ──────────────────────────────────────── */}
      {/* Opened by activity.view / activity.detail widget actions. The
          onAddToItinerary callback routes the booking intent back to the
          chat orchestrator via a widget action (the chat has the session
          context the drawer does not). */}
      {activityDrawer.show && (
        <ActivityDetailsDrawer
          show={activityDrawer.show}
          fromChat={true}
          activityId={activityDrawer.activityId}
          source={activityDrawer.source}
          date={activityDrawer.date}
          handleCloseDrawer={() => setActivityDrawer({ show: false })}
          setShowDetails={() => setActivityDrawer({ show: false })}
          setShowLoginModal={setShowLoginModal}
          Topheading="Activity Details"
          showPackages={false}
          type={"activity"}
          pax={{
            adults: itinerary?.number_of_adults ?? 1,
            children: itinerary?.number_of_children ?? 0,
            childAges: Array.from(
              { length: itinerary?.number_of_children ?? 0 },
              () => 10,
            ),
          }}
          itinerary_city_id={activityDrawer.itinerary_city_id}
          onAddToItinerary={(payload: Record<string, unknown>) => {
            const itineraryCityId =
              (payload as any).itinerary_city_id ??
              activityDrawer.itinerary_city_id;
            // Prefer the picker-chosen date (start_date / date in the
            // payload) over the date the card was originally opened with —
            // and keep `time` from the payload so the booking POST records
            // the slot the user picked.
            const pickerStartDate =
              ((payload as any).start_date as string | undefined) ??
              ((payload as any).date as string | undefined);
            void (async () => {
              const data = await postBookingAction(
                "bookings/activity/",
                {
                  ...payload,
                  itinerary_city_id: itineraryCityId,
                  date: pickerStartDate ?? activityDrawer.date,
                },
                "Added activity to your itinerary",
              );
              if (data) {
                applyActivityBookingToItinerary(data, itineraryCityId);
                // Re-pull the full itinerary so derived state (city
                // duration / day-by-day, pricing) reflects what the
                // backend now has.
                void fetchAndApplyItineraryDetail();
              }
            })();
            setActivityDrawer({ show: false });
          }}
        />
      )}

      {/* ── Transfer Detail Drawer ──────────────────────────────────────── */}
      {transferDrawer.show && (
        <TransferEditDrawer
          showDrawer={transferDrawer.show}
          check_in={transferDrawer.check_in}
          routeId={transferDrawer.routeId}
          booking_id={transferDrawer.routeId}
          booking_type={transferDrawer.booking_type}
          setShowLoginModal={setShowLoginModal}
          initialMode={transferDrawer.initialMode}
          initialEdgeId={transferDrawer.initialEdgeId}
          isMercury={transferDrawer.isMercury}
          origin={transferDrawer.origin}
          destination={transferDrawer.destination}
          originCityId={transferDrawer.originCityId}
          destinationCityId={transferDrawer.destinationCityId}
          origin_itinerary_city_id={transferDrawer.origin_itinerary_city_id}
          destination_itinerary_city_id={
            transferDrawer.destination_itinerary_city_id
          }
          city={transferDrawer.city}
          dcity={transferDrawer.dcity}
          selectedBooking={selectedBooking}
          setSelectedBooking={setSelectedBooking}
          getPaymentHandler={getPaymentInfo}
          handleClose={() => setTransferDrawer({ show: false })}
        />
      )}

      {/* ── Hotel Detail Drawer ─────────────────────────────────────────── */}
      {/* Opened by "hotel.view" / "hotel.detail" widget actions.
          AccommodationDetailDrawer fetches its own data given accommodationId.
          onChangeHotel / onAddHotel now call the itinerary booking API
          directly instead of round-tripping through the chat orchestrator. */}
      {hotelDrawer.show && hotelDrawer.accommodationId && (
        <AccommodationDetailDrawer
          show={hotelDrawer.show}
          accommodationId={hotelDrawer.travclan_hotel_id}
          onHide={() => setHotelDrawer({ show: false })}
          onChangeHotel={() => {
            // Don't POST from chat; close the detail drawer and route the
            // user into the existing changeHotelBooking drawer (rendered by
            // the itinerary tree) by setting the URL params it consumes.
            const matchedCity = itinerary?.cities?.find(
              (c: any) =>
                String(c?.id) === String(hotelDrawer.itinerary_city_id),
            );
            const dbCityId =
              hotelDrawer.dbCityId ?? matchedCity?.city?.id ?? "";
            const cityName =
              hotelDrawer.cityName ?? matchedCity?.city?.name ?? "";

            // Backend expects a "YYYY-MM-DD HH:MM:SS" string. Append the
            // zero-time suffix only when the input is a bare date.
            const ensureDateTime = (v?: string) => {
              if (!v) return "";
              return v.includes(" ") ? v : `${v} 00:00:00`;
            };
            const checkIn = ensureDateTime(hotelDrawer.check_in);
            const checkOut = ensureDateTime(hotelDrawer.check_out);

            // Nights between check_in and check_out (UTC midnights to avoid
            // DST edge-cases). Falls back to 0 when either side is missing.
            let hotelDuration = 0;
            if (hotelDrawer.check_in && hotelDrawer.check_out) {
              const ms =
                new Date(hotelDrawer.check_out).getTime() -
                new Date(hotelDrawer.check_in).getTime();
              if (!isNaN(ms)) {
                hotelDuration = Math.max(
                  0,
                  Math.round(ms / (1000 * 60 * 60 * 24)),
                );
              }
            }

            setHotelDrawer({ show: false });

            router.push(
              {
                pathname: router.pathname,
                query: {
                  ...router.query,
                  drawer: "changeHotelBooking",
                  clickType: "Change",
                  itineraryCityId: hotelDrawer.itinerary_city_id ?? "",
                  booking_id: hotelDrawer.bookingId ?? "",
                  check_in: checkIn,
                  check_out: checkOut,
                  hotel_duration: String(hotelDuration),
                  city_id: dbCityId,
                  city_name: cityName,
                },
              },
              undefined,
              { scroll: false },
            );
          }}
          onAddHotel={() => {
            void (async () => {
              const data = await postBookingAction(
                "hotel/add/",
                {
                  id: hotelDrawer.accommodationId,
                  itinerary_city_id: hotelDrawer.itinerary_city_id,
                  db_city_id: hotelDrawer.dbCityId,
                  check_in: hotelDrawer.check_in,
                  check_out: hotelDrawer.check_out,
                },
                "Added hotel to your itinerary",
              );
              if (data) applyHotelMutationToItinerary(data);
            })();
            setHotelDrawer({ show: false });
          }}
          // Context required for the p2-stage "Add / Change" CTA.
          itinerary_city_id={hotelDrawer.itinerary_city_id}
          check_in={hotelDrawer.check_in}
          check_out={hotelDrawer.check_out}
          bookingId={hotelDrawer.bookingId}
          dbCityId={hotelDrawer.dbCityId}
          source={hotelDrawer.source}
          occupancies={
            hotelDrawer.occupancies && hotelDrawer.occupancies.length
              ? hotelDrawer.occupancies
              : [
                  {
                    num_adults: itinerary?.number_of_adults ?? 1,
                    child_ages: Array.from(
                      { length: itinerary?.number_of_children ?? 0 },
                      () => 10,
                    ),
                  },
                ]
          }
          traceId={hotelDrawer.traceId}
          setShowLoginModal={setShowLoginModal}
          // Authoritative itinerary id for this chat. The drawer would
          // otherwise fall through to Redux Itinerary.id, which can lag
          // when the user has just switched threads — leading to the
          // POST hitting the previously loaded itinerary.
          itineraryId={localItineraryId}
          // Re-fetch the canonical itinerary so day_by_day buckets and
          // city.hotels reflect the new booking — the drawer already
          // patches the Stays slice, but the Itinerary slice needs the
          // full server payload to stay in sync.
          onBookingSuccess={() => {
            void fetchAndApplyItineraryDetail();
          }}
        />
      )}

      {/* ── POI / Restaurant Detail Drawer ──────────────────────────────── */}
      {/* Opened by place.view / place.detail / restaurant.view /
          restaurant.detail. The `kind` prop switches POIDetailsDrawer between
          poi-mode (/geos/poi/:id/) and restaurant-mode (/geos/restaurant/:id/).
          onAddToItinerary routes "<kind>.add" back to the chat so the
          assistant can book the element into the itinerary. */}
      {poiDrawer.show && poiDrawer.id && (
        <POIDetailsDrawer
          show={poiDrawer.show}
          iconId={poiDrawer.id}
          id={poiDrawer.id}
          name={poiDrawer.name}
          activityData={{ type: poiDrawer.kind ?? "poi", id: poiDrawer.id }}
          itinerary_city_id={poiDrawer.itinerary_city_id}
          date={poiDrawer.date}
          removeDelete={true}
          removeChange={true}
          showAddToItinerary={true}
          onAddToItinerary={(payload?: Record<string, unknown>) => {
            const kind = poiDrawer.kind ?? "poi";
            const path = kind === "restaurant" ? "restaurant/add/" : "poi/add/";
            const itineraryCityId = poiDrawer.itinerary_city_id;
            // Prefer the date the picker chose (start_date / date in the
            // payload) over the date the card was originally opened with.
            const pickerStartDate =
              ((payload as any)?.start_date as string | undefined) ??
              ((payload as any)?.date as string | undefined);
            const date = pickerStartDate ?? poiDrawer.date;
            const dayByDayIndex = Math.max(
              0,
              ((payload as any)?.day as number | undefined) != null
                ? ((payload as any).day as number) - 1
                : 0,
            );
            const time = (payload as any)?.time as string | undefined;
            const body: Record<string, unknown> = {
              itinerary_city_id: itineraryCityId,
              date,
              day_by_day_index: dayByDayIndex,
              ...(time ? { time } : {}),
              ...(kind === "restaurant"
                ? { restaurant_id: poiDrawer.id }
                : { poi_id: poiDrawer.id }),
            };
            void (async () => {
              const data = await postBookingAction(
                path,
                body,
                kind === "restaurant"
                  ? "Added restaurant to your itinerary"
                  : "Added place to your itinerary",
              );
              if (data) {
                applySlabToItinerary(
                  data,
                  itineraryCityId,
                  date,
                  dayByDayIndex,
                );
                // Re-pull the full itinerary so the next drawer open
                // reads the up-to-date day-by-day and city duration.
                void fetchAndApplyItineraryDetail();
              }
            })();
            setPoiDrawer({ show: false });
          }}
          setShowLoginModal={setShowLoginModal}
          handleCloseDrawer={() => setPoiDrawer({ show: false })}
        />
      )}

      {/* ── Sightseeing / Add City Taxi Drawer ──────────────────────────── */}
      {/* Opened by sightseeing.open widget actions. Renders TransferEditDrawer
          in multicity (intra-city) mode — same drawer the city header's
          "Add Taxi" CTA opens on the /itinerary page. */}
      {sightseeingDrawer.show && sightseeingDrawer.cityData && (
        <TransferEditDrawer
          mercury
          isMercury
          showDrawer={sightseeingDrawer.show}
          drawerType="multicity"
          booking_type="multicity"
          origin_itinerary_city_id={sightseeingDrawer.itinerary_city_id}
          destination_itinerary_city_id={sightseeingDrawer.itinerary_city_id}
          originCityId={sightseeingDrawer.cityId}
          destinationCityId={sightseeingDrawer.cityId}
          city={sightseeingDrawer.cityName}
          dcity={sightseeingDrawer.cityName}
          oCityData={sightseeingDrawer.cityData}
          dCityData={sightseeingDrawer.cityData}
          check_in={sightseeingDrawer.startDate}
          initialTab={sightseeingDrawer.initialTab}
          getPaymentHandler={getPaymentInfo}
          setShowLoginModal={setShowLoginModal}
          handleClose={() => {
            setSightseeingDrawer({ show: false });
            const url = new URL(window.location.href);
            if (url.searchParams.get("drawer") === "addCityTaxi") {
              url.searchParams.delete("drawer");
              url.searchParams.delete("itinerary_city_id");
              url.searchParams.delete("taxiTab");
              window.history.pushState({}, "", url.toString());
            }
          }}
        />
      )}

      {/* ── Visa Search Drawer ──────────────────────────────────────────── */}
      {/* Opened by visa.open widget actions. Drawer self-fetches visa
          options from the ancillary service. */}
      <VisaSearchDrawer
        show={visaDrawer.show}
        onHide={() => setVisaDrawer({ show: false })}
      />

      {/* ── eSIM Packages Drawer ────────────────────────────────────────── */}
      {/* Opened by esim.open widget actions. Drawer self-fetches eSIM
          packages from the ancillary service. */}
      <EsimPackagesDrawer
        show={esimDrawer.show}
        onHide={() => setEsimDrawer({ show: false })}
      />
    </div>
    </WidgetThemeProvider>
  );
}

// ── Traveller Story intro — static CTA card shown at the top of the chat ────
// Rendered only when `travellerStory` is set and the chat has no messages yet.
// CTAs route through `sendMessage`, which sends the prompt to the /chatkit p1
// endpoint exactly like any user-initiated message.

// Image with a shimmering skeleton placeholder while the bitmap loads. Keyed
// on src so rapid switches between stories reset the loading state instead of
// briefly displaying the previous image underneath the new one.
interface SkeletonImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const SkeletonImage: React.FC<SkeletonImageProps> = ({ src, alt, width, height }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div
      className="relative flex-shrink-0 overflow-hidden rounded-xl"
      style={{ width, height, background: "#E5E7EB" }}
    >
      {!loaded && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #E5E7EB 0%, #F3F4F6 50%, #E5E7EB 100%)",
            backgroundSize: "200% 100%",
            animation: "travellerSkeletonShimmer 1.2s ease-in-out infinite",
          }}
        />
      )}
      <img
        src={optimizedMediaUrl(src, { width: 700 })}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className="w-full h-full object-cover"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes travellerSkeletonShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      ` }} />
    </div>
  );
};

interface TravellerStoryIntroCardProps {
  story: TravellerStoryIntro;
  disabled: boolean;
  onBookExact: () => void;
}

const TravellerStoryIntroCard: React.FC<TravellerStoryIntroCardProps> = ({
  story,
  disabled,
  onBookExact,
}) => {
  const gallery = story.images && story.images.length > 0 ? story.images : [story.image];

  return (
    <div className="mb-4">
      {/* Image gallery */}
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {gallery.map((src, i) => (
          <SkeletonImage
            key={`${story.id}-img-${i}`}
            src={src}
            alt={`${story.tripName} ${i + 1}`}
            width={366}
            height={245}
          />
        ))}
      </div>

      {/* Traveller info row */}
      <div className="flex items-center justify-start gap-2 mt-3 mb-3">
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ttw-type-small font-semibold text-[#07213A]"
          style={{ background: "#E5E7EB" }}
        >
          {story.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="ttw-type-small font-semibold text-[#07213A] leading-tight truncate m-0">
            {story.name}
          </p>
          <p className="ttw-type-small text-gray-500 mt-[1px] truncate m-0">
            {story.duration} · {story.destinations.join(" · ")}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="mt-2 text-[12.5px] leading-[18px] text-[#374151] bg-[#FAFAFA] p-2 rounded-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
        {story.shortDescription}
      </p>

      {/* CTAs */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a
          href={disabled ? undefined : story.viewItineraryLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (disabled) e.preventDefault();
          }}
          className="px-4 py-[8px] rounded-lg ttw-type-small font-semibold transition-colors"
          style={{
            background: "#fff",
            border: "1px solid #0B1E36",
            color: "#0B1E36",
            opacity: disabled ? 0.5 : 1,
            pointerEvents: disabled ? "none" : "auto",
            textDecoration: "none",
          }}
        >
          View Itinerary
        </a>
        <button
          type="button"
          disabled={disabled}
          onClick={onBookExact}
          className="px-4 py-[8px] rounded-lg ttw-type-small font-semibold transition-colors"
          style={{
            background: "#0B1E36",
            border: "1px solid #0B1E36",
            color: "#fff",
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          Book Exactly This
        </button>
      </div>
    </div>
  );
};