import React from "react";
import Button from "../ui/button/Index";

export const FilterComponent = ({ input, setInput }) => {

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg w-64">
      <h2>Select Filters</h2>
      <div className="border-1"></div>
      {input?.departure_time_period&&<div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Departure in</h3>
        <div className="flex flex-col space-y-2">
          {["All","Morning", "Afternoon", "Evening", "Night"].map((time) => (
            <label key={time} className="flex items-center space-x-2">
              <input
                type="radio"
                id={time.toLowerCase()}
                name="departure"
                value={time.toLowerCase()}
                className="accent-blue-500"
                onClick={() => {
                  setInput({
                    ...input,
                    departure_time_period: time=="All"?"":time.toLowerCase(),
                  });
                }}
              />
              <span className="text-gray-700">{time}</span>
            </label>
          ))}
        </div>
      </div>}

      {input?.arrival_time_period &&<div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Reach by</h3>
        <div className="flex flex-col space-y-2">
          {["All","Morning", "Afternoon", "Evening", "Night"].map((time) => (
            <label key={time + "reach"} className="flex items-center space-x-2">
              <input
                type="radio"
                id={time.toLowerCase() + "-reach"}
                name="reachBy"
                value={time.toLowerCase()}
                className="accent-blue-500"
                onClick={() => {
                  setInput({
                    ...input,
                    arrival_time_period: time=="All"?"":time.toLowerCase(),
                  });
                }}
              />
              <span className="text-gray-700">{time}</span>
            </label>
          ))}
        </div>
      </div>}

      {input?.starCategory&&<div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Star Category</h3>
        <div className="flex flex-col space-y-2">
          {[1,2, 3, 4, 5].map((star) => (
            <label key={star} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={star}
                name="departure"
                value={star}
                className="accent-blue-500"
                onClick={(e) => {
                  const mySet=new Set(input?.starCategory)
                  mySet.add(Number(e.target.value))
                  setInput({
                    ...input,
                    starCategory:[...mySet]
                  });
                }}
              />
              <span className="text-gray-700">{star}</span>
            </label>
          ))}
        </div>
      </div>}
      {input?.userRatings&&<div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">User Ratings</h3>
        <div className="flex flex-col space-y-2">
          {[1,2, 3, 4, 5].map((rating) => (
            <label key={rating} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={rating}
                name="departure"
                value={rating}
                className="accent-blue-500"
                onClick={(e) => {
                  const mySet=new Set(input?.userRatings)
                  mySet.add(e.target.value)
                  setInput({
                    ...input,
                    userRatings:[...mySet]
                  });
                }}
              />
              <span className="text-gray-700">{rating}</span>
            </label>
          ))}
        </div>
      </div>}
      <div className="flex justify-center">
      <Button
            padding="0.75rem 1rem"
            fontSize="18px"
            fontWeight="500"
            bgColor="#f7e700"
            borderRadius="7px"
            color="black"
            borderWidth="1px"
            onclick={() =>
              setInput((prev) => ({
                ...prev,
                applyFilter: !input.applyFilter,
            }))
            }
          >
            Apply Filter
          </Button>
    </div>
    </div>
  );
};
