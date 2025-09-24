import React from "react";
import styled from "styled-components";
import ImageLoader from "../../../ImageLoader";
import { getHumanDate } from "../../../../services/getHumanDate";

const Container = styled.div`
  flex-grow: 1;
  margin: 0.5rem 0.5rem 0 0.5rem;
  @media screen and (min-width: 768px) {
  }
`;

const Heading = styled.p`
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  line-height: 1;
`;

const Text = styled.p`
  font-size: 13px;
  color: rgba(91, 89, 89, 1);

  font-weight: 300;
  margin: 0;
  letter-spacing: 1px;
`;

const Section = (props) => {
  const getDate = (date) => {
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);
    return getHumanDate(day + "/" + month + "/" + year);
  };

  let rooms = [];

  try {
    props.data.costings_breakdown.map((data) => {
      rooms.push(data);
    });
  } catch {}

  if (props.data)
    return (
      <Container className="">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {props.data.check_in &&
          props.isDatePresent &&
          !props.is_registration_needed ? (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <ImageLoader
                url="media/icons/bookings/calendar (1).png"
                height="1.5rem"
                width="1.5rem"
                widthmobile="1.5rem"
                dimensions={{ width: 100, height: 100 }}
                margin="0"
                leftalign
              ></ImageLoader>
              <div>
                <Heading className="">Date</Heading>
                <Text className="">
                  {getDate(props.data.check_in)}
                </Text>
              </div>
            </div>
          ) : null}
          {props.data.ideal_duration_hours_text ? (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <ImageLoader
                url="media/icons/bookings/time.svg"
                height="1.5rem"
                width="1.5rem"
                widthmobile="1.5rem"
                dimensions={{ width: 100, height: 100 }}
                margin="0"
                leftalign
              ></ImageLoader>
              <div>
                <Heading className="">Duration</Heading>
                <Text className="">
                  {props.data.ideal_duration_hours_text}
                </Text>
              </div>
            </div>
          ) : null}
          {props.data.costings_breakdown ? (
            props.data.costings_breakdown.no_of_tickets ? (
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}
              >
                <ImageLoader
                  url="media/icons/bookings/tourist.png"
                  height="1.5rem"
                  width="1.5rem"
                  widthmobile="1.5rem"
                  dimensions={{ width: 100, height: 100 }}
                  margin="0"
                  leftalign
                ></ImageLoader>
                <div>
                  <Text className="">
                    {props.data.costings_breakdown.no_of_tickets + " Person(s)"}
                  </Text>
                </div>
              </div>
            ) : null
          ) : null}
        </div>
      </Container>
    );
  else return null;
};

export default Section;
