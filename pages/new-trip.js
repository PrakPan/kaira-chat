import React, { useEffect } from 'react';
import TailoredForm from "../components/tailoredform/Index";
import NavigationMenu from '../components/revamp/home/NavigationMenu';
import TrustFactor from '../components/tailoredform/TrustFactor';
import setHotLocationSearch from '../store/actions/hotLocationSearch';
import { MERCURY_HOST } from '../services/constants';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import useMediaQuery from '../components/media';

const NewTrip = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width:767px)");

  // Cancel / cross: return to the page the user came from. Fall back to home
  // ("/") when there is no in-app history to go back to (e.g. a direct landing
  // or an external referrer).
  const handleCancel = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    axios.get(`${MERCURY_HOST}/api/v1/geos/search/hot_destinations`)
      .then((res) => {
        dispatch(setHotLocationSearch(res.data));
      })
      .catch((error) => {
        console.error('Error fetching hot destinations:', error);
      });
  }, [dispatch]);

  return (
    <div className='bg-primary-cornsilk h-[100vh] overflow-y-hidden sm:overflow-y'>
      {/* <NavigationMenu /> */}
      <div>
        <div>
          <TailoredForm onHide={handleCancel} />
        </div>
        {isDesktop ? (
          <div className='fixed bottom-0 w-100 z-[1] bg-primary-cornsilk'>
            <TrustFactor />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NewTrip;
