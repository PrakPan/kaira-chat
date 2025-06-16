import Pax from "../slidetwo/pax/Pax.jsx";
import BudgetSlider from "../slidetwo/preferences/BudgetSlider.jsx";
import Question from "../Question.js";

export default function SlideThree(props) {
  return (
    <div className="my-3 space-y-5">
      <Question>Hotel Preference</Question>

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
        roomConfiguration={props.roomConfiguration}
      ></Pax>

      <div className="space-y-1">
        <BudgetSlider
          tailoredForm
          destination={props.destination}
          defaultValue={props.defaultPriceRange}
          setBudget={props.setBudget}
          setPriceRange={props.setPriceRange}
        ></BudgetSlider>
      </div>
    </div>
  );
}
