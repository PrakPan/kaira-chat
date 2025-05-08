import { connect, useSelector } from "react-redux";
import HotelBooking from "./HotelBooking";
import React, { useState } from "react";
import media from "../../../components/media";

const StaysContainer = (props) => {
  let isPageWide = media("(min-width: 768px)");

  // console.log("CITTT",props?.cities)
  const { hotels_status } = useSelector((state) => state.ItineraryStatus);
  return (
    <div id="stays" className="mt-16">
      <div
        id="staysBooking"
        className="text-[#262626] text-3xl font-bold cursor-pointer group transition duration-300 max-w-fit"
      >
        Stays
        <span className="mt-1 block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </div>

      <div className="mt-4 space-y-6">
        {hotels_status === "SUCCESS" ? (
          props.stayBookings.map((booking, index) => (
            <>
              <HotelBooking
                key={booking?.id}
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
                setShowBookingModal={props?.setShowBookingModal}
              />
            </>
          ))
        ) : (
          <>
            <div className={`${!isPageWide ? "max-w-fit" : "max-w-[54vw]"}`}>
              {hotels_status === "PENDING" && (
                <div className="animate-pulse">
                  <div className="font-bold lg:text-2xl text-xl pb-2 text-[#01202B]">
                    <div className="bg-gray-300 h-6 w-1/2 mb-2"></div>
                    <span className="ml-1 bg-gray-200 h-4 w-12 inline-block"></span>
                  </div>

                  <div className="relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA] hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-4 p-3">
                    <div className="relative flex lg:flex-row w-full flex-col gap-4">
                      <div className="relative lg:h-[12rem] lg:w-[30%] w-full h-[12rem]">
                        <div className="h-full w-full bg-gray-300 rounded-2xl"></div>
                      </div>

                      <div className="flex flex-col gap-2 text-[#01202B] lg:w-[70%] w-full justify-between">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-row justify-between items-center">
                            <div className="bg-gray-300 h-6 w-2/3"></div>
                            <div className="bg-gray-300 h-4 w-16"></div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <div className="bg-gray-300 h-4 w-32 mb-1"></div>
                            <div className="flex flex-row gap-2 items-center">
                              <div className="bg-gray-300 h-5 w-1/2"></div>
                              <div className="bg-gray-300 h-3 w-16"></div>
                            </div>
                          </div>

                          <div className="flex flex-row gap-2 items-center my-0">
                            <div className="bg-gray-300 h-3 w-20"></div>
                          </div>

                          <div className="flex flex-row gap-2 items-center lg:my-2 my-0">
                            <div className="bg-gray-300 h-3 w-24"></div>
                          </div>
                        </div>

                        <div className="flex flex-row gap-2 items-end justify-end w-full">
                          <div className="bg-gray-300 h-8 w-24 rounded"></div>
                          <div className="bg-gray-300 h-8 w-24 rounded"></div>
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
