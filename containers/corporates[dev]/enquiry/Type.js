import React, { useState } from "react";
import styled from "styled-components";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { makeStyles } from "@mui/styles";
import usePageLoaded from "../../../components/custom hooks/usePageLoaded";

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

  if (isPageLoaded) {
    const classes = useStyles();
    const queries = [
      "Conferences or offsites",
      "Workcations or retreats",
      "Central Booking platform",
      "Partnerships",
      "Others",
    ];
    const [queryType, setQueryType] = useState("");
    const _handleQueryTypeChange = (event) => {
      setQueryType(event.target.value);
      props._changeDetailsHandler(event, "type");
    };
    return (
      <FormControl className={classes.fullWidth} variant="outlined">
        <InputLabel htmlFor="contact-query-select" id="contact-query-label">
          How can we help you?
        </InputLabel>
        <Select
          native={true ? true : false}
          label="Topic of interest"
          value={queryType}
          id="contact-query-select"
          onChange={_handleQueryTypeChange}
          className={classes.relative}
        >
          <Option aria-label="None" value="" style={{ display: "none" }} />
          <Option value={queries[0]} className="font-nunito">
            {queries[0]}
          </Option>
          <Option value={queries[1]} className="font-nunito">
            {queries[1]}
          </Option>
          <Option value={queries[2]} className="font-nunito">
            {queries[2]}
          </Option>
          <Option value={queries[3]} className="font-nunito">
            {queries[3]}
          </Option>
          <Option value={queries[4]} className="font-nunito">
            {queries[4]}
          </Option>
        </Select>
      </FormControl>
    );
  } else return null;
};

export default QueryType;
