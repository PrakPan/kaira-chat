import React, { useEffect } from "react";
import styled from "styled-components";
import GroupType from "./GroupType";
import Question from "../Question";

const Container = styled.div`
  color: black;
  width: 100%;
  @media screen and (min-width: 768px) {
  }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SlideTwo = (props) => {
  useEffect(() => {
    if (props.groupType) {
      props.setSubmitSecondSlide(true);
    }
  }, []);

  const _handleShowPax = (grouptype) => {
    if (grouptype === "Solo") {
      props.setNumberOfAdults(1);
      props.setNumberOfChildren(0);
      props.setNumberOfInfants(0);
    } else {
      props.setNumberOfAdults(2);
      props.setNumberOfChildren(0);
      props.setNumberOfInfants(0);
    }
    props.setGroupType(grouptype);
    props.setSubmitSecondSlide(true);
  };

  return (
    <Container>
      <Section style={{ marginBottom: "1.5rem" }}>
        <Question>Your group type?</Question>

        <GroupType
          _handleShowPax={_handleShowPax}
          groupType={props.groupType}
        ></GroupType>
      </Section>

      <Section>
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="font-medium">Adults</div>
            <div className="text-xs text-gray-500">12+ years</div>
          </div>
          <div className="flex p-1 items-center justify-evenly bg-white w-20 rounded-3xl border border-blue-200">
            <button
              className={` flex items-center justify-center  ${
                props.numberOfAdults > 1 ? "text-blue " : "text-gray-300"
              }`}
              onClick={() => props.setNumberOfAdults((prev) => prev - 1)}
              disabled={props.numberOfAdults <= 1}
            >
              -
            </button>
            <span className="mx-2 w-6 text-center">{props.numberOfAdults}</span>
            <button
              className="flex items-center justify-center text-blue"
              onClick={() => props.setNumberOfAdults((prev) => prev + 1)}
              disabled={props.numberOfAdults >= 14}
            >
              +
            </button>
          </div>
        </div>

        <div
          className={`flex justify-between items-center mb-3 ${
            (props.groupType === "Solo" || props.groupType === "Couple") &&
            "opacity-50 pointer-events-none"
          }`}
        >
          <div>
            <div className="font-medium">Children</div>
            <div className="text-xs text-gray-500">2-12 years</div>
          </div>
          <div className="flex p-1 items-center justify-evenly bg-white w-20 rounded-3xl border border-blue-200">
            <button
              className={`flex items-center justify-center ${
                props.numberOfChildren > 0 ? "text-blue" : "text-gray-300"
              }`}
              onClick={() => props.setNumberOfChildren((prev) => prev - 1)}
              disabled={props.numberOfChildren >= 3}
            >
              -
            </button>
            <span className="mx-2 w-6 text-center">
              {props.numberOfChildren}
            </span>
            <button
              className=" flex items-center justify-center text-blue"
              onClick={() => props.setNumberOfChildren((prev) => prev + 1)}
              disabled={props.numberOfChildren > 12}
            >
              +
            </button>
          </div>
        </div>

        <div
          className={`flex justify-between items-center mb-3 ${
            (props.groupType === "Solo" || props.groupType === "Couple") &&
            "opacity-50 pointer-events-none"
          }`}
        >
          <div>
            <div className="font-medium">Infants</div>
            <div className="text-xs text-gray-500"> {`<2 years`}</div>
          </div>
          <div className="flex p-1 items-center justify-evenly bg-white w-20 rounded-3xl border border-blue-200">
            <button
              className={` flex items-center justify-center  ${
                props.numberOfInfants > 0 ? "text-blue " : "text-gray-300"
              }`}
              onClick={() => props.setNumberOfInfants((prev) => prev - 1)}
              disabled={props.numberOfInfants <= 0}
            >
              -
            </button>
            <span className="mx-2 w-6 text-center">
              {props.numberOfInfants}
            </span>
            <button
              className="flex items-center justify-center text-blue"
              onClick={() => props.setNumberOfInfants((prev) => prev + 1)}
              disabled={props.numberOfInfants > 4}
            >
              +
            </button>
          </div>
        </div>
      </Section>

      <Section>
        <div className="bg-[#FFEFE5] flex items-center gap-2 p-2 rounded-md w-fit">
          <input
            type="checkbox"
            checked={props.addFlights}
            onChange={(e) => props.setAddFlights(e.target.checked)}
            className="focus:outline-none cursor-pointer"
          ></input>
          <div className="text-sm">Add flights to my itinerary?</div>
        </div>
      </Section>

      {/* <Section>
        <Question>
          Hotel Type
        </Question>
        <HotelType/>
      </Section> */}
    </Container>
  );
};

export default SlideTwo;
