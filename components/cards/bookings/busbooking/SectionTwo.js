import React from "react";
import styled from "styled-components";
import ImageLoader from "../../../ImageLoader";
import { getHumanDate } from "../../../../services/getHumanDate";
import { getHumanTime } from "../../../../services/getHumanTime";

const Container = styled.div`
  flex-grow: 1;
  margin: 0.75rem 0.5rem 0 0.5rem;
  @media screen and (min-width: 768px) {
  }
`;

const Heading = styled.p`
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  line-height: 1;
`;

const Text = styled.p`
  font-size: 13px;
  font-weight: 300;
  margin: 0;
  letter-spacing: 1px;
  line-height: 1;
  color: rgba(91, 89, 89, 1);
`;

const Section = (props) => {
  const getDate = (date) => {
    if (date) {
      let year = date.substring(0, 4);
      let month = date.substring(5, 7);
      let day = date.substring(8, 10);
      return getHumanDate(day + "/" + month + "/" + year);
    }
  };
  const getTime = (datetime) => {
    return getHumanTime(datetime.substring(11, 16));
  };
  if (props.data)
    return (
      <Container className="">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "max-content auto",
            gridGap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          {props.data.check_in && !props.is_registration_needed ? (
            <ImageLoader
              url="media/icons/bookings/calendar (1).png"
              height="1.5rem"
              width="1.5rem"
              widthmobile="1.5rem"
              dimensions={{ width: 100, height: 100 }}
              margin="0"
              leftalign
            ></ImageLoader>
          ) : null}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridGap: "1rem",
            }}
          >
            {props.data.check_in &&
            props.isDatePresent &&
            !props.is_registration_needed ? (
              <div>
                <Heading className="">Trip Start</Heading>
                <Text className="font-nunito">
                  {getTime(props.data.check_in)}
                </Text>
                <Text className="font-nunito">
                  {getDate(props.data.check_in)}
                </Text>
              </div>
            ) : null}
            {props.data.costings_breakdown ? (
              props.data.costings_breakdown.duration ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "max-content auto",
                    gridGap: "0.5rem",
                  }}
                >
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
                    <Text className="font-nunito">
                      {props.data.costings_breakdown.duration.text}
                    </Text>
                  </div>
                </div>
              ) : null
            ) : null}
          </div>
        </div>

        {props.data.costings_breakdown ? (
          true ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "max-content auto",
                gridGap: "0.5rem",
                marginBottom: "0.75rem",
              }}
            >
              <ImageLoader
                url="media/icons/bookings/distance.png"
                height="auto"
                width="1.5rem"
                widthmobile="1.5rem"
                dimensions={{ width: 100, height: 100 }}
                margin="0"
                leftalign
              ></ImageLoader>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridGap: "1rem",
                }}
              >
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div className="centerdiv">
                    <Heading className="">
                      {props.data.costings_breakdown
                        ? props.data.costings_breakdown.distance
                          ? props.data.costings_breakdown.distance.text
                          : null
                        : null}
                    </Heading>
                    <Text className="font-nunito">Included</Text>
                  </div>
                </div>
                {props.data.costings_breakdown ? (
                  props.data.costings_breakdown.no_of_seats ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "max-content auto",
                        gridGap: "0.5rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <ImageLoader
                        url="media/icons/bookings/car-seat.svg"
                        height="auto"
                        width="1.5rem"
                        widthmobile="1.5rem"
                        dimensions={{ width: 100, height: 100 }}
                        margin="0"
                        leftalign
                      ></ImageLoader>
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="centerdiv">
                          <Heading className="">
                            {props.data.costings_breakdown
                              ? props.data.costings_breakdown.no_of_seats
                                ? props.data.costings_breakdown.no_of_seats +
                                  " Seats (s)"
                                : null
                              : null}
                          </Heading>
                          <Text className="font-nunito">Included</Text>
                        </div>
                      </div>
                    </div>
                  ) : null
                ) : null}
              </div>
            </div>
          ) : null
        ) : null}
      </Container>
    );
  else return null;
};

export default Section;
