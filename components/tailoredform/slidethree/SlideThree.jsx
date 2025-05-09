import Pax from "../slidetwo/pax/Pax.jsx";
import BudgetSlider from "../slidetwo/preferences/BudgetSlider.jsx";

export default function SlideThree(props) {
  return (
    <div className="my-5 space-y-5">
      <div className="bg-[#FFEFE5] flex items-center gap-2 p-2 rounded-md w-fit">
        <input
          type="checkbox"
          checked={props.addHotels}
          onChange={(e) => props.setAddHotels(e.target.checked)}
          className="focus:outline-none cursor-pointer"
        ></input>
        <div className="text-sm">Add hotels to my itinerary?</div>
      </div>

      <div className="space-y-5">
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
    </div>
  );
}
