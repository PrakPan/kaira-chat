import Image from "next/image";
import React from "react";

const LadakhLogo = () => {
  return (
    <div className="grid grid-cols-5 w-full h-[48px]">
      <div className="bg-[#1E4597] flex items-center justify-center">
        <Image src={"/Ladakh_1.svg"} width={"54"} height={"48"} />
      </div>
      <div className="bg-white flex items-center justify-center">
        <Image src={"/Ladakh_2.svg"} width={"54"} height={"48"} />
      </div>
      <div className="bg-[#D72F28] flex items-center justify-center">
        <Image src={"/Ladakh_3.svg"} width={"54"} height={"48"} />
      </div>
      <div className="bg-[#108041] flex items-center justify-center">
        <Image src={"/Ladakh_4.svg"} width={"54"} height={"48"} />
      </div>
      <div className="bg-[#F7EB20] flex items-center justify-center">
        <Image src={"/Ladakh_5.svg"} width={"54"} height={"48"} />
      </div>
    </div>
  );
};

export default LadakhLogo;
