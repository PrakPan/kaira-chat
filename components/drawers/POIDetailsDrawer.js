import React, { useState} from 'react'
import {Drawer} from '@material-ui/core'
const POIDetailsDrawer = (props) => {
  return (
    <Drawer
      open={props.show}
      anchor={"right"}
      onClose={props.onClose}
    >
      <div style={{ width: "200px" }}>PoiDetails</div>
    </Drawer>
  );
}

export default POIDetailsDrawer