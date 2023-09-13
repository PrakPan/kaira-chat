const { parse, isBefore } = require('date-fns');

export function isDateOlderThanCurrent(dateString) {
  //   const currentDate = new Date();
  //   const parsedDate = parse(date, 'dd-MM-yyyy', new Date());

  //   return isBefore(parsedDate, currentDate);
  if (dateString != null) {
    const parts = dateString.split('-');
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
