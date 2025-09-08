export const dateIsValid = (dateStr) => {
  if (!dateStr) return false;
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;

  if (dateStr?.match(regex) === null) {
    return false;
  }

  const [day, month, year] = dateStr?.split("/") || dateStr?.split("-");

  // 👇️ format Date string as `yyyy-mm-dd`
  const isoFormattedStr = `${year}-${month}-${day}`;

  const date = new Date(isoFormattedStr);

  const timestamp = date.getTime();

  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
    return false;
  }

  return date.toISOString().startsWith(isoFormattedStr);
};

export function getDaysDifference(date1, date2) {

  if(!date1 || date2){
    return null;
  }
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Calculate the difference in milliseconds
  const diffTime = d2 - d1;

  // Convert milliseconds to days
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays;
}
