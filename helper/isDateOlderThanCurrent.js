export function isDateOlderThanCurrent(dateString) {
  if (dateString != null) {
    const parts = dateString.split("-");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months in JavaScript are zero-based (0-11)
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    const currentDate = new Date();

    return date < currentDate;
  } else {
    return false;
  }
}
