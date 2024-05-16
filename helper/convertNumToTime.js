export function convertNumToTime(num) {
  if (isNaN(num)) {
    return "Invalid input";
  }
  let hours = Math.floor(num / 60);
  let minutes = num % 60;
  let hoursText = hours > 0 ? hours + " h " : "";
  let minutesText = minutes > 0 ? minutes + " min" : "";
  return hoursText + minutesText;
}
