import React from "react";
import styled from "styled-components";
import media from "../../../components/media";
import { AiFillStar } from "react-icons/ai";
import ImageLoader from "../../../components/ImageLoader";

const Card = styled.div`
  padding: 0rem;
  @media screen and (min-width: 768px) {
    padding: 2rem 0rem;
  }
`;

const CardHeading = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  margin-top: 5px;
  @media screen and (min-width: 768px) {
    font-size: 0.8rem;
    font-weight: 700;
  }
`;

const CardSubHeading = styled.p`
  font-size: 0.9rem;
  font-weight: 400;
  margin: 0 0 0rem 0;
  color: rgb(122, 122, 122);
`;

const CardListItem = styled.p`
  font-size: 0.9rem;
  font-weight: 300;
  margin: 0;
  line-height: 1.5;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  grid-gap: 1.5rem;
`;

const RatingContainer = styled.div`
  @media screen and (min-width: 768px) {
    flex-direction: row;
    gap: 0.75rem;
  }
  > div {
    display: flex;
    flex-direction: row;
  }
`;

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const CardContainer = (props) => {
  let isPageWide = media("(min-width: 768px)");

  if (isPageWide)
    return (
      <Card className="">
        <GridContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <ImageLoader
              borderRadius="8px"
              width="100%"
              widthMobile="100%"
              url={props.image}
              dimensionsMobile={{ width: 600, height: 600 }}
              dimensions={{ width: 900, height: 900 }}
            ></ImageLoader>
          </div>

          <FlexBox>
            <CardListItem className="">{props.text}</CardListItem>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <ImageLoader
                url={props.logo}
                height="45px"
                fit="contain"
                overflow="contain"
              />

              <FlexBox>
                <CardHeading className="">
                  {props.heading}
                </CardHeading>

                <RatingContainer>
                  <div>
                    <AiFillStar
                      style={{
                        color: "#FFD201",
                        fontSize: "1.25rem",
                        marginRight: "0.25rem",
                      }}
                    ></AiFillStar>
                    <AiFillStar
                      style={{
                        color: "#FFD201",
                        fontSize: "1.25rem",
                        marginRight: "0.25rem",
                      }}
                    ></AiFillStar>
                    <AiFillStar
                      style={{
                        color: "#FFD201",
                        fontSize: "1.25rem",
                        marginRight: "0.25rem",
                      }}
                    ></AiFillStar>
                    <AiFillStar
                      style={{
                        color: "#FFD201",
                        fontSize: "1.25rem",
                        marginRight: "0.25rem",
                      }}
                    ></AiFillStar>
                    <AiFillStar
                      style={{ color: "#FFD201", fontSize: "1.25rem" }}
                    ></AiFillStar>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CardSubHeading className="">
                      {props.duration + " • " + props.destination}
                    </CardSubHeading>
                  </div>
                </RatingContainer>
              </FlexBox>
            </div>
          </FlexBox>
        </GridContainer>
      </Card>
    );

  return (
    <Card className="">
      <GridContainer>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <ImageLoader
            borderRadius="8px"
            width="100%"
            height="100%"
            widthMobile="100%"
            url={props.image}
            dimensionsMobile={{ width: 600, height: 600 }}
            dimensions={{ width: 900, height: 900 }}
          ></ImageLoader>

          <CardHeading className="">{props.heading}</CardHeading>

          <RatingContainer>
            <div>
              <AiFillStar
                style={{
                  color: "#FFD201",
                  fontSize: "1rem",
                  marginRight: "0.2rem",
                }}
              ></AiFillStar>

              <AiFillStar
                style={{
                  color: "#FFD201",
                  fontSize: "1rem",
                  marginRight: "0.2rem",
                }}
              ></AiFillStar>

              <AiFillStar
                style={{
                  color: "#FFD201",
                  fontSize: "1rem",
                  marginRight: "0.2rem",
                }}
              ></AiFillStar>

              <AiFillStar
                style={{
                  color: "#FFD201",
                  fontSize: "1rem",
                  marginRight: "0.2rem",
                }}
              ></AiFillStar>

              <AiFillStar
                style={{ color: "#FFD201", fontSize: "1rem" }}
              ></AiFillStar>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <CardSubHeading className="">
                {props.duration + " • " + props.destination}
              </CardSubHeading>
            </div>
          </RatingContainer>
        </div>

        <div>
          <CardListItem className="">{props.text}</CardListItem>
        </div>
      </GridContainer>
    </Card>
  );
};

export default CardContainer;
