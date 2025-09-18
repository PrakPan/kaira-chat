import Image from "next/image";

export default function Facilities(props) {
  const handleFacilities = (facility) => {
    if (props.selectedFacilities.includes(facility)) {
      props.setSelectedFacilities((prev) =>
        prev.filter((item) => item !== facility)
      );
    } else {
      props.setSelectedFacilities((prev) => [...prev, facility]);
    }
  };

  const isSelectedFacility = (facility) => {
    return props.selectedFacilities.includes(facility);
  };

  return (
    <div className="flex flex-col justify-start items-baseline">
      <div className="mb-md text-md font-500 leading-xl">Facilities</div>
      <div className="flex flex-col gap-md">
        {props.facilities.map((facility, index) => (
          <div className="relative">
            <label
              key={index}
              className="flex items-center gap-2 cursor-pointer ttw-custom-yellochekbox-label" >
              <input
                type="checkbox"
                checked={isSelectedFacility(facility)}
                onChange={() => handleFacilities(facility)}
                className="w-4 h-4 accent-primary-yellow cursor-pointer ttw-custom-yellochekbox"
              />
              <span className="font-md font-400 text-black">{facility}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
