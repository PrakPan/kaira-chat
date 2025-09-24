import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ImageContainer from "./imagecontainer/Index";
import SectionOne from "./SectionOne";
import SectionTwo from "./SectionTwo";
import SectionThree from "./SectionThree";
import SectionFour from "./SectionFour";
import AccommodationModal from "../../../modals/accommodation/Index";

const Container = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-flow: column;
  height: 100%;
  @media screen and (min-width: 768px) {
    border-radius: 10px;
    position: relative;
  }
`;

const Detail = styled.p`
  font-size: 0.75rem;
  margin: 0 0 0.25rem 0;
  font-weight: 300;
`;

const Booking = (props) => {
  let imagesarr = [];

  let roomsJSX = [];
  useEffect(() => {
    if (props.type === "Accommodation")
      for (var i = 0; i < props.rooms.length; i++) {
        if (props.rooms[i].number_of_rooms)
          roomsJSX.push(
            <Detail key={i} className="">
              {props.rooms[i].room_type
                ? props.rooms[i].number_of_rooms +
                  " x " +
                  props.rooms[i].room_type
                : props.rooms[i].number_of_rooms + " x Private Room"}
            </Detail>
          );
        else
          roomsJSX.push(
            <Detail key={i} className="">
              {props.rooms[i].room_type
                ? props.rooms[i].room_type
                : "Private Room"}
            </Detail>
          );
      }
  }, [props.rooms]);
  if (props.images)
    for (var i = 0; i < props.images.length; i++) {
      imagesarr.push(props.images[i].image);
    }
  let mealplan = "";
  if (props.price_type === "EP") mealplan = "Room Only";
  else if (props.price_type === "CP") mealplan = "Breakfast Included";
  else if (props.price_type === "MAP")
    mealplan = "Breakfast and Lunch / Dinner included";
  else if (props.price_type === "AP")
    mealplan = "Breakfast, Lunch and Dinner Included";

  const [showDetails, setShowDetails] = useState(false);
  return (
    <div style={{ height: "max-content" }}>
      <div
        style={{ margin: "0 0 0.5rem 0", fontSize: "18px" }}
        className=""
      >
        <b>{props.data ? (props.data.city ? props.data.city : "") : ""}</b>
        {props.data
          ? props.data.duration
            ? " - " + props.data.duration + " night(s) stay"
            : ""
          : ""}
      </div>

      <Container className="border" style={{ borderRadius: "10px" }}>
        <ImageContainer
          type={props.data.accommodation_type}
          star_category={props.data.star_category}
          images={props.data.images}
          are_prices_hidden={props.are_prices_hidden}
          _setImagesHandler={props.setImagesHandler}
          setShowBookingModal={props.setShowBookingModal}
          setImagesHandler={props.setImagesHandler}
        ></ImageContainer>
        <div
          style={{
            padding: "",
            flex: "1 1 auto",
            display: "flex",
            flexFlow: "column",
          }}
        >
          <div
            style={{
              padding: "",
              flex: "1 1 auto",
              display: "flex",
              flexFlow: "column",
              height: "100%",
            }}
          >
            <SectionOne
              is_registration_needed={props.is_registration_needed}
              setShowBookingModal={props.setShowBookingModal}
              setShowDetails={() => setShowDetails(true)}
              data={props.data}
            ></SectionOne>
            <SectionTwo
              is_registration_needed={props.is_registration_needed}
              isDatePresent={props.isDatePresent}
              data={props.data}
            ></SectionTwo>
            <SectionThree
              is_registration_needed={props.is_registration_needed}
              are_prices_hidden={props.are_prices_hidden}
              setShowLoginModal={props.setShowLoginModal}
              token={props.token}
              data={props.data}
              _deselectBookingHandler={props._deselectBookingHandler}
              is_selecting={props.is_selecting}
            ></SectionThree>
            {!props.is_registration_needed ? (
              <SectionFour
                setShowDetails={() => setShowDetails(true)}
                setShowBookingModal={props.setShowBookingModal}
              ></SectionFour>
            ) : null}
          </div>
        </div>
        <AccommodationModal
          payment={props.payment}
          check_in={props.check_in}
          check_out={props.check_out}
          _setImagesHandler={props.setImagesHandler}
          onHide={() => setShowDetails(false)}
          setShowDetails={setShowDetails}
          id={props.data.accommodation}
          show={showDetails}
          setShowLoginModal={props.setShowLoginModal}
        ></AccommodationModal>
      </Container>
    </div>
  );
};

export default Booking;
