// Who counts as internal staff.
//
// The login payload carries no role/permission field (see store/actions/auth.js
// — `setUserDetails` only ever stores name/email/phone/id/verification flags),
// so the account email domain is all the client has to go on. That makes this
// gate *cosmetic*: it decides whether internal UI is worth rendering, never
// whether an action is allowed. The backend stays the authority on that.
//
// Matched on the parsed domain rather than a substring test so an address that
// merely contains the string — owais@evil-tarzanway.com.attacker.net, or
// tarzanway.com@gmail.com — does not slip through.
const STAFF_EMAIL_DOMAINS = ["thetarzanway.com", "tarzanway.com"];

export const isStaffEmail = (email?: string | null): boolean => {
  const normalized = (email || "").trim().toLowerCase();
  const at = normalized.lastIndexOf("@");
  if (at === -1) return false;

  const domain = normalized.slice(at + 1);
  return STAFF_EMAIL_DOMAINS.some(
    (staffDomain) => domain === staffDomain || domain.endsWith(`.${staffDomain}`),
  );
};
