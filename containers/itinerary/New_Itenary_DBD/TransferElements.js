import React from "react";
import ImageLoader from "../../../components/ImageLoader";
import {
  Container,
  Line,
  Timecontainer,
  TransferInfo,
  TransparentButton,
  TransportContainer,
} from "./New_itenaryStyled";
import { convertNumToTime } from "../../../helper/convertNumToTime";
import { formatNumber } from "../../../helper/formatNumber";
const TransferElements = ({
  time,
  heading,
  meta,
  modes,
  transfers,
  icon,
  text,
  newcity,
}) => {
  return (
    <>
      <Container>
        <Timecontainer>
          <div>{time}</div>
          <div>{heading}</div>
          <div>
            {meta ? (
              <TransparentButton>
                {modes ? `${modes} From ` : null} ₹
                {formatNumber(meta.estimated_cost)}
              </TransparentButton>
            ) : null}
          </div>
        </Timecontainer>
        
          {transfers !== undefined ? (
            <TransportContainer>
            <div style={{ paddingRight: "10px" }}>
              <ImageLoader
                url={icon}
                leftalign
                dimensions={{ width: 200, height: 200 }}
                width="1.25rem"
                widthmobile="1.25rem"
              ></ImageLoader>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div>
                  {transfers.routes[0]?.legs[0].origin.shortName} -{" "}
                  {transfers.routes[0]?.legs[0].destination.shortName}
                </div>
                {meta ? (
                  <div>Duration: {convertNumToTime(meta.duration)}</div>
                ) : null}
              </div>
              </TransportContainer>
          ) : null}

        <TransferInfo>{text}</TransferInfo>
      </Container>
      <Line></Line>

      {newcity !== null ? (
        <Container style={{ fontSize: "14px", fontWeight: "500" }}>
          <TransportContainer>
            <div>{time}</div>
            <div style={{ paddingLeft: "10px" }}>
              <ImageLoader
                url={icon}
                leftalign
                dimensions={{ width: 200, height: 200 }}
                width="1.25rem"
                widthmobile="1.25rem"
              ></ImageLoader>
            </div>
          </TransportContainer>{" "}
          <div>Arrive in {newcity.city_data.city_name} </div>{" "}
        </Container>
      ) : null}

      <Line></Line>
    </>
  );
};

export default TransferElements;
