import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { FaHome, FaBed } from "react-icons/fa";
import { TbSunset2 } from "react-icons/tb";
import { Link } from "react-scroll";
import { MdDoneAll } from "react-icons/md";
import { TransparentButton } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { useState } from "react";
import media from "../../media";
import ImageLoader from "../../ImageLoader";

export default function AccommodationElement(props) {
  const { heading, data, meta, city_id, booking } = props;
  const [visible, setVisible] = useState(false);
  const isPageWide = media("(min-width: 768px)");

  const getHotelName = (id) => {
    if (booking && booking.length && id) {
      for (let book of booking) {
        if (book.id === id && book.user_selected) return book.name;
      }
    }
    return "Check-in to your stay";
  };

  const getHotelImage = (id) => {
    if (booking && booking.length && id) {
      for (let book of booking) {
        if (book.id === id) return book.images[0].image;
      }
    }
    return "";
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

  const getUserSelectedBookingId = (id) => {
    if (booking && booking.length && id) {
      for (let book of booking) {
        if (book.id === id) return book.id;
      }
    }
    return null;
  };

  const hoverFunction = () => {
    setVisible(true);
    console.log("Hovered!");
  };

  const outFunction = () => {
    setVisible(false);
    console.log("Mouse left!");
  };

  return (
    <Container className="pt-0">
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full flex flex-col space-y-2 md:space-y-0 lg:space-y-0 md:flex-row lg:flex-row items-start md:items-center lg:items-center">
          <div className="lg:w-[11%] md:w-[21%] flex flex-row justify-center">
            {meta?.day_timing ? (
              <span className="font-normal text-sm text-gray-500">
                meta.day_timing
              </span>
            ) : (
              <div className="flex items-center">
                <TbSunset2 className="text-2xl text-gray-500"></TbSunset2>
                {isPageWide ? null : (
                  <span
                    className={`${
                      visible ? "" : ""
                    } font-normal text-xs text-gray-500 ml-2`}
                  >
                    Afternoon
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="font-medium text-sm">{heading}</div>
          {!isPageWide && (
            <div className="md:ml-3 lg:ml-3">
              <Link
                to={
                  getUserSelectedBookingId(data.bookings[0].id)
                    ? `${getUserSelectedBookingId(data.bookings[0].id)}`
                    : "Stays-Head"
                }
                offset={-95}
              >
                {data && data.bookings && data.bookings.length ? (
                  <>
                    {getUserSelectedByBookings(data.bookings[0].id) ? (
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
          )}
        </div>

        <div className="w-full flex flex-row items-center">
          <div className="lg:w-[11%] md:w-[21%]"></div>
          <div className=" flex items-center">
            <ImageLoader
              dimensions={{ width: 300, height: 300 }}
              dimensionsMobile={{ width: 300, height: 300 }}
              borderRadius="8px"
              hoverpointer
              onclick={() => console.log("")}
              width="3rem"
              height="3rem"
              leftalign
              widthmobile="3rem"
              url={getHotelImage(props?.data?.bookings[0]?.id)}
              noLazy
            ></ImageLoader>
          </div>
          <div className="flex flex-col ml-3">
            <div className="text-base font-semibold leading-6 ml-2">
              {data.bookings &&
                data.bookings[0] &&
                getHotelName(data.bookings[0].id)}
            </div>
            <div className="font-normal text-xs leading-4 ml-2">
              {data.bookings &&
                data.bookings[0] &&
                getHotelCity(data.bookings[0].id)}
            </div>
          </div>

          {isPageWide && (
            <div className="md:ml-4 lg:ml-4">
              <Link
                to={
                  getUserSelectedBookingId(data.bookings[0].id)
                    ? `${getUserSelectedBookingId(data.bookings[0].id)}`
                    : "Stays-Head"
                }
                offset={-35}
              >
                {data && data.bookings && data.bookings.length ? (
                  <>
                    {getUserSelectedByBookings(props.data.bookings[0].id) ? (
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
          )}
        </div>
      </div>
    </Container>
  );
}
