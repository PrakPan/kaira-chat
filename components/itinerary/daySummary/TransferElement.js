import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { TransportIconFetcher } from "../../../helper/TransportIconFetcher";
import { Link } from "react-scroll";
import { MdDoneAll } from "react-icons/md";
import { TransparentButton } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";

export default function TransferElement(props) {
  const { modes, heading, meta, booking, data, transfers } = props;

  function getUserSelectedByBookings(id) {
    if (booking && booking.length && id) {
      for (let book of booking) {
        if (book.id === id) {
          return book.user_selected;
        }
      }
    }
    return null;
  }

  const getFlightDuration = (id) => {
    if (booking && booking.length && id) {
      for (let book of booking) {
        if (book.id === id && book.user_selected && book.duration)
          return book.duration;
      }
    }
    return "";
  };

  return (
    <Container className="pt-0">
      <div className="flex flex-col items-center justify-center w-full pl-2">
        <div className="w-full flex flex-row items-center">
          <div className="lg:w-[10%] md:w-[20%] font-normal text-sm">Morning</div>
          <div className="font-medium text-sm">{heading}</div>
          <div className="ml-3">
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
            )}
          </div>
        </div>

        <div className="w-full flex flex-row items-center">
          <div className="lg:w-[10%] md:w-[20%]"></div>
          <div className="w-[6%] flex items-center">
            {modes ? (
              <TransportIconFetcher
                TransportMode={modes}
                classname="text-black lg:text-[2.05rem] text-[1.25rem]"
              />
            ) : (
              <div className=""></div>
            )}
          </div>
          <div className="text-xs leading-7">
            {transfers.routes[0]?.legs[0].origin.shortName} -{" "}
            {transfers.routes[0]?.legs[0].destination.shortName}
          </div>
        </div>

        <div className="w-full flex items-center">
          <div className="lg:w-[16%] md:w-[26%]"></div>
          <div className="font-normal text-xs leading-4">
            {data.bookings &&
              data.bookings[0] &&
              getFlightDuration(data.bookings[0].id) ? `Duration:  ${getFlightDuration(data.bookings[0].id)}` : ""}
          </div>
        </div>
      </div>
    </Container>
  );
}
