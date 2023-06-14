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
import { Text } from '../../newitinerary/itineraryelements/ItineraryFoodElement';
import { TransportIconFetcher } from '../../../helper/TransportIconFetcher';
import { Link } from 'react-scroll';
const TransferElements = ({
  time,
  heading,
  meta,
  modes,
  data,
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
      <Container className="pt-3  ">
        <div className="flex flex-row relative">
          <div>
            {modes ? (
              <div className="w-[6.15rem] grid place-items-center">
                <TransportIconFetcher
                  TransportMode={modes}
                  classname="text-black lg:text-[3.05rem] text-[1.25rem]"
                />
              </div>
            ) : (
              <div className="w-[3.05rem]"></div>
            )}
            {/* <ImageLoader
            url={icon}
            leftalign
            dimensions={{ width: 200, height: 200 }}
            width="4.05rem"
            widthmobile="1.25rem"
          ></ImageLoader> */}
          </div>
          <TInfoContainer>
            {/* <HLine style={{ width: '2rem' }}></HLine> */}

            <div>
              <div>
                <div className="text-xl font-normal pr-2 ">{heading}</div>

                {meta == null || meta.estimated_cost == undefined ? null : (
                  <Link
                    to={
                      data.bookings
                        ? `${data.bookings[0].id}`
                        : 'Transfer_Container'
                    }
                    offset={-90}
                  >
                    <TransparentButton>
                      {modes ? `${modes} For ` : null} ₹
                      {formatNumber(Math.round(meta.estimated_cost))}
                    </TransparentButton>
                  </Link>
                )}
              </div>
              {transfers !== undefined ? (
                <TransportContainer>
                  <div>
                    {/* {modes && (
                    <TransportIconFetcher
                      TransportMode={modes}
                      Instyle={{
                        fontSize: '1.75rem',
                        marginRight: '0.8rem',
                        color: 'black',
                      }}
                    />
                  )} */}
                    {/* <ImageLoader
                    url={icon}
                    leftalign
                    dimensions={{ width: 200, height: 200 }}
                    width="1.25rem"
                    widthmobile="1.25rem"
                  ></ImageLoader> */}
                  </div>
                  {transfers.routes[0]?.legs[0].origin.shortName ? (
                    <div
                      style={{ display: 'flex', flexDirection: 'column' }}
                      className="text-md font-medium"
                    >
                      <div>
                        {transfers.routes[0]?.legs[0].origin.shortName} -{' '}
                        {transfers.routes[0]?.legs[0].destination.shortName}
                      </div>
                    </div>
                  ) : null}
                </TransportContainer>
              ) : null}

              <div className="pt-1 line-clamp-3 font-normal text-sm mb-3">
                {text}
              </div>
            </div>
          </TInfoContainer>
          {meta?.duration ? (
            <div className="absolute -bottom-[20px] left-1/2 bg-white px-2 ">
              <div className="flex justify-center items-center gap-1 text-[#9F9F9F]">
                <TransportIconFetcher
                  TransportMode={modes}
                  classname=" text-[20px]"
                />{' '}
                {meta?.Time}
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </>
  );
};

export default TransferElements;
