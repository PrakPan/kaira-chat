import axios from 'axios';
import { reverseGeocode } from './reversejioCode';

export const findMyLocation = (setUserLocation, setCurrentlatlong) => {
  function positionError(err) {
    console.log(
      'Geolocation is not enabled. Please enable to use this feature'
    );
    console.warn(`ERROR(${err.code}): ${err.message}`);
    const getGeoInfo = () => {
      axios
        .get('https://ipapi.co/json/')
        .then((response) => {
          const { data } = response;

          setCurrentlatlong(data);
          reverseGeocode(data, setUserLocation);
          console.log('Your current position is:');
          console.log(`Latitude longitude: ${data.latitude} ${data.longitude}`);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getGeoInfo();
  }
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
  };

  function success(pos) {
    const crd = pos.coords;
    setCurrentlatlong(pos.coords);
    reverseGeocode(pos.coords, setUserLocation);
    console.log('Your current position is:');
    console.log(`Latitude longitude: ${pos.coords}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, positionError, options);
  }
};
