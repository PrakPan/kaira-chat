import CityDay from "./CityDay";

const CityDaybyDay = (props) => {
  return (
    <div className="space-y-4">
      {props.city?.day_by_day.map((day, index) => (
        <CityDay key={day.slab_id} index={index} day={day} />
      ))}
    </div>
  );
};

export default CityDaybyDay;
