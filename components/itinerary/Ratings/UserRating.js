import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { connect } from "react-redux";
import rateItineraryInstance from "../../../services/itinerary/rateItinerary";

const UserRatings = ({
  itinerary_id,
  userRatingRef,
  setRating,
  setReviews,
}) => {
  const [stars, setStars] = useState(null);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (userRating && i + 1 <= userRating) {
        stars.push(
          <FaStar
            onClick={() => handleRate(i)}
            key={i}
            index={i}
            className="cursor-pointer text-[#FFD201]"
          />
        );
      } else {
        stars.push(
          <FaStar
            onClick={() => handleRate(i)}
            key={i}
            index={i}
            className="cursor-pointer text-gray-300"
          />
        );
      }
    }

    setStars(stars);
  }, [userRating]);

  const handleRate = (index) => {
    setUserRating(index + 1);

    rateItineraryInstance
      .post("", {
        itinerary_id,
        rating: index + 1,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          setRating(data.review);
          setReviews(data.rating_count);
        } else {
          setUserRating(null);
        }
      })
      .catch((err) => {
        setUserRating(null);
        console.log("[ERROR][userRating]: ", err.message);
      });
  };

  return (
    <div
      ref={userRatingRef}
      className="w-fit p-5 bg-white rounded-lg drop-shadow-2xl"
    >
      <div className="flex flex-col gap-2 items-center">
        <div className="text-lg font-medium">Liked this itinerary?</div>

        <div className="bg-gray-100 rounded-full px-3 py-2 flex flex-row gap-2 items-center">
          <div className="flex flex-row gap-1 text-gray-300">{stars}</div>
        </div>

        <div className="text-sm font-light text-gray-600 leading-3">
          Please rate out of 5
        </div>
      </div>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    itinerary_id: state.ItineraryId,
  };
};

export default connect(mapStateToPros)(UserRatings);

const StarRating = ({ star, percent }) => {
  return (
    <div className="w-full flex flex-row items-end justify-between gap-1">
      <div className="text-xs text-blue w-fit text-nowrap">{star} star</div>

      <div className="w-[80%] h-3 bg-gray-100 rounded-full">
        <div
          style={{ width: `${percent}%` }}
          className={`h-3 bg-yellow-400 rounded-full`}
        ></div>
      </div>

      <div className="text-xs w-fit text-nowrap">{percent}%</div>
    </div>
  );
};
