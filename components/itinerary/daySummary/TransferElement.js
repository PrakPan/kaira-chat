import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { TransportIconFetcher } from "../../../helper/TransportIconFetcher";
import { Link } from "react-scroll";
import { MdDoneAll } from "react-icons/md";
import { WiSunrise } from "react-icons/wi";
import { TransparentButton } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import media from "../../media";
import { useState, useEffect } from "react";
import ImageLoader from "../../ImageLoader";
import { logEvent } from "../../../services/ga/Index";

export default function TransferElement(props) {
  const { modes, heading, meta, booking, data } = props;
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

  const handleImageError = () => {
    setImageFailed(true);
    setImageLoaded(true);
  };

  const isOriginDestination = () => {
    if (selectedBooking) {
      const origin = selectedBooking?.city;
      const destination = selectedBooking?.destination?.shortName;
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

  const handleTransferButtonClick = () => {
    logEvent({
      action: "Details View",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: `${
          selectedBooking?.user_selected ? modes + " added" : "Add " + modes
        }`,
        event_value: heading,
        event_action: "Day by Day Itinerary",
      },
    });
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

        <div className="w-full flex flex-col lg:flex-row md:flex-row items-start">
          <div className="lg:w-[11%] md:w-[21%]"></div>
          <div className="flex flex-row items-center">
            <div
              className={`flex items-center justify-center w-[4rem] h-[4rem] ${
                !imageLoaded && "bg-gray-200 rounded-lg animate-pulse"
              }`}
            >
              <div className={`${imageLoaded ? "visible" : "invisible"}`}>
                {selectedBooking &&
                selectedBooking?.images?.image !== "" &&
                !imageFailed ? (
                  <ImageLoader
                    is_url={selectedBooking?.images?.image.includes("gozo")}
                    dimensions={{ width: 300, height: 300 }}
                    dimensionsMobile={{ width: 300, height: 300 }}
                    borderRadius="8px"
                    hoverpointer
                    width="4rem"
                    height="4rem"
                    leftalign
                    widthmobile="4rem"
                    url={selectedBooking?.images?.image}
                    noLazy
                    onfail={handleImageError}
                    onload={() => {
                      setImageLoaded(true);
                    }}
                  ></ImageLoader>
                ) : modes ? (
                  <TransportIconFetcher
                    TransportMode={modes}
                    classname="text-black text-[3rem]"
                  />
                ) : (
                  <div className=""></div>
                )}
              </div>
            </div>

            <div className="flex flex-col ml-3">
              <div className="text-xs leading-7 ml-2">
                {isOriginDestination()
                  ? selectedBooking.city +
                    " - " +
                    selectedBooking.destination.shortName
                  : ""}
              </div>

              <div className="font-normal text-xs leading-4 ml-2">
                {getFlightDuration() ? (
                  `Duration:  ${getFlightDuration()}`
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>

          <div className="lg:ml-4 md:ml-4">
            {selectedBooking ? (
              <Link
                to={
                  data.bookings && data.bookings[0] && data.bookings[0].id
                    ? `${data.bookings[0].id}`
                    : "Transfer_Container"
                }
                offset={-90}
                onClick={handleTransferButtonClick}
              >
                <TransparentButton>
                  {selectedBooking && selectedBooking.user_selected ? (
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
      </div>
    </Container>
  );
}
