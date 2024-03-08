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
import { logEvent } from "../../../services/ga/Index";

export default function ActivityElement(props) {
  const { data, booking, city_id } = props;
  const [showDrawer, setShowDrawer] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
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

  const handleImageFailed = () => {
    setImageFailed(true);
    setImageLoaded(true);
  };

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShowDrawer(false);
  };

  const handleActivity = (e) => {
    setShowDrawer(true);
    logEvent({
      action: "Details_View",
      params: {
        page: "Itinerary Page",
        event_category: "Click",
        event_value: data?.heading,
        event_action: "Day by Day Itinerary",
      },
    });
  };

  const handleActivityButtonClick = () => {
    logEvent({
      action: "Details_View",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: `${
          selectedBooking?.user_selected ? "Activity Added" : "Add Activity"
        }`,
        event_value: data?.heading,
        event_action: "Day by Day Itinerary",
      },
    });
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
      <div className="flex flex-col items-center justify-center w-full space-y-1">
        <div className="w-full flex flex-col space-y-2 md:space-y-0 lg:space-y-0 md:flex-row lg:flex-row items-start md:items-center lg:items-center">
          <div className="lg:w-[11%] md:w-[21%] flex flex-row justify-center"></div>
          <div className="font-medium text-sm">{data.heading}</div>
        </div>

        <div className="w-full flex flex-col lg:flex-row md:flex-row items-start">
          <div className="lg:w-[11%] md:w-[21%]"></div>
          <div className="flex flex-row items-center">
            <div
              className={`flex items-center justify-center w-[4rem] h-[4rem] ${
                !imageLoaded && "bg-gray-200 rounded-lg animate-pulse"
              }`}
            >
              {selectedBooking?.images[0]?.image !==
                "media/icons/default/activity.svg" && (
                <div className={`${imageLoaded ? "visible" : "invisible"}`}>
                  <ImageLoader
                    dimensions={{ width: 300, height: 300 }}
                    dimensionsMobile={{ width: 300, height: 300 }}
                    borderRadius="8px"
                    hoverpointer
                    onclick={handleActivity}
                    width="4rem"
                    height="4rem"
                    leftalign
                    widthmobile="4rem"
                    url={
                      !imageFailed
                        ? selectedBooking?.images[0]?.image
                        : "media/icons/general/dice.png"
                    }
                    noLazy
                    onfail={handleImageFailed}
                    onload={() => {
                      setImageLoaded(true);
                    }}
                  ></ImageLoader>
                </div>
              )}
            </div>
            <div className="flex flex-col ml-3">
              <div className="font-normal text-xs leading-4 ml-2">
                {selectedBooking?.ideal_duration_hours_text && (
                  <div className="flex flex-row gap-1 items-center">
                    <BiTimeFive className="text-md font-[400] line-clamp-1 text-[#7A7A7A]" />
                    <div>
                      <div className="text-xs font-normal leading-4 line-clamp-1">
                        {selectedBooking.ideal_duration_hours_text}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-row space-x-5 text-xs font-normal leading-4 ml-2">
                {selectedBooking?.costings_breakdown?.no_of_tickets && (
                  <div>
                    <div className="flex flex-row gap-1 items-center">
                      <IoTicket className="text-sm font-[400] line-clamp-1 text-[#7A7A7A]" />
                      <div className="text-xs font-normal leading-4 line-clamp-1">
                        {selectedBooking?.costings_breakdown?.no_of_tickets}{" "}
                        {selectedBooking?.costings_breakdown?.no_of_tickets <=
                        "1"
                          ? "Ticket"
                          : "Tickets"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:ml-4 md:ml-4">
            <Link
              to={selectedBooking ? `${selectedBooking.id}` : "Activities"}
              offset={-35}
              onClick={handleActivityButtonClick}
            >
              {selectedBooking ? (
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
