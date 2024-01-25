export const getDate = (dateString) => {
  const temp = dateString?.split("/");
  return `${temp[2]}-${temp[1]}-${temp[0]}`;
};

export const getYear = (dateString) => {
  return dateString?.split("/")?.filter((element) => element.length === 4)[0];
};
