import React, { useState } from "react";
import ImageLoader from "../../../components/ImageLoader";
import { BsCalendar2, BsPeopleFill } from "react-icons/bs";
import { FaBed, FaClock, FaStar, FaStarHalfAlt } from "react-icons/fa";
import FullScreenGallery from "../../../components/fullscreengallery/Index";
import * as ga from "../../../services/ga/Index";
import ButtonYellow from "../../../components/ButtonYellow";
import { getDate } from "../../../helper/ConvertDateFormat";
import { connect } from "react-redux";
import { BiTimeFive } from "react-icons/bi";
import POIDetailsDrawer from "../../../components/drawers/poiDetails/POIDetailsDrawer";
import { IoTicket } from "react-icons/io5";

const ActivitiesBookings = (props) => {
  console.log("props are:", props);
  const [images, setImages] = useState(null);
  const [viewMoreDiscription, setViewMoreDiscription] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [activityData, setActivityData] = useState({
    id: "",
    type: "",
  });
  const handleView = async (poi, type) => {
    try {
      setShowDrawer(true);
      setActivityData(() => ({
        id: poi,
        type: type,
      }));
    } catch (error) {
      console.log("error is:", error);
    }
  };

  
  function Addons(Shorthand) {
    switch (Shorthand) {
      case "EP":
        return "Room Only";
      case "CP":
        return "Complementary Breakfast Included";
      case "MAP":
        return "Breakfast/Lunch Included";
      case "AP":
        return "All Meals Included";
      case "TBO":
        return null;
      default:
        return null;
    }
  }

  const starRating = (rating) => {
    var stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<FaStar />);
    }
    if (Math.floor(rating) < rating) stars.push(<FaStarHalfAlt />);
    return stars;
  };

  const handleMoreDiscription = (e) => {
    setViewMoreDiscription(e.currentTarget.id);
    // setShowMore(true);

    ga.logEvent({
      action: "Details_View",
      params: {
        page: "Itinerary Page",
        event_category: "Click",
        event_label: "View More Discription",
        event_action: "Activities",
      },
    });
  };

  const handleCloseDrawer = (e) => {
    setViewMoreDiscription();
    if (e) e.stopPropagation(e);
    setShowDrawer(false);
  };

  return (
<div id="activities" className="w-full lg:w-auto" style={{ width: "calc(54vw + 30px)" }}>
<div className="cursor-pointer font-lexend mb-2  mt-8 font-bold text-3xl group text-[#262626] transition duration-300 max-w-fit">
        Activities
        <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </div>
      {props.activityBookings
        ? props.activityBookings.map((booking, index) => (
            <div
              id={booking.id}
              key={index}
              className="flex gap-1 pt-4  flex-col justify-start"
            >
              <div className="font-bold lg:text-2xl text-xl pb-2 text-[#01202B]">
                {booking?.city}{" "}
              </div>
              <div
                id={index}
                onClick={handleMoreDiscription}
                className="cursor-pointer shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-4 p-3"
              >
                <div className="relative flex lg:flex-row w-full flex-col gap-4  grayscale-0 ">
                  <div className="relative lg:h-[15rem] lg:w-[30%] w-full h-[12rem]">
                    <ImageLoader
                      dimensions={{ width: 400, height: 400 }}
                      dimensionsMobile={{ width: 400, height: 400 }}
                      borderRadius="16px"
                      hoverpointer
                      onclick={() => console.log("")}
                      width="100%"
                      height="100%"
                      leftalign
                      widthmobile="100%"
                      url={
                        booking?.image ? booking.image : booking.activity?.image
                      }
                    ></ImageLoader>
                    {booking.star_category ? (
                      <div
                        className={`text-white bg-[#01202B] lg:px-3 px-2 lg:py-2 py-1 m-2 shadow-sm shadow-[#00000060] absolute top-0 rounded-2xl`}
                      >
                        {booking?.star_category} star hotel
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-4 text-[#01202B] lg:w-[70%]">
                    <div className="text-2xl font-semibold ">
                      {booking?.name}
                    </div>

                    <div className="flex flex-col gap-2 -mt-2">
                      <div className="text-sm font-normal">
                        {booking?.activity?.address}
                      </div>
                      {booking?.activity?.rating ? (
                        <div className="gap-1 flex flex-row  items-center">
                          <div className="flex flex-row text-[#FFD201]">
                            {starRating(booking?.activity?.rating)}
                          </div>
                          <div>{booking?.activity?.rating}</div>
                          {booking?.activity?.user_ratings_total && (
                            <div className="text-sm text-[#7A7A7A] font-medium underline">
                              {booking?.activity?.user_ratings_total} Reviews
                            </div>
                          )}
                        </div>
                      ) : null}

                      {booking?.points && booking?.points.length ? (
                        booking.points.map((data, i) => (
                          <div className="flex flex-col gap-0">
                            {data !== "" && (
                              <div className="flex flex-row gap-1 text-sm font-[400] line-clamp-1">
                                <div>{i + 1}. </div>
                                <div>{data}</div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="font-light">
                          {booking?.activity?.short_description.slice(0, 250)}
                          {booking?.activity?.short_description.length ? (
                            <button
                              id={index}
                              onClick={handleMoreDiscription}
                              className="font-semibold text-gray-500 ml-1"
                            >
                              {"...more"}
                            </button>
                          ) : null}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      {booking.check_in && (
                        <div className="flex flex-row gap-2 items-center">
                          <BsCalendar2 className="text-sm font-[400] line-clamp-1 text-[#7A7A7A]" />
                          <div>
                            <div className="text-sm font-[400] line-clamp-1">
                              {booking.check_in && getDate(booking.check_in)}
                              {booking.check_out &&
                                " - " + " " + getDate(booking.check_out)}
                            </div>
                          </div>
                        </div>
                      )}
                      {booking.activity?.ideal_duration_hours_text && (
                        <div className="flex flex-row gap-1 items-center">
                          <BiTimeFive className="text-md font-[400] line-clamp-1 text-[#7A7A7A]" />
                          <div>
                            <div className="text-sm font-[400] line-clamp-1">
                              {booking.ideal_duration_hours_text}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-1 items-center">
                        <IoTicket className="text-sm font-[400] line-clamp-1 text-[#7A7A7A]" />
                        <div className="text-sm">{booking?.pax} Tickets</div>
                      </div>
                      <div className="flex gap-1 items-center">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 13 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.32734 0.417969C3.01534 0.417969 0.333344 3.10597 0.333344 6.41797C0.333344 9.72997 3.01534 12.418 6.32734 12.418C9.64534 12.418 12.3333 9.72997 12.3333 6.41797C12.3333 3.10597 9.64534 0.417969 6.32734 0.417969ZM6.33334 11.218C3.68134 11.218 1.53334 9.06997 1.53334 6.41797C1.53334 3.76597 3.68134 1.61797 6.33334 1.61797C8.98534 1.61797 11.1333 3.76597 11.1333 6.41797C11.1333 9.06997 8.98534 11.218 6.33334 11.218ZM6.20134 3.41797H6.16534C5.92534 3.41797 5.73334 3.60997 5.73334 3.84997V6.68197C5.73334 6.89197 5.84134 7.08997 6.02734 7.19797L8.51734 8.69197C8.72134 8.81197 8.98534 8.75197 9.10534 8.54797C9.23134 8.34397 9.16534 8.07397 8.95534 7.95397L6.63334 6.57397V3.84997C6.63334 3.60997 6.44134 3.41797 6.20134 3.41797Z"
                            fill="black"
                          />
                        </svg>
                        <div className="text-sm">{booking?.duration}</div>
                      </div>
                    </div>

                    <div className="flex flex-row gap-3 items-center w-full justify-end">
                        <ButtonYellow className="lg:w-fit w-1/2" onClick={()=>handleView(booking?.id,"activity")}>
                          <div className="text-[#01202B] ">View Detail</div>
                        </ButtonYellow>
                    </div>
                    <POIDetailsDrawer
                      itineraryDrawer
                      show={showDrawer}
                      iconId={
                        null
                      }
                      handleCloseDrawer={handleCloseDrawer}
                      name={booking?.activity?.name}
                      image={booking?.image}
                      text={booking?.activity?.short_description}
                      Topheading={"Select Our Point Of Interest"}
                      activityData={activityData}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        : null}

      {images ? (
        <FullScreenGallery
          closeGalleryHandler={() => setImages(null)}
          images={images}
        ></FullScreenGallery>
      ) : null}
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
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
    emailfailmessage: state.auth.emailfailmessage,
    loginmessage: state.auth.loginmessage,
    hideloginclose: state.auth.hideloginclose,
  };
};

export default connect(mapStateToPros)(ActivitiesBookings);
