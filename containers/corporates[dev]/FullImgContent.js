import React from "react";
import { MdEventAvailable } from "react-icons/md";
import { LuPhoneCall } from "react-icons/lu";
import { RiGlobalFill } from "react-icons/ri";

import Button from "../../components/ui/button/Index";
import media from "../../components/media";
import ScheduleCall from "./enquiry/ScheduleCall";

const FullImgContent = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <div className=" flex justify-between text-white text-[27px] md:text-[35px] font-[300] pl-[30px] md:px-[10%] pt-[60px] md:pt-[104px]">
      <div className="md:w-[50%] md:my-auto space-y-3 md:space-y-10">
        <div className=" text-[36px] md:text-[40px]">
          <span className="text-[#F7E700] font-[600]">TheTarzanWay</span> For
          Business
        </div>

        <div className="">
          Give your team stories they will always treasure!
        </div>

        <div className="text-base font-medium space-y-6">
          <div className="flex items-center gap-3">
            <MdEventAvailable className="text-2xl" />
            <div>Unique Travel & Event Plans</div>
          </div>

          <div className="flex items-center gap-3">
            <LuPhoneCall className="text-2xl" />
            <div>End-to-End Support</div>
          </div>

          <div className="flex items-center gap-3">
            <RiGlobalFill className="text-2xl" />
            <div>Trusted Global Partners</div>
          </div>
        </div>

        <Button
          onclick={props.setEnquiryOpen}
          onclickparams={null}
          link="/"
          padding="0.75rem 1rem"
          fontSize="18px"
          fontWeight="500"
          bgColor="#f7e700"
          borderRadius="7px"
          color="black"
          borderWidth="1px"
          margin={isPageWide ? "3rem 0 0 0" : "2rem 0 0 0"}
        >
          Schedule a Callback
        </Button>
      </div>

      {isPageWide && (
        <div className="w-[40%]">
          <ScheduleCall banner />
        </div>
      )}
    </div>
  );
};

export default FullImgContent;
