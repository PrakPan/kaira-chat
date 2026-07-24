import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FlightSegment } from "../../../containers/itinerary/TransfersContainer/FlightDetail";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { updateTransferBookings } from "../../../store/actions/transferBookingsStore";
import DrawerActionFooter from "../../revamp/common/components/DrawerActionFooter";
import BookingDetailHeader from "../../revamp/common/components/BookingDetailHeader";
import BookingDetailActions from "../../revamp/common/components/BookingDetailActions";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import Image from "next/image";
import { openNotification } from "../../../store/actions/notification";
import { Generalbuttonstyle } from "../../ui/button/Generallinkbutton";
import { TbArrowBack } from "react-icons/tb";
import { useAnalytics } from "../../../hooks/useAnalytics";
import LogoContainer from "../flights/new-flight-searched/LogoContainer";
import FlightDetails from "../flights/new-flight-searched/FlightDetails";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { convertMinutesToHours } from "../flights/new-flight-searched/Index";

const svgIcons = {
  'delete': <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none"><path d="M12.75 3.48827C10.8075 3.29577 8.85333 3.1966 6.905 3.1966C5.75 3.1966 4.595 3.25494 3.44 3.3716L2.25 3.48827" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.45801 2.89897L5.58634 2.13481C5.67967 1.58064 5.74967 1.16647 6.73551 1.16647H8.26384C9.24968 1.16647 9.32551 1.60397 9.41301 2.14064L9.54134 2.89897" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.4956 5.33183L11.1164 11.206C11.0522 12.1218 10.9997 12.8335 9.37224 12.8335H5.62724C3.99974 12.8335 3.94724 12.1218 3.88307 11.206L3.50391 5.33183" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.52539 9.625H8.46789" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.04199 7.29147H8.95866" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
}
const FloatingView = styled.div`
  position: sticky;
  bottom: 0;
  right: 0;
  background: black;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;
  margin-right: 16px;
  z-index: 2;
  cursor: pointer;
`;
export const Text = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const FlightDetailModal = ({
  segments,
  fareRule,
  setShowDetails,
  name,
  booking_id,
  originCityId,
  destinationCityId,
  drawer,
  onChange,
  isEmbedded,
  handleClose,
  getPaymentHandler,
  // setHandleShow,
  error,
  setShowLoginModal,
  handleEditRoute,
  data,
  drawerZIndex,
}) => {
  const router = useRouter();
  const fareRules = fareRule?.fareRuleDetail;
  const fareRulesLoading = false;
  const fareRUlesError = false;
  const [loading, setLoading] = useState(false);
  const { id } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  let isPageWide =
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px)")?.matches;
  const { trackTransferBookingDelete } = useAnalytics();


  const totalPax = data?.number_of_adults + data?.number_of_children + data?.number_of_infants

  const handleDelete = async () => {
    if (!localStorage.getItem("access_token")) {
      setShowLoginModal(true);
      return;
    }
    try {
      setLoading(true);
      const response = await axiosDeleteBooking.delete(
        `${router?.query?.id}/bookings/flight/${booking_id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 204) {
        dispatch(updateTransferBookings(booking_id));
        getPaymentHandler();
        trackTransferBookingDelete(router.query.id, booking_id, id);
        setLoading(false);
        dispatch(
          openNotification({
            type: "success",
            text: "Booking deleted Successfully",
            heading: "Success!",
          })
        );
        handleClose()
        const bodyStyle = window.getComputedStyle(document.body).overflow;
        if (bodyStyle === "hidden") {
          document.body.style.overflow = "initial";
        }

      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.transfer_details?.items?.[0]?.errors?.[0]?.message?.[0] || err.message;
      dispatch(
        openNotification({
          type: "error",
          text: errorMsg,
          heading: "Error!",
        })
      );
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          margin: "auto",
          height: isPageWide ? "80vh" : "70vh",
        }}
        className="center-div"
      >
        Oops, unable to get the details at the moment.
      </div>
    );
  }

  return (
    <div
      // pt-2 only (not py-2): the standalone drawer pins a fixed action footer
      // over the bottom of the scroll pane, so the bottom padding has to be the
      // footer's clearance — a competing py-2 padding-bottom would shrink it and
      // leave the last fare-rule lines hidden behind the bar.
      className={`relative flex flex-col gap-4 rounded-md px-3 pt-2 ${
        !isEmbedded ? "pb-[104px]" : "pb-2"
      }`}
    >
      {!isEmbedded && (
        <BookingDetailHeader
          title={drawer ? null : name}
          onBack={handleClose}
          className="-mx-3 px-3"
        />
      )}


      <div className="flex flex-row gap-2 justify-between md:items-start items-center mt-2 p-2">
                    <div className="flex flex-row items-center gap-3">
                      <div
                        className="rounded-full overflow-hidden flex-shrink-0"
                        style={{
                          width: isPageWide ? "48px" : "40px",
                          height: isPageWide ? "48px" : "40px",
                        }}
                      >
                       
                        <LogoContainer
                          data={
                            data?.transfer_details?.items?.[0] || segments
                          }
                          width={isPageWide ? 48 : 40}
                          height={isPageWide ? 48 : 40}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-sm md:text-md font-semibold flex items-center gap-2 flex-wrap text-[#0b1220]">
                          {segments?.[0]?.airline?.name ||
                            segments?.[0]?.airline?.name}
                          {(
                            data?.transfer_details?.items?.[0]?.transfer_details?.items?.[0]?.is_refundable) && (
                            <span className="bg-[#e7f5ee] text-[#1f8a5a]  px-2.5 py-0.5 rounded text-[12px] font-medium">
                              Refundable
                            </span>
                          )}
                        </div>
                        <div className="text-xs md:text-sm text-[#445069]">
                          {segments?.[0]?.airline?.code ||
                            segments?.[0]?.airline?.code}
                          -
                          {segments?.[0]?.airline?.flight_number ||
                            segments?.[0]?.airline?.flight_number}
                        </div>
                      </div>
                    </div>
                    {(
                      <div className="text-right">
                        {/* <div className="text-md md:text-md font-bold">
                          {data?.transfer_details?.price_details?.total_amount
                            ? `₹${getIndianPrice(
                                data?.transfer_details?.price_details?.total_amount
                              )}`
                            : null}
                        </div> */}
                        <div className="text-xs md:text-base text-[#8a93a6]">For {totalPax} people</div>
                      </div>
                    )}
                  </div>
      
                  <div className="flex flex-row w-full justify-between items-center p-2">
                    <FlightDetails
                      data={data?.transfer_details?.items?.[0]}
                      origin={
                        segments?.[0]?.origin ||
                        segments[0]?.origin
                      }
                      destination={
                        segments?.[
                          segments?.length - 1
                        ]?.destination ||
                        segments[segments?.length - 1]
                          ?.destination
                      }
                      duration={
                        typeof (
                          data?.transfer_details?.items?.[0]?.segments?.[segments?.length - 1]?.accumulated_duration ||
                          data?.transfer_details?.items?.[0]?.segments?.[0]?.duration
                        ) == "number"
                          ? convertMinutesToHours(
                              data?.transfer_details?.items?.[0]?.segments?.[segments?.length - 1]?.accumulated_duration ||
                                data?.transfer_details?.items?.[0]?.segments?.[0]?.duration
                            )
                          : data?.transfer_details?.items?.[0]?.segments?.[segments?.length - 1]?.accumulated_duration ||
                            data?.transfer_details?.items?.[0]?.segments?.[0]?.duration
                      }
                      isNonStop={
                        (segments?.length ||
                          segments?.length) === 1
                      }
                      numStops={
                        (segments?.length ||
                          segments?.length) - 1
                      }
                      segments={segments}
                      setShowDetails={setShowDetails}
                    />
                  </div>
      <div className="flex flex-col gap-2 p-2">
        <FlightSegment
          segments={segments}
          originCityId={originCityId}
          destinationCityId={destinationCityId}
          combo={isEmbedded}
        />
      </div>

      {fareRulesLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-4 border-t-[#F8E000] rounded-full animate-spin"></div>
        </div>
      ) : fareRUlesError ? (
        <div className="text-sm text-center">
          Something went wrong, please try again
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="text-sm-xl font-400 leading-xl gl-dynamic-render-elements">
            <h6 className="section-heading">
              Fare Details and Rules
            </h6>


            <div
              dangerouslySetInnerHTML={{
                __html: fareRules,
              }}
              className="section-content pl-lg"
            ></div>
          </div>
        </div>
      )}

      {!isEmbedded && (
        <DrawerActionFooter zIndex={drawerZIndex ? drawerZIndex + 1 : 1502}>
          <BookingDetailActions
            onDelete={handleDelete}
            deleting={loading}
            onChange={
              !drawer && typeof handleEditRoute === "function"
                ? () => handleEditRoute()
                : undefined
            }
            changeLabel="Change Transfer"
            changeDisabled={loading}
          />
        </DrawerActionFooter>
      )}

      <ToastContainer />
    </div>
  );
};

export default FlightDetailModal;