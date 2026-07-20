// Formats a numeric amount for display based on the active currency.
// INR -> Indian digit grouping (e.g. 1,00,000.50)
// anything else -> international grouping (e.g. 100,000.50)
// Decimals are preserved (up to 2 places) and trailing zeros are dropped.
export const formatCurrencyValue = (value, currencyCode = "INR") => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0";
  const locale = currencyCode === "INR" ? "en-IN" : "en-US";
  return num.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};
