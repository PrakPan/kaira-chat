import React, { useState } from "react";
import { Drawer } from "@material-ui/core";
import POIDetailsSkeleton from "./POIDetailsSkeleton";
import POIDetails from "./POIDetails";
import { useEffect } from "react";
import axiosPOIdetailsInstance from '../../../services/poi/poidetails'

const POIDetailsDrawer = (props) => {

  const [data,setData] = useState([])

  useEffect(() => {
    if(props.show) fetchData()
  }, [props.show])
  
  function fetchData(){
       axiosPOIdetailsInstance
          .get(`/?id=${props.iconId}`)
          .then((res) => setData(res.data));  
}

  return (
    <Drawer
      open={props.show}
      anchor={"right"}
      ModalProps={{ onBackdropClick: props.handleCloseDrawer }}
      style={{ zIndex: 1250 }}
    >
      {!!data.name ? (
        <POIDetails
          data={data}
          handleCloseDrawer={props.handleCloseDrawer}
        />
      ) : (
        <POIDetailsSkeleton handleCloseDrawer={props.handleCloseDrawer} />
      )}
    </Drawer>
  );
};

export default POIDetailsDrawer;
