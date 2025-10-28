import Image from "next/image";
import React from "react";

const BackArrow = ({ handleClick }) => {
  return (
    <div
      className="cursor-pointer"
      onClick={handleClick}
    >
      <Image src="/backarrow.svg" width={22} height={22}  />
    </div>
  );
};

export default BackArrow;
