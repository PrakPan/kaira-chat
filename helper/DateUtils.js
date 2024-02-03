export const getDate = (dateString) => {
  if (!dateString) return "";
  const temp = dateString?.split("/");
  return `${temp[2]}-${temp[1]}-${temp[0]}`;
};

export const getYear = (dateString) => {
  if (!dateString) return "";
  return dateString?.split("/")?.filter((element) => element.length === 4)[0];
};
