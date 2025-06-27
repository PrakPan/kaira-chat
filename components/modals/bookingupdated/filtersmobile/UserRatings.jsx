import { IoMdStar } from "react-icons/io";
import Image from "next/image";
import { getStars } from "../../../itinerary/itineraryCity/SlabElement";

export default function UserRatings(props) {
  const handleUserStar = (star) => {
    if (props.selectedUserStar.includes(star)) {
      props.setSelectedUserStar((prev) => prev.filter((item) => item !== star));
    } else {
      props.setSelectedUserStar((prev) => [...prev, star]);
    }
  };

  const isSelectedUserStar = (star) => {
    return props.selectedUserStar.includes(star);
  };

  return (
    <div className="flex flex-col justify-start items-baseline">
      <div className="mb-2 font-normal">User Ratings</div>
      <div className="flex flex-wrap gap-2">
        {props.userRatings.map((star, i) => (
          <button
            key={i}
            onClick={() => handleUserStar(star)}
            className={`flex gap-2 font-normal p-2 rounded-full cursor-pointer text-sm justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0
              ${isSelectedUserStar(star) ? "bg-[#F0F0FE]" : "bg-[#F6F6F6]"}
              active:text-white border-[#D0D5DD]`}
          >
            {getStars(star)}
            {isSelectedUserStar(star) && (
              <span>
                <Image src="/tick.svg" width={15} height={15} alt="tick" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
