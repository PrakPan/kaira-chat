import React from "react";
import ImageLoader from "../../../components/ImageLoader";
import {
  ArriveContainer,
  Container,
  Line,
  Timecontainer,
  SubTimecontainer,
  TInfoContainer,
  TransferInfo,
  TransparentButton,
  TransportContainer,
  HLine,
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
  function isValueUndefined(value) {
    return value === undefined;
  }
  return (
    
    <>
      <Container style={{paddingTop: '20px'}}>
        <Timecontainer>
          <div style={{width: '4rem'}}>{time}</div>
          
          <SubTimecontainer>
      <div style={{paddingRight: '15px'}}>{heading}</div>
          
            {meta === null || meta.estimated_cost === undefined ? (
            null
            ) :   <TransparentButton>
            {modes ? `${modes} From ` : null} ₹
            {formatNumber(meta.estimated_cost)}
          </TransparentButton>}
          </SubTimecontainer>
 
          
        </Timecontainer>
        <TInfoContainer >
          <HLine style={{width: '2rem'}}>

            </HLine>
          <div>
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
        <Line></Line>
          </div>
        
        </TInfoContainer>
          
      </Container>
      

      {newcity !== null ? (
        
          <Container style={{ fontSize: "14px", fontWeight: "500" }}>
            <div>{time}</div>
        
<TInfoContainer >
      <HLine style={{width: '2rem'}}>
      <div style={{ marginLeft: "-10px" }}>
              <ImageLoader
                url={icon}
                leftalign
                dimensions={{ width: 200, height: 200 }}
                width="1.25rem"
                widthmobile="1.25rem"
              ></ImageLoader>
            </div>
</HLine>
<div>

          <div style={{paddingBottom: '20px'}}>Arrive in {newcity.city_data.city_name} </div>
          <Line></Line>
</div>
  
</TInfoContainer>
          
          </Container>
          
        
      ) : null}

      
    </>
  );
};

export default TransferElements;
