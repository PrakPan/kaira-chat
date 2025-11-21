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
    if (props.selectSearch.trim().length > 3) {
      props.fetchHotelsAutocomplete();
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
            <span className="absolute left-xs" onClick={searchHandler}>{svgIcons.search}</span>

            <input
              type="text"
               value={props.selectSearch}
               onChange={(e) => {
              props.setSelectedSearch(e.target.value);
              props.setSelectedHotelId && props.setSelectedHotelId(null);
            }}
              placeholder={`Search stays`}
              className="w-full rounded-md-lg border-sm border-text-disabled py-xs pl-2xl pr-sm font-400 text-sm-md leading-lg-md focus:outline-none focus:ring-0 focus:border-sm focus:border-blue-500 focus:border-primary-indigo"
            ></input>

              {props.selectSearch && (
            <IoMdClose
              onClick={props.handleClearSearch}
              className="absolute cursor-pointer right-4 text-xl text-gray-400 hover:text-gray-600 z-10"
            />
          )}

          {props.selectSearch.trim().length > 3 && (
            <div className="absolute top-full mt-2 z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
              {props.autocompleteLoading ? (
                <div className="px-4 py-2 text-center">
                  <p className="mt-2 text-sm text-gray-500">Searching...</p>
                </div>
              ) : props.searchResults.length > 0 ? (
                <div className="py-2">
                  {props.searchResults.map((suggestion, index) => (
                    <div
                      key={suggestion.id}
                      onMouseDown={(e) => {
                        e.preventDefault(); 
                        props.handleSuggestionSelect(suggestion);
                      }}
                      className={`px-2 py-1 hover:bg-gray-50 cursor-pointer transition-colors ${
                        index !== props.searchResults.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <IoMdSearch className="text-gray-400 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate mb-0">
                            {suggestion.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 mb-0">
                            {suggestion.city}, {suggestion.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-2 py-2 text-center bg-white">
                <p className="text-sm text-gray-500">No results found</p>
                </div>
              )}
            </div>
          )}
          </div>
          <button onClick={() => props?.setShowFilters(true)} className="ttw-btn-secondary-fill">{svgIcons.filter} <span className="max-ph:hidden">Filter</span></button>
        </div>
      </div>
    </div>
  );
};

export default Section;
