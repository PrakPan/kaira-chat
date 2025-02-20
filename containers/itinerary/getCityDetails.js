import axiosPoiCityInstance from "../../services/poi/city";

export const getCityDetails = (() => {
  // Define the cache object
  const cache = {};

  return async function (city_id) {
    // Check if the city details are already cached
    if (cache[city_id]) {
      return cache[city_id];
    }
    const res = await axiosPoiCityInstance.get(
      `/?city_id=${city_id}&fields=lat,long`
    );
    const data = res.data;
    // Cache the city details for future use
    cache[city_id] = data;

    console.log("CITY DATA",data);
    return data;
  };
})();
