import Pax from "../slidetwo/pax/Pax.jsx";
import BudgetSlider from "../slidetwo/preferences/BudgetSlider.jsx";
import Question from "../Question.js";
import styled from "styled-components";
import { StyledButton, StyledFlexWrap } from "../../styled-components/TailoredForm.js";
import { useState } from "react";
import { Body1M_16, Body2R_14 } from "../../new-ui/Body.js";

export const StyledTextarea = styled.textarea`
  width: 543px;
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
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  const _isPreferenceAdded = (pref) => {
    return props?.slideFour?.mealPreferences.includes(pref);
  };

  const _handleClick = (pref) => {
    props.setSlideFour((prev) => ({
      ...prev,
      mealPreferences: props?.slideFour?.mealPreferences.includes(pref)
        ? props?.slideFour?.mealPreferences.filter((p) => p !== pref)
        : [...props?.slideFour?.mealPreferences, pref]
    }))
  };

  const handleSpecialRequest = (e) => {
    props.setSlideFour((prev) => ({
      ...prev,
      specialRequests: e.target.value
    }))
  };

  const handleHotelType = (e) => {
    const { value, checked } = e.target;
    props.setSlideFour((prev) => ({
      ...prev,
      hotelType: checked ? [...props?.slideFour?.hotelType, value] : props?.slideFour?.hotelType.filter((item) => item !== value)
    }))
  };

  return (
    <div className="flex flex-col gap-[30px]">
      <div className="flex flex-col gap-[12px]">
        <Body1M_16>Hotel Type</Body1M_16>

        <div className="flex justify-between">
          {["3", "4", "5"].map((star) => (
            <label
              key={star}
              className="flex items-center gap-2 p-2 rounded-md w-fit cursor-pointer"
            >
              <input
                type="checkbox"
                value={star}
                checked={props?.slideFour?.hotelType.includes(star)}
                onChange={handleHotelType}
                className="focus:outline-none cursor-pointer"
              />
              <div className="text-sm">{star}-Stars</div>
            </label>
          ))}
        </div>

      </div>
      <div>
        <Body2R_14 className="mb-[6px]">Room Configuration</Body2R_14>
        <Pax
          numberOfAdults={props.numberOfAdults}
          setNumberOfAdults={props.setNumberOfAdults}
          numberOfChildren={props.numberOfChildren}
          setNumberOfChildren={props.setNumberOfChildren}
          numberOfInfants={props.numberOfInfants}
          roomConfiguration={props.roomConfiguration}
          setNumberOfInfants={props.setNumberOfInfants}
          setRoomConfiguration={props.setRoomConfiguration}
          groupType={props.groupType}
        ></Pax>
      </div>

      <div>
        <Body1M_16 className="mb-[6px]">Meal Prefernces</Body1M_16>
        <StyledFlexWrap >
          {MEAL_PREFERENCES.map((filter, i) => {
            let clicked = false
            return (
              <div
                key={i}
                is_selected={_isPreferenceAdded(filter)}
                className="  hover-pointer"
                onClick={() => _handleClick(filter)}
              >
                <StyledButton
                  style={{ lineHeight: "1.2", alignItems: "flex-start" }}
                  className="center-div"
                  clicked={_isPreferenceAdded(filter)}
                >
                  {filter}
                </StyledButton>
              </div>
            );
          })}
        </StyledFlexWrap>
      </div>
      <div>
        <Body2R_14 className="mb-[6px]">Special Requests</Body2R_14>
        <StyledTextarea placeholder="Write any special requests" onChange={handleSpecialRequest} value={props.specialRequests} />
      </div>
    </div>
  );
}
