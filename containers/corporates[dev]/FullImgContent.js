import React from "react";
import styled from "styled-components";
import Button from "../../components/ui/button/Index";
import media from "../../components/media";

const Container = styled.div`
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 33% 0 0 0;

  @media screen and (min-width: 768px) {
    padding: 10vh 10vh 0 10vh;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const Heading = styled.h1`
  color: white;
  width: 99%;
  font-weight: 700;
  margin-bottom: 1rem;
  font-size: 2rem;
  @media screen and (min-width: 768px) {
    font-size: 3rem;
    font-weight: 700;
  }
`;

const SubText = styled.h3`
  color: white;
  font-weight: 100;
  width: 99%;
  font-size: 1.25rem;
  @media screen and (min-width: 768px) {
    font-size: 2rem;
  }
`;

const CompanyName = styled.h4`
  color: white;
  font-weight: 800;
  width: 99%;
  font-size: 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 1.75rem;
  }
`;

const FullImgContent = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
      <div className="font-lexend text-white text-[27px] md:text-[40px] font-[300] md:leading-[56px] pl-[30px] md:pl-[120px] pt-[104px] md:pt-[304px]">
        {isPageWide ? (
          <div className="font-lexend">
            <span className="text-[#F7E700] font-[700]">TheTarzanWay</span> For Business
          </div>
        ) : null}

        <div className="font-[700]">Hassle-Free Business Travel Partner</div>

        <div>
          Workcations, Retreats, Conferences, Weekend Getaways and more
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
          Schedule Callback
        </Button>
      </div>
  );
};

export default FullImgContent;
