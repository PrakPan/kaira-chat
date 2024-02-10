export const getDate = (dateString) => {
  if (!dateString) return "";
  const [day, month, year] = dateString.split("/");
  if (!day || !month || !year) return dateString;
  return `${year}-${month}-${day}`;
};

export const getYear = (dateString) => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split("/");
  if (!year) return null;
  return year;
};
