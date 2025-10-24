import Pax from "../slidetwo/pax/Pax.jsx";
import styled from "styled-components";
import { StyledButton, StyledFlexWrap } from "../../styled-components/TailoredForm.js";
import { Body1M_16, Body2R_14 } from "../../new-ui/Body.js";
import { useDispatch, useSelector } from "react-redux";
import { setNumberOfAdults, setNumberOfChildren, setNumberOfInfants, setRoomConfiguration, setSpecialRequests, toggleHotelType, toggleMealPreference } from "../../../store/actions/slideOneActions.js";

export const StyledTextarea = styled.textarea`
  width: 100%;
  height: 111px;
  transform: rotate(0deg);
  opacity: 1;
  border-radius: 4px; /* S */
  border: 1px solid #ccc; /* Adjust color as per design system */
  padding: 16px; /* L */
  resize: none; /* Prevent resize if you want fixed size */
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  background-color: #fff;
  color: #000;

  &:focus {
    outline: none;
    border-color: #007bff; /* Example focus color */
  }
`;

const MEAL_PREFERENCES = ["Vegetarian", "Non-Vegetarian", "Vegan", "Jain"]
export default function SlideThree(props) {

  const {
    groupType,
    numberOfAdults,
    numberOfChildren,
    numberOfInfants,
    roomConfiguration,
  } = useSelector((state) => state.tailoredInfoReducer.slideThree);

  const { specialRequests, hotelType, mealPreferences } = useSelector(
    (state) => state.tailoredInfoReducer.slideFour
  );

  const dispatch = useDispatch();

  const handleSpecialRequest = (e) => {
    dispatch(setSpecialRequests(e.target.value));
  };


  return (
    <div className="w-[100vw] w-[100vw] sm:w-[543px]">
    <div className="flex flex-col gap-[30px] px-[16px] sm:px-[0px] ">
      <div className="flex flex-col gap-[12px]">
        <Body1M_16>Hotel Type</Body1M_16>

        <StyledFlexWrap className="justify-between">
          {["3", "4", "5"].map((star) => (
            <label
              key={star}
              className="flex items-center gap-2  rounded-md w-fit cursor-pointer"
            >
              <input
                type="checkbox"
                value={star}
                checked={hotelType.includes(star)}
                onChange={() => dispatch(toggleHotelType(star))}
                className="focus:outline-none cursor-pointer"
              />
              <div className="Body2R_14">{star}-Stars</div>
            </label>
          ))}
        </StyledFlexWrap>

      </div>
      <div>
        <Body2R_14 className="mb-[8px]">Room Configuration</Body2R_14>
        <Pax
          numberOfAdults={numberOfAdults}
          setNumberOfAdults={(val) => dispatch(setNumberOfAdults(val))}
          numberOfChildren={numberOfChildren}
          setNumberOfChildren={(val) => dispatch(setNumberOfChildren(val))}
          numberOfInfants={numberOfInfants}
          setNumberOfInfants={(val) => dispatch(setNumberOfInfants(val))}
          roomConfiguration={roomConfiguration}
          setRoomConfiguration={(val) => dispatch(setRoomConfiguration(val))}
          groupType={groupType}
        />
      </div>

      {/* <div>
        <Body1M_16 className="mb-[12px]">Meal Preferences</Body1M_16>
        <StyledFlexWrap >
          {MEAL_PREFERENCES.map((filter, i) => {
            return (
             <div
              key={i}
              is_selected={mealPreferences.includes(filter)}
              className="hover-pointer"
              onClick={() => dispatch(toggleMealPreference(filter))}
            >
              <StyledButton
                style={{ lineHeight: "1.2", alignItems: "flex-start" }}
                className="center-div Body2R_14"
                clicked={mealPreferences.includes(filter)}
              >
                {filter}
              </StyledButton>
            </div>
            );
          })}
        </StyledFlexWrap>
      </div> */}
      {/* <div>
          <Body2R_14 className="mb-[6px]">Special Requests</Body2R_14>
          <StyledTextarea
            placeholder="Write any special requests"
            onChange={handleSpecialRequest}
            value={specialRequests}
          />
      </div> */}
    </div>
    </div>
  );
}
