import Image from "next/image";

export default function Guide(props) {
  const handleCategory = (category) => {
    if (props.selectedGuide.includes(category)) {
      if (category !== "All") {
        props.setSelectedGuide((prev) =>
          prev.filter((item) => item !== category)
        );
      }
    } else {
      if (category === "All") {
        props.setSelectedGuide(["All"]);
      } else {
        props.setSelectedGuide((prev) => [
          ...prev.filter((item) => item !== "All"),
          category,
        ]);
      }
    }
  };

  const isSelectedCategory = (category) => {
    return props.selectedGuide.includes(category);
  };

  return (
    <div className="flex flex-col justify-start items-baseline">
      <div className="mb-2 font-medium text-[14px]">Guide</div>

      <div className="flex flex-row items-center gap-2 flex-wrap">
        <div
          onClick={() => handleCategory("All")}
          style={{
            background: isSelectedCategory("All") ? "#F0F0FE" : "",
          }}
          className="border-2 p-2 rounded-full cursor-pointer flex items-center gap-1"
        >
          All
          {isSelectedCategory("All")&&<span><Image src="/tick.svg" width={"15"} height={15} alt="tick"/></span>}
        </div>

        {props.guide.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategory(category)}
            style={{
              background: isSelectedCategory(category) ? "#F0F0FE" : "",
            }}
            className="border-2 p-2 rounded-full bg-[#F6F6F6] cursor-pointer flex items-center gap-1"
          >
            {category}
            {isSelectedCategory(category)&&<span><Image src="/tick.svg" width={"15"} height={15} alt="tick"/></span>}
          </div>
        ))}
      </div>
    </div>
  );
}
