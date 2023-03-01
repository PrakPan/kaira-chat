import React, { useState, useEffect } from "react";
import { Drawer, Box } from "@material-ui/core";
import POIDetailsSkeleton from "./POIDetailsSkeleton";
import axiosPOIdetailsInstance from "../../../services/poi/poidetails";
import POIDetails from "./POIDetails";

const POIDetailsDrawer = (props) => {
  const [poiDetailsData, setPoiDetailsData] = useState({});
console.log(props)
  useEffect(() => {
    axiosPOIdetailsInstance
      .get("/?id=14")
      .then((res) => setPoiDetailsData(res.data));
  }, []);
  return (
    <Drawer
      open={props.show}
      anchor={"right"}
      onClose={props.handleCloseDrawer}
    >
      {!poiDetailsData ? (
        <POIDetails />
      ) : (
        <POIDetailsSkeleton handleCloseDrawer={props.handleCloseDrawer} />
      )}
    </Drawer>
  );
};

export default POIDetailsDrawer;
