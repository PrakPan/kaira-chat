import dayjs from "dayjs";

export const getDateInfo = (start_datetime, durationInMinutes) => {
  if (!start_datetime || !durationInMinutes) return null;

  const startDate = new Date(start_datetime);
  const endDate = new Date(startDate.getTime() + durationInMinutes * 60 * 1000);

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}h` : ""} ${mins > 0 ? `${mins}m` : ""}`.trim();
  };

  return {
    startDate,
    endDate,
    formattedStartDate: formatDate(startDate), // e.g. "Sat, 8 Nov"
    formattedEndDate: formatDate(endDate),     // e.g. "Sat, 8 Nov"
    formattedStartTime: formatTime(startDate), // e.g. "12:00 AM"
    formattedEndTime: formatTime(endDate),     // e.g. "2:00 AM"
    formattedDuration: formatDuration(durationInMinutes), // e.g. "2h"
  };
};

