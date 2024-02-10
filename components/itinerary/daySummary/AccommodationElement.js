import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { TbSunset2 } from "react-icons/tb";
import { Link } from "react-scroll";
import { MdDoneAll } from "react-icons/md";
import { FaBed } from "react-icons/fa";
import { TransparentButton } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { useState, useEffect } from "react";
import media from "../../media";
import ImageLoader from "../../ImageLoader";
import AccommodationModal from "../../../components/modals/accommodation/Index";
import FullScreenGallery from "../../../components/fullscreengallery/Index";
import { isDateOlderThanCurrent } from "../../../helper/isDateOlderThanCurrent";

export default function AccommodationElement(props) {
  const { heading, data, meta, city_id, booking } = props;
  const [visible, setVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [images, setImages] = useState(null);
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

  const _setImagesHandler = (images) => {
    setImages(images);
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
        </div>

        <div className="w-full flex flex-row items-center">
          <div className="lg:w-[11%] md:w-[21%]"></div>
          <div
            className={`flex items-center justify-center w-[3rem] h-[3rem] ${
              !imageLoaded && "bg-gray-200 rounded-lg animate-pulse"
            }`}
          >
            <div className={`${imageLoaded ? "visible" : "invisible"}`}>
              {selectedBooking?.images[0]?.image !== "" && !imageFailed ? (
                <ImageLoader
                  dimensions={{ width: 300, height: 300 }}
                  dimensionsMobile={{ width: 300, height: 300 }}
                  borderRadius="8px"
                  hoverpointer
                  onclick={() => setShowDetails(true)}
                  width="3rem"
                  height="3rem"
                  leftalign
                  widthmobile="3rem"
                  url={selectedBooking?.images[0]?.image}
                  noLazy
                  onfail={handleImageFailed}
                  onload={() => {
                    setImageLoaded(true);
                  }}
                ></ImageLoader>
              ) : (
                <FaBed className="text-black lg:text-[1.65rem] md:text-[1.65rem] text-[1.25rem]" />
              )}
            </div>
          </div>
          <div className="flex flex-col ml-3">
            <div className="text-xs font-normal leading-4 ml-2">
              {selectedBooking && selectedBooking.name}
            </div>
            <div className="font-normal text-xs leading-4 ml-2">
              {selectedBooking &&
                selectedBooking.duration &&
                (selectedBooking.duration > 1
                  ? selectedBooking.duration + " Nights"
                  : selectedBooking.duration > 0
                  ? selectedBooking.duration + " Night"
                  : null)}
            </div>
          </div>

          <div className="ml-4">
            <Link
              to={selectedBooking ? `${selectedBooking.id}` : "Stays"}
              offset={-35}
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
      </div>

      <AccommodationModal
        _setImagesHandler={_setImagesHandler}
        onHide={() => setShowDetails(false)}
        id={
          selectedBooking
            ? selectedBooking.source === "Agoda"
              ? selectedBooking.agoda_accommodation
              : selectedBooking.accommodation
            : ""
        }
        currentBooking={selectedBooking}
        check_in={selectedBooking ? selectedBooking?.check_in : ""}
        check_out={selectedBooking ? selectedBooking?.check_out : ""}
        show={showDetails}
        payment={props.payment}
        plan={props.plan}
        BookingButton={
          !isDateOlderThanCurrent(props?.plan?.start_date) ? true : false
        }
        bookingFunData={{
          index: 0,
          booking: selectedBooking,
          city_id: city_id,
        }}
        BookingButtonFun={() => null}
      ></AccommodationModal>

      {images ? (
        <FullScreenGallery
          closeGalleryHandler={() => setImages(null)}
          images={images}
        ></FullScreenGallery>
      ) : null}
    </Container>
  );
}
