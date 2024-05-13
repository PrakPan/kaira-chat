import React, { useState } from "react";
import FoodItem from "./FoodItem";
import {
  RecommendationGridContainer,
} from "./ItineraryFoodElement";
import { isJson } from "../../../services/isJSON";
import {
  Timecontainer,
} from "../../itinerary/New_Itenary_DBD/New_itenaryStyled";
import styled from "styled-components";
import { LivelyButton } from "../../../components/LiveleyButton";
import { AiOutlineDown } from "react-icons/ai";
import ImageLoader from "../../../components/ImageLoader";
import media from "../../../components/media";

const GridContainer = styled.div`
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 8.5rem auto;
    grid-column-gap: 0rem;
  }
`;

const GridContainerMobile = styled.div`
  display: grid;
  grid-template-columns: 44px auto;
  grid-column-gap: 0rem;
  @media screen and (min-width: 768px) {
    grid-column-gap: 0.5rem;
  }
`;

const ReccoIcon = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 1rem;
  @media screen and (min-width: 768px) {
    width: 6.15rem;
    justify-content: center;
    padding-bottom: 0rem;
  }
`;

const RecomendationComponent = (props) => {
  const [viewMore, setViewMore] = useState(false);
  const isPageWide = media("(min-width: 768px)");

  return props.recomendation || props.recomendation.length < 1 ? (
    <div>
      <Timecontainer>
      </Timecontainer>

      <GridContainer>
        {isPageWide ? (
          props.icon !== "media/icons/default/recommendation.svg" ? (
            <ImageLoader
              url={props.icon}
              dimensions={{ width: 300, height: 300 }}
              dimensionsMobile={{ width: 300, height: 300 }}
              borderRadius="8px"
              width="8rem"
              leftalign
              widthmobile="6rem"
            />
          ) : (
            <ReccoIcon>
              <ImageLoader
                url={"media/icons/lamp.png"}
                dimensions={{ width: 100, height: 100 }}
                dimensionsMobile={{ width: 100, height: 100 }}
                borderRadius="8px"
                width="3.25rem"
                leftalign
                widthmobile="6rem"
              />
            </ReccoIcon>
          )
        ) : (
          <></>
        )}
        <div className={`${!isJson(props.recomendation) ? "pt-0" : "pt-0"}`}>
          {!isPageWide ? (
            <GridContainerMobile
              style={
                props.icon !== "media/icons/default/recommendation.svg"
                  ? { gridTemplateColumns: "1.6fr 2.5fr", gap: "0.5rem" }
                  : { gridTemplateColumns: "44px auto" }
              }
            >
              {props.icon !== "media/icons/default/recommendation.svg" ? (
                <ImageLoader
                  url={props.icon}
                  dimensions={{ width: 250, height: 200 }}
                  dimensionsMobile={{ width: 250, height: 200 }}
                  borderRadius="8px"
                  width="8rem"
                  leftalign
                  widthmobile="100%"
                />
              ) : (
                <ReccoIcon>
                  <ImageLoader
                    url={"media/icons/lamp.png"}
                    dimensions={{ width: 100, height: 100 }}
                    dimensionsMobile={{ width: 100, height: 100 }}
                    borderRadius="8px"
                    width="3.25rem"
                    leftalign
                    widthmobile="25px"
                  />
                </ReccoIcon>
              )}
              <div className="lg:text-lg text-[1.2rem] lg:font-medium font-normal pb-3">
                {props.heading}
              </div>
            </GridContainerMobile>
          ) : (
            <div className="text-xl font-normal pb-3">{props.heading}</div>
          )}
          {props.recomendation ? (
            <div>
              {!isJson(props.recomendation) ? (
                <div
                  className={
                    isPageWide
                      ? "pt-1 font-normal text-sm"
                      : "pt-2 text-sm font-[350]"
                  }
                >
                  {props.recomendation}
                </div>
              ) : (
                <div>
                  <RecommendationGridContainer>
                    {!viewMore
                      ? JSON.parse(props.recomendation)
                          ?.slice(0, 2)
                          ?.map((item, index) => (
                            <FoodItem
                              key={index}
                              heading={item.name}
                              text={item.description}
                              ImageUrl={item.image}
                            ></FoodItem>
                          ))
                      : JSON.parse(props.recomendation)?.map((item, index) => (
                          <FoodItem
                            key={index}
                            heading={item.name}
                            text={item.description}
                            ImageUrl={item.image}
                          ></FoodItem>
                        ))}
                  </RecommendationGridContainer>
                  {JSON.parse(props.recomendation).length > 2 ? (
                    <LivelyButton
                      className="font-normal flex flex-row items-center justify-center  rounded-sm  py-1 mt-2    bg-white text-[#565555]"
                      onClick={() => setViewMore(!viewMore)}
                    >
                      {!viewMore ? "View More" : "View Less"}
                      <AiOutlineDown
                        className={`ml-2 transition-all ${
                          viewMore ? "rotate-180" : ""
                        }`}
                      />
                    </LivelyButton>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </GridContainer>
    </div>
  ) : null;
};

export default RecomendationComponent;
