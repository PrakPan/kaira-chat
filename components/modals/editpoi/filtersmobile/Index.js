import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Pannel from "./Pannel";
import { Tabs, Tab } from "@mui/material";

export default function TemporaryDrawer(props) {
  const [state, setState] = React.useState(false);
  const [filterSelected, setFilterSelected] = useState(null);
  const [filterHeading, setFilterHeading] = useState("Budget");

  const _selectFilter = (filter) => {
    if (filter === "filter-budget") setFilterHeading("Budget");
    else if (filter === "filter-type") setFilterHeading("Type");
    else setFilterHeading("Star Category");
    setFilterSelected(filter);
    setState(true);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  const _closePannel = () => {
    setState(false);
  };
  return (
    <div>
      <React.Fragment key={"bottom"}>
        <Tabs
          value={filterSelected}
          onChange={(event) => _selectFilter(event.target.id)}
          variant={"scrollable"}
          scrollButtons={true}
          allowScrollButtonsMobile
          indicatorColor="#f7e700"
          className="filters-mobile-tabs"
          id="filter-tab"
        >
          <Tab
            id="filter-type"
            key="filter-type"
            label={"Type"}
            className={"booking-filter-tab font-lexend"}
          ></Tab>
        </Tabs>
        <Drawer anchor={"bottom"} open={state} onClose={toggleDrawer(false)}>
          <Pannel
            _updateStarFilterHandler={props._updateStarFilterHandler}
            onclose={_closePannel}
            heading={filterHeading}
            filterSelected={filterSelected}
            filters={props.filters}
            _removeFilterHandler={props._removeFilterHandler}
            _addFilterHandler={props._addFilterHandler}
          ></Pannel>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
