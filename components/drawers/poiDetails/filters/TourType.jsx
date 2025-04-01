import Image from "next/image";

export default function TourType(props) {
  const handleCategory = (category) => {
    if (props.selectedTourTypes.includes(category)) {
      if (category !== "All") {
        props.setSelectedTourTypes((prev) =>
          prev.filter((item) => item !== category)
        );
      }
    } else {
      if (category === "All") {
        props.setSelectedTourTypes(["All"]);
      } else {
        props.setSelectedTourTypes((prev) => [
          ...prev.filter((item) => item !== "All"),
          category,
        ]);
      }
    }
  };

  const isSelectedCategory = (category) => {
    return props.selectedTourTypes.includes(category);
  };

  return (
    <div className="flex flex-col justify-start items-baseline">
      <div className="mb-2 font-medium text-[14px]">Tour Type</div>

      <div className="flex flex-row items-center gap-2 flex-wrap">
        <div
          onClick={() => handleCategory("All")}
          style={{
            background: isSelectedCategory("All") ? "#F0F0FE" : "",
          }}
          className="border-2 p-2 bg-[#F6F6F6] rounded-full cursor-pointer flex items-center gap-1"
        >
          All
          {isSelectedCategory("All")&&<span><Image src="/tick.svg" width={"15"} height={15} alt="tick"/></span>}
        </div>

        {props.tourTypes.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategory(category)}
            style={{
              background: isSelectedCategory(category) ? "#F0F0FE" : "",
            }}
            className="border-2 bg-[#F6F6F6] p-2 rounded-full cursor-pointer flex items-center gap-1"
          >
            {category}
            {isSelectedCategory(category)&&<span><Image src="/tick.svg" width={"15"} height={15} alt="tick"/></span>}
          </div>
        ))}
      </div>
    </div>
  );
}
