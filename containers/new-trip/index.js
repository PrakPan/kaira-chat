import React, { useEffect } from 'react';
import TailoredForm from "../../components/tailoredform/Index";
import setHotLocationSearch from '../../store/actions/hotLocationSearch';
import { MERCURY_HOST } from '../../services/constants';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const NewTrip = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${MERCURY_HOST}/api/v1/geos/search/hot_destinations`)
      .then((res) => {
        dispatch(setHotLocationSearch(res.data));
      })
      .catch((error) => {
        console.error('Error fetching hot destinations:', error);
      });
  }, [dispatch]);

  // The form renders its own full-page Kaira shell (backdrop, card, trust
  // strip in the footer), so this container is just the mount point.
  return <TailoredForm onHide={props?.onHide} />;
};

export default NewTrip;
