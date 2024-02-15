import React from "react";
import styled from "styled-components";
import { IoMdSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import media from "../../media";

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
  let isPageWide = media("(min-width: 768px)");

  const searchHandler = (e) => {
    if (
      (e.target.id === "icon" || e.key === "Enter") &&
      props.selectSearch.trim().length > 0
    ) {
      props._updateOptionsHandlerWithFilter();
      // props.setSelectedSearch("");
    }
  };

  return (
    <Container className="font-lexend flex flex-col gap-3 md:flex-row lg:flex-row md:justify-between lg:justify-between">
      <div className="flex flex-row">
        <IoMdClose
          className="hover-pointer"
          onClick={props.setHideBookingModal}
          style={{ fontSize: "2rem" }}
        ></IoMdClose>
        <Text>
          Changing Stays in {props?.booking_city ? props?.booking_city : "City"}
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
          onKeyDown={searchHandler}
          placeholder={`Search stays`}
          className="w-full flex items-center text-sm border-2 border-gray-300 rounded-lg px-5 py-2 focus:outline-none focus:border-[#F7E700]"
        ></input>
      </div>
    </Container>
  );
};

export default Section;
