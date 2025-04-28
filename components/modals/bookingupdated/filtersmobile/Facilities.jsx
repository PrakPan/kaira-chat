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
      <div className="mb-2 font-medium">Facilities</div>

      <div className="flex flex-row items-center gap-2 flex-wrap">
        {props.facilities.map((facility, index) => (
          <div
            key={index}
            onClick={() => handleFacilities(facility)}
            style={{
              background: isSelectedFacility(facility) ? "#F0F0FE" : "#F6F6F6",
            }}
            className="border-2 p-2 rounded-full cursor-pointer flex items-center gap-1"
          >
            {facility}
            {isSelectedFacility(facility) && (
              <span>
                <Image src="/tick.svg" width={15} height={15} alt="tick" />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
