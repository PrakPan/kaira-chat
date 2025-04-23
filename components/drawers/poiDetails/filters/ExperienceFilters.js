import Image from "next/image";
import { EXPERIENCE_FILTERS_BOX } from "../../../../services/constants";

export default function ExperienceFilters(props) {
  const handleExperienceFilters = (experienceFilter) => {
    if (props.experienceFilters.includes(experienceFilter)) {
      if (experienceFilter !== "All") {
        if (props.experienceFilters.length == 1) {
          props.setChanged(false);
        }
        props.setExperienceFilters((prev) =>
          prev.filter((item) => item !== experienceFilter)
        );
      }
    } else {
      if (experienceFilter === "All") {
        props.setExperienceFilters(["All"]);
        props.setChanged(false);
      } else {
        props.setExperienceFilters((prev) => [
          ...prev.filter((item) => item !== "All"),
          experienceFilter,
        ]);
        props.setChanged(true);
      }
    }
  };

  const isSelectedexperienceFilter = (experienceFilter) => {
    return props.experienceFilters.includes(experienceFilter);
  };

  return (
    <div className="flex flex-col justify-start items-baseline">
      <div className="mb-2 font-medium">experienceFilter</div>

      <div className="flex flex-row items-center gap-2 flex-wrap">
        <div
          onClick={() => handleExperienceFilters("All")}
          style={{
            background: isSelectedexperienceFilter("All") ? "#F0F0FE" : "",
          }}
          className="border-2 p-2 rounded-full cursor-pointer flex items-center gap-1"
        >
          All
          {isSelectedexperienceFilter("All") && (
            <span>
              <Image src="/tick.svg" width={"15"} height={15} alt="tick" />
            </span>
          )}
        </div>

        {EXPERIENCE_FILTERS_BOX.map((experienceFilter, index) => (
          <div
            key={index}
            onClick={() => handleExperienceFilters(experienceFilter?.display)}
            style={{
              background: isSelectedexperienceFilter(experienceFilter?.display)
                ? "#F0F0FE"
                : "",
            }}
            className="border-2 p-2 rounded-full bg-[#F6F6F6] cursor-pointer flex items-center gap-1"
          >
            {experienceFilter?.display}
            {isSelectedexperienceFilter(experienceFilter?.display) && (
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
