import axiosPoiCityInstance from '../../services/poi/city';
export const getCityDetails = (() => {
  // Define the cache object
  const cache = {};

  return async function (cityname) {
    // Check if the city details are already cached
    if (cache[cityname]) {
      return cache[cityname];
    }

    const res = await axiosPoiCityInstance.get(
      `/?city_id=${cityname}&fields=lat,long`
    );
    const data = res.data;

    // Cache the city details for future use
    cache[cityname] = data;

    return data;
  };
})();
