import React, { useEffect } from 'react'
import TailoredForm from "../../components/tailoredform/Index"
import NavigationMenu from '../../components/revamp/home/NavigationMenu'
import TrustFactor from '../../components/tailoredform/TrustFactor';
import setHotLocationSearch from '../../store/actions/hotLocationSearch';
import { MERCURY_HOST } from '../../services/constants';
import { useDispatch } from 'react-redux';

import axios from 'axios';
const NewTrip = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    axios.get(`${MERCURY_HOST}/api/v1/geos/search/hot_destinations`).then((res) => {
      dispatch(setHotLocationSearch(res.data));
    });
  }, []);

  return (
    <div className='bg-primary-cornsilk h-[100vh]'>
      {/* <NavigationMenu /> */}
      <div >

        <div >
          <TailoredForm />
        </div>
        <div className='fixed bottom-0 w-100 z-[1] bg-primary-cornsilk'>
          <TrustFactor />
        </div>
      </div>
    </div>
  )
}

export default NewTrip