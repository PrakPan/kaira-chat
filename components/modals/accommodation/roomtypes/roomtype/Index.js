import React, { useEffect } from "react";
import styled from "styled-components";
import ImageLoader from "../../../../UpdatedBackgroundImageLoader";
import { getIndianPrice } from "../../../../../services/getIndianPrice";
import media from "../../../../media";

const Container = styled.div`
  width: 100%;
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 75px auto;
  @media screen and (min-width: 768px) {
    grid-template-columns: 85px auto;
  }
`;

const Ammenity = styled.div`
  font-size: 0.65rem;
  background-color: hsl(0, 0%, 95%);
  padding: 0.25rem;
  margin: 2px;
  border-radius: 5px;
  width: max-content;
  display: inline-block;
`;

const ImageContainer = styled.div`
  height: 85px;
  width: 85px;
`;

const RoomType = (props) => {
  let isPageWide = media("(min-width: 768px)");

  useEffect(() => {
    let ammenities_arr = [];
    if (props.data.room_facilities) {
      for (var i = 0; i < props.data.room_facilities.length; i++) {
        ammenities_arr.push(
          <Ammenity className="font-lexend">
            {props.data.room_facilities[i]}
          </Ammenity>
        );
      }
    }
  }, [props.data]);

  let image = "media/icons/bookings/notfounds/noroom.png";

  if (props.images && props.images.length) {
    for (var i = 0; i < props.images.length; i++) {
      if (props.images[i].ImageType === "2") {
        image = props.images[i].ImageUrl;
        break;
      }
    }
  }

  return (
    <Container>
      <ImageContainer>
        <ImageLoader
          noLazy
          height={isPageWide ? "85px" : "75px"}
          width={isPageWide ? "85px" : "75px"}
          borderRadius="10px"
          dimensions={{ height: 200, width: 200 }}
          url={image}
        />
      </ImageContainer>
      <div>
        <div
          style={
            isPageWide
              ? { fontSize: "16px", fontWeight: "500" }
              : { fontSize: "14px", fontWeight: "400" }
          }
        >
          {props.data.room_type}
        </div>

        <div style={{ fontWeight: "500" }}>
          {"₹" + getIndianPrice(Math.round(props.data.prices.min_price / 100))}
          <span style={{ fontWeight: "300" }}> per night</span>
        </div>
      </div>
    </Container>
  );
};

export default RoomType;
