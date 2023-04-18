import React from 'react';
import ImageLoader from '../../../components/ImageLoader';
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
} from './New_itenaryStyled';
import { convertNumToTime } from '../../../helper/convertNumToTime';
import { formatNumber } from '../../../helper/formatNumber';
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
      <Container>
        <Timecontainer>
          {/* <div style={{ width: '3.7rem' }}>{time}</div> */}
        </Timecontainer>
        <TInfoContainer>
          <HLine style={{ width: '2rem' }}></HLine>

          <div className="pt-4">
            <div>
              <div className="text-base font-semibold pr-2 ">{heading}</div>

              {meta == null || meta.estimated_cost == undefined ? null : (
                <TransparentButton>
                  {modes ? `${modes} From ` : null} ₹
                  {formatNumber(meta.estimated_cost)}
                </TransparentButton>
              )}
            </div>
            {transfers !== undefined ? (
              <TransportContainer>
                <div style={{ paddingRight: '10px' }}>
                  <ImageLoader
                    url={icon}
                    leftalign
                    dimensions={{ width: 200, height: 200 }}
                    width="1.25rem"
                    widthmobile="1.25rem"
                  ></ImageLoader>
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column' }}
                  className="text-md font-medium"
                >
                  <div>
                    {transfers.routes[0]?.legs[0].origin.shortName} -{' '}
                    {transfers.routes[0]?.legs[0].destination.shortName}
                  </div>
                  {meta ? (
                    <div>Duration: {convertNumToTime(meta.duration)}</div>
                  ) : null}
                </div>
              </TransportContainer>
            ) : null}

            <TransferInfo className="text-sm pt-2 text-black pb-4">
              {text}
            </TransferInfo>
            <Line></Line>
          </div>
        </TInfoContainer>
      </Container>
    </>
  );
};

export default TransferElements;
