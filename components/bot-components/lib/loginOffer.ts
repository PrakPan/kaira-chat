// The booking credit chatkit last quoted this visitor ("£16"), kept on the
// device so every sign-in surface — the inline `prompt_login` card, the route
// card's Confirm modal, and BotLoginModal anywhere else on the site — shows the
// same amount in the same currency instead of the legacy "₹5,000".

const KEY = "ttw_login_offer";

export function rememberLoginOffer(amount: string | null | undefined): void {
  if (!amount || typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, amount);
  } catch {
    /* storage blocked — the card falls back to the converted default */
  }
}

export function readSavedLoginOffer(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
