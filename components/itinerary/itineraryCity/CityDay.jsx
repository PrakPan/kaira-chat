import SlabElement from "./SlabElement";

const CityDay = (props) => {
  return (
    <div className="bg-gray-100 p-2 rounded-lg">
      <div>
        <p className="text-sm font-semibold">Day {props.index + 1}</p>
      </div>

      <div className="space-y-2">
        {props.day?.slab_elements.map((element, index) => (
          <SlabElement key={index} element={element} />
        ))}
      </div>
    </div>
  );
};

export default CityDay;
