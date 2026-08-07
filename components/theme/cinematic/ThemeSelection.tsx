// components/theme/cinematic/ThemeSelection.tsx
//
// Generalised "save items off the page" primitive for the cinematic theme
// landing. A theme page owns a small selection of CinematicSelectableItems
// (activities, POIs, restaurants the reader taps to save); the cards read the
// selection through React context so section signatures stay unchanged. The
// saved list is later handed to /chat and forwarded in the /chatkit request.
//
// Nothing here is hokkaido-specific — any cinematic theme page can opt in by
// calling useThemeSelectionState() and passing the value to CinematicThemeLanding.

import React from "react";
import type { CinematicSelectableItem } from "./types";

// Stable de-dupe key for an item: its catalog id when present, else kind+label.
export const itemKey = (item: CinematicSelectableItem): string =>
  item.id ? `id:${item.id}` : `${item.kind}:${item.label}`;

export interface ThemeSelectionValue {
  items: CinematicSelectableItem[];
  isSelected: (item: CinematicSelectableItem) => boolean;
  toggle: (item: CinematicSelectableItem) => void;
  clear: () => void;
  count: number;
}

// null = the page didn't opt into selection; cards then fall back to their
// normal seed/activity/navigate behaviour.
const ThemeSelectionContext = React.createContext<ThemeSelectionValue | null>(
  null,
);

export const ThemeSelectionProvider = ThemeSelectionContext.Provider;

/** Read the active selection from a card. Returns null when the surrounding
 *  page hasn't provided one. */
export const useThemeSelection = (): ThemeSelectionValue | null =>
  React.useContext(ThemeSelectionContext);

/** Owns the saved-items state for a theme page. Toggling is idempotent and
 *  keyed by itemKey, so tapping the same card twice removes it. */
export function useThemeSelectionState(): ThemeSelectionValue {
  const [items, setItems] = React.useState<CinematicSelectableItem[]>([]);

  const isSelected = React.useCallback(
    (item: CinematicSelectableItem) => {
      const key = itemKey(item);
      return items.some((it) => itemKey(it) === key);
    },
    [items],
  );

  const toggle = React.useCallback((item: CinematicSelectableItem) => {
    const key = itemKey(item);
    setItems((prev) =>
      prev.some((it) => itemKey(it) === key)
        ? prev.filter((it) => itemKey(it) !== key)
        : [...prev, item],
    );
  }, []);

  const clear = React.useCallback(() => setItems([]), []);

  return React.useMemo(
    () => ({ items, isSelected, toggle, clear, count: items.length }),
    [items, isSelected, toggle, clear],
  );
}
