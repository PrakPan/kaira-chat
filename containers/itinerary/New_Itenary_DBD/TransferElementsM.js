import React from 'react';
import ImageLoader from '../../../components/ImageLoader';
import {
  ArriveContainer,
  Container,
  Line,
  Timecontainer,
  TInfoContainer,
  TransferInfo,
  TransparentButton,
  TransportContainer,
} from './New_itenaryStyled';
import { convertNumToTime } from '../../../helper/convertNumToTime';
import { formatNumber } from '../../../helper/formatNumber';
const TransferElementsM = ({
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
          {/* <div className="text-base">{time}</div> */}

          <Timecontainer>
            <div className="text-base font-medium ">{heading}</div>

            {meta ? (
              meta.estimated_cost ? (
                <TransparentButton>
                  {modes ? `${modes} From ` : null} ₹
                  {formatNumber(meta.estimated_cost)}
                </TransparentButton>
              ) : null
            ) : null}
          </Timecontainer>
        </Timecontainer>

        {transfers !== undefined ? (
          <TransportContainer className="pt-3">
            <div style={{ paddingRight: '10px' }}>
              <ImageLoader
                url={icon}
                leftalign
                dimensions={{ width: 200, height: 200 }}
                width="2.05rem"
                widthmobile="2.05rem"
              ></ImageLoader>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="text-base">
                {transfers.routes[0]?.legs[0].origin.shortName} -{' '}
                {transfers.routes[0]?.legs[0].destination.shortName}
              </div>
              {meta ? (
                <div className="text-base">
                  Duration: {convertNumToTime(meta.duration)}
                </div>
              ) : null}
            </div>
          </TransportContainer>
        ) : null}
        <TransferInfo className="text-sm">{text}</TransferInfo>
      </Container>
      <Line></Line>

      {newcity !== null ? (
        <ArriveContainer style={{ fontSize: '15px', fontWeight: '550' }}>
          <TransportContainer>
            <div>{time}</div>
            <div style={{ paddingLeft: '10px' }}>
              <ImageLoader
                url={icon}
                leftalign
                dimensions={{ width: 200, height: 200 }}
                width="1.25rem"
                widthmobile="1.25rem"
              ></ImageLoader>
            </div>
          </TransportContainer>{' '}
          <div>Arrive in {newcity.city_data.city_name} </div>
        </ArriveContainer>
      ) : null}

      <Line></Line>
    </>
  );
};

export default TransferElementsM;
