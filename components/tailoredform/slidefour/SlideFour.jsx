import Pax from "../slidetwo/pax/Pax.jsx";
import BudgetSlider from "../slidetwo/preferences/BudgetSlider.jsx";
import Question from "../Question.js";
import styled from "styled-components";
import { StyledButton, StyledFlexWrap } from "../../styled-components/TailoredForm.js";
import { useState } from "react";
const Section = styled.div`
  margin-bottom: 1.5rem;
`;

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
    return selectedPreferences.includes(pref);
  };

  const _handleClick = (pref) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref)
        ? prev.filter((p) => p !== pref) // remove if already selected
        : [...prev, pref] // add if not selected
    );
  };
  return (
    <div className="my-3 space-y-5">
      <Question>Hotel Type</Question>
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
              // checked={props.addHotels}
              // onChange={(e) => props.setAddHotels(e.target.checked)}
              className="focus:outline-none cursor-pointer"
            />
            <div className="text-sm">3-Stars</div>
          </label>

          <label
            htmlFor="add-flights"
            className="flex items-center gap-2 p-2 rounded-md w-fit cursor-pointer"
          >
            <input
              id="add-flights"
              type="checkbox"
              // checked={props.addFlights}
              // onChange={(e) => props.setAddFlights(e.target.checked)}
              className="focus:outline-none cursor-pointer"
            />
            <div className="text-sm">4-Stars</div>
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
            <div className="text-sm">5-Stars</div>
          </label>
        </Section>
      </div>
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

      {/* <div className="space-y-1">
        <BudgetSlider
          tailoredForm
          destination={props.destination}
          defaultValue={props.defaultPriceRange}
          setBudget={props.setBudget}
          setPriceRange={props.setPriceRange}
        ></BudgetSlider>
      </div> */}

      <div>
        <Question>Meal Prefernces</Question>
        <StyledFlexWrap >
          {MEAL_PREFERENCES.map((filter, i) => {
            let clicked = false
            return (
              <div
                key={i}
                is_selected={_isPreferenceAdded(filter)}
                className=" font-lexend hover-pointer"
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
        <Question>Special Requests</Question>
        <StyledTextarea placeholder="Write any special requests"/>
        </div>
    </div>
  );
}
