import React, { useEffect } from 'react';
import TailoredForm from "../../components/tailoredform/Index";
import NavigationMenu from '../../components/revamp/home/NavigationMenu';
import TrustFactor from '../../components/tailoredform/TrustFactor';
import setHotLocationSearch from '../../store/actions/hotLocationSearch';
import { MERCURY_HOST } from '../../services/constants';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import useMediaQuery from '../../components/media';

const NewTrip = (props) => {
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery("(min-width:767px)");

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
          <TailoredForm onHide={props?.onHide}/>
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