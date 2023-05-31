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
import { TransportIconFetcher } from '../../../helper/TransportIconFetcher';
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
      <Container className="pt-1 relative">
        <Timecontainer>
          {/* <div className="text-base">{time}</div> */}

          <Timecontainer>
            <div className="text-[1.2rem] font-normal ">{heading}</div>
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
              {transfers.routes[0]?.legs[0].origin.shortName && (
                <div className="text-md">
                  {transfers.routes[0]?.legs[0].origin.shortName} -{' '}
                  {transfers.routes[0]?.legs[0].destination.shortName}
                </div>
              )}

              {meta.duration ? (
                <div className="text-md">
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
        <div className="pt-1 line-clamp-3 font-normal text-sm mb-3">{text}</div>
        {meta.duration ? (
          <div className="absolute bottom-[14px] left-[35%] bg-white px-2 ">
            <div className="flex justify-center items-center gap-1 text-[#9F9F9F]">
              <TransportIconFetcher
                TransportMode={modes}
                classname="w-fit lg:text-[1.05rem] text-[1.25rem]"
              />{' '}
              {convertNumToTime(meta.duration)}
              {/* {modes} */}
            </div>
          </div>
        ) : null}
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
