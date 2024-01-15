import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { FaHome, FaBed } from "react-icons/fa";
import { Link } from "react-scroll";
import { MdDoneAll } from "react-icons/md";
import { TransparentButton } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";

export default function AccommodationElement(props) {
  const { heading, data, meta, city_id, booking } = props;

  const getHotelName = (id) => {
    if (booking && booking.length && id) {
      for (let book of booking) {
        if (book.id === id && book.user_selected) return book.name;
      }
    }
    return "Check-in to your stay";
  };

  const getHotelCity = (id) => {
    if (booking && booking.length && id) {
      for (let book of booking) {
        if (book.id === id && book.user_selected) return book.city;
      }
    }
    return "";
  };

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

  return (
    <Container className="pt-0">
      <div className="flex flex-col items-center justify-center w-full md:pl-2 lg:pl-2">
        <div className="w-full flex flex-col space-y-2 md:space-y-0 lg:space-y-0 md:flex-row lg:flex-row items-start md:items-start lg:items-center">
          <div className="lg:w-[10%] md:w-[20%] font-normal text-sm">{meta?.day_timing ? meta.day_timing : "Afternoon"}</div>
          <div className="font-medium text-sm">{heading}</div>
          <div className="md:ml-3 lg:ml-3">
            <Link to={city_id ? `${city_id}` : "Stays-Head"} offset={-35}>
              {data && data.bookings && data.bookings.length ? (
                <>
                  {getUserSelectedByBookings(
                    data.bookings && data.bookings[0]
                      ? data.bookings[0].id
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
          </div>
        </div>

        <div className="w-full flex flex-row items-center">
          <div className="lg:w-[10%] md:w-[20%]"></div>
          <div className="w-[6%] flex items-center">
            <FaBed className="text-black lg:text-[1.65rem] text-[1.25rem]" />
          </div>
          <div className="text-base font-semibold leading-6">
            {data.bookings &&
              data.bookings[0] &&
              getHotelName(data.bookings[0].id)}
          </div>
        </div>

        <div className="w-full flex items-center">
          <div className="lg:w-[16%] md:w-[26%]"></div>
          <div className="font-normal text-xs leading-4">
            {data.bookings &&
              data.bookings[0] &&
              getHotelCity(data.bookings[0].id)}
          </div>
        </div>
      </div>
    </Container>
  );
}
