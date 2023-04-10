import axios from 'axios';
import { useStateContext } from '../context/StateContext';

const GOOGLE_MAP_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

const extractAddress = (place) => {
  const address = {
    city: '',
    state: '',
    zip: '',
    country: '',
    plain() {
      const city = this.city ? `${this.city}, ` : '';
      const zip = this.zip ? `${this.zip}, ` : '';
      const state = this.state ? `${this.state}, ` : '';
      return city + zip + state + this.country;
    },
  };

  if (!Array.isArray(place?.address_components)) {
    return address;
  }

  place.address_components.forEach((component) => {
    const { types } = component;
    const value = component.long_name;

    if (types.includes('locality')) {
      address.city = value;
    }

    if (types.includes('administrative_area_level_1')) {
      address.state = value;
    }

    if (types.includes('postal_code')) {
      address.zip = value;
    }

    if (types.includes('country')) {
      address.country = value;
    }
  });

  return address;
};

export async function reverseGeocode(
  { latitude: lat, longitude: lng },
  setUserLocation
) {
  const url = `${GOOGLE_MAP_API_URL}?key=AIzaSyCumu5B8e6vcRoLhKw1bpWxODsy2YiUtEk&latlng=${lat},${lng}`;
  try {
    axios.get(url).then(
      (response) =>
        // eslint-disable-next-line implicit-arrow-linebreak, comma-dangle
        [setUserLocation(extractAddress(response.data.results[0]))]
      // eslint-disable-next-line function-paren-newline
    );
  } catch (err) {
    console.log(err);
  }
}
