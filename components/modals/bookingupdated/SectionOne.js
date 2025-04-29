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
    if (props.selectSearch.trim().length > 0) {
      props.fetchHotels();
    }
  };

  return (
    <div>
      <div className="m-[1rem]">
      <BackArrow
        handleClick={() => {
          try {
            props.setHideBookingModal();
            props?.resetPaginationStatus();
            props?.setMoreOptionsJSX([]);
            props?.setFilters((prev) => ({
              ...prev,
              occupancies: props?.hotelsConf,
            }));
            // props?.setFilters((prev)=>({
            //   ...prev,
            //   props?.hotelsConf})));
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
            className="absolute cursor-pointer left-4 text-2xl"
          />

          <input
            type="text"
            value={props.selectSearch}
            onChange={(e) => props.setSelectedSearch(e.target.value)}
            placeholder={`Search stays`}
            className="w-full flex items-center text-sm border-2 border-gray-300 rounded-lg px-5 py-2 focus:outline-none focus:border-[#F7E700]"
          ></input>
        </div>
      </Container>
    </div>
  );
};

export default Section;
