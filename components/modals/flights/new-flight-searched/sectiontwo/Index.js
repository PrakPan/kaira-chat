

import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
  import { getHumanTime } from '../../../../../services/getHumanTime';
  import { getHumanDate } from '../../../../../services/getHumanDate';
import ImageLoader from '../../../../ImageLoader';
import { FaPlane } from 'react-icons/fa';
 
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
    display: grid;
    grid-template-columns: auto 6fr;
    gap : 1.5rem;
    padding: 1rem 0.5rem;
  
`;
const Plan = styled.div`

position: absolute;
    left: 50%;
    top: 0%;
    transform: translateY(-45%)`;
const LogoContainer = styled.div`
  width: 80px; /* Adjust this value to your desired size */
  height: 80px; /* Adjust this value to your desired size */
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
    rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
`;
const Image = styled.img`
  object-fit: contain;
  transform: scale(1.05);
`;
const Text = styled.div`
  font-weight: 300;
  font-size: 13px;
  text-align: center;
  margin-top: 0.25rem;
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
const Booking = (props) =>{
  console.log('props: ', props);
  const [url, setUrl] = useState('media/website/grey.png')
  const [airLineName , setAirLineName] = useState('')
    useEffect(() => {
        if(props.data)
        // setUrl("https://d31aoa0ehgvjdi.cloudfront.net/media/airlines/"+props.data.AirlineCode+".png");
        setUrl("https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/"+props.data.AirlineCode+".png");
      if (
        props.data.Segments &&
        props.data.Segments[0] &&
        props.data.Segments[0][0] && 
        props.data.Segments[0][0].Airline
      )
        setAirLineName(props.data.Segments[0][0].Airline.AirlineName);
      
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
          <div>
            <LogoContainer>
              <Image src={url}></Image>
            </LogoContainer>
            <Text>{airLineName}</Text>
          </div>
          <DetailsGridContainer>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              {props.data.Segments ? (
                props.data.Segments[0].length ? (
                  <div
                    style={{
                      margin: "0",
                      fontWeight: "600",
                      fontSize: "20px",
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
                      fontWeight: "300",
                      fontSize: "20px",
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
            <div style={{ margin: "0", position: "relative", height: "0px" , top : '50%' }}>
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
                      fontSize: "20px",
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
                      fontWeight: "300",
                      fontSize: "20px",
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
                      fontWeight: "300",
                      // color: "rgba(91, 89, 89, 1)",
                      // textAlign: "right",
                      marginTop: "0.25rem",
                    }}
                  >
                    {getDate(props.data.Segments[0][0].Origin.DepTime)}
                  </div>
                ) : (
                  <div></div>
                )
              ) : (
                <div></div>
              )}
            </div>
            <div>
              {props.data.Segments ? (
                props.data.Segments[0].length ? (
                  props.data.Segments[0].length > 1 ? (
                    <div
                      className="font-lexend text-center"
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: "300",
                        // color: "rgba(91, 89, 89, 1)",
                        marginTop: "-4px",
                      }}
                    >
                      {props.data.Segments[0].length > 1
                        ? props.data.Segments[0].length - 1 + " stop(s)"
                        : "No Stops"}
                    </div>
                  ) : (
                    <div
                      className="font-lexend text-center"
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: "300",
                        // color: "rgba(91, 89, 89, 1)",
                        marginTop: "-4px",
                      }}
                    >
                      No Stops
                    </div>
                  )
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
                      fontWeight: "300",
                      // color: "rgba(91, 89, 89, 1)",
                      // textAlign: "right",
                      marginTop: "0.25rem",
                    }}
                  >
                    {getDate(
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
            </div>
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
            <div></div>
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
                      props.data.Segments[0][props.data.Segments[0].length - 1]
                        .Destination.Airport.AirportName
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
          </DetailsGridContainer>
        </GridContainer>
      );
 
}

export default  (Booking);