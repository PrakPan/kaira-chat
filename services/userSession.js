import { clearUserAvatarColor } from "../components/bot-components/utils/avatarColor";

// Every localStorage key that belongs to the signed-in user. Logout used to
// clear only some of these (each logout path its own subset), so after
// "log out → sign in as someone else" in the same window the next account
// inherited the previous one's country, WhatsApp choice and verified badges
// whenever its login response didn't overwrite them.
export const USER_SESSION_KEYS = [
  // auth
  "token",
  "authToken",
  "access_token",
  "expirationDate",
  "user_id",
  "is_new_user",
  // profile
  "name",
  "email",
  "phone",
  "country",
  "user_image",
  "whatsapp_opt_in",
  "is_phone_verified",
  "is_email_verified",
  "email_last_verified_on",
  // cached data
  "MyPlans",
];

export const clearUserSession = () => {
  if (typeof window === "undefined") return;
  try {
    for (const key of USER_SESSION_KEYS) localStorage.removeItem(key);
  } catch {
    /* storage unavailable — nothing to clear */
  }
  // The letter-avatar colour is per user too; the next account gets its own.
  clearUserAvatarColor();
};
