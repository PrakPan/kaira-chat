import { IoMdStar } from "react-icons/io";
import { getStars } from "../../../itinerary/itineraryCity/SlabElement";
import Image from "next/image";

export default function Rating(props) {
  const handleRating = (star) => {
    if (props.selectedRating.includes(star)) {
      props.setSelectedRating((prev) => prev.filter((item) => item !== star));
      
    } else {
      props.setSelectedRating((prev) => [...prev, star]);
    }
  };

  const isSelectedRating = (star) => {
    return props.selectedRating.includes(star);
  };

  return (
    <div className="flex flex-col justify-start items-baseline">
      <div className="mb-2 font-normal">Rating</div>
      <div className="flex flex-row gap-2">
        {props.ratings.map((star, i) => (
          <button
            onClick={() => handleRating(star)}
            className={`flex gap-2 font-normal p-2 rounded-full cursor-pointer   text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${
              isSelectedRating(star) ? "bg-[#F0F0FE]" : "bg-[#F6F6F6]"
            }
                            active:text-white  border-[#D0D5DD]  rounded-full`}
            key={i}
          >
            {getStars(star)}
            {isSelectedRating(star) && (
              <span>
                <Image src="/tick.svg" width={"15"} height={15} alt="tick" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
