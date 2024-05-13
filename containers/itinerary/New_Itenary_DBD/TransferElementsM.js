import React from "react";
import {
  Container,
  Timecontainer,
  TransparentButton,
  TransportContainer,
} from "./New_itenaryStyled";
import { TransportIconFetcher } from "../../../helper/TransportIconFetcher";
import { Link } from "react-scroll";
import { MdDoneAll } from "react-icons/md";

const TransferElementsM = ({
  heading,
  meta,
  modes,
  data,
  transfers,
  text,
  booking,
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

  return (
    <>
      <Container className="pt-1 relative">
        <Timecontainer>
          <Timecontainer>
            <div className="w-[28px] mr-2">
              {modes ? (
                <TransportIconFetcher
                  TransportMode={modes}
                  Instyle={{
                    fontSize: "1.75rem",
                    marginRight: "0.5rem",
                    color: "black",
                  }}
                />
              ) : null}
            </div>
            <div>
              <div className="text-[1.2rem] font-normal line-clamp-2 ">
                {heading}
              </div>
              {meta == null || meta.estimated_cost == undefined ? null : (
                <Link
                  to={
                    data.bookings && data.bookings[0] && data.bookings[0].id
                      ? `${data.bookings[0].id}`
                      : "Transfer_Container"
                  }
                  offset={-90}
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
          </Timecontainer>
        </Timecontainer>

        {transfers !== undefined ? (
          <TransportContainer className="pt-2">
            <div style={{ paddingRight: "10px" }}></div>
            <div style={{ display: "flex", flexDirection: "column" }}></div>
          </TransportContainer>
        ) : null}
        <div className="pt-1 line-clamp-3 text-sm font-[350] mb-0 mt-2">
          {text}
        </div>
        {meta?.Time ? (
          <div className="absolute bottom-[14px] left-[35%] bg-white px-2 ">
            {!LastTransfer && (
              <div className="flex justify-center items-center gap-1 text-[#9F9F9F]">
                <TransportIconFetcher
                  TransportMode={modes[0]}
                  classname="w-fit lg:text-[1.05rem] text-[1.25rem]"
                />{" "}
                {meta.Time}
              </div>
            )}
          </div>
        ) : null}
      </Container>
    </>
  );
};

export default TransferElementsM;
