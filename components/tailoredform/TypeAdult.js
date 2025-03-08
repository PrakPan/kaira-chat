import React, { useState } from "react";
import styled from "styled-components";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { makeStyles } from "@mui/styles";
import usePageLoaded from "../custom hooks/usePageLoaded";

const useStyles = makeStyles((theme) => ({
  noPadding: {
    padding: 0,
  },
  fullWidth: {
    width: "100%",
    padding: 0,
  },
  relative: {
    position: "relative",
  },
}));

const Option = styled.option`
  padding: 0.75rem;
  background-color: white;
  border-style: none none solid none;
  border-width: 1px;
  border-color: hsl(0, 0%, 97%);
  &:hover {
    background-color: hsl(0, 0%, 96%);
    cursor: pointer;
  }
`;

const QueryType = (props) => {
  const isPageLoaded = usePageLoaded();
  const classes = useStyles();
  const [queryType, setQueryType] = useState("");

  if (isPageLoaded) {
    const queries = [
      "Conferences or offsites",
      "Workcations or retreats",
      "Central Booking platform",
      "Partnerships",
      "Others",
    ];
    const _handleQueryTypeChange = (event) => {
      setQueryType(event.target.value);
      props.setAdults(event.target.value);
    };
    return (
      <FormControl className={classes.fullWidth} variant="outlined">
        <InputLabel htmlFor="contact-query-select" id="contact-query-label">
          Adults
        </InputLabel>
        <Select
          native={true ? true : false}
          label="Topic of Interest"
          value={queryType}
          id="contact-query-select"
          onChange={_handleQueryTypeChange}
          className={classes.relative}
        >
          <Option aria-label="None" value="" style={{ display: "none" }} />
          <Option value={1} className="font-nunito">
            1
          </Option>
          <Option value={2} className="font-nunito">
            2
          </Option>
          <Option value={3} className="font-nunito">
            3
          </Option>
          <Option value={4} className="font-nunito">
            4
          </Option>
          <Option value={5} className="font-nunito">
            5
          </Option>
          <Option value={6} className="font-nunito">
            6
          </Option>
          <Option value={7} className="font-nunito">
            7
          </Option>
          <Option value={8} className="font-nunito">
            8
          </Option>
          <Option value={9} className="font-nunito">
            9
          </Option>
          <Option value={10} className="font-nunito">
            10
          </Option>
          <Option value={11} className="font-nunito">
            11
          </Option>
          <Option value={12} className="font-nunito">
            12
          </Option>
          <Option value={13} className="font-nunito">
            13
          </Option>
          <Option value={14} className="font-nunito">
            14
          </Option>
          <Option value={15} className="font-nunito">
            15
          </Option>
        </Select>
      </FormControl>
    );
  } else return null;
};

export default QueryType;
