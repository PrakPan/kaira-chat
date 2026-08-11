import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { openNotification } from "../../../store/actions/notification";
import { MERCURY_HOST } from "../../../services/constants";

// GET returns the state to render from; POST { is_released } toggles it and
// echoes the same key set back, so one parser drives both.
const releaseEndpoint = (itineraryId: string) =>
  `${MERCURY_HOST}/api/v1/itinerary/admin/${itineraryId}/mark-released/`;

/** Shape shared by the GET and the POST response. */
interface ReleaseState {
  is_released: boolean;
  status?: string;
  /** False for Paid itineraries — the CTA hides entirely rather than 400ing. */
  can_toggle_released: boolean;
}

const parseReleaseState = (data: any): ReleaseState => ({
  is_released: Boolean(data?.is_released),
  status: data?.status,
  // Absent means "not told otherwise" — stay usable rather than vanishing.
  can_toggle_released: data?.can_toggle_released !== false,
});

// The token lives in Redux once logged in; the localStorage keys are the
// rehydration fallback, in the same order the rest of the bot area probes them.
const resolveToken = (reduxToken?: string | null): string | null => {
  if (reduxToken) return reduxToken;
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("token") ??
    localStorage.getItem("authToken") ??
    localStorage.getItem("access_token")
  );
};

const errorText = (err: any, fallback: string) =>
  err?.response?.data?.message ||
  err?.response?.data?.errors?.[0]?.message?.[0] ||
  err?.message ||
  fallback;

const Spinner = () => (
  <svg className="animate-spin" width={14} height={14} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

interface ConfirmDialogProps {
  released: boolean;
  saving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Centred confirm dialog. Portalled to <body> so it centres against the
 * viewport rather than the chat header it is triggered from — that header sits
 * inside a flex/overflow-hidden panel that would otherwise clip and offset it.
 * z-[2000] clears the cart (1700) and its drawers (1710).
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  released,
  saving,
  onCancel,
  onConfirm,
}) => {
  const confirmRef = useRef<HTMLButtonElement | null>(null);

  // Esc cancels, and the page behind the dialog is frozen while it is open.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onCancel, saving]);

  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/45 px-4"
      onClick={() => {
        if (!saving) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="release-confirm-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] rounded-[16px] bg-white p-6 shadow-[0_20px_48px_rgba(11,18,32,0.24)] font-inter"
      >
        <h2
          id="release-confirm-title"
          className="text-[17px] font-semibold leading-[1.35] text-[#171A1F]"
        >
          {released ? "Undo release?" : "Release this itinerary?"}
        </h2>
        <p className="mt-[10px] text-[13.5px] leading-[1.5] text-[#5B6472]">
          {released
            ? "The customer will no longer see this itinerary. You can release it again at any time."
            : "The customer will be able to see this itinerary. You can undo this at any time."}
        </p>

        <div className="mt-[22px] flex items-center justify-end gap-[10px]">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="h-10 rounded-full bg-gray-100 px-[18px] text-[13px] font-semibold text-[#3D4756] transition-colors hover:bg-gray-200 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className={`flex h-10 items-center justify-center gap-[7px] rounded-full px-[20px] text-[13px] font-semibold text-white transition-colors disabled:opacity-70 ${
              released
                ? "bg-[#B42318] hover:bg-[#912018]"
                : "bg-[#122A43] hover:bg-[#1c3b5c]"
            }`}
          >
            {saving && <Spinner />}
            {saving ? "Saving…" : released ? "Unrelease" : "Release"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

interface ReleaseItineraryCtaProps {
  itineraryId?: string | null;
  className?: string;
  /** Fires after a successful toggle, so the host can refresh dependent views. */
  onToggled?: (state: ReleaseState) => void;
}

/**
 * Staff-only "mark this itinerary released to the customer" toggle, rendered in
 * Kaira's chat header.
 *
 * Desktop only by design — the caller keeps it off phones, where that header
 * row has no width for a labelled pill.
 *
 * Render it behind a staff check — the email gate is cosmetic, and this
 * endpoint is IsStaff-guarded server side, which is what actually enforces the
 * rule. Releasing changes what the customer sees, so it always routes through
 * a confirm dialog.
 */
const ReleaseItineraryCta: React.FC<ReleaseItineraryCtaProps> = ({
  itineraryId,
  className = "",
  onToggled,
}) => {
  const dispatch = useDispatch();
  const reduxToken = useSelector((state: any) => state.auth?.token);
  const token = resolveToken(reduxToken);

  const [state, setState] = useState<ReleaseState | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Stable so the dialog's Esc listener isn't torn down and rebound each render.
  // No `saving` guard needed here — all three call sites (Esc, backdrop, the
  // Cancel button) are already blocked while a save is in flight.
  const handleCancel = useCallback(() => setConfirming(false), []);

  // `activeItineraryId` carries these sentinels before a real itinerary exists.
  const usableId =
    itineraryId && itineraryId !== "draft" && itineraryId !== "skeleton"
      ? itineraryId
      : null;

  // Read the current release state. A failure here (404, permissions, network)
  // leaves `state` null and the CTA unrendered — staff chrome must never break
  // the customer-facing header it sits in.
  useEffect(() => {
    if (!usableId || !token) {
      setState(null);
      return;
    }

    let active = true;
    axios
      .get(releaseEndpoint(usableId), {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (active) setState(parseReleaseState(res.data));
      })
      .catch(() => {
        if (active) setState(null);
      });

    return () => {
      active = false;
      setConfirming(false);
    };
  }, [usableId, token]);

  const handleConfirm = useCallback(() => {
    if (!usableId || saving || !state) return;

    const next = !state.is_released;
    setSaving(true);

    axios
      .post(
        releaseEndpoint(usableId),
        { is_released: next },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        const updated = parseReleaseState(res.data);
        setState(updated);
        setConfirming(false);
        onToggled?.(updated);
        dispatch(
          openNotification({
            type: "success",
            heading: updated.is_released ? "Released" : "Release undone",
            text:
              res.data?.message ||
              (updated.is_released
                ? "The itinerary is now visible to the customer."
                : "The itinerary is no longer marked as released."),
          }),
        );
      })
      .catch((err) => {
        // The dialog stays open so the action can be retried after a failure.
        dispatch(
          openNotification({
            type: "error",
            heading: "Could not update release status",
            text: errorText(err, "Please try again."),
          }),
        );
      })
      .finally(() => setSaving(false));
  }, [usableId, saving, state, token, dispatch, onToggled]);

  if (!state || !state.can_toggle_released) return null;

  const released = state.is_released;

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        title={
          released
            ? `Released to the customer${state.status ? ` · ${state.status}` : ""} — click to undo`
            : `Mark this itinerary released to the customer${state.status ? ` · currently ${state.status}` : ""}`
        }
        aria-label={
          released ? "Unmark itinerary as released" : "Mark itinerary as released"
        }
        // Borderless on the same gray chip as the settings/share icons beside
        // it. Only the background moves on hover — an earlier version also
        // swapped the text to white, which vanished whenever the paired dark
        // hover background did not apply.
        className={`shrink-0 h-9 px-[16px] rounded-full bg-gray-100 hover:bg-gray-200 font-inter text-[12.5px] font-semibold leading-none whitespace-nowrap transition-colors ${
          released ? "text-[#067647]" : "text-[#122A43]"
        } ${className}`}
      >
        {released ? "Released" : "Mark Released"}
      </button>

      {confirming && (
        <ConfirmDialog
          released={released}
          saving={saving}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default ReleaseItineraryCta;
