import React from "react";

const RecommendedBadge = () => (
    <div className="relative inline-block align-top" style={{ height: 31 }}>
      <span
        className="absolute left-0 -top-2 w-0 h-0 border-l-[8px] border-l-transparent border-b-[8px] border-b-[#a94445]"
        style={{ zIndex: 4 }}
      />
      <span
        className="bg-[#EA5455] text-white text-[15px] font-medium pl-3 pr-4 py-[5px] r relative z-10 leading-[20px] inline-block"
        style={{ height: 31, lineHeight: "21px", verticalAlign: "top" }}
      >
        Recommended
      </span>
    </div>
  );
  

export default RecommendedBadge;
