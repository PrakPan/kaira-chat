import React from "react";
import styled from "styled-components";
import { IoMdSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import BackArrow from "../../ui/BackArrow";

const Container = styled.div`
  margin: 0;
  display: flex;
  gap: 0.5rem;
  margin: 1rem;
  @media screen and (min-width: 768px) {
  }
`;

const Text = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const Section = (props) => {
  const searchHandler = (e) => {
    if (props.selectSearch.trim().length > 3) {
      props.fetchHotelsAutocomplete();
    }
  };

  console.log("SEARCH RESULTS:", props.searchResults);

  return (
    <div>
      <div className="m-[1rem]">
        <BackArrow
          handleClick={() => {
            try {
              props?.handleClose();
            } catch (error) {
              console.log("unable to close:", error);
            }
          }}
        />
      </div>
      <Container className="font-lexend flex flex-col gap-3 md:flex-row lg:flex-row md:justify-between lg:justify-between">
        <div className="flex flex-row">
          <Text>
            {props?.clickType == "Add" ? "Add" : "Changing"} Stays in{" "}
            {props?.booking_city ? props?.booking_city : "City"}
          </Text>
        </div>
        <div className="lg:w-[50%] md:w-[50%] flex flex-row items-center relative">
          <IoMdSearch
            id={"icon"}
            onClick={searchHandler}
            className="absolute cursor-pointer left-4 text-2xl text-gray-400 z-10"
          />

          <input
            type="text"
            value={props.selectSearch}
            onChange={(e) => {
              props.setSelectedSearch(e.target.value);
              props.setSelectedHotelId && props.setSelectedHotelId(null);
            }}
            placeholder={`Search stays`}
            className="w-full flex items-center text-sm border-2 border-gray-300 rounded-lg pl-12 pr-10 py-2 focus:outline-none focus:border-[#F7E700] transition-colors"
          />

          {props.selectSearch && (
            <IoMdClose
              onClick={props.handleClearSearch}
              className="absolute cursor-pointer right-4 text-xl text-gray-400 hover:text-gray-600 z-10"
            />
          )}

          {props.selectSearch.trim().length > 3 && props?.searchResults.length > 0 && (
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
                <div className="px-2 py-2 text-center">
                 
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Section;
