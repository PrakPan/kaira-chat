import { getHumanDate } from "../services/getHumanDate";

const convertDFormat = (dt) => {
  const date = parseISO(dt);
  const formattedDate = format(date, "MMMM d yyyy");
  return formattedDate;
};

export function convertDateFormat(dateString) {
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

  return `${monthName} ${Number(day)}`;
}

export const getDate = (date) => {
  let year = date.substring(0, 4);
  let month = date.substring(5, 7);
  let day = date.substring(8, 10);

  return getHumanDate(day + "/" + month + "/" + year);
};
