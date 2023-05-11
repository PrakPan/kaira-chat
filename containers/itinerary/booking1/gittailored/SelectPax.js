import React, { useState } from "react";
import styled from "styled-components";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import LogInModal from "../../../../components/modals/Login";
import usePageLoaded from "../../../../components/custom hooks/usePageLoaded";
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selected, setSelected] = useState(false);
    const [queryType, setQueryType] = useState("");
  
  

  const isPageLoaded = usePageLoaded();

  if (isPageLoaded) {
    // let [optionsJSX, setOp]
    let optionsJSX = [];
    for (var i = props.number_of_adults; i <= 20; i++) {
      optionsJSX.push(
        <Option value={i} className="font-nunito">
          {i}
        </Option>
      );
    }
    const queries = [
      "Conferences or offsites",
      "Workcations or retreats",
      "Central Booking platform",
      "Partnerships",
      "Others",
    ];

    const _handleQueryTypeChange = (event) => {
      setSelected(true);
      setQueryType(event.target.value);
      props.setPax(event.target.value);
    };
    // if(!showLoginModal)
    return (
      <div>
        <FormControl
          id="bookingsummary-pax"
          style={{ width: "100%", padding: 0 }}
          variant="outlined"
        >
          <InputLabel htmlFor="contact-query-select" id="contact-query-label">
            {"Adults"}
          </InputLabel>
          <Select
            disabled={true ? false : true}
            onClick={props.token ? null : () => setShowLoginModal(true)}
            native={true ? true : false}
            label="Topic of interest"
            value={queryType}
            onChange={_handleQueryTypeChange}
            style={{ position: "relative"}}
          >
            <Option aria-label="None" value="" style={{ display: "none" }} />
            {optionsJSX}
          </Select>
        </FormControl>

        <LogInModal
          show={showLoginModal}
          onhide={() => setShowLoginModal(false)}
        ></LogInModal>
      </div>
    );
  } else return null;
};

export default QueryType;
