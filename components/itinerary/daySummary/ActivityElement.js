import { useEffect, useState } from "react";
import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import POIDetailsDrawer from "../../drawers/poiDetails/POIDetailsDrawer";
import ImageLoader from "../../ImageLoader";
import { Link } from "react-scroll";
import { MdDoneAll } from "react-icons/md";
import { BiTimeFive } from "react-icons/bi";
import { IoTicket } from "react-icons/io5";
import { TransparentButton } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import media from "../../media";
import { TbSunset2 } from "react-icons/tb";

export default function ActivityElement(props) {
  const { data, booking, city_id } = props;
  const [showDrawer, setShowDrawer] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const isPageWide = media("(min-width: 768px)");

  useEffect(() => {
    if (
      booking &&
      booking.length &&
      data?.bookings?.length &&
      data?.bookings[0]?.id
    ) {
      for (let book of booking) {
        if (book.id === data.bookings[0].id) setSelectedBooking(book);
      }
    }
  }, [booking]);

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShowDrawer(false);
  };

  const handleActivity = (e) => {
    setShowDrawer(true);
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

  const getActivityImage = (id) => {
    if (booking && booking.length && id) {
      for (let book of booking) {
        if (book.id === id) return book.images[0].image;
      }
    }
    return "";
  };

  const getActivityCity = (id) => {
    if (booking && booking.length && id) {
      for (let book of booking) {
        if (book.id === id && book.user_selected) return book.city;
      }
    }
    return "";
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
      {/* <div className="flex flex-col space-y-0 items-start w-full">
        <div className="flex flex-row items-center w-full">
          <div className="lg:w-[11%] md:w-[21%]"></div>
          <div className=" flex items-center">
            {getActivityImage(data?.bookings[0]?.id) !==
              "media/icons/default/activity.svg" &&
            getActivityImage(data?.bookings[0]?.id) !== "" ? (
              <ImageLoader
                dimensions={{ width: 300, height: 300 }}
                dimensionsMobile={{ width: 300, height: 300 }}
                borderRadius="8px"
                hoverpointer
                onclick={handleActivity}
                width="3rem"
                height="3rem"
                leftalign
                widthmobile="3rem"
                url={getActivityImage(data?.bookings[0]?.id)}
                noLazy
              ></ImageLoader>
            ) : (
              <ImageLoader
                dimensions={{ width: 300, height: 300 }}
                dimensionsMobile={{ width: 300, height: 300 }}
                borderRadius="8px"
                hoverpointer
                onclick={handleActivity}
                width="3rem"
                height="3rem"
                leftalign
                widthmobile="3rem"
                url={"media/icons/general/dice.png"}
                noLazy
              ></ImageLoader>
            )}
          </div>

          <div className="flex flex-col ml-3">
            <div
              onClick={handleActivity}
              className="cursor-pointer hover:text-blue-500 text-base font-semibold leading-6 ml-2"
            >
              {data.heading}
            </div>
            <div className="font-normal text-xs leading-4 ml-2">
              {data.bookings &&
                data.bookings[0] &&
                getActivityCity(data.bookings[0].id)}
            </div>
          </div>

          {isPageWide ? (
            <div className="md:ml-4 lg:ml-4">
              <Link
                to={
                  getUserSelectedBookingId(data.bookings[0].id)
                    ? `${getUserSelectedBookingId(data.bookings[0].id)}`
                    : "Activities"
                }
                offset={-35}
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
                        Activity added
                      </TransparentButton>
                    ) : (
                      <TransparentButton>Add Activity</TransparentButton>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </Link>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-row items-center w-full">
          {!isPageWide ? (
            <div className="md:ml-4 lg:ml-4">
              <Link
                to={
                  getUserSelectedBookingId(data.bookings[0].id)
                    ? `${getUserSelectedBookingId(data.bookings[0].id)}`
                    : "Activities"
                }
                offset={-35}
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
                        Activity added
                      </TransparentButton>
                    ) : (
                      <TransparentButton>Add Activity</TransparentButton>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </Link>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div> */}

      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full flex flex-col space-y-2 md:space-y-0 lg:space-y-0 md:flex-row lg:flex-row items-start md:items-center lg:items-center">
          <div className="lg:w-[11%] md:w-[21%] flex flex-row justify-center">
            {data?.meta?.day_timing ? (
              <span className="font-normal text-sm text-gray-500">
                data.meta.day_timing
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
          <div className="font-medium text-sm">{data.heading}</div>
          {!isPageWide && (
            <div className="md:ml-3 lg:ml-3">
              <Link
                to={selectedBooking ? `${selectedBooking.id}` : "Activities"}
                offset={-95}
              >
                {data && data.bookings && data.bookings.length ? (
                  <>
                    {selectedBooking && selectedBooking.user_selected ? (
                      <TransparentButton>
                        <MdDoneAll
                          style={{
                            display: "inline",
                            marginRight: "0.35rem",
                          }}
                        />{" "}
                        Activity added
                      </TransparentButton>
                    ) : (
                      <TransparentButton>Add Activity</TransparentButton>
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
            {getActivityImage(data?.bookings[0]?.id) !==
              "media/icons/default/activity.svg" &&
            getActivityImage(data?.bookings[0]?.id) !== "" ? (
              <ImageLoader
                dimensions={{ width: 300, height: 300 }}
                dimensionsMobile={{ width: 300, height: 300 }}
                borderRadius="8px"
                hoverpointer
                onclick={handleActivity}
                width="3rem"
                height="3rem"
                leftalign
                widthmobile="3rem"
                url={getActivityImage(data?.bookings[0]?.id)}
                noLazy
              ></ImageLoader>
            ) : (
              <ImageLoader
                dimensions={{ width: 300, height: 300 }}
                dimensionsMobile={{ width: 300, height: 300 }}
                borderRadius="8px"
                hoverpointer
                onclick={handleActivity}
                width="3rem"
                height="3rem"
                leftalign
                widthmobile="3rem"
                url={"media/icons/general/dice.png"}
                noLazy
              ></ImageLoader>
            )}
          </div>
          <div className="flex flex-col ml-3">
            <div className="font-normal text-xs leading-4 ml-2">
              {selectedBooking && selectedBooking.city}
            </div>
            <div className="flex flex-row space-x-5 text-xs font-normal leading-4 ml-2">
              {selectedBooking?.ideal_duration_hours_text && (
                <div className="flex flex-row gap-1 items-center">
                  <BiTimeFive className="text-md font-[400] line-clamp-1 text-[#7A7A7A]" />
                  <div>
                    <div className="text-sm font-[400] line-clamp-1">
                      {selectedBooking.ideal_duration_hours_text}
                    </div>
                  </div>
                </div>
              )}

              {selectedBooking?.costings_breakdown?.no_of_tickets && (
                <div>
                  <div className="flex flex-row gap-2 items-center">
                    <IoTicket className="text-sm font-[400] line-clamp-1 text-[#7A7A7A]" />
                    <div className="text-sm font-[400] line-clamp-1">
                      {selectedBooking?.costings_breakdown?.no_of_tickets}{" "}
                      {selectedBooking?.costings_breakdown?.no_of_tickets <= "1"
                        ? "Ticket"
                        : "Tickets"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isPageWide && (
            <div className="md:ml-4 lg:ml-4">
              <Link
                to={selectedBooking ? `${selectedBooking.id}` : "Activities"}
                offset={-35}
              >
                {data && data.bookings && data.bookings.length ? (
                  <>
                    {selectedBooking.user_selected ? (
                      <TransparentButton>
                        <MdDoneAll
                          style={{
                            display: "inline",
                            marginRight: "0.35rem",
                          }}
                        />{" "}
                        Activity added
                      </TransparentButton>
                    ) : (
                      <TransparentButton>Add Activity</TransparentButton>
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

      <POIDetailsDrawer
        itineraryDrawer
        show={showDrawer}
        iconId={data?.activity_data?.id}
        ActivityiconId={data?.activity_data?.activity?.id}
        handleCloseDrawer={handleCloseDrawer}
        name={data.heading}
        image={data.icon !== undefined ? data.icon : null}
        text={data.text}
        Topheading={"Select Our Point Of Interest"}
      />
    </Container>
  );
}
