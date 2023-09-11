// import React from 'react';
// import { useStateContext } from '../context/StateContext';
// import { MapData1 } from '../data/data';

// function distance(lat1, lon1, lat2, lon2, unit) {
//   const radlat1 = (Math.PI * lat1) / 180;
//   const radlat2 = (Math.PI * lat2) / 180;
//   const theta = lon1 - lon2;
//   const radtheta = (Math.PI * theta) / 180;
//   let dist =
//     Math.sin(radlat1) * Math.sin(radlat2) +
//     Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//   if (dist > 1) {
//     dist = 1;
//   }
//   dist = Math.acos(dist);
//   dist = (dist * 180) / Math.PI;
//   dist = dist * 60 * 1.1515;
//   if (unit === 'K') {
//     dist *= 1.609344;
//   }
//   if (unit === 'N') {
//     dist *= 0.8684;
//   }
//   return dist;
// }
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
function DistanceData(eachData, typeAddress) {
  return distance(
    typeAddress.lat,
    eachData.geometry.coordinates[0],
    typeAddress.lng,

    eachData.geometry.coordinates[1]
  ).toFixed(1);
}

function NearestLocation(typeAddress) {
  const distanceArray = [];
  MapData1.map((eachData, index) => {
    distanceArray.push(DistanceData(eachData, typeAddress));
    distanceArray.push(eachData);
    //     const first = distanceArray.sort();
    // }
  });
  const filtered = distanceArray.filter((element, index) => index % 2 === 0);
  // var firstelement = filtered.sort()[0];
  // const firstData = distanceArray.filter((element, index) => {
  //   return firstelement === filtered;
  // });
  const shortElement =
    distanceArray[distanceArray.indexOf(filtered.sort((a, b) => a - b)[0]) + 1];
  return shortElement;
}

export default NearestLocation;
// lat: 36.171563, lng: -115.1391009
