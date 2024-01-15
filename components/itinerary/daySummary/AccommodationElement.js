import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { FaHome, FaBed } from "react-icons/fa";
import { TbSunset2 } from "react-icons/tb";
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
        <div className="w-full flex flex-col space-y-2 md:space-y-0 lg:space-y-0 md:flex-row lg:flex-row items-start md:items-center lg:items-center">
          <div className="lg:w-[11%] md:w-[21%] flex flex-row">
            {meta?.day_timing ? (
              <span className="font-normal text-sm text-blue-500">
                meta.day_timing
              </span>
            ) : (
              <div className="flex items-center">
                <TbSunset2 className="text-2xl"></TbSunset2>
                <span className="font-normal text-sm text-blue-500 ml-2">Afternoon</span>
              </div>
            )}
          </div>
          <div className="font-medium text-sm">{heading}</div>
          <div className="md:ml-3 lg:ml-3">
            <Link to={city_id ? `${city_id}` : "Stays-Head"} offset={-35}>
              {data && data.bookings && data.bookings.length ? (
                <button className="text-blue-500 hover:underline">
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
                      />
                      Stay added
                    </>
                  ) : (
                    <>+Add Stay</>
                  )}
                </button>
              ) : (
                <></>
              )}
            </Link>
          </div>
        </div>

        <div className="w-full flex flex-row items-center">
          <div className="lg:w-[11%] md:w-[21%]"></div>
          <div className="w-[1.25rem] md:w-[6%] lg:w-[6%] flex items-center">
            <FaBed className="text-black lg:text-[1.65rem] md:text-[1.65rem] text-[1.25rem]" />
          </div>
          <div className="text-base font-semibold leading-6 ml-2 lg:ml-0">
            {data.bookings &&
              data.bookings[0] &&
              getHotelName(data.bookings[0].id)}
          </div>
        </div>

        <div className="w-full flex items-center">
          <div className="w-[1.25rem] lg:w-[17%] md:w-[27%]"></div>
          <div className="font-normal text-xs leading-4 ml-2 lg:ml-0">
            {data.bookings &&
              data.bookings[0] &&
              getHotelCity(data.bookings[0].id)}
          </div>
        </div>
      </div>
    </Container>
  );
}
