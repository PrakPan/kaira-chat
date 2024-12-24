import SlabElement from "./SlabElement";

const CityDay = (props) => {
  return (
    <div className="bg-[#FEFAD8] p-2 rounded-lg flex flex-col">
      <div>
        <p className="md:text-lg font-semibold">
          Day {props.index + 1}{" "}
          {props.day?.day_summary ? `- ${props.day.day_summary}` : null}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {props.day?.slab_elements.map((element, index) => (
          <SlabElement key={index} element={element} />
        ))}
      </div>
    </div>
  );
};

export default CityDay;
