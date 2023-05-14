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
import { convertNumToTime } from '../../../pages/helper/convertNumToTime';
import { formatNumber } from '../../../pages/helper/formatNumber';
import { Text } from '../../newitinerary/itineraryelements/ItineraryFoodElement';
import { TransportIconFetcher } from '../../../pages/helper/TransportIconFetcher';
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
      <Container className="pt-3  ">
        <Timecontainer>
          {/* <div style={{ width: '3.7rem' }}>{time}</div> */}
        </Timecontainer>
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
                    {meta ? (
                      <div>Duration: {convertNumToTime(meta.duration)}</div>
                    ) : null}
                  </div>
                ) : null}
              </TransportContainer>
            ) : null}

            <div className="pt-1 line-clamp-3 font-normal text-sm mb-3">
              {text}
            </div>
          </div>
        </TInfoContainer>
      </Container>
    </>
  );
};

export default TransferElements;
