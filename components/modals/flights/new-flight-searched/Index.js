import React from "react";
import styled from "styled-components";
import SectionTwo from "./sectiontwo/Index";
import SectionThree from "./SectionThree";
import SelectedSectionTwo from "./sectiontwo/SelectedSectionTwo";
import LogoContainer from "./LogoContainer";

const Container = styled.div`
  width: 95%;
  background-color: white;
  margin: auto;
  ${(props) =>
    props.isSelected &&
    "background : #FFFBBB ; border : 1px solid #F7E700!important"};
  border-radius: 10px;
  height: 100%;
  margin-bottom: 0.5rem;
  @media screen and (min-width: 768px) {
    background: white;
    width: 100%;
    border-radius: 10px;
    position: relative;
  }
`;

const GridContainer = styled.div`
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 8.5rem;
    justify-content: space-between;
  }
`;

const Flight = (props) => {
  return (
    <>
      <Container
        className="border"
        isSelected={props.isSelected}
        style={{ borderRadius: "10px" }}
      >
        <LogoContainer url={`media/airlines/${props.data?.segments[0]?.airline?.code}.png`} />
        <GridContainer>
          {props.isSelected ? (
            <SelectedSectionTwo
              data={props.data}
              selectedBooking={props.selectedBooking}
              isSelected={props.isSelected}
            ></SelectedSectionTwo>
          ) : (
            <SectionTwo
              data={props.data}
              selectedBooking={props.selectedBooking}
              isSelected={props.isSelected}
            ></SectionTwo>
          )}
          <SectionThree
            selectedBooking={props.selectedBooking}
            _deselectBookingHandler={props._deselectBookingHandler}
            _updateBookingHandler={props._updateBookingHandler}
            is_selecting={props.is_selecting}
            isSelected={props.isSelected}
            data={props.data}
          ></SectionThree>
        </GridContainer>
      </Container>
    </>
  );
};

export default Flight;
