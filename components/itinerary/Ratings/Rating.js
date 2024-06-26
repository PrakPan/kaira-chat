import { useEffect, useRef, useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { connect } from "react-redux";
import useMediaQuery from "../../../hooks/useMedia";
import UserRating from "./UserRating";

const Ratings = ({ plan }) => {
  const rating = plan?.review;
  const reviews = plan?.rating_count;
  const [stars, setStars] = useState(null);
  const [showUserRating, setShowUserRating] = useState(false);
  const userRatingRef = useRef(null);

  const isDesktop = useMediaQuery("(min-width:767px)");

  useEffect(() => {
    if (rating) {
      const stars = [];
      for (let i = 0; i < Math.floor(rating); i++) {
        stars.push(<FaStar />);
      }
      if (Math.floor(rating) < rating) {
        stars.push(<FaStarHalfAlt />);
      }
      setStars(stars);
    }
  }, []);

  const handleOutsideClick = (event) => {
    if (
      userRatingRef.current &&
      !userRatingRef.current.contains(event.target)
    ) {
      setShowUserRating(false);
    }
  };

  if (!(rating && reviews)) return null;

  return (
    <div className="relative flex flex-col gap-2 items-center w-fit">
      <div className="py-2 flex flex-row gap-2 items-center">
        <div className="flex flex-row gap-1 text-[#FFD201]">{stars}</div>
        <div className="text-sm font-light text-gray-600">
          {rating}/5 <span className="md:hidden">({reviews})</span>
          <span
            onClick={() => setShowUserRating(true)}
            className="text-blue cursor-pointer text-sm font-light leading-3 ml-3 md:hidden"
          >
            Rate now
          </span>
        </div>
      </div>

      {isDesktop && (
        <div className="flex flex-row gap-2">
          <span className="text-sm font-light text-gray-600 leading-3">
            {reviews} customer ratings
          </span>
          <span
            onClick={() => setShowUserRating(true)}
            className="text-blue cursor-pointer text-sm font-light leading-3"
          >
            Liked this itinerary? Rate out of 5
          </span>
        </div>
      )}

      {showUserRating && (
        <div
          onClick={handleOutsideClick}
          className="inset-0 fixed flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <UserRating userRatingRef={userRatingRef} />
        </div>
      )}
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    plan: state.Plan,
  };
};

export default connect(mapStateToPros)(Ratings);
