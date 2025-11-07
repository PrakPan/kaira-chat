import React, { useEffect } from "react";
import styled from "styled-components";
import GroupType from "./GroupType";
import Question from "../Question";
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
      <div>
        {/* <Body1M_16 className="mb-[4px]">Group type</Body1M_16> */}
        <div className="text-xl-md font-600 text-center leading-2xl-md mb-md"> Group Type </div>

        <GroupComponent
          _handleShowPax={_handleShowPax}
          groupType={groupType}
        ></GroupComponent>
      </div>

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
        <div className="text-lg font-600 leading-xl-md text-center mb-md"> Pick your inclusions </div>

        <div className="flex px-lg flex-col border-sm border-solid border-primary-yellow rounded-xl bg-text-white">
          <div className="border-b-sm border-solid border-text-disabled py-md">

            <span className="relative flex items-center ">
              <label
                className="gap-2 cursor-pointer ttw-custom-greenCheckbox-label" >
                <input
                  type="checkbox"
                  checked={addHotels}
                  onChange={(e) => dispatch(setAddHotels(e.target.checked))}
                  className="w-4 h-4 accent-primary-yellow cursor-pointer ttw-custom-greenCheckbox"
                />
                <span className="font-md font-400 text-black">Stay</span>
              </label>
            </span>
          </div>

          <div className="py-md">
            <span className="relative flex items-center ">
              <label
                className="gap-2 cursor-pointer ttw-custom-greenCheckbox-label" >
                <input
                  type="checkbox"
                  checked={addFlights}
                  onChange={(e) => dispatch(setAddFlights(e.target.checked))}
                  className="w-4 h-4 accent-primary-yellow cursor-pointer ttw-custom-greenCheckbox"
                />
                <span className="font-md font-400 text-black">Flights</span>
              </label>
            </span>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SlideThree;
