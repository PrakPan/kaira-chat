import React from "react";
import styled from "styled-components";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import StarSlider from "../leftsidebar/StarSlider";
import { TbArrowBack } from "react-icons/tb";
import media from "../../../media";
import { GrFormClose } from "react-icons/gr";

const Container = styled.div`
  @media screen and (min-width: 768px) {
    padding: 0.5rem;
    border-radius: 5px;
  }
`;

const Heading = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  margin: 0 0 1.5rem 0;
`;

const Label = styled.p`
  font-size: 0.75rem;
  margin: 0 0 0 0rem;
`;

const Pannel = (props) => {
  let isPageWide = media("(min-width: 768px)");

  let filter = null;

  const _onChangeHandler = (checked, filter, heading) => {
    if (checked) props._addFilterHandler(filter, heading);
    else props._removeFilterHandler(filter, heading);
  };

  if (props.heading === "Budget") filter = "budget";
  else if (props.heading === "Star Category") filter = "star_category";
  else filter = "type";

  return (
    <Container className={isPageWide ? "border-thin" : ""}>
      <div
        className="hidden-desktop"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <TbArrowBack
          onClick={() => props.onclose()}
          className="hover-pointer"
          style={{ fontSize: "1.75rem", textAlign: "right", margin: "1rem" }}
        ></TbArrowBack>
      </div>
      <div
        className="hidden-mobile"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <GrFormClose
          onClick={() => props.onclose()}
          className="hover-pointer"
          style={{
            fontSize: "1.5rem",
            textAlign: "right",
            marginBottom: "0.5rem",
          }}
        ></GrFormClose>
      </div>

      <Heading className="font-lexend hidden-desktop">{props.heading}</Heading>
      {props.heading !== "Star Category" ? (
        <div style={{ margin: "0 auto" }}>
          <FormGroup
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gridGap: "0.5rem",
              margin: "0 0.5rem 1.5rem 0.5rem",
            }}
          >
            {props.filters[filter].map((currentfilter, i) => (
              <FormControlLabel
                key={i}
                className="border"
                style={{ margin: "0" }}
                control={
                  <Checkbox
                    onChange={(event) =>
                      _onChangeHandler(
                        event.target.checked,
                        currentfilter,
                        filter
                      )
                    }
                    sx={{
                      "& .MuiSvgIcon-root": { fontSize: 16 },
                      color: "black",
                      "&.Mui-checked": { color: "black" },
                    }}
                    defaultChecked={
                      props.filtersState
                        ? props.filtersState.budget
                          ? props.filtersState.budget.includes(currentfilter)
                            ? true
                            : false
                          : false
                        : false
                    }
                  />
                }
                label={<Label className="font-lexend">{currentfilter}</Label>}
              />
            ))}
          </FormGroup>
        </div>
      ) : (
        <StarSlider
          _updateStarFilterHandler={props._updateStarFilterHandler}
        ></StarSlider>
      )}
    </Container>
  );
};

export default React.memo(Pannel);
