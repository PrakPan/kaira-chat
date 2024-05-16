import React from "react";
import {
  Container,
  TInfoContainer,
  TransparentButton,
  TransportContainer,
} from "./New_itenaryStyled";
import { TransportIconFetcher } from "../../../helper/TransportIconFetcher";
import { Link } from "react-scroll";
import { MdDoneAll } from "react-icons/md";

const TransferElements = ({
  heading,
  meta,
  modes,
  data,
  transfers,
  booking,
  text,
  LastTransfer,
}) => {
  function getUserSelectedByBookings(id) {
    if (booking && booking.length && id)
      for (let i = 0; i < booking.length; i++) {
        if (booking[i].id === id) {
          return booking[i].user_selected;
        }
      }
    return null;
  }

  const handleTransferButtonClick = () => {
    logEvent({
      action: "Details_View",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: `${
          getUserSelectedByBookings(
            data?.bookings && data?.bookings?.length && data?.bookings[0]?.id
              ? data.bookings[0].id
              : null
          )
            ? modes + " added"
            : "Add " + modes
        }`,
        event_value: heading,
        event_action: "Day by Day Itinerary",
      },
    });
  };

  return (
    <>
      <Container className="pt-3  ">
        <div className="flex flex-row relative">
          <div className="flex align-items-center">
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
          </div>
          <TInfoContainer>
            <div>
              <div>
                <div className="text-xl font-normal pr-2 ">{heading}</div>

                {meta == null || meta.estimated_cost == undefined ? null : (
                  <Link
                    to={
                      data.bookings && data.bookings[0] && data.bookings[0].id
                        ? `${data.bookings[0].id}`
                        : "Transfer_Container"
                    }
                    offset={-90}
                    onClick={handleTransferButtonClick}
                  >
                    <TransparentButton>
                      {getUserSelectedByBookings(
                        data.bookings &&
                          data.bookings[0] &&
                          data.bookings[0] &&
                          data.bookings[0].id
                          ? data.bookings[0].id
                          : null
                      ) ? (
                        <>
                          <MdDoneAll
                            style={{
                              display: "inline",
                              marginRight: "0.35rem",
                            }}
                          />{" "}
                          {modes ? `${modes} added` : null}
                        </>
                      ) : (
                        <>{modes ? `Add ${modes} ` : null}</>
                      )}
                    </TransparentButton>
                  </Link>
                )}
              </div>
              {transfers !== undefined ? (
                <TransportContainer>
                  <div></div>
                </TransportContainer>
              ) : null}

              <div className="pt-1 line-clamp-3 font-normal text-sm mb-3">
                {text}
              </div>
            </div>
          </TInfoContainer>
          {meta?.Time && !LastTransfer ? (
            <div className="absolute -bottom-[20px] left-1/2 bg-white px-2 ">
              <div className="flex justify-center items-center gap-1 text-[#9F9F9F]">
                <TransportIconFetcher
                  TransportMode={modes}
                  classname=" text-[20px]"
                />{" "}
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
