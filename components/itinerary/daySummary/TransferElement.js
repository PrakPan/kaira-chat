import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { TransportIconFetcher } from "../../../helper/TransportIconFetcher";
import { Link } from "react-scroll";
import { MdDoneAll } from "react-icons/md";
import { WiSunrise } from "react-icons/wi";
import { TransparentButton } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import media from "../../media";

export default function TransferElement(props) {
  const { modes, heading, meta, booking, data, transfers } = props;
  const isPageWide = media("(min-width: 768px)");

  const getUserSelectedByBookings = (id) => {
    if (booking && booking.length && id) {
      for (let book of booking) {
        if (book.id === id) {
          return book.user_selected;
        }
      }
    }
    return null;
  };

  const getBooking = (id) => {
    if (booking && booking.length && id) {
      for (let book of booking) {
        if (book.id === id) return book;
      }
    }
    return null;
  };

  const isValidBooking = (id) => {
    if (booking && booking.length && id) {
      for (let book of booking) {
        if (book.id === id) return true;
      }
    }
    return false;
  };

  const isOriginDestination = () => {
    if (isValidBooking(data?.bookings[0]?.id)) {
      const origin = getBooking(data?.bookings[0]?.id)?.city;
      const destination = getBooking(data?.bookings[0]?.id)?.destination
        ?.shortName;
      if (
        origin &&
        destination &&
        origin !== "undefined" &&
        destination !== "undefined"
      )
        return true;
    }
    return false;
  };

  const getFlightDuration = () => {
    if (meta) {
      if (meta?.Time) return meta.Time;
    }
    return null;
  };

  return (
    <Container className="pt-0">
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full flex flex-col space-y-2 md:space-y-0 lg:space-y-0 md:flex-row lg:flex-row items-start md:items-center lg:items-center">
          <div className="flex flex-row lg:w-[11%] md:w-[21%] justify-center">
            {meta?.day_timing ? (
              <span className="font-normal text-sm text-gray-500">
                {meta.day_timing}
              </span>
            ) : (
              <div className="flex items-center">
                <WiSunrise className="text-2xl text-gray-500"></WiSunrise>
                {isPageWide ? (
                  <></>
                ) : (
                  <span className="font-normal text-xs text-gray-500 ml-2">
                    Morning
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="font-medium text-sm">{heading}</div>
        </div>

        <div className="w-full flex flex-row items-center">
          <div className="lg:w-[11%] md:w-[21%]"></div>
          <div className="w-[1.25rem] md:w-[6%] lg:w-[6%] flex items-center">
            {modes ? (
              <TransportIconFetcher
                TransportMode={modes}
                classname="text-black lg:text-[2.05rem] md:text-[2.05rem] text-[1.25rem]"
              />
            ) : (
              <div className=""></div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="text-xs leading-7 ml-2 lg:ml-0">
              {isOriginDestination()
                ? getBooking(data?.bookings[0]?.id).city +
                  " - " +
                  getBooking(data?.bookings[0]?.id).destination.shortName
                : ""}
            </div>

            <div className="font-normal text-xs leading-4 ml-2 lg:ml-0">
              {getFlightDuration() ? (
                `Duration:  ${getFlightDuration()}`
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="ml-4">
            {data?.bookings &&
            data?.bookings[0] &&
            isValidBooking(data?.bookings[0]?.id) ? (
              <Link
                to={
                  data.bookings && data.bookings[0] && data.bookings[0].id
                    ? `${data.bookings[0].id}`
                    : "Transfer_Container"
                }
                offset={-90}
              >
                {/* <button className="text-blue-500 hover:underline">
                  {getUserSelectedByBookings(
                    data.bookings && data.bookings[0]
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
                    <>{modes ? `+Add ${modes}` : null}</>
                  )}
                </button> */}

                <TransparentButton>
                  {getUserSelectedByBookings(
                    data.bookings && data.bookings[0]
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
                    <>{modes ? `Add ${modes}` : null}</>
                  )}
                </TransparentButton>
              </Link>
            ) : null}
          </div>
        </div>

        {/* <div className="w-full flex items-center">
          <div className="w-[1.25rem] lg:w-[17%] md:w-[27%]"></div>
          <div className="font-normal text-xs leading-4 ml-2 lg:ml-0">
            {getFlightDuration() ? `Duration:  ${getFlightDuration()}` : <></>}
          </div>
        </div> */}
      </div>
    </Container>
  );
}
