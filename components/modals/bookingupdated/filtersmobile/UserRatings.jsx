import { IoMdStar } from "react-icons/io";
import Image from "next/image";
import { getStars } from "../../../itinerary/itineraryCity/SlabElement";
import { useEffect, useState } from "react";

export default function UserRatings(props) {

  const [reverseOrder, setreverseOrder] = useState(props.userRatings)

  useEffect(() => {
    setreverseOrder(prev => [...prev].reverse());
  }, [])

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
      <div className="mb-md text-md font-500 leading-xl">User Ratings</div>

      <div className="flex flex-col flex-wrap  gap-md">
        {reverseOrder.map((star, index) => (
          <div className="relative ">
            <label
              key={index}
              className="flex items-center gap-2 cursor-pointer ttw-custom-yellochekbox-label" >
              <input
                type="checkbox"
                checked={isSelectedUserStar(star)}
                onChange={() => handleUserStar(star)}
                className="w-4 h-4 accent-primary-yellow cursor-pointer ttw-custom-yellochekbox"
              />
              <span className="font-md font-400 text-black">{props?.userRatingsLabel[star] || 'Rating'}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
