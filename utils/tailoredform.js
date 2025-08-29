export const capitalizeFirstLetter = (string) => {
    const words = string.split("_");
    const newString = words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    return newString;
};

export const getParent = (path) => {
    if (!path) return "";

    const links = path.split("/");
    links.pop();
    if (links.length === 3 || links.length == 2) {
        return capitalizeFirstLetter(links[1]);
    }
    return null;
};