import React, { useState } from 'react';
import Drawer from '../../ui/Drawer';
import POIDetailsSkeleton from './POIDetailsSkeleton';
import POIDetails from './POIDetails';
import { useEffect } from 'react';
import axiosPOIdetailsInstance from '../../../services/poi/poidetails';

const POIDetailsDrawer = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (props.show) fetchData();
  }, [props.show]);

  function fetchData() {
    axiosPOIdetailsInstance
      .get(`/?id=${props.iconId}`)
      .then((res) => setData(res.data));
  }

  return (
    <Drawer
      show={props.show}
      anchor={'right'}
      backdrop
      style={{ zIndex: 1501 }}
      className="font-lexend"
      onHide={props.handleCloseDrawer}
      // zIndex='1501'
    >
      {!!data.name ? (
        <POIDetails data={data} handleCloseDrawer={props.handleCloseDrawer} />
      ) : (
        <POIDetailsSkeleton
          name={props.name}
          handleCloseDrawer={props.handleCloseDrawer}
        />
      )}
    </Drawer>
  );
};

export default POIDetailsDrawer;
