import React, { useState } from "react";
import { Drawer } from "@material-ui/core";
import POIDetailsSkeleton from "./POIDetailsSkeleton";
import POIDetails from "./POIDetails";

const POIDetailsDrawer = (props) => {

  return (
    <Drawer
      open={props.show}
      anchor={"right"}
      variant="persistent"
      ModalProps={{ onBackdropClick: props.handleCloseDrawer }}
      style={{ zIndex: 1250 }}
    >
      {!!props.poiDetailsData.name ? (
        <POIDetails
          data={props.poiDetailsData}
          handleCloseDrawer={props.handleCloseDrawer}
        />
      ) : (
        <POIDetailsSkeleton handleCloseDrawer={props.handleCloseDrawer} />
      )}
    </Drawer>
  );
};

export default POIDetailsDrawer;
