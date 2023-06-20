

import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
  import { getHumanTime } from '../../../../../services/getHumanTime';
  import { getHumanDate } from '../../../../../services/getHumanDate';
import ImageLoader from '../../../../ImageLoader';
import { differenceInMinutes, format } from "date-fns";

import { FaPlane } from 'react-icons/fa';
import media from '../../../../media'
 
function createCacheKey(checkIn, checkOut) {
  return `${checkIn}-${checkOut}`;
}

function processBookingTimes(checkIn, checkOut) {
  const cache = processBookingTimes.cache || (processBookingTimes.cache = {});

  const cacheKey = createCacheKey(checkIn, checkOut);
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const checkInTime = format(new Date(checkIn), "hh:mm a");
  const checkOutTime = format(new Date(checkOut), "hh:mm a");

  const durationInMinutes = differenceInMinutes(
    new Date(checkOut),
    new Date(checkIn)
  );
  const durationHours = Math.floor(durationInMinutes / 60);
  const durationMinutes = durationInMinutes % 60;

  const result = {
    checkInTime: checkInTime,
    checkOutTime: checkOutTime,
    duration: `${durationHours}h ${durationMinutes}m`,
  };

  cache[cacheKey] = result;
  return result;
}

const DetailsGridContainer = styled.div`
display: grid;
grid-template-columns: max-content auto max-content;
grid-column-gap: 0.5rem;
grid-row-gap: 0.2rem;
line-height: 1;
margin-block : auto;
height: max-content;
`;
const DottedLine = styled.div`
  position: relative;
  height: 2px;
  width: 100%;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(to right, #7A7A7A 5px, transparent 5px);
    background-size: 9px 100%; /* Adjust this value to change the spacing between the dots */
  }
`;
const GridContainer = styled.div`
  padding: 0.75rem ;

  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: auto 6fr;
    gap: 1.5rem;
    padding: 1rem 0.5rem;
  }
`;
const Plan = styled.div`

position: absolute;
    left: 50%;
    top: 0%;
    transform: translate(-50%,-45%)`;
const LogoContainer = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media screen and (min-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;
const Image = styled.img`
  object-fit: contain;
  transform: scale(1.05);
`;
const Text = styled.div`
  font-weight: 400;
  text-align: center;
  font-size: 13px;
  margin-top: 0.25rem;
  @media screen and (max-width: 768px) {
    font-weight: 500;
    text-align: left;
    margin-inline: 1rem;
    font-size: 15px;
  }
`;
const Circle = styled.div`
  border: 1px solid #7a7a7a;
  height: 10px;
  width: 10px;
  border-radius: 100%;
  background: white;
  position: absolute;
  z-index: 1;
  top : 50%;
  transform: translateY(-38%);
`;
const FlexBox = styled.div`
  margin-bottom: 0rem;
  @media screen and (max-width: 768px) {
    display: grid;
    grid-template-columns: auto 6fr;
    align-items: center;
    margin-bottom: 1rem;
  }
`;
const Booking = (props) =>{
    let isPageWide = media("(min-width: 768px)");

  const [url, setUrl] = useState('media/website/grey.png')
  const [airLineName, setAirLineName] = useState('')
  useEffect(() => {
      
    if (props.data) {
      if (
        props.data.Segments &&
        props.data.Segments[0] &&
        props.data.Segments[0][0] && 
        props.data.Segments[0][0].Airline
      ){   setAirLineName(props.data.Segments[0][0].Airline.AirlineName);
     setUrl("https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/" + props.data.Segments[0][0].Airline.AirlineCode +".png");}
      else setUrl("https://d31aoa0ehgvjdi.cloudfront.net/media/website/grey.png");
      if (props.isSelected && 
            props.data.costings_breakdown &&
              props.data.costings_breakdown.Segments &&
              props.data.costings_breakdown.Segments[0] &&
              props.data.costings_breakdown.Segments[0][0] &&
              props.data.costings_breakdown.Segments[0][0].Airline
          ) {
            setAirLineName(props.data.costings_breakdown.Segments[0][0].Airline.AirlineName);
            setUrl("https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/" + props.data.costings_breakdown.Segments[0][0].Airline.AirlineCode + ".png");
          }
      }
      }, [props.data]);
    const getTime = (datetime) => {
        return(getHumanTime(datetime.substring(11,16)));
    }
    const getDate = (datetime) => {
        let date = datetime.substring(0,10);
        let year = date.substring(0,4)
        let month = date.substring(5,7);
        let day = date.substring(8,10)
        return(getHumanDate(day+"/"+month+"/"+year) + " " + year);
    }
      return (
        <GridContainer>
          <FlexBox>
            <LogoContainer>
              <Image src={url}></Image>
            </LogoContainer>
            <div>
              <Text>{airLineName}</Text>
              {!isPageWide &&
                (props.data.Segments ? (
                  props.data.Segments[0].length ? (
                    props.data.Segments[0].length > 1 ? (
                      <Text
                        style={{
                          marginTop: "-4px",
                          fontWeight: "400",
                          fontSize: "13px",
                        }}
                      >
                        {props.data.Segments[0].length > 1
                          ? props.data.Segments[0].length - 1 > 1
                            ? props.data.Segments[0].length - 1 + " stops"
                            : props.data.Segments[0].length - 1 + " stop"
                          : "Nonstop"}

                        <>
                          {" ("}
                          {props.data.duration
                            ? ` (${props.data.duration}h)`
                            : processBookingTimes(
                                props.data.Segments[0][0].Origin.DepTime,
                                props.data.Segments[0][
                                  props.data.Segments[0].length - 1
                                ].Destination.ArrTime
                              ).duration}
                          {")"}
                        </>
                      </Text>
                    ) : (
                      <Text
                        style={{
                          marginTop: "-4px",
                          fontWeight: "400",
                          fontSize: "13px",
                        }}
                      >
                        Nonstop
                        <>
                          {" ("}
                          {props.data.duration
                            ? ` (${props.data.duration}h)`
                            : processBookingTimes(
                                props.data.Segments[0][0].Origin.DepTime,
                                props.data.Segments[0][
                                  props.data.Segments[0].length - 1
                                ].Destination.ArrTime
                              ).duration}
                          {")"}
                        </>
                      </Text>
                    )
                  ) : null
                ) : null)}
            </div>
          </FlexBox>
          <DetailsGridContainer>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              {props.data.Segments ? (
                props.data.Segments[0].length ? (
                  <div
                    style={{
                      margin: "0",
                      fontWeight: "600",
                      fontSize: isPageWide ? "20px" : "16px",
                    }}
                    className="font-lexend"
                  >
                    {getTime(props.data.Segments[0][0].Origin.DepTime)}
                  </div>
                ) : (
                  <div></div>
                )
              ) : (
                <div></div>
              )}
              {props.data.Segments ? (
                props.data.Segments[0].length ? (
                  <div
                    style={{
                      margin: "0",
                      fontWeight: "400",
                      fontSize: isPageWide ? "20px" : "16px",
                    }}
                    className="font-lexend"
                  >
                    {"(" +
                      props.data.Segments[0][0].Origin.Airport.CityCode +
                      ")"}
                  </div>
                ) : null
              ) : null}
            </div>
            <div
              style={{
                margin: "0",
                position: "relative",
                height: "0px",
                top: "50%",
              }}
            >
              {/* <div
                style={{
                  position: "absolute",
                  height: "0.9rem",
                  width: "100%",
                  top: "0.4rem",
                  margin: "auto",
                  display: "block",
                }}
              >
                <ImageLoader
                  height="1px"
                  url={"media/icons/right-arrow-flight-11.png"}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: "100%",
                  top: "0.2rem",
                  height: "0.5rem",
                  width: "0.5rem",
                  display: "block",
                }}
              >
                <ImageLoader url={"media/icons/right-arrow-flight-12.png"} />
              </div> */}
              <Circle style={{ left: 0 }} />
              <DottedLine></DottedLine>
              <Circle style={{ right: 0 }} />
              <Plan>
                <FaPlane style={{ fontSize: "1.25rem" }} />
              </Plan>
            </div>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              {props.data.Segments ? (
                props.data.Segments[0].length ? (
                  <div
                    style={{
                      margin: "0",
                      fontWeight: "600",
                      fontSize: isPageWide ? "20px" : "16px",
                    }}
                    className="font-lexend"
                  >
                    {getTime(
                      props.data.Segments[0][props.data.Segments[0].length - 1]
                        .Destination.ArrTime
                    )}
                  </div>
                ) : (
                  <div></div>
                )
              ) : (
                <div></div>
              )}
              {props.data.Segments ? (
                props.data.Segments[0].length ? (
                  <div
                    style={{
                      margin: "0",
                      fontWeight: "400",
                      fontSize: isPageWide ? "20px" : "16px",
                    }}
                    className="font-lexend"
                  >
                    {"(" +
                      props.data.Segments[0][props.data.Segments[0].length - 1]
                        .Destination.Airport.CityCode +
                      ")"}
                  </div>
                ) : null
              ) : null}
            </div>
            <div style={{ width: "max-content" }}>
              {props.data.Segments ? (
                props.data.Segments[0].length ? (
                  <div
                    className="font-lexend"
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      marginTop: "0.25rem",
                    }}
                  >
                    <div>
                      {getDate(props.data.Segments[0][0].Origin.DepTime)}
                    </div>
                    {props.selectedBooking.city && (
                      <div style={{ marginTop: "0.4rem" }}>
                        {props.selectedBooking.city}
                      </div>
                    )}
                  </div>
                ) : (
                  <div></div>
                )
              ) : (
                <div></div>
              )}
            </div>
            <div>
              {isPageWide &&
                (props.data.Segments ? (
                  props.data.Segments[0].length ? (
                    props.data.Segments[0].length > 1 ? (
                      <div
                        className="font-lexend text-center"
                        style={{
                          fontSize: "0.70rem",
                          fontWeight: "400",
                          // color: "rgba(91, 89, 89, 1)",
                          marginTop: "0px",
                        }}
                      >
                        {props.data.Segments[0].length > 1
                          ? props.data.Segments[0].length - 1 > 1
                            ? props.data.Segments[0].length - 1 + " stops"
                            : props.data.Segments[0].length - 1 + " stop"
                          : "Nonstop"}
                        <>
                          {" ("}
                          {props.data.duration
                            ? ` (${props.data.duration}h)`
                            : processBookingTimes(
                                props.data.Segments[0][0].Origin.DepTime,
                                props.data.Segments[0][
                                  props.data.Segments[0].length - 1
                                ].Destination.ArrTime
                              ).duration}
                          {")"}
                        </>
                      </div>
                    ) : (
                      <div
                        className="font-lexend text-center"
                        style={{
                          fontSize: "0.70rem",
                          fontWeight: "400",
                          // color: "rgba(91, 89, 89, 1)",
                          // marginTop: "-4px",
                          marginTop: !isPageWide ? "-4px" : "0px",
                        }}
                      >
                        Nonstop
                        <>
                          {" ("}
                          {props.data.duration
                            ? ` (${props.data.duration}h)`
                            : processBookingTimes(
                                props.data.Segments[0][0].Origin.DepTime,
                                props.data.Segments[0][
                                  props.data.Segments[0].length - 1
                                ].Destination.ArrTime
                              ).duration}
                          {")"}
                        </>
                      </div>
                    )
                  ) : null
                ) : null)}
            </div>
            <div style={{ width: "max-content" }}>
              {props.data.Segments ? (
                props.data.Segments[0].length ? (
                  <div
                    className="font-lexend"
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      // color: "rgba(91, 89, 89, 1)",
                      // textAlign: "right",
                      marginTop: "0.25rem",
                    }}
                  >
                    <div>
                      {getDate(
                        props.data.Segments[0][
                          props.data.Segments[0].length - 1
                        ].Destination.ArrTime
                      )}
                    </div>
                    {props.selectedBooking.destination_city && (
                      <div style={{ marginTop: "0.4rem" }}>
                        {props.selectedBooking.destination_city}
                      </div>
                    )}
                  </div>
                ) : (
                  <div></div>
                )
              ) : (
                <div></div>
              )}
            </div>
            {/* {isPageWide ? (
              <div>
                {props.data.Segments ? (
                  props.data.Segments[0].length ? (
                    <div
                      className="font-lexend"
                      style={{
                        fontSize: "14px",
                        fontWeight: "300",
                        // color: "rgba(91, 89, 89, 1)",
                        // textAlign: "right",
                        marginTop: "0.25rem",
                      }}
                    >
                      {props.data.Segments[0][0].Origin.Airport.AirportName}
                    </div>
                  ) : (
                    <div></div>
                  )
                ) : (
                  <div></div>
                )}
                {props.data.Segments ? (
                  props.data.Segments[0].length ? (
                    <div
                      className="font-lexend"
                      style={{
                        fontSize: "14px",
                        fontWeight: "300",
                        // color: "rgba(91, 89, 89, 1)",
                        // textAlign: "right",
                        marginTop: "0.25rem",
                      }}
                    >
                      {props.data.Segments[0][0].Origin.Airport.Terminal
                        ? "Terminal " +
                          props.data.Segments[0][0].Origin.Airport.Terminal
                        : ""}
                    </div>
                  ) : (
                    <div></div>
                  )
                ) : (
                  <div></div>
                )}
              </div>
            ) : (
              <></>
            )}
            <div></div> */}
            {/* {isPageWide ? (
              <div>
                {props.data.Segments ? (
                  props.data.Segments[0].length ? (
                    <div
                      className="font-lexend"
                      style={{
                        fontSize: "14px",
                        fontWeight: "300",
                        // color: "rgba(91, 89, 89, 1)",
                        // textAlign: "right",
                        marginTop: "0.25rem",
                      }}
                    >
                      {
                        props.data.Segments[0][
                          props.data.Segments[0].length - 1
                        ].Destination.Airport.AirportName
                      }
                    </div>
                  ) : (
                    <div></div>
                  )
                ) : (
                  <div></div>
                )}
                {props.data.Segments ? (
                  props.data.Segments[0].length ? (
                    <div
                      className="font-lexend"
                      style={{
                        fontSize: "14px",
                        fontWeight: "300",
                        // color: "rgba(91, 89, 89, 1)",
                        // textAlign: "right",
                        marginTop: "0.25rem",
                      }}
                    >
                      {props.data.Segments[0][props.data.Segments[0].length - 1]
                        .Destination.Airport.Terminal
                        ? "Terminal " +
                          props.data.Segments[0][
                            props.data.Segments[0].length - 1
                          ].Destination.Airport.Terminal
                        : ""}
                    </div>
                  ) : (
                    <div></div>
                  )
                ) : (
                  <div></div>
                )}
              </div>
            ) : (
              <></>
            )} */}
          </DetailsGridContainer>
        </GridContainer>
      );
 
}

export default  (Booking);