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
import { convertNumToTime } from '../../../pages/helper/convertNumToTime';
import { formatNumber } from '../../../pages/helper/formatNumber';
import { TransportIconFetcher } from '../../../pages/helper/TransportIconFetcher';
import { LivelyButton } from '../../../components/LiveleyButton';
const TransferElementsM = ({
  time,
  heading,
  meta,
  modes,
  transfers,
  icon,
  text,
  newcity,
  booking,
}) => {
  return (
    <>
      <Container className="pt-1">
        <Timecontainer>
          {/* <div className="text-base">{time}</div> */}

          <Timecontainer>
            <div className="text-base font-semibold ">{heading}</div>
          </Timecontainer>
        </Timecontainer>

        {transfers !== undefined ? (
          <TransportContainer className="pt-2">
            <div style={{ paddingRight: '10px' }}>
              {modes && (
                <TransportIconFetcher
                  TransportMode={modes}
                  Instyle={{
                    fontSize: '1.75rem',
                    marginRight: '0.5rem',
                    color: 'black',
                  }}
                />
              )}
              {/* <ImageLoader
                url={icon}
                leftalign
                dimensions={{ width: 200, height: 200 }}
                width="2.05rem"
                widthmobile="2.05rem"
              ></ImageLoader> */}
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
        {booking ? (
          meta.estimated_cost ? (
            <div className="flex mt-2 flex-row items-center justify-between w-full">
              <LivelyButton className="font-bold  border-2 border-black rounded-md px-3 py-1  bg-white text-black">
                {modes ? `${modes} From ` : null} ₹
                {formatNumber(meta.estimated_cost)}
              </LivelyButton>

              <div className="text-sm font-semibold">
                {booking.user_selected ? (
                  <div className="text-[#287E00]">Included</div>
                ) : (
                  <div className="text-[#D20A0A]">Excluded</div>
                )}
              </div>
            </div>
          ) : null
        ) : null}
        {/* <TransferInfo className="text-sm">{text}</TransferInfo> */}
      </Container>

      {/* {newcity !== null ? (
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

      <Line></Line> */}
    </>
  );
};

export default TransferElementsM;
