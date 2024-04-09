export const getDate = (dateString) => {
  if (!dateString) return "";
  const [day, month, year] = dateString.split("/");
  if (!day || !month || !year) return dateString;
  return `${year}-${month}-${day}`;
};

export const getYear = (dateString) => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split("/");
  if (!year) return null;
  return year;
};

export function dateFormat(dateString) {
  if (!dateString) return "";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [day, monthIndex, year] = dateString.split("/");

  if (!day || !monthIndex || !year) {
    return dateString;
  }

  const monthName = months[Number(monthIndex) - 1];

  return `${monthName} ${Number(day)}, ${year}`;
}
