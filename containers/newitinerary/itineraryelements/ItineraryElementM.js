import { FaHome } from "react-icons/fa";
import { TransparentButton } from "../../itinerary/New_Itenary_DBD/New_itenaryStyled";
import { Link } from "react-scroll";
import { MdDoneAll } from "react-icons/md";

const ItineraryElementM = (props) => {
  function getUserSelectedByBookings(id) {
    if (props.booking && props.booking.length && id)
      for (let i = 0; i < props.booking.length; i++) {
        if (props.booking[i].id === id) {
          return props.booking[i].user_selected;
        }
      }
    return null;
  }

  return (
    <div className="font-lexend">
      <div>
        <div className="flex flex-row items-start">
          <div className="flex justify-center items-center">
            <FaHome className="text-black text-[28px] mr-4" />
          </div>

          <div className="flex flex-col">
            <div className="text-[1.2rem] font-normal">{props.heading}</div>
            {props.data?.bookings && (
              <Link
                to={
                  getUserSelectedByBookings(
                    props.data.bookings && props.data.bookings.length
                      ? props.data.bookings[0].id
                      : null
                  )
                    ? `${props.data?.bookings[0]?.id}`
                    : "Stays"
                }
                offset={0}
              >
                {props.data &&
                props.data.bookings &&
                props.data.bookings.length ? (
                  <>
                    {getUserSelectedByBookings(
                      props.data.bookings &&
                        props.data.bookings[0] &&
                        props.data.bookings[0].id
                        ? props.data.bookings[0].id
                        : null
                    ) ? (
                      <TransparentButton>
                        <MdDoneAll
                          style={{
                            display: "inline",
                            marginRight: "0.35rem",
                          }}
                        />{" "}
                        Stay added
                      </TransparentButton>
                    ) : (
                      <TransparentButton>Add Stay</TransparentButton>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </Link>
            )}
          </div>
        </div>

        <div>
          <div className="pb-0 pt-2 text-sm font-[350]">
            {props.text ? props.text : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryElementM;
