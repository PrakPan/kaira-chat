import React, { useEffect, useLayoutEffect } from 'react'
import TailoredForm from "../../components/tailoredform/Index"
import NavigationMenu from '../../components/revamp/home/NavigationMenu'
import TrustFactor from '../../components/tailoredform/TrustFactor';
import setHotLocationSearch from '../../store/actions/hotLocationSearch';
import { MERCURY_HOST } from '../../services/constants';
import { useDispatch } from 'react-redux';
import Cookies from "js-cookie";

import axios from 'axios';
import useMediaQuery from '../../components/media';
import { changeUserLocation } from '../../store/actions/userLocation';
import reducer from '../../store/reducers/UserLocation';
const NewTrip = () => {
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery("(min-width:767px)");
  useEffect(() => {
    axios.get(`${MERCURY_HOST}/api/v1/geos/search/hot_destinations`).then((res) => {
      dispatch(setHotLocationSearch(res.data));
    });
  }, []);

    useLayoutEffect(() => {
    const userLocation = Cookies.get("userLocation");

    if (!userLocation) {
      getUserIp();
    } else {
      dispatch(changeUserLocation({ location: JSON.parse(userLocation) }));
    }

    async function getUserIp() {
      try {
        const res = await axios.get("https://api.ipify.org?format=json");
        const IpAddress = res.data.ip;
        if (IpAddress) getUserLocation(IpAddress);
      } catch (e) {
        console.error("Error getting IP:", e);
      }
    }

    async function getUserLocation(ip) {
      try {
        const res = await axios.get(
          `https://dev.mercury.tarzanway.com/api/v1/geos/search/user_location/?ip=${ip}`
        );

        const data = res.data;
        if (res.data) {
          Cookies.set("userLocation", JSON.stringify(data), { expires: 3 });
          dispatch(changeUserLocation({ location: data }));
        }
      } catch (e) {
        console.error("Error getting user location:", e);
      }
    }
  }, [dispatch]);

  return (
    <div className='bg-primary-cornsilk h-[100vh] overflow-y-hidden sm:overflow-y'>
      {/* <NavigationMenu /> */}
      <div >

        <div >
          <TailoredForm />
        </div>
        {isDesktop ? <div className='fixed bottom-0 w-100 z-[1] bg-primary-cornsilk'>
          <TrustFactor />
        </div> : null }
      </div>
    </div>
  )
}

export default NewTrip