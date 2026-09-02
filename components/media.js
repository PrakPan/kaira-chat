/**
 * DEPRECATED PATH — kept only so the ~230 existing importers keep working.
 * Import `hooks/useMedia` directly in new code.
 *
 * This file used to hold a second, separate implementation of the same hook:
 * same name, same call signature, different behaviour (it listened to window
 * `resize` and re-subscribed on every change, where this one listens to the
 * matchMedia `change` event and subscribes once). Only this copy carried the
 * warning about never using the hook to decide layout, which is how that rule
 * came to be broken in the card sections. There is now exactly one
 * implementation, and the warning lives with it.
 */
export { default } from "../hooks/useMedia";
