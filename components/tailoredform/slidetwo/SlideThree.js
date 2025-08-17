import React, { useEffect } from "react";
import styled from "styled-components";
import GroupType from "./GroupType";
import Question from "../Question";
import GroupComponent from "./GroupComponent";
import EnterPassenger from "./EnterPassenger";
import { Body1M_16 } from "../../new-ui/Body";

const Container = styled.div`
  color: black;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;


const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SlideThree = (props) => {
  useEffect(() => {
    if (props.groupType) {
      props.setSubmitSecondSlide(true);
    }
  }, []);

  useEffect(() => {
    props.setRoomConfiguration([
      {
        adults: props.numberOfAdults,
        children: props.numberOfChildren,
        infants: props.numberOfInfants,
        childAges: Array.from({ length: props.numberOfChildren }, (_, i) => 0),
      },
    ]);
  }, [props.numberOfAdults, props.numberOfChildren, props.numberOfInfants]);

  const _handleShowPax = (grouptype) => {
    if (grouptype === "Solo") {
      props.setNumberOfAdults(1);
      props.setNumberOfChildren(0);
      props.setNumberOfInfants(0);
      props.setRoomConfiguration([
        {
          adults: 1,
          children: 0,
          infants: 0,
          childAges: [],
        },
      ]);
    } else {
      props.setNumberOfAdults(2);
      props.setNumberOfChildren(0);
      props.setNumberOfInfants(0);

      props.setRoomConfiguration([
        {
          adults: 2,
          children: 0,
          infants: 0,
          childAges: [],
        },
      ]);
    }
    props.setGroupType(grouptype);
    props.setSubmitSecondSlide(true);
  };

  return (
    <Container>
      <Section style={{ marginBottom: "1.5rem" }}>
        <Body1M_16>Group type</Body1M_16>

        <GroupComponent
          _handleShowPax={_handleShowPax}
          groupType={props.groupType}
        ></GroupComponent>
      </Section>

      {props.groupType!=="Solo" && props.groupType!="Couple"&&<EnterPassenger roomConfiguration={props?.roomConfiguration} setRoomConfiguration={props.setRoomConfiguration} groupType={props.groupType} numberOfChildren={props.numberOfChildren} numberOfInfants={props.numberOfInfants} numberOfAdults={props.numberOfAdults} setNumberOfAdults={props.setNumberOfAdults} setNumberOfChildren={props.setNumberOfChildren} setNumberOfInfants={props.setNumberOfInfants} />}
      <div>
        <Question>Pick Your Inclusions</Question>
        <Section className="flex  justify-between items-center ">

          <label
            htmlFor="add-hotels"
            className="flex items-center gap-2 p-2 rounded-md w-fit cursor-pointer"
          >
            <input
              id="add-hotels"
              type="checkbox"
              checked={props.addHotels}
              onChange={(e) => props.setAddHotels(e.target.checked)}
              className="focus:outline-none cursor-pointer"
            />
            <div className="text-sm">Stay</div>
          </label>

          <label
            htmlFor="add-flights"
            className="flex items-center gap-2 p-2 rounded-md w-fit cursor-pointer"
          >
            <input
              id="add-flights"
              type="checkbox"
              checked={props.addFlights}
              onChange={(e) => props.setAddFlights(e.target.checked)}
              className="focus:outline-none cursor-pointer"
            />
            <div className="text-sm">Flights</div>
          </label>

          <label
            htmlFor="add-hotels"
            className="flex items-center gap-2 p-2 rounded-md w-fit cursor-pointer"
          >
            <input
              id="add-hotels"
              type="checkbox"
              // checked={props.addHotels}
              // onChange={(e) => props.setAddHotels(e.target.checked)}
              className="focus:outline-none cursor-pointer"
            />
            <div className="text-sm">Activities + Transfers</div>
          </label>
        </Section>
      </div>
    </Container>
  );
};

export default SlideThree;
