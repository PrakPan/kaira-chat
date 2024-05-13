import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiFillStar } from "react-icons/ai";
import { range } from "lodash";

const StarRating = ({ maxStars = 5, initialRating = 0 }) => {
  const [rating, setRating] = useState(initialRating);

  const handleClick = (starIndex) => {
    setRating(starIndex + 1);
  };

  const starVariants = {
    active: { scale: 1.2 },
    inactive: { scale: 1 },
  };

  const stars = range(maxStars);

  return (
    <div className="flex items-center">
      <div className="flex space-x-1">
        {stars.map((starIndex) => (
          <motion.div
            key={starIndex}
            variants={starVariants}
            animate={starIndex < rating ? "active" : "inactive"}
            whileHover="active"
            className="cursor-pointer"
            onClick={() => handleClick(starIndex)}
          >
            <AiFillStar
              className={`h-3 w-3 ${
                starIndex < initialRating ? "text-[#f7e700]" : "text-[#e4e4e4]"
              }`}
            />
          </motion.div>
        ))}
      </div>
      <div className="text-slate-500 pl-2 text-md">{initialRating}</div>
    </div>
  );
};

export default StarRating;
