import { useSelector } from "react-redux";
import CityDay from "./CityDay";

const CityDaybyDay = (props) => {
  return (
    <div className="flex flex-col">
      {props.city?.day_by_day.map((day, index) => (
        <>
        <CityDay key={day.slab_id} index={index} day={day} city={props.city.city} setItinerary={props?.setItinerary}/>
        </>
      ))}
    </div>
  );
};

export default CityDaybyDay;
