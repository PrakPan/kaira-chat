import * as React from "react";
import styled from "styled-components";
import NewDatePicker from "../../../components/tailoredform/slideone/NewDatePicker";

const Container = styled.div`
  width: 96%;
  margin-inline: 2%;
  .TextContainer {
    width: 100%;
    display: flex;
    text-align: left;
    gap: 28px;
  }
  .TextContainer > p {
    width: 100%;
  }
  .DateRangePicker_picker_1 {
    left: 0 !important;
  }
  .CalentderIcons {
    width: 58%;
  }
  @media screen and (min-width: 768px) {
    width: 618px;
    margin: auto;
    padding-bottom: 20vh;
    .TextContainer {
      width: 618px;
      display: flex;
      text-align: left;
      gap: 28px;
    }
    .TextContainer > p {
      width: 618px;
    }
    .CalentderIcons {
      width: 55%;
    }
  }
`;

const ResponsiveDatePickers = (props) => {
  return (
    <Container className="center-div">
      <NewDatePicker
        personaliseForm
        valueStart={props.startDate}
        valueEnd={props.endDate}
        setValueStart={props.setStartDate}
        setValueEnd={props.setEndDate}
      />
    </Container>
  );
};

export default ResponsiveDatePickers;
