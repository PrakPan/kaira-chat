import React, { useState, useEffect } from "react";

import media from "../../media";

import styled from "styled-components";
//  import LocationsContainer from './LocationsContainer'
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Grid from "@mui/material/Grid";
const Container = styled.div`
  width: 100%;

  @media screen and (min-width: 768px) {
  }
`;

const Dates = (props) => {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  let isPageWide = media("(min-width: 768px)");

  return (
    <Grid
      container
      spacing={2}
      style={{
        visibility:
          props.showCities && props.destination ? "hidden" : "visible",
      }}
    >
      <Grid item xs={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            inputFormat="dd/MM/yyyy"
            open={openStart}
            onOpen={() => setOpenStart(true)}
            onClose={() => setOpenStart(false)}
            disablePast
            label={
              <div style={{ backgroundColor: "transparent !important" }}>
                Start Date
              </div>
            }
            value={props.valueStart}
            onChange={(newValue) => {
              props.setValueStart(newValue);
            }}
            renderInput={(params) => (
              <TextField
                style={{ backgroundColor: "white" }}
                onClick={(e) => setOpenStart(true)}
                {...params}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
      {/* <Grid item xs={1} className="">
                                    to
                            </Grid> */}
      <Grid item xs={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            inputFormat="dd/MM/yyyy"
            open={openEnd}
            disablePast
            minDate={props.valueStart}
            onOpen={() => setOpenEnd(true)}
            onClose={() => setOpenEnd(false)}
            label={
              <div style={{ backgroundColor: "transparent !important" }}>
                End Date
              </div>
            }
            value={props.valueEnd}
            onChange={(newValue) => {
              props.setValueEnd(newValue);
            }}
            renderInput={(params) => (
              <TextField
                style={{ backgroundColor: "white" }}
                onClick={(e) => setOpenEnd(true)}
                {...params}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
};

export default Dates;
