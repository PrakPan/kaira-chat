import { format } from "date-fns";
import { convertDateFormat } from "./ConvertDateFormat";
import dayjs from "dayjs";

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
  let [day, month, year] = dateString.split("/");
  if (!year) {
    [year, month, day] = dateString.split("-");
    if (!year) return null;
  }
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

  let [day, monthIndex, year] = dateString.split("/");

  if (!day || !monthIndex || !year) {
    [year, monthIndex, day] = dateString.split("-");

    if (!year || !monthIndex || !day) {
      return dateString;
    }
  }

  const monthName = months[Number(monthIndex) - 1];

  return `${monthName} ${Number(day)}, ${year}`;
}

export const getDateString = (date) => {
  if (!date || isNaN(Date.parse(date))) return date;
  return format(date, "yyyy-MM-dd");
};

export const getCustomDateString = (date, offset) => {
  if (!date || isNaN(Date.parse(date))) return date;

  let newDate = new Date(date);
  newDate.setDate(newDate.getDate() + offset);

  return convertDateFormat(format(newDate, "yyyy-MM-dd"));
};

export  const addDaysToDate = (dateString, numberOfDays) => {
   console.log("props?.",dateString, numberOfDays);
    const newDate = dayjs(dateString).add(numberOfDays, "day");
    return newDate.format("YYYY-MM-DD");
  };

export function getDatesInRange(startDate, endDate) {
  const date = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];

  while (date <= end) {
    dates.push(date.toISOString().split("T")[0]);
    date.setDate(date.getDate() + 1);
  }

  return dates;
}


