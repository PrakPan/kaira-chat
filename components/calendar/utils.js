export const isBeforeToday = (date) => {
  if (!date) return false;
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  return date < todayMidnight;
};

export const normalizeDate = (d) => {
  if (!d) return null;
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const formatDateRange = (selectedDates) => {
  if (!selectedDates.start || !selectedDates.end) return 'Select dates';
  const start = selectedDates.start;
  const end = selectedDates.end;
  const startStr = `${months[start.getMonth()].slice(0, 3)} ${start.getDate()}`;
  const endStr = `${months[end.getMonth()].slice(0, 3)} ${end.getDate()}`;
  return `${startStr} - ${endStr}`;
};

export const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDay.getDay();
  const days = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }
  return days;
};

export const isDateSelected = (date, selectedDates) => {
  if (!date) return false;
  return (
    (selectedDates.start && date.getTime() === selectedDates.start.getTime()) ||
    (selectedDates.end && date.getTime() === selectedDates.end.getTime())
  );
};

export const isDateInRange = (date, selectedDates) => {
  if (!date || !selectedDates.start || !selectedDates.end) return false;
  return date > selectedDates.start && date < selectedDates.end;
};

export const isDateInHoverRange = (date, selectedDates, hoveredDate) => {
  if (!date || !selectedDates.start || !hoveredDate) return false;
  if (hoveredDate <= selectedDates.start) return false;
  return date > selectedDates.start && date < hoveredDate;
};

export const isDateRangeStart = (date, selectedDates) => 
  selectedDates.start && date && date.getTime() === selectedDates.start.getTime();

export const isDateRangeEnd = (date, selectedDates) => 
  selectedDates.end && date && date.getTime() === selectedDates.end.getTime();
