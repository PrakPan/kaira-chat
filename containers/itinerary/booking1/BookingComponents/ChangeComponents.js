import React from "react";
import { BsPeopleFill } from "react-icons/bs";

export const noOfAdults = ({ adult }) => {
  return (
    <div className="text-md font-medium gap-3 flex flex-row items-center">
      <BsPeopleFill className="text-md text-[#7A7A7A]" />
      <div className="text-md font-semibold text-black">{adult} Adults</div>
    </div>
  );
};
