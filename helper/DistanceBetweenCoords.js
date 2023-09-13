function toRad(Value) {
  return (Value * Math.PI) / 180;
}
function distance(lat1, lat2, lon1, lon2) {
  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  // Haversine formula
  const dlon = lon2 - lon1;
  const dlat = lat2 - lat1;
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;

  const c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles
  const r = 6371;
  // calculate the result
  return c * r;
}
function DistanceBetweenCoords(city1, city2) {
  return distance(
    city1.lat,

    city2.lat,
    city1.long,

    city2.long
  ).toFixed(1);
}

export default DistanceBetweenCoords;
