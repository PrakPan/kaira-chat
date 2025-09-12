import { PiForkKnifeFill } from "react-icons/pi";
import { BsCalendar2, BsPeopleFill } from "react-icons/bs";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { getDate } from "../../../../helper/ConvertDateFormat";
import { getIndianPrice } from "../../../../services/getIndianPrice";
import { logEvent } from "../../../../services/ga/Index";
import ImageCarousel, { Carousel } from "../../Carousel/ImageCarousel";
import { FaLocationDot } from "react-icons/fa6";

const svgIcons = {
  "loaction": <svg xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 10 14" fill="none">
    <path d="M4.99968 13.6666C3.8219 13.6666 2.86079 13.4805 2.11634 13.1083C1.3719 12.736 0.999675 12.2555 0.999675 11.6666C0.999675 11.3999 1.08023 11.1527 1.24134 10.9249C1.40245 10.6971 1.62745 10.4999 1.91634 10.3333L2.96634 11.3166C2.86634 11.361 2.75801 11.411 2.64134 11.4666C2.52468 11.5221 2.43301 11.5888 2.36634 11.6666C2.51079 11.8444 2.84412 11.9999 3.36634 12.1333C3.88856 12.2666 4.43301 12.3333 4.99968 12.3333C5.56634 12.3333 6.11357 12.2666 6.64134 12.1333C7.16912 11.9999 7.50523 11.8444 7.64968 11.6666C7.5719 11.5777 7.4719 11.5055 7.34968 11.4499C7.22746 11.3944 7.11079 11.3444 6.99968 11.2999L8.03301 10.2999C8.34412 10.4777 8.58301 10.6805 8.74968 10.9083C8.91634 11.136 8.99968 11.3888 8.99968 11.6666C8.99968 12.2555 8.62746 12.736 7.88301 13.1083C7.13857 13.4805 6.17745 13.6666 4.99968 13.6666ZM5.01634 9.99992C6.11634 9.18881 6.94412 8.37492 7.49968 7.55825C8.05523 6.74158 8.33301 5.92214 8.33301 5.09992C8.33301 3.96659 7.9719 3.11103 7.24968 2.53325C6.52745 1.95547 5.77745 1.66659 4.99968 1.66659C4.2219 1.66659 3.4719 1.95547 2.74968 2.53325C2.02745 3.11103 1.66634 3.96659 1.66634 5.09992C1.66634 5.84436 1.93856 6.61936 2.48301 7.42492C3.02745 8.23047 3.8719 9.08881 5.01634 9.99992ZM4.99968 11.6666C3.43301 10.511 2.26356 9.38881 1.49134 8.29992C0.719119 7.21103 0.333008 6.14436 0.333008 5.09992C0.333008 4.31103 0.474675 3.61936 0.758008 3.02492C1.04134 2.43047 1.40523 1.93325 1.84968 1.53325C2.29412 1.13325 2.79412 0.833252 3.34968 0.633252C3.90523 0.433252 4.45523 0.333252 4.99968 0.333252C5.54412 0.333252 6.09412 0.433252 6.64968 0.633252C7.20523 0.833252 7.70523 1.13325 8.14968 1.53325C8.59412 1.93325 8.95801 2.43047 9.24134 3.02492C9.52468 3.61936 9.66634 4.31103 9.66634 5.09992C9.66634 6.14436 9.28023 7.21103 8.50801 8.29992C7.73579 9.38881 6.56634 10.511 4.99968 11.6666ZM4.99968 6.33325C5.36634 6.33325 5.68023 6.2027 5.94134 5.94159C6.20245 5.68047 6.33301 5.36658 6.33301 4.99992C6.33301 4.63325 6.20245 4.31936 5.94134 4.05825C5.68023 3.79714 5.36634 3.66658 4.99968 3.66658C4.63301 3.66658 4.31912 3.79714 4.05801 4.05825C3.7969 4.31936 3.66634 4.63325 3.66634 4.99992C3.66634 5.36658 3.7969 5.68047 4.05801 5.94159C4.31912 6.2027 4.63301 6.33325 4.99968 6.33325Z" fill="#ACACAC" />
  </svg>,
  "forkKnife": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4.5 8.17993L4.125 8.08228C3.62973 7.95376 3.24289 7.69825 2.94629 7.31177C2.64666 6.92116 2.50006 6.4894 2.5 6.00024V1.83325H2.83301V5.83325H4.5V1.83325H4.83301V5.83325H6.5V1.83325H6.83301V6.00024C6.83294 6.48947 6.68643 6.92112 6.38672 7.31177C6.09005 7.69833 5.70342 7.95379 5.20801 8.08228L4.83301 8.17993V14.1663H4.5V8.17993ZM11.167 7.9563L10.8252 7.84204C10.3606 7.68716 9.96663 7.36068 9.65039 6.80981C9.33149 6.25416 9.16699 5.6159 9.16699 4.88306C9.16703 3.98692 9.4016 3.25792 9.84863 2.66821C10.2952 2.07924 10.7855 1.83335 11.333 1.83325C11.879 1.83325 12.3699 2.08008 12.8174 2.67505C13.2656 3.27107 13.5 4.00364 13.5 4.89966C13.5 5.63238 13.3354 6.2666 13.0176 6.81567C12.7019 7.36102 12.308 7.68663 11.8418 7.84204L11.5 7.9563V14.1663H11.167V7.9563Z" stroke="#ACACAC" />
  </svg>,
  "calender": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3.33333 14.6666C2.96667 14.6666 2.65267 14.5361 2.39133 14.2753C2.13044 14.0139 2 13.6999 2 13.3333V3.99992C2 3.63325 2.13044 3.31947 2.39133 3.05859C2.65267 2.79725 2.96667 2.66659 3.33333 2.66659H4V1.33325H5.33333V2.66659H10.6667V1.33325H12V2.66659H12.6667C13.0333 2.66659 13.3473 2.79725 13.6087 3.05859C13.8696 3.31947 14 3.63325 14 3.99992V13.3333C14 13.6999 13.8696 14.0139 13.6087 14.2753C13.3473 14.5361 13.0333 14.6666 12.6667 14.6666H3.33333ZM3.33333 13.3333H12.6667V6.66659H3.33333V13.3333ZM3.33333 5.33325H12.6667V3.99992H3.33333V5.33325ZM3.33333 5.33325V3.99992V5.33325Z" fill="#ACACAC" />
  </svg>,
  "user": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
    <path d="M11.1133 6.75342C12.0266 7.37342 12.6666 8.21342 12.6666 9.33342V11.3334H15.3333V9.33342C15.3333 7.88008 12.9533 7.02008 11.1133 6.75342Z" fill="#ACACAC" />
    <path d="M9.99995 6.00008C11.4733 6.00008 12.6666 4.80675 12.6666 3.33341C12.6666 1.86008 11.4733 0.666748 9.99995 0.666748C9.68661 0.666748 9.39328 0.733415 9.11328 0.826748C9.66661 1.51341 9.99995 2.38675 9.99995 3.33341C9.99995 4.28008 9.66661 5.15341 9.11328 5.84008C9.39328 5.93341 9.68661 6.00008 9.99995 6.00008Z" fill="#ACACAC" />
    <path d="M6.00065 6.00008C7.47398 6.00008 8.66732 4.80675 8.66732 3.33341C8.66732 1.86008 7.47398 0.666748 6.00065 0.666748C4.52732 0.666748 3.33398 1.86008 3.33398 3.33341C3.33398 4.80675 4.52732 6.00008 6.00065 6.00008ZM6.00065 2.00008C6.73398 2.00008 7.33398 2.60008 7.33398 3.33341C7.33398 4.06675 6.73398 4.66675 6.00065 4.66675C5.26732 4.66675 4.66732 4.06675 4.66732 3.33341C4.66732 2.60008 5.26732 2.00008 6.00065 2.00008Z" fill="#ACACAC" />
    <path d="M6.00033 6.66675C4.22033 6.66675 0.666992 7.56008 0.666992 9.33341V11.3334H11.3337V9.33341C11.3337 7.56008 7.78032 6.66675 6.00033 6.66675ZM10.0003 10.0001H2.00033V9.34008C2.13366 8.86008 4.20033 8.00008 6.00033 8.00008C7.80032 8.00008 9.86699 8.86008 10.0003 9.33341V10.0001Z" fill="#ACACAC" />
  </svg>

}

export default function NewHotelBooking({
  currentBooking,
  booking,
  banner_image,
  openDetails,
  duration,
  num_adults,
  num_children,
  handleClick,
  key,
}) {

  const starRating = (rating) => {
    var stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<FaStar />);
    }
    if (Math.floor(rating) < rating) stars.push(<FaStarHalfAlt />);
    return stars;
  };

  const handleViewHotel = () => {
    // handleClick(key, booking.id, booking, booking.city_id);
    openDetails();

    logEvent({
      action: "Details_View",
      params: {
        page: "Itinerary Page",
        event_category: "Click",
        event_value: booking?.name,
        event_action: "Stays",
      },
    });
  };

  return (
    <div
      id={booking?.id}
      className={`flex gap-md pt-4 flex-col justify-start e-full`}
    >
      <div>
        {/* className="cursor-pointer relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA] hover:border-[#F7E700] shadow-[#ECEAEA] p-2 h-full w-full" */}

        <div className="rounded-3xl border-sm border-solid border-text-disabled p-md cursor-pointer hover:bg-text-smoothwhite">
          <div
            onClick={() => {
              handleViewHotel();
            }}
            className={`w-full h-full flex md:flex-row md:items-center flex-col gap-xl grayscale-0`}
          >
            <div
              className={`relative w-[260px] h-[12rem] `}
            >
              <ImageCarousel images={booking.images} noCaption={true} />


              {/* text-white bg-[#01202B] lg:px-4 px-3 lg:py-3 py-2 m-2 text-sm-md font-400 leading-md text-text-spacegreynsition-all shadow-slate-700/70 shadow-md hover:drop-shadow-xl absolute top-0 rounded-3xl */}
              {booking.star_category && booking.star_category != "0" ? (
                <div
                  starHotel
                  className={` bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md`}
                >
                  {booking.star_category} star hotel
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 text-[#01202B] lg:w-[70%] w-full justify-between">
              <div className="flex flex-col gap-sm">
                <div className="mb-0 flex flex-row justify-between">
                  <div className={`text-2xl font-semibold mb-0`}>
                    <p className="text-md-lg leading-xl-sm font-600 mb-0"> {booking?.name}</p>

                  </div>
                  <div>
                    {booking?.refundable && (
                      <p className=" bg-[#e6f9ec] text-[#3BAF75] px-2 py-2 mb-0 rounded-md text-xs font-medium">
                        Refundable
                      </p>
                    )}
                  </div>

                </div>

                {booking && (
                  <div className="flex flex-col gap-1">
                    {booking?.addr1 && (
                      <div className="text-sm-md  text-text-spacegrey font-[400] flex flex-row gap-2 items-center">
                          {svgIcons.loaction}
                        {booking?.addr1}
                        {booking?.addr2 && `, ${booking.addr2}`}
                      </div>
                    )}

                    {booking?.rating_ext > 0.0 ? (
                      <div className="gap-1 flex flex-row  items-center">
                        <div className="flex flex-row text-[#FFD201]">
                          {starRating(booking?.rating_ext)}
                        </div>
                        <div>{booking?.rating_ext}</div>
                        {booking?.num_reviews_ext && (
                          <div className="text-sm text-text-spacegrey font-[400] underline">
                            {booking?.num_reviews_ext} User reviews
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}

                {currentBooking && (
                  <div className="flex flex-row gap-3 lg:mt-2 mt-0">
                    {currentBooking?.check_in && (
                      <div className="flex flex-row gap-2 items-center">
                        {/* <BsCalendar2 className="text-sm text-text-spacegrey" /> */}
                        {svgIcons.calender}
                        <div>
                          <div className="text-sm-md font-400 leading-md text-text-spacegrey ">
                            {getDate(currentBooking?.check_in)} -  {getDate(currentBooking?.check_out)}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-sm-md font-400 leading-md text-text-spacegrey gap-2 flex flex-row items-center">
                      {/* <BsPeopleFill className="text-sm text-text-spacegrey" /> */}
                      {svgIcons.user}
                      <div className=" text-sm-md font-400 leading-md text-text-spacegrey min-w-fit">
                        {num_adults + num_children} {num_adults + num_children > 1 ? "Travellers" : "Traveller"}
                      </div>
                    </div>
                  </div>
                )}

                {booking?.free_breakfast ? (
                  <div className="flex flex-row gap-2 items-center lg:my-2 my-0">
                    {/* <PiForkKnifeFill className="text-lg text-text-spacegrey" /> */}
                    {svgIcons.forkKnife}
                    <div className="text-sm-md font-400 leading-md text-text-spacegrey">
                      Complimentary breakfast available
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-row gap-2 items-center lg:my-2 my-0">
                    {/* <PiForkKnifeFill className="text-lg text-text-spacegrey" /> */}
                    {svgIcons.forkKnife}
                    <div className="text-sm-md font-400 leading-md text-text-spacegrey">No Meals available</div>
                  </div>
                )}

                {booking?.distance_from_city_centre && <div className="text-sm-md font-400 leading-md text-text-spacegrey flex gap-2">
                  {/* <FaLocationDot className="text-lg text-text-spacegrey" /> */}
                  {svgIcons.loaction}
                  <>{booking?.distance_from_city_centre} kms from city centre</></div>}
              </div>

              {booking?.price && (
                <div>
                  <div className="flex flex-col md:flex-row gap-1 md:items-center w-full font-bold">
                    <div className="text-text-charcolblack text-lg font-700 leading-2xl-md">
                      <>₹{getIndianPrice(Math.ceil(booking.price))}</>
                    </div>
                    <div
                      className="text-text-spacegrey text-sm-md font-400 leading-lg mt-xxs"
                    >
                      <>for {currentBooking?.duration || duration} nights</>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="absolute right-md bottom-2xl">
              <button className="ttw-btn-secondary" onClick={() => handleViewHotel()}>View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}
