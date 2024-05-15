import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWifi, faStar, faHome } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../ui/button/Index";
import { getIndianPrice } from "../../../../services/getIndianPrice";
import { FaArrowUp } from "react-icons/fa";
import { BiRupee } from "react-icons/bi";
import { BsInfoCircle } from "react-icons/bs";

const Container = styled.div`
  position: relative;
  padding: 0 0.5rem 3rem 0.5rem;
`;

const Name = styled.div`
  font-size: 1rem;
  font-weight: 700;
  display: inline;
  line-height: 1;
`;

const RightBottomContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0.5rem;
  display: flex;
`;

const Cost = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0.5rem 0 0;
  line-height: 1;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

const TagsContainer = styled.div`
  display: flex;
  margin: 0 0 2rem 0;
`;

const Tag = styled.div`
  padding: 0.15rem 1rem;
  border-radius: 2rem !important;
  margin-right: 0.5rem;
  font-size: 0.75rem;
`;

const Accommodation = (props) => {
  return (
    <Container className="">
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      >
        <Name className="font-lexend">
          {props.name}
          <BsInfoCircle style={{ marginLeft: "0.25rem" }}></BsInfoCircle>
        </Name>
      </div>
      <TagsContainer>
        <Tag className="border">
          <FontAwesomeIcon
            icon={faStar}
            style={{ marginRight: "0.25rem" }}
          ></FontAwesomeIcon>
          {props.star + " star"}
        </Tag>
        <Tag className="border">
          <FontAwesomeIcon
            icon={faHome}
            style={{ marginRight: "0.25rem" }}
          ></FontAwesomeIcon>
          {props.type}
        </Tag>
      </TagsContainer>
      <div style={{ marginBottom: "0rem" }}>
        <p
          style={{
            fontWeight: "300",
            fontSize: "0.75rem",
            margin: "0 0 0.25rem 0",
          }}
          className="font-lexend"
        >
          {"" + props.room_type}
        </p>
        {props.includeBreakfast ? (
          <p
            style={{
              fontWeight: "300",
              fontSize: "0.75rem",
              margin: "0 0 0.5rem 0",
            }}
            className="font-lexend"
          >
            Breakfast Included
          </p>
        ) : null}
        <FontAwesomeIcon
          icon={faWifi}
          style={{ width: "1rem", display: "block" }}
        ></FontAwesomeIcon>
      </div>
      <RightBottomContainer>
        <Cost className="font-lexend">
          <FaArrowUp
            style={{
              fontWeight: "600",
              color: "red",
              fontSize: "1.25rem",
              marginRight: "0.25rem",
            }}
          ></FaArrowUp>
          <BiRupee style={{ fontWeight: "300" }}></BiRupee>
          {" " + getIndianPrice(props.cost) + " /-"}
        </Cost>

        <Button
          boxShadow
          onclick={props._updateBookingHandler}
          onclickparam={{
            booking_id: props.booking_id,
            itinerary_id: props.itinerary_id,
            tailored_id: props.tailored_id,
            accommodation_id: props.accommodation_id,
            city: props.selectedBooking.city,
            costing_breakdown: [
              {
                number_of_adults: props.selectedBooking.pax["number_of_adults"],
                number_of_children:
                  props.selectedBooking.pax["number_of_children"],
                number_of_infants:
                  props.selectedBooking.pax["number_of_infants"],
                pricing_type: props.pricing_type,
                room_type: props.room_type,
                room_type_name: props.room_type,
                number_of_rooms: props.selectedBooking.number_of_rooms,
              },
            ],
          }}
          borderRadius="2rem"
          padding="0.25rem 1rem"
          borderWidth="0"
          bgColor="#f7e700"
          hoverColor="white"
          hoverBgColor="black"
        >
          Select
        </Button>
      </RightBottomContainer>
    </Container>
  );
};

export default Accommodation;
