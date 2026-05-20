import React from "react";
import { BsPeopleFill } from "react-icons/bs";

export const noOfAdults = ({ adult }) => {
  return (
    <div className="ttw-type-body-strong gap-3 flex flex-row items-center">
      <BsPeopleFill className="ttw-type-body text-[#7A7A7A]" />
      <div className="ttw-type-h5 text-black">{adult} Adults</div>
    </div>
  );
};
