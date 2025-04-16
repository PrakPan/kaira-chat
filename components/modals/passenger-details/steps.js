import React from "react";

const Steps = ({ page,nextPage }) => {
  return (
    <div className="flex justify-center items-center mb-4">
      <div className="flex items-center w-[447px] justify-center">
        <div
          className={`px-[22px] py-[10px] bg-[#191919]
        ${page == 1 ? "bg-[#191919] !text-white" : "bg-white text-[#191919] border border-[#191919]"} 
        rounded-[30px]`}
        >
          Step 1
        </div>
        {nextPage&&<div
          className="flex-grow border-t border-black"
          style={{ borderTopStyle: "dotted" }}
        ></div>}
        {nextPage&&<div
          className={`px-[22px] py-[10px]  ${
            page == 2 ? "bg-[#191919] !text-white" : "bg-white text-[#191919] border border-[#191919]"
          } rounded-[30px]`}
        >
          Step 2
        </div>}
      </div>
    </div>
  );
};

export default Steps;
