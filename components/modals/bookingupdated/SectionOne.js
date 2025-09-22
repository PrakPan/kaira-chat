import React from "react";
import styled from "styled-components";
import { IoMdSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import BackArrow from "../../ui/BackArrow";
import Image from "next/image";


const svgIcons = {
  'filter': <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <g clip-path="url(#clip0_2310_2286)">
      <path d="M6.66667 15.5V10.5H8.33333V12.1667H15V13.8333H8.33333V15.5H6.66667ZM0 13.8333V12.1667H5V13.8333H0ZM3.33333 10.5V8.83333H0V7.16667H3.33333V5.5H5V10.5H3.33333ZM6.66667 8.83333V7.16667H15V8.83333H6.66667ZM10 5.5V0.5H11.6667V2.16667H15V3.83333H11.6667V5.5H10ZM0 3.83333V2.16667H8.33333V3.83333H0Z" fill="white" />
    </g>
    <defs>
      <clipPath id="clip0_2310_2286">
        <rect width="15" height="15" fill="white" />
      </clipPath>
    </defs>
  </svg>,
  'search': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12.9671 11.6556H12.3133L12.0815 11.4321C12.8926 10.4885 13.381 9.26355 13.381 7.93098C13.381 4.95959 10.9724 2.55103 8.00103 2.55103C5.02965 2.55103 2.62109 4.95959 2.62109 7.93098C2.62109 10.9024 5.02965 13.3109 8.00103 13.3109C9.33359 13.3109 10.5586 12.8226 11.5021 12.0115L11.7256 12.2432V12.8971L15.864 17.0272L17.0973 15.794L12.9671 11.6556ZM8.00103 11.6556C5.9401 11.6556 4.27646 9.99192 4.27646 7.93098C4.27646 5.87004 5.9401 4.2064 8.00103 4.2064C10.062 4.2064 11.7256 5.87004 11.7256 7.93098C11.7256 9.99192 10.062 11.6556 8.00103 11.6556Z" fill="#ACACAC" />
  </svg>
}


const Section = (props) => {
  const searchHandler = (e) => {
    if (props.selectSearch.trim().length > 0) {
      props.fetchHotels();
    }
  };

  return (
    <div>
      <div className="my-[1rem]">
        <div> <Image src="/backarrow.svg" className="cursor-pointer" width={22} height={2} onClick={() => {
          try {
            props?.handleClose();
          } catch (error) {
            console.log("unable to close:", error);
          }
        }} /> </div>
      </div>
      <div className="flex flex-column gap-xl">
        <div className="flex flex-row">
          <p className="text-xl mb-zero font-600 leading-2xl">
            {props?.clickType == "Add" ? "Add" : "Changing"} Stays in{" "}
            {props?.booking_city ? props?.booking_city : "City"}
          </p>
        </div>
        <div className="flex flex-row items-center gap-xs">
          <div className="flex flex  flex-1  flex-row items-center relative">
            <span className="absolute left-xs">{svgIcons.search}</span>

            <input
              type="text"
              value={props.selectSearch}
              onChange={(e) => props.setSelectedSearch(e.target.value)}
              placeholder={`Search stays`}
              className="w-full rounded-md-lg border-sm border-text-disabled py-xs pl-2xl pr-sm font-400 text-sm-md leading-lg-md focus:outline-none focus:ring-0 focus:border-sm focus:border-blue-500 focus:border-primary-indigo"
            ></input>
          </div>
          <button onClick={() => props?.setShowFilters(true)} className="ttw-btn-secondary-fill">{svgIcons.filter} <span className="max-ph:hidden">Filter</span></button>
        </div>
      </div>
    </div>
  );
};

export default Section;
