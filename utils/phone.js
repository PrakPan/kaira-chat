// Phone-number helpers shared by every input that pairs a country dial-code
// picker with a local-number field (profile edit, login modal, chat OTP card,
// lead-passenger form).
//
// CountryCodes (redux) is keyed by country name: { [name]: { value, label, img } }
// where `label` is the dial code ("+44").

// Several countries share a dial code. A reverse lookup that takes the first
// alphabetical match turns every +44 number into Guernsey and every +1 number
// into American Samoa, so the owners of the shared codes win explicitly.
const PREFERRED_COUNTRY_BY_DIAL_CODE = {
  "+1": "United States",
  "+44": "United Kingdom",
  "+7": "Russia",
  "+61": "Australia",
  "+47": "Norway",
  "+358": "Finland",
  "+590": "Guadeloupe",
  "+262": "Réunion",
  "+212": "Morocco",
};

// Example local (national) numbers, formatted the way people in that country
// write their mobile. Only their SHAPE is shown: getPhonePlaceholder keeps the
// first two digits (the recognisable mobile prefix) and masks the rest, e.g.
// India "98765 43210" → "98XXX XXXXX". Countries not listed fall back to a
// neutral hint.
const PHONE_PLACEHOLDERS = {
  "United Kingdom": "7400 123456",
  Guernsey: "7781 123456",
  Jersey: "7797 712345",
  "Isle of Man": "7924 123456",
  Ireland: "85 012 3456",
  India: "98765 43210",
  "United States": "(201) 555-0123",
  Canada: "(506) 234-5678",
  Australia: "412 345 678",
  "New Zealand": "21 123 4567",
  "United Arab Emirates": "50 123 4567",
  "Saudi Arabia": "51 234 5678",
  Qatar: "3312 3456",
  Kuwait: "500 12345",
  Oman: "9212 3456",
  Bahrain: "3600 1234",
  Singapore: "8123 4567",
  Malaysia: "12-345 6789",
  "Hong Kong": "5123 4567",
  Thailand: "81 234 5678",
  Indonesia: "812-345-678",
  Philippines: "905 123 4567",
  Vietnam: "91 234 56 78",
  Japan: "90-1234-5678",
  "South Korea": "10-2000-0000",
  China: "131 2345 6789",
  Pakistan: "301 2345678",
  Bangladesh: "1812-345678",
  "Sri Lanka": "71 234 5678",
  Nepal: "984-1234567",
  Germany: "1512 3456789",
  France: "6 12 34 56 78",
  Spain: "612 34 56 78",
  Italy: "312 345 6789",
  Portugal: "912 345 678",
  Netherlands: "6 12345678",
  Belgium: "470 12 34 56",
  Switzerland: "78 123 45 67",
  Austria: "664 123456",
  Sweden: "70 123 45 67",
  Norway: "406 12 345",
  Denmark: "32 12 34 56",
  Finland: "41 2345678",
  Poland: "512 345 678",
  Greece: "691 234 5678",
  Türkiye: "501 234 56 78",
  Israel: "50-234-5678",
  "South Africa": "71 123 4567",
  Kenya: "712 123456",
  Nigeria: "802 123 4567",
  Brazil: "11 96123-4567",
  Mexico: "222 123 4567",
};

const DEFAULT_PLACEHOLDER = "Phone number";

// Keep the first two digits, turn every later digit into "X", leave spacing and
// punctuation as-is so the grouping still reads.
const maskExample = (example) => {
  let seen = 0;
  return example.replace(/\d/g, (d) => (++seen <= 2 ? d : "X"));
};

export const getPhonePlaceholder = (country) =>
  PHONE_PLACEHOLDERS[country]
    ? maskExample(PHONE_PLACEHOLDERS[country])
    : DEFAULT_PLACEHOLDER;

// Resolve a dial code ("+44") to a CountryCodes key. `preferredCountry` (e.g.
// the user's profile country) wins when it carries that code, then the
// shared-code owners above, then the first country with the code.
export const countryFromDialCode = (dialCode, CountryCodes, preferredCountry) => {
  if (!dialCode || !CountryCodes) return null;
  if (preferredCountry && CountryCodes[preferredCountry]?.label === dialCode) {
    return preferredCountry;
  }
  const owner = PREFERRED_COUNTRY_BY_DIAL_CODE[dialCode];
  if (owner && CountryCodes[owner]?.label === dialCode) return owner;
  return (
    Object.keys(CountryCodes).find((k) => CountryCodes[k].label === dialCode) ||
    null
  );
};

// Split a stored "+447400123456" into { country, number: "7400123456" } by the
// LONGEST dial code it starts with — "+44…" must not match "+4", and "+1268…"
// (Antigua) must beat "+1". Returns null when the string isn't +-prefixed or no
// code matches.
export const splitPhone = (phone, CountryCodes, preferredCountry) => {
  if (!phone || !CountryCodes) return null;
  const compact = String(phone).replace(/[^\d+]/g, "");
  if (!compact.startsWith("+")) return null;
  const codes = [
    ...new Set(Object.values(CountryCodes).map((c) => c.label).filter(Boolean)),
  ].sort((a, b) => b.length - a.length);
  const code = codes.find((c) => compact.startsWith(c));
  if (!code) return null;
  return {
    country: countryFromDialCode(code, CountryCodes, preferredCountry),
    number: compact.slice(code.length),
  };
};

// Local digits ready to be appended to a dial code: strips formatting and the
// national trunk "0" people habitually type (UK "07400…" → "7400…"). Italy is
// the exception — its landlines keep the leading 0 after +39.
export const toNationalDigits = (value, country) => {
  const digits = String(value || "").replace(/\D/g, "");
  return country === "Italy" ? digits : digits.replace(/^0+/, "");
};

// India is a strict 10 digits; everywhere else accepts a loose 6–15 (the same
// rule the chat OTP card uses).
export const isValidNationalNumber = (digits, country) =>
  country === "India"
    ? digits.length === 10
    : digits.length >= 6 && digits.length <= 15;
