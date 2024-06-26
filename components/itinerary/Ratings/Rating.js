import { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { connect } from "react-redux";

const Ratings = ({ plan }) => {
  const rating = plan?.review;
  const reviews = plan?.rating_count;
  const [stars, setStars] = useState(null);

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

  if (!(rating && reviews)) return null;

  return (
    <div className="flex flex-col gap-2 items-center w-fit">
      <div className="bg-gray-100 rounded-full px-3 py-2 flex flex-row gap-2 items-center">
        <div className="flex flex-row gap-1 text-[#FFD201]">{stars}</div>
        <div className="text-sm font-light text-gray-600">
          {rating} out of 5
        </div>
          </div>

      <div className="text-sm font-light text-gray-600 leading-3">
        {reviews} customer ratings
      </div>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    plan: state.Plan,
  };
};

export default connect(mapStateToPros)(Ratings);
