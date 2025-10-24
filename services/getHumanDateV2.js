export const getHumanDateWithYearv2 = (dateString) => {
    let date = new Date(dateString);
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
    let year = date.getFullYear();

    return `${day} ${month}, ${year}`;
};
