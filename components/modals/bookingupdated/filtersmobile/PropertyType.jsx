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
      <div className="mb-md text-md font-500 leading-xl">Property Type</div>

      <div className="flex flex-row items-center gap-2 flex-wrap">
        <div className="flex flex-col flex-wrap  gap-md">
          <div className="relative">
            <label
              className="flex items-center gap-2 cursor-pointer ttw-custom-yellochekbox-label" >
              <input
                type="checkbox"
                checked={isSelectedType("All")}
                onChange={() => handleTypes("All")}
                className="w-4 h-4 accent-primary-yellow cursor-pointer ttw-custom-yellochekbox"
              />
              <span className="font-md font-400 text-black"> All</span>
            </label>
          </div>

          {/* Other types */}
          {props.types.map((type, index) => (
            <div className="relative w-[44%]">
              <label
                key={index}
                className="flex items-center gap-2 cursor-pointer ttw-custom-yellochekbox-label" >
                <input
                  type="checkbox"
                  checked={isSelectedType(type)}
                  onChange={() => handleTypes(type)}
                  className="w-4 h-4 accent-primary-yellow cursor-pointer ttw-custom-yellochekbox"
                />
                <span className="font-md font-400 text-black"> {type}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
