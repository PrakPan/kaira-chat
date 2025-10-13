import React, { useEffect } from "react";
import styled from "styled-components";
import GroupComponent from "./GroupComponent";
import EnterPassenger from "./EnterPassenger";
import { Body1M_16 } from "../../new-ui/Body";
import { useDispatch, useSelector } from "react-redux";
import { setAddFlights, setAddHotels, setGroupType, setNumberOfAdults, setNumberOfChildren, setNumberOfInfants, setRoomConfiguration, togglePreference } from "../../../store/actions/slideOneActions";

const Container = styled.div`
  color: black;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;


const Section = styled.div`
`;

const SlideThree = (props) => {
  const dispatch = useDispatch();

  const {
    groupType,
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    roomConfiguration,
    addHotels,
    addFlights,
  } = useSelector((state) => state.tailoredInfoReducer.slideThree);
  const selectedPreferences = useSelector((state) => state.tailoredInfoReducer.slideThree.selectedPreferences)||[];
  const setSelectedPrefrences=(value)=>{
    dispatch(togglePreference(value));
  }

    useEffect(() => {
    if (groupType) {
      props.setSubmitSecondSlide(true);
    }
  }, []);


  const _handleShowPax = (grouptype) => {
    if (grouptype === "Solo") {
      dispatch(setNumberOfAdults(1));
      dispatch(setNumberOfChildren(0));
      dispatch(setNumberOfInfants(0));
      dispatch(
        setRoomConfiguration([{ adults: 1, children: 0, infants: 0, childAges: [] }])
      );
    } else {
      dispatch(setNumberOfAdults(2));
      dispatch(setNumberOfChildren(0));
      dispatch(setNumberOfInfants(0));
      dispatch(
        setRoomConfiguration([{ adults: 2, children: 0, infants: 0, childAges: [] }])
      );
    }
    dispatch(setGroupType(grouptype));
    props.setSubmitSecondSlide(true);
  };

  return (
    <Container>
      <Section>
        <Body1M_16 className="mb-[4px]">Group type</Body1M_16>

        <GroupComponent
          _handleShowPax={_handleShowPax}
          groupType={groupType}
          selectedPreferences={selectedPreferences}
          setSelectedPreferences={setSelectedPrefrences}
        ></GroupComponent>
      </Section>

      {groupType !== "Solo" && groupType != "Couple" &&
        <EnterPassenger
          roomConfiguration={roomConfiguration}
          setRoomConfiguration={(conf) => dispatch(setRoomConfiguration(conf))}
          groupType={groupType}
          numberOfChildren={numberOfChildren}
          numberOfInfants={numberOfInfants}
          numberOfAdults={numberOfAdults}
          setNumberOfAdults={(val) => dispatch(setNumberOfAdults(val))}
          setNumberOfChildren={(val) => dispatch(setNumberOfChildren(val))}
          setNumberOfInfants={(val) => dispatch(setNumberOfInfants(val))}
        />
      }
      <div>
        <Body1M_16 className="mb-[12px]">Pick Your Inclusions</Body1M_16>
        <Section className="grid grid-cols-3 justify-between items-center">

          <label
            htmlFor="add-hotels"
            className="flex items-center gap-2 p-2 rounded-md w-fit cursor-pointer"
          >
            <input
              id="add-hotels"
              type="checkbox"
              checked={addHotels}
              onChange={(e) => dispatch(setAddHotels(e.target.checked))}
              className="focus:outline-none cursor-pointer"
            />
            <div className="Body2R_14">Stay</div>
          </label>

          <label
            htmlFor="add-flights"
            className="flex items-center gap-2 p-2 rounded-md w-fit cursor-pointer justify-self-center"
          >
            <input
              id="add-flights"
              type="checkbox"
              checked={addFlights}
              onChange={(e) => dispatch(setAddFlights(e.target.checked))}
              className="focus:outline-none cursor-pointer"
            />
            <div className="Body2R_14">Flights</div>
          </label>

          <div></div>
        </Section>
      </div>
    </Container>
  );
};

export default SlideThree;
