import { format } from "date-fns";

export const getDate = (dateString) => {
  try {
    if (!dateString) return dateString;
    const [day, month, year] = dateString.split("/");
    if (!day || !month || !year) return dateString;
    return `${year}-${month}-${day}`;
  } catch (err) {
    return dateString;
  }
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

export const getDateString = (date) => {
  if (!date || isNaN(Date.parse(date))) return date;
  return format(date, "yyyy-MM-dd");
};
