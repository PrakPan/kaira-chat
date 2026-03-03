import { connect, useSelector } from "react-redux";
import HotelBooking from "./HotelBooking";
import React, { useState } from "react";
import media from "../../../components/media";
import SkeletonCard from "../../../components/ui/SkeletonCard";

const StaysContainer = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const { hotels_status } = useSelector((state) => state.ItineraryStatus);
  return (
    <div id="stays" className="mt-5">
      <div
        id="staysBooking"
        className="text-xl font-bold cursor-pointer group transition duration-300 max-w-fit md:min-w-[51vw]"
      >
        Stays
        <span className="mt-1 block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </div>

      <div className="mt-4 space-y-6">
        {hotels_status === "SUCCESS" ? (
          props?.stayBookings?.map((booking, index) => (
            <>
              <HotelBooking
                key={booking?.id}
                _setImagesHandler={props?._setImagesHandler}
                index={index}
                booking={booking}
                payment={props.payment}
                setShowLoginModal={props.setShowLoginModal}
                plan={props.stayBookings}
                setStayBookings={props.setStayBookings}
                cities={props?.cities}
                stayBookings={props.stayBookings}
                getPaymentHandler={props.getPaymentHandler}
                _updateStayBookingHandler={props._updateStayBookingHandler}
                _updatePaymentHandler={props._updatePaymentHandler}
                _updateBookingHandler={props._updateBookingHandler}
                showBookingModal={props.showBookingModal}
                setHideBookingModal={props.setHideBookingModal}
                _GetInTouch={props._GetInTouch}
                CityData={props?.CityData}
                start_date={props?.plan?.start_date}
                itinerary_city_id={booking?.itinerary_city_id}
                requireAuth={props?.requireAuth}
              />
            </>
          ))
        ) : (
          <>
            <div className={`${!isPageWide ? "w-full" : "max-w-[47vw]"}`}>
              {hotels_status === "PENDING" && (
                <div>
                  <div className="pb-2">
                    <SkeletonCard width="150px" height="25px" borderRadius="8px" variant="default" />
                  </div>
                  <div className="rounded-3xl border-sm border-solid border-text-disabled p-md  ">
                    <div className="relative flex lg:flex-row w-full flex-col gap-4">
                      <div>
                        <SkeletonCard width="205px" height="192px" borderRadius="16px" variant="default" />
                      </div>
                      <div className="flex flex-col gap-2 text-[#01202B] lg:w-[70%] w-full justify-between">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-row justify-between items-center">
                            <SkeletonCard width="200px" height="20px" borderRadius="8px" variant="default" />
                          </div>

                          <div className="flex flex-col gap-1">
                            <div className="flex flex-row gap-2 items-center">
                              <SkeletonCard width="16px" height="16px" borderRadius="50%" variant="default" />
                              <SkeletonCard width="100px" height="16px" borderRadius="8px" variant="default" />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <div className="flex flex-row gap-2 items-center">
                              <SkeletonCard width="16px" height="16px" borderRadius="50%" variant="default" />
                              <SkeletonCard width="200px" height="16px" borderRadius="8px" variant="default" />
                              <SkeletonCard width="80px" height="16px" borderRadius="8px" variant="default" />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <div className="flex flex-row gap-2 items-center">
                              <SkeletonCard width="16px" height="16px" borderRadius="50%" variant="default" />
                              <SkeletonCard width="250px" height="16px" borderRadius="8px" variant="default" />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <div className="flex flex-row gap-2 items-center">
                              <SkeletonCard width="16px" height="16px" borderRadius="50%" variant="default" />
                              <SkeletonCard width="180px" height="16px" borderRadius="8px" variant="default" />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row gap-2 items-end justify-end w-full">
                          <SkeletonCard width="90px" height="40px" borderRadius="8px" variant="default" />
                          <SkeletonCard width="90px" height="40px" borderRadius="8px" variant="default" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    name: state.auth.name,
    emailFail: state.auth.emailFail,
    token: state.auth.token,
    phone: state.auth.phone,
    email: state.auth.email,
    plan: state.Plan,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
    emailfailmessage: state.auth.emailfailmessage,
    loginmessage: state.auth.loginmessage,
    hideloginclose: state.auth.hideloginclose,
  };
};

export default connect(mapStateToPros)(StaysContainer);
