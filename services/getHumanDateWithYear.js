import { dateIsValid } from "./isDateDDMMYYY";

export const getHumanDateWithYear = (dateString) => {
  if (!dateIsValid(dateString)) return dateString;
  else {
    let d = dateString.split("/");

    let date = new Date(d[2], d[1] - 1, d[0]);
    const months = [
      "Jan",
      "Feb",
      "March",
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
    let day = date.getDate();
    if (day === 11) day = "11th";
    else if (day === 12) day = "12th";
    else if (day === 13) day = "13th";
    else if (day % 10 === 1) day = day + "st";
    else if (day % 10 === 2) day = day + "nd";
    else if (day % 10 === 3) day = day + "rd";
    else day = day + "th";

    let month = months[date.getMonth()];
    let year = date.getFullYear(); // Get the year

    return `${day} ${month} ${year}`;
  }
};
