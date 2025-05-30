export const convertDbNameToCapitalFirst=(name)=>{
    const word= name.split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    return word
}