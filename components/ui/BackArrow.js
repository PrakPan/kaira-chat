import Image from "next/image";
import React from "react";

const BackArrow = ({ handleClick }) => {
  return (
    <div
      className="w-fit flex items-center gap-[11px] cursor-pointer px-[10px] py-[5px] rounded-[8px] bg-[#EFEFEF]"
      onClick={handleClick}
    >
      <Image src="/backarrow.svg" width={22} height={2} />
      <div className="text-[14px]">Back</div>
    </div>
  );
};

export default BackArrow;
