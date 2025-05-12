import Pax from "../slidetwo/pax/Pax.jsx";
import BudgetSlider from "../slidetwo/preferences/BudgetSlider.jsx";

export default function SlideThree(props) {
  return (
    <div className="my-5 space-y-5">
      <Pax
        numberOfAdults={props.numberOfAdults}
        setNumberOfAdults={props.setNumberOfAdults}
        numberOfChildren={props.numberOfChildren}
        setNumberOfChildren={props.setNumberOfChildren}
        numberOfInfants={props.numberOfInfants}
        setNumberOfInfants={props.setNumberOfInfants}
        setRoomConfiguration={props.setRoomConfiguration}
        groupType={props.groupType}
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
