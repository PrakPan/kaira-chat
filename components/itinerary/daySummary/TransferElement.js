import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { TransportIconFetcher } from "../../../helper/TransportIconFetcher";
import { Link } from "react-scroll";
import { MdDoneAll } from "react-icons/md";
import { TransparentButton } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";

export default function TransferElement(props) {
  const { modes, heading, meta, booking, data, transfers } = props;

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
    <Container className="pt-0">
      <div className=" flex flex-col items-center justify-center w-full">
        <div className="w-[80%] self-end text-sm">
          {heading}
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
                    <>{modes ? `Add ${modes}` : null}</>
                  )}
                </TransparentButton>
              </Link>
            )}
        </div>

        <div className="w-full flex flex-row items-center">
          <div className="w-[20%] pr-3 flex items-center justify-end">
            {modes ? (
              <TransportIconFetcher
                TransportMode={modes}
                classname="text-black lg:text-[2.05rem] text-[1.25rem]"
              />
            ) : (
              <div className=""></div>
            )}
          </div>
          <div className="w-[80%] text-xs leading-7">
            {transfers.routes[0]?.legs[0].origin.shortName} -{" "}
            {transfers.routes[0]?.legs[0].destination.shortName}
          </div>
        </div>
      </div>
    </Container>
  );
}
