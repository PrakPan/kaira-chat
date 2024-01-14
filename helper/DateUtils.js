export const getDate = (dateString) => {
    return dateString?.split('/')?.filter(element => element.length === 4)[0];
};
