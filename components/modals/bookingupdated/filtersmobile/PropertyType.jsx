import Image from "next/image";

export default function PropertyType(props) {
  const handleTypes = (type) => {
    if (props.selectedTypes.includes(type)) {
      if (type !== "All") {
        props.setSelectedTypes((prev) => prev.filter((item) => item !== type));
      }
    } else {
      if (type === "All") {
        props.setSelectedTypes(["All"]);
      } else {
        props.setSelectedTypes((prev) => [
          ...prev.filter((item) => item !== "All"),
          type,
        ]);
      }
    }
  };

  const isSelectedType = (type) => {
    return props.selectedTypes.includes(type);
  };

  return (
    <div className="flex flex-col justify-start items-baseline">
      <div className="mb-2 font-medium">Property type</div>

      <div className="flex flex-row items-center gap-2 flex-wrap">
        {/* All option */}
        <div
          onClick={() => handleTypes("All")}
          style={{
            background: isSelectedType("All") ? "#F0F0FE" : "#F6F6F6",
          }}
          className="border-2 p-2 rounded-full cursor-pointer flex items-center gap-1"
        >
          All
          {isSelectedType("All") && (
            <span>
              <Image src="/tick.svg" width={15} height={15} alt="tick" />
            </span>
          )}
        </div>

        {/* Other types */}
        {props.types.map((type, index) => (
          <div
            key={index}
            onClick={() => handleTypes(type)}
            style={{
              background: isSelectedType(type) ? "#F0F0FE" : "#F6F6F6",
            }}
            className="border-2 p-2 rounded-full cursor-pointer flex items-center gap-1"
          >
            {type}
            {isSelectedType(type) && (
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
