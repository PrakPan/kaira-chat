export const getHumanTime = (time) => {
  if (!time) return "";

  const match = time
    .toString()
    .match(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/);

  if (!match) return time; // return original if not a valid time

  let [_, hh, mm, ss = "00"] = match;
  const period = +hh < 12 ? "AM" : "PM";
  hh = (+hh % 12 || 12).toString(); // Convert to 12-hour format

  // Decide what to show
  if (mm === "00" && ss === "00") {
    return `${hh} ${period}`;
  } else if (ss === "00") {
    return `${hh}:${mm} ${period}`;
  } else {
    return `${hh}:${mm}:${ss} ${period}`;
  }
};
