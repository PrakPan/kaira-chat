import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  candidateKey,
  emptySelection,
  countVehicles,
  pruneSelection,
  setQuantity as setQuantityIn,
  summarizeSelection,
  toVehiclesPayload,
} from "./fleetSelection";

/**
 * Which taxis the customer has lined up for one leg, shared between the result cards and the
 * floating bar at the bottom of the drawer.
 *
 * This is context rather than props for a specific reason: `components/modals/taxis/Index.js`
 * pre-builds its result cards into `useState` (`optionsJSX`), so every value those elements
 * close over is frozen at build time and a `selection` prop would never update. Context is not
 * blocked by that — React walks past an unchanged element to find consumers — so the cards can
 * both read the live quantity and write back to it.
 *
 * A card outside any provider gets `null` and renders exactly as it always did.
 */
const TaxiSelectionContext = createContext(null);

export const useTaxiSelection = () => useContext(TaxiSelectionContext);

/**
 * Build the context value.
 *
 * `enabled` is the whole gate: steppers and the floating bar appear only when the backend
 * says no single vehicle seats the party (`data.fleet.multi_vehicle_needed`). Below that the
 * screen is exactly what it has always been — one taxi per card, one "Add to Itinerary".
 */
export const useTaxiSelectionState = ({ fleet, quotes, source, busy = false }) => {
  const [selection, setSelection] = useState(emptySelection);

  const candidates = useMemo(() => quotes || [], [quotes]);

  // Load More re-issues the whole list and a re-search replaces it; either can retire an id
  // the selection still points at. Prune rather than wipe, so a poll that returns the same
  // vehicles leaves the customer's picks alone.
  const poolSignature = useMemo(
    () => candidates.map(candidateKey).join("|"),
    [candidates],
  );
  useEffect(() => {
    setSelection((previous) =>
      countVehicles(previous) ? pruneSelection(previous, candidates) : previous,
    );
    // candidates is derived from the same source as the signature; the signature is what
    // decides whether the pool actually changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolSignature]);

  const setQuantity = useCallback((resultIndex, quantity) => {
    setSelection((previous) => setQuantityIn(previous, resultIndex, quantity));
  }, []);

  const clear = useCallback(() => setSelection(emptySelection()), []);

  const summary = useMemo(
    () => summarizeSelection(selection, candidates),
    [selection, candidates],
  );

  const vehicles = useMemo(
    () => toVehiclesPayload(selection, candidates),
    [selection, candidates],
  );

  return useMemo(
    () => ({
      // Several taxis are a Self-pricing capability: every other supplier binds a quote to
      // the passenger count we sent it, so one cab per booking is all they can honour.
      enabled: Boolean(fleet?.multi_vehicle_needed) && (!source || source === "Self"),
      fleet: fleet || null,
      source: source || null,
      selection,
      setQuantity,
      clear,
      summary,
      vehicles,
      candidates,
      busy,
    }),
    [fleet, source, selection, setQuantity, clear, summary, vehicles, candidates, busy],
  );
};

export const TaxiSelectionProvider = ({ value, children }) => (
  <TaxiSelectionContext.Provider value={value || null}>
    {children}
  </TaxiSelectionContext.Provider>
);

export default TaxiSelectionContext;
